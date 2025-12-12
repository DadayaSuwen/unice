import { prisma } from '@/lib/prisma';

export async function getPopularProducts() {
  try {
    // Get top 3 popular products (for homepage preview)
    const popularProducts = await prisma.product.findMany({
      where: { is_active: true },
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: { created_at: "desc" },
      take: 3,
    });

    return popularProducts;
  } catch (error) {
    console.error('Failed to fetch popular products:', error);
    return [];
  }
}

export async function getProducts(page: number = 1, limit: number = 12, category?: string) {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { is_active: true };
    if (category && category !== "全部类别") {
      where.category = {
        name: category
      };
    }

    // Get products and total count
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              name: true
            }
          }
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    // Get all categories for filter
    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: {
            is_active: true
          }
        }
      },
      select: {
        name: true
      },
      orderBy: { name: "asc" }
    });

    const categoryNames = categories.map(cat => cat.name);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      products,
      categories: categoryNames,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      products: [],
      categories: [],
      pagination: null
    };
  }
}

export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id, is_active: true },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function getNews(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [news, totalCount] = await Promise.all([
      prisma.news.findMany({
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.news.count()
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      news,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return {
      news: [],
      pagination: null
    };
  }
}

export async function getNewsById(id: number) {
  try {
    const newsItem = await prisma.news.findUnique({
      where: { id }
    });

    return newsItem;
  } catch (error) {
    console.error('Failed to fetch news item:', error);
    return null;
  }
}