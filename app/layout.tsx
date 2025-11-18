import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "联合化工官方网站",
  description: "专业的化工企业官方网站",
};

import Navigation from "./components/navigation";
import Footer from "./components/footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          {/* 苹果风格导航栏 */}
          <Navigation />
          {/* 主要内容 */}
          <main className="flex-grow pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
