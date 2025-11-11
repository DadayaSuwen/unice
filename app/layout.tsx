import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-[var(--main-purple)] text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-full"></div>
                <h1 className="text-xl font-bold">联合化工</h1>
              </div>
              <nav className="hidden md:block">
                <ul className="flex space-x-6">
                  <li><a href="/" className="hover:text-[var(--tech-blue)] transition-colors">首页</a></li>
                  <li><a href="/products" className="hover:text-[var(--tech-blue)] transition-colors">产品中心</a></li>
                  <li><a href="/about" className="hover:text-[var(--tech-blue)] transition-colors">关于我们</a></li>
                  <li><a href="/news" className="hover:text-[var(--tech-blue)] transition-colors">新闻中心</a></li>
                  <li><a href="/careers" className="hover:text-[var(--tech-blue)] transition-colors">加入我们</a></li>
                  <li><a href="/contact" className="hover:text-[var(--tech-blue)] transition-colors">联系我们</a></li>
                </ul>
              </nav>
              <button className="md:hidden text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">联合化工</h3>
                  <p className="text-gray-300">专业的化工企业，致力于提供高质量的产品和服务。</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">产品中心</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/products" className="hover:text-[var(--tech-blue)] transition-colors">化工原料</a></li>
                    <li><a href="/products" className="hover:text-[var(--tech-blue)] transition-colors">精细化学品</a></li>
                    <li><a href="/products" className="hover:text-[var(--tech-blue)] transition-colors">专用化学品</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">关于我们</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/about" className="hover:text-[var(--tech-blue)] transition-colors">公司简介</a></li>
                    <li><a href="/about" className="hover:text-[var(--tech-blue)] transition-colors">企业文化</a></li>
                    <li><a href="/about" className="hover:text-[var(--tech-blue)] transition-colors">发展历程</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">联系我们</h4>
                  <address className="not-italic text-gray-300">
                    <p>地址：北京市朝阳区化工路123号</p>
                    <p>电话：010-12345678</p>
                    <p>邮箱：info@unicechemical.com</p>
                  </address>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} 联合化工. 保留所有权利.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
