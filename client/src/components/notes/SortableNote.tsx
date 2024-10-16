import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Note } from "../../types/note";
import { MoreVertical, Edit3, Trash2, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditNoteModal from './EditNoteModal';
import DeleteNoteModal from './DeleteNoteModal';

interface SortableNoteProps {
  note: Note;
}

export const SortableNote: React.FC<SortableNoteProps> = ({ note }) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="cursor-default relative"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <button
              {...listeners}
              className="p-1 mr-2 text-muted-foreground hover:text-foreground cursor-move"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <CardTitle className="text-sm m-0">{note.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                {t('sortableNote.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-red-500">{t('sortableNote.delete')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          <p className="text-xs text-muted-foreground">{note.content}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags?.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {isEditModalOpen && (
        <EditNoteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          note={note}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteNoteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          noteId={note.id}
        />
      )}
    </>
  );
};
