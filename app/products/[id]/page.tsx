import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { mapProduct } from "@/lib/mappers";
import ProductDetailClient from "./ProductDetailClient"; // 引入第一步创建的组件

// 定义参数类型 (Next.js 15+)
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// --------------------------------------------------------
// 1. 数据获取逻辑 (服务端直连 Payload，代替 Prisma)
// --------------------------------------------------------

async function getProduct(id: number) {
  try {
    const payload = await getPayloadClient();
    const product = await payload.findByID({
      collection: "products",
      id,
      depth: 1,
      disableErrors: true,
    });
    if (!product || !product.is_active) return null;
    return mapProduct(product);
  } catch (error) {
    console.error("Product fetch error:", error);
    return null;
  }
}

async function getRelatedProducts(
  categoryId: number | null,
  currentId: number
) {
  if (!categoryId) return [];
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "products",
      where: {
        category: { equals: categoryId },
        id: { not_equals: currentId },
        is_active: { equals: true },
      },
      depth: 1,
      sort: "-createdAt",
      limit: 4,
    });
    return result.docs.map(mapProduct);
  } catch {
    return [];
  }
}

// --------------------------------------------------------
// 2. SSG 核心：generateStaticParams
// --------------------------------------------------------

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "products",
      where: { is_active: { equals: true } },
      depth: 0,
      limit: 500,
    });

    return result.docs.map((p: any) => ({
      id: p.id.toString(),
    }));
  } catch (error) {
    console.error("SSG generation failed:", error);
    return [];
  }
}

export const dynamicParams = true; // 允许构建时未生成的 ID 在运行时动态尝试

// --------------------------------------------------------
// 3. Metadata 生成 (SEO)
// --------------------------------------------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) return { title: "产品不存在" };

  const product = await getProduct(productId);
  if (!product) return { title: "产品未找到" };

  return {
    title: `${product.name} - ${
      product.category?.name || "化工产品"
    } | 公司名称`,
    description:
      product.description || `查看 ${product.name} 的详细技术参数与应用领域。`,
  };
}

// --------------------------------------------------------
// 4. 页面入口 (Server Component)
// --------------------------------------------------------

export default async function ProductDetailPage({ params }: PageProps) {
  // 1. 解析参数
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) notFound();

  // 2. 获取数据 (服务端)
  const product = await getProduct(productId);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id
  );

  // 3. 将数据传递给 Client Component 进行渲染和交互
  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
