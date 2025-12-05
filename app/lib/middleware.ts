import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission } from './auth'

// 权限配置
interface PermissionConfig {
  permission: string
  resource?: string
  minRoleLevel?: number
  requireRole?: string[]
}

// 路由权限配置
const routePermissions: Record<string, PermissionConfig> = {
  // 用户管理
  '/api/admin/users': {
    permission: 'user.read',
    minRoleLevel: 50
  },
  '/api/admin/users/create': {
    permission: 'user.create',
    minRoleLevel: 80
  },
  '/api/admin/users/update': {
    permission: 'user.update',
    minRoleLevel: 80
  },
  '/api/admin/users/delete': {
    permission: 'user.delete',
    minRoleLevel: 100
  },

  // 角色管理
  '/api/admin/roles': {
    permission: 'role.read',
    minRoleLevel: 50
  },
  '/api/admin/roles/create': {
    permission: 'role.create',
    minRoleLevel: 100
  },
  '/api/admin/roles/update': {
    permission: 'role.update',
    minRoleLevel: 100
  },
  '/api/admin/roles/delete': {
    permission: 'role.delete',
    minRoleLevel: 100
  },
  '/api/admin/roles/assign': {
    permission: 'role.assign',
    minRoleLevel: 100
  },

  // 权限查看
  '/api/admin/permissions': {
    permission: 'system.audit',
    minRoleLevel: 80
  },

  // 产品管理
  '/api/admin/products': {
    permission: 'product.read',
    minRoleLevel: 10
  },
  '/api/admin/products/create': {
    permission: 'product.create',
    minRoleLevel: 50
  },
  '/api/admin/products/update': {
    permission: 'product.update',
    minRoleLevel: 50
  },
  '/api/admin/products/delete': {
    permission: 'product.delete',
    minRoleLevel: 80
  },

  // 新闻管理
  '/api/admin/news': {
    permission: 'news.read',
    minRoleLevel: 10
  },
  '/api/admin/news/create': {
    permission: 'news.create',
    minRoleLevel: 50
  },
  '/api/admin/news/update': {
    permission: 'news.update',
    minRoleLevel: 50
  },
  '/api/admin/news/delete': {
    permission: 'news.delete',
    minRoleLevel: 80
  },
  '/api/admin/news/publish': {
    permission: 'news.publish',
    minRoleLevel: 50
  },

  // 招聘管理
  '/api/admin/careers': {
    permission: 'career.read',
    minRoleLevel: 10
  },
  '/api/admin/careers/create': {
    permission: 'career.create',
    minRoleLevel: 50
  },
  '/api/admin/careers/update': {
    permission: 'career.update',
    minRoleLevel: 50
  },
  '/api/admin/careers/delete': {
    permission: 'career.delete',
    minRoleLevel: 80
  },

  // 系统管理
  '/api/admin/dashboard': {
    permission: 'system.dashboard',
    minRoleLevel: 10
  },
  '/api/admin/audit': {
    permission: 'system.audit',
    minRoleLevel: 80
  },
  '/api/admin/settings': {
    permission: 'system.settings',
    minRoleLevel: 100
  }
}

// 检查路由权限
export async function checkRoutePermission(
  request: NextRequest,
  pathname: string
): Promise<{ hasPermission: boolean; user?: any }> {
  try {
    // 获取认证用户
    const user = await getAuthUser(request)

    if (!user) {
      return { hasPermission: false }
    }

    // 检查用户是否激活
    if (!user.is_active) {
      return { hasPermission: false }
    }

    // 获取匹配的权限配置
    const permissionConfig = findMatchingPermissionConfig(pathname, request.method)

    if (!permissionConfig) {
      // 如果没有找到权限配置，默认允许访问
      return { hasPermission: true, user }
    }

    // 检查权限
    const hasRequiredPermission = hasPermission(
      user,
      permissionConfig.permission,
      permissionConfig.resource
    )

    if (!hasRequiredPermission) {
      return { hasPermission: false }
    }

    // 检查角色级别
    if (permissionConfig.minRoleLevel) {
      const maxLevel = Math.max(...user.roles.map(role => role.level))
      if (maxLevel < permissionConfig.minRoleLevel) {
        return { hasPermission: false }
      }
    }

    // 检查特定角色
    if (permissionConfig.requireRole) {
      const hasRequiredRole = permissionConfig.requireRole.some(requiredRole =>
        user.roles.some(userRole => userRole.name === requiredRole)
      )
      if (!hasRequiredRole) {
        return { hasPermission: false }
      }
    }

    return { hasPermission: true, user }
  } catch (error) {
    console.error('权限检查失败:', error)
    return { hasPermission: false }
  }
}

// 查找匹配的权限配置
function findMatchingPermissionConfig(pathname: string, method?: string): PermissionConfig | null {
  // 精确匹配
  if (routePermissions[pathname]) {
    return routePermissions[pathname]
  }

  // 根据HTTP方法添加操作类型
  if (method) {
    const actionPath = `${pathname}/${method.toLowerCase()}`
    if (routePermissions[actionPath]) {
      return routePermissions[actionPath]
    }
  }

  // 模糊匹配
  for (const [route, config] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return config
    }
  }

  return null
}

// 创建权限中间件响应
export function createPermissionDeniedResponse(message = '权限不足') {
  return NextResponse.json(
    {
      success: false,
      message,
      code: 'PERMISSION_DENIED'
    },
    { status: 403 }
  )
}

// 创建未认证响应
export function createUnauthorizedResponse(message = '请先登录') {
  return NextResponse.json(
    {
      success: false,
      message,
      code: 'UNAUTHORIZED'
    },
    { status: 401 }
  )
}

// 资源所有权检查
export async function checkResourceOwnership(
  user: any,
  resourceType: string,
  resourceId: string | number
): Promise<boolean> {
  try {
    // 超级管理员拥有所有资源权限
    if (user.roles.some((role: any) => role.name === 'super_admin')) {
      return true
    }

    switch (resourceType) {
      case 'user':
        // 用户只能修改自己的信息
        return user.id.toString() === resourceId.toString()

      case 'profile':
        // 个人资料只能修改自己的
        return user.id.toString() === resourceId.toString()

      default:
        // 其他资源默认不允许访问
        return false
    }
  } catch (error) {
    console.error('资源所有权检查失败:', error)
    return false
  }
}