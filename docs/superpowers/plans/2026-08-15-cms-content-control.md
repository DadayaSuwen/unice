# 官网内容后台化 + 富文本增强 + SEO 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Payload Globals + 媒体库把官网每一板块（首页/关于我们/产品详情/导航/页脚/联系/页头/SEO）变成后台可编辑，并把富文本编辑器升级为增强版。

**Architecture:** 在现有 Payload 3.88 上新增 6 个 Globals（site-settings/navigation/page-headers/home-page/about-page/contact-page）与 1 个 media 上传集合；新建共享富文本编辑器 `richTextEditor()`（固定工具栏+表格+文字颜色）；产品集合的裸 JSON 字段改为结构化数组、description 改富文本；前台各页改为服务端组件从 `app/lib/globals.ts` 拉取数据（任何缺失回退到与现状完全一致的默认值，绝不白屏）；新增 sitemap/robots 与全站 SEO。

**Tech Stack:** Payload 3.88、Next.js 16 App Router、React 19、Tailwind、PostgreSQL、@payloadcms/richtext-lexical 3.88。

## Global Constraints

- 严格保留现有 Apple 风格版式与所有 CSS 类名，只替换数据来源。
- 任何 Global/字段缺失时回退到与当前硬编码完全一致的默认内容，站点不得因缺数据白屏或报错。
- 后台文案全部使用中文 label；集合/全局分组沿用现有中文 group 风格。
- 所有新文件放在 `payload/`（后端配置）或 `app/`（前端）下，路径与现有结构一致。
- 不得引入新依赖（除确认必需的以外）；媒体库用 Payload 内置本地磁盘存储（`staticDir: 'uploads'`，对应 Docker `./uploads` 卷）。
- 每一步完成后运行 `npm run typecheck` 确认类型通过；阶段末尾运行 `npm run lint` 与 `npm run build`。
- 数据库迁移用 `npx payload migrate`；类型生成用 `npx payload generate:types`。

---

### Task 1: 共享增强版富文本编辑器配置

**Files:**
- Create: `payload/editor.ts`

**Interfaces:**
- Consumes: `@payloadcms/richtext-lexical`（版本 3.88，已确认导出 `FixedToolbarFeature`、`TableFeature`、`TextStateFeature`，其余 20 项为默认）
- Produces: `richTextEditor(): EditorConfig`——被所有 `richText` 字段复用

- [ ] **Step 1: 创建 `payload/editor.ts`**

```ts
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  TextStateFeature,
} from '@payloadcms/richtext-lexical'

/**
 * 全站统一富文本编辑器。
 * 默认已含：粗斜体/下划线/删除线/上下标/内联代码/标题/对齐/缩进/
 * 有序无序清单/待办清单/链接/关系/引用/上传/分割线/浮动工具栏。
 * 在此之上额外启用：固定工具栏、表格、文字颜色。
 */
export const richTextEditor = () =>
  lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      EXPERIMENTAL_TableFeature(),
      TextStateFeature(),
    ],
  })
```

> **注意：** 3.88 中表格特性的导出名是 `EXPERIMENTAL_TableFeature`（无别名 `TableFeature`），实现时已按此修正。

- [ ] **Step 2: 类型检查**

Run: `npm run typecheck`
Expected: 无报错（`payload/editor.ts` 编译通过，未被引用也不影响）。

- [ ] **Step 3: 提交**

```bash
git add payload/editor.ts
git commit -m "feat: 全站共享增强版富文本编辑器（固定工具栏/表格/文字颜色）"
```

---

### Task 2: 媒体库集合

**Files:**
- Create: `payload/collections/Media.ts`

**Interfaces:**
- Consumes: `isAdminOrEditor` from `../access`
- Produces: `Media: CollectionConfig`（slug `media`）——后台上传 logo/横幅/产品图/富文本内嵌图；被 `seoFields`、`SiteSettings`、`Products`、所有富文本 `UploadFeature` 引用

- [ ] **Step 1: 创建 `payload/collections/Media.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: '媒体文件',
    plural: '媒体文件',
  },
  admin: {
    group: '媒体',
  },
  upload: {
    // 对应 Docker 卷 ./uploads:/app/uploads
    staticDir: 'uploads',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', label: '替代文本 (Alt)' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
```

- [ ] **Step 2: 类型检查**

Run: `npm run typecheck`
Expected: 无报错。

- [ ] **Step 3: 提交**

```bash
git add payload/collections/Media.ts
git commit -m "feat: 新增媒体库集合（本地磁盘存储，uploads 目录）"
```

---

### Task 3: 可复用 SEO 字段组

**Files:**
- Create: `payload/fields/seo.ts`

**Interfaces:**
- Consumes: `Field` from `payload`
- Produces: `seoFields: Field[]`——一组 `group` 类型字段（`seo`），被所有页面级 Global 与 Products/News/Careers 集合引用；前台 `app/lib/globals.ts` 的 `seoToMetadata()` 按本组字段名读取

- [ ] **Step 1: 创建 `payload/fields/seo.ts`**

```ts
import type { Field } from 'payload'

/**
 * 全站统一的 SEO 字段组。字段名由前台 app/lib/globals.ts 的 seoToMetadata() 消费。
 */
export const seoFields: Field[] = [
  {
    name: 'seo',
    type: 'group',
    label: 'SEO 优化',
    admin: {
      description: '留空时前台自动回退到默认文案',
    },
    fields: [
      { name: 'metaTitle', type: 'text', label: 'SEO 标题' },
      { name: 'metaDescription', type: 'textarea', label: 'SEO 描述' },
      {
        name: 'keywords',
        type: 'text',
        label: '关键词',
        admin: { description: '多个关键词用英文逗号分隔' },
      },
      {
        name: 'ogImage',
        type: 'upload',
        relationTo: 'media',
        label: '分享图 (OG Image)',
      },
      { name: 'canonical', type: 'text', label: 'Canonical URL' },
      { name: 'noindex', type: 'checkbox', defaultValue: false, label: '禁止收录 (noindex)' },
    ],
  },
]
```

- [ ] **Step 2: 类型检查**

Run: `npm run typecheck`
Expected: 无报错。

- [ ] **Step 3: 提交**

```bash
git add payload/fields/seo.ts
git commit -m "feat: 全站统一 SEO 字段组"
```

---

### Task 4: 注册媒体库与编辑器到 Payload 配置，生成迁移与类型

**Files:**
- Modify: `payload.config.ts`
- Auto-generated: `.payload/types.ts`、`migrations/*`

**Interfaces:**
- Consumes: `Media` (Task 2)、`richTextEditor` (Task 1)
- Produces: `media` 集合与后续任务注册的 globals 可被 `payload` 识别

- [ ] **Step 1: 修改 `payload.config.ts`**

在 import 区新增：

```ts
import { Media } from './payload/collections/Media'
```

在 `collections: [...]` 数组内、`Users` 之后加入 `Media`（保持其余顺序不变）：

```ts
  collections: [
    Users,
    Media,
    Categories,
    Products,
    NewsCategories,
    News,
    Careers,
    HeroBanners,
    ContactSubmissions,
  ],
```

- [ ] **Step 2: 生成类型**

Run: `npx payload generate:types`
Expected: `.payload/types.ts` 出现 `Media` 相关类型，无报错。

- [ ] **Step 3: 生成并应用迁移**

Run: `npx payload migrate:create --name add_media`
Expected: `migrations/` 下新增 `YYYYMMDD_HHMMSS_add_media.ts` + `.json`，含 `media`、`media_sizes` 相关建表。

Run: `npx payload migrate`
Expected: 迁移执行成功，数据库新增 media 表。

- [ ] **Step 4: 类型检查 + 构建**

Run: `npm run typecheck && npm run build`
Expected: 两者均通过。

- [ ] **Step 5: 提交**

```bash
git add payload.config.ts .payload/types.ts migrations/
git commit -m "feat: 注册媒体库集合并生成迁移"
```

---

### Task 5: 站点设置 Global (site-settings)

**Files:**
- Create: `payload/globals/SiteSettings.ts`

**Interfaces:**
- Consumes: `seoFields` (Task 3)、`Media`、`isAdminOrEditor`
- Produces: Global slug `site-settings`——站点名/Logo/页脚/联系方式/ICP/法律链接/社交链接/SEO 默认；被 `app/lib/globals.ts::getSiteSettings()` 读取

- [ ] **Step 1: 创建 `payload/globals/SiteSettings.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { seoFields } from '../fields/seo'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '站点设置',
  admin: {
    group: '网站设置',
    description: '全站通用信息：站点名、Logo、页脚、联系方式、SEO 默认值',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'siteName', type: 'text', label: '站点名称', defaultValue: '江西联合化工' },
        { name: 'siteTagline', type: 'text', label: '副标语', defaultValue: '专业树脂制造商' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: { description: '未上传时前台回退到 /logo.jpg' },
    },
    { name: 'footerDescription', type: 'textarea', label: '页脚简介' },
    {
      type: 'row',
      fields: [
        { name: 'qualityMark', type: 'text', label: '质量认证标识', defaultValue: 'ISO 9001' },
        { name: 'qualityDesc', type: 'text', label: '质量认证说明', defaultValue: '质量认证企业' },
      ],
    },
    { name: 'icpNumber', type: 'text', label: 'ICP 备案号' },
    { name: 'copyrightText', type: 'text', label: '版权文案' },
    {
      name: 'contact',
      type: 'group',
      label: '联系方式',
      fields: [
        { name: 'address', type: 'text', label: '公司地址' },
        { name: 'addressLine2', type: 'text', label: '地址第二行' },
        { name: 'zipCode', type: 'text', label: '邮编' },
        { name: 'phone', type: 'text', label: '电话' },
        { name: 'fax', type: 'text', label: '传真' },
        { name: 'email', type: 'text', label: '邮箱' },
        { name: 'techPhone', type: 'text', label: '技术支持电话' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: '社交链接',
      fields: [
        { name: 'label', type: 'text', label: '名称' },
        { name: 'url', type: 'text', label: '链接' },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: '法律链接（页脚底部）',
      fields: [
        { name: 'label', type: 'text', label: '名称' },
        { name: 'url', type: 'text', label: '链接' },
      ],
    },
    {
      name: 'headScripts',
      type: 'textarea',
      label: '自定义脚本（<head>）',
      admin: { description: '如统计代码，将原样注入站点 <head>' },
    },
    ...seoFields,
  ],
}
```

- [ ] **Step 2: 注册到 `payload.config.ts`**

import 区新增 `import { SiteSettings } from './payload/globals/SiteSettings'`，并在 `buildConfig` 新增 `globals: [SiteSettings]`（若字段不存在则添加）。

- [ ] **Step 3: 生成类型**

Run: `npx payload generate:types`
Expected: 无报错。

- [ ] **Step 4: 提交**

```bash
git add payload/globals/SiteSettings.ts payload.config.ts .payload/types.ts
git commit -m "feat: 站点设置 Global（站点名/Logo/页脚/联系方式/SEO）"
```

---

### Task 6: 导航菜单 Global (navigation)

**Files:**
- Create: `payload/globals/Navigation.ts`

**Interfaces:**
- Consumes: `isAdminOrEditor`
- Produces: Global slug `navigation`——菜单项数组 `[{ label, href, isActive }]`；被 `app/lib/globals.ts::getNavigation()` 读取

- [ ] **Step 1: 创建 `payload/globals/Navigation.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: '导航菜单',
  admin: {
    group: '网站设置',
    description: '顶部导航菜单项，桌面与移动端共用',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: '菜单项',
      fields: [
        { name: 'label', type: 'text', required: true, label: '名称' },
        { name: 'href', type: 'text', required: true, label: '链接' },
        { name: 'isActive', type: 'checkbox', defaultValue: true, label: '启用' },
      ],
    },
  ],
}
```

- [ ] **Step 2: 注册到 `payload.config.ts`** 的 `globals` 数组。

- [ ] **Step 3: 生成类型**

Run: `npx payload generate:types`
Expected: 无报错。

- [ ] **Step 4: 提交**

```bash
git add payload/globals/Navigation.ts payload.config.ts .payload/types.ts
git commit -m "feat: 导航菜单 Global"
```

---

### Task 7: 页面页头 Global (page-headers)

**Files:**
- Create: `payload/globals/PageHeaders.ts`

**Interfaces:**
- Consumes: `seoFields`、`isAdminOrEditor`
- Produces: Global slug `page-headers`——产品/新闻/招聘/联系四页的页头横幅 `{ enabled, title, subtitle }` + SEO；被 `getPageHeaders()` 读取

- [ ] **Step 1: 创建 `payload/globals/PageHeaders.ts`**

```ts
import type { Field, GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { seoFields } from '../fields/seo'

const pageHeaderGroup = (key: string, label: string): Field => ({
  name: key,
  type: 'group',
  label,
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用页头' },
    { name: 'title', type: 'text', label: '页头标题' },
    { name: 'subtitle', type: 'textarea', label: '页头副标题' },
  ],
})

export const PageHeaders: GlobalConfig = {
  slug: 'page-headers',
  label: '页面页头',
  admin: {
    group: '网站设置',
    description: '产品/新闻/招聘/联系等列表页的页头横幅文案',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    pageHeaderGroup('productsPage', '产品中心页头'),
    pageHeaderGroup('newsPage', '新闻中心页头'),
    pageHeaderGroup('careersPage', '加入我们页头'),
    pageHeaderGroup('contactPage', '联系我们页头'),
    ...seoFields,
  ],
}
```

