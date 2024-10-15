// components/DeleteNoteModal.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDeleteNote } from "../../hooks/useDeleteNote";
import toast from "react-hot-toast";

interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
}

const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({ isOpen, onClose, noteId }) => {
  const { deleteNote, isLoading, isError, error } = useDeleteNote();

  const handleDelete = () => {
    deleteNote(noteId, {
      onSuccess: () => {
        toast.success('Note deleted successfully');
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {isError && (
          <p className="text-sm text-red-500 mt-2">
            Error: {error?.message || 'Failed to delete note'}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNoteModal;
