// app/layout.tsx
import type { Metadata } from "next";
import "./globals.scss";
// 不再直接导入 Navigation 和 Footer
import RootClientWrapper from "./components/root-client-wrapper";

export const metadata: Metadata = {
  title: "联合化工官方网站",
  description: "专业的化工企业官方网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-background text-foreground">
        {/* 用客户端组件包裹，进行路径判断 */}
        <RootClientWrapper>{children}</RootClientWrapper>
      </body>
    </html>
  );
}