- [ ] **Step 2: 注册到 `payload.config.ts`** 的 `globals` 数组。

- [ ] **Step 3: 生成类型**

Run: `npx payload generate:types`
Expected: 无报错。

- [ ] **Step 4: 提交**

```bash
git add payload/globals/PageHeaders.ts payload.config.ts .payload/types.ts
git commit -m "feat: 页面页头 Global（产品/新闻/招聘/联系）"
```

---

### Task 8: 前端数据层 app/lib/globals.ts（类型 + 兜底 + 获取函数）

**Files:**
- Create: `app/lib/globals.ts`

**Interfaces:**
- Consumes: `getPayloadClient` from `./payload`；`lexicalToHtml` from `./lexical`
- Produces（本任务定义的精确类型，后续所有前台任务按此消费）:
  - `NavItem { label: string; href: string }`
  - `ContactSettings`、`SiteSettings`、`PageHeader`、`PageHeadersData`
  - `HomeHero`、`HomeShowcaseCard`、`HomeShowcaseSection`、`HomeFeature`、`HomeFeaturesSection`、`HomeFactorySection`、`HomeStat`、`HomeStatsSection`、`HomeCtaSection`、`HomePageData`
  - `AboutMilestone`、`AboutPageData`
  - `ContactPageData`
  - `getSiteSettings(): Promise<SiteSettings>`、`getNavigation(): Promise<NavItem[]>`、`getPageHeaders(): Promise<PageHeadersData>`、`getHomePage(): Promise<HomePageData>`、`getAboutPage(): Promise<AboutPageData>`、`getContactPage(): Promise<ContactPageData>`
  - `seoToMetadata(seo, fallback): Metadata`

- [ ] **Step 1: 创建 `app/lib/globals.ts`**

