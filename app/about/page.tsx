"use client";

import { useState, useEffect } from "react";

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="app-wrapper">
      {/* Hero Section */}
      <section className="hero-section-about">
        <div className="container-small">
          <div className={`hero-content-about ${isLoaded ? "loaded" : ""}`}>
            <h1 className="page-title">关于我们</h1>
            <p className="page-subtitle">
              了解联合化工的企业文化与发展历程，探索我们20年来的专业与创新
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Company Introduction */}
        <section className={`about-intro ${isLoaded ? "loaded" : ""}`}>
          <div className="intro-content">
            <div className="intro-text">
              <h2 className="section-title">公司简介</h2>
              <div className="intro-description">
                <p>
                  联合化工成立于2003年，是一家专业从事化工产品研发、生产和销售的高新技术企业。
                </p>
                <p>
                  我们致力于为客户提供高品质的化工产品和专业的技术服务，在行业内享有良好声誉。
                </p>
                <p>
                  公司拥有先进的生产设备和技术团队，严格按照国际标准进行质量管控，产品远销海内外。
                </p>
              </div>
            </div>
            <div className="intro-visual">
              <div className="company-image-placeholder">
                <span className="company-image-text">公司形象</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision-section">
          <div className={`mission-vision-cards ${isLoaded ? "loaded" : ""}`}>
            <div className="mission-vision-card">
              <div className="apple-icon-wrapper gold">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="card-title">公司使命</h3>
              <p className="card-description">
                通过提供高质量的化工产品和专业的技术服务，为客户创造价值，推动行业发展。
              </p>
            </div>

            <div className="mission-vision-card">
              <div className="apple-icon-wrapper secondary">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="card-title">公司愿景</h3>
              <p className="card-description">
                成为全球领先的化工产品供应商，引领行业技术创新和可持续发展。
              </p>
            </div>
          </div>
        </section>

        {/* History Timeline - 优雅重新设计 */}
        <section className="history-section-elegant">
          <h2 className="section-title">发展历程</h2>

          {/* 里程碑时间线 */}
          <div className={`milestone-timeline ${isLoaded ? "loaded" : ""}`}>
            <div className="timeline-container-elegant">
              {/* 背景装饰线 */}
              <div className="timeline-bg-line"></div>

              {[
                {
                  year: "2003",
                  title: "公司成立",
                  description: "联合化工正式注册成立，专注于化工产品的研发与生产",
                  icon: (
                    <svg className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  ),
                  milestone: "起点",
                  color: "gold"
                },
                {
                  year: "2008",
                  title: "建立第一个生产基地",
                  description: "建立占地5000平方米的现代化生产基地，年产能突破10000吨",
                  icon: (
                    <svg className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0a1 1 0 00-1 1H3a1 1 0 00-1 1v5a1 1 0 001 1h1" />
                    </svg>
                  ),
                  milestone: "产能突破",
                  color: "secondary"
                },
                {
                  year: "2015",
                  title: "获得国际认证",
                  description: "通过ISO9001质量管理体系认证和ISO14001环境管理体系认证",
                  icon: (
                    <svg className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  milestone: "品质保证",
                  color: "accent"
                },
                {
                  year: "2020",
                  title: "数字化转型",
                  description: "全面推进数字化管理，引入ERP系统和智能化生产装备",
                  icon: (
                    <svg className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 16m-4-4H6" />
                    </svg>
                  ),
                  milestone: "智能升级",
                  color: "gold"
                },
                {
                  year: "2023",
                  title: "全球化发展",
                  description: "成功进入东南亚市场，设立海外销售办事处，实现国际化经营",
                  icon: (
                    <svg className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h6a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1v-10a1 1 0 00-1-1h-3a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 001-1v-4z" />
                    </svg>
                  ),
                  milestone: "国际化",
                  color: "accent"
                },
              ].map((milestone, index) => (
                <div
                  key={index}
                  className={`milestone-card milestone-${milestone.color} ${
                    isLoaded ? "loaded" : ""
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="milestone-year-badge">
                    {milestone.year}
                  </div>

                  <div className="milestone-content">
                    <div className="milestone-header">
                      <div className={`milestone-icon-wrapper milestone-icon-${milestone.color}`}>
                        {milestone.icon}
                      </div>
                      <div className="milestone-year-mobile">{milestone.year}</div>
                    </div>

                    <h3 className="milestone-title">{milestone.title}</h3>
                    <p className="milestone-description">{milestone.description}</p>

                    <div className="milestone-footer">
                      <div className="milestone-badge">
                        {milestone.milestone}
                      </div>
                    </div>
                  </div>

                  {/* 连接线 */}
                  {index < 5 && (
                    <div className="timeline-connector"></div>
                  )}
                </div>
              ))}
            </div>

            {/* 统计数据展示 */}
            <div className="timeline-stats">
              <div className={`timeline-stat ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "400ms" }}>
                <div className="stat-number">20+</div>
                <div className="stat-label">年发展历程</div>
              </div>
              <div className={`timeline-stat ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "600ms" }}>
                <div className="stat-number">5+</div>
                <div className="stat-label">重要里程碑</div>
              </div>
              <div className={`timeline-stat ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "800ms" }}>
                <div className="stat-number">50+</div>
                <div className="stat-label">国家地区</div>
              </div>
            </div>
          </div>
        </section>

        {/* R&D Section */}
        <section className="rd-section">
          <h2 className="section-title">研发与技术</h2>
          <div className={`rd-cards ${isLoaded ? "loaded" : ""}`}>
            {[
              {
                icon: (
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                title: "技术研发",
                description: "拥有专业的研发团队，不断开发新产品，提升技术水平。",
              },
              {
                icon: (
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "质量认证",
                description: "通过多项国际质量认证，确保产品质量达到世界先进水平。",
              },
              {
                icon: (
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "专家团队",
                description: "汇聚国内外化工领域顶尖专家，为产品研发提供强大支持。",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rd-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="apple-icon-wrapper accent">
                  {feature.icon}
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}