"use client";

import { useState } from "react";
import Link from "next/link";

// 辅助函数：获取行业图标
const getIndustryIcon = (index: number) => {
  const icons = [
    "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z",
    "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707",
  ];
  return icons[index % icons.length];
};

interface ProductClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // 【优化】移除了 useState 和 useEffect
  // 我们不再需要 isLoaded 状态，直接用 CSS 动画即可

  if (!product) {
    return (
      <div className="app-wrapper">
        <section className="product-detail-empty-section py-20">
          <div className="container text-center">
            <div className="empty-content">
              <h3 className="text-xl font-bold text-slate-700">产品未找到</h3>
              <Link
                href="/products"
                className="text-blue-600 hover:underline mt-4 inline-block"
              >
                返回列表
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Hero Section */}
      <section className="hero-section-product-detail">
        <div className="container">
          {/* 【优化】使用 Tailwind 原生动画代替 JS 控制的类名 */}
          {/* animate-fadeIn 需要在 tailwind.config.js 配置，或者使用下面的任意值写法 */}
          <div className="product-hero-content opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
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
                    CAS号: {product.cas_no || "暂无"}
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
                  {/* 图片展示逻辑 */}
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
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
                      <p className="image-placeholder-text">暂无图片</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="product-quick-actions">
                  <button className="product-quick-action product-action-primary">
                    下载技术资料
                  </button>
                  <button className="product-quick-action product-action-secondary">
                    在线咨询
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="product-detail-main-section">
        <div className="container">
          <div className="product-detail-content">
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

            <div className="product-tab-content">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="tab-pane tab-pane-overview animate-[fadeIn_0.3s_ease-out]">
                  <div className="product-overview-content">
                    <div className="overview-description">
                      <h2 className="section-title">产品概述</h2>
                      {product.descriptionHtml ? (
                        <div
                          className="overview-text"
                          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                        />
                      ) : (
                        <p className="overview-text">{product.description}</p>
                      )}
                    </div>
                    <div className="product-features">
                      <div className="features-grid">
                        <div className="feature-item">
                          <span className="feature-text">
                            CAS号: {product.cas_no || "暂无"}
                          </span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-text">
                            分类: {product.category?.name}
                          </span>
                        </div>
                        <div className="feature-item">
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

              {/* Specs Tab */}
              {activeTab === "specs" && product.details && product.details.length > 0 && (
                <div className="tab-pane tab-pane-specs animate-[fadeIn_0.3s_ease-out]">
                  <h2 className="section-title">技术指标</h2>
                  <div className="specs-grid">
                    {product.details.map((item: { name: string; value: string }, index: number) => (
                      <div key={index} className="spec-item">
                        <div className="spec-header">
                          <h3 className="spec-name">{item.name}</h3>
                          <div className="spec-badge">标准</div>
                        </div>
                        <p className="spec-value">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === "applications" && (
                <div className="tab-pane tab-pane-applications animate-[fadeIn_0.3s_ease-out]">
                  <h2 className="section-title">应用领域</h2>
                  {product.applications && product.applications.length > 0 ? (
                    <div className="applications-list">
                      {product.applications.map((app: { name: string; description?: string }, index: number) => (
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
                            <h3 className="application-title">{app.name}</h3>
                            {app.description && (
                              <p className="application-description">
                                {app.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-text">暂无应用领域信息</div>
                  )}
                </div>
              )}

              {/* Safety Tab */}
              {/* Safety Tab - 修复样式版 */}
              {activeTab === "safety" && (
                <div className="tab-pane tab-pane-safety animate-[fadeIn_0.3s_ease-out]">
                  {product.safety_info && product.safety_info.length > 0 ? (
                    <div className="safety-notice">
                      {/* 1. 顶部标题和图标 */}
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

                      {/* 2. 内容列表渲染 */}
                      <div className="safety-list">
                        {product.safety_info.map(
                          (item: { title: string; content: string }, index: number) => (
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
                                  {item.title}:
                                </strong>
                                <span className="safety-value">
                                  {item.content}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    // 空状态
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

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="container">
            <h2 className="related-products-title">相关产品</h2>
            <div className="related-products-grid">
              {relatedProducts.map((rel) => (
                <Link
                  href={`/products/${rel.id}`}
                  key={rel.id}
                  className="related-product-card"
                >
                  <div className="related-product-content">
                    <h3 className="related-product-name">{rel.name}</h3>
                    <p className="text-sm text-gray-500">CAS: {rel.cas_no}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <section className="back-to-products-section">
        <div className="container">
          <Link href="/products" className="back-to-products-button">
            返回列表
          </Link>
        </div>
      </section>
    </div>
  );
}
