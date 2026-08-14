# Payload CMS 重建后台 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Next.js 16 官网中安装 Payload CMS 3.88,全面替换自定义后台/认证/数据层,前端页面改为读 Payload 数据,移除 Prisma 与自定义 RBAC。

**Architecture:** 就地集成。Payload 的 `(payload)` 路由组接管 `/admin` 后台与 `/api/payload` REST API;内容集合(产品/新闻/招聘/轮播/联系)由 Payload 管理;保留现有公共 API 路由作为薄适配层,内部调用 Payload Local API,对外返回结构与现状完全一致;服务端组件直接用 Payload Local API;联系表单改为真实提交。

**Tech Stack:** Next.js 16.0.8, React 19, TypeScript, Tailwind v4, Payload 3.88, @payloadcms/db-postgres (Drizzle), @payloadcms/richtext-lexical, PostgreSQL。

## 设计文档

完整设计与决策见 `docs/superpowers/specs/2026-08-14-payload-backend-rebuild-design.md`。

## Global Constraints

- **Payload 版本**: `payload@3.88.0`(latest)。若与 Next 16.0.8 不兼容(dev 报错),回退方案:降级 Next 到 15.x。
- **Node**: >=20.9(本机 20.19.5,满足)。
- **数据库**: PostgreSQL,由 `@payloadcms/db-postgres` 管理。连接串 `process.env.DATABASE_URI || process.env.DATABASE_URL`。
- **前端契约不可变**: 公共 API 路由 `app/api/products`、`products-details/[id]`、`news`、`news/[id]`、`popular-products`、`careers` 对外 JSON 结构与现状完全一致(字段名、分页结构、数据格式)。
- **产品 JSON 结构不可变**: `details`(对象,中文键)、`features`(字符串数组)、`applications`(数组 `{name, description}`)、`safety_info`(对象),与 `prisma/seed.ts` 原结构一致。
- **ID 为整数**: Payload Postgres 默认 `serial` id,保证 `/products/{数字id}`、`/news/{数字id}` URL 契约不变。
- **前台视觉不变**: 只改数据源,不改任何公共页面的 JSX/样式。
- **权限**: Payload 原生认证,`users` 集合加 `role`(admin/editor);前台内容公开读、admin/editor 写;`contact-submissions` 公开写、admin 读。
- **删除全部**: 自定义后台 `app/admin/*`、`app/api/admin/*`、`app/lib/{auth,middleware,api-wrapper,prisma}.ts`、`prisma/`、JWT/RBAC、旧依赖。
- **主题**: Payload 后台金色 `#d4af37` 主题。
- **界面语言**: 中文 label。
- **每个任务结束提交一次 git**。

---

### Task 1: 搭建 Payload 骨架,用 Payload 接管 `/admin`

替换自定义后台为 Payload 管理后台外壳。验证:dev 启动,`/admin` 显示 Payload 登录页。

**Files:**
- Create: `payload.config.ts`(根目录)
- Create: `app/(payload)/layout.tsx`、`app/(payload)/admin/[[...segments]]/page.tsx`、`app/(payload)/admin/[[...segments]]/not-found.tsx`、`app/(payload)/admin/importMap.js`、`app/(payload)/api/[...slug]/route.ts`
- Modify: `next.config.ts`、`tsconfig.json`、`.env`、`package.json`、`app/globals.scss`
- Delete: `app/admin/`、`app/api/admin/`、`app/lib/auth.ts`、`app/lib/middleware.ts`、`app/lib/api-wrapper.ts`

**Interfaces:**
- Consumes: 现有 Next 应用、`.env`(DATABASE_URL)。
- Produces: `@payload-config` 路径别名;`payload.config.ts`(初版仅 users 集合);`(payload)` 路由组;`payload migrate:push` 建表;`payload generate:types` 生成 `.payload/types.ts`。

- [ ] **Step 1: 生成 Payload 官方骨架(用于获取与 3.88 版本精确匹配的样板文件)**

```bash
cd /tmp && rm -rf payload-skel && npx create-payload-app@latest --template blank --name payload-skel --db postgres --use-npm --no-deps
```

期望:在 `/tmp/payload-skel` 生成一个 Payload 3.88 项目(含 `payload.config.ts`、`src/app/(payload)/` 或 `app/(payload)/`)。若 `--no-deps` 不被支持,去掉该 flag 允许其安装。若 `create-payload-app` 失败(网络/交互),用下面嵌入式样板手动创建 `(payload)` 文件,并在 Step 5 验证时按实际报错微调(参考 `node_modules/payload` 内文档或官方文档)。

- [ ] **Step 2: 安装 Payload 依赖**

```bash
cd //wsl.localhost/Ubuntu/home/unice
npm install payload@3.88.0 @payloadcms/next@3.88.0 @payloadcms/db-postgres@3.88.0 @payloadcms/richtext-lexical@3.88.0 graphql@^16.8.1 sharp
```

期望:`package.json` dependencies 出现上述包。若 Next 16 与 Payload 冲突导致 npm 解析失败,按 Global Constraints 降级 Next。

- [ ] **Step 3: 删除自定义后台与死代码**

```bash
git rm -r app/admin app/api/admin
git rm app/lib/auth.ts app/lib/middleware.ts app/lib/api-wrapper.ts
```

期望:这些文件移出工作区。`app/lib/products.ts`、`app/lib/prisma.ts`、公共 API 路由暂不动(仍引用 prisma,直到 Task 4/5 再改)。

- [ ] **Step 4: 拷贝 Payload 路由组并创建配置**

从 `/tmp/payload-skel` 拷贝 `(payload)` 路由组到本仓库:

```bash
SKEL=/tmp/payload-skel
# 找到骨架的 (payload) 目录(可能带 src/ 前缀)
PAYLOAD_GROUP=$(find $SKEL -type d -name "(payload)" | head -1)
cp -r "$PAYLOAD_GROUP" app/
```

若骨架用 `src/` 结构,拷贝后确认 `app/(payload)/` 下有 `layout.tsx`、`admin/`、`api/`。然后:

创建 `payload.config.ts`(初版,只含 users):

```ts
import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './payload/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '· 联合化工管理后台',
    },
  },
  collections: [Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '.payload/types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
})
```

创建 `payload/collections/Users.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: '系统',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      label: '角色',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
      ],
    },
    {
      name: 'displayName',
      type: 'text',
      label: '显示名称',
    },
  ],
}
```

修改 `next.config.ts`:

```ts
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default withPayload(nextConfig)
```

修改 `tsconfig.json` 的 `paths`,加入 `@payload-config`(其余保留):

```json
    "paths": {
      "@/*": ["./app/*"],
      "@/components/*": ["./app/components/*"],
      "@/lib/*": ["./app/lib/*"],
      "public@/*": ["./public/*"],
      "@payload-config": ["./payload.config.ts"]
    }
```

在 `.env` 增加(保留原 DATABASE_URL):

```
PAYLOAD_SECRET="dev-secret-please-change-in-production-0123456789abcdef"
DATABASE_URI="postgresql://postgres:housuwen@116.62.53.254:5432/unice"
```

修改 `package.json`:
- 移除 `"prisma": { "seed": ... }` 段。
- scripts 里删除 `db:*` 四个脚本,新增(注意:本仓库无 `typecheck` npm script,先补上,引用已有的 `typecheck.sh`):

```json
    "typecheck": "bash typecheck.sh",
    "payload:generate:types": "payload generate:types",
    "payload:migrate": "payload migrate",
    "payload:migrate:create": "payload migrate:create",
    "payload:migrate:push": "payload migrate:push",
    "payload:seed": "tsx -r dotenv/config payload/seed.ts"
```

