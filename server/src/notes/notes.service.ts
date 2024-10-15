import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { CreateNoteDto, UpdateNoteDto, MoveNoteDto } from './dto/note.dto';

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
    const session = await this.noteModel.db.startSession();
    session.startTransaction();

    try {
      const note = await this.noteModel
        .findOne({ _id: id, user: userId })
        .session(session);
      if (!note) {
        throw new NotFoundException('Note not found');
      }

      await this.noteModel
        .updateMany(
          { user: userId, column: note.column, order: { $gt: note.order } },
          { $inc: { order: -1 } },
        )
        .session(session);

      await this.noteModel
        .updateMany(
          {
            user: userId,
            column: moveNoteDto.column,
            order: { $gte: moveNoteDto.order },
          },
          { $inc: { order: 1 } },
        )
        .session(session);

      note.column = moveNoteDto.column;
      note.order = moveNoteDto.order;
      await note.save({ session });

      await session.commitTransaction();
      return note;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
