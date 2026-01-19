
import axiosClient from "@/libs/axios";


export type User = {
  id: string;
  email: string;
};

export type RegisterResponse = {
  message: string;
  sessionId: string;
  expiresIn: 300
}

export type AuthResponse = {
  message: string;
  accessToken: string;
  user: User;
};

export const registerApi = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axiosClient.post<RegisterResponse>("/auth/register", data);
  return res.data;
};

export const loginApi = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axiosClient.post<AuthResponse>("/auth/login", data);
  return res.data;
};

export const refreshTokenApi = async () => {
  const res = await axiosClient.post<{ accessToken: string }>("/auth/refresh");
  return res.data;
};

export const logoutApi = async () => {
  const res = await axiosClient.post("/auth/logout");
  return res.data;
};

export const googleLoginUrl = () =>
  `${import.meta.env.VITE_API_BASE_URL}/auth/google`;

export const verifyOtpApi = async (data: {
  sessionId: string;
  otp: string;
}) => {
  const res = await axiosClient.post("/auth/verify", data);
  return res.data;
};
export const resendOtpApi = async (sessionId: string) => {

  const res = await axiosClient.post("/auth/resend", { sessionId });
  return res.data;
};
