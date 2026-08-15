import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsById } from "@/lib/products";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings, seoToMetadata } from "@/lib/globals";
import NewsDetailView from "./NewsDetailView";

interface PageProps { params: Promise<{ id: string }> }

async function getRelatedNews(newsId: number, limit = 4) {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "news",
      where: { is_published: { equals: true }, id: { not_equals: newsId } },
      sort: "-createdAt",
      limit,
      depth: 0,
    });
    return res.docs.map((n: any) => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt || "",
      type: n.type,
      publish_date: n.publish_date || n.createdAt,
      read_time: n.read_time,
    }));
  } catch { return []; }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await getNewsById(parseInt(id));
  if (!news) return { title: "新闻未找到" };
  const settings = await getSiteSettings();
  return seoToMetadata(
    (news as any).seo || {},
    {
      title: `${news.title} - ${settings.siteName}`,
      description: news.excerpt || `${news.title}，来自${settings.siteName}`,
    },
  );
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const news = await getNewsById(parseInt(id));
  if (!news) notFound();
  const relatedNews = await getRelatedNews(news.id);
  return <NewsDetailView news={news} relatedNews={relatedNews} />;
}
