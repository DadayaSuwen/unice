// app/admin/layout.tsx (服务端组件)
import AdminLayoutClient from "./components/AdminLayoutClient";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
