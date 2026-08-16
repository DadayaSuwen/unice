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

# 复制源代码
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 站点 URL（构建时注入，用于 sitemap/robots；可用 --build-arg 或 compose build.args 覆盖）
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

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

# 4. 【修改】启动命令：先跑 Payload 迁移（建表/补列），再以集群模式启动。
#    --force-accept-warning：容器内无 TTY，避免 “dev mode / pushed changes” 交互提示导致迁移卡住、pm2 起不来。
CMD ["sh", "-c", "npx payload migrate --force-accept-warning && pm2-runtime start ecosystem.config.cjs"]