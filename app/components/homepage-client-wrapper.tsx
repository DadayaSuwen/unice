"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import PopularProductsSSR from "./popular-products-ssr";
import SectionIcon from "./section-icons";
import type { HomePageData } from "@/lib/globals";

// 产品展示卡片兜底图标（与改造前保持一致，按索引循环）
const SHOWCASE_CARD_ICONS = [
  "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
];

interface Product {
  id: number;
  name: string;
  cas_no?: string;
  category_id?: number;
  description?: string;
  details: any;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  category?: {
    name: string;
  };
}

interface HomepageClientWrapperProps {
  popularProducts: Product[];
  homePage: HomePageData;
}

export default function HomepageClientWrapper({ popularProducts, homePage }: HomepageClientWrapperProps) {
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
      rootMargin: "-10% 0px -10% 0px",
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
      {/* Hero Section */}
      {homePage.hero.enabled && (
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-background-image-wrapper">
              <Image
                src={homePage.hero.bgImageUrl}
                alt={homePage.hero.title}
                fill
                className="hero-background-img"
                priority
                sizes="100vw"
              />
            </div>
            <div
              className="hero-radial-gradient"
              style={{
                background: `radial-gradient(ellipse at ${50 + scrollY * 0.02}% ${
                  40 + scrollY * 0.01
                }%, var(--shadow-gold) 0%, transparent 60%)`,
              }}
            />
          </div>

          {/* Main content */}
          <div className="container-large hero-content">
            <div className={`hero-main-content ${isLoaded ? "loaded" : ""}`}>
              {/* Apple-style large headline */}
              <h1 className="hero-title">{homePage.hero.title}</h1>

              {/* Apple-style subtitle */}
              <p className="hero-subtitle">
                {homePage.hero.subtitleLine1}
                <br />
                {homePage.hero.subtitleLine2}
              </p>

              {/* Apple-style CTA buttons */}
              <div className="hero-cta-buttons">
                <Link
                  href={homePage.hero.primaryButtonHref}
                  className="apple-button-primary"
                >
                  <span>{homePage.hero.primaryButtonText}</span>
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

                <Link
                  href={homePage.hero.secondaryButtonHref}
                  className="apple-button-secondary"
                >
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
                  <span>{homePage.hero.secondaryButtonText}</span>
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
                <span className="scroll-text">{homePage.hero.scrollText}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products Section */}
      {homePage.showcase.enabled && (
        <section ref={productsRef} className="products-section">
          <div className="container">
            <div
              className={`section-header-products ${
                visibleSections.has("products") ? "loaded" : ""
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <h2 className="section-title">{homePage.showcase.title}</h2>
              <p className="section-subtitle">{homePage.showcase.subtitle}</p>
            </div>

            <div className="products-showcase">
              {/* 产品展示 - 横向布局 */}
              {homePage.showcase.cards.map((card, i) => (
                <div
                  key={i}
                  className={`product-showcase-item ${
                    i % 2 === 0 ? "left" : "right"
                  } ${visibleSections.has("products") ? "loaded" : ""}`}
                  style={{ transitionDelay: `${i * 200 + 200}ms` }}
                >
                  <div className="product-content">
                    <div className="product-info">
                      <div
                        className={`apple-icon-wrapper ${
                          ["gold", "secondary", "accent"][i % 3]
                        }`}
                      >
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
                            d={SHOWCASE_CARD_ICONS[i % SHOWCASE_CARD_ICONS.length]}
                          />
                        </svg>
                      </div>
                      <h3 className="product-title">{card.title}</h3>
                      <p className="product-description">{card.description}</p>
                      <Link
                        href={card.href}
                        className="apple-button-secondary"
                      >
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
                          src={card.imageUrl}
                          alt={card.title}
                          fill
                          className="w-full h-full object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`popular-products-wrapper ${
                visibleSections.has("products") ? "loaded" : ""
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <PopularProductsSSR products={popularProducts} />
            </div>

            <div
              className={`products-cta ${
                visibleSections.has("products") ? "loaded" : ""
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              <Link href={homePage.showcase.ctaHref} className="apple-button-primary">
                <span>{homePage.showcase.ctaText}</span>
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
      )}

      {/* Features Section */}
      {homePage.features.enabled && (
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
              <h2 className="section-title">{homePage.features.title}</h2>
              <p className="section-subtitle">{homePage.features.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homePage.features.features.map((f, i) => (
                <div
                  key={i}
                  className={`apple-feature-card ${
                    visibleSections.has("features")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div
                    className={`apple-icon-wrapper ${
                      ["secondary", "gold", "green", "secondary", "gold", "green"][
                        i % 6
                      ]
                    }`}
                  >
                    <SectionIcon name={f.icon} />
                  </div>
                  <h3 className="apple-feature-title">{f.title}</h3>
                  <p className="apple-feature-description">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Apple-style Showcase Section with Image */}
      {homePage.factory.enabled && (
        <section
          ref={showcaseRef}
          className="section py-section"
          style={{ backgroundColor: "var(--background)" }}
        >
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
              <h2 className="section-title">{homePage.factory.title}</h2>
              <p className="section-subtitle">{homePage.factory.subtitle}</p>
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
                  backgroundImage: `url('${homePage.factory.imageUrl}')`,
                }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t to-transparent"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent)",
                }}
              />
              <div
                className="absolute bottom-8 left-8 max-w-md"
                style={{ color: "#ffffff" }}
              >
                <h3 className="text-3xl font-bold mb-2">
                  {homePage.factory.overlayTitle}
                </h3>
                <p className="text-lg opacity-90">
                  {homePage.factory.overlayText}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Apple-style Statistics Section */}
      {homePage.stats.enabled && (
        <section
          ref={statsRef}
          className="section py-section"
          style={{ backgroundColor: "var(--background-secondary)" }}
        >
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
              <h2 className="section-title">{homePage.stats.title}</h2>
              <p className="section-subtitle">{homePage.stats.subtitle}</p>
            </div>

            <div className="apple-stats-container">
              {homePage.stats.stats.map((s, i) => (
                <div
                  key={i}
                  className={`apple-stat-item ${
                    visibleSections.has("stats")
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span className="apple-stat-number">{s.number}</span>
                  <span className="apple-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - 淡金黄主题 */}
      {homePage.cta.enabled && (
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
            <h2 className="cta-title">{homePage.cta.title}</h2>
            <p className="cta-subtitle">{homePage.cta.subtitle}</p>
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
              <Link
                href={homePage.cta.primaryButtonHref}
                className="cta-button-primary"
              >
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
                {homePage.cta.primaryButtonText}
              </Link>
              <Link
                href={homePage.cta.secondaryButtonHref}
                className="cta-button-secondary"
              >
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
                {homePage.cta.secondaryButtonText}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}