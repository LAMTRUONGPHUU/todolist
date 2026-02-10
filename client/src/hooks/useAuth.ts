import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginApi,
  registerApi,
  logoutApi,
  type AuthResponse,
  verifyOtpApi,
  resendOtpApi,
} from "@/services/auth.api";
import { setAccessToken } from "@/libs/axios";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      if (data.email === "dev@gmail.com" && data.password === "123qwe") {
        return {
          message: "Dev login success",
          accessToken: "dev-access-token",
          user: {
            id: "dev-id",
            email: "dev@gmail.com",
            name: "Dev User",
          },
        };
      }
      return loginApi(data);
    },
    onSuccess: (data: AuthResponse) => {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
  });

  /* ---------- VERIFY OTP ---------- */
  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (data: AuthResponse) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  /* ---------- RESEND OTP ---------- */
  const resendOtpMutation = useMutation({
    mutationFn: resendOtpApi,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      setAccessToken(null);

      await queryClient.cancelQueries();
      queryClient.clear();

      window.location.href = "/auth";
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    verifyOtp: verifyOtpMutation.mutate,
    isVerifyingOtp: verifyOtpMutation.isPending,
    verifyOtpError: verifyOtpMutation.error,

    resendOtp: resendOtpMutation.mutate,
    isResendingOtp: resendOtpMutation.isPending,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