```ts
import type { Metadata } from 'next'
import { getPayloadClient } from './payload'
import { lexicalToHtml } from './lexical'

// ---------- 类型定义 ----------

export interface NavItem {
  label: string
  href: string
}

export interface ContactSettings {
  address: string
  addressLine2: string
  zipCode: string
  phone: string
  fax: string
  email: string
  techPhone: string
}

export interface SiteSettings {
  siteName: string
  siteTagline: string
  logoUrl: string
  footerDescription: string
  qualityMark: string
  qualityDesc: string
  icpNumber: string
  copyrightText: string
  contact: ContactSettings
  socialLinks: { label: string; url: string }[]
  legalLinks: { label: string; url: string }[]
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string; canonical?: string; noindex?: boolean }
}

export interface PageHeader {
  enabled: boolean
  title: string
  subtitle: string
}

export interface PageHeadersData {
  productsPage: PageHeader
  newsPage: PageHeader
  careersPage: PageHeader
  contactPage: PageHeader
}

export interface HomeHero {
  enabled: boolean
  title: string
  subtitleLine1: string
  subtitleLine2: string
  bgImageUrl: string
  primaryButtonText: string
  primaryButtonHref: string
  secondaryButtonText: string
  secondaryButtonHref: string
  scrollText: string
}

export interface HomeShowcaseCard {
  title: string
  description: string
  imageUrl: string
  href: string
}

export interface HomeShowcaseSection {
  enabled: boolean
  title: string
  subtitle: string
  cards: HomeShowcaseCard[]
  ctaText: string
  ctaHref: string
}

export interface HomeFeature {
  icon: string
  title: string
  description: string
}

export interface HomeFeaturesSection {
  enabled: boolean
  title: string
  subtitle: string
  features: HomeFeature[]
}

export interface HomeFactorySection {
  enabled: boolean
  title: string
  subtitle: string
  imageUrl: string
  overlayTitle: string
  overlayText: string
}

export interface HomeStat {
  number: string
  label: string
}

export interface HomeStatsSection {
  enabled: boolean
  title: string
  subtitle: string
  stats: HomeStat[]
}

export interface HomeCtaSection {
  enabled: boolean
  title: string
  subtitle: string
  primaryButtonText: string
  primaryButtonHref: string
  secondaryButtonText: string
  secondaryButtonHref: string
}

export interface HomePageData {
  hero: HomeHero
  showcase: HomeShowcaseSection
  features: HomeFeaturesSection
  factory: HomeFactorySection
  stats: HomeStatsSection
  cta: HomeCtaSection
}

export type MilestoneColor = 'gold' | 'secondary' | 'accent'

export interface AboutMilestone {
  year: string
  title: string
  description: string
  badge: string
  color: MilestoneColor
}

export interface AboutPageData {
  heroTitle: string
  heroSubtitle: string
  introTitle: string
  introHtml: string
  introImageUrl: string
  missionTitle: string
  missionDescription: string
  visionTitle: string
  visionDescription: string
  milestones: AboutMilestone[]
  stats: { number: string; label: string }[]
  rdTitle: string
  rdCards: { icon: string; title: string; description: string }[]
}

export interface ContactPageData {
  formTitle: string
  infoTitle: string
  mapTitle: string
  mapDescription: string
}

// ---------- 兜底默认值（与当前硬编码完全一致） ----------

export const FALLBACK_NAV_ITEMS: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '产品中心', href: '/products' },
  { label: '关于我们', href: '/about' },
  { label: '新闻中心', href: '/news' },
  { label: '加入我们', href: '/careers' },
  { label: '联系我们', href: '/contact' },
]

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  siteName: '江西联合化工',
  siteTagline: '专业树脂制造商',
  logoUrl: '/logo.jpg',
  footerDescription:
    '成立于2002年，专注化工树脂研发生产20余年，年产值达8亿元人民币，为全球客户提供高品质的化工产品解决方案。',
  qualityMark: 'ISO 9001',
  qualityDesc: '质量认证企业',
  icpNumber: '赣ICP备2020014627号-2',
  copyrightText: '© 2026 江西联合化学有限公司. 保留所有权利.',
  contact: {
    address: '江西省九江市永修县艾城镇',
    addressLine2: '星火工业园荣祺大道16号',
    zipCode: '330317',
    phone: '18162108792',
    fax: '0792-3053111',
    email: '1179002658@qq.com',
    techPhone: '18162108792',
  },
  socialLinks: [],
  legalLinks: [
    { label: '隐私政策', url: '#' },
    { label: '服务条款', url: '#' },
    { label: '网站地图', url: '#' },
    { label: '法律声明', url: '#' },
  ],
  seo: {},
}

export const FALLBACK_PAGE_HEADERS: PageHeadersData = {
  productsPage: {
    enabled: true,
    title: '产品中心',
    subtitle: '探索我们完整的化工产品系列，为各行业提供高品质的解决方案',
  },
  newsPage: {
    enabled: true,
    title: '新闻中心',
    subtitle: '关注江西联合化工最新动态，把握化工行业发展脉搏',
  },
  careersPage: {
    enabled: true,
    title: '加入我们',
    subtitle: '寻找志同道合的优秀人才，在江西联合化工开启您的职业新征程',
  },
  contactPage: {
    enabled: true,
    title: '联系我们',
    subtitle: '期待与您的合作与交流，我们将竭诚为您提供专业的化工产品解决方案',
  },
}

export const FALLBACK_HOME_PAGE: HomePageData = {
  hero: {
    enabled: true,
    title: '江西联合化工',
    subtitleLine1: '创新化学科技，引领行业未来。',
    subtitleLine2: '我们致力于提供卓越的化工解决方案，为全球客户创造持久价值。',
    bgImageUrl: '/uniche.png',
    primaryButtonText: '探索产品',
    primaryButtonHref: '/products',
    secondaryButtonText: '联系我们',
    secondaryButtonHref: '/contact',
    scrollText: '滚动探索',
  },
  showcase: {
    enabled: true,
    title: '我们的产品系列',
    subtitle: '精心研发的化工产品，为各行业提供可靠的解决方案',
    cards: [
      {
        title: '化工原料',
        description:
          '高品质基础化工原料，广泛应用于医药、电子、汽车等高端制造领域，为各行业提供稳定可靠的原料供应。',
        imageUrl: '/image1.png',
        href: '/products',
      },
      {
        title: '精细化学品',
        description:
          '专业化定制精细化学品，采用先进生产工艺，满足特定工业应用的精准需求，为客户提供定制化解决方案。',
        imageUrl: '/image2.png',
        href: '/products',
      },
      {
        title: '专用化学品',
        description:
          '创新配方专用化学品，结合行业经验与技术优势，为客户提供差异化的竞争优势和专业服务。',
        imageUrl: '/image1.png',
        href: '/products',
      },
    ],
    ctaText: '查看所有产品',
    ctaHref: '/products',
  },
  features: {
    enabled: true,
    title: '为什么选择江西联合化工',
    subtitle: '我们专注于品质、创新和服务，为客户创造持久价值',
    features: [
      { icon: 'check', title: '卓越品质', description: '通过ISO9001质量管理体系认证，严格把控从原料到成品的每一个环节' },
      { icon: 'bolt', title: '创新技术', description: '拥有50+项专利技术，持续投入研发，引领行业技术发展方向' },
      { icon: 'shield', title: '安全环保', description: '严格遵循EHS标准，绿色生产工艺，致力于可持续发展' },
      { icon: 'globe', title: '全球供应', description: '覆盖50+国家和地区的供应链网络，确保产品及时交付' },
      { icon: 'team', title: '专业团队', description: '200+专业技术人员，提供从咨询到售后的一站式服务' },
      { icon: 'spark', title: '定制方案', description: '深入理解客户需求，提供个性化的产品解决方案' },
    ],
  },
  factory: {
    enabled: true,
    title: '现代化生产基地',
    subtitle: '世界一流的生产设施，确保产品质量与交付能力',
    imageUrl: '/uniche.png',
    overlayTitle: '智能化工园区',
    overlayText: '占地500亩的现代化生产基地，配备最先进的生产设备和技术',
  },
  stats: {
    enabled: true,
    title: '我们的成就',
    subtitle: '数字见证我们20年来的专业与坚持',
    stats: [
      { number: '20+', label: '年行业经验' },
      { number: '500+', label: '合作伙伴' },
      { number: '1000+', label: '满意客户' },
      { number: '50+', label: '专利技术' },
    ],
  },
  cta: {
    enabled: true,
    title: '准备好开始合作了吗？',
    subtitle: '联系我们的专业团队，获取定制化的化工解决方案和技术支持',
    primaryButtonText: '立即联系',
    primaryButtonHref: '/contact',
    secondaryButtonText: '浏览产品',
    secondaryButtonHref: '/products',
  },
}

export const FALLBACK_ABOUT_PAGE: AboutPageData = {
  heroTitle: '关于我们',
  heroSubtitle: '了解江西联合化工的企业文化与发展历程，探索我们20年来的专业与创新',
  introTitle: '公司简介',
  introImageUrl: '/company.jpg',
  introHtml:
    '<p>江西联合化工有限公司分别成立于2002年，总部设在国家级新型工业化产业示范基地——星火工业园。公司主要经营生产：丙烯酸树脂，PP树脂，触变型树脂，丙烯酸水分散体，聚酯树脂，氨基树脂，环氧磷酸酯，蜡分散体等。预计年产值可达8亿元人民币。</p>' +
    '<p>我司具有强大的研发团队，可以按照客户要求定制树脂，我司已跟跟国内外涂料厂建立合作。我司特别是在汽车内外饰件和原厂漆方面有大量的应用案例，这块积累了很多应用经验和成熟的案例。为客户解决难点和痛点，一直是联合人前进的方向。</p>' +
    '<p>我们新建高标准厂房，DCS控制的设备、完善的质量保证体系是我们生产高性能树脂的保障。我们依托高科技，立足于高起点，借鉴现代管理理念，采用一流的研发和生产设备，拥有一流的研发团队。该项目的未来前景非常广阔。</p>' +
    '<p>我们依托高科技、立足高起点，借鉴现代管理理念，采用一流生产和检测设备，致力于各种涂料的研发、生产和销售。逐步创建了一套既紧密联系中国国情，又充分反映企业实际的管理体系。</p>' +
    '<p>高科技、高品质、高信誉是我们永恒的追求；"生产一流产品、提供一流服务"是我们庄严的承诺。愿我们不懈地努力，与您携手共同发展，共创辉煌！</p>',
  missionTitle: '公司使命',
  missionDescription: '通过提供高质量的化工产品和专业的技术服务，为客户创造价值，推动行业发展。',
  visionTitle: '公司愿景',
  visionDescription: '成为全球领先的化工产品供应商，引领行业技术创新和可持续发展。',
  milestones: [
    { year: '2002', title: '公司成立', description: '江西联合化工有限公司正式成立，总部设在国家级新型工业化产业示范基地——星火工业园，专注树脂产品研发生产', badge: '创业启航', color: 'gold' },
    { year: '2005', title: '产品线完善', description: '形成完整的树脂产品体系：丙烯酸树脂、PP树脂、触变型树脂、丙烯酸水分散体、聚酯树脂、氨基树脂、环氧磷酸酯、蜡分散体等', badge: '产品矩阵', color: 'secondary' },
    { year: '2010', title: '技术突破', description: '建立强大研发团队，实现汽车内外饰件和原厂漆领域重大技术突破，积累大量成熟应用案例', badge: '技术创新', color: 'accent' },
    { year: '2015', title: '产业升级', description: '新建高标准厂房，引进DCS控制设备，建立完善的质量保证体系，实现年产值8亿元目标', badge: '产能升级', color: 'gold' },
    { year: '2020', title: '市场拓展', description: '与国内外知名涂料厂建立深度合作，定制化树脂服务能力显著提升，客户满意度持续提高', badge: '合作共赢', color: 'accent' },
  ],
  stats: [
    { number: '20+', label: '年行业经验' },
    { number: '8亿', label: '年产值(元)' },
    { number: '8+', label: '产品系列' },
  ],
  rdTitle: '研发与技术',
  rdCards: [
    { icon: 'flask', title: '技术研发', description: '拥有专业的研发团队，不断开发新产品，提升技术水平。' },
    { icon: 'shield', title: '质量认证', description: '通过多项国际质量认证，确保产品质量达到世界先进水平。' },
    { icon: 'team', title: '专家团队', description: '汇聚国内外化工领域顶尖专家，为产品研发提供强大支持。' },
  ],
}

export const FALLBACK_CONTACT_PAGE: ContactPageData = {
  formTitle: '发送消息',
  infoTitle: '联系方式',
  mapTitle: '地理位置',
  mapDescription:
    '江西联合化工有限公司位于国家级新型工业化产业示范基地——星火工业园，交通便利，配套设施完善',
}

// ---------- 工具函数 ----------

function mediaUrl(m: unknown, fallback: string): string {
  if (m && typeof m === 'object') {
    const url = (m as { url?: string }).url
    if (url) return url
  }
  return fallback
}

function pick(o: unknown, key: string, fallback: string): string {
  if (o && typeof o === 'object' && key in o) {
    const v = (o as Record<string, unknown>)[key]
    if (typeof v === 'string' && v.trim()) return v
  }
  return fallback
}

/**
 * 统一封装 findGlobal。slug 用 as any 绕过类型联合校验，
 * 使本文件可在全局未全部注册前通过 typecheck（未注册/未 seed 时抛错被调用方 catch 回退兜底）。
 */
async function findGlobal(slug: string, depth = 1): Promise<any> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({ slug: slug as any, depth })) as any
}

// ---------- 获取函数（任何缺失回退到兜底） ----------

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const g = await findGlobal('site-settings', 1)
    const contact = g.contact || {}
    return {
      siteName: pick(g, 'siteName', FALLBACK_SITE_SETTINGS.siteName),
      siteTagline: pick(g, 'siteTagline', FALLBACK_SITE_SETTINGS.siteTagline),
      logoUrl: mediaUrl(g.logo, FALLBACK_SITE_SETTINGS.logoUrl),
      footerDescription: pick(g, 'footerDescription', FALLBACK_SITE_SETTINGS.footerDescription),
      qualityMark: pick(g, 'qualityMark', FALLBACK_SITE_SETTINGS.qualityMark),
      qualityDesc: pick(g, 'qualityDesc', FALLBACK_SITE_SETTINGS.qualityDesc),
      icpNumber: pick(g, 'icpNumber', FALLBACK_SITE_SETTINGS.icpNumber),
      copyrightText: pick(g, 'copyrightText', FALLBACK_SITE_SETTINGS.copyrightText),
      contact: {
        address: pick(contact, 'address', FALLBACK_SITE_SETTINGS.contact.address),
        addressLine2: pick(contact, 'addressLine2', FALLBACK_SITE_SETTINGS.contact.addressLine2),
        zipCode: pick(contact, 'zipCode', FALLBACK_SITE_SETTINGS.contact.zipCode),
        phone: pick(contact, 'phone', FALLBACK_SITE_SETTINGS.contact.phone),
        fax: pick(contact, 'fax', FALLBACK_SITE_SETTINGS.contact.fax),
        email: pick(contact, 'email', FALLBACK_SITE_SETTINGS.contact.email),
        techPhone: pick(contact, 'techPhone', FALLBACK_SITE_SETTINGS.contact.techPhone),
      },
      socialLinks: Array.isArray(g.socialLinks)
        ? g.socialLinks
            .filter((l: any) => l?.label && l?.url)
            .map((l: any) => ({ label: l.label, url: l.url }))
        : [],
      legalLinks: Array.isArray(g.legalLinks)
        ? g.legalLinks
            .filter((l: any) => l?.label && l?.url)
            .map((l: any) => ({ label: l.label, url: l.url }))
        : FALLBACK_SITE_SETTINGS.legalLinks,
      seo: {
        metaTitle: pick(g.seo, 'metaTitle', ''),
        metaDescription: pick(g.seo, 'metaDescription', ''),
        keywords: pick(g.seo, 'keywords', ''),
        canonical: pick(g.seo, 'canonical', ''),
        noindex: !!g.seo?.noindex,
      },
    }
  } catch (e) {
    console.error('getSiteSettings failed:', e)
    return FALLBACK_SITE_SETTINGS
  }
}

export async function getNavigation(): Promise<NavItem[]> {
  try {
    const g = await findGlobal('navigation', 0)
    if (Array.isArray(g.items) && g.items.length > 0) {
      return g.items
        .filter((i: any) => i?.isActive && i?.label && i?.href)
        .map((i: any) => ({ label: i.label, href: i.href }))
    }
    return FALLBACK_NAV_ITEMS
  } catch (e) {
    console.error('getNavigation failed:', e)
    return FALLBACK_NAV_ITEMS
  }
}

export async function getPageHeaders(): Promise<PageHeadersData> {
  try {
    const g = await findGlobal('page-headers', 0)
    const h = (k: string) => ({
      enabled: g[k]?.enabled !== false,
      title: pick(g[k], 'title', ''),
      subtitle: pick(g[k], 'subtitle', ''),
    })
    return {
      productsPage: { ...FALLBACK_PAGE_HEADERS.productsPage, ...h('productsPage') },
      newsPage: { ...FALLBACK_PAGE_HEADERS.newsPage, ...h('newsPage') },
      careersPage: { ...FALLBACK_PAGE_HEADERS.careersPage, ...h('careersPage') },
      contactPage: { ...FALLBACK_PAGE_HEADERS.contactPage, ...h('contactPage') },
    }
  } catch (e) {
    console.error('getPageHeaders failed:', e)
    return FALLBACK_PAGE_HEADERS
  }
}

const homeSection = (g: any, key: string) => g[key] || {}

export async function getHomePage(): Promise<HomePageData> {
  try {
    const g = await findGlobal('home-page', 1)
    const F = FALLBACK_HOME_PAGE
    return {
      hero: {
        enabled: homeSection(g, 'hero').enabled !== false,
        title: pick(homeSection(g, 'hero'), 'title', F.hero.title),
        subtitleLine1: pick(homeSection(g, 'hero'), 'subtitleLine1', F.hero.subtitleLine1),
        subtitleLine2: pick(homeSection(g, 'hero'), 'subtitleLine2', F.hero.subtitleLine2),
        bgImageUrl: mediaUrl(homeSection(g, 'hero').bgImage, pick(homeSection(g, 'hero'), 'bgImageUrl', F.hero.bgImageUrl)),
        primaryButtonText: pick(homeSection(g, 'hero'), 'primaryButtonText', F.hero.primaryButtonText),
        primaryButtonHref: pick(homeSection(g, 'hero'), 'primaryButtonHref', F.hero.primaryButtonHref),
        secondaryButtonText: pick(homeSection(g, 'hero'), 'secondaryButtonText', F.hero.secondaryButtonText),
        secondaryButtonHref: pick(homeSection(g, 'hero'), 'secondaryButtonHref', F.hero.secondaryButtonHref),
        scrollText: pick(homeSection(g, 'hero'), 'scrollText', F.hero.scrollText),
      },
      showcase: {
        enabled: homeSection(g, 'showcase').enabled !== false,
        title: pick(homeSection(g, 'showcase'), 'title', F.showcase.title),
        subtitle: pick(homeSection(g, 'showcase'), 'subtitle', F.showcase.subtitle),
        ctaText: pick(homeSection(g, 'showcase'), 'ctaText', F.showcase.ctaText),
        ctaHref: pick(homeSection(g, 'showcase'), 'ctaHref', F.showcase.ctaHref),
        cards: Array.isArray(homeSection(g, 'showcase').cards) && homeSection(g, 'showcase').cards.length
          ? homeSection(g, 'showcase').cards.map((c: any) => ({
              title: pick(c, 'title', ''),
              description: pick(c, 'description', ''),
              imageUrl: mediaUrl(c.image, pick(c, 'imageUrl', '')),
              href: pick(c, 'href', '/products'),
            }))
          : F.showcase.cards,
      },
      features: {
        enabled: homeSection(g, 'features').enabled !== false,
        title: pick(homeSection(g, 'features'), 'title', F.features.title),
        subtitle: pick(homeSection(g, 'features'), 'subtitle', F.features.subtitle),
        features: Array.isArray(homeSection(g, 'features').features) && homeSection(g, 'features').features.length
          ? homeSection(g, 'features').features.map((c: any) => ({
              icon: pick(c, 'icon', 'check'),
              title: pick(c, 'title', ''),
              description: pick(c, 'description', ''),
            }))
          : F.features.features,
      },
      factory: {
        enabled: homeSection(g, 'factory').enabled !== false,
        title: pick(homeSection(g, 'factory'), 'title', F.factory.title),
        subtitle: pick(homeSection(g, 'factory'), 'subtitle', F.factory.subtitle),
        imageUrl: mediaUrl(homeSection(g, 'factory').image, pick(homeSection(g, 'factory'), 'imageUrl', F.factory.imageUrl)),
        overlayTitle: pick(homeSection(g, 'factory'), 'overlayTitle', F.factory.overlayTitle),
        overlayText: pick(homeSection(g, 'factory'), 'overlayText', F.factory.overlayText),
      },
      stats: {
        enabled: homeSection(g, 'stats').enabled !== false,
        title: pick(homeSection(g, 'stats'), 'title', F.stats.title),
        subtitle: pick(homeSection(g, 'stats'), 'subtitle', F.stats.subtitle),
        stats: Array.isArray(homeSection(g, 'stats').stats) && homeSection(g, 'stats').stats.length
          ? homeSection(g, 'stats').stats.map((c: any) => ({
              number: pick(c, 'number', ''),
              label: pick(c, 'label', ''),
            }))
          : F.stats.stats,
      },
      cta: {
        enabled: homeSection(g, 'cta').enabled !== false,
        title: pick(homeSection(g, 'cta'), 'title', F.cta.title),
        subtitle: pick(homeSection(g, 'cta'), 'subtitle', F.cta.subtitle),
        primaryButtonText: pick(homeSection(g, 'cta'), 'primaryButtonText', F.cta.primaryButtonText),
        primaryButtonHref: pick(homeSection(g, 'cta'), 'primaryButtonHref', F.cta.primaryButtonHref),
        secondaryButtonText: pick(homeSection(g, 'cta'), 'secondaryButtonText', F.cta.secondaryButtonText),
        secondaryButtonHref: pick(homeSection(g, 'cta'), 'secondaryButtonHref', F.cta.secondaryButtonHref),
      },
    }
  } catch (e) {
    console.error('getHomePage failed:', e)
    return FALLBACK_HOME_PAGE
  }
}

export async function getAboutPage(): Promise<AboutPageData> {
  try {
    const g = await findGlobal('about-page', 1)
    const F = FALLBACK_ABOUT_PAGE
    const introGroup = g.introGroup || {}
    return {
      heroTitle: pick(g, 'heroTitle', F.heroTitle),
      heroSubtitle: pick(g, 'heroSubtitle', F.heroSubtitle),
      introTitle: pick(introGroup, 'introTitle', F.introTitle),
      introHtml: lexicalToHtml(introGroup.introContent) || F.introHtml,
      introImageUrl: mediaUrl(introGroup.introImage, F.introImageUrl),
      missionTitle: pick(g, 'missionTitle', F.missionTitle),
      missionDescription: pick(g, 'missionDescription', F.missionDescription),
      visionTitle: pick(g, 'visionTitle', F.visionTitle),
      visionDescription: pick(g, 'visionDescription', F.visionDescription),
      milestones: Array.isArray(g.milestones) && g.milestones.length
        ? g.milestones.map((m: any) => ({
            year: pick(m, 'year', ''),
            title: pick(m, 'title', ''),
            description: pick(m, 'description', ''),
            badge: pick(m, 'badge', ''),
            color: ['gold', 'secondary', 'accent'].includes(m.color) ? m.color : 'gold',
          }))
        : F.milestones,
      stats: Array.isArray(g.stats) && g.stats.length
        ? g.stats.map((s: any) => ({ number: pick(s, 'number', ''), label: pick(s, 'label', '') }))
        : F.stats,
      rdTitle: pick(g, 'rdTitle', F.rdTitle),
      rdCards: Array.isArray(g.rdCards) && g.rdCards.length
        ? g.rdCards.map((c: any) => ({
            icon: pick(c, 'icon', 'check'),
            title: pick(c, 'title', ''),
            description: pick(c, 'description', ''),
          }))
        : F.rdCards,
    }
  } catch (e) {
    console.error('getAboutPage failed:', e)
    return FALLBACK_ABOUT_PAGE
  }
}

export async function getContactPage(): Promise<ContactPageData> {
  try {
    const g = await findGlobal('contact-page', 0)
    const F = FALLBACK_CONTACT_PAGE
    return {
      formTitle: pick(g, 'formTitle', F.formTitle),
      infoTitle: pick(g, 'infoTitle', F.infoTitle),
      mapTitle: pick(g, 'mapTitle', F.mapTitle),
      mapDescription: pick(g, 'mapDescription', F.mapDescription),
    }
  } catch (e) {
    console.error('getContactPage failed:', e)
    return FALLBACK_CONTACT_PAGE
  }
}

// ---------- SEO → Next Metadata ----------

export function seoToMetadata(
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string; canonical?: string; noindex?: boolean },
  fallback: Metadata,
): Metadata {
  const fbTitle = typeof fallback.title === 'string' ? fallback.title : ''
  const fbDesc = typeof fallback.description === 'string' ? fallback.description : ''
  const title = seo.metaTitle || fbTitle
  const description = seo.metaDescription || fbDesc
  const keywords =
    seo.keywords
      ? seo.keywords.split(/[,，]/).map((k) => k.trim()).filter(Boolean)
      : Array.isArray(fallback.keywords) && fallback.keywords.length
        ? fallback.keywords
        : undefined
  const canonical =
    seo.canonical ||
    (typeof fallback.alternates?.canonical === 'string' ? fallback.alternates.canonical : undefined)
  const ogBase = (fallback.openGraph as Record<string, unknown> | undefined) || {}
  const twitterBase = (fallback.twitter as Record<string, unknown> | undefined) || {}
  return {
    title,
    description,
    ...(keywords && keywords.length ? { keywords } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: { ...ogBase, title, description },
    twitter: { ...twitterBase, title, description },
  }
}
```

