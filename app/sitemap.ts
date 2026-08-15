import type { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://unice.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const payload = await getPayloadClient();

    const [products, news, careers] = await Promise.all([
      payload.find({ collection: "products", where: { is_active: { equals: true } }, limit: 500, depth: 0 }),
      payload.find({ collection: "news", where: { is_published: { equals: true } }, limit: 500, depth: 0 }),
      payload.find({ collection: "careers", where: { is_active: { equals: true } }, limit: 500, depth: 0 }),
    ]);

    const productRoutes = products.docs.map((p: any) => ({
      url: `${BASE}/products/${p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    const newsRoutes = news.docs.map((n: any) => ({
      url: `${BASE}/news/${n.id}`,
      lastModified: n.updatedAt ? new Date(n.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
    const careerRoutes = careers.docs.map((c: any) => ({
      url: `${BASE}/careers`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...productRoutes, ...newsRoutes, ...careerRoutes];
  } catch (e) {
    console.error("sitemap generation failed:", e);
    return staticRoutes;
  }
}
