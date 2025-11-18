import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleName = searchParams.get('module')
    const actionName = searchParams.get('action')

    // 构建查询条件
    const where: any = {}
    if (moduleName) {
      where.module = moduleName
    }
    if (actionName) {
      where.action = actionName
    }

    // 查询权限列表
    const permissions = await prisma.permission.findMany({
      where,
      include: {
        rolePermissions: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                display_name: true
              }
            }
          }
        },
        _count: {
          select: {
            rolePermissions: true
          }
        }
      },
      orderBy: [
        { module: 'asc' },
        { action: 'asc' },
        { resource: 'asc' }
      ]
    })

    // 按模块分组权限
    const groupedPermissions = permissions.reduce((acc: any, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = []
      }
      acc[permission.module].push({
        id: permission.id,
        name: permission.name,
        display_name: permission.display_name,
        description: permission.description,
        action: permission.action,
        resource: permission.resource,
        is_system: permission.is_system,
        created_at: permission.created_at,
        roles: permission.rolePermissions.map(rp => rp.role),
        role_count: permission._count.rolePermissions
      })
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        permissions,
        groupedPermissions
      }
    })
  } catch (error) {
    console.error('获取权限列表失败:', error)
    return NextResponse.json(
      { success: false, message: '获取权限列表失败' },
      { status: 500 }
    )
  }
}