> **说明：** `fallback` 参数类型为 `Metadata`（`{title, description}` 字面量也可赋值给 `Metadata`，因此后续任务沿用简写不受影响）。函数保留 fallback 的 openGraph/twitter 基础字段（images/type/locale/siteName/card），用解析后的 title/description 覆盖，关键词与 canonical 在 seo 未设置时回退到 fallback——确保兜底模式与现有硬编码 SEO 完全一致。

> **补充（seo 映射，Task 14 审查发现）：** 各页面级 Global（home-page/about-page/page-headers/contact-page）都挂了 `...seoFields`，但四个 getter 的返回对象没有把 `g.seo` 映射进去，导致页面 `generateMetadata` 里的 `(x as any).seo` 恒为 `undefined`，页面级 SEO 字段失效。修正如下，全部落在 `app/lib/globals.ts`：
> - 新增类型 `export interface SeoData { metaTitle?: string; metaDescription?: string; keywords?: string; canonical?: string; noindex?: boolean }`；在 `HomePageData`、`AboutPageData`、`PageHeadersData`、`ContactPageData` 末尾追加可选字段 `seo?: SeoData`。
> - 新增工具函数 `normalizeSeo(raw: unknown): SeoData`，返回 `{ metaTitle: pick(raw,'metaTitle',''), metaDescription: pick(raw,'metaDescription',''), keywords: pick(raw,'keywords',''), canonical: pick(raw,'canonical',''), noindex: !!(raw && typeof raw==='object' && (raw as any).noindex) }`。
> - 在四个 getter（getHomePage/getAboutPage/getPageHeaders/getContactPage）的 `return {...}` 对象末尾各加一行 `seo: normalizeSeo(g.seo),`。
> 这样未 seed 时 `seo` 为全空对象，`seoToMetadata` 自动回退到 FALLBACK_META；seed 后后台可逐页覆盖 metaTitle/metaDescription/keywords/canonical/noindex。

- [ ] **Step 2: 类型检查**

Run: `npm run typecheck`
Expected: 无报错（`getHomePage`/`getAboutPage` 引用的 home-page/about-page 全局尚未注册，但 `findGlobal` 是动态 slug，类型上不报错）。

- [ ] **Step 3: 提交**

```bash
git add app/lib/globals.ts
git commit -m "feat: 前端全局数据层（类型+兜底+获取函数+SEO 转换）"
```

---

### Task 9: 站点根布局接入站点设置与导航

**Files:**
- Modify: `app/(site)/layout.tsx`
- Modify: `app/components/root-client-wrapper.tsx`
- Modify: `app/components/navigation.tsx`
- Modify: `app/components/footer.tsx`

**Interfaces:**
- Consumes: `getSiteSettings`、`getNavigation`、`SiteSettings`、`NavItem` (Task 8)
- Produces: `RootClientWrapper` 新增 props `siteSettings: SiteSettings`、`navigationItems: NavItem[]`；`Navigation` 新增 prop `items: NavItem[]`；`Footer` 新增 prop `settings: SiteSettings`

- [ ] **Step 1: 重写 `app/(site)/layout.tsx`**

```tsx
// app/(site)/layout.tsx — 站点根布局（多根布局：与 (payload) 各带自己的 <html>）
import type { Metadata } from "next";
import "@/globals.scss";
import RootClientWrapper from "@/components/root-client-wrapper";
import { getSiteSettings, getNavigation, seoToMetadata } from "@/lib/globals";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return seoToMetadata(settings.seo, {
    title: `${settings.siteName}官方网站`,
    description: "专业的化工企业官方网站",
  });
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [siteSettings, navigationItems] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);

  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <RootClientWrapper
          siteSettings={siteSettings}
          navigationItems={navigationItems}
        >
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}
```

> 注：`base` 变量已移除，直接调用 `seoToMetadata`。

- [ ] **Step 2: 修改 `app/components/root-client-wrapper.tsx`**

改 props 并透传给 Navigation/Footer：

```tsx
"use client";

import { usePathname } from "next/navigation";
import Navigation from "./navigation";
import Footer from "./footer";
import { ReactNode } from "react";
import type { SiteSettings, NavItem } from "@/lib/globals";

export default function RootClientWrapper({
  children,
  siteSettings,
  navigationItems,
}: {
  children: ReactNode;
  siteSettings: SiteSettings;
  navigationItems: NavItem[];
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navigation items={navigationItems} />}
      <main className={`flex-grow ${!isAdminRoute ? "pt-16" : ""}`}>
        {children}
      </main>
      {!isAdminRoute && <Footer settings={siteSettings} />}
    </div>
  );
}
```

- [ ] **Step 3: 修改 `app/components/navigation.tsx`**

- 顶部 import 增加：`import type { NavItem } from "@/lib/globals";`
- 组件签名改为：`export default function Navigation({ items }: { items: NavItem[] }) {`
- 桌面菜单：把写死的数组 `{ href: "/", label: "首页" }, ...` 换成 `items.map(...)`（两处：`nav-desktop` 与 `nav-mobile-links` 里的 `.map((item) => (`），并保留现有 `key={item.href}`。

- [ ] **Step 4: 修改 `app/components/footer.tsx`**

- 顶部 import 增加：`import type { SiteSettings } from "@/lib/globals";`
- 组件签名改为：`export default function Footer({ settings }: { settings: SiteSettings }) {`
- 把 `companyLinks` 常量删除，`legalLinks` 常量删除，改用 `settings.legalLinks` 渲染法律链接；公司信息区使用 `settings`：
  - 品牌名 `settings.siteName`、标语 `settings.siteTagline`、简介 `settings.footerDescription`、质量 `settings.qualityMark` / `settings.qualityDesc`
  - 地址：`settings.contact.address` + `settings.contact.addressLine2`
  - 电话：`settings.contact.phone`；传真：`settings.contact.fax`
  - 邮箱：`settings.contact.email`
  - 版权：`settings.copyrightText`；ICP：`settings.icpNumber`
  - Logo `<Image src={settings.logoUrl} ...>`
- "关于我们" 区块的 4 个链接（公司简介/企业文化/加入我们/联系我们）保留为 `settings` 无关的固定项，仅替换文字与图标来源：改用 `settings.siteName` 作为 "公司简介" 的 href 目标可保持现状——直接保留原 4 项硬编码即可（不在本次范围）。

- [ ] **Step 5: 验证**

Run: `npm run typecheck && npm run lint`
Expected: 均通过；`npm run dev` 后首页/产品/关于等页面导航与页脚正常渲染（此时 globals 未 seed，走兜底值，与改造前一致）。

- [ ] **Step 6: 提交**

```bash
git add "app/(site)/layout.tsx" app/components/root-client-wrapper.tsx app/components/navigation.tsx app/components/footer.tsx
git commit -m "feat: 站点布局接入站点设置与导航（兜底回退）"
```

---

### Task 10: 首页 Global (home-page)

**Files:**
- Create: `payload/globals/HomePage.ts`

**Interfaces:**
- Consumes: `seoFields`、`isAdminOrEditor`
- Produces: Global slug `home-page`——六个 section group（hero/showcase/features/factory/stats/cta），字段名与 `getHomePage()` 读取一致

- [ ] **Step 1: 创建 `payload/globals/HomePage.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { seoFields } from '../fields/seo'

const iconOptions = [
  { label: '对勾', value: 'check' },
  { label: '闪电', value: 'bolt' },
  { label: '盾牌', value: 'shield' },
  { label: '地球', value: 'globe' },
  { label: '团队', value: 'team' },
  { label: '星光', value: 'spark' },
  { label: '烧瓶', value: 'flask' },
  { label: '工厂', value: 'factory' },
  { label: '目标', value: 'target' },
  { label: '方块', value: 'layers' },
]

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: '首页内容',
  admin: {
    group: '首页',
    description: '首页六大板块：Hero / 产品展示 / 特性 / 生产基地 / 数据统计 / CTA',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: '① Hero 横幅',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '主标题' },
        { name: 'subtitleLine1', type: 'text', label: '副标题第一行' },
        { name: 'subtitleLine2', type: 'text', label: '副标题第二行' },
        { name: 'bgImage', type: 'upload', relationTo: 'media', label: '背景图' },
        { name: 'bgImageUrl', type: 'text', label: '背景图 URL（兜底）' },
        { name: 'primaryButtonText', type: 'text', label: '主按钮文字' },
        { name: 'primaryButtonHref', type: 'text', label: '主按钮链接' },
        { name: 'secondaryButtonText', type: 'text', label: '次按钮文字' },
        { name: 'secondaryButtonHref', type: 'text', label: '次按钮链接' },
        { name: 'scrollText', type: 'text', label: '滚动提示文字' },
      ],
    },
    {
      name: 'showcase',
      type: 'group',
      label: '② 产品展示区',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '区块标题' },
        { name: 'subtitle', type: 'text', label: '区块副标题' },
        {
          name: 'cards',
          type: 'array',
          label: '展示卡片（建议 3 个）',
          fields: [
            { name: 'title', type: 'text', label: '标题' },
            { name: 'description', type: 'textarea', label: '描述' },
            { name: 'image', type: 'upload', relationTo: 'media', label: '图片' },
            { name: 'imageUrl', type: 'text', label: '图片 URL（兜底）' },
            { name: 'href', type: 'text', label: '链接', defaultValue: '/products' },
          ],
        },
        { name: 'ctaText', type: 'text', label: '底部按钮文字' },
        { name: 'ctaHref', type: 'text', label: '底部按钮链接', defaultValue: '/products' },
      ],
    },
    {
      name: 'features',
      type: 'group',
      label: '③ 特性区（为什么选择我们）',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '区块标题' },
        { name: 'subtitle', type: 'text', label: '区块副标题' },
        {
          name: 'features',
          type: 'array',
          label: '特性卡片',
          fields: [
            { name: 'icon', type: 'select', options: iconOptions, label: '图标' },
            { name: 'title', type: 'text', label: '标题' },
            { name: 'description', type: 'textarea', label: '描述' },
          ],
        },
      ],
    },
    {
      name: 'factory',
      type: 'group',
      label: '④ 生产基地展示',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '区块标题' },
        { name: 'subtitle', type: 'text', label: '区块副标题' },
        { name: 'image', type: 'upload', relationTo: 'media', label: '大图' },
        { name: 'imageUrl', type: 'text', label: '大图 URL（兜底）' },
        { name: 'overlayTitle', type: 'text', label: '图上标题' },
        { name: 'overlayText', type: 'text', label: '图上描述' },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      label: '⑤ 数据统计区',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '区块标题' },
        { name: 'subtitle', type: 'text', label: '区块副标题' },
        {
          name: 'stats',
          type: 'array',
          label: '统计项',
          fields: [
            { name: 'number', type: 'text', label: '数值（如 20+）' },
            { name: 'label', type: 'text', label: '标签' },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: '⑥ CTA 区',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '标题' },
        { name: 'subtitle', type: 'text', label: '副标题' },
        { name: 'primaryButtonText', type: 'text', label: '主按钮文字' },
        { name: 'primaryButtonHref', type: 'text', label: '主按钮链接' },
        { name: 'secondaryButtonText', type: 'text', label: '次按钮文字' },
        { name: 'secondaryButtonHref', type: 'text', label: '次按钮链接' },
      ],
    },
    ...seoFields,
  ],
}
```

- [ ] **Step 2: 注册到 `payload.config.ts`** 的 `globals` 数组。

- [ ] **Step 3: 生成类型**

Run: `npx payload generate:types`
Expected: 无报错。

- [ ] **Step 4: 提交**

```bash
git add payload/globals/HomePage.ts payload.config.ts .payload/types.ts
git commit -m "feat: 首页 Global（六大板块结构化字段）"
```

---

### Task 11: 分区图标组件

**Files:**
- Create: `app/components/section-icons.tsx`

**Interfaces:**
- Consumes: 无
- Produces: `SectionIcon({ name, className }: { name: string; className?: string })`——渲染预置图标 SVG；首页特性卡、关于页研发卡、时间线使用

- [ ] **Step 1: 创建 `app/components/section-icons.tsx`**

