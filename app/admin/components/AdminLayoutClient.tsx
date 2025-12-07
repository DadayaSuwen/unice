"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { MobileMenuProvider, useMobileMenu } from "./MobileMenuProvider";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isMobileMenuOpen } = useMobileMenu();
  const router = useRouter();

  // 检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // 这里可以添加token验证逻辑
      // 简单起见，只检查token是否存在
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const checkDevice = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-gold)] mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果未认证，不渲染任何内容（重定向已在 useEffect 中处理）
  if (!isAuthenticated) {
    return null;
  }

  // 只有桌面端需要根据菜单状态调整布局
  const shouldAdjustLayout = isDesktop;

  return (
    <div className="admin-layout min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1 relative">
        <AdminSidebar />

        <main
          id="admin-main-content"
          className="flex-1 transition-all duration-300 ease-in-out bg-gray-50
                    ml-0 lg:ml-[16rem]
                    p-4 sm:p-6
                    pt-6
                    min-h-[calc(100vh-4rem)]
                    lg:min-h-[calc(100vh-4rem)]"
          style={{
            // 只有桌面端才需要动态调整 marginLeft
            marginLeft: shouldAdjustLayout && !isMobileMenuOpen ? "16rem" : "0",
          }}
        >
          <div className="mx-auto space-y-6 sm:space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

interface AdminLayoutClientProps {
  children: ReactNode;
}

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  return (
    <MobileMenuProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </MobileMenuProvider>
  );
}
