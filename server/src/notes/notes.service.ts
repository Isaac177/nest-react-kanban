import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { CreateNoteDto, UpdateNoteDto, MoveNoteDto } from './dto/note.dto';
import { MongoServerError } from 'mongodb';


@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const lastNote = await this.noteModel
      .findOne({ user: userId, column: createNoteDto.column })
      .sort('-order')
      .exec();
    const order = lastNote ? lastNote.order + 1 : 0;

    const newNote = new this.noteModel({
      ...createNoteDto,
      user: userId,
      order,
    });
    return newNote.save();
  }

  async findAll(userId: string): Promise<Note[]> {
    return this.noteModel
      .find({ user: userId, isArchived: false })
      .sort({ column: 1, order: 1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findOne({ _id: id, user: userId }).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    const note = await this.noteModel
      .findOneAndUpdate({ _id: id, user: userId }, updateNoteDto, { new: true })
      .exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.noteModel
      .deleteOne({ _id: id, user: userId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Note not found');
    }
  }

  async moveNote(
    id: string,
    moveNoteDto: MoveNoteDto,
    userId: string,
  ): Promise<Note> {
    const maxRetries = 5;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      const session = await this.noteModel.db.startSession();
      session.startTransaction();

      try {
        const note = await this.noteModel
          .findOne({ _id: id, user: userId })
          .session(session);
        if (!note) {
          throw new NotFoundException('Note not found');
        }

        const oldColumn = note.column;
        const newColumn = moveNoteDto.column;

        if (oldColumn !== newColumn) {
          await this.noteModel
            .updateMany(
              { user: userId, column: oldColumn, order: { $gt: note.order } },
              { $inc: { order: -1 } },
            )
            .session(session);

          const lastNoteInNewColumn = await this.noteModel
            .findOne({ user: userId, column: newColumn })
            .sort('-order')
            .session(session);

          const newOrder = lastNoteInNewColumn ? lastNoteInNewColumn.order + 1 : 0;

          note.column = newColumn;
          note.order = newOrder;
        } else {
          const minOrder = Math.min(note.order, moveNoteDto.order);
          const maxOrder = Math.max(note.order, moveNoteDto.order);

          if (note.order > moveNoteDto.order) {
            await this.noteModel
              .updateMany(
                {
                  user: userId,
                  column: newColumn,
                  order: { $gte: moveNoteDto.order, $lt: note.order },
                },
                { $inc: { order: 1 } },
              )
              .session(session);
          } else if (note.order < moveNoteDto.order) {
            await this.noteModel
              .updateMany(
                {
                  user: userId,
                  column: newColumn,
                  order: { $gt: note.order, $lte: moveNoteDto.order },
                },
                { $inc: { order: -1 } },
              )
              .session(session);
          }

          note.order = moveNoteDto.order;
        }

        await note.save({ session });

        await session.commitTransaction();
        session.endSession();
        return note;
      } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (
          error instanceof MongoServerError &&
          error.hasErrorLabel('TransientTransactionError')
        ) {
          retryCount++;
          console.warn(
            `TransientTransactionError encountered. Retry attempt ${retryCount}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 100 * retryCount));
          continue;
        } else {
          throw error;
        }
      }
    }

    throw new Error('Transaction failed after maximum retries');
  }

  async archiveNote(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        { isArchived: true },
        { new: true },
      )
      .exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async getArchivedNotes(userId: string): Promise<Note[]> {
    return this.noteModel
      .find({ user: userId, isArchived: true })
      .sort({ updatedAt: -1 })
      .exec();
  }
}
