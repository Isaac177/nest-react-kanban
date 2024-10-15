// components/NoteModal.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DOMPurify from 'dompurify';
import { useCreateNote } from "../../hooks/useCreateNote";
import { useUpdateNote } from "../../hooks/useUpdateNote";
import toast from "react-hot-toast";
import { Note } from "../../types/note";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, note }) => {
  const isEditMode = Boolean(note);

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [column, setColumn] = useState<Note['column']>(note?.column || 'To Do');
  const [tags, setTags] = useState(note?.tags?.join(', ') || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    note?.dueDate ? new Date(note.dueDate) : undefined
  );
  const [priority, setPriority] = useState(note?.priority.toString() || '3');

  const { createNote, isLoading: isCreating, isError: isCreateError, error: createError } = useCreateNote();
  const { updateNote, isLoading: isUpdating, isError: isUpdateError, error: updateError } = useUpdateNote();

  const isLoading = isCreating || isUpdating;
  const isError = isCreateError || isUpdateError;
  const error = createError || updateError;

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const noteData = {
        title: sanitizeInput(title),
        content: sanitizeInput(content),
        column,
        tags: tags.split(',').map(tag => tag.trim()),
        dueDate: dueDate || undefined,
        priority: parseInt(priority),
      };
      if (isEditMode && note) {
        updateNote(
          { id: note.id, data: noteData },
          {
            onSuccess: () => {
              toast.success('Note updated successfully');
              onClose();
            },
          }
        );
      } else {
        createNote(noteData, {
          onSuccess: () => {
            toast.success('Note created successfully');
            onClose();
          },
        });
      }
    }
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColumn(note.column);
      setTags(note.tags?.join(', ') || '');
      setDueDate(note.dueDate ? new Date(note.dueDate) : undefined);
      setPriority(note.priority.toString());
    }
  }, [note]);

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the details of your note below.'
              : 'Enter the details for your new note below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="column" className="text-right">
                Column
              </Label>
              <Select onValueChange={(value) => setColumn(value as Note['column'])} value={column}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="col-span-3"
                placeholder="Comma-separated tags"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`col-span-3 ${!dueDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select onValueChange={setPriority} value={priority}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Lowest)</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3 (Medium)</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5 (Highest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isError && (
            <p className="text-sm text-red-500 mt-2">
              Error: {error?.message || 'Failed to save note'}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={!title.trim() || !content.trim() || isLoading}>
              {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Note' : 'Create Note')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
