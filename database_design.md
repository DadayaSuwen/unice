# 联合化工官方网站数据库设计

## 数据库概览

根据开发文档要求，本项目使用PostgreSQL数据库来存储网站所需的数据。以下是核心表结构设计。

## 表结构设计

### 1. 产品表 (products)

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cas_no VARCHAR(50),
    category_id INTEGER,
    description TEXT,
    details JSONB,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 添加索引
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_cas_no ON products(cas_no);
```

### 2. 产品分类表 (categories)

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 添加索引
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
```

### 3. 新闻动态表 (news)

```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    excerpt TEXT,
    type VARCHAR(50) DEFAULT 'news',
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    author_id INTEGER,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_news_publish_date ON news(publish_date DESC);
CREATE INDEX idx_news_published ON news(is_published);
CREATE INDEX idx_news_type ON news(type);
```

### 4. 招聘信息表 (careers)

```sql
CREATE TABLE careers (
    id SERIAL PRIMARY KEY,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(50) DEFAULT 'full_time',
    experience_requirement VARCHAR(100),
    description TEXT,
    requirements JSONB,
    responsibilities JSONB,
    application_deadline TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_careers_active ON careers(is_active);
CREATE INDEX idx_careers_department ON careers(department);
CREATE INDEX idx_careers_position ON careers(position);
```

### 5. 用户表 (users)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
```

### 6. 联系表单提交记录 (contact_submissions)

```sql
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_read ON contact_submissions(is_read);
```

### 7. 首页轮播图 (hero_banners)

```sql
CREATE TABLE hero_banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    image_url VARCHAR(500) NOT NULL,
    button_text VARCHAR(100),
    button_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_hero_banners_active ON hero_banners(is_active);
CREATE INDEX idx_hero_banners_sort ON hero_banners(sort_order);
```

## 关系说明

1. **products.category_id** → **categories.id** (一对多关系)
2. **news.author_id** → **users.id** (一对多关系)
3. **careers** 与 **users** 无直接关系，独立存在

## 初始数据示例

### 分类初始数据
```sql
INSERT INTO categories (name, slug, description) VALUES
('聚合物材料', 'polymer-materials', '各类聚合物材料产品'),
('基础化工原料', 'basic-chemicals', '基础化工原材料'),
('精细化学品', 'fine-chemicals', '高附加值精细化学品'),
('溶剂类', 'solvents', '各类有机溶剂'),
('无机酸类', 'inorganic-acids', '无机酸类化学品');
```

### 初始用户数据
```sql
INSERT INTO users (username, email, password_hash, role, first_name, last_name) VALUES
('admin', 'admin@unicechemical.com', '$2b$10$example_hash', 'administrator', '管理员', '系统');
```

## 数据库迁移脚本结构

为了便于维护，建议将数据库迁移脚本分文件存放：

```
db/
├── migrations/
│   ├── 001_create_categories_table.sql
│   ├── 002_create_products_table.sql
│   ├── 003_create_news_table.sql
│   ├── 004_create_careers_table.sql
│   ├── 005_create_users_table.sql
│   ├── 006_create_contact_submissions_table.sql
│   └── 007_create_hero_banners_table.sql
└── seeds/
    ├── categories_seed.sql
    └── users_seed.sql
```

## 安全和备份建议

1. **数据安全**：
   - 用户密码使用bcrypt加密存储
   - 敏感数据访问需权限控制
   - 数据库连接使用SSL加密

2. **备份策略**：
   - 每日自动备份
   - 保留最近7天的备份
   - 重要数据定期做异地备份

3. **性能优化**：
   - 对常用查询字段添加索引
   - 定期分析和优化查询性能
   - 大量数据表建议分表处理