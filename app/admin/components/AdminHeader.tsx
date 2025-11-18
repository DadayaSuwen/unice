'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, User, Settings, LogOut, Menu } from 'lucide-react'

export default function AdminHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左侧：搜索栏 */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索功能、用户、内容..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 右侧：用户操作区 */}
        <div className="flex items-center gap-4">
          {/* 通知铃铛 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowUserMenu(false)
              }}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 通知下拉菜单 */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">通知</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 text-sm text-gray-600">
                    暂无新通知
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 用户菜单 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu)
                setShowNotifications(false)
              }}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">管理员</div>
                <div className="text-xs text-gray-500">admin@unicechemical.com</div>
              </div>
            </button>

            {/* 用户下拉菜单 */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">个人资料</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">系统设置</span>
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Menu className="w-4 h-4" />
                    <span className="text-sm">返回前台</span>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">退出登录</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}