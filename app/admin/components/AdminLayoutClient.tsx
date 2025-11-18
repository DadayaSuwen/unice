'use client'

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { MobileMenuProvider, useMobileMenu } from "./MobileMenuProvider";
import type { ReactNode } from "react";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const { isMobileMenuOpen } = useMobileMenu();

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
            marginLeft: shouldAdjustLayout && !isMobileMenuOpen ? '16rem' : '0'
          }}
        >
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface AdminLayoutClientProps {
  children: ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  return (
    <MobileMenuProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </MobileMenuProvider>
  );
}