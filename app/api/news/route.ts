import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = { is_published: true };
    if (category && category !== "全部类别") {
      // 根据分类名称查找对应的分类ID
      const newsCategory = await prisma.newsCategory.findFirst({
        where: { name: category, is_active: true },
      });
      if (newsCategory) {
        where.category_id = newsCategory.id;
      }
    }

    // 获取分页新闻数据
    const [news, totalCount] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: [{ sort_order: "desc" }, { publish_date: "desc" }],
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    // 格式化新闻数据
    const formattedNews = news.map((item) => {
      // 处理标签数组
      const tags = item.tags as any;
      let parsedTags: string[] = [];

      try {
        if (typeof tags === "string") {
          parsedTags = JSON.parse(tags);
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      } catch (e) {
        console.warn("Failed to parse tags:", tags);
        parsedTags = [];
      }

      // 使用数据库中的分类信息，如果没有则根据type推断
      const categoryName = item.category?.name || getNewsCategory(item.type);

      return {
        id: item.id,
        title: item.title,
        excerpt:
          item.excerpt ||
          (item.content ? `${item.content.substring(0, 120)}...` : ""),
        content: item.content || "",
        type: getNewsTypeLabel(item.type),
        publish_date: item.publish_date,
        author: item.author || "江西联合化工",
        image_url: item.image_url,
        tags: parsedTags,
        read_time:
          item.read_time ||
          (item.content ? Math.ceil(item.content.length / 500) : 3),
        views_count: item.views_count || 0,
        category: categoryName,
        category_id: item.category_id,
        featured: item.featured || false,
      };
    });

    // 获取所有新闻类别
    const newsCategories = await prisma.newsCategory.findMany({
      where: { is_active: true },
      select: { name: true },
      orderBy: { sort_order: "asc" },
    });

    const categories = ["全部类别", ...newsCategories.map((cat) => cat.name)];

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      news: formattedNews,
      categories: categories,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("获取新闻数据失败:", error);
    return NextResponse.json({ error: "获取新闻数据失败" }, { status: 500 });
  }
}

// 新闻类型标签映射
function getNewsTypeLabel(type: string): string {
  const typeLabels: { [key: string]: string } = {
    news: "公司新闻",
    industry: "行业资讯",
    product: "产品发布",
    event: "企业活动",
    tech: "技术创新",
    responsibility: "社会责任",
  };
  return typeLabels[type] || "新闻";
}

// 根据新闻类型推断分类
function getNewsCategory(type: string): string {
  const categoryMap: { [key: string]: string } = {
    news: "公司新闻",
    industry: "行业资讯",
    product: "产品发布",
    event: "企业活动",
    tech: "技术创新",
    responsibility: "社会责任",
  };
  return categoryMap[type] || "公司新闻";
}