```tsx
"use client";

// 预设图标：与后台 icon select 的 value 一一对应
const ICON_PATHS: Record<string, string> = {
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  globe: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  team: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  spark: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  flask: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  factory:
    "M3 21h18M6 21V9a2 2 0 012-2h8a2 2 0 012 2v12M10 7V5a2 2 0 114 0v2m-6 4h2v2h-2zM14 11h2v2h-2zM10 15h2v2h-2zM14 15h2v2h-2z",
  target: "M12 12m-3 0a3 3 0 103 3 3 3 0 00-3-3zm0 0m-9 0a9 9 0 1018 0 9 9 0 00-18 0zm0 0m6 0a3 3 0 116 0 3 3 0 01-6 0z",
  layers: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
};

export default function SectionIcon({
  name,
  className = "w-8 h-8",
}: {
  name: string;
  className?: string;
}) {
  const d = ICON_PATHS[name] || ICON_PATHS.check;
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}
```

- [ ] **Step 2: 类型检查**

Run: `npm run typecheck`
Expected: 无报错。

- [ ] **Step 3: 提交**

```bash
git add app/components/section-icons.tsx
git commit -m "feat: 分区图标组件（预设图标映射）"
```

---

### Task 12: 首页渲染接入 Global 数据

**Files:**
- Modify: `app/(site)/page.tsx`
- Modify: `app/components/homepage-client-wrapper.tsx`

**Interfaces:**
- Consumes: `getHomePage`、`HomePageData` (Task 8)、`SectionIcon` (Task 11)
- Produces: 首页各 section 按 `enabled` 开关渲染，内容来自 `homePage` 数据

- [ ] **Step 1: 修改 `app/(site)/page.tsx`**

在 `getPopularProducts()` 之后并行获取首页数据，并传给 wrapper；同时用 `getHomePage` 的 seo 生成 metadata。

```tsx
import type { Metadata } from "next";
import { getPopularProducts } from "@/lib/products";
import { getHomePage, seoToMetadata } from "@/lib/globals";
import HomepageClientWrapper from "@/components/homepage-client-wrapper";
import { ProductStructuredData, OrganizationStructuredData, WebsiteStructuredData } from "@/components/structured-data";

const FALLBACK_META: Metadata = {
  title: "江西联合化工 - 专业化工原料与精细化学品制造商 | 首页",
  description: "江西联合化工是一家专业的化工企业，致力于提供高品质的化工原料、精细化学品和专用化学品。我们拥有20年行业经验，为全球客户提供卓越的化工解决方案。",
  keywords: ["化工原料", "精细化学品", "专用化学品", "江西联合化工", "化工企业", "化学品制造商", "化工解决方案", "CAS号"],
  openGraph: {
    title: "江西联合化工 - 专业化工原料与精细化学品制造商",
    description: "致力于提供卓越的化工解决方案，为全球客户创造持久价值",
    type: "website",
    locale: "zh_CN",
    siteName: "江西联合化工",
  },
  twitter: {
    card: "summary_large_image",
    title: "江西联合化工 - 专业化工企业",
    description: "创新化学科技，引领行业未来。提供高品质化工原料和精细化学品。",
  },
  alternates: {
    canonical: "/",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  const seo = (home as any).seo || {};
  return seoToMetadata(seo, FALLBACK_META);
}

export default async function Home() {
  const [popularProducts, homePage] = await Promise.all([
    getPopularProducts(),
    getHomePage(),
  ]);

  return (
    <>
      <WebsiteStructuredData />
      <OrganizationStructuredData />
      <ProductStructuredData products={popularProducts} />
      <HomepageClientWrapper popularProducts={popularProducts} homePage={homePage} />
    </>
  );
}
```

> 注：`HomePageData` 类型上不含 `seo`；用 `(home as any).seo` 读取（后续任务会在 `HomePageData` 追加 seo，届时可移除 `as any`）。

- [ ] **Step 2: 修改 `app/components/homepage-client-wrapper.tsx`**

- 顶部 import：`import SectionIcon from "./section-icons";`、`import type { HomePageData } from "@/lib/globals";`
- Props 增加 `homePage: HomePageData`；解构 `const { popularProducts, homePage } = props`（组件签名改为接收两个 prop）。
- 用 `homePage.hero` 替换 Hero 区硬编码（`<h1 className="hero-title">{homePage.hero.title}</h1>`、副标题两行、两个按钮文字/链接、滚动提示文字、背景图 `src={homePage.hero.bgImageUrl}`、`alt={homePage.hero.title}`）。
- **Hero 区**整体包一层条件：`{homePage.hero.enabled && ( ...现有 hero JSX... )}`。
- **产品展示区**（`<section ref={productsRef} ...>`）：标题/副标题改为 `homePage.showcase.title/subtitle`；把三张写死卡片替换为 `homePage.showcase.cards.map((card, i) => (...))`，卡片 JSX 复用现有 `.product-showcase-item` 结构，`style={{ transitionDelay: `${i * 200 + 200}ms` }}`，方向 `i % 2 === 0 ? "left" : "right"`，图标三色循环 `["gold", "secondary", "accent"][i % 3]`，图片 `src={card.imageUrl}`，`alt={card.title}`，按钮文字沿用「了解更多」+ `href={card.href}`。整区包 `homePage.showcase.enabled && (...)`。
- **特性区**（`<section ref={featuresRef} ...>`）：标题/副标题改为 `homePage.features.title/subtitle`；六张写死卡片替换为 `homePage.features.features.map((f, i) => (...))`，图标用 `<SectionIcon name={f.icon} />`，容器 `.apple-icon-wrapper` 的颜色循环 `["secondary", "gold", "green", "secondary", "gold", "green"][i % 6]`，`transitionDelay` 用 `i * 100`。整区包 `homePage.features.enabled && (...)`。
- **生产基地区**（showcaseRef）：标题/副标题改为 `homePage.factory.title/subtitle`；大图 `backgroundImage: url('${homePage.factory.imageUrl}')`、图上标题/描述改为 `homePage.factory.overlayTitle/overlayText`。整区包 `homePage.factory.enabled && (...)`。
- **数据统计区**（statsRef）：标题/副标题改为 `homePage.stats.title/subtitle`；四个写死 `apple-stat-item` 替换为 `homePage.stats.stats.map((s, i) => (...))`，`transitionDelay: i * 100`。整区包 `homePage.stats.enabled && (...)`。
- **CTA 区**（ctaRef）：标题/副标题改为 `homePage.cta.title/subtitle`；两个按钮文字/链接改为 `homePage.cta.primaryButtonText/Href`、`homePage.cta.secondaryButtonText/Href`。整区包 `homePage.cta.enabled && (...)`。

- [ ] **Step 3: 验证**

Run: `npm run typecheck && npm run lint`
Expected: 通过。`npm run dev` 打开首页，所有区块与改造前完全一致（此时 home-page global 未 seed，走兜底）。

- [ ] **Step 4: 提交**

```bash
git add "app/(site)/page.tsx" app/components/homepage-client-wrapper.tsx
git commit -m "feat: 首页渲染接入 Global 数据（可开关板块）"
```

---

### Task 13: 关于我们 Global (about-page)

**Files:**
- Create: `payload/globals/AboutPage.ts`

**Interfaces:**
- Consumes: `richTextEditor` (Task 1)、`seoFields`、`isAdminOrEditor`
- Produces: Global slug `about-page`——页头/简介(富文本)/使命愿景/发展历程/统计/研发卡 + SEO

- [ ] **Step 1: 创建 `payload/globals/AboutPage.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { richTextEditor } from '../editor'
import { seoFields } from '../fields/seo'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: '关于我们',
  admin: {
    group: '关于我们',
    description: '公司简介、使命愿景、发展历程、研发与技术',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'heroTitle', type: 'text', label: '页头标题' },
    { name: 'heroSubtitle', type: 'textarea', label: '页头副标题' },
    {
      name: 'introGroup',
      type: 'group',
      label: '公司简介',
      fields: [
        { name: 'introTitle', type: 'text', label: '标题' },
        { name: 'introContent', type: 'richText', editor: richTextEditor(), label: '简介正文（富文本）' },
        { name: 'introImage', type: 'upload', relationTo: 'media', label: '配图' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'missionTitle', type: 'text', label: '使命标题', defaultValue: '公司使命' },
        { name: 'visionTitle', type: 'text', label: '愿景标题', defaultValue: '公司愿景' },
      ],
    },
    { name: 'missionDescription', type: 'textarea', label: '使命描述' },
    { name: 'visionDescription', type: 'textarea', label: '愿景描述' },
    {
      name: 'milestones',
      type: 'array',
      label: '发展历程时间线',
      fields: [
        { name: 'year', type: 'text', label: '年份' },
        { name: 'title', type: 'text', label: '标题' },
        { name: 'description', type: 'textarea', label: '描述' },
        { name: 'badge', type: 'text', label: '徽章文字' },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'gold',
          options: [
            { label: '金色', value: 'gold' },
            { label: '蓝色', value: 'secondary' },
            { label: '紫色', value: 'accent' },
          ],
          label: '配色',
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: '统计数据',
      fields: [
        { name: 'number', type: 'text', label: '数值' },
        { name: 'label', type: 'text', label: '标签' },
      ],
    },
    { name: 'rdTitle', type: 'text', label: '研发技术区标题', defaultValue: '研发与技术' },
    {
      name: 'rdCards',
      type: 'array',
      label: '研发技术卡片',
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: '对勾', value: 'check' },
            { label: '闪电', value: 'bolt' },
            { label: '盾牌', value: 'shield' },
            { label: '地球', value: 'globe' },
            { label: '团队', value: 'team' },
            { label: '星光', value: 'spark' },
            { label: '烧瓶', value: 'flask' },
            { label: '工厂', value: 'factory' },
          ],
          label: '图标',
        },
        { name: 'title', type: 'text', label: '标题' },
        { name: 'description', type: 'textarea', label: '描述' },
      ],
    },
    ...seoFields,
  ],
}
```

- [ ] **Step 2: 注册到 `payload.config.ts`** 的 `globals` 数组。

- [ ] **Step 3: 生成类型**

Run: `npx payload generate:types`
Expected: 无报错。

- [ ] **Step 4: 提交**

```bash
git add payload/globals/AboutPage.ts payload.config.ts .payload/types.ts
git commit -m "feat: 关于我们 Global（简介富文本/时间线/研发卡）"
```

---

### Task 14: 关于我们页渲染接入 Global 数据

**Files:**
- Modify: `app/(site)/about/page.tsx`

**Interfaces:**
- Consumes: `getAboutPage`、`AboutPageData`、`SectionIcon` (Task 8/11)
- Produces: 关于页全部内容来自 `aboutPage` 数据，缺省回退

- [ ] **Step 1: 改写 `app/(site)/about/page.tsx`**

把页面改为服务端组件 + 一个纯展示客户端子组件（保留现有滚动动画 `isLoaded`）。具体：

- 新建 `app/(site)/about/AboutPageClient.tsx`（`"use client"`），把现有 `page.tsx` 的 JSX 整体搬入，组件签名：

```tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SectionIcon from "@/components/section-icons";
import type { AboutPageData } from "@/lib/globals";

export default function AboutPageClient({ data }: { data: AboutPageData }) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  // ...现有 JSX，所有写死文案替换为 data 字段（见 Step 2）
}
```

- 重写 `app/(site)/about/page.tsx` 为服务端组件：

```tsx
import type { Metadata } from "next";
import { getAboutPage, seoToMetadata } from "@/lib/globals";
import AboutPageClient from "./AboutPageClient";

const FALLBACK_META = {
  title: "关于我们 - 江西联合化工 | 企业介绍与公司文化",
  description: "了解江西联合化工的企业文化与发展历程，探索我们20年来的专业与创新",
};

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return seoToMetadata((about as any).seo || {}, FALLBACK_META);
}

export default async function AboutPage() {
  const aboutPage = await getAboutPage();
  return <AboutPageClient data={aboutPage} />;
}
```

- [ ] **Step 2: 在 `AboutPageClient` 内替换写死内容**

| 位置 | 改为 |
|---|---|
| 页头标题/副标题 | `data.heroTitle` / `data.heroSubtitle` |
| 公司简介标题 | `data.introTitle` |
| 简介正文（4 段 `<p>`） | `<div className="intro-description" dangerouslySetInnerHTML={{ __html: data.introHtml }} />`（原样式保留在 `.intro-description p` 上） |
| 简介配图 | `src={data.introImageUrl}` |
| 使命/愿景标题与描述 | `data.missionTitle/missionDescription`、`data.visionTitle/visionDescription` |
| 时间线 5 条硬编码 | `data.milestones.map((m, i) => (...))`，`milestone-${m.color}`、`milestone-icon-${m.color}`、`animationDelay: i * 150`，年份/标题/描述/徽章分别用 `m.year/title/description/badge`；图标用 `<SectionIcon name="check" />`（默认） |
| 时间线底部 3 个统计 | `data.stats.map(...)`（`.timeline-stat`，`animationDelay` 递增 200ms） |
| 研发技术标题 | `data.rdTitle` |
| 研发 3 张卡片 | `data.rdCards.map((c, i) => (...))`，图标 `<SectionIcon name={c.icon} />`，标题/描述用 `c.title/c.description` |

- [ ] **Step 3: 验证**

Run: `npm run typecheck && npm run lint && npm run dev`
Expected: 通过；打开 `/about` 与改造前一致（未 seed 走兜底）。

- [ ] **Step 4: 提交**

```bash
git add "app/(site)/about/page.tsx" "app/(site)/about/AboutPageClient.tsx"
git commit -m "feat: 关于我们页接入 Global 数据"
```

