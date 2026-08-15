# Payload 重建后台 — 回归测试报告

- 日期: 2026-08-15
- 范围: `docs/superpowers/plans/2026-08-14-payload-backend-rebuild.md` 全部 11 个任务完成后的一次全量回归
- 环境: 本地 Docker PostgreSQL(`unice_postgres`, `localhost:5432`), Next.js 16 dev 模式, Payload 3.88

## 结论

**全部通过。** 静态检查、后台/认证、12 个公共页面、全部公共 API 端点、管理员 CRUD 与访问控制、生产构建均正常;git 工作区干净。

## 阶段明细

### 阶段 1: 静态检查
| 检查 | 结果 |
|---|---|
| `npx tsc --noEmit` | ✅ 0 错误 |
| `npx eslint .` | ✅ 0 错误(4 个既有 warning:`footer.tsx` 未用变量×2、`ProductDetailClient.tsx` img 元素、`careers/route.ts` 未用参数) |

### 阶段 2: 后台与认证
- `/admin` → 200, 单 `<html>`/`<body>`(双根布局修复后), `lang="zh"`
- 登录 `1179002658@qq.com` / `housuwen` → 「身份验证通过」, role=admin, id=1
- 数据库数据: products=3, news=3, careers=3, users=1

### 阶段 3: 公共页面(全部 200)
`/`、`/about`、`/products`、`/products/1..3`、`/news`、`/news/1..3`、`/careers`、`/contact`(共 12 个)
- 首页渲染 3 个产品(TPA-200 / CPP-300 / SCA-50)
- 产品列表页渲染 3 个产品

### 阶段 4: 公共 API 端点
| 端点 | 结果 |
|---|---|
| `GET /api/products?page=1&limit=2` | 2 items, totalPages=2, categories=5 |
| `GET /api/products-details/1` | TPA-200, related=1, details 6 键 |
| `GET /api/popular-products` | 3 items |
| `GET /api/news?category=公司新闻` | 2 items, 7 个分类 |
| `GET /api/news/1` | lexical→HTML 正确, views+1(=3) |
| `POST /api/news/1 {limit:2}` | 相关新闻 1 条 |
| `GET /api/careers` | 3 items |

### 阶段 5: 管理员 CRUD + 访问控制
- 创建/更新/删除 `hero-banners`(id=3) ✅
- 未登录写操作 → 403 ✅
- `contact-submissions`: 未登录读 403 / 登录后读 200(2 条) ✅
- 无测试数据泄漏(TEST-0001 残留为 0)

### 阶段 6: 构建与状态
- `next build` → 成功, `/products/[id]` SSG 3 个产品
- git 工作区干净,最新提交 `816bcb2`

## 回归中发现并处理的问题

1. **管理员账号变更**: 本地库管理员为 `1179002658@qq.com`(在后台"创建首个用户"注册), 而非 seed 的 `admin@unicechemical.com`。按用户指示直接使用 `1179002658@qq.com` / `housuwen`, 未改动该账号。seed 中的已知账号 `admin@unicechemical.com` / `admin123456` 已不存在, 若需恢复可重跑 `npm run payload:seed`(会创建, 不影响现有账号)。
2. **CRUD 测试端点选择**: `/api/products` 被自定义适配层接管(该路由仅实现 GET, POST 返回 405), 因此 CRUD 验证改用未被接管的 `hero-banners` 集合, 权限逻辑一致。

## 未验证项(待人工)

- **Docker 完整镜像构建**: 仅验证 `docker compose config` 合法, 完整 `docker compose up app` 未执行。
- **产品图片**: seed 使用占位路径 `/images/products/*.jpg`, 图片资源本身不存在, 前台产品图显示占位。
- **后台视觉**: 金色主题与中文界面已生效(server 侧验证), 浏览器内最终观感由人工确认。
