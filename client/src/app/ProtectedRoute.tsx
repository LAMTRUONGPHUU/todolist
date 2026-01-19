
import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@/hooks/useMe";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/auth" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
