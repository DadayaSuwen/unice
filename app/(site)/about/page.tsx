import type { Metadata } from "next";
import { getAboutPage, seoToMetadata } from "@/lib/globals";
import AboutPageClient from "./AboutPageClient";

const FALLBACK_META: Metadata = {
  title: "关于我们 - 江西联合化工 | 企业介绍与公司文化",
  description: "了解江西联合化工的企业文化与发展历程，探索我们20年来的专业与创新",
};

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return seoToMetadata((about as any).seo || {}, FALLBACK_META);
}

export default async function AboutPage() {
  const aboutPage = await getAboutPage();
  return <AboutPageClient data={aboutPage} />;
}
