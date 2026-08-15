import type { Metadata } from "next";
import { getPopularProducts } from "@/lib/products";
import { getHomePage, seoToMetadata } from "@/lib/globals";
import HomepageClientWrapper from "@/components/homepage-client-wrapper";
import { ProductStructuredData, OrganizationStructuredData, WebsiteStructuredData } from "@/components/structured-data";

const FALLBACK_META = {
  title: "江西联合化工 - 专业化工原料与精细化学品制造商 | 首页",
  description: "江西联合化工是一家专业的化工企业，致力于提供高品质的化工原料、精细化学品和专用化学品。我们拥有20年行业经验，为全球客户提供卓越的化工解决方案。",
};

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  const seo = (home as any).seo || {};
  return seoToMetadata(seo, FALLBACK_META);
}

export default async function Home() {
  const [popularProducts, homePage] = await Promise.all([
    getPopularProducts(),
    getHomePage(),
  ]);

  return (
    <>
      {/* Structured Data for SEO */}
      <WebsiteStructuredData />
      <OrganizationStructuredData />
      <ProductStructuredData products={popularProducts} />

      {/* Main Content */}
      <HomepageClientWrapper popularProducts={popularProducts} homePage={homePage} />
    </>
  );
}
