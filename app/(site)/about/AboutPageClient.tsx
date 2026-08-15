"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SectionIcon from "@/components/section-icons";
import type { AboutPageData } from "@/lib/globals";

// 里程碑图标（与改造前逐条对应，保持渲染一致；数据模型不含图标字段，故保留静态图标，超出按序循环）
const MILESTONE_ICONS = [
  <svg key="m0" className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>,
  <svg key="m1" className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0a1 1 0 00-1 1H3a1 1 0 00-1 1v5a1 1 0 001 1h1"
    />
  </svg>,
  <svg key="m2" className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>,
  <svg key="m3" className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0a1 1 0 00-1 1H3a1 1 0 00-1 1v5a1 1 0 001 1h1"
    />
  </svg>,
  <svg key="m4" className="milestone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>,
];

export default function AboutPageClient({ data }: { data: AboutPageData }) {
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
            <h1 className="page-title">{data.heroTitle}</h1>
            <p className="page-subtitle">{data.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Company Introduction */}
        <section className={`about-intro ${isLoaded ? "loaded" : ""}`}>
          <div className="intro-content">
            <div className="intro-text">
              <h2 className="section-title">{data.introTitle}</h2>
              <div
                className="intro-description"
                dangerouslySetInnerHTML={{ __html: data.introHtml }}
              />
            </div>
            <div className="intro-visual">
              <div className="company-image-container">
                <Image
                  src={data.introImageUrl}
                  alt="江西联合化工公司形象"
                  width={600}
                  height={320}
                  className="company-image"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision-section">
          <div className={`mission-vision-cards ${isLoaded ? "loaded" : ""}`}>
            <div className="mission-vision-card">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="card-title">{data.missionTitle}</h3>
              <p className="card-description">{data.missionDescription}</p>
            </div>

            <div className="mission-vision-card">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="card-title">{data.visionTitle}</h3>
              <p className="card-description">{data.visionDescription}</p>
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

              {data.milestones.map((m, i) => (
                <div
                  key={i}
                  className={`milestone-card milestone-${m.color} ${
                    isLoaded ? "loaded" : ""
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="milestone-year-badge">{m.year}</div>

                  <div className="milestone-content">
                    <div className="milestone-header">
                      <div
                        className={`milestone-icon-wrapper milestone-icon-${m.color}`}
                      >
                        {MILESTONE_ICONS[i % MILESTONE_ICONS.length]}
                      </div>
                      <div className="milestone-year-mobile">{m.year}</div>
                    </div>

                    <h3 className="milestone-title">{m.title}</h3>
                    <p className="milestone-description">{m.description}</p>

                    <div className="milestone-footer">
                      <div className="milestone-badge">{m.badge}</div>
                    </div>
                  </div>

                  {/* 连接线 */}
                  {i < data.milestones.length && (
                    <div className="timeline-connector"></div>
                  )}
                </div>
              ))}
            </div>

            {/* 统计数据展示 */}
            <div className="timeline-stats">
              {data.stats.map((s, i) => (
                <div
                  key={i}
                  className={`timeline-stat ${isLoaded ? "loaded" : ""}`}
                  style={{ animationDelay: `${400 + i * 200}ms` }}
                >
                  <div className="stat-number">{s.number}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* R&D Section */}
        <section className="rd-section">
          <h2 className="section-title">{data.rdTitle}</h2>
          <div className={`rd-cards ${isLoaded ? "loaded" : ""}`}>
            {data.rdCards.map((c, i) => (
              <div
                key={i}
                className="rd-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="apple-icon-wrapper accent">
                  <SectionIcon name={c.icon} className="icon" />
                </div>
                <h3 className="card-title">{c.title}</h3>
                <p className="card-description">{c.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
