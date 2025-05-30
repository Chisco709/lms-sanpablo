@echo off
title LIMPIEZA TOTAL - LMS SanPablo
echo.
echo =========================================
echo    🧹 LIMPIEZA TOTAL COMPLETA
echo =========================================
echo.

echo [PASO 1/8] Deteniendo procesos...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
taskkill /f /im code.exe >nul 2>&1
timeout /t 3 >nul

echo [PASO 2/8] Eliminando .next corrupto...
if exist ".next" (
    echo Removiendo directorio .next...
    rmdir /s /q ".next" >nul 2>&1
    timeout /t 2 >nul
    if exist ".next" (
        echo Forzando eliminacion...
        rd /s /q ".next" >nul 2>&1
    )
)

echo [PASO 3/8] Eliminando node_modules corrupto...
if exist "node_modules" (
    echo Removiendo node_modules...
    rmdir /s /q "node_modules" >nul 2>&1
    timeout /t 3 >nul
)

echo [PASO 4/8] Eliminando archivos de lock...
if exist "package-lock.json" del "package-lock.json" >nul 2>&1
if exist "yarn.lock" del "yarn.lock" >nul 2>&1
if exist "pnpm-lock.yaml" del "pnpm-lock.yaml" >nul 2>&1

echo [PASO 5/8] Eliminando cache y temporales...
if exist ".eslintcache" del ".eslintcache" >nul 2>&1
if exist "dist" rmdir /s /q "dist" >nul 2>&1
if exist "out" rmdir /s /q "out" >nul 2>&1

echo [PASO 6/8] Limpiando cache npm global...
npm cache clean --force >nul 2>&1

echo [PASO 7/8] Limpiando archivos temporales...
del /q /s "*.tmp" >nul 2>&1
del /q /s "*.log" >nul 2>&1

echo [PASO 8/8] Verificando limpieza...
echo.
echo ✅ Verificando resultados:
if not exist ".next" (
    echo   ✅ .next eliminado
) else (
    echo   ❌ .next aun existe
)

if not exist "node_modules" (
    echo   ✅ node_modules eliminado  
) else (
    echo   ❌ node_modules aun existe
)

if not exist "package-lock.json" (
    echo   ✅ package-lock.json eliminado
) else (
    echo   ❌ package-lock.json aun existe
)

echo.
echo ========================================
echo     🎉 LIMPIEZA TOTAL COMPLETADA
echo ========================================
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. npm install --legacy-peer-deps
echo 2. npm run build (para verificar)
echo 3. npm run dev
echo.
pause 