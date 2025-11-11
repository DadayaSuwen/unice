"use client";

import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const productId = parseInt(params.id);
  //       const productData = await prisma.product.findUnique({
  //         where: { id: productId },
  //         include: { category: true }
  //       });

  //       if (productData) {
  //         setProduct(productData);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('获取产品详情失败:', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchProduct();
  // }, [params.id]);

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--main-purple)]">
            产品未找到
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            抱歉，找不到对应的产品信息。
          </p>
          <a
            href="/products"
            className="mt-4 inline-block text-[var(--main-purple)] hover:text-[var(--tech-blue)]"
          >
            返回产品列表
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">产品详情</h1>
          <p className="mt-2 text-lg opacity-90">产品详细技术资料</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6 text-sm text-gray-600 dark:text-gray-300">
          <a
            href="/products"
            className="text-[var(--main-purple)] hover:underline"
          >
            产品中心
          </a>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] rounded-lg h-96 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">产品图片</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-[var(--main-purple)] mb-4">
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-[var(--main-purple)] text-white px-3 py-1 rounded-full text-sm">
                CAS号: {product.cas_no || "N/A"}
              </span>
              <span className="bg-[var(--tech-blue)] text-white px-3 py-1 rounded-full text-sm">
                {product.category?.name || "未知分类"}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-200 text-lg mb-6">
              {product.description || "暂无描述"}
            </p>

            {product.details && Object.keys(product.details).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--main-purple)] mb-4">
                  技术指标
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* {Object.entries(product.details).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                    >
                      <h3 className="font-medium text-[var(--main-purple)]">
                        {key}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {value}
                      </p>
                    </div>
                  ))} */}
                </div>
              </div>
            )}

            {product.applications && product.applications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--main-purple)] mb-4">
                  应用领域
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
                  {product.applications.map(
                    (application: string, index: number) => (
                      <li key={index}>{application}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {product.safetyInfo && product.safetyInfo.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--main-purple)] mb-4">
                  安全信息
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
                  {product.safetyInfo.map((info: string, index: number) => (
                    <li key={index}>{info}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-[var(--main-purple)] hover:bg-[var(--tech-blue)] text-white font-bold py-3 px-6 rounded-lg transition-colors">
                下载技术资料
              </button>
              <button className="flex-1 border-2 border-[var(--main-purple)] text-[var(--main-purple)] hover:bg-[var(--main-purple)] hover:text-white font-bold py-3 px-6 rounded-lg transition-colors">
                在线咨询
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[var(--main-purple)] mb-6">
            相关产品
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-40 bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    相关产品{item}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--main-purple)]">
                    相关产品名称 {item}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    相关产品简要描述...
                  </p>
                  <a
                    href="#"
                    className="text-[var(--main-purple)] hover:text-[var(--tech-blue)] text-sm mt-2 inline-block"
                  >
                    查看详情 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
