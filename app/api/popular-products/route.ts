import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapProduct } from '@/lib/mappers'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { is_active: { equals: true } },
      depth: 1,
      sort: '-createdAt',
      limit: 3,
    })
    return NextResponse.json(result.docs.map(mapProduct))
  } catch (error) {
    console.error('Failed to fetch popular products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular products' },
      { status: 500 }
    )
  }
}
