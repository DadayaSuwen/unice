# Docker 部署说明

本项目已成功配置Docker容器化部署，包含以下服务：

## 服务架构

- **Web应用**: Next.js应用 (端口3000)
- **数据库**: PostgreSQL 16 (端口5432)

## 快速启动

1. **构建并启动所有服务**
   ```bash
   docker-compose up -d
   ```

2. **查看服务状态**
   ```bash
   docker-compose ps
   ```

3. **查看日志**
   ```bash
   docker-compose logs -f
   ```

## 数据库管理

- **数据库连接信息**:
  - 主机: localhost:5432
  - 数据库: unice
  - 用户名: postgres
  - 密码: housuwen

- **运行数据库迁移**:
  ```bash
  docker-compose exec app npx prisma migrate deploy
  ```

- **重置种子数据**:
  ```bash
  docker-compose exec app node prisma/seed.js
  ```

## 访问地址

- **网站首页**: http://localhost:3000
- **API端点**:
  - 产品API: http://localhost:3000/api/products
  - 新闻API: http://localhost:3000/api/news

## 环境变量

主要环境变量已在docker-compose.yml中配置：
- `DATABASE_URL`: PostgreSQL数据库连接字符串
- `NODE_ENV`: 生产环境
- `NEXT_PUBLIC_API_URL`: API基础URL

## 常用命令

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 重新构建并启动
docker-compose up -d --build

# 进入应用容器
docker-compose exec app sh

# 进入数据库容器
docker-compose exec postgres psql -U postgres -d unice
```

## 生产部署注意事项

1. **安全配置**:
   - 修改默认数据库密码
   - 配置适当的网络访问权限
   - 使用HTTPS

2. **数据备份**:
   ```bash
   # 备份数据库
   docker-compose exec postgres pg_dump -U postgres unice > backup.sql

   # 恢复数据库
   docker-compose exec -T postgres psql -U postgres unice < backup.sql
   ```

3. **监控**:
   - 定期检查容器状态
   - 监控数据库性能
   - 设置日志轮转

## 故障排除

如果遇到端口冲突，可以修改docker-compose.yml中的端口映射：

```yaml
ports:
  - "3001:3000"  # 将外部端口改为3001
  - "5433:5432"  # 将外部端口改为5433
```