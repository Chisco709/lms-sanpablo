Write-Host "🧹 LIMPIEZA TOTAL - LMS SANPABLO" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# PASO 1: Detener procesos
Write-Host "[1/8] Deteniendo procesos..." -ForegroundColor Yellow
try {
    Get-Process | Where-Object {$_.ProcessName -match "node|npm|code"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Procesos detenidos" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Algunos procesos no se pudieron detener" -ForegroundColor DarkYellow
}

Start-Sleep -Seconds 2

# PASO 2: Eliminar .next (múltiples métodos)
Write-Host "[2/8] Eliminando .next corrupto..." -ForegroundColor Yellow
if (Test-Path ".next") {
    try {
        # Método 1: PowerShell estándar
        Remove-Item -Path ".next" -Recurse -Force -ErrorAction Stop
        Write-Host "✅ .next eliminado (método 1)" -ForegroundColor Green
    } catch {
        try {
            # Método 2: CMD desde PowerShell
            cmd /c "rmdir /s /q .next" 2>$null
            if (-not (Test-Path ".next")) {
                Write-Host "✅ .next eliminado (método 2)" -ForegroundColor Green
            } else {
                # Método 3: Eliminar contenido primero
                Get-ChildItem -Path ".next" -Recurse -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
                Remove-Item -Path ".next" -Force -ErrorAction SilentlyContinue
                Write-Host "✅ .next eliminado (método 3)" -ForegroundColor Green
            }
        } catch {
            Write-Host "❌ No se pudo eliminar .next - puede requerir reinicio" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✅ .next no existe" -ForegroundColor Green
}

# PASO 3: Eliminar node_modules
Write-Host "[3/8] Eliminando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    try {
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction Stop
        Write-Host "✅ node_modules eliminado" -ForegroundColor Green
    } catch {
        cmd /c "rmdir /s /q node_modules" 2>$null
        if (-not (Test-Path "node_modules")) {
            Write-Host "✅ node_modules eliminado (CMD)" -ForegroundColor Green
        } else {
            Write-Host "❌ No se pudo eliminar node_modules completamente" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✅ node_modules no existe" -ForegroundColor Green
}

# PASO 4: Eliminar archivos lock
Write-Host "[4/8] Eliminando archivos lock..." -ForegroundColor Yellow
$lockFiles = @("package-lock.json", "yarn.lock", "pnpm-lock.yaml")
foreach ($file in $lockFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force -ErrorAction SilentlyContinue
        Write-Host "✅ $file eliminado" -ForegroundColor Green
    }
}

# PASO 5: Eliminar cache y temporales
Write-Host "[5/8] Eliminando cache y temporales..." -ForegroundColor Yellow
$tempDirs = @("dist", "out", ".eslintcache")
foreach ($dir in $tempDirs) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ $dir eliminado" -ForegroundColor Green
    }
}

# PASO 6: Limpiar cache npm
Write-Host "[6/8] Limpiando cache npm..." -ForegroundColor Yellow
try {
    npm cache clean --force 2>$null
    Write-Host "✅ Cache npm limpio" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Error limpiando cache npm" -ForegroundColor DarkYellow
}

# PASO 7: Verificar limpieza
Write-Host "[7/8] Verificando limpieza..." -ForegroundColor Yellow
$results = @()

if (-not (Test-Path ".next")) { 
    $results += "✅ .next eliminado"
} else { 
    $results += "❌ .next AUN existe"
}

if (-not (Test-Path "node_modules")) { 
    $results += "✅ node_modules eliminado"
} else { 
    $results += "❌ node_modules AUN existe"
}

if (-not (Test-Path "package-lock.json")) { 
    $results += "✅ package-lock.json eliminado"
} else { 
    $results += "❌ package-lock.json AUN existe"
}

Write-Host ""
Write-Host "📋 RESULTADOS:" -ForegroundColor Cyan
foreach ($result in $results) {
    if ($result.StartsWith("✅")) {
        Write-Host $result -ForegroundColor Green
    } else {
        Write-Host $result -ForegroundColor Red
    }
}

# PASO 8: Instalación limpia
Write-Host ""
Write-Host "[8/8] Instalando dependencias limpias..." -ForegroundColor Yellow
try {
    npm install --legacy-peer-deps --no-optional
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} catch {
    Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
    Write-Host "Ejecuta manualmente: npm install --legacy-peer-deps --no-optional" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "🎉 LIMPIEZA COMPLETADA!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. npm run build (para verificar)" -ForegroundColor White
Write-Host "2. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "⚠️ Si hay errores, reporta el resultado específico" -ForegroundColor DarkYellow 