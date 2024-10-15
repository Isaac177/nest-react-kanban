// hooks/useUpdateNote.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../utils/apiCall";
import { Note } from "../types/note";

interface UpdateNoteDto {
  id: string;
  data: Partial<Omit<Note, 'id' | 'order' | 'createdAt' | 'updatedAt' | 'isArchived'>>;
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, UpdateNoteDto>({
    mutationFn: async ({ id, data }) => {
      return await apiCall<Note>("PATCH", `/notes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  return {
    updateNote: mutation.mutate,
    isLoading: mutation.status === "pending",
    isError: mutation.isError,
    error: mutation.error,
  };
};
