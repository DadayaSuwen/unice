import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 修复 1: 从环境变量读取密钥，如果没有则抛错或使用 fallback (仅限开发环境)
const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-do-not-use-in-prod";

export async function POST(request: Request) {
  try {
    const { email, password, userAgent } = await request.json(); // 假设前端传了 userAgent，或者从 headers 获取

    if (!email || !password) {
      return NextResponse.json(
        { message: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    // 1. 查找用户
    const user = await prisma.user.findUnique({
      where: { email }, // email 是 @unique，应该用 findUnique [cite: 26]
    });

    if (!user) {
      // 为了安全，不要明确提示"用户不存在"，防止枚举攻击
      return NextResponse.json({ message: "账号或密码错误" }, { status: 401 });
    }

    // 2. 检查账户是否被禁用
    if (!user.is_active) {
      return NextResponse.json({ message: "账户已被禁用" }, { status: 403 });
    }

    // 3. 修复: 检查账户是否被锁定
    if (user.locked_until && new Date() < user.locked_until) {
      return NextResponse.json(
        {
          message: `账户已锁定，请在 ${user.locked_until.toLocaleTimeString()} 后重试`,
        },
        { status: 403 }
      );
    }

    // 4. 验证密码
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      // 登录失败逻辑：增加失败次数，必要时锁定
      const newAttempts = user.login_attempts + 1;
      let lockedUntil = null;

      // 策略：失败5次锁定15分钟
      if (newAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          login_attempts: newAttempts,
          locked_until: lockedUntil,
        },
      });

      // 记录失败的审计日志 [cite: 45]
      await prisma.auditLog.create({
        data: {
          action: "login_failed",
          resource: "user",
          ip_address: request.headers.get("x-forwarded-for") || "unknown",
          user_agent: request.headers.get("user-agent"),
          success: false,
          error_message: "Password mismatch",
        },
      });

      return NextResponse.json({ message: "账号或密码错误" }, { status: 401 });
    }

    // --- 登录成功逻辑 ---

    // 5. 生成 Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时后

    // 6. 修复: 执行数据库更新事务 (更新用户状态 + 创建Session + 记录审计)
    await prisma.$transaction([
      // A. 更新用户: 重置失败次数，更新最后登录时间 [cite: 29, 30]
      prisma.user.update({
        where: { id: user.id },
        data: {
          last_login: new Date(),
          login_attempts: 0,
          locked_until: null,
        },
      }),

      // B. 创建 Session 记录 (利用 Schema 中的 UserSession)
      prisma.userSession.create({
        data: {
          user_id: user.id,
          token: token,
          expires_at: expiresAt,
          user_agent: request.headers.get("user-agent"),
          ip_address: request.headers.get("x-forwarded-for"),
        },
      }),

      // C. 记录成功的审计日志 (利用 Schema 中的 AuditLog) [cite: 45]
      prisma.auditLog.create({
        data: {
          user_id: user.id,
          action: "login",
          resource: "auth",
          success: true,
          ip_address: request.headers.get("x-forwarded-for"),
          user_agent: request.headers.get("user-agent"),
        },
      }),
    ]);

    // 7. 返回结果 (剔除敏感信息)
    const { password_hash, password_updated, ...userWithoutSensitive } = user;

    return NextResponse.json({
      message: "登录成功",
      token,
      user: userWithoutSensitive,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
