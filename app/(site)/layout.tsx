// app/(site)/layout.tsx — 站点根布局（多根布局：与 (payload) 各带自己的 <html>）
import type { Metadata } from "next";
import "@/globals.scss";
import RootClientWrapper from "@/components/root-client-wrapper";

export const metadata: Metadata = {
  title: "江西联合化工官方网站",
  description: "专业的化工企业官方网站",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <RootClientWrapper>{children}</RootClientWrapper>
      </body>
    </html>
  );
}
