
import { useQuery } from "@tanstack/react-query";
import axiosClient, { setAccessToken } from "@/libs/axios";
import type { MeResponse } from "@/types/auth";

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await axiosClient.get<MeResponse>("/auth/me");

      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
      }

      return res.data.user;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};
