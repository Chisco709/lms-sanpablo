# 🚨 LIMPIEZA TOTAL MANUAL - POWERSHELL

## ⚠️ TERMINAL BLOQUEADA - EJECUTA ESTOS COMANDOS MANUALMENTE

### 🔧 PASO 1: ABRIR NUEVA TERMINAL POWERSHELL
1. **Presiona `Win + X`**
2. **Selecciona "Windows PowerShell (Administrador)"**
3. **Navega al proyecto:**
```powershell
cd "C:\gabriel-lms\lms-sanpablo"
```

### 🛑 PASO 2: DETENER PROCESOS (COPIA Y PEGA CADA LÍNEA)
```powershell
Get-Process | Where-Object {$_.ProcessName -match "node|npm|code"} | Stop-Process -Force -ErrorAction SilentlyContinue
```

### 🗑️ PASO 3: ELIMINAR .NEXT CORRUPTO (VARIOS MÉTODOS)
```powershell
# Método 1: PowerShell
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Si el método 1 falla, usa método 2:
cmd /c "rmdir /s /q .next"

# Si método 2 falla, usa método 3:
Get-ChildItem -Path ".next" -Recurse -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item -Path ".next" -Force -ErrorAction SilentlyContinue
```

### 🗑️ PASO 4: ELIMINAR NODE_MODULES CORRUPTO
```powershell
# Método 1: PowerShell
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Si falla, usar CMD:
cmd /c "rmdir /s /q node_modules"
```

### 🗑️ PASO 5: ELIMINAR ARCHIVOS LOCK
```powershell
Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item "yarn.lock" -Force -ErrorAction SilentlyContinue
Remove-Item "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
```

### 🧽 PASO 6: LIMPIAR CACHE Y TEMPORALES
```powershell
Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "out" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".eslintcache" -Force -ErrorAction SilentlyContinue
npm cache clean --force
```

### ✅ PASO 7: VERIFICAR LIMPIEZA
```powershell
# Ejecuta cada comando y verifica resultado:
Test-Path ".next"          # Debe retornar: False
Test-Path "node_modules"   # Debe retornar: False  
Test-Path "package-lock.json" # Debe retornar: False
```

### 🔄 PASO 8: REINSTALAR LIMPIO
```powershell
npm install --legacy-peer-deps --no-optional
```

### 🏗️ PASO 9: VERIFICAR BUILD
```powershell
npm run build
```

### 🚀 PASO 10: EJECUTAR DESARROLLO
```powershell
npm run dev
```

## 🎯 CRITERIOS DE ÉXITO:

### ✅ DEBE MOSTRAR:
- **`npm run build`** sin errores
- **NO más** `TypeError: e[o] is not a function`
- **NO más** `Cannot find module './vendor-chunks/@clerk.js'`
- **NO más** archivos 404
- **NO más** `experimental.esmExternals` warnings

### ❌ SI VES ESTOS ERRORES, REPITE LA LIMPIEZA:
- `TAR_ENTRY_ERROR`
- `ENOTEMPTY: directory not empty`
- `Access denied`
- `TypeError: e[o] is not a function`

## 🚨 PROBLEMAS YA CORREGIDOS:
- ✅ **`next.config.ts` duplicado eliminado**
- ✅ **Configuraciones experimentales removidas**
- ✅ **CSS global simplificado**
- ✅ **Tailwind config limpio**

## 🔧 SI ALGO FALLA:

### Para errores de permisos:
```powershell
# Ejecutar PowerShell como Administrador
takeown /f ".next" /r /d y
icacls ".next" /grant administrators:F /t
Remove-Item ".next" -Recurse -Force
```

### Para archivos bloqueados:
1. **Cerrar VS Code completamente**
2. **Reiniciar Windows**
3. **Repetir limpieza**

## ⚡ COMANDO RÁPIDO (TODO EN UNO):
```powershell
Get-Process | Where-Object {$_.ProcessName -match "node|npm|code"} | Stop-Process -Force -ErrorAction SilentlyContinue; Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue; npm cache clean --force; npm install --legacy-peer-deps --no-optional
```

**⚠️ EJECUTA PASO A PASO Y VERIFICA CADA RESULTADO ANTES DE CONTINUAR** 