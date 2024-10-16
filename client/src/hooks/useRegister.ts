import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "../utils/apiCall";
import { useTranslation } from 'react-i18next';

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const mutation = useMutation<RegisterResponse, Error, RegisterCredentials>({
    mutationFn: (credentials: RegisterCredentials) =>
      apiCall<RegisterResponse>("POST", "/auth/register", credentials, {
        headers: {
          'Accept-Language': i18n.language
        }
      }),
    onSuccess: () => {
      navigate(`/${i18n.language}/login`);
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.status === "pending",
    isError: mutation.isError,
    error: mutation.error,
  };
};
