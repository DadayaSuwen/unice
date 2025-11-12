"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DarkModeToggle from "@/components/DarkModeToggle";

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
        // 模拟获取新闻详情数据
        const newsData: NewsDetail = {
          id: parseInt(params.id as string),
          title: "联合化工荣获2024年度化工行业创新奖",
          excerpt: "凭借在新材料研发领域的突出贡献，联合化工荣获中国化工协会颁发的年度创新奖。",
          content: `
            <div class="news-article-content">
              <p>联合化工在2024年度中国化工协会评选中荣获"化工行业创新奖"，这是对公司在新材料研发领域卓越贡献的高度认可。</p>

              <h3>创新成果</h3>
              <p>本次获奖的创新项目主要涉及新型环保溶剂的研发与应用。联合化工研发团队历时三年，成功开发出具有自主知识产权的新一代环保溶剂产品，其性能指标达到国际领先水平。</p>

              <h3>技术突破</h3>
              <p>该创新产品在以下方面实现了重大突破：</p>
              <ul>
                <li>挥发性有机化合物（VOC）含量降低80%以上</li>
                <li>产品纯度达到99.9%，超越行业标准</li>
                <li>生产能耗降低30%，实现绿色制造</li>
                <li>产品应用范围扩大到航空航天等高端领域</li>
              </ul>

              <h3>行业影响</h3>
              <p>这一创新成果不仅推动了化工行业的技术进步，也为我国在高端化工材料领域赢得了国际声誉。产品已成功应用于多个重点工程项目，获得客户的一致好评。</p>

              <h3>未来展望</h3>
              <p>联合化工将继续加大研发投入，依托国家级技术中心平台，在更多前沿领域实现技术突破，为化工行业的高质量发展贡献更大力量。</p>
            </div>
          `,
          publish_date: "2024-01-15",
          type: "公司新闻",
          author: "新闻中心",
          image_url: "",
          tags: ["创新奖", "新材料", "环保", "研发"],
          read_time: 5
        };

        setNews(newsData);

        // 模拟相关新闻
        const relatedData: NewsDetail[] = [
          {
            id: 2,
            title: "新一代环保溶剂产品正式发布",
            excerpt: "我公司研发团队历时三年开发的新一代环保溶剂正式投产，性能达到国际领先水平。",
            content: "",
            publish_date: "2024-01-10",
            type: "产品发布",
            author: "产品部",
            tags: ["新产品", "环保溶剂"],
            read_time: 3
          },
          {
            id: 3,
            title: "化工行业发展趋势分析报告",
            excerpt: "根据最新市场调研数据，绿色化工和智能制造将成为未来发展的主要方向。",
            content: "",
            publish_date: "2024-01-05",
            type: "行业资讯",
            author: "市场部",
            tags: ["行业趋势", "市场分析"],
            read_time: 8
          },
          {
            id: 4,
            title: "联合化工与欧洲知名企业达成战略合作",
            excerpt: "双方将在技术研发、市场拓展等多个领域开展深度合作，共同开拓国际市场。",
            content: "",
            publish_date: "2023-12-28",
            type: "公司新闻",
            author: "商务部",
            tags: ["战略合作", "国际化"],
            read_time: 4
          }
        ];

        setRelatedNews(relatedData.filter(item => item.id !== newsData.id));
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="empty-title">新闻未找到</h3>
              <p className="empty-description">
                抱歉，找不到对应的新闻内容。
              </p>
              <a
                href="/news"
                className="back-button"
              >
                <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
      <DarkModeToggle />

      {/* Hero Section */}
      <section className="hero-section-news-detail">
        <div className="container">
          <div className={`news-hero-content ${isLoaded ? "loaded" : ""}`}>
            {/* Breadcrumb */}
            <nav className="news-breadcrumb">
              <a href="/news" className="breadcrumb-link">
                新闻中心
              </a>
              <svg className="breadcrumb-separator" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
            <p className="news-detail-excerpt">
              {news.excerpt}
            </p>

            {/* News Meta */}
            <div className="news-detail-meta">
              <div className="meta-item">
                <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(news.publish_date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>

              {news.author && (
                <div className="meta-item">
                  <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {news.author}
                </div>
              )}

              {news.read_time && (
                <div className="meta-item">
                  <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

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
                  <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button className="share-button share-twitter">
                  <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                <button className="share-button share-copy">
                  <svg className="share-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
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
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <div className="related-news-type">
                        <span>{item.type || "新闻"}</span>
                      </div>
                    </div>
                    <div className="related-news-content">
                      <div className="related-news-meta">
                        <div className="meta-date">
                          <svg className="meta-small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(item.publish_date).toLocaleDateString("zh-CN")}
                        </div>
                        {item.read_time && (
                          <div className="meta-read-time">
                            <svg className="meta-small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {item.read_time} 分钟
                          </div>
                        )}
                      </div>
                      <h3 className="related-news-title">{item.title}</h3>
                      <p className="related-news-excerpt">
                        {item.excerpt}
                      </p>
                      <div className="related-news-footer">
                        <a
                          href={`/news/${item.id}`}
                          className="related-news-link"
                        >
                          阅读全文
                          <svg className="link-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
              <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回新闻列表
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}