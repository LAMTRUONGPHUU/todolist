// src/app/AppLayout.tsx
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen" >
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
