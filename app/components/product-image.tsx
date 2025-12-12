import Image from "next/image";
import { useState } from "react";
import { ImageLoadingPlaceholder, ImageErrorPlaceholder, NoImagePlaceholder } from "./image-loading-placeholder";

interface Product {
  id: number;
  name: string;
  image_url?: string;
  category?: {
    name: string;
  };
}

interface ProductImageProps {
  product: Product;
  index?: number;
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function ProductImage({ product, index = 0, size = "medium", className = "" }: ProductImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [showImage, setShowImage] = useState(false);

  // 根据size设置不同的图片尺寸
  const sizes = {
    small: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    medium: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    large: "(max-width: 1024px) 100vw, 50vw"
  };

  // 根据size设置不同的优先级
  const priority = index < 3;

  if (!product.image_url) {
    return <NoImagePlaceholder category={product.category?.name} />;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 加载状态 */}
      {imageState === 'loading' && <ImageLoadingPlaceholder />}

      {/* 错误状态 */}
      {imageState === 'error' && <ImageErrorPlaceholder category={product.category?.name} />}

      {/* 实际图片 */}
      {showImage && (
        <div className="relative w-full h-full group">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
            sizes={sizes[size]}
            quality={85}
            style={{ opacity: 1 }}
          />
          {/* 图片加载完成后的淡入效果 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      {/* 触发图片加载的隐藏图片 */}
      {!showImage && imageState === 'loading' && (
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover opacity-0"
          sizes={sizes[size]}
          quality={85}
          priority={priority}
          onLoadingComplete={() => {
            setShowImage(true);
            setImageState('loaded');
          }}
          onError={() => {
            setImageState('error');
          }}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      )}
    </div>
  );
}