import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params.params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get specific product with its category
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(productId),
        is_active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get related products from the same category (excluding current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category_id: product.category_id,
        is_active: true,
        id: {
          not: parseInt(productId),
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 3, // Limit to 3 related products
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
