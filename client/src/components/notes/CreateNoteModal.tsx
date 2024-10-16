import React, { useState } from 'react';
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
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [column, setColumn] = useState('To Do');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState('3');
  const { t } = useTranslation();
  const { createNote, isLoading, isError, error } = useCreateNote();

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const newNote = {
        title: sanitizeInput(title),
        content: sanitizeInput(content),
        column,
        tags: tags.split(',').map(tag => tag.trim()),
        dueDate: dueDate,
        priority: parseInt(priority),
      };
      createNote(newNote, {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setColumn('To Do');
          setTags('');
          setDueDate(undefined);
          setPriority('3');
          toast.success('Note created successfully');
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('createNoteModal.title')}</DialogTitle>
          <DialogDescription>
            {t('createNoteModal.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                {t('createNoteModal.titleLabel')}
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
              <Select onValueChange={setColumn} defaultValue={column}>
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
                {t('createNoteModal.priorityLabel')}
              </Label>
              <Select onValueChange={setPriority} defaultValue={priority}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('createNoteModal.selectPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('createNoteModal.lowestPriority')}</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">{t('createNoteModal.mediumPriority')}</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">{t('createNoteModal.highestPriority')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isError && (
            <p className="text-sm text-red-500 mt-2">
              {t('common.error')}: {error?.message || t('createNoteModal.failedToCreate')}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={!title.trim() || !content.trim() || isLoading}>
              {isLoading ? t('common.creating') : t('createNoteModal.createButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
