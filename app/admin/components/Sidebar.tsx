"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Package,
  FileText,
  Briefcase,
  Menu,
  X,
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
  onMobileMenuItemClick?: () => void;
}

export default function Sidebar({
  isCollapsed,
  onToggle,
  onMobileMenuItemClick,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* 桌面端侧边栏 */}
      <div className={`${isCollapsed ? "collapsed" : ""}`}>
        {/* 侧边栏头部 */}
        <div className="sidebar-header"></div>

        {/* 导航菜单 */}
        <nav className="sidebar-nav">
          <div>
            {sidebarItems.map((item) => (
              <div key={item.title} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? "active" : ""}`}
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
      </div>
    </>
  );
}
