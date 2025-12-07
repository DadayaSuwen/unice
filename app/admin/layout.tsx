"use client";

// app/admin/layout.tsx (客户端组件)
import AdminLayoutClient from "./components/AdminLayoutClient";
import LoginLayout from "./login/layout";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // 如果是登录页面，使用登录布局
  if (pathname === "/admin/login") {
    return <LoginLayout>{children}</LoginLayout>;
  }

  // 其他页面使用管理后台布局
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
