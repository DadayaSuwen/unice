'use client';

import { useState, useEffect } from 'react';
import { prisma } from '@/lib/prisma';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部类别");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // 获取所有发布的新闻
        const newsData = await prisma.news.findMany({
          where: { is_published: true },
          orderBy: { publish_date: 'desc' }
        });

        // 获取所有新闻分类
        const categoriesData = await prisma.news.distinct('type');

        // 获取分类名称数组（去重）
        const categoryNames = [...new Set(categoriesData.map(item => item.type))];

        setNews(newsData);
        setCategories(['全部类别', ...categoryNames]);
        setLoading(false);
      } catch (error) {
        console.error('获取新闻数据失败:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 过滤新闻
  const filteredNews = selectedCategory === "全部类别"
    ? news
    : news.filter(item => item.type === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-purple)] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">加载新闻数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">新闻中心</h1>
          <p className="mt-2 text-lg opacity-90">关注公司最新动态与行业资讯</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[var(--main-purple)] text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredNews.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-[var(--main-purple)] text-white text-xs px-2 py-1 rounded-full">
                    {item.type || '新闻'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.publish_date).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[var(--main-purple)] mb-3">{item.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.excerpt || item.content?.substring(0, 100) + '...'}</p>
                <a
                  href={`/news/${item.id}`}
                  className="text-[var(--main-purple)] hover:text-[var(--tech-blue)] font-medium flex items-center"
                >
                  阅读全文
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <nav className="flex space-x-2">
            <button className="px-4 py-2 bg-[var(--main-purple)] text-white rounded-lg">1</button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">2</button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">3</button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              下一页 →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}