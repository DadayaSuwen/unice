"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DarkModeToggle from "@/components/dark-mode-toggle";

// 为不同应用领域提供不同的图标
const getIndustryIcon = (index: number) => {
  const icons = [
    "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", // 化工
    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", // 建筑
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", // 制药
    "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z", // 汽车
    "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", // 电子
    "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707", // 农业
  ];
  return icons[index % icons.length];
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch specific product data from the API route
        const response = await fetch(`/api/products-details/${params.id}`);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch product");
        }
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error("获取产品数据失败:", error);
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="app-wrapper">
        <section className="product-detail-loading-section">
          <div className="container">
            <div className="loading-content">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-dot"></div>
              </div>
              <p className="loading-text">加载产品数据中...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-wrapper">
        <section className="product-detail-empty-section">
          <div className="container">
            <div className="empty-content">
              <div className="empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="empty-title">产品未找到</h3>
              <p className="empty-description">抱歉，找不到对应的产品信息。</p>
              <Link href="/products" className="back-button">
                <svg
                  className="button-arrow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                返回产品列表
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <DarkModeToggle />

      {/* Hero Section */}
      <section className="hero-section-product-detail">
        <div className="container">
          <div className={`product-hero-content ${isLoaded ? "loaded" : ""}`}>
            {/* Breadcrumb */}
            <nav className="product-breadcrumb">
              <Link href="/products" className="breadcrumb-link">
                产品中心
              </Link>
              <svg
                className="breadcrumb-separator"
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
              <span className="breadcrumb-current">{product.name}</span>
            </nav>

            {/* Product Title and Basic Info */}
            <div className="product-hero-main">
              <div className="product-hero-text">
                <h1 className="product-detail-title">{product.name}</h1>
                <p className="product-detail-subtitle">{product.description}</p>

                {/* Product Tags */}
                <div className="product-detail-tags">
                  <span className="product-tag product-tag-primary">
                    <svg
                      className="tag-icon"
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
                    CAS号: {product.cas_no}
                  </span>
                  <span className="product-tag product-tag-secondary">
                    <svg
                      className="tag-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    {product.category?.name || "未知分类"}
                  </span>
                </div>
              </div>

              {/* Product Visual */}
              <div className="product-hero-visual">
                <div className="product-detail-image-card">
                  <div className="product-detail-image-bg"></div>
                  <div className="product-detail-image-placeholder">
                    <div className="product-detail-icon">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <p className="image-placeholder-text">产品图片</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="product-quick-actions">
                  <button className="product-quick-action product-action-primary">
                    <svg
                      className="action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    下载技术资料
                  </button>
                  <button className="product-quick-action product-action-secondary">
                    <svg
                      className="action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    在线咨询
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="product-detail-main-section">
        <div className="container">
          <div className="product-detail-content">
            {/* Tab Navigation */}
            <div className="product-detail-tabs">
              <nav className="tab-navigation">
                {[
                  {
                    id: "overview",
                    label: "产品概述",
                    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                  {
                    id: "specs",
                    label: "技术指标",
                    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                  },
                  {
                    id: "applications",
                    label: "应用领域",
                    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
                  },
                  {
                    id: "safety",
                    label: "安全信息",
                    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                  >
                    <svg
                      className="tab-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={tab.icon}
                      />
                    </svg>
                    {tab.label}
                    <div className="tab-indicator"></div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="product-tab-content">
              {activeTab === "overview" && (
                <div className="tab-pane tab-pane-overview animate-fadeIn">
                  <div className="product-overview-content">
                    <div className="overview-description">
                      <h2 className="section-title">产品概述</h2>
                      <p className="overview-text">{product.description}</p>
                    </div>

                    <div className="product-features">
                      <h3 className="features-title">产品信息</h3>
                      <div className="features-grid">
                        <div className="feature-item">
                          <div className="feature-icon-wrapper">
                            <svg
                              className="feature-icon"
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
                          <span className="feature-text">
                            CAS号: {product.cas_no || "暂无"}
                          </span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon-wrapper">
                            <svg
                              className="feature-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                          <span className="feature-text">
                            分类: {product.category?.name || "未分类"}
                          </span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon-wrapper">
                            <svg
                              className="feature-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <span className="feature-text">
                            更新日期:{" "}
                            {new Date(product.updated_at).toLocaleDateString(
                              "zh-CN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specs" && product.details && (
                <div className="tab-pane tab-pane-specs animate-fadeIn">
                  <h2 className="section-title">技术指标</h2>
                  <div className="specs-grid">
                    {Object.entries(
                      typeof product.details === "string"
                        ? JSON.parse(product.details)
                        : product.details
                    ).map(([key, value]) => (
                      <div key={key} className="spec-item">
                        <div className="spec-header">
                          <h3 className="spec-name">{key}</h3>
                          <div className="spec-badge">标准</div>
                        </div>
                        <p className="spec-value">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "applications" && (
                <div className="tab-pane tab-pane-applications animate-fadeIn">
                  <h2 className="section-title">应用领域</h2>
                  {product.applications ? (
                    <div className="applications-list">
                      {(typeof product.applications === "string"
                        ? JSON.parse(product.applications)
                        : product.applications
                      ).map((application: any, index: number) => (
                        <div key={index} className="application-item">
                          <div className="application-icon-wrapper">
                            <svg
                              className="application-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={getIndustryIcon(index)}
                              />
                            </svg>
                          </div>
                          <div className="application-content">
                            <h3 className="application-title">
                              {typeof application === "object"
                                ? application.name
                                : application}
                            </h3>
                            <p className="application-description">
                              {typeof application === "object"
                                ? application.description
                                : application}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="empty-text">暂无应用领域信息</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "safety" && (
                <div className="tab-pane tab-pane-safety animate-fadeIn">
                  {product.safety_info ? (
                    <div className="safety-notice">
                      <div className="safety-header">
                        <div className="safety-icon-wrapper">
                          <svg
                            className="safety-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <h2 className="safety-title">安全注意事项</h2>
                      </div>
                      <div className="safety-list">
                        {(() => {
                          const safetyData =
                            typeof product.safety_info === "string"
                              ? JSON.parse(product.safety_info)
                              : product.safety_info;

                          // 如果是对象，转换为键值对数组
                          if (
                            typeof safetyData === "object" &&
                            !Array.isArray(safetyData)
                          ) {
                            return Object.entries(safetyData).map(
                              ([key, value], index) => (
                                <div key={index} className="safety-item">
                                  <svg
                                    className="safety-check"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <div className="safety-content">
                                    <strong className="safety-key">
                                      {key}:
                                    </strong>
                                    <span className="safety-value">
                                      {String(value)}
                                    </span>
                                  </div>
                                </div>
                              )
                            );
                          }

                          // 如果是数组，直接映射
                          if (Array.isArray(safetyData)) {
                            return safetyData.map(
                              (info: string, index: number) => (
                                <div key={index} className="safety-item">
                                  <svg
                                    className="safety-check"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span className="safety-text">{info}</span>
                                </div>
                              )
                            );
                          }

                          // 如果是字符串，作为单个安全项显示
                          return (
                            <div className="safety-item">
                              <svg
                                className="safety-check"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="safety-text">
                                {String(safetyData)}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <p className="empty-text">暂无安全信息</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="container">
            <div
              className={`related-products-content ${isLoaded ? "loaded" : ""}`}
            >
              <h2 className="related-products-title">相关产品</h2>
              <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                  <article
                    key={relatedProduct.id}
                    className="related-product-card"
                  >
                    <div className="related-product-image">
                      <div className="related-product-image-bg"></div>
                      <div className="related-product-icon">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="related-product-content">
                      <h3 className="related-product-name">
                        {relatedProduct.name}
                      </h3>
                      <p className="related-product-description">
                        {relatedProduct.description ||
                          "高品质化工产品，广泛应用于各行业领域。"}
                      </p>
                      <div className="related-product-meta">
                        <span className="related-product-category">
                          {relatedProduct.category?.name || "未分类"}
                        </span>
                        <span className="related-product-cas">
                          CAS: {relatedProduct.cas_no || "暂无"}
                        </span>
                      </div>
                      <Link
                        href={`/products/${relatedProduct.id}`}
                        className="related-product-link"
                      >
                        查看详情
                        <svg
                          className="link-arrow"
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
                    <div className="related-product-accent"></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Products */}
      <section className="back-to-products-section">
        <div className="container">
          <div className="back-to-products-content">
            <Link href="/products" className="back-to-products-button">
              <svg
                className="button-arrow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              返回产品列表
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
