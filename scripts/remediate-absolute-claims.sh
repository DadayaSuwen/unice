#!/usr/bin/env bash
# =============================================================
# 官网绝对化用语线上库整改脚本（包装 scripts/remediate-absolute-claims.ts）
#
# 背景：官网遭举报使用「一流 / 最先进 / 全球领先 / 顶尖 / 国际领先 / 引领行业…」
#       等绝对化用语，涉嫌违反《广告法》第9条第3项，需对线上数据库整改。
#
# 前置条件（服务器上需满足）：
#   1) 仓库代码已就位，含 scripts/remediate-absolute-claims.ts（本文件在 scripts/ 下）
#   2) node_modules 已安装且含 tsx（npm ci / npm install 即可；生产镜像含 tsx）
#   3) 数据库连接可用：
#        - 设置了环境变量 DATABASE_URL，或
#        - 仓库根目录有 .env 且含 DATABASE_URL（指向你要整改的线上库）
#
# 用法（在仓库根目录执行）：
#   bash scripts/remediate-absolute-claims.sh             # dry-run：只扫描并打印「旧→新」报告，不写库
#   bash scripts/remediate-absolute-claims.sh --apply      # 写库，并在写库后回读校验核心禁用词（无残留才算成功）
#
# 安全提示：--apply 会修改线上生产数据库，请务必先跑一次 dry-run 确认识别无误。
# =============================================================
set -uo pipefail

cd "$(dirname "$0")/.." || { echo "!! 无法进入仓库根目录"; exit 1; }
ROOT="$(pwd)"
echo "==> 工作目录: $ROOT"

# ---------- 预检 1：数据库连接目标 ----------
DB_URL="$(printenv DATABASE_URL 2>/dev/null || true)"
if [ -z "$DB_URL" ] && [ -f "$ROOT/.env" ]; then
  DB_URL="$(grep -E '^DATABASE_URL=' "$ROOT/.env" | head -1 | cut -d= -f2- | tr -d '"')"
fi
if [ -z "$DB_URL" ]; then
  echo "!! 未找到 DATABASE_URL（环境变量或 .env）。请先配置为指向要整改的线上库。"
  exit 1
fi
# 只显示 host:port/db 部分，脱敏密码
DB_HINT="$(printf '%s' "$DB_URL" | sed -E 's#(//[^:]+:)[^@]+(@)#\1***\2#' | sed -E 's#\?.*##')"
echo "==> 连接目标: $DB_HINT  （请确认这是线上生产库）"

# ---------- 预检 2：tsx 可用性 ----------
TSX=""
if [ -x "$ROOT/node_modules/.bin/tsx" ]; then
  TSX="$ROOT/node_modules/.bin/tsx"
elif [ -f "$ROOT/node_modules/tsx/dist/cli.mjs" ]; then
  TSX="node $ROOT/node_modules/tsx/dist/cli.mjs"
else
  echo "!! 未找到 tsx。请在仓库根目录执行 npm ci 或 npm install 后重试。"
  exit 1
fi

# ---------- 模式与确认 ----------
MODE="DRY-RUN（不写库）"
ARG=""
if [ "${1:-}" = "--apply" ]; then
  MODE="APPLY（写入线上库）"
  ARG="--apply"
  echo ""
  echo "⚠️  即将【写库】到: $DB_HINT"
  echo "    请输入 yes 确认后继续（输入其他内容则取消）："
  read -r CONFIRM
  if [ "$CONFIRM" != "yes" ]; then
    echo "已取消，未做任何写入。"
    exit 0
  fi
fi

echo ""
echo "==> 模式: $MODE"
echo "==> 开始（默认 dry-run；--apply 才写库）…"
echo ""
# shellcheck disable=SC2086
$TSX "$ROOT/scripts/remediate-absolute-claims.ts" $ARG
EC=$?
echo ""
echo "==> 退出码: $EC  （0=成功；apply 模式下 1=库内仍有核心禁用词残留，请看上方报告）"
exit "$EC"