import type { Metadata } from "next";
import { getNews } from "@/lib/products";
import NewsClientWrapper from "./news-client-wrapper";

// Function to generate structured data for news
function NewsStructuredData({ news }: { news: any[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "江西联合化工新闻中心",
    description: "关注江西联合化工最新动态，把握化工行业发展脉搏",
    url: "https://unice.com/news",
    blogPost: news.map((item) => ({
      "@type": "BlogPosting",
      headline: item.title,
      description: item.excerpt || item.content?.substring(0, 200),
      datePublished: item.publish_date,
      author: {
        "@type": "Organization",
        name: "江西联合化工"
      },
      publisher: {
        "@type": "Organization",
        name: "江西联合化工",
        logo: {
          "@type": "ImageObject",
          url: "https://unice.com/uniche.png"
        }
      },
      url: `https://unice.com/news/${item.id}`,
      image: item.image_url || "https://unice.com/uniche.png"
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

export const metadata: Metadata = {
  title: "新闻中心 - 江西联合化工 | 企业动态与行业资讯",
  description: "江西联合化工新闻中心，提供最新的企业动态、行业资讯和产品信息。了解化工行业发展趋势，掌握江西联合化工最新进展。",
  keywords: ["新闻中心", "企业动态", "行业资讯", "化工新闻", "公司新闻", "江西联合化工", "化工行业", "企业发展"],
  openGraph: {
    title: "新闻中心 - 江西联合化工",
    description: "关注江西联合化工最新动态，把握化工行业发展脉搏",
    type: "website",
    locale: "zh_CN",
    siteName: "江西联合化工",
  },
  twitter: {
    card: "summary_large_image",
    title: "新闻中心 - 江西联合化工",
    description: "江西联合化工最新动态与行业资讯",
  },
  alternates: {
    canonical: "/news",
  },
};

export default async function NewsPage() {
  // Server-side data fetching for news
  const newsData = await getNews(1, 12);

  // Transform news data to match expected format
  const transformedNews = newsData.news.map(item => ({
    ...item,
    publish_date: item.publish_date.toString()
  }));

  // Add default categories if none exist
  const categoriesWithDefault = ["全部类别", "企业动态", "行业资讯", "产品发布"];

  return (
    <>
      {/* Structured Data for SEO */}
      <NewsStructuredData news={transformedNews} />

      {/* Main Content */}
      <NewsClientWrapper initialData={{
        news: transformedNews,
        categories: categoriesWithDefault,
        pagination: newsData.pagination
      }} />
    </>
  );
}
