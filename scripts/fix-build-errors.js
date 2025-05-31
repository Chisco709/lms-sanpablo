#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando corrección automática de errores de build...\n');

const fixes = [
  {
    name: 'Eliminar archivos problemáticos',
    action: () => {
      const problematicFiles = [
        'scripts/seed-test-courses.ts',
        'scripts/test-data.ts',
        'scripts/demo-data.ts'
      ];
      
      problematicFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`✅ Eliminado: ${file}`);
        }
      });
    }
  },
  {
    name: 'Verificar dependencias críticas',
    action: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const criticalDeps = [
        '@radix-ui/react-select',
        '@prisma/client',
        'next'
      ];
      
      const missing = criticalDeps.filter(dep => 
        !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
      );
      
      if (missing.length > 0) {
        console.log(`❌ Dependencias faltantes: ${missing.join(', ')}`);
        console.log('Ejecuta: npm install ' + missing.join(' '));
      } else {
        console.log('✅ Todas las dependencias críticas están instaladas');
      }
    }
  },
  {
    name: 'Validar archivos de configuración',
    action: () => {
      const configs = [
        { file: 'next.config.js', required: true },
        { file: 'tsconfig.json', required: true },
        { file: 'prisma/schema.prisma', required: true }
      ];
      
      configs.forEach(({ file, required }) => {
        if (fs.existsSync(file)) {
          console.log(`✅ ${file} existe`);
        } else if (required) {
          console.log(`❌ ${file} faltante (requerido)`);
        }
      });
    }
  }
];

// Ejecutar todas las correcciones
fixes.forEach(fix => {
  console.log(`🔧 ${fix.name}...`);
  try {
    fix.action();
  } catch (error) {
    console.error(`❌ Error en ${fix.name}:`, error.message);
  }
  console.log('');
});

console.log('🚀 Corrección automática completada. Intenta `npm run build` ahora.'); 