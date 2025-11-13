import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 获取所有活跃的职位，按创建时间倒序
    const careers = await prisma.career.findMany({
      where: {
        is_active: true
      },
      orderBy: [
        { created_at: 'desc' }
      ],
      select: {
        id: true,
        position: true,
        department: true,
        location: true,
        type: true,
        experience_requirement: true,
        description: true,
        requirements: true,
        responsibilities: true,
        application_deadline: true,
        created_at: true,
        updated_at: true
      }
    });

    // 格式化响应数据
    const formattedCareers = careers.map(career => {
      const requirements = career.requirements as any;
      const responsibilities = career.responsibilities as any;

      // 处理 JSON 字符串和数组的情况
      let parsedRequirements: string[] = [];
      let parsedResponsibilities: string[] = [];

      try {
        // 如果是字符串，尝试解析JSON
        if (typeof requirements === 'string') {
          parsedRequirements = JSON.parse(requirements);
        } else if (Array.isArray(requirements)) {
          parsedRequirements = requirements;
        }
      } catch (e) {
        console.warn('Failed to parse requirements:', requirements);
        parsedRequirements = [];
      }

      try {
        // 如果是字符串，尝试解析JSON
        if (typeof responsibilities === 'string') {
          parsedResponsibilities = JSON.parse(responsibilities);
        } else if (Array.isArray(responsibilities)) {
          parsedResponsibilities = responsibilities;
        }
      } catch (e) {
        console.warn('Failed to parse responsibilities:', responsibilities);
        parsedResponsibilities = [];
      }

      return {
        id: career.id,
        position: career.position,
        department: career.department || '未指定部门',
        location: career.location || '星火工业园',
        type: getJobTypeLabel(career.type),
        experience: career.experience_requirement || '经验不限',
        description: career.description || '我们正在寻找优秀的人才加入我们的团队。',
        requirements: parsedRequirements,
        responsibilities: parsedResponsibilities,
        application_deadline: career.application_deadline,
        created_at: career.created_at,
        updated_at: career.updated_at
      };
    });

    return NextResponse.json(formattedCareers);
  } catch (error) {
    console.error("获取职位信息失败:", error);
    return NextResponse.json(
      { error: "获取职位信息失败" },
      { status: 500 }
    );
  }
}

// 职位类型标签映射
function getJobTypeLabel(type: string): string {
  const typeLabels: { [key: string]: string } = {
    'full_time': '全职',
    'part_time': '兼职',
    'contract': '合同工',
    'internship': '实习',
    'remote': '远程'
  };
  return typeLabels[type] || '全职';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    const requiredFields = ['position', 'department'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `缺少必填字段: ${field}` },
          { status: 400 }
        );
      }
    }

    // 创建新职位
    const career = await prisma.career.create({
      data: {
        position: body.position,
        department: body.department,
        location: body.location,
        type: body.type || 'full_time',
        experience_requirement: body.experience_requirement,
        description: body.description,
        requirements: body.requirements || [],
        responsibilities: body.responsibilities || [],
        application_deadline: body.application_deadline ? new Date(body.application_deadline) : null,
        is_active: body.is_active !== false
      }
    });

    return NextResponse.json(career, { status: 201 });
  } catch (error) {
    console.error("创建职位失败:", error);
    return NextResponse.json(
      { error: "创建职位失败" },
      { status: 500 }
    );
  }
}