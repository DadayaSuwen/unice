import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, hasPermission, createAuditLog } from './auth'
import { checkRoutePermission, createPermissionDeniedResponse, createUnauthorizedResponse } from './middleware'

// API处理器配置
interface ApiHandlerConfig {
  requireAuth?: boolean
  permission?: string
  resource?: string
  minRoleLevel?: number
  requireRole?: string[]
  allowSelf?: boolean // 允许用户操作自己的资源
}

// API处理器类型
type ApiHandler = (request: NextRequest, context?: any, user?: any) => Promise<NextResponse>

// 创建权限验证的API包装器
export function withAuth(
  handler: ApiHandler,
  config: ApiHandlerConfig = {}
): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      // 如果不需要认证，直接执行处理器
      if (!config.requireAuth) {
        return handler(request, context)
      }

      // 获取认证用户
      const user = await getAuthUser(request)

      if (!user) {
        return createUnauthorizedResponse()
      }

      // 检查用户是否激活
      if (!user.is_active) {
        return createUnauthorizedResponse('用户账户已被禁用')
      }

      // 检查权限
      if (config.permission) {
        const hasRequiredPermission = hasPermission(user, config.permission, config.resource)

        if (!hasRequiredPermission) {
          // 记录权限不足的审计日志
          await createAuditLog(
            user.id,
            'access_denied',
            'api',
            request.url,
            null,
            { required_permission: config.permission },
            request.headers.get('x-forwarded-for') || 'unknown',
            request.headers.get('user-agent') || 'unknown',
            false,
            `权限不足: 需要 ${config.permission} 权限`
          )

          return createPermissionDeniedResponse()
        }
      }

      // 检查角色级别
      if (config.minRoleLevel) {
        const maxLevel = Math.max(...user.roles.map(role => role.level))
        if (maxLevel < config.minRoleLevel) {
          return createPermissionDeniedResponse()
        }
      }

      // 检查特定角色
      if (config.requireRole) {
        const hasRequiredRole = config.requireRole.some(requiredRole =>
          user.roles.some(userRole => userRole.name === requiredRole)
        )
        if (!hasRequiredRole) {
          return createPermissionDeniedResponse()
        }
      }

      // 检查是否允许操作自己的资源
      if (config.allowSelf) {
        const url = new URL(request.url)
        const pathSegments = url.pathname.split('/')
        const resourceId = pathSegments[pathSegments.length - 1]

        // 如果资源ID是当前用户ID，允许访问
        if (resourceId === user.id.toString()) {
          return handler(request, context, user)
        }
      }

      // 执行处理器
      return handler(request, context, user)
    } catch (error) {
      console.error('API权限验证失败:', error)
      return NextResponse.json(
        { success: false, message: '服务器内部错误' },
        { status: 500 }
      )
    }
  }
}

// 创建路由级权限检查中间件
export function withRoutePermission(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      const pathname = new URL(request.url).pathname
      const { hasPermission: hasRoutePermission, user } = await checkRoutePermission(request, pathname)

      if (!hasRoutePermission) {
        if (!user) {
          return createUnauthorizedResponse()
        }
        return createPermissionDeniedResponse()
      }

      return handler(request, context, user)
    } catch (error) {
      console.error('路由权限检查失败:', error)
      return NextResponse.json(
        { success: false, message: '服务器内部错误' },
        { status: 500 }
      )
    }
  }
}

// 创建管理员权限包装器
export function withAdmin(handler: ApiHandler, minLevel = 50): ApiHandler {
  return withAuth(handler, {
    requireAuth: true,
    minRoleLevel: minLevel
  })
}

// 创建超级管理员权限包装器
export function withSuperAdmin(handler: ApiHandler): ApiHandler {
  return withAuth(handler, {
    requireAuth: true,
    requireRole: ['super_admin']
  })
}

// 创建API错误响应
export function createApiError(message: string, status = 400, code?: string) {
  return NextResponse.json(
    {
      success: false,
      message,
      code
    },
    { status }
  )
}

// 创建API成功响应
export function createApiSuccess(data: any, message?: string) {
  return NextResponse.json({
    success: true,
    message,
    data
  })
}

// 请求验证中间件
export function withValidation(
  handler: ApiHandler,
  schema: any
): ApiHandler {
  return async (request: NextRequest, context?: any, user?: any) => {
    try {
      let body: any = {}

      // 解析请求体
      if (request.method !== 'GET') {
        try {
          body = await request.json()
        } catch {
          body = {}
        }
      }

      // 验证请求数据
      const validationResult = schema.safeParse(body)
      if (!validationResult.success) {
        return createApiError(
          '请求参数验证失败',
          400,
          'VALIDATION_ERROR'
        )
      }

      // 将验证后的数据附加到请求中
      ;(request as any).validatedData = validationResult.data

      return handler(request, context, user)
    } catch (error) {
      console.error('请求验证失败:', error)
      return createApiError('服务器内部错误', 500)
    }
  }
}

// 日志记录中间件
export function withLogging(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any, user?: any) => {
    const startTime = Date.now()
    const url = new URL(request.url)

    try {
      const response = await handler(request, context, user)

      // 记录访问日志
      const duration = Date.now() - startTime
      console.log(`API访问: ${request.method} ${url.pathname} - ${response.status} (${duration}ms)`)

      // 记录审计日志
      if (user) {
        await createAuditLog(
          user.id,
          'api_access',
          'api',
          url.pathname,
          null,
          {
            method: request.method,
            path: url.pathname,
            status: response.status,
            duration
          },
          request.headers.get('x-forwarded-for') || 'unknown',
          request.headers.get('user-agent') || 'unknown',
          response.status < 400
        )
      }

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`API错误: ${request.method} ${url.pathname} - 错误 (${duration}ms)`, error)

      // 记录错误审计日志
      if (user) {
        await createAuditLog(
          user.id,
          'api_error',
          'api',
          url.pathname,
          null,
          {
            method: request.method,
            path: url.pathname,
            duration,
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          request.headers.get('x-forwarded-for') || 'unknown',
          request.headers.get('user-agent') || 'unknown',
          false,
          error instanceof Error ? error.message : 'Unknown error'
        )
      }

      throw error
    }
  }
}

// CORS中间件
export function withCors(handler: ApiHandler, options: {
  origins?: string[]
  methods?: string[]
  headers?: string[]
} = {}): ApiHandler {
  return async (request: NextRequest, context?: any, user?: any) => {
    const response = await handler(request, context, user)

    // 添加CORS头
    response.headers.set('Access-Control-Allow-Origin',
      options.origins?.join(', ') || '*'
    )
    response.headers.set('Access-Control-Allow-Methods',
      options.methods?.join(', ') || 'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.headers.set('Access-Control-Allow-Headers',
      options.headers?.join(', ') || 'Content-Type, Authorization'
    )

    return response
  }
}