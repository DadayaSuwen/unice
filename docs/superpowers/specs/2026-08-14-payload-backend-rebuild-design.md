# Payload CMS 重建后台设计文档

- 日期: 2026-08-14
- 状态: 已批准
- 决策: 全面替换——Payload 统一管理内容 + 登录 + 后台, 前端页面改为读 Payload 数据, 移除现有自定义后台和 Prisma

## 背景与目标

现有项目是 Next.js 16 + React 19 + Tailwind 的联合化工企业官网, 使用 Prisma ORM + PostgreSQL, 含一套完全自定义的后台(登录、仪表盘、用户、角色、权限管理)和 JWT 认证。

目标: 安装 **Payload CMS 3.88** 全面重建后台, 获得开箱即用的内容管理、原生认证与后台 UI。前台页面视觉设计保持不变, 仅替换数据访问层。

### 用户已确认的决策
1. **全面替换**: Payload 统一管理内容 + 登录 + 后台, 前端读 Payload 数据, 移除自定义后台和大部分 Prisma 用法。
2. **权限模型**: 使用 Payload 原生访问控制, 不保留现有精细 RBAC 表。
3. **数据**: 开发阶段, 数据无所谓。Payload 用全新表 + 重新 seed。

## 集成方式

**就地集成**: 在现有 Next.js 应用内安装 Payload, 保留前台页面, 数据层换成 Payload Local API。

- 备选方案(已否决): `create-payload-app` 脚手架全新项目再移植前台(重做工作量大); Payload 作为独立服务(两套应用部署, 复杂度高)。

## 集合设计 (Collections)

现有 Prisma 模型 → Payload 集合, 字段一一对应。

| Prisma 模型 | Payload 集合 | 关键字段 |
|---|---|---|
| Product | `products` | name, cas_no, category(关系→categories), description, details/features/applications/safety_info(JSON), image_url(文本), is_active |
| Category | `categories` | name, slug, description, parent(自关联), sort_order, is_active |
| News | `news` | title, content(富文本 lexical), excerpt, type, publish_date, is_published, tags(数组), category(关系→news-categories), seo_title/seo_description, featured, sort_order, views_count |
| NewsCategory | `news-categories` | name, slug, description, color, sort_order, is_active |
| Career | `careers` | position, department, location, type, experience_requirement, description, requirements/responsibilities(数组), application_deadline, salary_range, education_requirement, work_environment, career_benefits(数组), contact_email/phone, is_active, sort_order |
| HeroBanner | `hero-banners` | title, subtitle, image_url(文本), button_text, button_url, is_active, sort_order |
| ContactSubmission | `contact-submissions` | name, email, phone, company, message, ip_address, user_agent, is_read |
| User | `users` (Payload 内置, 启用 auth) | 追加 role 字段 (admin/editor) |

**图片策略**: 暂用 `image_url` 文本字段, 保持前台现有 URL 不变。后续需要时可增加 `media` 上传集合(本地磁盘存储)。

## 认证与权限

- 使用 Payload 原生认证(替代 JWT/bcrypt), 后台挂载于 `/admin`(接管现有后台地址)。
- `users` 集合加 `role` 字段, 通过 Payload `access` 函数实现:
  - 前台内容(products/news/careers/categories/hero-banners): read = 公开; create/update/delete = admin/editor。
  - contact-submissions: create = 公开(联系表单), read/update = admin。
  - users: 仅 admin 可管理。
- 移除全部自定义 RBAC: Role/Permission/UserRole/RolePermission/UserSession/AuditLog 及对应 API。

## 前台数据访问

- **服务端组件** (`app/lib/products.ts`, `app/lib/news-utils.ts`, 产品/新闻/招聘详情页): 改用 **Payload Local API** (`getPayload().find()` 等)。
- **客户端 wrapper** (产品列表/新闻列表): 保留现有自定义 API 路由作为**薄适配层**, 内部改用 Payload Local API, **对外返回结构与现状一致** (`{products, categories, pagination}` 等), 前台代码几乎不动。
- Payload 自带 REST API 设 `apiPath: '/api/payload'`, 避免与现有 `/api/*` 适配路由冲突。
- **联系表单(新增真实提交)**: 现状是 `app/contact/page.tsx` 的 `handleSubmit` 仅 `alert` 占位, 未提交后端, 也没有 contact API 路由。本次新增 `app/api/contact/route.ts`(POST), 内部用 Payload Local API 写入 `contact-submissions` 集合, 并把联系表单 `handleSubmit` 改为 `fetch` 该路由。

## 清理清单

**删除:**
- `app/admin/*`(整个自定义后台目录)
- `app/api/admin/*`(auth/login/logout/init/users/roles/permissions)
- `app/lib/auth.ts`, `app/lib/middleware.ts`, `app/lib/prisma.ts`(auth.ts 已确认是死代码)
- `prisma/` 目录(含 schema、migrations、seed)
- `test-db-connection.js`

**依赖移除:** @prisma/client, prisma, bcrypt, bcryptjs, jsonwebtoken, @types/bcrypt, @types/bcryptjs, @types/jsonwebtoken, recharts, react-hook-form

**依赖新增:** payload, @payloadcms/next, @payloadcms/db-postgres, @payloadcms/richtext-lexical, graphql(peer), sharp(媒体处理)

**配置变更:**
- `next.config.ts` 用 `withPayload` 包裹
- `.env` 增加 `PAYLOAD_SECRET`、`DATABASE_URI`(或复用 DATABASE_URL)
- `package.json` 增加 payload 脚本: generate:types, migrate, seed
- 移除 Prisma 相关脚本与 tsconfig 路径

## 种子数据

从现有 `prisma/seed.ts`(1202 行)提取内容, 编写 Payload seed 脚本(tsx), 通过 Local API 创建:
- admin 用户(role=admin)
- 产品分类 + 示例产品
- 新闻分类 + 示例新闻
- 轮播图、招聘职位示例

## 后台主题

Payload 后台主题改为金色 (#d4af37) 匹配品牌, 设置站点 logo/图标。

## 验证标准

1. `npm run build` 通过, `npm run dev` 正常启动。
2. `/admin` 能打开 Payload 后台并用 seed 的 admin 账号登录。
3. 前台页面(首页/产品/产品详情/新闻/新闻详情/招聘/关于/联系)数据正常渲染。
4. 联系表单能提交, 数据进入 contact-submissions。
5. 旧自定义后台路由已移除, 无 Prisma 残留引用。

## 风险与注意事项

- **Next 16 兼容性**: Payload 3.x 官方标注支持 Next 15, 3.88 已较新, 但 Next 16 兼容性需在实现时验证。若出现不兼容, 回退方案是降级 Next 到 15.x(开发期风险可控)。Node 20.19.5 满足 Payload 引擎要求 (>=20.9.0)。
- 若 `getPayload()` 需配置 `configPath`, 注意 `next.config.ts` 与 `payload.config.ts` 的路径解析。
- 移除 Prisma 后, 需确认 `.env` 中 `DATABASE_URL` 被 Payload 的 `DATABASE_URI` 正确读取。
