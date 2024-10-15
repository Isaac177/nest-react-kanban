
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../utils/apiCall";
import { useNavigate } from "react-router-dom";
import { Note } from "../types/note";

interface CreateNoteDto {
  title: string;
  content: string;
  column: 'To Do' | 'In Progress' | 'Done';
  tags?: string[];
  dueDate?: Date;
  priority: number;
}

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation<Note, Error, CreateNoteDto>({
    mutationFn: async (newNote: CreateNoteDto) => {
      const noteToSend = {
        ...newNote,
        dueDate: newNote.dueDate ? newNote.dueDate.toISOString() : undefined,
      };
      return await apiCall<Note>("POST", "/notes", noteToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
    onError: (error) => {
      if (error instanceof Error && error.message === "Unauthorized") {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        console.error(error);
      }
    },
  });

  return {
    createNote: mutation.mutate,
    isLoading: mutation.status === "pending",
    isError: mutation.isError,
    error: mutation.error,
  };
};
