"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
      <div className="popular-products-loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-dot"></div>
        </div>
        <p className="loading-text">加载精选产品中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popular-products-error">
        <div className="error-card">
          <div className="error-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-products-grid">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="popular-product-card"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* 产品图片区域 */}
          <div className="product-visual-area">
            <div className="product-background-gradient"></div>
            <div className="product-overlay"></div>

            {/* 产品图片占位符 */}
            <div className="product-image-placeholder">
              <div className="product-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="product-image-text">产品图片</p>
            </div>

            {/* 分类标签 */}
            <div className="product-category">
              <span className="category-tag">
                {product.category?.name || "未分类"}
              </span>
            </div>
          </div>

          {/* 产品信息 */}
          <div className="product-info">
            <div className="product-header">
              <h3 className="product-name">
                {product.name}
              </h3>
              {product.cas_no && (
                <p className="product-cas">
                  CAS: {product.cas_no}
                </p>
              )}
            </div>

            <p className="product-description">
              {product.description || "这是一款优质的化工产品，具有广泛的应用前景和卓越的性能表现。"}
            </p>

            {/* 了解更多按钮 */}
            <Link
              href={`/products/${product.id}`}
              className="product-button"
            >
              <span>了解详情</span>
              <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* 悬浮时的装饰性元素 */}
          <div className="product-accent-line"></div>
        </div>
      ))}
    </div>
  );
}