"use client";

import { usePathname } from "next/navigation";
import Navigation from "./navigation";
import Footer from "./footer";
import { ReactNode } from "react";
import type { SiteSettings, NavItem } from "@/lib/globals";

export default function RootClientWrapper({
  children,
  siteSettings,
  navigationItems,
}: {
  children: ReactNode;
  siteSettings: SiteSettings;
  navigationItems: NavItem[];
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navigation items={navigationItems} />}
      <main className={`flex-grow ${!isAdminRoute ? "pt-16" : ""}`}>
        {children}
      </main>
      {!isAdminRoute && <Footer settings={siteSettings} />}
    </div>
  );
}
