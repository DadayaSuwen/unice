import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all active products with their categories
    const products = await prisma.product.findMany({
      where: { is_active: true },
      include: { category: true },
      orderBy: { created_at: "desc" },
    });

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      select: { name: true },
    });

    // Return the data
    return NextResponse.json({
      products,
      categories: ["全部类别", ...categories.map((cat) => cat.name)],
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
