"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 当移动端菜单打开时，禁止页面滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`nav-header ${isScrolled ? "scrolled" : ""}`}>
        <nav className="nav-content">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link href="/" className="nav-logo group">
              <div className="nav-logo-image">
                <Image
                  src="/logo.jpg"
                  alt="联合化工"
                  width={40}
                  height={40}
                  className="logo-img"
                  priority
                />
              </div>
              <span className="nav-logo-name">联合化工</span>
            </Link>

            {/* 桌面导航 */}
            <div className="nav-desktop">
              {[
                { href: "/", label: "首页" },
                { href: "/products", label: "产品中心" },
                { href: "/about", label: "关于我们" },
                { href: "/news", label: "新闻中心" },
                { href: "/careers", label: "加入我们" },
                { href: "/contact", label: "联系我们" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="nav-link group">
                  {item.label}
                  <span className="nav-link-underline"></span>
                </Link>
              ))}
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`nav-mobile-toggle ${isMobileMenuOpen ? "active" : ""}`}
            >
              <div className="nav-mobile-icon">
                <span className="nav-mobile-line"></span>
                <span className="nav-mobile-line"></span>
                <span className="nav-mobile-line"></span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* 移动端菜单 - 移到导航栏外部 */}
      {isMobileMenuOpen && (
        <div
          className="nav-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div className={`nav-mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        {/* 关闭按钮 */}
        <button
          className="nav-mobile-close"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="nav-mobile-links">
          {[
            { href: "/", label: "首页" },
            { href: "/products", label: "产品中心" },
            { href: "/about", label: "关于我们" },
            { href: "/news", label: "新闻中心" },
            { href: "/careers", label: "加入我们" },
            { href: "/contact", label: "联系我们" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-mobile-link"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(false);
              }}
            >
              {item.label}
              <svg
                className="nav-mobile-link-arrow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
