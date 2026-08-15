import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapProduct, relToId } from '@/lib/mappers'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 1,
      disableErrors: true,
    })

    if (!product || !product.is_active) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const categoryId = relToId(product.category)
    let relatedProducts: any[] = []
    if (categoryId !== undefined) {
      const rel = await payload.find({
        collection: 'products',
        where: {
          category: { equals: categoryId },
          is_active: { equals: true },
          id: { not_equals: productId },
        },
        depth: 1,
        sort: '-createdAt',
        limit: 3,
      })
      relatedProducts = rel.docs.map(mapProduct)
    }

    return NextResponse.json({ product: mapProduct(product), relatedProducts })
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
