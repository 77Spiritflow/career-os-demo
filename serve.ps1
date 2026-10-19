# ============================================================
#  Career OS 本地预览服务器（零依赖版）
#  不需要安装 Python / Node，Windows 自带 PowerShell 即可运行
#  用法：在项目根目录打开 cmd，运行：
#    powershell -ExecutionPolicy Bypass -File serve.ps1
#  然后浏览器打开 http://localhost:8080/index.html
#  按 Ctrl+C 停止
# ============================================================

$port = 8080
$root = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "无法占用端口 $port （可能已被占用或需要权限）" -ForegroundColor Red
    Write-Host "提示：换端口请把本文件第一行 \$port 改成 8081 等未占用端口" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Career OS 已启动" -ForegroundColor Green
Write-Host "   请用浏览器打开： http://localhost:$port/index.html" -ForegroundColor Cyan
Write-Host "   按 Ctrl+C 停止服务器`n" -ForegroundColor DarkGray

$map = @{
    html = 'text/html; charset=utf-8';  htm = 'text/html; charset=utf-8'
    css  = 'text/css; charset=utf-8';   js  = 'application/javascript; charset=utf-8'
    png  = 'image/png'; jpg = 'image/jpeg'; jpeg = 'image/jpeg'
    svg  = 'image/svg+xml'; json = 'application/json'; ico = 'image/x-icon'
    webp = 'image/webp'; txt = 'text/plain; charset=utf-8'
}

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
        $p = $ctx.Request.Url.AbsolutePath
        if ($p -eq '/' -or $p -eq '') { $p = '/index.html' }
        # 去掉前导斜杠，转换为本地相对路径，防止目录穿越
        $rel = $p.TrimStart('/') -replace '/', '\'
        $file = [IO.Path]::GetFullPath((Join-Path $root $rel))
        if (-not $file.StartsWith([IO.Path]::GetFullPath($root))) {
            $ctx.Response.StatusCode = 403
            $ctx.Response.Close()
            continue
        }
        if (Test-Path $file -PathType Leaf) {
            $bytes = [IO.File]::ReadAllBytes($file)
            $ext = [IO.Path]::GetExtension($file).TrimStart('.').ToLower()
            $ct  = if ($map.ContainsKey($ext)) { $map[$ext] } else { 'application/octet-stream' }
            $ctx.Response.ContentType = $ct
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $ctx.Response.OutputStream.Close()
        } else {
            $ctx.Response.StatusCode = 404
            $ctx.Response.Close()
        }
    } catch {
        $ctx.Response.StatusCode = 500
        $ctx.Response.Close()
    }
}
$listener.Stop()
