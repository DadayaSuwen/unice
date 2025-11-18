// app/admin/layout.tsx (不再需要路由组，使用 /admin 路由段)
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import type { ReactNode } from "react";
// ...其他导入

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-layout min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1 relative">
        <AdminSidebar />

        <main id="admin-main-content" className="flex-1 transition-all duration-300 ease-in-out bg-gray-50
                         ml-0 lg:ml-[16rem]
                         p-4 sm:p-6
                         pb-24 lg:pb-6
                         min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
