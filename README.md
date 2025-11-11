# 联合化工官方网站

这是一个基于Next.js构建的化工企业官方网站，采用了紫色主题设计，体现了科技感、专业性和创新性。

## 项目特点

- **技术栈**：
  - 前端：Next.js (React框架)
  - 样式：Tailwind CSS + SASS
  - 数据库：PostgreSQL（用于存储产品、新闻、招聘等数据）
  - ORM：Prisma

- **设计主题**：
  - 主色调：紫色 (#6A0DAD) 和科技蓝 (#00BFFF)
  - 响应式设计，适配各种设备
  - 现代化、扁平化界面设计

## 功能模块

1. **首页** - 展示公司品牌形象和核心业务
2. **产品中心** - 产品展示、搜索和分类
3. **关于我们** - 公司介绍、发展历程、研发实力
4. **新闻中心** - 发布公司公告、行业动态
5. **加入我们** - 招聘信息发布
6. **联系我们** - 联系方式和在线表单

## 项目结构

```
app/
├── layout.tsx           # 主布局
├── page.tsx             # 首页
├── products/            # 产品模块
│   ├── page.tsx         # 产品列表页
│   └── [id]/page.tsx    # 产品详情页
├── about/               # 关于我们页面
├── news/                # 新闻中心页面
├── careers/             # 招聘页面
└── contact/             # 联系我们页面
```

## 开发说明

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 数据库管理

本项目使用Prisma ORM进行数据库管理，支持以下功能：
- 类型安全的数据库操作
- 数据库迁移
- 数据模型定义
- 查询优化

### Prisma配置

数据库连接字符串位于 `.env` 文件中，使用以下格式：
```
DATABASE_URL=postgresql://username:password@101.35.29.86:5432/unice
```

### 数据库操作示例

```typescript
// 使用Prisma Client进行数据库操作
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取所有产品
const products = await prisma.products.findMany({
  where: { is_active: true },
  orderBy: { created_at: 'desc' }
})

// 创建新产品
const newProduct = await prisma.products.create({
  data: {
    name: '新产品名称',
    cas_no: '123-45-6',
    description: '产品描述',
    is_active: true
  }
})
```

## 设计规范

根据开发文档要求，采用以下色彩方案：

| 名称 | 色值/示例 | 用途 |
|------|-----------|------|
| 主色 (Main) | 🟣 **#6A0DAD** (深紫/皇家紫) | 导航栏、主要按钮、品牌Logo |
| 辅色 1 (Accent) | 🔷 **#00BFFF** (科技蓝) | 交互元素、数据可视化图表 |
| 辅色 2 (Secondary) | ⚪ **#FFFFFF** (纯白) | 背景、文字主体 |
| 文字色 (Text) | ⚫ **#333333** (深灰) | 正文内容 |

## 数据库设计

根据文档要求，核心数据库表结构如下：

- `products` (产品) - 存储产品信息
- `categories` (产品分类) - 产品分类信息
- `news` (新闻/动态) - 公司新闻动态
- `careers` (招聘) - 招聘职位信息
- `users` (后台用户) - 后台管理系统用户
- `contact_submissions` (联系表单) - 联系表单提交记录

## 部署说明

项目推荐部署在以下环境中：
- 服务器：Ubuntu 20.04+
- 前端：Vercel 或 Netlify
- 数据库：PostgreSQL (云数据库服务)
- 安全：HTTPS强制开启，数据加密传输