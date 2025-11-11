"use client";

import { useState, useEffect } from "react";

// Define TypeScript interfaces for better type safety
interface Product {
  id: number;
  name: string;
  cas_no?: string;
  category_id?: number;
  description?: string;
  details: any;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  category?: {
    name: string;
  };
}

export default function PopularProductsPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch("/api/popular-products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch popular products");
        }

        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("获取热门产品失败:", err);
        setError("获取热门产品失败");
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  if (loading) {
    return (
      <div className="col-span-1 md:col-span-3 text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-purple)] mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          加载热门产品中...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-1 md:col-span-3 text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="h-48 bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] flex items-center justify-center">
            <span className="text-white text-2xl font-bold">产品图片</span>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-[var(--main-purple)]">
                {product.name}
              </h3>
              <span className="bg-[var(--main-purple)] text-white text-xs px-2 py-1 rounded-full">
                {product.category?.name || "未知分类"}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {product.description || "暂无描述"}
            </p>
            <a
              href={`/products/${product.id}`}
              className="text-[var(--main-purple)] hover:text-[var(--tech-blue)] font-medium flex items-center"
            >
              了解更多
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
          </div>
        </div>
      ))}
    </>
  );
}
