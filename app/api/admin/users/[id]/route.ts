import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: '无效的用户ID' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        sessions: {
          where: {
            is_active: true,
            expires_at: {
              gt: new Date()
            }
          },
          orderBy: {
            last_activity: 'desc'
          },
          take: 10
        },
        auditLogs: {
          orderBy: {
            created_at: 'desc'
          },
          take: 20
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      )
    }

    // 格式化用户数据，不包含密码哈希
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return NextResponse.json(
      { success: false, message: '获取用户详情失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: '无效的用户ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      avatar,
      is_active,
      roleIds
    } = body

    // 获取当前用户信息用于审计日志
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      )
    }

    // 检查用户名和邮箱是否已被其他用户使用
    if (username !== currentUser.username || email !== currentUser.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                { username },
                { email }
              ]
            }
          ]
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: '用户名或邮箱已被其他用户使用' },
          { status: 400 }
        )
      }
    }

    // 准备更新数据
    const updateData: any = {
      updated_at: new Date()
    }

    if (username !== undefined) updateData.username = username
    if (email !== undefined) updateData.email = email
    if (first_name !== undefined) updateData.first_name = first_name
    if (last_name !== undefined) updateData.last_name = last_name
    if (phone !== undefined) updateData.phone = phone
    if (avatar !== undefined) updateData.avatar = avatar
    if (is_active !== undefined) updateData.is_active = is_active

    // 如果提供了新密码，则更新密码
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10)
      updateData.password_updated = new Date()
    }

    // 记录旧值用于审计日志
    const oldValues = {
      username: currentUser.username,
      email: currentUser.email,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      phone: currentUser.phone,
      avatar: currentUser.avatar,
      is_active: currentUser.is_active
    }

    // 更新用户基本信息
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    // 更新角色分配
    if (roleIds !== undefined) {
      // 获取当前角色分配
      const currentRoles = await prisma.userRole.findMany({
        where: { user_id: userId }
      })

      const currentRoleIds = currentRoles.map(ur => ur.role_id)
      const newRoleIds = roleIds

      // 删除不再需要的角色
      const rolesToDelete = currentRoleIds.filter(id => !newRoleIds.includes(id))
      if (rolesToDelete.length > 0) {
        await prisma.userRole.deleteMany({
          where: {
            user_id: userId,
            role_id: {
              in: rolesToDelete
            }
          }
        })
      }

      // 添加新角色
      const rolesToAdd = newRoleIds.filter(id => !currentRoleIds.includes(id))
      if (rolesToAdd.length > 0) {
        await prisma.userRole.createMany({
          data: rolesToAdd.map((roleId: number) => ({
            user_id: userId,
            role_id: roleId,
            assigned_at: new Date()
          }))
        })
      }
    }

    // 创建审计日志
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action: 'update',
        resource: 'user',
        resource_id: userId.toString(),
        old_values: oldValues,
        new_values: updateData,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        success: true
      }
    })

    // 获取更新后的完整用户信息
    const fullUpdatedUser = await prisma.user.findUnique({
      where: { id: userId },
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
      message: '用户更新成功',
      data: fullUpdatedUser
    })
  } catch (error) {
    console.error('更新用户失败:', error)
    return NextResponse.json(
      { success: false, message: '更新用户失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: '无效的用户ID' },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      )
    }

    // 记录用户信息用于审计日志
    const userForAudit = {
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }

    // 删除用户（由于设置了级联删除，相关记录会自动删除）
    await prisma.user.delete({
      where: { id: userId }
    })

    // 创建审计日志
    await prisma.auditLog.create({
      data: {
        action: 'delete',
        resource: 'user',
        resource_id: userId.toString(),
        old_values: userForAudit,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        success: true
      }
    })

    return NextResponse.json({
      success: true,
      message: '用户删除成功'
    })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json(
      { success: false, message: '删除用户失败' },
      { status: 500 }
    )
  }
}