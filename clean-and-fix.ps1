# Script para limpiar y regenerar el proyecto LMS
Write-Host "🧹 Limpiando proyecto..." -ForegroundColor Yellow

# Detener procesos Node.js
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process npm -ErrorAction SilentlyContinue | Stop-Process -Force

# Limpiar directorios
if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }
if (Test-Path "node_modules") { Remove-Item "node_modules" -Recurse -Force }
if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" -Force }

Write-Host "✅ Limpieza completada" -ForegroundColor Green

# Limpiar caché npm
npm cache clean --force

Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
npm install

Write-Host "🚀 Proyecto regenerado!" -ForegroundColor Green
Write-Host "📝 Ahora ejecuta: npm run dev" -ForegroundColor Cyan 