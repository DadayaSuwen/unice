import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapProduct } from '@/lib/mappers'

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
        collection: 'categories',
        where: { name: { equals: category }, is_active: { equals: true } },
        limit: 1,
      })
      categoryId = cat.docs[0]?.id
    }

    const where: Record<string, unknown> = { is_active: { equals: true } }
    if (categoryId !== undefined) where.category = { equals: categoryId }

    const result = await payload.find({
      collection: 'products',
      where,
      depth: 1,
      sort: '-createdAt',
      page,
      limit,
    })

    const cats = await payload.find({
      collection: 'categories',
      where: { is_active: { equals: true } },
      limit: 100,
      sort: 'name',
    })

    return NextResponse.json({
      products: result.docs.map(mapProduct),
      categories: cats.docs.map((c: any) => c.name),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