修改 `app/globals.scss`,删除两行引用已删 admin 样式的 `@use`(保留其余):

```scss
@use "./admin/dashboard/dashboard.scss";
@use "./admin/components/menu-styles.scss";
```

- [ ] **Step 5: 生成类型并推送表结构**

```bash
npx payload generate:types
npx payload migrate:push
```

期望:`generate:types` 生成 `.payload/types.ts`;`migrate:push` 连接数据库并创建 Payload 表(`users` 等)。若远程库 `116.62.53.254` 连不上,改用本地库:`docker-compose up -d postgres`,并把 `.env` 的 `DATABASE_URI` 临时改为 `postgresql://postgres:housuwen@localhost:5432/unice`。

- [ ] **Step 6: 验证类型检查与 dev 启动**

```bash
npm run typecheck
npm run dev
```

期望:`typecheck` 通过;dev 无报错。浏览器打开 `http://localhost:3000/admin`,显示 Payload 登录页(无需登录即可看到页面)。若 dev 报 Next/Payload 不兼容错误,降级 Next 15 并重试。

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "feat: 安装 Payload CMS 骨架，用 Payload 接管 /admin 后台"
```

---

### Task 2: 创建管理员账号并验证登录

**Files:**
- Create: `payload/seed.ts`(仅管理员账号部分)
- Modify: `payload.config.ts`(如需)

**Interfaces:**
- Consumes: `payload/collections/Users.ts`(auth 启用,有 `role` 字段)。
- Produces: 后台可登录的管理员账号 `admin@unicechemical.com` / `admin123456`。

- [ ] **Step 1: 创建 `payload/seed.ts`**

```ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })

  const email = 'admin@unicechemical.com'
  const exists = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (exists.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email,
        password: 'admin123456',
        role: 'admin',
        displayName: '系统管理员',
      },
    })
    console.log('✓ 创建管理员:', email)
  } else {
    console.log('管理员已存在，跳过:', email)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 2: 运行 seed**

```bash
npm run payload:seed
```

期望:输出 `✓ 创建管理员: admin@unicechemical.com`。

- [ ] **Step 3: 验证登录**

dev 保持运行,浏览器打开 `http://localhost:3000/admin`,用 `admin@unicechemical.com` / `admin123456` 登录。期望:成功进入 Payload 后台首页(有 `users` 集合)。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: 添加 Payload seed 创建管理员账号"
```

---

### Task 3: 定义全部内容集合与访问控制

**Files:**
- Create: `payload/access.ts`
- Create: `payload/collections/{Categories,Products,NewsCategories,News,Careers,HeroBanners,ContactSubmissions}.ts`
- Modify: `payload.config.ts`(注册全部集合)

**Interfaces:**
- Consumes: `payload/collections/Users.ts` 的 `role` 字段。
- Produces: 7 个集合 slug:`categories`、`products`、`news-categories`、`news`、`careers`、`hero-banners`、`contact-submissions`;访问控制 helper `isAdmin` / `isAdminOrEditor`。

- [ ] **Step 1: 创建 `payload/access.ts`**

```ts
import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => {
  const user = req.user
  return user?.role === 'admin'
}

export const isAdminOrEditor: Access = ({ req }) => {
  const user = req.user
  return user?.role === 'admin' || user?.role === 'editor'
}
```

- [ ] **Step 2: 创建 `payload/collections/Categories.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: '产品',
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true, label: '分类名称' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'Slug', admin: { description: 'URL 标识，如 thermoplastic-resins' } },
    { name: 'description', type: 'textarea', label: '描述' },
    { name: 'parent', type: 'relationship', relationTo: 'categories', label: '父分类' },
    { name: 'sort_order', type: 'number', defaultValue: 0, label: '排序' },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
```

- [ ] **Step 3: 创建 `payload/collections/Products.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: '产品',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '产品名称' },
    { name: 'cas_no', type: 'text', label: 'CAS 号' },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: '产品分类' },
    { name: 'description', type: 'textarea', label: '产品描述' },
    { name: 'details', type: 'json', label: '详细参数', admin: { description: '对象：外观/固含量/粘度等' } },
    { name: 'image_url', type: 'text', label: '图片 URL' },
    { name: 'features', type: 'json', label: '产品特性', admin: { description: '字符串数组' } },
    { name: 'applications', type: 'json', label: '应用领域', admin: { description: '数组 [{name, description}]' } },
    { name: 'safety_info', type: 'json', label: '安全信息', admin: { description: '对象：危险性/储存条件等' } },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
