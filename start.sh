#!/bin/bash
# ╔══════════════════════════════════════════╗
# ║  Career OS 本地预览服务器                ║
# ║  在项目根目录运行此脚本，然后打开浏览器   ║
# ╚══════════════════════════════════════════╝

PORT=8080

# 优先用 Python（macOS/Linux/Windows 都有）
if command -v python3 &>/dev/null; then
  echo "🚀 使用 Python3 启动 → http://localhost:$PORT/index.html"
  python3 -m http.server $PORT
elif command -v python &>/dev/null; then
  echo "🚀 使用 Python2 启动 → http://localhost:$PORT/index.html"
  python -m SimpleHTTPServer $PORT
# 其次用 Node.js
elif command -v npx &>/dev/null; then
  echo "🚀 使用 Node serve 启动 → http://localhost:$PORT/index.html"
  npx serve -l $PORT
# 兜底用 PHP
elif command -v php &>/dev/null; then
  echo "🚀 使用 PHP 启动 → http://localhost:$PORT/index.html"
  php -S localhost:$PORT
else
  echo "❌ 未找到 python / node / php"
  echo "   请安装 Python3: https://python.org"
  exit 1
fi
