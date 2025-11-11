"use client";

import { useState, useEffect } from "react";

// Define TypeScript interfaces for better type safety
interface Product {
  id: number;
  name: string;
  cas_no?: string;
  category_id?: number;
  description?: string;
  details: any; // Using 'any' for JSON fields that could be complex
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  category?: {
    name: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部类别");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch data from the API route
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.products);
        setCategories(data.categories);
        setLoading(false);
      } catch (error) {
        console.error("获取产品数据失败:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 过滤产品
  const filteredProducts = products.filter((product: Product) => {
    const matchesCategory =
      selectedCategory === "全部类别" ||
      product.category?.name === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.cas_no &&
        product.cas_no.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-purple)] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            加载产品数据中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">产品中心</h1>
          <p className="mt-2 text-lg opacity-90">为您提供高品质的化工产品</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="按产品名称或CAS号搜索..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--main-purple)] focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--main-purple)] focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    产品图片
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-[var(--main-purple)]">
                      {product.name}
                    </h3>
                    <span className="bg-[var(--main-purple)] text-white text-xs px-2 py-1 rounded-full">
                      {product.category?.name || "未知分类"}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    CAS号: {product.cas_no || "N/A"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 mt-3">
                    {product.description || "暂无描述"}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <a
                      href={`/products/${product.id}`}
                      className="text-[var(--main-purple)] hover:text-[var(--tech-blue)] font-medium flex items-center"
                    >
                      查看详情
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                    <button className="bg-[var(--main-purple)] hover:bg-[var(--tech-blue)] text-white px-4 py-2 rounded-lg transition-colors">
                      立即咨询
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              未找到匹配的产品
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex space-x-2">
            <button className="px-4 py-2 bg-[var(--main-purple)] text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              2
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              3
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              下一页 →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
