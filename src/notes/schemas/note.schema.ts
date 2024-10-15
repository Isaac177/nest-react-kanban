// src/notes/schemas/note.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type NoteDocument = Note & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Note {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ required: true, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' })
  column: string;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop([String])
  tags: string[];

  @Prop()
  dueDate: Date;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo: User | Types.ObjectId;

  @Prop({ min: 1, max: 5 })
  priority: number;

  id: string; // This will be populated by the virtual
}

export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Index for efficient querying by user and column
NoteSchema.index({ user: 1, column: 1, order: 1 });