---

### Task 15: 产品集合结构化改造

**Files:**
- Modify: `payload/collections/Products.ts`

**Interfaces:**
- Consumes: `richTextEditor` (Task 1)、`seoFields` (Task 3)
- Produces: Products 集合新字段结构（description 富文本、details/features/applications/safety_info 结构化数组、image 上传、seo 组）；由 Task 16 的 `mapProduct` 消费

- [ ] **Step 1: 重写 `payload/collections/Products.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { richTextEditor } from '../editor'
import { seoFields } from '../fields/seo'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: '产品',
    plural: '产品',
  },
  admin: {
    useAsTitle: 'name',
    group: '产品',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '产品名称' },
    { name: 'cas_no', type: 'text', label: 'CAS 号' },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: '产品分类' },
    {
      name: 'summary',
      type: 'textarea',
      label: '产品简介（列表卡片）',
      admin: { description: '在产品列表/首页卡片上显示的简短介绍' },
    },
    {
      name: 'description',
      type: 'richText',
      editor: richTextEditor(),
      label: '产品描述（富文本）',
    },
    {
      name: 'details',
      type: 'array',
      label: '技术指标',
      admin: { description: '逐行填写：指标名 + 指标值' },
      fields: [
        { name: 'name', type: 'text', label: '指标名（如：外观）' },
        { name: 'value', type: 'text', label: '指标值（如：无色透明液体）' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: '产品特性',
      fields: [{ name: 'text', type: 'text', label: '特性描述' }],
    },
    {
      name: 'applications',
      type: 'array',
      label: '应用领域',
      fields: [
        { name: 'name', type: 'text', label: '领域名称' },
        { name: 'description', type: 'textarea', label: '描述' },
      ],
    },
    {
      name: 'safety_info',
      type: 'array',
      label: '安全信息',
      fields: [
        { name: 'title', type: 'text', label: '标题（如：储存条件）' },
        { name: 'content', type: 'textarea', label: '内容' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: '产品图片' },
    {
      name: 'image_url',
      type: 'text',
      label: '图片 URL（兜底）',
      admin: { description: '未上传图片时使用' },
    },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
    ...seoFields,
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
```

- [ ] **Step 2: 生成类型**

Run: `npx payload generate:types`
Expected: 无报错。

- [ ] **Step 3: 生成并应用迁移**

Run: `npx payload migrate:create --name products_structured`
Expected: 生成迁移文件，含 `products_details`、`products_features`、`products_applications`、`products_safety_info` 等子表，以及 `products_description` 列相关、`products_image` 外键、`products_seo` 等。

Run: `npx payload migrate`
Expected: 迁移成功。

> **数据迁移注意：** 字段类型 json→array 会使旧 JSON 数据不迁移到新子表。Task 20（seed）会把产品重建为结构化数据，生产库需管理员在后台重新录入或重跑 seed。

- [ ] **Step 4: 提交**

```bash
git add payload/collections/Products.ts .payload/types.ts migrations/
git commit -m "feat: 产品集合结构化（JSON 改数组表单 + 富文本 + 图片上传 + SEO）"
```

---

### Task 16: 产品映射与详情页适配结构化字段

**Files:**
- Modify: `app/lib/mappers.ts`
- Modify: `app/(site)/products/[id]/ProductDetailClient.tsx`

**Interfaces:**
- Consumes: `lexicalToHtml`/`lexicalToPlaintext` (Task 已存在 `./lexical`)
- Produces: `mapProduct` 返回结构化数组与 `descriptionHtml`；`ProductDetailClient` 直接渲染数组（不再 JSON.parse）

- [ ] **Step 1: 修改 `app/lib/mappers.ts` 的 `mapProduct`**

把 `description` 改为 `summary || 纯文本(description)`，新增 `descriptionHtml`，数组字段映射为 `{...}` 结构：

```ts
import { htmlToText, lexicalToHtml, lexicalToPlaintext } from './lexical'

export function mapProduct(p: any) {
  const plain = lexicalToPlaintext(p.description) || p.description || ''
  return {
    id: p.id,
    name: p.name,
    cas_no: p.cas_no ?? undefined,
    category_id: relToId(p.category),
    summary: p.summary ?? undefined,
    description: p.summary || plain,
    descriptionHtml: lexicalToHtml(p.description) || (p.description && typeof p.description === 'string' ? p.description : ''),
    details: Array.isArray(p.details) ? p.details.map((d: any) => ({ name: d.name ?? '', value: d.value ?? '' })) : [],
    features: Array.isArray(p.features) ? p.features.map((f: any) => ({ text: f.text ?? '' })) : [],
    applications: Array.isArray(p.applications)
      ? p.applications.map((a: any) => ({ name: a.name ?? '', description: a.description ?? '' }))
      : [],
    safety_info: Array.isArray(p.safety_info)
      ? p.safety_info.map((s: any) => ({ title: s.title ?? '', content: s.content ?? '' }))
      : [],
    image_url: p.image?.url || p.image_url ?? undefined,
    created_at: p.createdAt ? new Date(p.createdAt) : undefined,
    updated_at: p.updatedAt ? new Date(p.updatedAt) : undefined,
    is_active: p.is_active,
    category: p.category ? { name: relToName(p.category) ?? '' } : undefined,
  }
}
```

- [ ] **Step 2: 修改 `ProductDetailClient.tsx`**

- **概述 Tab**：把 `<p className="overview-text">{product.description}</p>` 改为：

```tsx
{product.descriptionHtml ? (
  <div
    className="overview-text"
    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
  />
) : (
  <p className="overview-text">{product.description}</p>
)}
```

- **技术指标 Tab**：删除 `parseJsonData` 逻辑，改为遍历数组（`product.details` 为 `[{name,value}]`）：

```tsx
{activeTab === "specs" && product.details && product.details.length > 0 && (
  <div className="tab-pane tab-pane-specs animate-[fadeIn_0.3s_ease-out]">
    <h2 className="section-title">技术指标</h2>
    <div className="specs-grid">
      {product.details.map((item: { name: string; value: string }, index: number) => (
        <div key={index} className="spec-item">
          <div className="spec-header">
            <h3 className="spec-name">{item.name}</h3>
            <div className="spec-badge">标准</div>
          </div>
          <p className="spec-value">{item.value}</p>
        </div>
      ))}
    </div>
  </div>
)}
```

- **应用领域 Tab**：改为遍历 `product.applications`（`[{name,description}]`），移除 `getIndustryIcon(index)` 的 JSON 逻辑，图标改用 `getIndustryIcon(index)` 保留现状：

```tsx
{activeTab === "applications" && (
  <div className="tab-pane tab-pane-applications animate-[fadeIn_0.3s_ease-out]">
    <h2 className="section-title">应用领域</h2>
    {product.applications && product.applications.length > 0 ? (
      <div className="applications-list">
        {product.applications.map((app: { name: string; description?: string }, index: number) => (
          <div key={index} className="application-item">
            <div className="application-icon-wrapper">
              <svg className="application-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIndustryIcon(index)} />
              </svg>
            </div>
            <div className="application-content">
              <h3 className="application-title">{app.name}</h3>
              {app.description && (
                <p className="application-description">{app.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="empty-text">暂无应用领域信息</div>
    )}
  </div>
)}
```

- **安全信息 Tab**：删除 `parseJsonData` 与对象/数组/字符串三分支，改为遍历 `product.safety_info`（`[{title,content}]`）：

```tsx
{activeTab === "safety" && (
  <div className="tab-pane tab-pane-safety animate-[fadeIn_0.3s_ease-out]">
    {product.safety_info && product.safety_info.length > 0 ? (
      <div className="safety-notice">
        <div className="safety-header">
          <div className="safety-icon-wrapper">{/* 保留现有 safety 三角图标 */}</div>
          <h2 className="safety-title">安全注意事项</h2>
        </div>
        <div className="safety-list">
          {product.safety_info.map((item: { title: string; content: string }, index: number) => (
            <div key={index} className="safety-item">
              <svg className="safety-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="safety-content">
                <strong className="safety-key">{item.title}:</strong>
                <span className="safety-value">{item.content}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="empty-state">
        <div className="empty-icon">{/* 保留现有空状态图标 */}</div>
        <p className="empty-text">暂无安全信息</p>
      </div>
    )}
  </div>
)}
```

- 删除 `parseJsonData` 辅助函数（不再使用）。

- [ ] **Step 3: 验证**

Run: `npm run typecheck && npm run lint && npm run dev`
Expected: 通过；打开一个产品详情页，四个 Tab 正常渲染（未 seed 时旧产品 detail 数组为空显示「暂无」占位，seed 重建后有内容）。

- [ ] **Step 4: 提交**

```bash
git add app/lib/mappers.ts "app/(site)/products/[id]/ProductDetailClient.tsx"
git commit -m "feat: 产品详情页适配结构化字段（告别 JSON.parse）"
```

---

### Task 17: 新闻集合升级富文本 + SEO

**Files:**
- Modify: `payload/collections/News.ts`

**Interfaces:**
- Consumes: `richTextEditor` (Task 1)、`seoFields` (Task 3)
- Produces: 新闻正文用增强富文本，新增 seo 组

- [ ] **Step 1: 修改 `payload/collections/News.ts`**

- import 区：把 `import { lexicalEditor } from '@payloadcms/richtext-lexical'` 替换为 `import { richTextEditor } from '../editor'`，并新增 `import { seoFields } from '../fields/seo'`。
- `content` 字段的 `editor: lexicalEditor()` 改为 `editor: richTextEditor()`。
- 移除现有 `seo_title`/`seo_description` 两个字段，在数组末尾（`sort_order` 之后）展开 `...seoFields`。

- [ ] **Step 2: 生成类型 + 迁移**

Run: `npx payload generate:types && npx payload migrate:create --name news_seo && npx payload migrate`
Expected: 迁移成功，`news` 表新增 `news_seo` 相关列。

- [ ] **Step 3: 提交**

```bash
git add payload/collections/News.ts .payload/types.ts migrations/
git commit -m "feat: 新闻集合升级增强富文本 + SEO 组"
```

---

### Task 18: 招聘集合富文本 + SEO

**Files:**
- Modify: `payload/collections/Careers.ts`

**Interfaces:**
- Consumes: `richTextEditor`、`seoFields`
- Produces: 招聘 description/work_environment 富文本，新增 seo 组

- [ ] **Step 1: 修改 `payload/collections/Careers.ts`**

- import：新增 `import { richTextEditor } from '../editor'`、`import { seoFields } from '../fields/seo'`。
- `description` 字段：`type: 'textarea'` → `type: 'richText'`、`editor: richTextEditor()`。
- `work_environment` 字段：`type: 'textarea'` → `type: 'richText'`、`editor: richTextEditor()`。
- 数组末尾展开 `...seoFields`。

- [ ] **Step 2: 更新 `app/api/careers/route.ts` 的 description 输出**

`description` 从富文本取纯文本（列表卡片用）：

```ts
import { lexicalToPlaintext } from '@/lib/lexical'
// ...
description: lexicalToPlaintext(career.description) || '我们正在寻找优秀的人才加入我们的团队。',
```

- [ ] **Step 3: 生成类型 + 迁移**

Run: `npx payload generate:types && npx payload migrate:create --name careers_seo && npx payload migrate`
Expected: 迁移成功。

- [ ] **Step 4: 提交**

```bash
git add payload/collections/Careers.ts app/api/careers/route.ts .payload/types.ts migrations/
git commit -m "feat: 招聘集合富文本 + SEO，列表接口取纯文本"
```

---

### Task 19: 新闻详情页改服务端组件（SEO 落地）

**Files:**
- Modify: `app/(site)/news/[id]/page.tsx`
- Create: `app/(site)/news/[id]/NewsDetailView.tsx`

**Interfaces:**
- Consumes: `getNewsById` from `@/lib/products`、`getSiteSettings`、`seoToMetadata`、Payload Local API（相关新闻）
- Produces: 新闻详情页为服务端组件，输出 metadata；`NewsDetailView` 为纯展示客户端组件

- [ ] **Step 1: 新建 `app/(site)/news/[id]/NewsDetailView.tsx`（纯展示）**

把现有 `page.tsx` 中 `news` 渲染相关的整个 JSX（从 `if (loading)` 之后到结尾返回结构）搬入，去掉所有数据获取逻辑，组件签名：

```tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getNewsTypeDisplayName, getNewsTypeClassName } from "@/lib/news-utils";

interface NewsDetailViewProps {
  news: {
    id: number; title: string; excerpt?: string; content: string;
    publish_date: string; type?: string; author?: string; tags?: string[];
    read_time?: number;
  } | null;
  relatedNews: any[];
}

export default function NewsDetailView({ news, relatedNews }: NewsDetailViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setIsLoaded(true), 100); }, []);
  if (!news) { /* 现有「新闻未找到」空状态 JSX */ }
  return ( /* 现有渲染 JSX，news 与 relatedNews 取自 props */ );
}
```

- [ ] **Step 2: 重写 `app/(site)/news/[id]/page.tsx` 为服务端组件**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsById } from "@/lib/products";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings, seoToMetadata } from "@/lib/globals";
import NewsDetailView from "./NewsDetailView";

interface PageProps { params: Promise<{ id: string }> }

