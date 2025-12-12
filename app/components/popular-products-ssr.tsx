import Link from "next/link";
import ProductImage from "./product-image";

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

interface PopularProductsSSRProps {
  products: Product[];
}

export default function PopularProductsSSR({ products }: PopularProductsSSRProps) {
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
              <ProductImage product={product} index={index} size="small" />
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