// app/(site)/layout.tsx — 站点根布局（多根布局：与 (payload) 各带自己的 <html>）
import type { Metadata } from "next";
import "@/globals.scss";
import RootClientWrapper from "@/components/root-client-wrapper";
import { getSiteSettings, getNavigation, seoToMetadata } from "@/lib/globals";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return seoToMetadata(settings.seo, {
    title: `${settings.siteName}官方网站`,
    description: "专业的化工企业官方网站",
  });
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [siteSettings, navigationItems] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);

  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <RootClientWrapper
          siteSettings={siteSettings}
          navigationItems={navigationItems}
        >
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}
