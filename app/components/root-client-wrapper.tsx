"use client";

import { usePathname } from "next/navigation";
import Navigation from "./navigation"; // 根布局导入的组件
import Footer from "./footer"; // 根布局导入的组件
import { ReactNode } from "react";

export default function RootClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // 检查当前路径是否以 '/admin' 开头
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 只有在非管理后台路径时才渲染 Navigation */}
      {!isAdminRoute && <Navigation />}

      <main className={`flex-grow ${!isAdminRoute ? "pt-16" : ""}`}>
        {children}
      </main>

      {/* 只有在非管理后台路径时才渲染 Footer */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
