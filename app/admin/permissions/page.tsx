'use client'

import { useState, useEffect } from 'react'
import { Shield, Key, Search, Filter, Users } from 'lucide-react'

interface Permission {
  id: number
  name: string
  display_name: string
  description?: string
  module: string
  action: string
  resource?: string
  is_system: boolean
  created_at: string
  roles: Array<{
    id: number
    name: string
    display_name: string
  }>
  role_count: number
}

interface GroupedPermissions {
  [module: string]: Permission[]
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermissions>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  // 获取权限列表
  const fetchPermissions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(moduleFilter && { module: moduleFilter }),
        ...(actionFilter && { action: actionFilter })
      })

      const response = await fetch(`/api/admin/permissions?${params}`)
      const data = await response.json()

      if (data.success) {
        setPermissions(data.data.permissions)
        setGroupedPermissions(data.data.groupedPermissions)
      } else {
        console.error('获取权限列表失败:', data.message)
      }
    } catch (error) {
      console.error('获取权限列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [moduleFilter, actionFilter])

  // 过滤权限
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = !searchTerm ||
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSearch
  })

  // 过滤分组权限
  const filteredGroupedPermissions = Object.entries(groupedPermissions).reduce((acc: GroupedPermissions, [module, modulePermissions]) => {
    const filtered = modulePermissions.filter(permission => {
      const matchesSearch = !searchTerm ||
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesSearch
    })

    if (filtered.length > 0) {
      acc[module] = filtered
    }

    return acc
  }, {})

  // 模块显示名称映射
  const moduleNames: Record<string, string> = {
    'user': '用户管理',
    'role': '角色管理',
    'product': '产品管理',
    'news': '新闻管理',
    'career': '招聘管理',
    'system': '系统管理'
  }

  // 操作显示名称映射
  const actionNames: Record<string, string> = {
    'read': '查看',
    'create': '创建',
    'update': '更新',
    'delete': '删除',
    'publish': '发布',
    'assign': '分配',
    'dashboard': '仪表板',
    'audit': '审计',
    'settings': '设置'
  }

  // 获取操作颜色
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'read': 'bg-blue-100 text-blue-800',
      'create': 'bg-green-100 text-green-800',
      'update': 'bg-yellow-100 text-yellow-800',
      'delete': 'bg-red-100 text-red-800',
      'publish': 'bg-purple-100 text-purple-800',
      'assign': 'bg-indigo-100 text-indigo-800',
      'dashboard': 'bg-gray-100 text-gray-800',
      'audit': 'bg-orange-100 text-orange-800',
      'settings': 'bg-pink-100 text-pink-800'
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
  }

  // 获取模块颜色
  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      'user': 'bg-blue-50 border-blue-200',
      'role': 'bg-purple-50 border-purple-200',
      'product': 'bg-green-50 border-green-200',
      'news': 'bg-orange-50 border-orange-200',
      'career': 'bg-yellow-50 border-yellow-200',
      'system': 'bg-red-50 border-red-200'
    }
    return colors[module] || 'bg-gray-50 border-gray-200'
  }

  // 获取唯一模块列表
  const uniqueModules = Array.from(new Set(permissions.map(p => p.module)))
  const uniqueActions = Array.from(new Set(permissions.map(p => p.action)))

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">权限管理</h1>
          <p className="text-gray-600 mt-1">查看系统权限和角色分配情况</p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索权限名称、显示名称、描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有模块</option>
            {uniqueModules.map(module => (
              <option key={module} value={module}>
                {moduleNames[module] || module}
              </option>
            ))}
          </select>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有操作</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>
                {actionNames[action] || action}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 权限统计 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {filteredPermissions.length}
              </div>
              <div className="text-sm text-gray-600">总权限数</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {uniqueModules.length}
              </div>
              <div className="text-sm text-gray-600">权限模块</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Filter className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {uniqueActions.length}
              </div>
              <div className="text-sm text-gray-600">操作类型</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {permissions.reduce((sum, p) => sum + p.role_count, 0)}
              </div>
              <div className="text-sm text-gray-600">角色分配</div>
            </div>
          </div>
        </div>
      </div>

      {/* 权限列表 */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : Object.keys(filteredGroupedPermissions).length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无权限</h3>
            <p className="text-gray-600">
              {searchTerm || moduleFilter || actionFilter
                ? '没有找到匹配的权限'
                : '系统中暂无权限配置'
              }
            </p>
          </div>
        ) : (
          Object.entries(filteredGroupedPermissions).map(([module, modulePermissions]) => (
            <div key={module} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* 模块头部 */}
              <div className={`px-6 py-4 border-b border-gray-200 ${getModuleColor(module)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Shield className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {moduleNames[module] || module}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">{module}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {modulePermissions.length} 个权限
                    </span>
                  </div>
                </div>
              </div>

              {/* 权限列表 */}
              <div className="divide-y divide-gray-200">
                {modulePermissions.map((permission) => (
                  <div key={permission.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-medium text-gray-900">
                            {permission.display_name}
                          </h4>
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(permission.action)}`}>
                            {actionNames[permission.action] || permission.action}
                          </span>
                          {permission.resource && (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {permission.resource === 'all' ? '所有' :
                               permission.resource === 'own' ? '自己的' : permission.resource}
                            </span>
                          )}
                          {permission.is_system && (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              系统权限
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-mono text-gray-500 mb-2">
                          {permission.name}
                        </div>
                        {permission.description && (
                          <p className="text-sm text-gray-600">
                            {permission.description}
                          </p>
                        )}
                      </div>

                      <div className="ml-4 text-right">
                        <div className="text-sm text-gray-500 mb-2">
                          分配给 {permission.role_count} 个角色
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {permission.roles.slice(0, 3).map((role) => (
                            <span
                              key={role.id}
                              className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {role.display_name}
                            </span>
                          ))}
                          {permission.roles.length > 3 && (
                            <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{permission.roles.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}