import { getPayloadClient } from './payload'
import { mapNews, mapProduct } from './mappers'

export async function getPopularProducts() {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: { is_active: { equals: true } },
      depth: 1,
      sort: '-createdAt',
      limit: 3,
    })
    return docs.map(mapProduct)
  } catch (error) {
    console.error('Failed to fetch popular products:', error)
    return []
  }
}

export async function getProducts(page = 1, limit = 12, category?: string) {
  try {
    const payload = await getPayloadClient()

    let categoryId: number | string | undefined
    if (category && category !== '全部类别') {
      const cat = await payload.find({
        collection: 'categories',
        where: { name: { equals: category } },
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

    return {
      products: result.docs.map(mapProduct),
      categories: cats.docs.map((c: any) => c.name),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return { products: [], categories: [], pagination: null }
  }
}

export async function getProductById(id: number) {
  try {
    const payload = await getPayloadClient()
    const product = await payload.findByID({
      collection: 'products',
      id,
      depth: 1,
      disableErrors: true,
    })
    if (!product || !product.is_active) return null
    return mapProduct(product)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export async function getNews(page = 1, limit = 10) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'news',
      where: { is_published: { equals: true } },
      depth: 1,
      sort: '-createdAt',
      page,
      limit,
    })
    return {
      news: result.docs.map(mapNews),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    }
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return { news: [], pagination: null }
  }
}

export async function getNewsById(id: number) {
  try {
    const payload = await getPayloadClient()
    const news = await payload.findByID({
      collection: 'news',
      id,
      depth: 1,
      disableErrors: true,
    })
    if (!news) return null
    return mapNews(news)
  } catch (error) {
    console.error('Failed to fetch news item:', error)
    return null
  }
}
