@echo off
title LMS SanPablo - Regeneracion Completa
echo.
echo ========================================
echo    LMS SANPABLO - REGENERACION TOTAL
echo ========================================
echo.

echo [1/6] Deteniendo procesos...
taskkill /f /im node.exe 2>nul >nul
taskkill /f /im npm.exe 2>nul >nul
timeout /t 2 >nul

echo [2/6] Eliminando archivos corruptos...
if exist ".next" (
    echo Eliminando .next...
    rmdir /s /q ".next" 2>nul
)
if exist "package-lock.json" (
    echo Eliminando package-lock.json...
    del "package-lock.json" 2>nul
)

echo [3/6] Limpiando cache npm...
npm cache clean --force >nul 2>&1

echo [4/6] Verificando package.json...
if not exist "package.json" (
    echo ERROR: package.json no encontrado!
    pause
    exit /b 1
)

echo [5/6] Instalando dependencias limpias...
npm install --no-optional --legacy-peer-deps

echo [6/6] Verificando instalacion...
if exist "node_modules" (
    echo ✅ Dependencias instaladas correctamente
) else (
    echo ❌ Error en la instalacion
    pause
    exit /b 1
)

echo.
echo ========================================
echo       REGENERACION COMPLETADA
echo ========================================
echo.
echo ✅ Proyecto regenerado exitosamente
echo 🚀 Ahora ejecuta: npm run dev
echo.
pause 