```

- [ ] **Step 4: 创建 `payload/collections/NewsCategories.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const NewsCategories: CollectionConfig = {
  slug: 'news-categories',
  admin: {
    useAsTitle: 'name',
    group: '新闻',
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true, label: '分类名称' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'Slug', admin: { description: '如 company-news' } },
    { name: 'description', type: 'textarea', label: '描述' },
    { name: 'color', type: 'text', label: '分类颜色', admin: { description: '如 #d4af37' } },
    { name: 'sort_order', type: 'number', defaultValue: 0, label: '排序' },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
```

- [ ] **Step 5: 创建 `payload/collections/News.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdminOrEditor } from '../access'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    group: '新闻',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: '标题' },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      label: '正文',
    },
    { name: 'excerpt', type: 'textarea', label: '摘要' },
    { name: 'type', type: 'text', defaultValue: 'news', label: '类型', admin: { description: '如 news / industry / product / event / tech' } },
    { name: 'publish_date', type: 'date', label: '发布日期' },
    { name: 'is_published', type: 'checkbox', defaultValue: true, label: '已发布' },
    { name: 'author', type: 'text', label: '作者' },
    { name: 'image_url', type: 'text', label: '图片 URL' },
    {
      name: 'tags',
      type: 'array',
      label: '标签',
      fields: [{ name: 'tag', type: 'text' }],
    },
    { name: 'read_time', type: 'number', label: '阅读时间（分钟）' },
    { name: 'views_count', type: 'number', defaultValue: 0, label: '浏览次数' },
    { name: 'category', type: 'relationship', relationTo: 'news-categories', label: '新闻分类' },
    { name: 'seo_title', type: 'text', label: 'SEO 标题' },
    { name: 'seo_description', type: 'textarea', label: 'SEO 描述' },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: '精选' },
    { name: 'sort_order', type: 'number', defaultValue: 0, label: '排序' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
```

- [ ] **Step 6: 创建 `payload/collections/Careers.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Careers: CollectionConfig = {
  slug: 'careers',
  admin: {
    useAsTitle: 'position',
    group: '招聘',
  },
  fields: [
    { name: 'position', type: 'text', required: true, label: '职位名称' },
    { name: 'department', type: 'text', label: '部门' },
    { name: 'location', type: 'text', label: '工作地点' },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'full_time',
      label: '职位类型',
      options: [
        { label: '全职', value: 'full_time' },
        { label: '兼职', value: 'part_time' },
        { label: '合同工', value: 'contract' },
        { label: '实习', value: 'internship' },
        { label: '远程', value: 'remote' },
      ],
    },
    { name: 'experience_requirement', type: 'text', label: '经验要求' },
    { name: 'description', type: 'textarea', label: '职位描述' },
    {
      name: 'requirements',
      type: 'array',
      label: '任职要求',
      fields: [{ name: 'text', type: 'text' }],
    },
    {
      name: 'responsibilities',
      type: 'array',
      label: '岗位职责',
      fields: [{ name: 'text', type: 'text' }],
    },
    { name: 'application_deadline', type: 'date', label: '申请截止日期' },
    { name: 'salary_range', type: 'text', label: '薪资范围' },
    { name: 'education_requirement', type: 'text', label: '学历要求' },
    { name: 'work_environment', type: 'textarea', label: '工作环境' },
    {
      name: 'career_benefits',
      type: 'array',
      label: '职业福利',
      fields: [{ name: 'text', type: 'text' }],
    },
    { name: 'contact_email', type: 'email', label: '联系邮箱' },
    { name: 'contact_phone', type: 'text', label: '联系电话' },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
    { name: 'sort_order', type: 'number', defaultValue: 0, label: '排序' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
```

- [ ] **Step 7: 创建 `payload/collections/HeroBanners.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const HeroBanners: CollectionConfig = {
  slug: 'hero-banners',
  admin: {
    useAsTitle: 'title',
    group: '首页',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: '主标题' },
    { name: 'subtitle', type: 'text', label: '副标题' },
    { name: 'image_url', type: 'text', label: '图片 URL' },
    { name: 'button_text', type: 'text', label: '按钮文字' },
    { name: 'button_url', type: 'text', label: '按钮链接' },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
    { name: 'sort_order', type: 'number', defaultValue: 0, label: '排序' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
```

- [ ] **Step 8: 创建 `payload/collections/ContactSubmissions.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    group: '客服',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '姓名' },
    { name: 'email', type: 'email', required: true, label: '邮箱' },
    { name: 'phone', type: 'text', label: '电话' },
    { name: 'company', type: 'text', label: '公司' },
    { name: 'message', type: 'textarea', required: true, label: '留言内容' },
    { name: 'ip_address', type: 'text', label: 'IP 地址' },
    { name: 'user_agent', type: 'text', label: 'User Agent' },
    { name: 'is_read', type: 'checkbox', defaultValue: false, label: '已读' },
  ],
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
}
```

- [ ] **Step 9: 更新 `payload.config.ts` 注册全部集合**

把 `import { Users } from './payload/collections/Users'` 之后追加:

```ts
import { Categories } from './payload/collections/Categories'
import { Products } from './payload/collections/Products'
import { NewsCategories } from './payload/collections/NewsCategories'
import { News } from './payload/collections/News'
import { Careers } from './payload/collections/Careers'
import { HeroBanners } from './payload/collections/HeroBanners'
import { ContactSubmissions } from './payload/collections/ContactSubmissions'
```

并把 `collections: [Users]` 改为:

```ts
  collections: [
    Users,
    Categories,
    Products,
    NewsCategories,
    News,
    Careers,
    HeroBanners,
    ContactSubmissions,
  ],
```

- [ ] **Step 10: 重新生成类型并推送表结构**

```bash
npx payload generate:types
npx payload migrate:push
npm run typecheck
```

期望:类型生成成功;`migrate:push` 创建 7 个新集合的表;`typecheck` 通过。

- [ ] **Step 11: 验证后台侧边栏出现集合**

dev 保持运行,登录 `/admin`。期望:侧边栏出现 产品(分类/产品)、新闻(新闻分类/新闻)、招聘、首页(轮播)、客服(联系提交)、系统(用户)分组及集合。

- [ ] **Step 12: 提交**

```bash
git add -A
git commit -m "feat: 定义 Payload 全部内容集合与访问控制"
```

---

### Task 4: Payload Local API 客户端 + 重写服务端数据层

**Files:**
- Create: `app/lib/payload.ts`
- Create: `app/lib/mappers.ts`
- Create: `app/lib/lexical.ts`
- Modify: `app/lib/products.ts`(整体重写)
- Modify: `app/products/[id]/page.tsx`(数据函数改用 Payload)

**Interfaces:**
- Consumes: `payload.config.ts`(`@payload-config`)、`payload/collections/*`。
- Produces:
  - `getPayloadClient(): Promise<Payload>` — 惰性单例。
  - `mapProduct(p: any): Product`(id, name, cas_no, category_id, description, details, image_url, created_at(Date), updated_at(Date), is_active, category:{name})。
  - `mapNews(n: any): NewsItem`(id, title, excerpt, content(HTML), type, publish_date, author, image_url, tags(string[]), read_time, views_count, category, category_id, featured)。
  - `lexicalToHtml(value): string`、`htmlToText(html): string`。
  - `getNewsTypeLabel(type): string`、`getNewsCategory(type): string`。
  - 保留原函数签名:`getPopularProducts()`、`getProducts(page, limit, category)`、`getProductById(id)`、`getNews(page, limit)`、`getNewsById(id)`。

- [ ] **Step 1: 创建 `app/lib/payload.ts`**

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (!cached) {
    cached = await getPayload({ config })
  }
  return cached
}
```

- [ ] **Step 2: 创建 `app/lib/lexical.ts`**

```ts
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical'

export function lexicalToHtml(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  try {
    return convertLexicalToHTML({ data: value as never })
  } catch (e) {
    console.error('lexicalToHtml failed:', e)
    return ''
  }
}

export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}
```

验证 `convertLexicalToHTML` 的导出与签名:

```bash
node -e "const m = require('@payloadcms/richtext-lexical'); console.log(typeof m.convertLexicalToHTML)"
```

期望输出 `function`。若名字不同(如 `convertLexicalToHTML` 不存在),`node -e "console.log(Object.keys(require('@payloadcms/richtext-lexical')).filter(k=>/convert/i.test(k)))"` 找到正确导出并替换。

- [ ] **Step 3: 创建 `app/lib/mappers.ts`**

```ts
import { htmlToText, lexicalToHtml } from './lexical'

export function relToId(rel: unknown): number | undefined {
  if (typeof rel === 'number') return rel
  if (rel && typeof rel === 'object') return (rel as { id?: number }).id
  return undefined
}

export function relToName(rel: unknown): string | undefined {
  if (rel && typeof rel === 'object') return (rel as { name?: string }).name
  return undefined
}

export function mapProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    cas_no: p.cas_no ?? undefined,
    category_id: relToId(p.category),
    description: p.description ?? undefined,
    details: p.details ?? null,
    image_url: p.image_url ?? undefined,
    created_at: p.createdAt ? new Date(p.createdAt) : undefined,
    updated_at: p.updatedAt ? new Date(p.updatedAt) : undefined,
    is_active: p.is_active,
    category: p.category ? { name: relToName(p.category) ?? '' } : undefined,
  }
}

export function mapNews(n: any) {
  const html = lexicalToHtml(n.content)
  const text = htmlToText(html)
  return {
    id: n.id,
    title: n.title,
    excerpt: n.excerpt || (text ? `${text.substring(0, 120)}${text.length > 120 ? '...' : ''}` : ''),
    content: html,
    type: getNewsTypeLabel(n.type),
    publish_date: n.publish_date,
    author: n.author || '江西联合化工',
    image_url: n.image_url,
    tags: (n.tags || []).map((t: any) => t.tag),
    read_time: n.read_time || (text ? Math.ceil(text.length / 500) : 3),
    views_count: n.views_count || 0,
    category: relToName(n.category) || getNewsCategory(n.type),
    category_id: relToId(n.category),
    featured: n.featured || false,
  }
}

export function getNewsTypeLabel(type?: string): string {
  const map: Record<string, string> = {
    news: '公司新闻',
    industry: '行业资讯',
    product: '产品发布',
    event: '企业活动',
    tech: '技术创新',
    responsibility: '社会责任',
  }
  return map[type || ''] || '新闻'
}

export function getNewsCategory(type?: string): string {
  const map: Record<string, string> = {
    news: '公司新闻',
    industry: '行业资讯',
    product: '产品发布',
    event: '企业活动',
    tech: '技术创新',
    responsibility: '社会责任',
  }
  return map[type || ''] || '公司新闻'
}
```

- [ ] **Step 4: 整体重写 `app/lib/products.ts`**

```ts
import { getPayloadClient } from './payload'
import { mapNews, mapProduct } from './mappers'

export async function getPopularProducts() {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: { is_active: { equals: true } },
      depth: 1,
      sort: '-createdAt',
      limit: 3,
    })
    return docs.map(mapProduct)
  } catch (error) {
    console.error('Failed to fetch popular products:', error)
    return []
  }
}

export async function getProducts(page = 1, limit = 12, category?: string) {
  try {
    const payload = await getPayloadClient()

    let categoryId: number | undefined
    if (category && category !== '全部类别') {
      const cat = await payload.find({
        collection: 'categories',
        where: { name: { equals: category } },
        limit: 1,
      })
      categoryId = cat.docs[0]?.id
    }

    const where: Record<string, unknown> = { is_active: { equals: true } }
    if (categoryId !== undefined) where.category = { equals: categoryId }

    const result = await payload.find({
      collection: 'products',
      where,
      depth: 1,
      sort: '-createdAt',
      page,
      limit,
    })

    const cats = await payload.find({
      collection: 'categories',
      where: { is_active: { equals: true } },
      limit: 100,
      sort: 'name',
    })

    return {
      products: result.docs.map(mapProduct),
      categories: cats.docs.map((c: any) => c.name),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return { products: [], categories: [], pagination: null }
  }
}

export async function getProductById(id: number) {
  try {
    const payload = await getPayloadClient()
    const product = await payload.findByID({
      collection: 'products',
      id,
      depth: 1,
      dontThrow: true,
    })
    if (!product || !product.is_active) return null
    return mapProduct(product)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export async function getNews(page = 1, limit = 10) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'news',
      where: { is_published: { equals: true } },
      depth: 1,
      sort: '-createdAt',
      page,
      limit,
    })
    return {
      news: result.docs.map(mapNews),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    }
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return { news: [], pagination: null }
  }
}

export async function getNewsById(id: number) {
  try {
    const payload = await getPayloadClient()
    const news = await payload.findByID({
      collection: 'news',
      id,
      depth: 1,
      dontThrow: true,
    })
    if (!news) return null
    return mapNews(news)
  } catch (error) {
    console.error('Failed to fetch news item:', error)
    return null
  }
}
```

- [ ] **Step 5: 重写 `app/products/[id]/page.tsx` 的数据函数**

把该文件的 `getProduct`、`getRelatedProducts`、`generateStaticParams` 三个函数整体替换为:

```ts
import { getPayloadClient } from '@/lib/payload'
import { mapProduct } from '@/lib/mappers'

async function getProduct(id: number) {
  try {
    const payload = await getPayloadClient()
    const product = await payload.findByID({
      collection: 'products',
      id,
      depth: 1,
      dontThrow: true,
    })
    if (!product || !product.is_active) return null
    return mapProduct(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return null
  }
}

async function getRelatedProducts(categoryId: number | null, currentId: number) {
  if (!categoryId) return []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: {
        category: { equals: categoryId },
        id: { not_equals: currentId },
        is_active: { equals: true },
      },
      depth: 1,
      sort: '-createdAt',
      limit: 4,
    })
    return result.docs.map(mapProduct)
  } catch (e) {
    return []
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { is_active: { equals: true } },
      depth: 0,
      limit: 500,
    })
    return result.docs.map((p: any) => ({ id: p.id.toString() }))
  } catch (error) {
    console.error('SSG generation failed:', error)
    return []
  }
}
```

同时把文件顶部的 `import { prisma } from "@/lib/prisma";` 删除(替换为上面两个 import)。

- [ ] **Step 6: 验证类型检查 + 前台服务端页面渲染**

```bash
npm run typecheck
npm run dev
```

期望:`typecheck` 通过;访问 `http://localhost:3000`、`/products`、`/news`(dev 下无数据也正常,Task 7 seed 后有数据)。首页 `getPopularProducts` 不抛错(返回空数组兜底)。

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "feat: 服务端数据层切换为 Payload Local API"
```

---

### Task 5: 公共 API 路由改为 Payload 适配层

**Files:**
- Modify: `app/api/products/route.ts`、`app/api/products-details/[id]/route.ts`、`app/api/news/route.ts`、`app/api/news/[id]/route.ts`、`app/api/popular-products/route.ts`、`app/api/careers/route.ts`

**Interfaces:**
- Consumes: `getPayloadClient`、`mapProduct`、`mapNews`、`relToId`、`getNewsTypeLabel`、`getNewsCategory`、`lexicalToHtml`。
- Produces: 与现状完全一致的 JSON 响应(见 Global Constraints)。

- [ ] **Step 1: 重写 `app/api/products/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapProduct } from '@/lib/mappers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1') || 1
    const limit = parseInt(searchParams.get('limit') || '12') || 12
    const category = searchParams.get('category') || ''

    const payload = await getPayloadClient()

    let categoryId: number | undefined
    if (category && category !== '全部类别') {
      const cat = await payload.find({
        collection: 'categories',
        where: { name: { equals: category }, is_active: { equals: true } },
        limit: 1,
      })
      categoryId = cat.docs[0]?.id
    }

    const where: Record<string, unknown> = { is_active: { equals: true } }
    if (categoryId !== undefined) where.category = { equals: categoryId }

    const result = await payload.find({
      collection: 'products',
      where,
      depth: 1,
      sort: '-createdAt',
      page,
      limit,
    })

    const cats = await payload.find({
      collection: 'categories',
      where: { is_active: { equals: true } },
      limit: 100,
      sort: 'name',
    })

    return NextResponse.json({
      products: result.docs.map(mapProduct),
      categories: cats.docs.map((c: any) => c.name),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
```

- [ ] **Step 2: 重写 `app/api/popular-products/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapProduct } from '@/lib/mappers'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { is_active: { equals: true } },
      depth: 1,
      sort: '-createdAt',
      limit: 3,
    })
    return NextResponse.json(result.docs.map(mapProduct))
  } catch (error) {
    console.error('Failed to fetch popular products:', error)
    return NextResponse.json({ error: 'Failed to fetch popular products' }, { status: 500 })
  }
}
```

- [ ] **Step 3: 重写 `app/api/products-details/[id]/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapProduct, relToId } from '@/lib/mappers'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 1,
      dontThrow: true,
    })

    if (!product || !product.is_active) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const categoryId = relToId(product.category)
    let relatedProducts: any[] = []
    if (categoryId !== undefined) {
      const rel = await payload.find({
        collection: 'products',
        where: {
          category: { equals: categoryId },
          is_active: { equals: true },
          id: { not_equals: productId },
        },
        depth: 1,
        sort: '-createdAt',
        limit: 3,
      })
      relatedProducts = rel.docs.map(mapProduct)
    }

    return NextResponse.json({ product: mapProduct(product), relatedProducts })
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
```

- [ ] **Step 4: 重写 `app/api/news/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapNews } from '@/lib/mappers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1') || 1
    const limit = parseInt(searchParams.get('limit') || '12') || 12
    const category = searchParams.get('category') || ''

    const payload = await getPayloadClient()

    let categoryId: number | undefined
    if (category && category !== '全部类别') {
      const cat = await payload.find({
        collection: 'news-categories',
        where: { name: { equals: category }, is_active: { equals: true } },
        limit: 1,
      })
      categoryId = cat.docs[0]?.id
    }

    const where: Record<string, unknown> = { is_published: { equals: true } }
    if (categoryId !== undefined) where.category = { equals: categoryId }

    const result = await payload.find({
      collection: 'news',
      where,
      depth: 1,
      sort: '-sort_order,-publish_date',
      page,
      limit,
    })

    const cats = await payload.find({
      collection: 'news-categories',
      where: { is_active: { equals: true } },
      limit: 100,
      sort: 'sort_order',
    })

    return NextResponse.json({
      news: result.docs.map(mapNews),
      categories: ['全部类别', ...cats.docs.map((c: any) => c.name)],
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('获取新闻数据失败:', error)
    return NextResponse.json({ error: '获取新闻数据失败' }, { status: 500 })
  }
}
```

- [ ] **Step 5: 重写 `app/api/news/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { mapNews, relToId } from '@/lib/mappers'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const newsId = parseInt(id)
    if (isNaN(newsId) || newsId <= 0) {
      return NextResponse.json({ error: '无效的新闻ID' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const news = await payload.findByID({
      collection: 'news',
      id: newsId,
      depth: 1,
      dontThrow: true,
    })

    if (!news || !news.is_published) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    await payload.update({
      collection: 'news',
      id: newsId,
      data: { views_count: (news.views_count || 0) + 1 },
    })

    const formatted = mapNews(news)
    formatted.views_count = (news.views_count || 0) + 1
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('获取新闻详情失败:', error)
    return NextResponse.json({ error: '获取新闻详情失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const newsId = parseInt(id)
    const body = await request.json().catch(() => ({}))
    const limit = parseInt(body.limit) || 4

    if (isNaN(newsId) || newsId <= 0) {
      return NextResponse.json({ error: '无效的新闻ID' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const current = await payload.findByID({
      collection: 'news',
      id: newsId,
      depth: 1,
      dontThrow: true,
    })
    if (!current) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    const categoryId = relToId(current.category)
    const conditions: Record<string, unknown>[] = []
    if (categoryId !== undefined) conditions.push({ category: { equals: categoryId } })
    conditions.push({ type: { equals: current.type } })

    const result = await payload.find({
      collection: 'news',
      where: {
        and: [
          { id: { not_equals: newsId } },
          { is_published: { equals: true } },
          { or: conditions },
        ],
      },
      depth: 1,
      sort: '-publish_date',
      limit,
    })

    return NextResponse.json(result.docs.map(mapNews))
  } catch (error) {
    console.error('获取相关新闻失败:', error)
    return NextResponse.json({ error: '获取相关新闻失败' }, { status: 500 })
  }
}
```

- [ ] **Step 6: 重写 `app/api/careers/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'careers',
      where: { is_active: { equals: true } },
      depth: 0,
      sort: '-createdAt',
      limit: 100,
    })

    const formatted = result.docs.map((career: any) => ({
      id: career.id,
      position: career.position,
      department: career.department || '未指定部门',
      location: career.location || '星火工业园',
      type: getJobTypeLabel(career.type),
      experience: career.experience_requirement || '经验不限',
      description: career.description || '我们正在寻找优秀的人才加入我们的团队。',
      requirements: (career.requirements || []).map((r: any) => r.text),
      responsibilities: (career.responsibilities || []).map((r: any) => r.text),
      application_deadline: career.application_deadline ?? null,
      created_at: career.createdAt,
      updated_at: career.updatedAt,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('获取职位信息失败:', error)
    return NextResponse.json({ error: '获取职位信息失败' }, { status: 500 })
  }
}

function getJobTypeLabel(type?: string): string {
  const map: Record<string, string> = {
    full_time: '全职',
    part_time: '兼职',
    contract: '合同工',
    internship: '实习',
    remote: '远程',
  }
  return map[type || ''] || '全职'
}
```

注意:删除原文件中的公开 `POST`(创建职位改由后台完成)。

- [ ] **Step 7: 验证所有公共 API 返回结构与现状一致**

```bash
npm run typecheck
npm run dev
```

然后在 dev 运行中逐条验证(无数据时返回空数组/空列表也符合预期,结构必须一致):

```bash
curl -s 'http://localhost:3000/api/products?page=1&limit=12' | head -c 400; echo
curl -s 'http://localhost:3000/api/popular-products' | head -c 200; echo
curl -s 'http://localhost:3000/api/news?page=1&limit=12' | head -c 400; echo
curl -s 'http://localhost:3000/api/careers' | head -c 300; echo
```

期望:分别返回 `{products, categories, pagination}`、数组、`{news, categories, pagination}`、数组;无 500。若 dev 未启动,用后台 `nohup npm run dev &` 方式。

- [ ] **Step 8: 提交**

```bash
git add -A
git commit -m "feat: 公共 API 路由改为 Payload Local API 适配层"
```

---

### Task 6: 联系表单真实提交

**Files:**
- Create: `app/api/contact/route.ts`
- Modify: `app/contact/page.tsx`(`handleSubmit`)

**Interfaces:**
- Consumes: `getPayloadClient`、`contact-submissions` 集合。
- Produces: `POST /api/contact` 写入 contact-submissions;前台表单提交成功/失败提示。

- [ ] **Step 1: 创建 `app/api/contact/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: '姓名、邮箱和留言内容为必填项' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        company: body.company || '',
        message: body.message,
        ip_address: request.headers.get('x-forwarded-for') || '',
        user_agent: request.headers.get('user-agent') || '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('提交联系表单失败:', error)
    return NextResponse.json({ error: '提交失败，请稍后重试' }, { status: 500 })
  }
}
```

- [ ] **Step 2: 修改 `app/contact/page.tsx` 的 `handleSubmit`**

把现有:

```tsx
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应该提交表单数据到后端
    alert("感谢您的留言！我们会尽快回复您。");
    // 重置表单
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
  };
```

替换为:

```tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "提交失败");
      }
      alert("感谢您的留言！我们会尽快回复您。");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "提交失败，请稍后重试");
    }
  };
```

- [ ] **Step 3: 验证提交写入后台**

```bash
npm run typecheck
npm run dev
curl -s -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"测试","email":"test@example.com","message":"你好"}' ; echo
```

期望:返回 `{"success":true}`;登录 `/admin` → 客服 → 联系提交,能看到该条记录。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: 联系表单真实提交到 Payload contact-submissions"
```

---

### Task 7: 内容 seed(产品/新闻/招聘/轮播/分类)

**Files:**
- Modify: `payload/seed.ts`(在管理员之后追加内容 seed)

**Interfaces:**
- Consumes: `payload/collections/*`、`convertHTMLToLexical`。
- Produces: 分类、新闻分类、产品、新闻、招聘、轮播示例数据;管理员账号。

- [ ] **Step 1: 扩展 `payload/seed.ts`**

在 `process.exit(0)` 之前,把整个 `main()` 替换为(保留管理员创建逻辑,追加内容):

```ts
import 'dotenv/config'
import { convertHTMLToLexical } from '@payloadcms/richtext-lexical'
import { getPayload } from 'payload'
import config from '../payload.config'

// 把纯文本(段落 + "- " 列表)转成简单 HTML，再转 lexical
function textToLexical(text: string) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim())
  const html = paragraphs
    .map((p) => {
      const lines = p.split('\n').filter((l) => l.trim())
      if (lines.every((l) => l.trim().startsWith('-'))) {
        const items = lines
          .map((l) => l.replace(/^\s*-\s*/, '').trim())
          .map((l) => `<li>${l}</li>`)
          .join('')
        return `<ul>${items}</ul>`
      }
      return `<p>${lines.join('<br/>')}</p>`
    })
    .join('')
  return convertHTMLToLexical({ html })
}