async function getRelatedNews(newsId: number, limit = 4) {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "news",
      where: { is_published: { equals: true }, id: { not_equals: newsId } },
      sort: "-createdAt",
      limit,
      depth: 0,
    });
    return res.docs.map((n: any) => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt || "",
      type: n.type,
      publish_date: n.publish_date || n.createdAt,
      read_time: n.read_time,
    }));
  } catch { return []; }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await getNewsById(parseInt(id));
  if (!news) return { title: "新闻未找到" };
  const settings = await getSiteSettings();
  return seoToMetadata(
    (news as any).seo || {},
    {
      title: `${news.title} - ${settings.siteName}`,
      description: news.excerpt || `${news.title}，来自${settings.siteName}`,
    },
  );
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const news = await getNewsById(parseInt(id));
  if (!news) notFound();
  const relatedNews = await getRelatedNews(news.id);
  return <NewsDetailView news={news} relatedNews={relatedNews} />;
}
```

> 注：`getNewsById` 返回的 `mapNews` 已含 `seo` 需要确认 `mapNews` 保留 `n.seo`——在 Task 8 的 `mapNews` 未改，需在 `app/lib/mappers.ts::mapNews` 返回值中追加 `seo: n.seo`。请一并修改。

- [ ] **Step 3: 在 `app/lib/mappers.ts` 的 `mapNews` 返回值末尾追加 `seo: n.seo`**

- [ ] **Step 4: 验证**

Run: `npm run typecheck && npm run lint && npm run dev`
Expected: 通过；打开一篇新闻详情，页面正常，控制台无 "news not defined" 错误。

- [ ] **Step 5: 提交**

```bash
git add "app/(site)/news/[id]/page.tsx" "app/(site)/news/[id]/NewsDetailView.tsx" app/lib/mappers.ts
git commit -m "feat: 新闻详情改服务端组件并输出 SEO metadata"
```

---

### Task 20: 联系页 Global + 改服务端组件（页头 + 站点设置 + SEO）

**Files:**
- Create: `payload/globals/ContactPage.ts`
- Modify: `payload.config.ts`
- Modify: `app/(site)/contact/page.tsx`
- Create: `app/(site)/contact/ContactForm.tsx`

**Interfaces:**
- Consumes: `seoFields`、`getContactPage`、`getPageHeaders`、`getSiteSettings`、`ContactPageData`、`SiteSettings`、`PageHeader`、`seoToMetadata`
- Produces: Global slug `contact-page`；联系页服务端渲染页头/联系信息（来自站点设置）/地图描述，表单为独立客户端组件

- [ ] **Step 1: 创建 `payload/globals/ContactPage.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { seoFields } from '../fields/seo'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: '联系页内容',
  admin: {
    group: '联系我们',
    description: '联系页表单/联系信息/地图区块标题',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'formTitle', type: 'text', label: '表单区块标题', defaultValue: '发送消息' },
    { name: 'infoTitle', type: 'text', label: '联系信息标题', defaultValue: '联系方式' },
    { name: 'mapTitle', type: 'text', label: '地图区块标题', defaultValue: '地理位置' },
    { name: 'mapDescription', type: 'textarea', label: '地图区块描述' },
    ...seoFields,
  ],
}
```

- [ ] **Step 2: 注册到 `payload.config.ts`** 的 `globals` 数组，并运行 `npx payload generate:types` 确认无报错。

- [ ] **Step 3: 新建 `app/(site)/contact/ContactForm.tsx`**

把现有 `page.tsx` 中整个 `<form>`（从 `<form onSubmit={handleSubmit}` 到 `</form>`）连同 `useState`/`handleChange`/`handleSubmit` 逻辑搬入，签名 `export default function ContactForm()`，其余 JSX 留在服务端。

- [ ] **Step 4: 重写 `app/(site)/contact/page.tsx` 为服务端组件**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "./ContactForm";
import {
  getContactPage, getPageHeaders, getSiteSettings, seoToMetadata,
} from "@/lib/globals";

const FALLBACK_META = {
  title: "联系我们 - 江西联合化工",
  description: "期待与您的合作与交流，我们将竭诚为您提供专业的化工产品解决方案",
};

export async function generateMetadata(): Promise<Metadata> {
  const headers = await getPageHeaders();
  return seoToMetadata((headers as any).seo || {}, FALLBACK_META);
}

export default async function ContactPage() {
  const [contactPage, headers, settings] = await Promise.all([
    getContactPage(), getPageHeaders(), getSiteSettings(),
  ]);
  const hero = headers.contactPage;
  const c = settings.contact;

  return (
    <div className="app-wrapper">
      <section className="hero-section-contact">
        <div className="container-small">
          <div className="hero-content-contact loaded">
            <h1 className="page-title">{hero.title}</h1>
            <p className="page-subtitle">{hero.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="contact-main-section">
        <div className="container">
          <div className="contact-content loaded">
            <div className="contact-form-section">
              <h2 className="section-title">{contactPage.formTitle}</h2>
              <ContactForm />
            </div>
            <div className="contact-info-section">
              <h2 className="section-title">{contactPage.infoTitle}</h2>
              <div className="contact-info-list">
                {/* 地址 */}
                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">{/* 保留现有地图图标 SVG */}</div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">公司地址</h3>
                    <p className="contact-info-description">
                      {c.address}
                      <br />
                      {c.addressLine2}
                      <br />
                      邮编：{c.zipCode}
                    </p>
                  </div>
                </div>
                {/* 电话（保留现有电话图标） */}
                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">{/* 保留现有电话图标 SVG */}</div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">联系电话</h3>
                    <p className="contact-info-description">
                      电话：{c.phone}
                      <br />
                      传真：{c.fax}
                      <br />
                      技术支持：{c.techPhone}
                    </p>
                  </div>
                </div>
                {/* 邮箱（保留现有邮箱图标） */}
                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">{/* 保留现有邮箱图标 SVG */}</div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">电子邮箱</h3>
                    <p className="contact-info-description">
                      商务合作：{c.email}
                      <br />
                      技术咨询：{c.email}
                      <br />
                      客户服务：{c.email}
                    </p>
                  </div>
                </div>
                {/* 工作时间：保留现有 4 个图标项中的工作时间项 */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <div className="container">
          <div className="contact-map-content loaded">
            <h2 className="section-title">{contactPage.mapTitle}</h2>
            <div className="map-placeholder">
              <div className="map-icon">{/* 保留现有地图大图标 SVG */}</div>
              <p className="map-description">{contactPage.mapDescription}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

> 各图标 SVG 从原 `page.tsx` 原样搬回（服务端组件可直接内联 SVG）。「工作时间」项可保留原硬编码内容。

- [ ] **Step 5: 验证**

Run: `npm run typecheck && npm run lint && npm run dev`
Expected: 通过；`/contact` 表单可提交，联系信息正常展示。

- [ ] **Step 6: 提交**

```bash
git add payload/globals/ContactPage.ts payload.config.ts .payload/types.ts "app/(site)/contact/page.tsx" "app/(site)/contact/ContactForm.tsx"
git commit -m "feat: 联系页 Global + 接入站点设置/页头/SEO，表单独立为客户端组件"
```

---

### Task 21: 列表页页头接入 + 各页 metadata 从 Global 读取

**Files:**
- Modify: `app/(site)/products/page.tsx`
- Modify: `app/(site)/products/products-client-wrapper.tsx`
- Modify: `app/(site)/news/page.tsx`
- Modify: `app/(site)/news/news-client-wrapper.tsx`
- Modify: `app/(site)/careers/page.tsx`
- Modify: `app/lib/products.ts`（可选，`getNews` 返回 seo）

**Interfaces:**
- Consumes: `getPageHeaders`、`seoToMetadata`
- Produces: 产品/新闻/招聘列表页页头文案来自 `page-headers` global；metadata 来自各页 global 的 seo（无则回退）

- [ ] **Step 1: `app/(site)/products/page.tsx`**

- 把静态 `export const metadata` 改为 `generateMetadata`：

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const headers = await getPageHeaders();
  return seoToMetadata((headers as any).seo || {}, {
    title: "产品中心 - 江西联合化工 | 专业化工原料与精细化学品",
    description: "江西联合化工产品中心提供完整的化工产品系列，包括化工原料、精细化学品和专用化学品。",
  });
}
```

- 页面内并行获取：`const [productsData, headers] = await Promise.all([getProducts(1, 12), getPageHeaders()]);`，并把 `pageHeader={headers.productsPage}` 传给 `ProductsClientWrapper`。

- [ ] **Step 2: `app/(site)/products/products-client-wrapper.tsx`**

- Props 增加 `pageHeader: { enabled: boolean; title: string; subtitle: string }`。
- 在组件渲染的页头 Hero 区（`.hero-section-products` 等，找到对应标题/副标题文本）改为渲染 `pageHeader.enabled ? pageHeader.title/subtitle : ""`，优先显示 global 文案。

- [ ] **Step 3: `app/(site)/news/page.tsx`**

- `generateMetadata` 用 `getPageHeaders()` 的 seo；`getNews(1, 12)` 并行，并把 `pageHeader={headers.newsPage}` 传给 `NewsClientWrapper`。
- 静态 `metadata` 移除。

- [ ] **Step 4: `app/(site)/news/news-client-wrapper.tsx`**

- Props 增加 `pageHeader`，渲染到页头 Hero（`.hero-section-news`）标题/副标题。

- [ ] **Step 5: `app/(site)/careers/page.tsx`**

- 该页为客户端组件。改为服务端外壳 + 客户端列表：新建 `app/(site)/careers/CareersClient.tsx` 承载现有全部 JSX 与逻辑（签名 `export default function CareersClient({ pageHeader }: { pageHeader: PageHeader })`），`page.tsx` 改为：

```tsx
import type { Metadata } from "next";
import { getPageHeaders, seoToMetadata } from "@/lib/globals";
import CareersClient from "./CareersClient";

const FALLBACK_META = {
  title: "加入我们 - 江西联合化工 | 招聘与人才",
  description: "寻找志同道合的优秀人才，在江西联合化工开启您的职业新征程",
};

export async function generateMetadata(): Promise<Metadata> {
  const headers = await getPageHeaders();
  return seoToMetadata((headers as any).seo || {}, FALLBACK_META);
}

export default async function CareersPage() {
  const headers = await getPageHeaders();
  return <CareersClient pageHeader={headers.careersPage} />;
}
```

- `CareersClient` 内三处页头（loading/error/正常）均用 `pageHeader.title/subtitle` 渲染。

- [ ] **Step 6: 验证**

Run: `npm run typecheck && npm run lint && npm run dev`
Expected: 通过；产品/新闻/招聘页页头与改造前一致（未 seed 走兜底）。

- [ ] **Step 7: 提交**

```bash
git add "app/(site)/products/page.tsx" "app/(site)/products/products-client-wrapper.tsx" "app/(site)/news/page.tsx" "app/(site)/news/news-client-wrapper.tsx" "app/(site)/careers/page.tsx" "app/(site)/careers/CareersClient.tsx"
git commit -m "feat: 列表页页头与 metadata 从 Global 读取"
```

---

### Task 22: sitemap.xml 与 robots.txt

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `getPayloadClient`、`getSiteSettings`
- Produces: `MetadataRoute.Sitemap`、`MetadataRoute.Robots`

