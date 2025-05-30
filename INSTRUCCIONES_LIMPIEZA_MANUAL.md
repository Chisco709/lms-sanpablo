# 🧹 INSTRUCCIONES LIMPIEZA TOTAL MANUAL

## ⚠️ IMPORTANTE: La terminal está experimentando problemas, ejecuta estos comandos MANUALMENTE

## 🔧 PASO 1: ABRIR TERMINAL LIMPIA
1. Presiona `Win + R`
2. Escribe `cmd` y presiona Enter
3. Navega al proyecto: `cd C:\gabriel-lms\lms-sanpablo`

## 🛑 PASO 2: DETENER PROCESOS
```cmd
taskkill /f /im node.exe
taskkill /f /im npm.exe
taskkill /f /im code.exe
```

## 🗑️ PASO 3: ELIMINAR ARCHIVOS CORRUPTOS
```cmd
rmdir /s /q .next
rmdir /s /q node_modules
del package-lock.json
del yarn.lock
```

## 🧽 PASO 4: LIMPIAR CACHE
```cmd
npm cache clean --force
```

## 🔄 PASO 5: REINSTALAR LIMPIO
```cmd
npm install --legacy-peer-deps --no-optional
```

## ✅ PASO 6: VERIFICAR BUILD
```cmd
npm run build
```

## 🚀 PASO 7: EJECUTAR
```cmd
npm run dev
```

## 🚨 PROBLEMAS IDENTIFICADOS Y CORREGIDOS:

### ❌ Eliminados:
- ✅ `next.config.ts` duplicado (CONFLICTO RESUELTO)
- ✅ `package-lock.json` corrupto  
- ✅ Configuraciones experimentales problemáticas

### ✅ Configuración Limpia:
- ✅ Solo `next.config.js` (sin experimental.esmExternals)
- ✅ Tailwind simplificado
- ✅ CSS global minimalista

## 🎯 CRITERIOS DE ÉXITO:
1. ✅ `npm run build` SIN ERRORES
2. ✅ NO más "TypeError: e[o] is not a function"
3. ✅ NO más módulos 404
4. ✅ Clerk funcionando
5. ✅ Chapters cargando

## 📋 SI ALGO FALLA:
1. Repetir PASO 2-4 
2. Verificar que NO existan archivos .next o node_modules
3. Ejecutar: `npm install --force --legacy-peer-deps`
4. Reportar error específico

## 🎉 ESTADO ACTUAL:
- ✅ Archivos de configuración corregidos
- ✅ Duplicados eliminados  
- ✅ Scripts de limpieza creados
- ⏳ PENDIENTE: Ejecutar limpieza manual

**⚠️ EJECUTA ESTOS COMANDOS UNO POR UNO Y VERIFICA CADA RESULTADO** 