#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔍 Iniciando Auditoría SEO del Instituto San Pablo LMS...\n')

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m', 
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

const audit = {
  passed: 0,
  failed: 0,
  warnings: 0,
  results: []
}

function checkFile(filepath, description) {
  const exists = fs.existsSync(filepath)
  const status = exists ? 'PASS' : 'FAIL'
  const color = exists ? 'green' : 'red'
  
  log(color, `${status}: ${description}`)
  
  if (exists) {
    audit.passed++
  } else {
    audit.failed++
  }
  
  audit.results.push({ file: filepath, status, description })
  return exists
}

function checkContent(filepath, searchText, description) {
  try {
    const content = fs.readFileSync(filepath, 'utf8')
    const found = content.includes(searchText)
    const status = found ? 'PASS' : 'FAIL'
    const color = found ? 'green' : 'red'
    
    log(color, `${status}: ${description}`)
    
    if (found) {
      audit.passed++
    } else {
      audit.failed++
    }
    
    return found
  } catch (error) {
    log('red', `FAIL: ${description} (archivo no encontrado)`)
    audit.failed++
    return false
  }
}

function analyzeMetadata(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8')
    
    // Verificar metadatos básicos
    const hasTitle = content.includes('title:')
    const hasDescription = content.includes('description:')
    const hasKeywords = content.includes('keywords:')
    const hasOpenGraph = content.includes('openGraph:')
    
    log(hasTitle ? 'green' : 'red', `${hasTitle ? 'PASS' : 'FAIL'}: Título SEO definido`)
    log(hasDescription ? 'green' : 'red', `${hasDescription ? 'PASS' : 'FAIL'}: Meta descripción definida`)
    log(hasKeywords ? 'green' : 'red', `${hasKeywords ? 'PASS' : 'FAIL'}: Keywords definidas`)
    log(hasOpenGraph ? 'green' : 'red', `${hasOpenGraph ? 'PASS' : 'FAIL'}: Open Graph configurado`)
    
    if (hasTitle) audit.passed++; else audit.failed++
    if (hasDescription) audit.passed++; else audit.failed++
    if (hasKeywords) audit.passed++; else audit.failed++
    if (hasOpenGraph) audit.passed++; else audit.failed++
    
  } catch (error) {
    log('red', 'FAIL: No se pudo analizar metadatos')
    audit.failed += 4
  }
}

// Verificaciones principales
log('blue', '=== VERIFICACIÓN DE ARCHIVOS SEO ===')

checkFile('app/sitemap.ts', 'Sitemap dinámico configurado')
checkFile('app/robots.ts', 'Robots.txt configurado')
checkFile('app/manifest.json', 'Manifest PWA configurado')
checkFile('next.config.js', 'Next.js config optimizado')
checkFile('vercel.json', 'Vercel config optimizado')

log('blue', '\n=== VERIFICACIÓN DE METADATOS ===')
analyzeMetadata('app/layout.tsx')

log('blue', '\n=== VERIFICACIÓN DE COMPONENTES SEO ===')
checkFile('components/seo-optimizer.tsx', 'Componente SEO reutilizable')

log('blue', '\n=== VERIFICACIÓN DE CONFIGURACIONES ===')
checkContent('next.config.js', 'compress: true', 'Compresión habilitada')
checkContent('next.config.js', 'poweredByHeader: false', 'Header X-Powered-By oculto')
checkContent('next.config.js', 'swcMinify: true', 'Minificación SWC habilitada')
checkContent('vercel.json', 'Cache-Control', 'Headers de cache configurados')

log('blue', '\n=== VERIFICACIÓN DE IMAGES ===')
checkContent('next.config.js', 'formats:', 'Formatos de imagen optimizados (WebP/AVIF)')
checkContent('next.config.js', 'deviceSizes:', 'Tamaños de dispositivo configurados')

log('blue', '\n=== VERIFICACIÓN DE ESTRUCTURA ===')
checkContent('app/layout.tsx', 'structured data', 'Structured Data implementado')
checkContent('app/layout.tsx', 'preconnect', 'Preconnections configuradas')
checkContent('app/layout.tsx', 'lang="es-CO"', 'Idioma español Colombia configurado')

log('blue', '\n=== VERIFICACIÓN DE RENDIMIENTO ===')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const hasWebVitals = packageJson.dependencies['web-vitals'] || packageJson.devDependencies['web-vitals']
log(hasWebVitals ? 'green' : 'yellow', `${hasWebVitals ? 'PASS' : 'WARN'}: Web Vitals instalado`)

if (hasWebVitals) audit.passed++; else audit.warnings++

// Verificar scripts de optimización
log('blue', '\n=== SCRIPTS DE OPTIMIZACIÓN ===')
const scripts = packageJson.scripts || {}
const hasOptimize = scripts.optimize
const hasBuildAnalyze = scripts['build:analyze']

log(hasOptimize ? 'green' : 'yellow', `${hasOptimize ? 'PASS' : 'WARN'}: Script de optimización disponible`)
log(hasBuildAnalyze ? 'green' : 'yellow', `${hasBuildAnalyze ? 'PASS' : 'WARN'}: Análisis de bundle disponible`)

if (hasOptimize) audit.passed++; else audit.warnings++
if (hasBuildAnalyze) audit.passed++; else audit.warnings++

// Resumen final
log('blue', '\n' + '='.repeat(50))
log('bold', '📊 RESUMEN DE AUDITORÍA SEO')
log('blue', '='.repeat(50))

log('green', `✅ Verificaciones pasadas: ${audit.passed}`)
log('red', `❌ Verificaciones fallidas: ${audit.failed}`)
log('yellow', `⚠️  Advertencias: ${audit.warnings}`)

const total = audit.passed + audit.failed + audit.warnings
const score = Math.round((audit.passed / total) * 100)

log('bold', `\n🎯 PUNTUACIÓN SEO: ${score}%`)

if (score >= 90) {
  log('green', '🏆 ¡Excelente! Tu LMS está muy bien optimizado para SEO')
} else if (score >= 75) {
  log('yellow', '👍 Bien! Hay algunas mejoras menores que puedes implementar')
} else if (score >= 60) {
  log('yellow', '⚠️  Regular. Se necesitan más optimizaciones SEO')
} else {
  log('red', '🚨 Crítico. El SEO necesita mejoras importantes')
}

// Recomendaciones
log('blue', '\n=== PRÓXIMOS PASOS RECOMENDADOS ===')
log('blue', '1. 📈 Configura Google Analytics y Search Console')
log('blue', '2. 🖼️  Genera imágenes OG específicas para cada página')
log('blue', '3. 📝 Implementa metadatos dinámicos en páginas de cursos')
log('blue', '4. 🔗 Construye enlaces internos inteligentes')
log('blue', '5. 📱 Prueba la experiencia PWA en dispositivos móviles')
log('blue', '6. ⚡ Monitorea Core Web Vitals con Vercel Analytics')

console.log('\n✨ Auditoría completada. ¡Instituto San Pablo hacia el éxito digital!')

// Guardar reporte
const report = {
  timestamp: new Date().toISOString(),
  score,
  audit: audit.results,
  summary: {
    passed: audit.passed,
    failed: audit.failed,
    warnings: audit.warnings,
    total
  }
}

fs.writeFileSync('seo-audit-report.json', JSON.stringify(report, null, 2))
log('blue', '\n📄 Reporte guardado en: seo-audit-report.json') 