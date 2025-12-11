"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface NewsDetail {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  publish_date: string;
  type?: string;
  author?: string;
  image_url?: string;
  tags?: string[];
  read_time?: number;
}

export default function NewsDetailPage() {
  const params = useParams();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<NewsDetail[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const newsId = params.id as string;

        // 验证newsId是否为有效数字
        const idNum = parseInt(newsId);
        if (isNaN(idNum) || idNum <= 0) {
          console.error("无效的新闻ID:", newsId);
          setLoading(false);
          return;
        }

        console.log("Fetching news with ID:", newsId);

        // 获取新闻详情
        const response = await fetch(`/api/news/${newsId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch news detail");
        }

        setNews(data);
        console.log("News loaded successfully");

        // 获取相关新闻
        try {
          const relatedResponse = await fetch(`/api/news/${newsId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 4 }),
          });

          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedNews(Array.isArray(relatedData) ? relatedData : []);
            console.log("Related news loaded:", relatedData.length);
          }
        } catch (relatedError) {
          console.warn("获取相关新闻失败:", relatedError);
          setRelatedNews([]);
        }

        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error("获取新闻详情失败:", error);
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNewsDetail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="app-wrapper">
        <section className="news-detail-loading-section">
          <div className="container">
            <div className="loading-content">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-dot"></div>
              </div>
              <p className="loading-text">加载新闻内容中...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
              <a href="/news" className="back-button">
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
              </a>
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
              <a href="/news" className="breadcrumb-link">
                新闻中心
              </a>
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
              <span>{news.type || "新闻"}</span>
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
                <button className="share-button share-facebook">
                  <svg
                    className="share-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
                <button className="share-button share-twitter">
                  <svg
                    className="share-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </button>
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
                        <span>{item.type || "新闻"}</span>
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
            <a href="/news" className="back-to-news-button">
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
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
