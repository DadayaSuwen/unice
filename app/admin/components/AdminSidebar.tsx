"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useMobileMenu } from "./MobileMenuProvider";

export default function AdminSidebar() {
  const [isDesktop, setIsDesktop] = useState(false);
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();

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

  const handleMobileMenuToggle = () => {
    closeMobileMenu();
  };

  const handleMobileMenuItemClick = () => {
    if (!isDesktop) {
      closeMobileMenu();
    }
  };

  // 桌面端：菜单打开时隐藏侧边栏，关闭时显示
  // 移动端：菜单打开时显示侧边栏，关闭时隐藏
  const shouldShowSidebar = isDesktop ? !isMobileMenuOpen : isMobileMenuOpen;

  return (
    <>
      {/* 移动端菜单遮罩 */}
      {isMobileMenuOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] transition-opacity duration-300"
          onClick={handleMobileMenuToggle}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={`fixed top-0 left-0 h-full z-[55] transition-all duration-300 ease-in-out sidebar-desktop
                      ${shouldShowSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar
          isCollapsed={false}
          onToggle={() => {}}
          onMobileMenuItemClick={handleMobileMenuItemClick}
        />
      </div>
    </>
  );
}
