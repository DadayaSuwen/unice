import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured") === "true";

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = { is_active: true };
    if (category && category !== "全部类别") {
      where.category = {
        name: category,
      };
    }

    // 如果是featured产品，获取最新的4个产品作为推荐
    const orderBy: Prisma.ProductOrderByWithRelationInput = featured
      ? { created_at: "desc" }
      : { created_at: "desc" };

    // 获取分页产品数据
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      select: { name: true },
    });

    const totalPages = Math.ceil(totalCount / limit);

    // Return the data
    return NextResponse.json({
      products,
      categories: [...categories.map((cat) => cat.name)],
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
