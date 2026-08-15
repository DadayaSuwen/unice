import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import ProductsClientWrapper from "./products-client-wrapper";
import { ProductStructuredData } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "产品中心 - 江西联合化工 | 专业化工原料与精细化学品",
  description: "江西联合化工产品中心提供完整的化工产品系列，包括化工原料、精细化学品和专用化学品。所有产品均通过严格的质量控制，为各行业提供可靠的解决方案。",
  keywords: ["化工产品", "化工原料", "精细化学品", "专用化学品", "CAS号", "化学品目录", "产品列表", "江西联合化工"],
  openGraph: {
    title: "产品中心 - 江西联合化工",
    description: "探索我们完整的化工产品系列，为各行业提供高品质的解决方案",
    type: "website",
    locale: "zh_CN",
    siteName: "江西联合化工",
  },
  twitter: {
    card: "summary_large_image",
    title: "产品中心 - 江西联合化工",
    description: "专业化工原料与精细化学品制造商",
  },
  alternates: {
    canonical: "/products",
  },
};

export default async function ProductsPage() {
  // Server-side data fetching for products
  const productsData = await getProducts(1, 12);

  return (
    <>
      {/* Structured Data for SEO */}
      <ProductStructuredData products={productsData.products} />

      {/* Main Content */}
      <ProductsClientWrapper initialData={productsData} />
    </>
  );
}