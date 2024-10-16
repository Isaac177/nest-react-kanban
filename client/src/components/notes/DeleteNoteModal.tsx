import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { deleteNote, isLoading, isError, error } = useDeleteNote();

  const handleDelete = () => {
    deleteNote(noteId, {
      onSuccess: () => {
        toast.success(t('deleteNoteModal.successMessage'));
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteNoteModal.title')}</DialogTitle>
          <DialogDescription>
            {t('deleteNoteModal.description')}
          </DialogDescription>
        </DialogHeader>
        {isError && (
          <p className="text-sm text-red-500 mt-2">
            {t('common.error')}: {error?.message || t('deleteNoteModal.failedToDelete')}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? t('common.deleting') : t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNoteModal;
