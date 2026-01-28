
import { useQuery } from "@tanstack/react-query";
import axiosClient, { accessToken, setAccessToken } from "@/libs/axios";
import type { MeResponse } from "@/types/auth";

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {

      if (accessToken === "dev-access-token") {
        return {
          id: "dev-id",
          email: "dev@gmail.com",
          name: "Dev User",
        };
      }

      const res = await axiosClient.get<MeResponse>("/auth/me");

      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
      }

      return res.data.user;
    },
    retry: false,
    staleTime: Infinity,
  });
};
