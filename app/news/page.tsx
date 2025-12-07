"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/pagination";

interface NewsItem {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  publish_date: string;
  type?: string;
  author?: string;
  image_url?: string;
  category?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部类别");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchNews = async (
    page: number = 1,
    category: string = selectedCategory
  ) => {
    try {
      setLoading(true);

      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        category: category,
      });

      // Fetch data from the API route
      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch news");
      }
      setNews(data.news || []);
      setCategories(data.categories || ["全部类别"]);
      setPagination(data.pagination || null);
      setLoading(false);
      setTimeout(() => setIsLoaded(true), 100);
    } catch (error) {
      console.error("获取新闻数据失败:", error);
      setError("获取新闻数据失败");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // 处理页面变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNews(page, selectedCategory);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 处理分类变化
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchNews(1, category);
  };

  // 不再需要前端过滤，因为API已经处理了分类过滤

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
              关注江西联合化工最新动态，把握化工行业发展脉搏
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
                  onClick={() => handleCategoryChange(category)}
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
          {news.length === 0 ? (
            <div className="no-news">
              <div className="no-news-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="no-news-title">暂无相关新闻</h3>
              <p className="no-news-description">
                该类别下暂时没有新闻，请尝试选择其他类别
              </p>
            </div>
          ) : (
            <div className="news-grid">
              {news.map((item, index) => (
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
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
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
                        {new Date(item.publish_date).toLocaleDateString(
                          "zh-CN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
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
                            d="M9 5l7 7-7 7"
                          />
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
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          className="news-pagination-section"
        />
      )}
    </div>
  );
}
