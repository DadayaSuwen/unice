import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 这里可以添加token黑名单逻辑
    // 简单的登出响应，客户端会清除localStorage中的token

    return NextResponse.json({
      message: "登出成功",
    });

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}