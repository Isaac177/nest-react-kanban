import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiCall, setAuthToken } from "../utils/apiCall";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) =>
      apiCall<LoginResponse>("POST", "/auth/login", credentials),
    onSuccess: (data) => {
      setAuthToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      navigate("/notes");
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.status === "pending",
    isError: mutation.isError,
    error: mutation.error,
  };
};
