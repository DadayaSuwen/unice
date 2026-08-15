import type { Metadata } from "next";
import { getPageHeaders, seoToMetadata } from "@/lib/globals";
import CareersClient from "./CareersClient";

const FALLBACK_META: Metadata = {
  title: "加入我们 - 江西联合化工 | 招聘与人才",
  description: "寻找志同道合的优秀人才，在江西联合化工开启您的职业新征程",
};

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const headers = await getPageHeaders();
  return seoToMetadata((headers as any).seo || {}, FALLBACK_META);
}

export default async function CareersPage() {
  const headers = await getPageHeaders();
  return <CareersClient pageHeader={headers.careersPage} />;
}
