# 官网内容后台化 — 回归测试报告

- 日期: 2026-08-15
- 范围: `.superpowers/sdd/task-*.brief.md` 全部 24 个任务完成后的一次全量验证与回归（6 Globals + Media + 结构化产品/新闻/招聘 + 富文本增强 + 全局 SEO + sitemap/robots + seed）
- 环境: 本地 Docker PostgreSQL(`unice_postgres`, `localhost:5432`), Next.js 16.3.1 (Turbopack) production 模式 (`npm run build` + `npm run start`), Payload 3.88
- 基线提交: `b7c8c67` (feat: seed 补齐 Globals 并重建结构化产品)

## 结论

**全部通过。** 类型检查、生产构建、生产服务器 12 个公共路由全部 200、sitemap/robots 正常、6 个 Globals 与结构化内容均已在库中且前台正确渲染。仅发现一处"产品 ID 漂移"（旧 `id=1..3` 变为 `id=4..6`，`/products/1` 现为 404，符合预期行为），以及任务简报中列出的已知遗留问题（未修复，仅记录）。

## 逐项结论

### 1. 静态检查

| 检查 | 结果 |
|---|---|
| `node node_modules/typescript/bin/tsc --noEmit` | ✅ 退出码 0，0 错误 |
| `node node_modules/eslint/bin/eslint.js .` | ✅ 应用代码 0 错误 / 5 个既有 warning（footer.tsx 未用 `Shield`×1、未用 `productsLoading`×1、`ProductDetailClient.tsx` `<img>` 元素×1、`careers/route.ts` 未用 `_request`×1、`tmp-repro.cjs` 未用变量×1）；另 8 个 error 全部位于 **gitignore 的临时脚本** `.superpowers/sdd/tmp-*.cjs`（非项目代码，未计入） |
| `npm run build`（wsl） | ✅ 退出码 0；静态生成 19 页；`/products/[id]` SSG 生成产品 4/5/6 |

### 2. 运行时冒烟测试（production server，`npm run start`）

| 路由 | 结果 | 内容校验 |
|---|---|---|
| `/` | ✅ 200 | 首页 hero `江西联合化工`；`og:title` 与 `keywords` meta 均在 |
| `/products` | ✅ 200 | 列表渲染 TPA-200 / CPP-300 / SCA-50 |
| `/products/4` | ✅ 200 | 产品名 `丙烯酸树脂 (TPA-200)`；`技术指标` / `应用领域` tab 文本均渲染；富文本 description 正常 |
| `/products/5` | ✅ 200 | — |
| `/products/6` | ✅ 200 | — |
| `/products/1` | ⚠️ 404 | 见"回归中发现的问题 #1"（产品 ID 漂移） |
| `/news` | ✅ 200 | 列表渲染新闻条目 |
| `/news/1` | ✅ 200 | 标题 `江西联合化工荣获2024年度化工行业创新奖` |
| `/careers` | ✅ 200 | 列表渲染研发岗职位 |
| `/about` | ✅ 200 | 标题 `关于我们`；`发展历程` 时间线 5 个里程碑 + 统计数据 |
| `/contact` | ✅ 200 | 表单字段 `name="name"`；电话/邮箱/地址/传真来自 Globals |
| `/sitemap.xml` | ✅ 200 | `application/xml`；含静态 URL `/` `/products` `/news` `/careers` `/about` `/contact` + 产品 4/5/6 + 新闻 1/2/3 |
| `/robots.txt` | ✅ 200 | `Disallow: /admin`、`Sitemap: http://localhost:3000/sitemap.xml` |
| `/admin` | ✅ 200 | 后台入口可访问 |

> 说明：冒烟测试期间曾短暂观察到对 `/zh/*` 的 307 locale 重定向，经排查为多个 server 实例交错启动/被 SIGTERM 时的状态假象；以干净的单一 production server 复测全部路由稳定返回 200，无 locale 重定向。非回归。

### 3. 数据库验证（`docker exec unice_postgres psql -U postgres -d unice`）

| 表 | 结果 |
|---|---|
| `site_settings` | ✅ 1 行：`江西联合化工` / `专业树脂制造商`；legal_links 4 行 |
| `navigation` | ✅ 1 行 + `navigation_items` 6 行 |
| `page_headers` | ✅ 1 行（5 页页头字段齐全） |
| `home_page` | ✅ 1 行：`hero_title=江西联合化工`、`hero_enabled=true`；features 6 / showcase 3 / stats 4 |
| `about_page` | ✅ 1 行；milestones 5 / rd_cards 3 / stats 3 |
| `contact_page` | ✅ 1 行（form/info/map 标题 + seo 组） |
| `products` | ✅ 3 行（id 4/5/6） |
| `products_details` | ✅ 15 行（每产品 5 条结构化明细） |
| `news` / `careers` | ✅ 各 3 行 |
| `payload_migrations` | ✅ init / 010250 / 035530 / 073328 / 083819 / 084752 / 091550 共 7 条 + `dev`(batch -1) 标记 |
| `users` | ✅ 2 个 admin：`1179002658@qq.com`、seed 的 `admin@unicechemical.com` |

## 自动化验证清单（本报告实际执行）

