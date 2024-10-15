import React, { useState, useMemo } from 'react';
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import { Column } from './Column';
import { SortableNote } from './SortableNote';
import { apiCall } from "../../utils/apiCall";
import { Note } from "../../types/note";

const defaultColumns: { id: Note['column']; title: string }[] = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Done', title: 'Done' },
];

const KanbanBoard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const queryClient = useQueryClient();

  const { data: fetchedNotes, isLoading, error } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: () => apiCall('GET', '/notes')
  });

  React.useEffect(() => {
    if (fetchedNotes) {
      setNotes(fetchedNotes);
    }
  }, [fetchedNotes]);

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, column, order }: { id: string; column: Note['column']; order: number }) =>
      apiCall('PATCH', `/notes/${id}/move`, { column, order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const notesByColumn = useMemo(() => {
    const mapping: Record<Note['column'], Note[]> = {
      'To Do': [],
      'In Progress': [],
      'Done': [],
    };
    notes.forEach(note => {
      mapping[note.column].push(note);
    });
    return mapping;
  }, [notes]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeNote = notes.find(note => note.id === active.id);
    if (activeNote) {
      setActiveNote(activeNote);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeNoteId = active.id as string;
    const overId = over.id as string;

    const activeNote = notes.find(note => note.id === activeNoteId);
    if (!activeNote) return;

    if (isColumnId(overId)) {
      const overColumnId = overId as Note['column'];

      if (activeNote.column !== overColumnId) {
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === activeNoteId ? { ...note, column: overColumnId } : note
          )
        );
      }
    } else {
      const overNote = notes.find(note => note.id === overId);
      if (!overNote) return;

      if (activeNote.column !== overNote.column) {
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === activeNoteId ? { ...note, column: overNote.column } : note
          )
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNote(null);

    if (!over) return;

    const activeNoteId = active.id as string;
    const overId = over.id as string;

    const activeNote = notes.find(note => note.id === activeNoteId);
    if (!activeNote) return;

    if (isColumnId(overId)) {
      const overColumnId = overId as Note['column'];

      setNotes(prevNotes => {
        const updatedNotes = prevNotes.map(note =>
          note.id === activeNoteId ? { ...note, column: overColumnId } : note
        );

        updateNoteMutation.mutate({
          id: activeNote.id,
          column: overColumnId,
          order: 0,
        });

        return updatedNotes;
      });
    } else {
      const overNote = notes.find(note => note.id === overId);
      if (!overNote) return;

      if (activeNoteId !== overNote.id) {
        setNotes(prevNotes => {
          const activeIndex = prevNotes.findIndex(note => note.id === activeNoteId);
          const overIndex = prevNotes.findIndex(note => note.id === overNote.id);

          let newNotes = [...prevNotes];

          newNotes.splice(activeIndex, 1);

          newNotes.splice(overIndex, 0, {
            ...activeNote,
            column: overNote.column,
          });

          const updatedNotes = newNotes.map((note, index) => {
            if (note.column === overNote.column) {
              return { ...note, order: index };
            }
            return note;
          });

          updateNoteMutation.mutate({
            id: activeNote.id,
            column: overNote.column,
            order: overIndex,
          });

          return updatedNotes;
        });
      }
    }
  };

  const isColumnId = (id: string): id is Note['column'] => {
    return ['To Do', 'In Progress', 'Done'].includes(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>An error occurred: {error.message}</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {defaultColumns.map(column => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            notes={notesByColumn[column.id]}
          />
        ))}
      </div>
      {typeof document !== 'undefined' && createPortal(
        <DragOverlay>
          {activeNote && <SortableNote note={activeNote} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default KanbanBoard;
