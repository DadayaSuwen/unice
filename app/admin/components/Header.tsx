'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, User, Settings, LogOut, Menu } from 'lucide-react'

interface HeaderProps {
  onMobileMenuToggle: () => void
  isMobileMenuOpen: boolean
}

export default function Header({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="admin-header px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-4">
        {/* 左侧：品牌标识和搜索栏 */}
        <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
          {/* 移动端菜单按钮 */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-gray-600 hover:text-[#d4af37] hover:bg-[#f9f5e7] rounded-lg transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* 品牌标识 - 响应式 */}
          <div className="brand-section">
            <div className="brand-icon">
              <span className="text-white font-bold">联</span>
            </div>
            <div className="brand-text hidden sm:block">
              <div className="brand-title">联合化工管理后台</div>
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
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#d4af37] hover:bg-[#f9f5e7] rounded-lg transition-all duration-200 font-medium text-sm"
          >
            返回前台
          </Link>

          {/* 通知铃铛 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowUserMenu(false)
              }}
              className="notification-bell"
            >
              <Bell className="w-5 h-5" />
              <span className="notification-dot"></span>
            </button>

            {/* 通知下拉菜单 */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 sm:w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-[#f9f5e7] to-[#fef9e7]">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <Bell className="w-4 h-4 text-[#d4af37]" />
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
                setShowUserMenu(!showUserMenu)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-[#f9f5e7] rounded-lg transition-all duration-200"
            >
              <div className="user-avatar">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">系统管理员</div>
                <div className="text-xs text-gray-500">admin@unicechemical.com</div>
              </div>
            </button>

            {/* 用户下拉菜单 */}
            <div className={`user-dropdown ${showUserMenu ? 'active' : ''}`}>
              <div className="dropdown-header">
                <div className="user-info">
                  <div className="user-avatar">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="user-name">系统管理员</div>
                    <div className="user-email">admin@unicechemical.com</div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <a
                  href="/admin/profile"
                  className="dropdown-item"
                >
                  <User className="item-icon" />
                  <span className="text-sm font-medium">个人资料</span>
                </a>
                <a
                  href="/admin/settings"
                  className="dropdown-item"
                >
                  <Settings className="item-icon" />
                  <span className="text-sm font-medium">系统设置</span>
                </a>
                <div className="dropdown-divider"></div>
                <a
                  href="/"
                  className="dropdown-item"
                >
                  <svg className="item-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm font-medium">返回前台</span>
                </a>
                <button className="dropdown-item logout w-full">
                  <LogOut className="item-icon" />
                  <span className="text-sm font-medium">退出登录</span>
                </button>
              </div>
            </div>
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
  )
}