- [x] `tsc --noEmit` 退出码 0
- [x] `eslint .` 记录结果（应用代码 0 error / 5 warning）
- [x] `npm run build`（wsl）成功
- [x] `npm run start`（production）启动，`curl` 12 个公共路由 + `/admin` 状态码
- [x] 首页 hero / og:title / keywords meta 文本校验
- [x] `/products/4` 产品名 + `技术指标`/`应用领域` tab 校验
- [x] `/about`、`/news`、`/products`、`/careers`、`/contact`、`/news/1` 页头与内容校验
- [x] `/sitemap.xml` XML 内容与 content-type 校验
- [x] `/robots.txt` `Disallow: /admin` + `Sitemap:` 行校验
- [x] DB 行数与关键字段校验（6 Globals + products_details + 迁移记录）

## 人工后台验证清单（待人工确认）

请在浏览器中打开 `http://localhost:3000/admin`，登录 `admin@unicechemical.com` / `admin123456`（或 `1179002658@qq.com` / `housuwen`），逐项确认：

- [ ] 「网站设置」Global 可编辑（站点名/联系方式/ICP 等）并保存后前台 footer 生效
- [ ] 「导航菜单」Global 增删菜单项并保存后导航栏生效
- [ ] 「首页内容」Global 六个板块可编辑/开关，保存后前台对应区块隐藏/显示
- [ ] 修改「首页内容」Hero 标题并保存，刷新前台首页确认生效
- [ ] 「关于我们」Global 富文本简介、时间线（里程碑）可编辑并保存生效
- [ ] 产品编辑页：技术指标/应用领域等为结构化行表单（无 JSON 输入框）；description 为富文本编辑器（含固定工具栏/表格按钮）
- [ ] 媒体库可上传图片，并在 Global/产品中选择该图片后前台正常显示
- [ ] 联系页 Global 的表单标题/信息区标题修改后前台 `/contact` 生效
- [ ] 后台金色主题与中文界面观感正常

## 回归中发现的问题

1. **产品 ID 漂移（预期行为，非缺陷）**：Task 15/23 迁移将产品重建为结构化集合后，seed 重新生成了产品 id `4/5/6`（原 `1/2/3`）。因此 `/products/1` 现返回 404（页面调用 `notFound()`，符合设计）；对外链接、书签或旧 id 引用的产品页需更新为新 id。sitemap 已正确输出新 id（4/5/6）。
2. **`site_settings_social_links` 为 0 行**：seed 未写入社交链接（site_settings 表中也无对应列，社交链接以关联表存储）。前台 footer 未暴露社交入口，暂无影响；如需可后续补充 seed。

## 已知遗留问题（本次未修复，仅记录）

- `app/(payload)/admin/importMap.js` 是 Payload 生成文件且被 git 跟踪，dev server 每次启动会重新生成使其"复现为 dirty"（本次工作区中即为 dirty 状态）。
- 迁移：`down()` 回滚 Globals 是破坏性的；`20260815_035530` 的 `down()` 存在 drop 顺序缺陷；生产必须以全新数据库 `npx payload migrate` 全链执行（init → 010250 → 035530 → 073328 → 083819 → 084752 → 091550），且**永不回滚**。本地库存在 `dev`(batch -1) 的 dev-push 标记，若直接对已建库跑 `payload migrate` 可能因表已存在而失败。
- sitemap 会按每个 active career 各发一条 `/careers` URL（静态页被重复 4 次，实测 15 条 `<loc>` 中 careers 出现 4 次）；`limit: 500` 有上限。
- `getPageHeaders` / `getNewsById` / `getHomePage` 每次请求被调用两次（metadata + 页面主体），可用 React `cache()` 去重。
- `site-settings.headScripts` 与 `contact-page.seo` 字段后台可编辑但前台尚未消费。
- careers 加载中/错误态的临时英雄区使用较短的 pageHeader 副标题。
- 产品/招聘 description 文本被迁移丢弃，已由 seed（Task 23）重建。

## 部署前提

生产环境必须以**全新数据库**执行 `npx payload migrate` 全链迁移（init → 010250 → 035530 → 073328 → 083819 → 084752 → 091550）。073328 的 `up()` 会 CREATE TABLE 全部 Globals 表（Payload v3 每 Global 一个独立表）。若数据库已由 dev-push 建好 Globals 但迁移未记录，`payload migrate` 会因表已存在而失败。回滚（`migrate:down`）存在级联删除 Globals 数据与 035530 `down()` 顺序缺陷，生产不建议回滚。部署后需执行 seed 以填充 Globals 与结构化内容（Task 23 的 seed 脚本）。

## 最终审查后修复（提交 `da0b7d0`）

最终全分支审查（Ready to merge: Yes，无 Critical）后，一次性修复了以下 Minor 项：

- ✅ 六个 Globals getter 用 React `cache()` 包裹，消除每次请求的重复 fetch（原"已知遗留问题"中的双 fetch 项）。
- ✅ `seoToMetadata` 现支持 `ogImageUrl` → `openGraph.images`，后台 `seoFields.ogImage` 真正生效。
- ✅ sitemap 移除重复的 careerRoutes（`/careers` 只在静态路由出现一次）。
- ✅ `getNavigation` 在过滤结果为空时回退到 `FALLBACK_NAV_ITEMS`，避免空菜单。
- ✅ 导航品牌（logo + 站点名）改为读取 `site-settings`（`siteName`/`logoUrl`）。
- ✅ 产品详情 `generateMetadata` 改用真实站点名与产品 `seo` 组，移除硬编码 `| 公司名称`。

仍遗留（可接受）：importMap.js 跟踪导致 dirty、迁移单向门（需全新库 + 永不回滚）、`headScripts`/`contact-page.seo` 未被消费、careers 瞬态页头副标题、产品/招聘 description 迁移丢弃（seed 重建）。
