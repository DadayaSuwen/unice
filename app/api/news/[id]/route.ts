import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const newsId = parseInt(resolvedParams.id);

    console.log('API called with ID:', resolvedParams.id, 'Parsed:', newsId, 'isNaN:', isNaN(newsId));

    if (isNaN(newsId) || newsId <= 0) {
      return NextResponse.json(
        { error: "无效的新闻ID" },
        { status: 400 }
      );
    }

    // 获取新闻详情
    const news = await prisma.news.findUnique({
      where: {
        id: newsId,
        is_published: true
      },
      include: {
        category: true
      } as const
    });

    if (!news) {
      return NextResponse.json(
        { error: "新闻不存在" },
        { status: 404 }
      );
    }

    // 更新浏览次数
    await prisma.news.update({
      where: { id: newsId },
      data: { views_count: { increment: 1 } }
    });

    // 处理标签数组
    const tags = news.tags as any;
    let parsedTags: string[] = [];

    try {
      if (typeof tags === 'string') {
        parsedTags = JSON.parse(tags);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    } catch (e) {
      console.warn('Failed to parse tags:', tags);
      parsedTags = [];
    }

    // 格式化响应数据
    const formattedNews = {
      id: news.id,
      title: news.title,
      excerpt: news.excerpt,
      content: news.content || '',
      type: getNewsTypeLabel(news.type),
      publish_date: news.publish_date,
      author: news.author || '联合化工',
      image_url: news.image_url,
      tags: parsedTags,
      read_time: news.read_time || (news.content ? Math.ceil(news.content.length / 500) : 3),
      views_count: news.views_count || 1, // 本次访问已经+1了
      category: news.category?.name || getNewsCategory(news.type),
      featured: news.featured || false,
      created_at: news.created_at,
      updated_at: news.updated_at
    };

    return NextResponse.json(formattedNews);
  } catch (error) {
    console.error("获取新闻详情失败:", error);
    return NextResponse.json(
      { error: "获取新闻详情失败" },
      { status: 500 }
    );
  }
}

// 获取相关新闻
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const newsId = parseInt(resolvedParams.id);
    const { limit = 4 } = await request.json();

    if (isNaN(newsId) || newsId <= 0) {
      return NextResponse.json(
        { error: "无效的新闻ID" },
        { status: 400 }
      );
    }

    // 获取当前新闻
    const currentNews = await prisma.news.findUnique({
      where: { id: newsId },
      include: {
        category: true
      } as const
    });

    if (!currentNews) {
      return NextResponse.json(
        { error: "新闻不存在" },
        { status: 404 }
      );
    }

    // 获取相关新闻（排除当前新闻）
    const relatedNews = await prisma.news.findMany({
      where: {
        AND: [
          { id: { not: newsId } },
          { is_published: true },
          {
            OR: [
              { category_id: currentNews.category_id },
              { type: currentNews.type }
            ]
          }
        ]
      },
      include: {
        category: true
      },
      orderBy: [
        { featured: 'desc' },
        { publish_date: 'desc' }
      ],
      take: limit
    });

    // 格式化相关新闻数据
    const formattedRelatedNews = relatedNews.map(item => {
      // 处理标签数组
      const tags = item.tags as any;
      let parsedTags: string[] = [];

      try {
        if (typeof tags === 'string') {
          parsedTags = JSON.parse(tags);
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      } catch (e) {
        console.warn('Failed to parse tags:', tags);
        parsedTags = [];
      }

      return {
        id: item.id,
        title: item.title,
        excerpt: item.excerpt || (item.content ? `${item.content.substring(0, 120)}...` : ''),
        type: getNewsTypeLabel(item.type),
        publish_date: item.publish_date,
        author: item.author || '联合化工',
        image_url: item.image_url,
        tags: parsedTags,
        read_time: item.read_time || (item.content ? Math.ceil(item.content.length / 500) : 3),
        views_count: item.views_count || 0,
        category: item.category?.name || getNewsCategory(item.type),
        featured: item.featured || false
      };
    });

    return NextResponse.json(formattedRelatedNews);
  } catch (error) {
    console.error("获取相关新闻失败:", error);
    return NextResponse.json(
      { error: "获取相关新闻失败" },
      { status: 500 }
    );
  }
}

// 新闻类型标签映射
function getNewsTypeLabel(type: string): string {
  const typeLabels: { [key: string]: string } = {
    'news': '公司新闻',
    'industry': '行业资讯',
    'product': '产品发布',
    'event': '企业活动',
    'tech': '技术创新',
    'responsibility': '社会责任'
  };
  return typeLabels[type] || '新闻';
}

// 根据新闻类型推断分类
function getNewsCategory(type: string): string {
  const categoryMap: { [key: string]: string } = {
    'news': '公司新闻',
    'industry': '行业资讯',
    'product': '产品发布',
    'event': '企业活动',
    'tech': '技术创新',
    'responsibility': '社会责任'
  };
  return categoryMap[type] || '公司新闻';
}