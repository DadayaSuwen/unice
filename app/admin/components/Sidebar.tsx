"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Shield,
  Package,
  FileText,
  Briefcase,
  Menu,
  X,
  LogOut,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "仪表板",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "用户管理",
    href: "/admin/users",
    icon: <Users className="w-5 h-5" />,
    badge: "权限",
  },
  {
    title: "角色管理",
    href: "/admin/roles",
    icon: <Shield className="w-5 h-5" />,
    badge: "权限",
  },
  {
    title: "权限查看",
    href: "/admin/permissions",
    icon: <Package className="w-5 h-5" />,
    badge: "权限",
  },
  {
    title: "产品管理",
    href: "/admin/products",
    icon: <Package className="w-5 h-5" />,
  },
  {
    title: "新闻管理",
    href: "/admin/news",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "招聘管理",
    href: "/admin/careers",
    icon: <Briefcase className="w-5 h-5" />,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onMobileMenuItemClick?: () => void;
}

export default function Sidebar({
  isCollapsed,
  onToggle,
  onMobileMenuToggle,
  isMobileMenuOpen,
  onMobileMenuItemClick,
}: SidebarProps) {

  const isActive = (href: string) => {
    if (typeof window !== "undefined") {
      return (
        window.location.pathname === href ||
        window.location.pathname.startsWith(href + "/")
      );
    }
    return false;
  };

  return (
    <>
      {/* 桌面端侧边栏 */}
      <div className={`sidebar-desktop ${isCollapsed ? "collapsed" : ""}`}>
        {/* 侧边栏头部 */}
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="sidebar-brand">
              <div className="brand-icon">
                <span className="text-white font-bold">联</span>
              </div>
              <div className="brand-text">
                <div className="brand-title">管理后台</div>
                <div className="brand-subtitle">联合化工管理平台</div>
              </div>
            </div>
          )}
          <button onClick={onToggle} className="toggle-button">
            {isCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="sidebar-nav">
          <div>
            {sidebarItems.map((item) => (
              <div key={item.title} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link ${
                    isActive(item.href) ? "active" : ""
                  }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <div className="nav-text flex items-center justify-between flex-1">
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </nav>

        {/* 底部操作 */}
        {!isCollapsed && (
          <div className="sidebar-footer">
            <button className="logout-button">
              <LogOut className="logout-icon" />
              <span>退出登录</span>
            </button>
          </div>
        )}
      </div>

      {/* 移动端底部导航 */}
      <div className="mobile-nav">
        <div className="nav-grid">
          {sidebarItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileMenuItemClick}
              className={`mobile-nav-item ${
                isActive(item.href) ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.title.replace(/管理/g, "")}</span>
              {item.badge && <span className="nav-badge"></span>}
            </Link>
          ))}
          {/* 更多选项按钮 */}
          <button onClick={onMobileMenuToggle} className="mobile-nav-item">
            <Menu className="nav-icon" />
            <span>更多</span>
          </button>
        </div>
      </div>

      {/* 移动端侧滑菜单 */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
      >
        <div className="overlay-backdrop" onClick={onMobileMenuToggle} />
        <div className="mobile-menu-panel">
          <div className="mobile-menu-header">
            <div className="mobile-brand">
              <div className="brand-icon">
                <span className="text-white font-bold">联</span>
              </div>
              <div className="brand-text">
                <div className="brand-title">管理后台</div>
                <div className="brand-subtitle">联合化工管理平台</div>
              </div>
            </div>
            <button onClick={onMobileMenuToggle} className="close-button">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mobile-menu-content">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  onMobileMenuToggle?.();
                  onMobileMenuItemClick?.();
                }}
                className={`mobile-nav-item ${
                  isActive(item.href) ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.title}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
