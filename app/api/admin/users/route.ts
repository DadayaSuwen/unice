import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (role) {
      where.userRoles = {
        some: {
          role: {
            name: role
          }
        }
      }
    }
    if (isActive !== null && isActive !== undefined) {
      where.is_active = isActive === 'true'
    }

    // 查询用户列表
    const users = await prisma.user.findMany({
      where,
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        _count: {
          select: {
            sessions: true,
            auditLogs: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    })

    // 获取总数
    const total = await prisma.user.count({ where })

    // 格式化用户数据
    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      avatar: user.avatar,
      is_active: user.is_active,
      email_verified: user.email_verified,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
      roles: user.userRoles.map(ur => ur.role),
      session_count: user._count.sessions,
      audit_log_count: user._count.auditLogs
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json(
      { success: false, message: '获取用户列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      roleIds,
      is_active = true
    } = body

    // 验证必填字段
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: '用户名、邮箱和密码为必填项' },
        { status: 400 }
      )
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '用户名或邮箱已存在' },
        { status: 400 }
      )
    }

    // 加密密码
    const password_hash = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        is_active,
        email_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // 分配角色
    if (roleIds && roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: roleIds.map((roleId: number) => ({
          user_id: user.id,
          role_id: roleId,
          assigned_at: new Date()
        }))
      })
    }

    // 创建审计日志
    await prisma.auditLog.create({
      data: {
        user_id: user.id,
        action: 'create',
        resource: 'user',
        resource_id: user.id.toString(),
        new_values: {
          username,
          email,
          first_name,
          last_name,
          phone,
          is_active,
          roleIds
        },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        success: true
      }
    })

    // 获取完整的用户信息（包含角色）
    const createdUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: '用户创建成功',
      data: createdUser
    })
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json(
      { success: false, message: '创建用户失败' },
      { status: 500 }
    )
  }
}