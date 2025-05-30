@echo off
title LIMPIEZA FORZADA FINAL - LMS SanPablo
echo.
echo ===============================================
echo    🔥 LIMPIEZA FORZADA COMPLETA - MODO AGRESIVO
echo ===============================================
echo.

echo [PASO 1] Terminando TODOS los procesos relacionados...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
taskkill /f /im code.exe >nul 2>&1
taskkill /f /im PowerShell.exe >nul 2>&1
timeout /t 3 >nul

echo [PASO 2] Eliminando .next con FUERZA EXTREMA...
if exist ".next" (
    echo Intento 1: rmdir clasico...
    rmdir /s /q ".next" >nul 2>&1
    
    if exist ".next" (
        echo Intento 2: takeown + icacls...
        takeown /f ".next" /r /d y >nul 2>&1
        icacls ".next" /grant administrators:F /t >nul 2>&1
        rmdir /s /q ".next" >nul 2>&1
    )
    
    if exist ".next" (
        echo Intento 3: eliminacion archivo por archivo...
        for /r ".next" %%f in (*) do del /f /q "%%f" >nul 2>&1
        for /d %%d in (.next\*) do rmdir /s /q "%%d" >nul 2>&1
        rmdir ".next" >nul 2>&1
    )
    
    if exist ".next" (
        echo ❌ .next RESISTENTE - necesita reinicio
    ) else (
        echo ✅ .next eliminado exitosamente
    )
) else (
    echo ✅ .next no existe
)

echo [PASO 3] Eliminando node_modules con FUERZA EXTREMA...
if exist "node_modules" (
    echo Intento 1: rmdir clasico...
    rmdir /s /q "node_modules" >nul 2>&1
    
    if exist "node_modules" (
        echo Intento 2: takeown + icacls...
        takeown /f "node_modules" /r /d y >nul 2>&1
        icacls "node_modules" /grant administrators:F /t >nul 2>&1
        rmdir /s /q "node_modules" >nul 2>&1
    )
    
    if exist "node_modules" (
        echo ❌ node_modules RESISTENTE - necesita reinicio
    ) else (
        echo ✅ node_modules eliminado exitosamente
    )
) else (
    echo ✅ node_modules no existe
)

echo [PASO 4] Eliminando archivos lock y cache...
if exist "package-lock.json" del /f /q "package-lock.json" >nul 2>&1
if exist "yarn.lock" del /f /q "yarn.lock" >nul 2>&1
if exist "pnpm-lock.yaml" del /f /q "pnpm-lock.yaml" >nul 2>&1
if exist ".eslintcache" del /f /q ".eslintcache" >nul 2>&1

echo [PASO 5] Limpiando cache npm...
npm cache clean --force >nul 2>&1

echo [PASO 6] VERIFICACION CRITICA...
echo.
echo 📋 RESULTADOS DE LIMPIEZA:
if not exist ".next" (
    echo   ✅ .next = ELIMINADO
) else (
    echo   ❌ .next = AUN EXISTE ^(PROBLEMA CRITICO^)
)

if not exist "node_modules" (
    echo   ✅ node_modules = ELIMINADO
) else (
    echo   ❌ node_modules = AUN EXISTE ^(PROBLEMA CRITICO^)
)

if not exist "package-lock.json" (
    echo   ✅ package-lock.json = ELIMINADO
) else (
    echo   ❌ package-lock.json = AUN EXISTE
)

echo.
echo [PASO 7] Instalacion LIMPIA...
echo Instalando dependencias con flags especiales...
npm install --legacy-peer-deps --no-optional --force

echo.
echo ===============================================
echo          🎯 LIMPIEZA FORZADA COMPLETADA
echo ===============================================
echo.
echo 📋 PROXIMOS PASOS OBLIGATORIOS:
echo 1. Verificar que NO existan .next ni node_modules
echo 2. npm run build ^(DEBE ser exitoso^)
echo 3. npm run dev ^(SIN errores TypeError^)
echo.
echo ⚠️ Si .next o node_modules AUN existen:
echo    1. REINICIA Windows
echo    2. Ejecuta este script otra vez
echo    3. Reporta el problema
echo.
pause 