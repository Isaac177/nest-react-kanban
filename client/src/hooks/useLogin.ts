import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "../utils/apiCall";
import { useTranslation } from 'react-i18next';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) =>
      apiCall<LoginResponse>("POST", "/auth/login", credentials, {
        headers: {
          'Accept-Language': i18n.language
        }
      }),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      navigate(`/${i18n.language}/dashboard`);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.status === "pending",
    isError: mutation.isError,
    error: mutation.error,
  };
};
