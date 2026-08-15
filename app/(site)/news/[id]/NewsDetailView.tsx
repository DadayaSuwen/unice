"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getNewsTypeDisplayName, getNewsTypeClassName } from "@/lib/news-utils";

interface NewsDetailViewProps {
  news: {
    id: number;
    title: string;
    excerpt?: string;
    content: string;
    publish_date: string;
    type?: string;
    author?: string;
    tags?: string[];
    read_time?: number;
  } | null;
  relatedNews: any[];
}

export default function NewsDetailView({ news, relatedNews }: NewsDetailViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  if (!news) {
    return (
      <div className="app-wrapper">
        <section className="news-detail-empty-section">
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
              <h3 className="empty-title">新闻未找到</h3>
              <p className="empty-description">抱歉，找不到对应的新闻内容。</p>
              <Link href="/news" className="back-button">
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
                返回新闻列表
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
      <section className="hero-section-news-detail">
        <div className="container">
          <div className={`news-hero-content ${isLoaded ? "loaded" : ""}`}>
            {/* Breadcrumb */}
            <nav className="news-breadcrumb">
              <Link href="/news" className="breadcrumb-link">
                新闻中心
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
              <span className="breadcrumb-current">{news.title}</span>
            </nav>

            {/* News Type Badge */}
            <div className="news-type-badge-large">
              <span className={getNewsTypeClassName(news.type)}>
                {getNewsTypeDisplayName(news.type)}
              </span>
            </div>

            {/* News Title */}
            <h1 className="news-detail-title">{news.title}</h1>

            {/* News Excerpt */}
            <p className="news-detail-excerpt">{news.excerpt}</p>

            {/* News Meta */}
            <div className="news-detail-meta">
              <div className="meta-item">
                <svg
                  className="meta-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(news.publish_date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {news.author && (
                <div className="meta-item">
                  <svg
                    className="meta-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {news.author}
                </div>
              )}

              {news.read_time && (
                <div className="meta-item">
                  <svg
                    className="meta-icon"
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
                  阅读时间 {news.read_time} 分钟
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="news-featured-image-section">
        <div className="container">
          <div className={`featured-image-content ${isLoaded ? "loaded" : ""}`}>
            <div className="news-detail-image-card">
              <div className="news-detail-image-bg"></div>
              <div className="news-detail-image-placeholder">
                <div className="news-detail-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <p className="image-placeholder-text">新闻配图</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="news-article-section">
        <div className="container">
          <article className={`news-article ${isLoaded ? "loaded" : ""}`}>
            <div className="article-content">
              {news.content.includes("<") ? (
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              ) : (
                news.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.trim()) {
                    if (paragraph.startsWith("##")) {
                      return (
                        <h3 key={index}>
                          {paragraph.replace("##", "").trim()}
                        </h3>
                      );
                    } else if (paragraph.startsWith("-")) {
                      const items = paragraph
                        .split("\n")
                        .filter((item) => item.trim().startsWith("-"));
                      return (
                        <ul
                          key={index}
                          style={{ listStyle: "none", padding: 0 }}
                        >
                          {items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              style={{
                                marginBottom: "0.5rem",
                                paddingLeft: "1.5rem",
                                position: "relative",
                              }}
                            >
                              • {item.replace("-", "").trim()}
                            </li>
                          ))}
                        </ul>
                      );
                    } else {
                      return <p key={index}>{paragraph.trim()}</p>;
                    }
                  }
                  return null;
                })
              )}
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="article-tags">
                <h3 className="tags-title">相关标签</h3>
                <div className="tags-list">
                  {news.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="article-share">
              <h3 className="share-title">分享这篇文章</h3>
              <div className="share-buttons">
                <button className="share-button share-copy">
                  <svg
                    className="share-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"
                    />
                  </svg>
                  复制链接
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="related-news-section">
          <div className="container">
            <div className={`related-news-content ${isLoaded ? "loaded" : ""}`}>
              <h2 className="related-news-title">相关新闻</h2>
              <div className="related-news-grid">
                {relatedNews.map((item) => (
                  <article key={item.id} className="related-news-card">
                    <div className="related-news-image">
                      <div className="related-news-image-bg"></div>
                      <div className="related-news-icon">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                      <div className="related-news-type">
                        <span className={getNewsTypeClassName(item.type)}>
                          {getNewsTypeDisplayName(item.type)}
                        </span>
                      </div>
                    </div>
                    <div className="related-news-content">
                      <div className="related-news-meta">
                        <div className="meta-date">
                          <svg
                            className="meta-small-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(item.publish_date).toLocaleDateString(
                            "zh-CN"
                          )}
                        </div>
                        {item.read_time && (
                          <div className="meta-read-time">
                            <svg
                              className="meta-small-icon"
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
                            {item.read_time} 分钟
                          </div>
                        )}
                      </div>
                      <h3 className="related-news-title">{item.title}</h3>
                      <p className="related-news-excerpt">{item.excerpt}</p>
                      <div className="related-news-footer">
                        <a
                          href={`/news/${item.id}`}
                          className="related-news-link"
                        >
                          阅读全文
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
                        </a>
                      </div>
                    </div>
                    <div className="related-news-accent"></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to News */}
      <section className="back-to-news-section">
        <div className="container">
          <div className="back-to-news-content">
            <Link href="/news" className="back-to-news-button">
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
              返回新闻列表
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
