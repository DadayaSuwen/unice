import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { message: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    // 1. 检查系统是否已经初始化过管理员 (保持原有逻辑)
    const existingAdminRole = await prisma.user.findFirst({
      where: {
        role: "admin",
      },
    });

    if (existingAdminRole) {
      return NextResponse.json(
        { message: "系统管理员已存在，无法重复初始化" },
        { status: 400 }
      );
    }

    // 2. 【修复】检查邮箱是否已被任何用户（包括普通用户）占用
    // schema.prisma 中 email 是 @unique
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingEmail) {
      return NextResponse.json({ message: "该邮箱已被注册" }, { status: 400 });
    }

    // 3. 【修复】处理用户名冲突
    // schema.prisma 中 username 是 @unique
    // 既然是硬编码用户名，我们需要确保它没被占用，或者生成一个唯一的
    let username = "系统管理员";
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      // 策略A：报错
      // return NextResponse.json({ message: "用户名'系统管理员'已被占用" }, { status: 400 });

      // 策略B（推荐）：自动添加随机后缀以确保唯一
      username = `系统管理员_${Math.floor(Math.random() * 1000)}`;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        role: "admin",
        is_active: true,
        username: username, // 使用处理过的 username
        // created_at 和 updated_at 由 Prisma @default(now()) 和 @updatedAt 自动处理，无需手动传入
      },
    });

    // 返回成功消息（不包含密码）
    const { password_hash: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      message: "管理员账户创建成功",
      admin: adminWithoutPassword,
    });
  } catch (error) {
    console.error("Init admin error:", error);
    return NextResponse.json({ message: "创建管理员失败" }, { status: 500 });
  }
}
