import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.scss";

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

import Navigation from "./components/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="flex flex-col min-h-screen">
          {/* 苹果风格导航栏 */}
          <Navigation />

          {/* 主要内容 */}
          <main className="flex-grow pt-16">{children}</main>

          {/* 苹果风格页脚 */}
          <footer className="bg-background-secondary border-t border-border-color">
            <div className="  mx-auto px-6 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 公司信息 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl overflow-hidden">
                      <Image
                        src="/logo.jpg"
                        alt="联合化工"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      联合化工
                    </h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    专业的化工企业，致力于为客户提供高质量的产品和创新解决方案。
                  </p>
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-background-secondary border border-border-color rounded-lg flex items-center justify-center hover:bg-primary-gold hover:text-foreground transition-colors cursor-pointer">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 bg-background-secondary border border-border-color rounded-lg flex items-center justify-center hover:bg-primary-gold hover:text-foreground transition-colors cursor-pointer">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 快速链接 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">产品服务</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/products"
                        className="text-text-secondary hover:text-primary-gold transition-colors"
                      >
                        化工原料
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products"
                        className="text-text-secondary hover:text-primary-gold transition-colors"
                      >
                        精细化学品
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products"
                        className="text-text-secondary hover:text-primary-gold transition-colors"
                      >
                        专用化学品
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products"
                        className="text-text-secondary hover:text-primary-gold transition-colors"
                      >
                        定制解决方案
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* 关于我们 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">关于</h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="/about"
                        className="text-text-secondary hover:text-primary-gold transition-colors"
                      >
                        公司简介
                      </a>
                    </li>
                    <li>
                      <a
                        href="/about"
                        className="text-text-secondary hover:text-primary-gold transition-colors"
                      >
                        企业文化
                      </a>
                    </li>
                    <li>
                      <a
                        href="/about"
                        className="text-text-secondary hover:text-primary-gold transition-colors"
                      >
                        发展历程
                      </a>
                    </li>
                    <li>
                      <a
                        href="/careers"
                        className="text-text-secondary hover:text-primary-gold transition-colors"
                      >
                        加入我们
                      </a>
                    </li>
                  </ul>
                </div>

                {/* 联系信息 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">联系方式</h4>
                  <div className="space-y-3 text-text-secondary">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-primary-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>北京市朝阳区化工路123号</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-primary-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>010-12345678</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-primary-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>info@unicechemical.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 版权信息 */}
              <div className="border-t border-border-color mt-12 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <p className="text-text-secondary text-sm">
                    © {new Date().getFullYear()} 联合化工. 保留所有权利.
                  </p>
                  <div className="flex space-x-6 text-sm">
                    <a
                      href="#"
                      className="text-text-secondary hover:text-primary-gold transition-colors"
                    >
                      隐私政策
                    </a>
                    <a
                      href="#"
                      className="text-text-secondary hover:text-primary-gold transition-colors"
                    >
                      服务条款
                    </a>
                    <a
                      href="#"
                      className="text-text-secondary hover:text-primary-gold transition-colors"
                    >
                      网站地图
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
