import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get top 3 popular products (for homepage preview)
    // In a real application, this could be based on sales, views, ratings, etc.
    const popularProducts = await prisma.product.findMany({
      where: { is_active: true },
      include: { category: true },
      orderBy: { created_at: "desc" }, // Simple approach - using newest products as popular
      take: 3, // Limit to 3 products for homepage
    });

    return NextResponse.json(popularProducts);
  } catch (error) {
    console.error('Failed to fetch popular products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular products' },
      { status: 500 }
    );
  }
}