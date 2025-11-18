import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // 简化的统计数据 - 只查询必要的数据，减少数据库连接
  let totalProducts = 0;
  let activeProducts = 0;
  let publishedNews = 0;
  let totalAdminUsers = 0;

  try {
    // 生产环境中使用单个查询获取所有统计数据，减少数据库连接
    const stats = await prisma.$queryRaw`
        SELECT
          (SELECT COUNT(*) FROM "Product") as total_products,
          (SELECT COUNT(*) FROM "Product" WHERE is_active = true) as active_products,
          (SELECT COUNT(*) FROM "News" WHERE is_published = true) as published_news,
          (SELECT COUNT(*) FROM "User" WHERE role IN ('admin', 'administrator')) as total_admin_users
      `;

    if (Array.isArray(stats) && stats[0]) {
      totalProducts = Number(stats[0].total_products) || 0;
      activeProducts = Number(stats[0].active_products) || 0;
      publishedNews = Number(stats[0].published_news) || 0;
      totalAdminUsers = Number(stats[0].total_admin_users) || 0;
    }
  } catch (error) {
    console.error("Dashboard stats query error:", error);
    // 如果查询失败，使用默认值
    totalProducts = 0;
    activeProducts = 0;
    publishedNews = 0;
    totalAdminUsers = 0;
  }

  // 简化的统计数据
  const dashboardStats = {
    products: { total: totalProducts, active: activeProducts },
    news: { total: 0, published: publishedNews },
    careers: { total: 0, active: 0 },
    users: { total: totalAdminUsers, admin: totalAdminUsers },
    contacts: { total: 0 },
  };

  // 简化最近活动数据 - 使用空数组避免额外查询
  const recentNews = [];
  const recentContacts = [];
  const recentProducts = [];
  const newsViewsData = [];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
        <p className="mt-2 text-gray-600">欢迎来到 Unice 管理系统</p>
      </div>

      {/* 图表和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
    </div>
  );
}
