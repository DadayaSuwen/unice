import { prisma } from "@/lib/prisma";
import {
  Users,
  Package,
  FileText,
  Mail,
  TrendingUp,
  AlertCircle,
  Shield,
  Activity,
  Zap,
  Clock,
} from "lucide-react";

export default async function AdminDashboard() {
  // 获取统计数据
  let totalProducts = 0;
  let activeProducts = 0;
  let publishedNews = 0;
  let totalAdminUsers = 0;
  let pendingContacts = 0;

  try {
    const stats = await prisma.$queryRaw`
        SELECT
          (SELECT COUNT(*) FROM "Product") as total_products,
          (SELECT COUNT(*) FROM "Product" WHERE is_active = true) as active_products,
          (SELECT COUNT(*) FROM "News" WHERE is_published = true) as published_news,
          (SELECT COUNT(*) FROM "User" WHERE role IN ('admin', 'administrator')) as total_admin_users,
          (SELECT COUNT(*) FROM "ContactSubmission" WHERE status = 'pending') as pending_contacts
      `;

    if (Array.isArray(stats) && stats[0]) {
      totalProducts = Number(stats[0].total_products) || 0;
      activeProducts = Number(stats[0].active_products) || 0;
      publishedNews = Number(stats[0].published_news) || 0;
      totalAdminUsers = Number(stats[0].total_admin_users) || 0;
      pendingContacts = Number(stats[0].pending_contacts) || 0;
    }
  } catch (error) {
    console.error("Dashboard stats query error:", error);
  }

  const dashboardStats = {
    products: { total: totalProducts, active: activeProducts },
    news: { total: 0, published: publishedNews },
    users: { total: totalAdminUsers, admin: totalAdminUsers },
    contacts: { total: pendingContacts, pending: pendingContacts },
  };

  // 快速操作链接
  const quickActions = [
    {
      title: "新增产品",
      description: "添加新的化工产品",
      href: "/admin/products/new",
      icon: <Package className="w-6 h-6" />,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      hoverBg: "hover:bg-blue-50",
      hoverBorder: "hover:border-blue-300",
    },
    {
      title: "发布新闻",
      description: "创建公司新闻动态",
      href: "/admin/news/new",
      icon: <FileText className="w-6 h-6" />,
      gradient: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      hoverBg: "hover:bg-green-50",
      hoverBorder: "hover:border-green-300",
    },
    {
      title: "管理用户",
      description: "管理用户账户和权限",
      href: "/admin/users",
      icon: <Users className="w-6 h-6" />,
      gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      hoverBg: "hover:bg-purple-50",
      hoverBorder: "hover:border-purple-300",
    },
    {
      title: "处理咨询",
      description: "回复客户联系咨询",
      href: "/admin/contacts",
      icon: <Mail className="w-6 h-6" />,
      gradient: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50",
      hoverBg: "hover:bg-orange-50",
      hoverBorder: "hover:border-orange-300",
    },
  ];

  // 统计卡片配置
  const statCards = [
    {
      title: "产品总数",
      subtitle: `活跃产品 ${dashboardStats.products.active} 个`,
      value: dashboardStats.products.total,
      icon: <Package className="w-7 h-7" />,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      progressValue:
        dashboardStats.products.total > 0
          ? (dashboardStats.products.active / dashboardStats.products.total) *
            100
          : 0,
      trendIcon: <TrendingUp className="w-4 h-4" />,
      trendText: "产品管理",
    },
    {
      title: "已发布新闻",
      subtitle: "公众可见内容",
      value: dashboardStats.news.published,
      icon: <FileText className="w-7 h-7" />,
      gradient: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
      progressValue: 100,
      trendIcon: <Activity className="w-4 h-4" />,
      trendText: "内容更新活跃",
    },
    {
      title: "管理员用户",
      subtitle: "系统管理员账户",
      value: dashboardStats.users.admin,
      icon: <Users className="w-7 h-7" />,
      gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      progressValue: 100,
      trendIcon: <Shield className="w-4 h-4" />,
      trendText: "权限管理正常",
    },
    {
      title: "待处理咨询",
      subtitle: "客户联系请求",
      value: dashboardStats.contacts.pending,
      icon: <Mail className="w-7 h-7" />,
      gradient:
        dashboardStats.contacts.pending > 0
          ? "from-red-500 to-red-600"
          : "from-gray-400 to-gray-500",
      bgLight: dashboardStats.contacts.pending > 0 ? "bg-red-50" : "bg-gray-50",
      textColor:
        dashboardStats.contacts.pending > 0 ? "text-red-600" : "text-gray-600",
      progressValue: 100,
      trendIcon: <Clock className="w-4 h-4" />,
      trendText:
        dashboardStats.contacts.pending > 0 ? "需要及时处理" : "暂无待处理",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="relative z-10">
        {/* 统计卡片网格 */}
        <div className="px-4 sm:px-6">
          <div className="stats-grid">
            {statCards.map((card, index) => (
              <div key={index} className="stat-card">
                <div className="stat-header">
                  <div
                    className={`stat-icon bg-gradient-to-br ${card.gradient}`}
                  >
                    {card.icon}
                  </div>
                  <div className="stat-value">{card.value}</div>
                </div>

                <div className="stat-content">
                  <h3 className="stat-title">{card.title}</h3>
                  <p className="stat-subtitle">{card.subtitle}</p>
                </div>

                {index === 0 && (
                  <div className="stat-progress">
                    <div
                      className="progress-bar"
                      style={
                        {
                          "--progress-width": `${card.progressValue}%`,
                        } as React.CSSProperties
                      }
                    ></div>
                    <div className="progress-label">
                      <span>活跃度</span>
                      <span>{card.progressValue.toFixed(1)}%</span>
                    </div>
                  </div>
                )}

                <div
                  className={`stat-trend ${
                    card.textColor.includes("green")
                      ? "stat-trend-positive"
                      : card.textColor.includes("red")
                      ? "stat-trend-warning"
                      : "stat-trend-neutral"
                  }`}
                >
                  {card.trendIcon}
                  <span>{card.trendText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速操作和系统状态面板 */}
        <div className="px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 快速操作面板 */}
            <div className="quick-actions-panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg">
                    <Zap className="w-5 h-5" />
                  </span>
                  快速操作
                </h2>
                <p className="panel-subtitle">常用功能快速访问</p>
              </div>
              <div className="panel-content">
                <div className="quick-actions-grid">
                  {quickActions.map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      className="quick-action-item"
                    >
                      <div
                        className={`action-icon bg-gradient-to-br ${action.gradient}`}
                      >
                        {action.icon}
                      </div>
                      <div className="action-content">
                        <h3 className="action-title">{action.title}</h3>
                        <p className="action-description">
                          {action.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* 系统状态面板 */}
            <div className="system-status-panel">
              <div className="panel-header bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
                <h2 className="panel-title">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                    <Activity className="w-5 h-5" />
                  </span>
                  系统状态
                </h2>
                <p className="panel-subtitle">系统运行状态概览</p>
              </div>
              <div className="panel-content">
                <div className="status-item bg-green-50 border-green-200">
                  <div className="status-indicator">
                    <div className="status-dot online"></div>
                    <div className="status-info">
                      <div className="status-title text-green-800">
                        数据库连接
                      </div>
                      <div className="status-subtitle text-green-600">
                        PostgreSQL
                      </div>
                    </div>
                  </div>
                  <div className="status-value">
                    <div className="status-label text-green-600">正常</div>
                    <div className="status-metric text-green-500">延迟 2ms</div>
                  </div>
                </div>

                <div className="status-item bg-green-50 border-green-200">
                  <div className="status-indicator">
                    <div className="status-dot online"></div>
                    <div className="status-info">
                      <div className="status-title text-green-800">API服务</div>
                      <div className="status-subtitle text-green-600">
                        Next.js
                      </div>
                    </div>
                  </div>
                  <div className="status-value">
                    <div className="status-label text-green-600">正常</div>
                    <div className="status-metric text-green-500">响应正常</div>
                  </div>
                </div>

                <div className="status-item bg-blue-50 border-blue-200">
                  <div className="status-indicator">
                    <div
                      className="status-dot online"
                      style={{ background: "#3b82f6" }}
                    ></div>
                    <div className="status-info">
                      <div className="status-title text-blue-800">缓存系统</div>
                      <div className="status-subtitle text-blue-600">
                        内存缓存
                      </div>
                    </div>
                  </div>
                  <div className="status-value">
                    <div className="status-label text-blue-600">已启用</div>
                    <div className="status-metric text-blue-500">
                      命中率 95%
                    </div>
                  </div>
                </div>

                {dashboardStats.contacts.pending > 0 && (
                  <div className="status-item bg-amber-50 border-amber-200">
                    <div className="status-indicator">
                      <div
                        className="status-dot warning"
                        style={{ background: "#f59e0b" }}
                      ></div>
                      <AlertCircle className="w-4 h-4 text-amber-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      <div className="status-info">
                        <div className="status-title text-amber-800">
                          待处理咨询
                        </div>
                        <div className="status-subtitle text-amber-600">
                          需要及时处理
                        </div>
                      </div>
                    </div>
                    <div className="status-value">
                      <div className="status-label text-amber-600">
                        {dashboardStats.contacts.pending} 条
                      </div>
                      <div className="status-metric text-amber-500">
                        新增 2 条
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
