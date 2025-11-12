"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  publish_date: string;
  type?: string;
  author?: string;
  image_url?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部类别");
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch data from the API route
        const response = await fetch("/api/news");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch news");
        }
        setNews(data.news || []);
        setCategories(data.categories || ["全部类别", "公司新闻", "行业资讯", "产品发布"]);
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error("获取新闻数据失败:", error);
        // 添加示例数据作为后备
        setNews([
          {
            id: 1,
            title: "联合化工荣获2024年度化工行业创新奖",
            excerpt: "凭借在新材料研发领域的突出贡献，联合化工荣获中国化工协会颁发的年度创新奖。",
            content: "详细内容...",
            publish_date: "2024-01-15",
            type: "公司新闻",
            author: "新闻中心"
          },
          {
            id: 2,
            title: "新一代环保溶剂产品正式发布",
            excerpt: "我公司研发团队历时三年开发的新一代环保溶剂正式投产，性能达到国际领先水平。",
            content: "详细内容...",
            publish_date: "2024-01-10",
            type: "产品发布",
            author: "产品部"
          },
          {
            id: 3,
            title: "化工行业发展趋势分析报告",
            excerpt: "根据最新市场调研数据，绿色化工和智能制造将成为未来发展的主要方向。",
            content: "详细内容...",
            publish_date: "2024-01-05",
            type: "行业资讯",
            author: "市场部"
          },
          {
            id: 4,
            title: "联合化工与欧洲知名企业达成战略合作",
            excerpt: "双方将在技术研发、市场拓展等多个领域开展深度合作，共同开拓国际市场。",
            content: "详细内容...",
            publish_date: "2023-12-28",
            type: "公司新闻",
            author: "商务部"
          }
        ]);
        setCategories(["全部类别", "公司新闻", "行业资讯", "产品发布"]);
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchNews();
  }, []);

  // 过滤新闻
  const filteredNews =
    selectedCategory === "全部类别"
      ? news
      : news.filter((item) => item.type === selectedCategory);

  if (loading) {
    return (
      <div className="app-wrapper">
        <section className="news-loading-section">
          <div className="container">
            <div className="loading-content">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-dot"></div>
              </div>
              <p className="loading-text">加载新闻数据中...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Hero Section */}
      <section className="hero-section-news">
        <div className="container-small">
          <div className={`hero-content-news ${isLoaded ? "loaded" : ""}`}>
            <h1 className="page-title">新闻中心</h1>
            <p className="page-subtitle">
              关注联合化工最新动态，把握化工行业发展脉搏
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className={`news-filter-section ${isLoaded ? "loaded" : ""}`}>
        <div className="container">
          <div className="filter-content">
            <label className="filter-label">新闻类别</label>
            <div className="category-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`news-category-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="news-grid-section">
        <div className="container">
          {filteredNews.length === 0 ? (
            <div className="no-news">
              <div className="no-news-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="no-news-title">暂无相关新闻</h3>
              <p className="no-news-description">
                该类别下暂时没有新闻，请尝试选择其他类别
              </p>
            </div>
          ) : (
            <div className="news-grid">
              {filteredNews.map((item, index) => (
                <article
                  key={item.id}
                  className="news-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* News Image */}
                  <div className="news-image-area">
                    <div className="news-image-bg"></div>
                    <div className="news-image-placeholder">
                      <div className="news-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    {/* News Type Badge */}
                    <div className="news-type-badge">
                      <span>{item.type || "新闻"}</span>
                    </div>
                  </div>

                  {/* News Content */}
                  <div className="news-content-area">
                    <div className="news-meta">
                      <time className="news-date">
                        {new Date(item.publish_date).toLocaleDateString("zh-CN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </time>
                      {item.author && (
                        <span className="news-author">by {item.author}</span>
                      )}
                    </div>

                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-excerpt">
                      {item.excerpt || item.content?.substring(0, 120) + "..."}
                    </p>

                    {/* Action Button */}
                    <div className="news-actions">
                      <a
                        href={`/news/${item.id}`}
                        className="news-button-primary"
                      >
                        阅读全文
                        <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Hover Accent Line */}
                  <div className="news-accent-line"></div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {filteredNews.length > 0 && (
        <section className="news-pagination-section">
          <div className="container">
            <div className={`pagination-content ${isLoaded ? "loaded" : ""}`}>
              <nav className="pagination-nav">
                <button className="pagination-button active">1</button>
                <button className="pagination-button">2</button>
                <button className="pagination-button">3</button>
                <button className="pagination-button">
                  下一页
                  <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}