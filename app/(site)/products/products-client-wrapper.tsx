"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/pagination";
import ProductImage from "@/components/product-image";

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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductsData {
  products: Product[];
  categories: string[];
  pagination: PaginationInfo | null;
}

interface PageHeader {
  enabled: boolean;
  title: string;
  subtitle: string;
}

interface ProductsClientWrapperProps {
  initialData: ProductsData;
  pageHeader: PageHeader;
}

const DEFAULT_TITLE = "产品中心";
const DEFAULT_SUBTITLE = "探索我们完整的化工产品系列，为各行业提供高品质的解决方案";

export default function ProductsClientWrapper({ initialData, pageHeader }: ProductsClientWrapperProps) {
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [categories] = useState<string[]>(initialData.categories);
  const [selectedCategory, setSelectedCategory] = useState("全部类别");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(initialData.pagination);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const fetchProducts = async (page: number = 1, category: string = selectedCategory) => {
    try {
      setLoading(true);

      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        category: category
      });

      // Fetch data from the API route
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }

      setProducts(data.products);
      setPagination(data.pagination || null);
      setLoading(false);
    } catch (error) {
      console.error("获取产品数据失败:", error);
      setLoading(false);
    }
  };

  // 处理页面变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page, selectedCategory);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理分类变化
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchProducts(1, category);
  };

  // 处理搜索
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "全部类别" || product.category?.name === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.cas_no?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading && currentPage === 1) {
    return (
      <div className="app-wrapper">
        <section className="products-loading-section">
          <div className="container">
            <div className="loading-content">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-dot"></div>
              </div>
              <p className="loading-text">加载产品数据中...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Hero Section */}
      <section className="hero-section-products">
        <div className="container-small">
          <div className={`hero-content ${isLoaded ? "loaded" : ""}`}>
            <h1 className="page-title">{pageHeader.enabled ? pageHeader.title : DEFAULT_TITLE}</h1>
            <p className="page-subtitle">
              {pageHeader.enabled ? pageHeader.subtitle : DEFAULT_SUBTITLE}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className={`filter-section ${isLoaded ? "loaded" : ""}`}>
        <div className="container">
          <div className="filter-content">
            {/* Category Filter */}
            <div className="category-filter">
              <label className="filter-label">产品类别</label>
              <div className="category-buttons">
                <button
                  className={`category-btn ${
                    selectedCategory === "全部类别" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange("全部类别")}
                >
                  全部类别
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${
                      selectedCategory === category ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-filter">
              <div className="search-input-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="搜索产品名称或CAS号..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid-section">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
              </div>
              <h3 className="no-products-title">未找到匹配的产品</h3>
              <p className="no-products-description">
                请尝试调整搜索条件或选择不同的产品类别
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Product Image */}
                  <div className="product-image-area">
                    <div className="product-image-bg"></div>
                    <div className="product-image-placeholder">
                      <ProductImage product={product} index={index} size="medium" className="rounded-lg" />
                    </div>
                    {/* Category Badge */}
                    <div className="product-category-badge">
                      <span>{product.category?.name || "未分类"}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="product-info-area">
                    <h3 className="product-name">{product.name}</h3>
                    {product.cas_no && (
                      <p className="product-cas">CAS: {product.cas_no}</p>
                    )}
                    <p className="product-description">
                      {product.description || "这是一款优质的化工产品，具有广泛的应用前景和卓越的性能表现。"}
                    </p>

                    {/* Action Buttons */}
                    <div className="product-actions">
                      <a
                        href={`/products/${product.id}`}
                        className="product-button-primary"
                      >
                        查看详情
                        <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                      <a
                        href="/contact"
                        className="product-button-secondary"
                      >
                        咨询价格
                        <svg className="button-phone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Hover Accent Line */}
                  <div className="product-accent-line"></div>
                </div>
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
          className="products-pagination-section"
        />
      )}
    </div>
  );
}