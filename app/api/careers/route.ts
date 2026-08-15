import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'careers',
      where: { is_active: { equals: true } },
      depth: 0,
      sort: '-createdAt',
      limit: 100,
    })

    const formatted = result.docs.map((career: any) => ({
      id: career.id,
      position: career.position,
      department: career.department || '未指定部门',
      location: career.location || '星火工业园',
      type: getJobTypeLabel(career.type),
      experience: career.experience_requirement || '经验不限',
      description: career.description || '我们正在寻找优秀的人才加入我们的团队。',
      requirements: (career.requirements || []).map((r: any) => r.text),
      responsibilities: (career.responsibilities || []).map((r: any) => r.text),
      application_deadline: career.application_deadline ?? null,
      created_at: career.createdAt,
      updated_at: career.updatedAt,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('获取职位信息失败:', error)
    return NextResponse.json({ error: '获取职位信息失败' }, { status: 500 })
  }
}

function getJobTypeLabel(type?: string): string {
  const map: Record<string, string> = {
    full_time: '全职',
    part_time: '兼职',
    contract: '合同工',
    internship: '实习',
    remote: '远程',
  }
  return map[type || ''] || '全职'
}
