// hooks/useDeleteNote.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../utils/apiCall";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await apiCall<void>("DELETE", `/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  return {
    deleteNote: mutation.mutate,
    isLoading: mutation.status === "pending",
    isError: mutation.isError,
    error: mutation.error,
  };
};
