import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../utils/apiCall";
import { useTranslation } from 'react-i18next';

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const mutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiCall<void>("DELETE", `/notes/${id}`, undefined, {
        headers: { 'Accept-Language': i18n.language }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    deleteNote: mutation.mutate,
    isLoading: mutation.status === "pending",
    isError: mutation.isError,
    error: mutation.error,
  };
};
