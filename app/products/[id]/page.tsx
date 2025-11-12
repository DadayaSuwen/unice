"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 模拟产品数据
        const productData = {
          id: params.id,
          name: `高级化工产品 ${params.id}`,
          cas_no: "123-45-6",
          description: "这是一款高品质的化工产品，具有优异的化学稳定性和广泛的应用领域。产品经过严格的质量控制，符合国际标准，为各行业提供可靠的解决方案。",
          category: { name: "精细化工" },
          details: {
            "纯度": "≥99.5%",
            "外观": "无色透明液体",
            "密度": "0.85 g/cm³",
            "沸点": "180-185°C",
            "闪点": "65°C",
            "溶解性": "易溶于多数有机溶剂"
          },
          applications: [
            "涂料工业：作为高性能溶剂和稀释剂",
            "制药工业：用于药物合成中间体",
            "电子工业：清洗剂和表面处理剂",
            "纺织工业：染料溶剂和整理剂"
          ],
          safetyInfo: [
            "避免吸入蒸气，使用时保持良好通风",
            "佩戴适当的防护手套和护目镜",
            "远离火源和热源",
            "储存于阴凉干燥处，避免阳光直射"
          ],
          features: [
            "优异的化学稳定性和热稳定性",
            "高纯度，符合国际质量标准",
            "环保配方，低挥发性有机化合物",
            "广泛的应用领域兼容性"
          ]
        };

        setProduct(productData);
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error('获取产品详情失败:', error);
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="empty-title">产品未找到</h3>
              <p className="empty-description">
                抱歉，找不到对应的产品信息。
              </p>
              <a
                href="/products"
                className="back-button"
              >
                <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回产品列表
              </a>
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
              <a href="/products" className="breadcrumb-link">
                产品中心
              </a>
              <svg className="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="breadcrumb-current">{product.name}</span>
            </nav>

            {/* Product Title and Basic Info */}
            <div className="product-hero-main">
              <div className="product-hero-text">
                <h1 className="product-detail-title">{product.name}</h1>
                <p className="product-detail-subtitle">
                  {product.description}
                </p>

                {/* Product Tags */}
                <div className="product-detail-tags">
                  <span className="product-tag product-tag-primary">
                    <svg className="tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    CAS号: {product.cas_no}
                  </span>
                  <span className="product-tag product-tag-secondary">
                    <svg className="tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="image-placeholder-text">产品图片</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="product-quick-actions">
                  <button className="product-quick-action product-action-primary">
                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    下载技术资料
                  </button>
                  <button className="product-quick-action product-action-secondary">
                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
                  { id: 'overview', label: '产品概述', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'specs', label: '技术指标', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                  { id: 'applications', label: '应用领域', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
                  { id: 'safety', label: '安全信息', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.label}
                    <div className="tab-indicator"></div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="product-tab-content">
              {activeTab === 'overview' && (
                <div className="tab-pane tab-pane-overview animate-fadeIn">
                  <div className="product-overview-content">
                    <div className="overview-description">
                      <h2 className="section-title">产品概述</h2>
                      <p className="overview-text">
                        {product.description}
                      </p>
                    </div>

                    {product.features && (
                      <div className="product-features">
                        <h3 className="features-title">产品特点</h3>
                        <div className="features-grid">
                          {product.features.map((feature: string, index: number) => (
                            <div key={index} className="feature-item">
                              <div className="feature-icon-wrapper">
                                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="feature-text">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'specs' && product.details && (
                <div className="tab-pane tab-pane-specs animate-fadeIn">
                  <h2 className="section-title">技术指标</h2>
                  <div className="specs-grid">
                    {Object.entries(product.details).map(([key, value]) => (
                      <div key={key} className="spec-item">
                        <div className="spec-header">
                          <h3 className="spec-name">{key}</h3>
                          <div className="spec-badge">标准</div>
                        </div>
                        <p className="spec-value">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'applications' && product.applications && (
                <div className="tab-pane tab-pane-applications animate-fadeIn">
                  <h2 className="section-title">应用领域</h2>
                  <div className="applications-list">
                    {product.applications.map((application: string, index: number) => (
                      <div key={index} className="application-item">
                        <div className="application-icon-wrapper">
                          <svg className="application-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="application-content">
                          <h3 className="application-title">应用领域 {index + 1}</h3>
                          <p className="application-description">{application}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'safety' && product.safetyInfo && (
                <div className="tab-pane tab-pane-safety animate-fadeIn">
                  <div className="safety-notice">
                    <div className="safety-header">
                      <div className="safety-icon-wrapper">
                        <svg className="safety-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h2 className="safety-title">安全注意事项</h2>
                    </div>
                    <div className="safety-list">
                      {product.safetyInfo.map((info: string, index: number) => (
                        <div key={index} className="safety-item">
                          <svg className="safety-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="safety-text">{info}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="related-products-section">
        <div className="container">
          <div className={`related-products-content ${isLoaded ? "loaded" : ""}`}>
            <h2 className="related-products-title">相关产品</h2>
            <div className="related-products-grid">
              {[1, 2, 3].map((item) => (
                <article key={item} className="related-product-card">
                  <div className="related-product-image">
                    <div className="related-product-image-bg"></div>
                    <div className="related-product-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="related-product-content">
                    <h3 className="related-product-name">相关产品名称 {item}</h3>
                    <p className="related-product-description">
                      高品质化工产品，广泛应用于各行业领域。
                    </p>
                    <div className="related-product-meta">
                      <span className="related-product-category">精细化工</span>
                      <span className="related-product-cas">CAS: 456-78-9</span>
                    </div>
                    <a href={`/products/${item}`} className="related-product-link">
                      查看详情
                      <svg className="link-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                  <div className="related-product-accent"></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back to Products */}
      <section className="back-to-products-section">
        <div className="container">
          <div className="back-to-products-content">
            <a href="/products" className="back-to-products-button">
              <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回产品列表
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}