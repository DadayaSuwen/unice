"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PopularProductsPreview from "./components/popular-products-preview";
import Image from "next/image";
export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  // 为各个section创建ref
  const productsRef = useRef(null);
  const featuresRef = useRef(null);
  const showcaseRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });

    setTimeout(() => setIsLoaded(true), 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -10% 0px", // 当section进入视窗10%时触发
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, entry.target.id]));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // 观察各个section
    const sections = [
      { ref: productsRef, id: "products" },
      { ref: featuresRef, id: "features" },
      { ref: showcaseRef, id: "showcase" },
      { ref: statsRef, id: "stats" },
      { ref: ctaRef, id: "cta" },
    ];

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        (ref.current as HTMLElement).id = id;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-wrapper">
      {/* Apple-style Hero Section */}
      <section className="hero-section">
        {/* High-quality background image with gradient overlay */}
        <div className="hero-background">
          <div
            className="hero-background-image"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1532187863486-abf98db72652?q=80&w=1974')`,
            }}
          />
          <div
            className="hero-radial-gradient"
            style={{
              background: `radial-gradient(ellipse at ${50 + scrollY * 0.02}% ${
                40 + scrollY * 0.01
              }%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)`,
            }}
          />
        </div>

        {/* Main content */}
        <div className="container-large hero-content">
          <div className={`hero-main-content ${isLoaded ? "loaded" : ""}`}>
            {/* Apple-style large headline */}
            <h1 className="hero-title">联合化工</h1>

            {/* Apple-style subtitle */}
            <p className="hero-subtitle">
              创新化学科技，引领行业未来。
              <br />
              我们致力于提供卓越的化工解决方案，为全球客户创造持久价值。
            </p>

            {/* Apple-style CTA buttons */}
            <div className="hero-cta-buttons">
              <Link href="/products" className="apple-button-primary">
                <span>探索产品</span>
                <svg
                  className="icon-arrow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <Link href="/contact" className="apple-button-secondary">
                <svg
                  className="icon-phone"
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
                <span>联系我们</span>
              </Link>
            </div>
          </div>

          {/* Apple-style scroll indicator */}
          {isLoaded && (
            <div
              className={`scroll-indicator ${
                scrollY > 100 ? "fade-out" : "fade-in"
              }`}
            >
              <div className="scroll-mouse">
                <div className="scroll-dot"></div>
              </div>
              <span className="scroll-text">滚动探索</span>
            </div>
          )}
        </div>
      </section>

      {/* Products Section - 优雅重新设计 */}
      <section ref={productsRef} className="products-section">
        <div className="container">
          <div
            className={`section-header-products ${
              visibleSections.has("products") ? "loaded" : ""
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <h2 className="section-title">我们的产品系列</h2>
            <p className="section-subtitle">
              精心研发的化工产品，为各行业提供可靠的解决方案
            </p>
          </div>

          <div className="products-showcase">
            {/* 产品展示 - 横向布局 */}
            <div
              className={`product-showcase-item left ${
                visibleSections.has("products") ? "loaded" : ""
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="product-content">
                <div className="product-info">
                  <div className="apple-icon-wrapper gold">
                    <svg
                      className="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <h3 className="product-title">化工原料</h3>
                  <p className="product-description">
                    高品质基础化工原料，广泛应用于医药、电子、汽车等高端制造领域，为各行业提供稳定可靠的原料供应。
                  </p>
                  <Link href="/products" className="apple-button-secondary">
                    了解更多
                    <svg
                      className="icon-arrow-right"
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
                </div>
                <div className="product-visual">
                  <div className="product-placeholder">
                    <Image
                      src="/image1.png"
                      alt="化工原料"
                      fill
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`product-showcase-item right ${
                visibleSections.has("products") ? "loaded" : ""
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="product-content">
                <div className="product-info">
                  <div className="apple-icon-wrapper secondary">
                    <svg
                      className="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="product-title">精细化学品</h3>
                  <p className="product-description">
                    专业化定制精细化学品，采用先进生产工艺，满足特定工业应用的精准需求，为客户提供定制化解决方案。
                  </p>
                  <Link href="/products" className="apple-button-secondary">
                    了解更多
                    <svg
                      className="icon-arrow-right"
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
                </div>
                <div className="product-visual">
                  <div className="product-placeholder">
                    <Image
                      src="/image2.png"
                      alt="精细化学品"
                      fill
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`product-showcase-item left ${
                visibleSections.has("products") ? "loaded" : ""
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="product-content">
                <div className="product-info">
                  <div className="apple-icon-wrapper accent">
                    <svg
                      className="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <h3 className="product-title">专用化学品</h3>
                  <p className="product-description">
                    创新配方专用化学品，结合行业经验与技术优势，为客户提供差异化的竞争优势和专业服务。
                  </p>
                  <Link href="/products" className="apple-button-secondary">
                    了解更多
                    <svg
                      className="icon-arrow-right"
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
                </div>
                <div className="product-visual">
                  <div className="product-placeholder">
                    <Image
                      src="/image1.png"
                      alt="专用化学品"
                      fill
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`popular-products-wrapper ${
              visibleSections.has("products") ? "loaded" : ""
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <PopularProductsPreview />
          </div>

          <div
            className={`products-cta ${
              visibleSections.has("products") ? "loaded" : ""
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <Link href="/products" className="apple-button-primary">
              <span>查看所有产品</span>
              <svg
                className="icon-arrow-large"
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
          </div>
        </div>
      </section>

      {/* Apple-style Features Section */}
      <section ref={featuresRef} className="section py-section">
        <div className="container">
          <div
            className={`section-header mb-16 ${
              visibleSections.has("features")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "0ms",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h2 className="section-title">为什么选择联合化工</h2>
            <p className="section-subtitle">
              我们专注于品质、创新和服务，为客户创造持久价值
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className={`apple-feature-card ${
                visibleSections.has("features")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="apple-icon-wrapper secondary">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="apple-feature-title">卓越品质</h3>
              <p className="apple-feature-description">
                通过ISO9001质量管理体系认证，严格把控从原料到成品的每一个环节
              </p>
            </div>

            <div
              className={`apple-feature-card ${
                visibleSections.has("features")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="apple-icon-wrapper gold">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="apple-feature-title">创新技术</h3>
              <p className="apple-feature-description">
                拥有50+项专利技术，持续投入研发，引领行业技术发展方向
              </p>
            </div>

            <div
              className={`apple-feature-card ${
                visibleSections.has("features")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="apple-icon-wrapper green">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="apple-feature-title">安全环保</h3>
              <p className="apple-feature-description">
                严格遵循EHS标准，绿色生产工艺，致力于可持续发展
              </p>
            </div>

            <div
              className={`apple-feature-card ${
                visibleSections.has("features")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="apple-icon-wrapper secondary">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="apple-feature-title">全球供应</h3>
              <p className="apple-feature-description">
                覆盖50+国家和地区的供应链网络，确保产品及时交付
              </p>
            </div>

            <div
              className={`apple-feature-card ${
                visibleSections.has("features")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="apple-icon-wrapper gold">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="apple-feature-title">专业团队</h3>
              <p className="apple-feature-description">
                200+专业技术人员，提供从咨询到售后的一站式服务
              </p>
            </div>

            <div
              className={`apple-feature-card ${
                visibleSections.has("features")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="apple-icon-wrapper green">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="apple-feature-title">定制方案</h3>
              <p className="apple-feature-description">
                深入理解客户需求，提供个性化的产品解决方案
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-style Showcase Section with Image */}
      <section ref={showcaseRef} className="section py-section bg-white">
        <div className="container">
          <div
            className={`section-header mb-16 ${
              visibleSections.has("showcase")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "0ms",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h2 className="section-title">现代化生产基地</h2>
            <p className="section-subtitle">
              世界一流的生产设施，确保产品质量与交付能力
            </p>
          </div>

          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl mb-16 ${
              visibleSections.has("showcase")
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
            style={{
              transitionDelay: "200ms",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className="aspect-video bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/uniche.png')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white max-w-md">
              <h3 className="text-3xl font-bold mb-2">智能化工园区</h3>
              <p className="text-lg opacity-90">
                占地500亩的现代化生产基地，配备最先进的生产设备和技术
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-style Statistics Section */}
      <section ref={statsRef} className="section py-section bg-gray-50">
        <div className="container">
          <div
            className={`section-header mb-16 ${
              visibleSections.has("stats")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "0ms",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h2 className="section-title">我们的成就</h2>
            <p className="section-subtitle">数字见证我们20年来的专业与坚持</p>
          </div>

          <div className="apple-stats-container">
            <div
              className={`apple-stat-item ${
                visibleSections.has("stats")
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className="apple-stat-number">20+</span>
              <span className="apple-stat-label">年行业经验</span>
            </div>
            <div
              className={`apple-stat-item ${
                visibleSections.has("stats")
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <span className="apple-stat-number">500+</span>
              <span className="apple-stat-label">合作伙伴</span>
            </div>
            <div
              className={`apple-stat-item ${
                visibleSections.has("stats")
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="apple-stat-number">1000+</span>
              <span className="apple-stat-label">满意客户</span>
            </div>
            <div
              className={`apple-stat-item ${
                visibleSections.has("stats")
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <span className="apple-stat-number">50+</span>
              <span className="apple-stat-label">专利技术</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - 淡金黄主题 */}
      <section ref={ctaRef} className="cta-section">
        <div
          className={`container-small ${
            visibleSections.has("cta")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: "0ms",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="cta-title">准备好开始合作了吗？</h2>
          <p className="cta-subtitle">
            联系我们的专业团队，获取定制化的化工解决方案和技术支持
          </p>
          <div
            className={`cta-buttons ${
              visibleSections.has("cta")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: "200ms",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Link href="/contact" className="cta-button-primary">
              <svg
                className="icon-phone"
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
              立即联系
            </Link>
            <Link href="/products" className="cta-button-secondary">
              <svg
                className="icon-browse"
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
              浏览产品
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
