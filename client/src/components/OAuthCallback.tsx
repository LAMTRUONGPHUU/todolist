
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAccessToken } from "@/libs/axios";
import { useQueryClient } from "@tanstack/react-query";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = params.get("accessToken");

    if (!accessToken) {
      navigate("/auth", { replace: true });
      return;
    }

    // 🔥 reuse logic from useAuth.login onSuccess
    setAccessToken(accessToken);
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

    navigate("/", { replace: true });
  }, []);

  return <div>Logging in with Google...</div>;
}
