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
    // !!! 这是一个普通的 <div> 容器，它将嵌套在根布局的 <body>/<div> 内部 !!!
    <div className="admin-layout min-h-screen">
      {/* 顶部管理导航栏 */}
      <AdminHeader />

      <div className="flex">
        {/* 侧边栏 */}
        <AdminSidebar />

        {/* 主内容区域 */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
