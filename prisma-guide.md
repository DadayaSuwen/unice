# 联合化工官方网站 - Prisma ORM 配置

## 配置说明

本项目使用Prisma ORM进行数据库操作，以下是完整的配置和使用指南。

### 1. 项目结构

```
prisma/
├── schema.prisma          # Prisma数据模型定义
├── migrations/            # 数据库迁移文件
└── seed/                  # 种子数据

app/
├── lib/
│   └── prisma.ts          # Prisma Client实例
└── generated/
    └── prisma           # 自动生成的Prisma Client
```

### 2. Prisma配置文件

配置文件位于 `prisma/schema.prisma`，定义了完整的数据模型。

### 3. 数据库连接

数据库连接字符串位于 `.env` 文件中：
```
DATABASE_URL=postgresql://unice_user:unice_password@101.35.29.86:5432/unice
```

### 4. Prisma Client 初始化

在 `app/lib/prisma.ts` 中创建Prisma Client实例：

```typescript
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

### 5. 使用示例

#### 获取数据
```typescript
import { prisma } from '@/lib/prisma'

// 获取所有激活的产品
const products = await prisma.product.findMany({
  where: { is_active: true },
  orderBy: { created_at: 'desc' }
})

// 获取特定产品及其分类
const productWithCategory = await prisma.product.findUnique({
  where: { id: 1 },
  include: { category: true }
})
```

#### 创建数据
```typescript
import { prisma } from '@/lib/prisma'

// 创建新产品
const newProduct = await prisma.product.create({
  data: {
    name: '新产品名称',
    cas_no: '123-45-6',
    description: '产品描述',
    is_active: true
  }
})

// 创建分类
const newCategory = await prisma.category.create({
  data: {
    name: '新分类',
    slug: 'new-category',
    description: '分类描述'
  }
})
```

#### 更新数据
```typescript
import { prisma } from '@/lib/prisma'

// 更新产品
const updatedProduct = await prisma.product.update({
  where: { id: 1 },
  data: {
    name: '更新后的产品名称',
    description: '更新后的描述'
  }
})
```

#### 删除数据
```typescript
import { prisma } from '@/lib/prisma'

// 删除产品
const deletedProduct = await prisma.product.delete({
  where: { id: 1 }
})
```

### 6. 数据库迁移

#### 初始化迁移
```bash
npx prisma migrate dev --name init
```

#### 创建新的迁移
```bash
npx prisma migrate dev --name add_new_feature
```

#### 生产环境迁移
```bash
npx prisma migrate deploy
```

### 7. 数据库种子数据

可以使用Prisma Studio或手动编写种子脚本来填充初始数据。

### 8. 数据验证

Prisma提供了类型安全的API，所有的数据库操作都会在编译时进行验证。

### 9. 性能优化

- 使用 `include` 和 `select` 来控制查询返回的数据
- 合理使用索引
- 避免N+1查询问题

### 10. 错误处理

```typescript
import { prisma } from '@/lib/prisma'

try {
  const product = await prisma.product.findUnique({
    where: { id: 1 }
  })
} catch (error) {
  console.error('数据库错误:', error)
  // 处理错误
}
```

### 11. 环境变量配置

`.env` 文件包含：
- `DATABASE_URL` - 数据库连接字符串
- `NEXT_PUBLIC_SITE_URL` - 站点URL

### 12. 开发流程

1. 修改 `prisma/schema.prisma` 定义数据模型
2. 运行 `npx prisma migrate dev --name migration_name` 创建迁移
3. 运行 `npx prisma generate` 生成新的Client
4. 在代码中使用新的数据模型