- [ ] **Step 1: 创建 `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://unice.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const payload = await getPayloadClient();

    const [products, news, careers] = await Promise.all([
      payload.find({ collection: "products", where: { is_active: { equals: true } }, limit: 500, depth: 0 }),
      payload.find({ collection: "news", where: { is_published: { equals: true } }, limit: 500, depth: 0 }),
      payload.find({ collection: "careers", where: { is_active: { equals: true } }, limit: 500, depth: 0 }),
    ]);

    const productRoutes = products.docs.map((p: any) => ({
      url: `${BASE}/products/${p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    const newsRoutes = news.docs.map((n: any) => ({
      url: `${BASE}/news/${n.id}`,
      lastModified: n.updatedAt ? new Date(n.updatedAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
    const careerRoutes = careers.docs.map((c: any) => ({
      url: `${BASE}/careers`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...productRoutes, ...newsRoutes, ...careerRoutes];
  } catch (e) {
    console.error("sitemap generation failed:", e);
    return staticRoutes;
  }
}
```

- [ ] **Step 2: 创建 `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://unice.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: 验证**

Run: `npm run typecheck && npm run build && npm run dev`
Expected: 构建通过；访问 `/sitemap.xml` 与 `/robots.txt` 返回合法 XML/文本。

- [ ] **Step 4: 提交**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: 生成 sitemap.xml 与 robots.txt"
```

---

### Task 23: seed 脚本补齐 Globals 与产品重建

**Files:**
- Modify: `payload/seed.ts`

**Interfaces:**
- Consumes: `payload.updateGlobal`、`getPayload`（seed 内）
- Produces: 首次/重复执行都能把 6 个 Globals 与结构化产品写入数据库

- [ ] **Step 1: 在 `payload/seed.ts` 末尾 `main()` 内、`console.log('🎉...')` 之前，追加全局更新**

```ts
  // 8. Globals（updateGlobal 自动创建单例）
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: '江西联合化工',
      siteTagline: '专业树脂制造商',
      footerDescription:
        '成立于2002年，专注化工树脂研发生产20余年，年产值达8亿元人民币，为全球客户提供高品质的化工产品解决方案。',
      qualityMark: 'ISO 9001',
      qualityDesc: '质量认证企业',
      icpNumber: '赣ICP备2020014627号-2',
      copyrightText: '© 2026 江西联合化学有限公司. 保留所有权利.',
      contact: {
        address: '江西省九江市永修县艾城镇',
        addressLine2: '星火工业园荣祺大道16号',
        zipCode: '330317',
        phone: '18162108792',
        fax: '0792-3053111',
        email: '1179002658@qq.com',
        techPhone: '18162108792',
      },
      legalLinks: [
        { label: '隐私政策', url: '#' },
        { label: '服务条款', url: '#' },
        { label: '网站地图', url: '#' },
        { label: '法律声明', url: '#' },
      ],
    },
  })
  console.log('✓ 站点设置 Global')

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      items: [
        { label: '首页', href: '/', isActive: true },
        { label: '产品中心', href: '/products', isActive: true },
        { label: '关于我们', href: '/about', isActive: true },
        { label: '新闻中心', href: '/news', isActive: true },
        { label: '加入我们', href: '/careers', isActive: true },
        { label: '联系我们', href: '/contact', isActive: true },
      ],
    },
  })
  console.log('✓ 导航 Global')

  await payload.updateGlobal({
    slug: 'page-headers',
    data: {
      productsPage: { enabled: true, title: '产品中心', subtitle: '探索我们完整的化工产品系列，为各行业提供高品质的解决方案' },
      newsPage: { enabled: true, title: '新闻中心', subtitle: '关注江西联合化工最新动态，把握化工行业发展脉搏' },
      careersPage: { enabled: true, title: '加入我们', subtitle: '寻找志同道合的优秀人才，在江西联合化工开启您的职业新征程' },
      contactPage: { enabled: true, title: '联系我们', subtitle: '期待与您的合作与交流，我们将竭诚为您提供专业的化工产品解决方案' },
    },
  })
  console.log('✓ 页头 Global')

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        enabled: true,
        title: '江西联合化工',
        subtitleLine1: '创新化学科技，引领行业未来。',
        subtitleLine2: '我们致力于提供卓越的化工解决方案，为全球客户创造持久价值。',
        bgImageUrl: '/uniche.png',
        primaryButtonText: '探索产品',
        primaryButtonHref: '/products',
        secondaryButtonText: '联系我们',
        secondaryButtonHref: '/contact',
        scrollText: '滚动探索',
      },
      showcase: {
        enabled: true,
        title: '我们的产品系列',
        subtitle: '精心研发的化工产品，为各行业提供可靠的解决方案',
        cards: [
          { title: '化工原料', description: '高品质基础化工原料，广泛应用于医药、电子、汽车等高端制造领域，为各行业提供稳定可靠的原料供应。', imageUrl: '/image1.png', href: '/products' },
          { title: '精细化学品', description: '专业化定制精细化学品，采用先进生产工艺，满足特定工业应用的精准需求，为客户提供定制化解决方案。', imageUrl: '/image2.png', href: '/products' },
          { title: '专用化学品', description: '创新配方专用化学品，结合行业经验与技术优势，为客户提供差异化的竞争优势和专业服务。', imageUrl: '/image1.png', href: '/products' },
        ],
        ctaText: '查看所有产品',
        ctaHref: '/products',
      },
      features: {
        enabled: true,
        title: '为什么选择江西联合化工',
        subtitle: '我们专注于品质、创新和服务，为客户创造持久价值',
        features: [
          { icon: 'check', title: '卓越品质', description: '通过ISO9001质量管理体系认证，严格把控从原料到成品的每一个环节' },
          { icon: 'bolt', title: '创新技术', description: '拥有50+项专利技术，持续投入研发，引领行业技术发展方向' },
          { icon: 'shield', title: '安全环保', description: '严格遵循EHS标准，绿色生产工艺，致力于可持续发展' },
          { icon: 'globe', title: '全球供应', description: '覆盖50+国家和地区的供应链网络，确保产品及时交付' },
          { icon: 'team', title: '专业团队', description: '200+专业技术人员，提供从咨询到售后的一站式服务' },
          { icon: 'spark', title: '定制方案', description: '深入理解客户需求，提供个性化的产品解决方案' },
        ],
      },
      factory: {
        enabled: true,
        title: '现代化生产基地',
        subtitle: '世界一流的生产设施，确保产品质量与交付能力',
        imageUrl: '/uniche.png',
        overlayTitle: '智能化工园区',
        overlayText: '占地500亩的现代化生产基地，配备最先进的生产设备和技术',
      },
      stats: {
        enabled: true,
        title: '我们的成就',
        subtitle: '数字见证我们20年来的专业与坚持',
        stats: [
          { number: '20+', label: '年行业经验' },
          { number: '500+', label: '合作伙伴' },
          { number: '1000+', label: '满意客户' },
          { number: '50+', label: '专利技术' },
        ],
      },
      cta: {
        enabled: true,
        title: '准备好开始合作了吗？',
        subtitle: '联系我们的专业团队，获取定制化的化工解决方案和技术支持',
        primaryButtonText: '立即联系',
        primaryButtonHref: '/contact',
        secondaryButtonText: '浏览产品',
        secondaryButtonHref: '/products',
      },
    },
  })
  console.log('✓ 首页 Global')

  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      heroTitle: '关于我们',
      heroSubtitle: '了解江西联合化工的企业文化与发展历程，探索我们20年来的专业与创新',
      introGroup: {
        introTitle: '公司简介',
        introContent: textToLexical(
          '江西联合化工有限公司分别成立于2002年，总部设在国家级新型工业化产业示范基地——星火工业园。公司主要经营生产：丙烯酸树脂，PP树脂，触变型树脂，丙烯酸水分散体，聚酯树脂，氨基树脂，环氧磷酸酯，蜡分散体等。预计年产值可达8亿元人民币。\n\n' +
          '我司具有强大的研发团队，可以按照客户要求定制树脂，我司已跟跟国内外涂料厂建立合作。我司特别是在汽车内外饰件和原厂漆方面有大量的应用案例，这块积累了很多应用经验和成熟的案例。为客户解决难点和痛点，一直是联合人前进的方向。'
        ),
      },
      missionTitle: '公司使命',
      missionDescription: '通过提供高质量的化工产品和专业的技术服务，为客户创造价值，推动行业发展。',
      visionTitle: '公司愿景',
      visionDescription: '成为全球领先的化工产品供应商，引领行业技术创新和可持续发展。',
      milestones: [
        { year: '2002', title: '公司成立', description: '江西联合化工有限公司正式成立，总部设在国家级新型工业化产业示范基地——星火工业园，专注树脂产品研发生产', badge: '创业启航', color: 'gold' },
        { year: '2005', title: '产品线完善', description: '形成完整的树脂产品体系：丙烯酸树脂、PP树脂、触变型树脂、丙烯酸水分散体、聚酯树脂、氨基树脂、环氧磷酸酯、蜡分散体等', badge: '产品矩阵', color: 'secondary' },
        { year: '2010', title: '技术突破', description: '建立强大研发团队，实现汽车内外饰件和原厂漆领域重大技术突破，积累大量成熟应用案例', badge: '技术创新', color: 'accent' },
        { year: '2015', title: '产业升级', description: '新建高标准厂房，引进DCS控制设备，建立完善的质量保证体系，实现年产值8亿元目标', badge: '产能升级', color: 'gold' },
        { year: '2020', title: '市场拓展', description: '与国内外知名涂料厂建立深度合作，定制化树脂服务能力显著提升，客户满意度持续提高', badge: '合作共赢', color: 'accent' },
      ],
      stats: [
        { number: '20+', label: '年行业经验' },
        { number: '8亿', label: '年产值(元)' },
        { number: '8+', label: '产品系列' },
      ],
      rdTitle: '研发与技术',
      rdCards: [
        { icon: 'flask', title: '技术研发', description: '拥有专业的研发团队，不断开发新产品，提升技术水平。' },
        { icon: 'shield', title: '质量认证', description: '通过多项国际质量认证，确保产品质量达到世界先进水平。' },
        { icon: 'team', title: '专家团队', description: '汇聚国内外化工领域顶尖专家，为产品研发提供强大支持。' },
      ],
    },
  })
  console.log('✓ 关于我们 Global')

  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      formTitle: '发送消息',
      infoTitle: '联系方式',
      mapTitle: '地理位置',
      mapDescription: '江西联合化工有限公司位于国家级新型工业化产业示范基地——星火工业园，交通便利，配套设施完善',
    },
  })
  console.log('✓ 联系页 Global')
```

- [ ] **Step 2: 产品 seed 改为「重建」（结构化字段）**

在现有「2. 产品分类」与产品创建处：把按 `name` 查重后创建，改为**先删除同名产品再创建**，并在产品 defs 中补充结构化字段。示例（在创建前插入）：

```ts
    const existingProduct = await payload.find({ collection: 'products', where: { name: { equals: p.name } }, limit: 1 })
    if (existingProduct.docs.length > 0) {
      await payload.deleteByID({ collection: 'products', id: existingProduct.docs[0].id })
    }
    await payload.create({
      collection: 'products',
      data: {
        ...p,
        description: textToLexical(p.description || ''),
        summary: p.summary || (p.description || '').slice(0, 60),
        details: (p.details || []).map((d: any) => ({ name: d.name, value: d.value })),
        features: (p.features || []).map((f: string) => ({ text: f })),
        applications: (p.applications || []).map((a: any) => ({ name: a.name, description: a.description })),
        safety_info: (p.safety_info || []).map((s: any) => ({ title: s.title, content: s.content })),
      },
    })
```

- [ ] **Step 3: 运行 seed 验证**

Run: `npm run payload:seed`
Expected: 输出各步骤 `✓`，无报错；`getHomePage`/`getAboutPage` 等返回 seeded 数据（可在 `node` 中抽查，或通过首页渲染确认）。

- [ ] **Step 4: 提交**

```bash
git add payload/seed.ts
git commit -m "feat: seed 补齐 Globals 并重建结构化产品"
```

---

### Task 24: 全量验证与回归测试文档

**Files:**
- Create: `docs/superpowers/regression/2026-08-15-cms-content-control-regression.md`

**Interfaces:**
- Consumes: 全部任务产出
- Produces: 验证通过证据 + 回归测试报告

- [ ] **Step 1: 类型检查 + Lint + 构建**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: 三者全部通过。

- [ ] **Step 2: 启动开发服务器人工核对**

Run: `npm run dev`
- [ ] `/` 首页六个板块正常，与改造前视觉一致。
- [ ] `/products`、`/news`、`/careers`、`/contact`、`/about` 页头与内容正常。
- [ ] 打开 `/admin`，登录 seed 管理员：
  - [ ] 「网站设置」Global 可编辑（站点名/联系方式/ICP 等）并保存；
  - [ ] 「导航菜单」Global 增删菜单项；
  - [ ] 「首页内容」Global 六个板块可编辑/开关；
  - [ ] 「关于我们」Global 富文本简介、时间线可编辑；
  - [ ] 产品编辑页：技术指标/应用领域等为结构化行表单，无 JSON 输入框；description 为富文本编辑器（含固定工具栏/表格按钮）；
  - [ ] 媒体库可上传图片。
- [ ] 修改「首页内容」Hero 标题并保存，刷新前台首页确认生效；关闭某板块确认隐藏。
- [ ] `/sitemap.xml`、`/robots.txt` 正常返回。

- [ ] **Step 3: 编写回归测试报告**

把以上逐项结果写入 `docs/superpowers/regression/2026-08-15-cms-content-control-regression.md`，格式沿用现有 `2026-08-15-payload-rebuild-regression.md`（含：验证范围、逐项结论、发现问题与处理、遗留风险）。

- [ ] **Step 4: 提交**

```bash
git add docs/superpowers/regression/2026-08-15-cms-content-control-regression.md
git commit -m "docs: 官网内容后台化回归测试报告"
```

---

## Self-Review

**Spec coverage：** 首页六板块（Task 10/12）、关于我们（Task 13/14）、产品详情结构化（Task 15/16）、全站站点设置/导航/页脚（Task 5/6/9）、页面页头（Task 7/21）、联系页（Task 20）、富文本增强（Task 1/17/18）、SEO（Task 3/19/21/22）、sitemap/robots（Task 22）、媒体库（Task 2）、seed（Task 23）、回归验证（Task 24）。均被覆盖。

**类型一致性：** `getSiteSettings`/`getNavigation`/`getPageHeaders`/`getHomePage`/`getAboutPage`/`getContactPage` 的返回类型在 Task 8 定义，Task 9-14/20/21 按此消费；`mapProduct` 新字段在 Task 16 定义并消费；`richTextEditor` 在 Task 1 定义、Task 13/15/17/18 复用；`seoFields` 在 Task 3 定义、Task 5/7/10/13/15/17/18 复用。

**注意事项：**
- 6 个 Globals 的注册顺序：site-settings/navigation/page-headers 在 Task 5-7，home-page/about-page 在 Task 10/13，contact-page 在 Task 20。`app/lib/globals.ts`（Task 8）的 `findGlobal` 封装对 slug 用 `as any`，未注册/未 seed 时抛错被 catch 回退兜底，不会白屏，也保证 typecheck 与注册顺序无关。
- `home-page`/`about-page`/`page-headers`/`contact-page` 的 `seo` 组在对应的 `HomePageData`/`AboutPageData` 等类型上未体现——Task 12/14/20/21 用 `(x as any).seo` 读取；如需完整类型可在实现时给接口追加 `seo?: {...}` 可选字段。
- Products 迁移会导致旧 JSON 数据丢失，Task 15 已注明需 seed 重建（Task 23）。
- `about-page` 的简介字段在 Global 中位于 `introGroup` group 内，`getAboutPage` 已按 `g.introGroup.*` 读取，与 seed 写入一致。
