"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, User, Settings, LogOut, Menu } from "lucide-react";
import { useMobileMenu } from "./MobileMenuProvider";

export default function AdminHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toggleMobileMenu } = useMobileMenu();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 调用登出API
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 无论API是否成功，都清除本地存储并跳转
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      router.push("/admin/login");
    }
  };

  return (
    <header className="admin-header px-4 sm:px-6 py-3 sm:py-4 relative z-[60]">
      <div className="flex items-center justify-between gap-4">
        {/* 左侧：菜单按钮和品牌标识 */}
        <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-[var(--primary-gold-light)] transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          {/* 品牌标识 - 响应式 */}
          <div className="brand-section">
            <div className="brand-icon">
              <span className="text-white font-bold">联</span>
            </div>
            <div className="brand-text hidden sm:block">
              <div className="brand-title">江西联合化工管理后台</div>
              <div className="brand-subtitle">Unice Chemical Admin</div>
            </div>
            <div className="brand-text sm:hidden">
              <div className="brand-title">管理后台</div>
            </div>
          </div>

          {/* 搜索栏 - 响应式 */}
          <div className="search-container hidden md:block max-w-md flex-1">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="搜索功能、用户、内容..."
              className="search-input"
            />
          </div>
        </div>

        {/* 右侧：用户操作区 */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 返回前台链接 - 响应式 */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[var(--primary-gold)] hover:bg-[var(--primary-gold-light)] rounded-lg transition-all duration-200 font-medium text-sm"
          >
            返回前台
          </Link>

          {/* 通知铃铛 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="notification-bell"
            >
              <Bell className="w-5 h-5" />
              <span className="notification-dot"></span>
            </button>

            {/* 通知下拉菜单 */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 sm:w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-[var(--primary-gold-light)] to-[var(--primary-gold-light)]">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <Bell className="w-4 h-4 text-[var(--primary-gold)]" />
                    通知中心
                  </h3>
                </div>
                <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                  <div className="p-3 sm:p-4 text-sm text-gray-600 text-center">
                    暂无新通知
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 用户菜单 */}
          <div className="user-menu relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-[var(--primary-gold-light)] rounded-lg transition-all duration-200"
            >
              <div className="user-avatar">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  系统管理员
                </div>
                <div className="text-xs text-gray-500">
                  admin@unicechemical.com
                </div>
              </div>
            </button>

            {/* 用户下拉菜单 */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[var(--primary-gold-light)] to-[var(--primary-gold-light)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-gold)] to-[var(--primary-gold-bright)] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        系统管理员
                      </div>
                      <div className="text-sm text-gray-500">
                        admin@unicechemical.com
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[var(--primary-gold)] hover:bg-[var(--primary-gold-light)] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">个人资料</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[var(--primary-gold)] hover:bg-[var(--primary-gold-light)] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">系统设置</span>
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[var(--primary-gold)] hover:bg-[var(--primary-gold-light)] transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span className="text-sm font-medium">返回前台</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">退出登录</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 移动端搜索栏 */}
      <div className="md:hidden mt-3 px-1 search-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="搜索功能、用户、内容..."
          className="search-input"
        />
      </div>
    </header>
  );
}
