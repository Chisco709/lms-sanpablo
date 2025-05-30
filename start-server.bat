@echo off
echo 🧹 Limpiando proyecto...

REM Detener procesos Node.js
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

REM Limpiar directorios
if exist ".next" rmdir /s /q ".next"
if exist "package-lock.json" del "package-lock.json"

echo ✅ Limpieza completada

echo 📦 Instalando dependencias...
npm install

echo 🚀 Iniciando servidor...
npm run dev

pause 