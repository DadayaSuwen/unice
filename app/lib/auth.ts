import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export interface JWTPayload {
  userId: number
  email: string
  username: string
  roles: string[]
  permissions: string[]
}

export interface AuthUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  avatar?: string
  is_active: boolean
  email_verified: boolean
  roles: Array<{
    id: number
    name: string
    display_name: string
    level: number
  }>
  permissions: string[]
  last_login?: Date
}

// JWT工具函数
export const jwtUtils = {
  sign: (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
  },

  verify: (token: string): JWTPayload | null => {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  }
}

// 密码验证
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// 获取用户完整信息（包含角色和权限）
export const getUserWithPermissions = async (userId: number): Promise<AuthUser | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user || !user.is_active) {
      return null
    }

    // 收集所有权限
    const permissions = user.userRoles.flatMap(ur =>
      ur.role.rolePermissions.map(rp => rp.permission.name)
    )

    // 移除重复权限
    const uniquePermissions = [...new Set(permissions)]

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
      is_active: user.is_active,
      email_verified: user.email_verified,
      roles: user.userRoles.map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        display_name: ur.role.display_name,
        level: ur.role.level
      })),
      permissions: uniquePermissions,
      last_login: user.last_login
    }
  } catch (error) {
    console.error('获取用户权限信息失败:', error)
    return null
  }
}

// 权限检查函数
export const hasPermission = (user: AuthUser | null, permission: string, resource?: string): boolean => {
  if (!user || !user.is_active) {
    return false
  }

  // 超级管理员拥有所有权限
  if (user.roles.some(role => role.name === 'super_admin')) {
    return true
  }

  // 检查具体权限
  if (resource) {
    // 检查特定资源的权限
    return user.permissions.includes(`${permission}.${resource}`) ||
           user.permissions.includes(`${permission}.all`) ||
           user.permissions.includes(`${permission}.own`)
  } else {
    // 检查通用权限
    return user.permissions.includes(permission)
  }
}

// 检查用户是否有足够的角色级别
export const hasRoleLevel = (user: AuthUser | null, minLevel: number): boolean => {
  if (!user || !user.is_active) {
    return false
  }

  const maxLevel = Math.max(...user.roles.map(role => role.level))
  return maxLevel >= minLevel
}

// 检查用户是否拥有特定角色
export const hasRole = (user: AuthUser | null, roleName: string): boolean => {
  if (!user || !user.is_active) {
    return false
  }

  return user.roles.some(role => role.name === roleName)
}

// 从请求中获取认证用户
export const getAuthUser = async (request: NextRequest): Promise<AuthUser | null> => {
  try {
    // 从Authorization header中获取token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const payload = jwtUtils.verify(token)

    if (!payload) {
      return null
    }

    // 检查用户会话是否仍然有效
    const session = await prisma.userSession.findFirst({
      where: {
        token,
        is_active: true,
        expires_at: {
          gt: new Date()
        }
      }
    })

    if (!session) {
      return null
    }

    // 更新最后活动时间
    await prisma.userSession.update({
      where: { id: session.id },
      data: { last_activity: new Date() }
    })

    // 获取用户完整信息
    return await getUserWithPermissions(payload.userId)
  } catch (error) {
    console.error('获取认证用户失败:', error)
    return null
  }
}

// 创建用户会话
export const createUserSession = async (
  userId: number,
  token: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> => {
  try {
    // 设置token过期时间为24小时
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    await prisma.userSession.create({
      data: {
        user_id: userId,
        token,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_active: true,
        last_activity: new Date(),
        expires_at: expiresAt
      }
    })
  } catch (error) {
    console.error('创建用户会话失败:', error)
    throw error
  }
}

// 注销用户会话
export const revokeUserSession = async (token: string): Promise<void> => {
  try {
    await prisma.userSession.updateMany({
      where: { token },
      data: {
        is_active: false
      }
    })
  } catch (error) {
    console.error('注销用户会话失败:', error)
    throw error
  }
}

// 注销用户所有会话
export const revokeAllUserSessions = async (userId: number): Promise<void> => {
  try {
    await prisma.userSession.updateMany({
      where: { user_id: userId },
      data: {
        is_active: false
      }
    })
  } catch (error) {
    console.error('注销用户所有会话失败:', error)
    throw error
  }
}

// 记录审计日志
export const createAuditLog = async (
  userId: number | null,
  action: string,
  resource?: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  userAgent?: string,
  success: boolean = true,
  errorMessage?: string
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action,
        resource,
        resource_id: resourceId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: ipAddress,
        user_agent: userAgent,
        success,
        error_message: errorMessage
      }
    })
  } catch (error) {
    console.error('创建审计日志失败:', error)
    // 审计日志失败不应该影响主要业务流程
  }
}