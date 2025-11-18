import { ReactNode } from "react";
import "./layout.scss";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function IndependentAdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <div className="admin-main">
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
