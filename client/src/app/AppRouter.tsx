
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import { NotFoundPage } from "@/pages/NotFoundPage";
import TodoPage from "@/pages/TodoPage";
import OAuthCallback from "@/components/OAuthCallback";
import AppLayout from "./AppLayout";
import AuthPage from "@/pages/AuthPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* public */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      {/* protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<TodoPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
