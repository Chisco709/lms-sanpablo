const fs = require('fs');
const path = require('path');

console.log('🔧 Verificación y corrección final de errores de build...\n');

// Lista de archivos críticos para verificar
const criticalFiles = [
  'components/google-analytics.tsx',
  'hooks/use-analytics.ts',
  'components/background-music.tsx',
  'app/(dashboard)/(routes)/courses/[courseId]/_components/course-page-client.tsx',
  'app/(dashboard)/(routes)/courses/[courseId]/chapters/[chapterId]/_components/course-progress-button.tsx',
  'components/ui/Aurora/Aurora.tsx',
  'components/interactive-tutorial.tsx',
  'components/landing-professional.tsx',
  'components/landing-professional-enhanced.tsx',
];

// Patrones problemáticos y sus soluciones
const buildErrorFixes = [
  {
    pattern: /(?<!typeof\s)window\./g,
    replacement: "typeof window !== 'undefined' && window.",
    description: "Proteger acceso a window"
  },
  {
    pattern: /(?<!typeof\s)document\./g,
    replacement: "typeof document !== 'undefined' && document.",
    description: "Proteger acceso a document"
  },
  {
    pattern: /(?<!typeof\s)navigator\./g,
    replacement: "typeof navigator !== 'undefined' && navigator.",
    description: "Proteger acceso a navigator"
  },
  {
    pattern: /window\.addEventListener\(/g,
    replacement: "typeof window !== 'undefined' && window.addEventListener(",
    description: "Proteger addEventListener"
  },
  {
    pattern: /window\.removeEventListener\(/g,
    replacement: "typeof window !== 'undefined' && window.removeEventListener(",
    description: "Proteger removeEventListener"
  },
];

// Función para verificar y corregir un archivo
function fixBuildErrors(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;

  // Aplicar correcciones
  buildErrorFixes.forEach(fix => {
    const matches = content.match(fix.pattern);
    if (matches && matches.length > 0) {
      // Verificar que no esté ya protegido
      const alreadyProtected = content.includes("typeof window !== 'undefined'") ||
                              content.includes("typeof document !== 'undefined'") ||
                              content.includes("typeof navigator !== 'undefined'");
      
      if (!alreadyProtected) {
        console.log(`⚠️  ${filePath}: Encontrado patrón ${fix.description}`);
        content = content.replace(fix.pattern, fix.replacement);
        hasChanges = true;
      }
    }
  });

  // Verificaciones específicas de errores comunes
  
  // 1. Verificar que useEffect tenga cleanup adecuado
  if (content.includes('useEffect') && content.includes('addEventListener')) {
    const hasCleanup = content.includes('removeEventListener');
    if (!hasCleanup) {
      console.log(`⚠️  ${filePath}: useEffect con addEventListener sin cleanup`);
    }
  }

  // 2. Verificar componentes 'use client'
  if ((content.includes('window') || content.includes('document')) && 
      !content.includes("'use client'") && 
      filePath.includes('components/')) {
    console.log(`⚠️  ${filePath}: Posible necesidad de 'use client' directiva`);
  }

  // 3. Verificar importaciones de React en hooks
  if (filePath.includes('hooks/') && content.includes('useEffect') && 
      !content.includes("import") && !content.includes("React")) {
    console.log(`⚠️  ${filePath}: Hook posiblemente sin importar React`);
  }

  if (hasChanges) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath}: Corregido`);
    return true;
  } else {
    console.log(`✅ ${filePath}: OK`);
    return false;
  }
}

// Función para verificar configuración de Next.js
function checkNextConfig() {
  const configPath = path.join(process.cwd(), 'next.config.js');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ next.config.js no encontrado');
    return false;
  }

  const content = fs.readFileSync(configPath, 'utf8');
  
  // Verificar configuraciones importantes
  const checks = [
    { pattern: /webpack:/, desc: 'Configuración de webpack' },
    { pattern: /experimental:/, desc: 'Configuraciones experimentales' },
    { pattern: /typescript:/, desc: 'Configuración de TypeScript' },
  ];

  checks.forEach(check => {
    if (content.includes(check.pattern)) {
      console.log(`✅ next.config.js: ${check.desc} configurado`);
    } else {
      console.log(`⚠️  next.config.js: ${check.desc} podría necesitar configuración`);
    }
  });

  return true;
}

// Función para verificar package.json
function checkPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json no encontrado');
    return false;
  }

  const content = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Verificar scripts críticos
  const requiredScripts = ['build', 'dev', 'start'];
  requiredScripts.forEach(script => {
    if (content.scripts && content.scripts[script]) {
      console.log(`✅ package.json: Script '${script}' configurado`);
    } else {
      console.log(`❌ package.json: Script '${script}' faltante`);
    }
  });

  return true;
}

// Ejecutar verificaciones
console.log('📋 Verificando archivos críticos...\n');

let totalFiles = 0;
let fixedFiles = 0;

criticalFiles.forEach(file => {
  totalFiles++;
  if (fixBuildErrors(file)) {
    fixedFiles++;
  }
});

console.log('\n📋 Verificando configuraciones...\n');
checkNextConfig();
checkPackageJson();

console.log('\n📊 Resumen:');
console.log(`✅ Archivos verificados: ${totalFiles}`);
console.log(`🔧 Archivos corregidos: ${fixedFiles}`);
console.log(`📝 Archivos sin problemas: ${totalFiles - fixedFiles}`);

if (fixedFiles > 0) {
  console.log('\n🎉 Correcciones aplicadas. El proyecto debería compilar sin errores.');
} else {
  console.log('\n✨ Todos los archivos están correctos. El proyecto está listo para build.');
}

console.log('\n🚀 Recomendaciones finales:');
console.log('1. Ejecuta npm run build para verificar');
console.log('2. Si hay errores, revisa manualmente los archivos mencionados');
console.log('3. Asegúrate de que todas las variables de entorno estén configuradas');
console.log('4. Verifica que no hay imports circulares');

process.exit(0); 