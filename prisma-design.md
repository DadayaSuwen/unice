# 联合化工官方网站 - 数据库ORM设计

## Prisma ORM 配置说明

本项目使用Prisma ORM来管理数据库操作，提供了类型安全和高效的数据库访问方式。

### 配置文件

配置文件位于 `prisma/schema.prisma`，定义了以下数据模型：

1. **Category** - 产品分类
2. **Product** - 产品信息
3. **News** - 新闻动态
4. **Career** - 招聘信息
5. **User** - 系统用户
6. **ContactSubmission** - 联系表单提交
7. **HeroBanner** - 首页横幅

### 数据库连接

数据库连接字符串位于 `.env` 文件中：

```
DATABASE_URL=postgresql://username:password@101.35.29.86:5432/unice
```

### Prisma Client 生成

运行以下命令生成Prisma Client：

```bash
npx prisma generate
```

### 数据库迁移

使用以下命令进行数据库迁移：

```bash
# 初始化迁移
npx prisma migrate dev --name init

# 创建新的迁移
npx prisma migrate dev --name add_new_table
```

### 使用示例

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取所有激活的产品
const products = await prisma.product.findMany({
  where: { is_active: true },
  orderBy: { created_at: 'desc' }
})

// 创建新产品
const newProduct = await prisma.product.create({
  data: {
    name: '新产品名称',
    cas_no: '123-45-6',
    description: '产品描述',
    is_active: true
  }
})

// 更新产品
const updatedProduct = await prisma.product.update({
  where: { id: 1 },
  data: { name: '更新后的产品名称' }
})

// 删除产品
const deletedProduct = await prisma.product.delete({
  where: { id: 1 }
})
```

### 数据模型说明

#### Category (产品分类)
- `id`: 分类ID
- `name`: 分类名称
- `slug`: URL友好的分类标识符
- `description`: 分类描述
- `parent_id`: 父分类ID（支持多级分类）
- `is_active`: 是否激活
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### Product (产品)
- `id`: 产品ID
- `name`: 产品名称
- `cas_no`: CAS号
- `category_id`: 所属分类ID
- `description`: 产品描述
- `details`: 详细技术参数（JSON格式）
- `image_url`: 产品图片URL
- `is_active`: 是否激活
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### News (新闻)
- `id`: 新闻ID
- `title`: 新闻标题
- `content`: 新闻内容
- `excerpt`: 摘要
- `type`: 新闻类型
- `publish_date`: 发布日期
- `is_published`: 是否发布
- `author_id`: 作者ID
- `image_url`: 图片URL
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### Career (招聘)
- `id`: 职位ID
- `position`: 职位名称
- `department`: 部门
- `location`: 工作地点
- `type`: 职位类型
- `experience_requirement`: 经验要求
- `description`: 职位描述
- `requirements`: 要求（JSON格式）
- `responsibilities`: 职责（JSON格式）
- `application_deadline`: 申请截止日期
- `is_active`: 是否激活
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### User (用户)
- `id`: 用户ID
- `username`: 用户名
- `email`: 邮箱
- `password_hash`: 密码哈希
- `role`: 用户角色
- `first_name`: 名字
- `last_name`: 姓氏
- `phone`: 电话
- `is_active`: 是否激活
- `last_login`: 最后登录时间
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### ContactSubmission (联系表单)
- `id`: 提交记录ID
- `name`: 姓名
- `email`: 邮箱
- `phone`: 电话
- `company`: 公司
- `message`: 消息内容
- `ip_address`: IP地址
- `user_agent`: 用户代理
- `is_read`: 是否已读
- `created_at`: 创建时间

#### HeroBanner (首页横幅)
- `id`: 横幅ID
- `title`: 标题
- `subtitle`: 副标题
- `image_url`: 图片URL
- `button_text`: 按钮文本
- `button_url`: 按钮链接
- `is_active`: 是否激活
- `sort_order`: 排序
- `created_at`: 创建时间
- `updated_at`: 更新时间