"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Shield,
  Users,
  Settings,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

// 定义 Permission 类型以复用
interface Permission {
  id: number;
  name: string;
  display_name: string;
  module: string;
  action: string;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  level: number;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions: Permission[]; // 使用定义的 Permission 类型
  users: Array<{
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  }>;
  user_count: number;
  permission_count: number;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        ...(searchTerm && { search: searchTerm }),
        ...(showInactive && { isActive: "false" }),
      });

      const response = await fetch(`/api/admin/roles?${params}`);
      const data = await response.json();

      if (data.success) {
        setRoles(data.data.roles);
      } else {
        console.error("获取角色列表失败:", data.message);
      }
    } catch (error) {
      console.error("获取角色列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [searchTerm, showInactive]);

  // 获取角色级别颜色
  const getLevelColor = (level: number) => {
    if (level >= 100) return "bg-red-100 text-red-800 border-red-200";
    if (level >= 80) return "bg-orange-100 text-orange-800 border-orange-200";
    if (level >= 50) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  // 获取角色级别名称
  const getLevelName = (level: number) => {
    if (level >= 100) return "超级管理员";
    if (level >= 80) return "管理员";
    if (level >= 50) return "编辑员";
    return "普通用户";
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  // 按模块分组权限 - 修复类型错误
  const groupPermissionsByModule = (permissions: Permission[]) => {
    // 使用 Record<string, Permission[]> 明确指定 reduce 的累加器类型
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  };

  // 模块显示名称映射
  const moduleNames: Record<string, string> = {
    user: "用户管理",
    role: "角色管理",
    product: "产品管理",
    news: "新闻管理",
    career: "招聘管理",
    system: "系统管理",
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">角色管理</h1>
          <p className="text-gray-600 mt-1">管理系统角色和权限分配</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          新增角色
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索角色名称、显示名称、描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            显示禁用角色
          </label>
        </div>
      </div>

      {/* 角色列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 flex justify-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : roles.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无角色</h3>
            <p className="text-gray-600">创建第一个角色来开始管理系统权限</p>
          </div>
        ) : (
          roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* 角色头部 */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getLevelColor(role.level)}`}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {role.display_name}
                      </h3>
                      <p className="text-sm text-gray-500">{role.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {role.is_system && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                        系统角色
                      </span>
                    )}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        role.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {role.is_active ? "活跃" : "禁用"}
                    </span>
                  </div>
                </div>

                {/* 角色描述 */}
                {role.description && (
                  <p className="mt-3 text-sm text-gray-600">
                    {role.description}
                  </p>
                )}

                {/* 角色统计 */}
                <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{role.user_count} 用户</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    <span>{role.permission_count} 权限</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>{getLevelName(role.level)}</span>
                  </div>
                </div>
              </div>

              {/* 权限列表 */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    权限列表
                  </h4>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4 inline" />
                  </button>
                </div>

                <div className="space-y-2">
                  {/* 这里现在可以正确推断 modulePermissions 的类型为 Permission[] */}
                  {Object.entries(
                    groupPermissionsByModule(role.permissions)
                  ).map(([module, modulePermissions]) => (
                    <div key={module} className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">
                        {moduleNames[module] || module}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {/* 移除了 permission: any，现在 TypeScript 可以自动推断 */}
                        {modulePermissions.slice(0, 5).map((permission) => (
                          <span
                            key={permission.id}
                            className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {permission.display_name}
                          </span>
                        ))}
                        {modulePermissions.length > 5 && (
                          <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            +{modulePermissions.length - 5} 更多
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 用户预览 */}
                {role.users.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      分配用户
                    </div>
                    <div className="flex -space-x-2">
                      {role.users.slice(0, 6).map((user) => (
                        <div
                          key={user.id}
                          className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                          title={`${user.first_name || user.username} ${
                            user.last_name || ""
                          }`}
                        >
                          <span className="text-xs font-medium text-gray-600">
                            {(user.first_name || user.username)
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      ))}
                      {role.users.length > 6 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-500">
                            +{role.users.length - 6}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    创建于 {formatDate(role.created_at)}
                    {role.updated_at !== role.created_at && (
                      <span className="ml-2">
                        · 更新于 {formatDate(role.updated_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="编辑角色"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {!role.is_system && (
                      <button
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        title="删除角色"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
