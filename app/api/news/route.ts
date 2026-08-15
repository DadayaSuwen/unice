import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapNews } from '@/lib/mappers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1') || 1
    const limit = parseInt(searchParams.get('limit') || '12') || 12
    const category = searchParams.get('category') || ''

    const payload = await getPayloadClient()

    let categoryId: number | string | undefined
    if (category && category !== '全部类别') {
      const cat = await payload.find({
        collection: 'news-categories',
        where: { name: { equals: category }, is_active: { equals: true } },
        limit: 1,
      })
      categoryId = cat.docs[0]?.id
    }

    const where: Record<string, unknown> = { is_published: { equals: true } }
    if (categoryId !== undefined) where.category = { equals: categoryId }

    const result = await payload.find({
      collection: 'news',
      where,
      depth: 1,
      sort: '-sort_order,-publish_date',
      page,
      limit,
    })

    const cats = await payload.find({
      collection: 'news-categories',
      where: { is_active: { equals: true } },
      limit: 100,
      sort: 'sort_order',
    })

    return NextResponse.json({
      news: result.docs.map(mapNews),
      categories: ['全部类别', ...cats.docs.map((c: any) => c.name)],
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('获取新闻数据失败:', error)
    return NextResponse.json({ error: '获取新闻数据失败' }, { status: 500 })
  }
}
