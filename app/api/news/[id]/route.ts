import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapNews, relToId } from '@/lib/mappers'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const newsId = parseInt(id)
    if (isNaN(newsId) || newsId <= 0) {
      return NextResponse.json({ error: '无效的新闻ID' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const news = await payload.findByID({
      collection: 'news',
      id: newsId,
      depth: 1,
      disableErrors: true,
    })

    if (!news || !news.is_published) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    await payload.update({
      collection: 'news',
      id: newsId,
      data: { views_count: (news.views_count || 0) + 1 },
    })

    const formatted = mapNews(news)
    formatted.views_count = (news.views_count || 0) + 1
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('获取新闻详情失败:', error)
    return NextResponse.json({ error: '获取新闻详情失败' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const newsId = parseInt(id)
    const body = await request.json().catch(() => ({}))
    const limit = parseInt(body.limit) || 4

    if (isNaN(newsId) || newsId <= 0) {
      return NextResponse.json({ error: '无效的新闻ID' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const current = await payload.findByID({
      collection: 'news',
      id: newsId,
      depth: 1,
      disableErrors: true,
    })
    if (!current) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    const categoryId = relToId(current.category)
    const conditions: Record<string, unknown>[] = []
    if (categoryId !== undefined) conditions.push({ category: { equals: categoryId } })
    conditions.push({ type: { equals: current.type } })

    const result = await payload.find({
      collection: 'news',
      where: {
        and: [
          { id: { not_equals: newsId } },
          { is_published: { equals: true } },
          { or: conditions },
        ],
      },
      depth: 1,
      sort: '-publish_date',
      limit,
    })

    return NextResponse.json(result.docs.map(mapNews))
  } catch (error) {
    console.error('获取相关新闻失败:', error)
    return NextResponse.json({ error: '获取相关新闻失败' }, { status: 500 })
  }
}
