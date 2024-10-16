import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../utils/apiCall";
import { Note } from "../types/note";
import { useTranslation } from 'react-i18next';

interface UpdateNoteDto {
  id: string;
  data: Partial<Omit<Note, 'id' | 'order' | 'createdAt' | 'updatedAt' | 'isArchived'>>;
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const mutation = useMutation<Note, Error, UpdateNoteDto>({
    mutationFn: async ({ id, data }) => {
      return await apiCall<Note>("PATCH", `/notes/${id}`, data, {
        headers: { 'Accept-Language': i18n.language }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    updateNote: mutation.mutate,
    isLoading: mutation.status === "pending",
    isError: mutation.isError,
    error: mutation.error,
  };
};
