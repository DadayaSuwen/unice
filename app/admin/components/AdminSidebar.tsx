'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Package,
  FileText,
  Briefcase,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Home
} from 'lucide-react'

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  children?: SidebarItem[]
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  {
    title: '仪表板',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    title: '用户管理',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
    badge: '权限'
  },
  {
    title: '角色管理',
    href: '/admin/roles',
    icon: <Shield className="w-5 h-5" />,
    badge: '权限'
  },
  {
    title: '权限查看',
    href: '/admin/permissions',
    icon: <Settings className="w-5 h-5" />,
    badge: '权限'
  },
  {
    title: '产品管理',
    href: '/admin/products',
    icon: <Package className="w-5 h-5" />
  },
  {
    title: '新闻管理',
    href: '/admin/news',
    icon: <FileText className="w-5 h-5" />
  },
  {
    title: '招聘管理',
    href: '/admin/careers',
    icon: <Briefcase className="w-5 h-5" />
  }
]

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* 侧边栏头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">管理后台</h2>
              <p className="text-xs text-gray-500 mt-1">联合化工</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <X className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="p-4">
        <div className="space-y-2">
          {/* 返回前台链接 */}
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === '/'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium">返回前台</span>
            )}
          </Link>

          {/* 管理菜单项 */}
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                // 有子菜单的项目
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.title) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* 子菜单 */}
                  {!isCollapsed && expandedItems.includes(item.title) && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg transition-colors ${
                            isActive(child.href)
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-sm">{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // 普通菜单项
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* 底部操作 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        {!isCollapsed && (
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        )}
        {isCollapsed && (
          <button className="w-full flex items-center justify-center p-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}