async function main() {
  const payload = await getPayload({ config })

  // 1. 管理员
  const email = 'admin@unicechemical.com'
  const exists = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (exists.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password: 'admin123456', role: 'admin', displayName: '系统管理员' },
    })
    console.log('✓ 创建管理员:', email)
  }

  // 2. 产品分类
  const categoryDefs = [
    { name: '热塑性树脂', slug: 'thermoplastic-resins', description: '包括丙烯酸、PP树脂等热塑性材料，适用于物理干燥型涂料' },
    { name: '热固性树脂', slug: 'thermosetting-resins', description: '包括聚酯、氨基树脂等，需交联固化，性能优异' },
    { name: '水性体系', slug: 'waterborne-systems', description: '环保型水性乳液和分散体，低VOC排放' },
    { name: '功能性树脂', slug: 'functional-resins', description: '具有触变、附着力促进等特殊功能的树脂' },
    { name: '助剂与添加剂', slug: 'additives', description: '蜡分散体、特殊单体及改性剂' },
  ]
  const categoryIds: Record<string, number> = {}
  for (const c of categoryDefs) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      categoryIds[c.slug] = existing.docs[0].id
    } else {
      const doc = await payload.create({ collection: 'categories', data: c })
      categoryIds[c.slug] = doc.id
    }
  }
  console.log('✓ 产品分类', Object.keys(categoryIds).length, '个')

  // 3. 新闻分类
  const newsCategoryDefs = [
    { name: '公司新闻', slug: 'company-news', description: '公司内部新闻和公告', color: '#d4af37', sort_order: 1 },
    { name: '行业资讯', slug: 'industry-news', description: '化工行业最新动态和政策', color: '#3498db', sort_order: 2 },
    { name: '产品发布', slug: 'product-release', description: '新产品发布和更新', color: '#2ecc71', sort_order: 3 },
    { name: '企业活动', slug: 'corporate-events', description: '公司举办的各类活动', color: '#e74c3c', sort_order: 4 },
    { name: '技术创新', slug: 'technology-innovation', description: '技术研发和创新成果', color: '#9b59b6', sort_order: 5 },
    { name: '社会责任', slug: 'social-responsibility', description: '社会责任与公益活动', color: '#16a085', sort_order: 6 },
  ]
  const newsCategoryIds: Record<string, number> = {}
  for (const c of newsCategoryDefs) {
    const existing = await payload.find({ collection: 'news-categories', where: { slug: { equals: c.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      newsCategoryIds[c.slug] = existing.docs[0].id
    } else {
      const doc = await payload.create({ collection: 'news-categories', data: c })
      newsCategoryIds[c.slug] = doc.id
    }
  }
  console.log('✓ 新闻分类', Object.keys(newsCategoryIds).length, '个')

  // 4. 产品（含完整 JSON 结构）
  const productDefs: any[] = [
    {
      name: '丙烯酸树脂 (TPA-200)',
      cas_no: '25035-69-2',
      category: categoryIds['thermoplastic-resins'],
      description: '高性能热塑性丙烯酸树脂，专为汽车修补漆和高端工业涂料设计。',
      details: {
        外观: '无色透明颗粒或液体',
        固含量: '50% ± 1%',
        粘度: '2000-4000 mPa.s',
        酸值: '4-8 mgKOH/g',
        玻璃化温度: '60°C',
        溶剂体系: '甲苯/二甲苯',
      },
      image_url: '/images/products/acrylic-resin.jpg',
      features: ['优异的金属颜料定向排列性', '极佳的耐候性和保光性', '干燥速度快，硬度高', '与CAB和NC相容性好', '优异的耐醇性'],
      applications: [
        { name: '汽车修补漆', description: '用于制造高品质汽车修补底色漆和清漆' },
        { name: '塑胶涂料', description: 'ABS、PS等塑料表面的装饰性涂装' },
        { name: '集装箱涂料', description: '耐候性要求高的户外金属保护涂层' },
        { name: '一般工业漆', description: '机械设备和五金件的面漆' },
      ],
      safety_info: {
        危险性: '易燃液体',
        储存条件: '阴凉通风处，远离火源，库温不宜超过30℃',
        防护措施: '操作时需佩戴防毒面具和耐溶剂手套',
        急救措施: '吸入蒸气需迅速脱离现场至空气新鲜处',
      },
      is_active: true,
    },
    {
      name: 'PP树脂 (CPP-300)',
      cas_no: '68442-33-1',
      category: categoryIds['thermoplastic-resins'],
      description: '氯化聚丙烯树脂，专用于PP底材的附着力促进与复合油墨。',
      details: {
        外观: '微黄色颗粒',
        氯含量: '25% ± 2%',
        粘度: '500-2000 mPa.s',
        软化点: '90-110°C',
        溶剂体系: '甲苯/乙酸乙酯',
      },
      image_url: '/images/products/pp-resin.jpg',
      features: ['对PP底材附着力优异', '与多种树脂相容性好', '耐化学药品性佳'],
      applications: [
        { name: 'PP底材处理剂', description: 'PP塑料表面喷涂底漆' },
        { name: '复合油墨', description: 'OPP薄膜印刷复合油墨' },
        { name: '汽车内饰胶粘剂', description: 'PP件粘接用胶粘剂' },
      ],
      safety_info: {
        危险性: '可燃固体',
        储存条件: '阴凉干燥处，避免阳光直射',
        防护措施: '远离火源，保持通风',
      },
      is_active: true,
    },
    {
      name: '触变型树脂 (SCA-50)',
      cas_no: '307531-94-6',
      category: categoryIds['functional-resins'],
      description: '自带触变功能的两烯酸树脂，适用于抗流挂涂料体系。',
      details: {
        外观: '淡黄色透明液体',
        固含量: '50% ± 2%',
        粘度: '1500-3000 mPa.s',
        触变指数: '≥3.0',
      },
      image_url: '/images/products/sca-resin.jpg',
      features: ['优异的抗流挂性能', '良好的金属颜料排列', '储存稳定性好'],
      applications: [
        { name: '汽车金属闪光漆', description: '高抗流挂金属闪光面漆' },
        { name: '重防腐涂料', description: '厚膜型防腐涂料' },
        { name: '效果颜料分散', description: '珠光粉等效果颜料定向' },
      ],
      safety_info: {
        危险性: '易燃液体',
        储存条件: '阴凉通风处，远离火源',
        防护措施: '操作时佩戴防护眼镜和手套',
      },
      is_active: true,
    },
  ]
  for (const p of productDefs) {
    const existing = await payload.find({ collection: 'products', where: { cas_no: { equals: p.cas_no } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'products', data: p })
    }
  }
  console.log('✓ 产品', productDefs.length, '个')

  // 5. 新闻
  const newsDefs = [
    {
      title: '江西联合化工荣获2024年度化工行业创新奖',
      excerpt: '凭借在新材料研发领域的突出贡献，江西联合化工荣获中国化工协会颁发的年度创新奖。',
      content: `江西联合化工有限公司在2024年度中国化工协会评选中荣获"化工行业创新奖"，这是对公司在新材料研发领域卓越贡献的高度认可。

本次获奖的创新项目主要涉及新型环保树脂的研发与应用。联合化工研发团队历时三年，成功开发出具有自主知识产权的新一代环保树脂产品，其性能指标达到国际领先水平。

该创新产品在以下方面实现了重大突破：
- 挥发性有机化合物（VOC）含量降低80%以上
- 产品纯度达到99.9%，超越行业标准
- 生产能耗降低30%，实现绿色制造
- 产品应用范围扩大到航空航天等高端领域`,
      type: 'news',
      category: newsCategoryIds['company-news'],
      publish_date: '2024-11-10T00:00:00.000Z',
      is_published: true,
    },
    {
      title: '新一代汽车原厂漆树脂正式投产',
      excerpt: '我公司研发团队历时三年开发的新一代汽车原厂漆专用树脂正式投产，性能达到国际领先水平。',
      content: `江西联合化工有限公司研发团队历时三年开发的新一代汽车原厂漆专用树脂正式投产，标志着我国在汽车涂料领域实现了重大技术突破。

新一代汽车原厂漆树脂具有以下显著特点：
- 优异的耐候性和耐化学性
- 出色的附着力和柔韧性
- 低温固化性能优良
- 环保性能突出，符合欧盟REACH法规`,
      type: 'product',
      category: newsCategoryIds['product-release'],
      publish_date: '2024-11-08T00:00:00.000Z',
      is_published: true,
    },
    {
      title: '联合化工与欧洲知名企业达成战略合作',
      excerpt: '江西联合化工与德国巴斯夫公司签署战略合作协议，双方将在技术研发、市场拓展等领域开展深度合作。',
      content: `江西联合化工有限公司与德国巴斯夫公司在上海签署战略合作协议，双方将在技术研发、市场拓展等多个领域开展深度合作，共同开拓全球市场。

此次合作将聚焦高性能环保树脂的联合研发，双方将共享研发资源，共同推进新材料在汽车、电子等高端领域的应用。`,
      type: 'news',
      category: newsCategoryIds['company-news'],
      publish_date: '2024-11-05T00:00:00.000Z',
      is_published: true,
    },
  ]
  for (const n of newsDefs) {
    const existing = await payload.find({ collection: 'news', where: { title: { equals: n.title } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'news', data: { ...n, content: textToLexical(n.content), tags: [] } })
    }
  }
  console.log('✓ 新闻', newsDefs.length, '条')

  // 6. 招聘
  const careerDefs = [
    {
      position: '树脂研发工程师',
      department: '研发部',
      location: '星火工业园',
      type: 'full_time',
      experience_requirement: '3-5年经验',
      description: '负责丙烯酸树脂、PP树脂、触变型树脂等产品的研发工作，特别是在汽车内外饰件和原厂漆应用领域的技术开发。',
      requirements: ['化工、高分子材料、应用化学等相关专业本科及以上学历', '3年以上树脂研发工作经验，熟悉汽车涂料行业者优先', '掌握树脂合成工艺和配方设计，能独立开展研发工作', '具备良好的沟通能力和团队协作精神'],
      responsibilities: ['负责丙烯酸树脂、聚酯树脂、氨基树脂等产品的配方开发', '针对汽车内外饰件和原厂漆应用进行树脂性能优化', '制定和实施新产品研发计划，完成项目开发任务', '编写产品技术文档、工艺文件和质量标准'],
      is_active: true,
    },
    {
      position: 'DCS控制工程师',
      department: '生产部',
      location: '星火工业园',
      type: 'full_time',
      experience_requirement: '2-4年经验',
      description: '负责DCS自动化控制系统的运行维护，确保生产设备安全稳定运行，优化生产工艺参数。',
      requirements: ['自动化、化工机械、过程控制等相关专业大专及以上学历', '2年以上DCS系统操作维护经验，熟悉化工生产工艺', '掌握DCS系统的硬件结构、软件配置和编程方法', '能适应倒班工作，具备良好的应急处理能力'],
      responsibilities: ['负责DCS系统的日常监控、操作和维护工作', '监控生产过程中的关键参数，及时调整工艺条件', '处理DCS系统故障和报警，确保生产安全稳定', '记录运行数据，编写技术报告和改进建议'],
      is_active: true,
    },
    {
      position: '涂料销售工程师',
      department: '销售部',
      location: '全国（华东、华南、华北）',
      type: 'full_time',
      experience_requirement: '2-3年经验',
      description: '负责公司在涂料行业的树脂产品销售，重点开发汽车原厂漆、工业漆等领域的客户资源。',
      requirements: ['化工、市场营销等相关专业大专及以上学历', '2年以上化工产品销售经验', '熟悉汽车涂料行业者优先', '能适应频繁出差'],
      responsibilities: ['开发并维护涂料行业客户资源', '制定销售计划并完成销售目标', '协调技术部门提供售前售后支持'],
      is_active: true,
    },
  ]
  for (const c of careerDefs) {
    const existing = await payload.find({ collection: 'careers', where: { position: { equals: c.position } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'careers',
        data: {
          ...c,
          requirements: c.requirements.map((text: string) => ({ text })),
          responsibilities: c.responsibilities.map((text: string) => ({ text })),
          career_benefits: [],
        },
      })
    }
  }
  console.log('✓ 招聘', careerDefs.length, '条')

  // 7. 首页轮播
  const bannerDefs = [
    { title: '专业化工原料制造商', subtitle: '20年行业经验，为全球客户提供卓越化工解决方案', image_url: '/images/banners/hero-1.jpg', button_text: '了解更多', button_url: '/about', is_active: true, sort_order: 1 },
    { title: '创新化学科技，引领行业未来', subtitle: '专注树脂研发，性能达到国际领先水平', image_url: '/images/banners/hero-2.jpg', button_text: '查看产品', button_url: '/products', is_active: true, sort_order: 2 },
  ]
  for (const b of bannerDefs) {
    const existing = await payload.find({ collection: 'hero-banners', where: { title: { equals: b.title } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'hero-banners', data: b })
    }
  }
  console.log('✓ 轮播', bannerDefs.length, '条')

  console.log('🎉 Payload 数据 seed 完成！')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 2: 运行 seed 并验证**

```bash
npm run payload:seed
```

期望:依次输出各 `✓` 行,最后 `🎉 Payload 数据 seed 完成！`。

- [ ] **Step 3: 验证前台页面有数据**

dev 运行中访问 `http://localhost:3000`(首页热门产品)、`/products`、`/news`、`/news/1`、`/careers`、`/products/1`。期望:各页面正常渲染数据,新闻详情正文以段落/列表渲染。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: Payload 内容 seed（产品/新闻/招聘/轮播/分类）"
```

---

### Task 8: 移除 Prisma 与旧依赖

**Files:**
- Delete: `app/lib/prisma.ts`、`prisma/`、`test-db-connection.js`
- Modify: `package.json`(移除旧依赖与 prisma 脚本)、`.env`、`.dockerignore`

**Interfaces:**
- Consumes: 前序任务已移除所有 Prisma 引用(admin、API、lib、页面)。
- Produces: 项目完全脱离 Prisma;`npm run typecheck` 与 `npm run build` 通过。

- [ ] **Step 1: 确认无残留 Prisma 引用**

```bash
grep -rn "@prisma/client\|lib/prisma" app payload --include="*.ts" --include="*.tsx" || echo "无残留引用"
```

期望:输出 `无残留引用`。若有残留,先清理。

- [ ] **Step 2: 删除 Prisma 文件**

```bash
git rm -r prisma
git rm app/lib/prisma.ts test-db-connection.js
```

- [ ] **Step 3: 更新 `package.json`**

移除 dependencies/devDependencies 中的:`@prisma/client`、`prisma`、`bcrypt`、`bcryptjs`、`jsonwebtoken`、`@types/bcrypt`、`@types/bcryptjs`、`@types/jsonwebtoken`、`recharts`、`react-hook-form`(已确认在 app 内无有效引用)。同时删除 prisma 相关 scripts(`db:migrate`/`db:generate`/`db:studio`/`db:seed`)与 `"prisma"` 配置段(若 Task 1 已删则跳过)。随后运行:

```bash
npm uninstall @prisma/client prisma bcrypt bcryptjs jsonwebtoken @types/bcrypt @types/bcryptjs @types/jsonwebtoken recharts react-hook-form
```

- [ ] **Step 4: 更新 `.env`**

保留 `DATABASE_URL` 与 `DATABASE_URI`、`PAYLOAD_SECRET`,删除不再使用的注释段(可选)。

- [ ] **Step 5: 更新 `.dockerignore`**

在排除清单追加 Payload 生成物(避免打进镜像):

```
.payload
media
```

- [ ] **Step 6: 全量验证**

```bash
npm run typecheck
npm run build
```

期望:`typecheck` 无错误;`build` 成功完成(可看到 Payload admin 被编译)。若 build 因缺少静态数据而失败,排查报错并修复(一般为 Payload 配置或类型问题)。

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "refactor: 移除 Prisma 与旧认证依赖"
```

---

### Task 9: Payload 后台金色主题

**Files:**
- Create: `app/(payload)/custom.scss`
- Modify: `app/(payload)/layout.tsx`(导入 custom.scss)、`payload.config.ts`(meta)

**Interfaces:**
- Consumes: `(payload)` 布局。
- Produces: `/admin` 金色主题。

- [ ] **Step 1: 创建 `app/(payload)/custom.scss`**

```scss
:root {
  // 联合化工品牌金
  --theme-success-500: #d4af37;
  --theme-success-600: #c9a12e;
  --theme-success-700: #b8941f;
  --theme-success-100: #f9f5e7;
  --theme-success-150: #f3ecd2;
  --theme-success-200: #eadfc0;
  --theme-success-300: #dccf9e;
  --theme-elevation-0: #ffffff;
  --theme-elevation-50: #fbf9f1;
  --theme-elevation-100: #f5f0dd;
  --theme-elevation-150: #efe8c8;
  --theme-elevation-200: #e7ddb0;
}
```

- [ ] **Step 2: 在 `app/(payload)/layout.tsx` 顶部追加导入**

在现有 imports 中(通常在 `import '@payloadcms/next/css'` 之后)加入:

```ts
import './custom.scss'
```

- [ ] **Step 3: 更新 `payload.config.ts` 的 admin meta(若尚未包含)**

在 `admin` 配置中加入:

```ts
    meta: {
      titleSuffix: '· 联合化工管理后台',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.ico',
        },
      ],
    },
```

(若 Task 1 已加 `titleSuffix`,只确认存在即可;`icons` 可留空对象。)

- [ ] **Step 4: 验证主题生效**

dev 运行,打开 `/admin` 并登录。期望:主按钮、选中态等呈现金色调;后台可正常使用。若某些变量名在 3.88 不同导致部分未变色,属于可接受的样式细节,不阻塞。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "style: Payload 后台金色主题"
```

---

### Task 10: Docker 部署适配

**Files:**
- Modify: `Dockerfile`、`docker-compose.yml`

**Interfaces:**
- Consumes: Payload 迁移命令、`PAYLOAD_SECRET`、`DATABASE_URI`。
- Produces: 容器内可运行的 Payload + Next 应用。

- [ ] **Step 1: 更新 `Dockerfile`**

删除 Prisma 相关两行:

```dockerfile
COPY prisma ./prisma/
RUN npx prisma generate
```

在 `CMD` 前追加迁移执行(镜像运行时先建表再启动):

```dockerfile
CMD ["sh", "-c", "npx payload migrate && pm2-runtime start ecosystem.config.js"]
```

同时把 `ENV NEXT_TELEMETRY_DISABLED=1` 后追加 `ENV PAYLOAD_SEED`(可选,不需要则不写)。注意 `npx payload migrate` 需要 `PAYLOAD_SECRET` 与 `DATABASE_URI` 已注入(runtime env 注入,见 Step 2)。

- [ ] **Step 2: 更新 `docker-compose.yml` 的 app 服务**

在 `environment` 中加入:

```yaml
      PAYLOAD_SECRET: ${PAYLOAD_SECRET:-dev-secret-change-in-production}
      DATABASE_URI: postgresql://postgres:housuwen@postgres:5432/unice
```

(保留原有 `DATABASE_URL`、`NEXT_PUBLIC_API_URL`。)

- [ ] **Step 3: 验证 compose 语法**

```bash
docker-compose config >/dev/null && echo "compose 配置合法"
```

若本机无 docker,改为人工核对文件即可。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: Docker 部署适配 Payload（迁移与密钥注入）"
```

---

### Task 11: 最终验证

**Files:** 无新增。

- [ ] **Step 1: 全量检查**

```bash
npm run typecheck
npm run lint
npm run build
```

期望:全部通过,无 Prisma/旧后台残留错误。

- [ ] **Step 2: 端到端验证清单**

dev 运行中逐项确认:
1. `http://localhost:3000/admin` 打开 Payload 后台,`admin@unicechemical.com` / `admin123456` 登录成功。
2. 后台侧边栏出现全部集合;能新建/编辑一条产品或新闻并保存。
3. `http://localhost:3000` 首页热门产品渲染(3 个)。
4. `/products` 列表 + 分类筛选 + 分页正常。
5. `/products/1` 详情页 tabs(参数/应用/安全)正常,related products 显示。
6. `/news` 列表 + 分类筛选正常。
7. `/news/1` 详情正文渲染(段落/列表),相关新闻显示。
8. `/careers` 招聘列表渲染,展开职位正常。
9. `/contact` 提交表单,后台「客服 → 联系提交」看到记录。
10. 旧地址 `http://localhost:3000/api/admin/*` 返回 404。

- [ ] **Step 3: 提交(如有未提交改动)**

```bash
git add -A && git commit -m "chore: 收尾验证与修复" || echo "无改动"
```

---

## Self-Review

### 1. Spec 覆盖检查
- 全面替换 ✅ Task 1-8(自定义后台/Payload 接管/数据层)
- Payload 原生权限 ✅ Task 2-3(role + access)
- 数据无所谓、重新 seed ✅ Task 7
- 集合设计 ✅ Task 3(7 个集合对应 7 个 Prisma 模型)
- 前台服务端组件读 Payload ✅ Task 4
- 公共 API 适配层保持契约 ✅ Task 5
- 联系表单真实提交 ✅ Task 6
- 清理清单 ✅ Task 1, 8(admin/API/auth/prisma/旧依赖)
- 后台金色主题 ✅ Task 9
- Docker ✅ Task 10
- 验证标准 ✅ Task 11

### 2. 占位符扫描
无 TBD/TODO;所有代码步骤含完整代码与预期输出。

### 3. 类型一致性检查
- `getPayloadClient()` 在 payload.ts 定义,Task 4/5/6 一致使用。
- `mapProduct`/`mapNews`/`relToId`/`getNewsTypeLabel`/`getNewsCategory` 在 mappers.ts 定义,Task 4/5 一致引用。
- 集合 slug 在 Task 3 定义,Task 4/5/6/7 一致引用(`products`/`news`/`careers`/`categories`/`news-categories`/`hero-banners`/`contact-submissions`/`users`)。
- `textToLexical` 仅在 seed 内使用;`lexicalToHtml`/`htmlToText` 在 lexical.ts 定义,`mapNews` 引用。
- 函数签名与旧版一致(`getProducts(page, limit, category)` 等),页面调用方无需改动。
