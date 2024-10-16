import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SortableNote } from './SortableNote';
import { Note } from "../../types/note.ts";


interface ColumnProps {
  id: Note['column'];
  title: string;
  notes: Note[];
}

export const Column: React.FC<ColumnProps> = ({ title, notes }) => {
  const { setNodeRef } = useDroppable({
    id: title,
    data: {
      type: 'Column',
      column: title,
    },
  });

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <SortableContext items={notes.map(note => note.id)} strategy={verticalListSortingStrategy}>
          <ul ref={setNodeRef} className="space-y-2">
            {notes.map((note) => (
              <SortableNote key={note.id} note={note} />
            ))}
          </ul>
        </SortableContext>
      </CardContent>
    </Card>
  );
};
