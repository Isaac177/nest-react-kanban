
import React from 'react';
import NoteModal from './NoteModal';
import { Note } from '../../types/note';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ isOpen, onClose, note }) => {
  return (
    <NoteModal isOpen={isOpen} onClose={onClose} note={note} />
  );
};

export default EditNoteModal;
