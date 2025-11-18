import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { display_name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (isActive !== null && isActive !== undefined) {
      where.is_active = isActive === 'true'
    }

    // 查询角色列表
    const roles = await prisma.role.findMany({
      where,
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        userRoles: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true
              }
            }
          }
        },
        _count: {
          select: {
            userRoles: true,
            rolePermissions: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        level: 'desc'
      }
    })

    // 获取总数
    const total = await prisma.role.count({ where })

    // 格式化角色数据
    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      display_name: role.display_name,
      description: role.description,
      level: role.level,
      is_system: role.is_system,
      is_active: role.is_active,
      created_at: role.created_at,
      updated_at: role.updated_at,
      permissions: role.rolePermissions.map(rp => rp.permission),
      users: role.userRoles.map(ur => ur.user),
      user_count: role._count.userRoles,
      permission_count: role._count.rolePermissions
    }))

    return NextResponse.json({
      success: true,
      data: {
        roles: formattedRoles,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return NextResponse.json(
      { success: false, message: '获取角色列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      display_name,
      description,
      level,
      permissionIds,
      is_active = true
    } = body

    // 验证必填字段
    if (!name || !display_name) {
      return NextResponse.json(
        { success: false, message: '角色名称和显示名称为必填项' },
        { status: 400 }
      )
    }

    // 检查角色名称是否已存在
    const existingRole = await prisma.role.findUnique({
      where: { name }
    })

    if (existingRole) {
      return NextResponse.json(
        { success: false, message: '角色名称已存在' },
        { status: 400 }
      )
    }

    // 创建角色
    const role = await prisma.role.create({
      data: {
        name,
        display_name,
        description,
        level: level || 0,
        is_active,
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // 分配权限
    if (permissionIds && permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId: number) => ({
          role_id: role.id,
          permission_id: permissionId,
          created_at: new Date()
        }))
      })
    }

    // 创建审计日志
    await prisma.auditLog.create({
      data: {
        action: 'create',
        resource: 'role',
        resource_id: role.id.toString(),
        new_values: {
          name,
          display_name,
          description,
          level,
          is_active,
          permissionIds
        },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        success: true
      }
    })

    // 获取完整的角色信息（包含权限）
    const createdRole = await prisma.role.findUnique({
      where: { id: role.id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: '角色创建成功',
      data: createdRole
    })
  } catch (error) {
    console.error('创建角色失败:', error)
    return NextResponse.json(
      { success: false, message: '创建角色失败' },
      { status: 500 }
    )
  }
}