# 使用官方Node.js 20 LTS版本作为基础镜像
FROM node:20-alpine AS base

# 安装必要的系统依赖
RUN apk add --no-cache openssl

# 设置工作目录
WORKDIR /app

# 1. 全局安装 PM2
RUN npm install --global pm2

# 复制package文件
COPY package*.json ./

# 安装所有依赖
RUN npm ci

# 复制Prisma配置
COPY prisma ./prisma/

# 生成Prisma客户端
RUN npx prisma generate

# 复制源代码
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 构建应用
RUN npm run build

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 3. 设置 PM2 目录权限 (防止无权限写入日志)
RUN mkdir -p /home/nextjs/.pm2 && \
    chown -R nextjs:nodejs /home/nextjs

# 设置项目目录权限
RUN chown -R nextjs:nodejs /app

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000

# 4. 【修改】启动命令：直接加载配置文件
CMD ["pm2-runtime", "start", "ecosystem.config.js"]