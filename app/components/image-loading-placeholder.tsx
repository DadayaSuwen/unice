export function ImageLoadingPlaceholder({ message = "加载中..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
      <div className="flex flex-col items-center space-y-3 p-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-gray-200 dark:border-gray-600 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-primary-gold rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}

export function ImageErrorPlaceholder({ category }: { category?: string }) {
  return (
    <div className="product-no-image">
      <div className="product-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="product-no-image-text">
        <span className="product-category-name">
          {category || "化工产品"}
        </span>
        <p className="product-preview-text">图片加载失败</p>
      </div>
    </div>
  );
}

export function NoImagePlaceholder({ category }: { category?: string }) {
  return (
    <div className="product-no-image">
      <div className="product-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <div className="product-no-image-text">
        <span className="product-category-name">
          {category || "化工产品"}
        </span>
        <p className="product-preview-text">暂无图片</p>
      </div>
    </div>
  );
}