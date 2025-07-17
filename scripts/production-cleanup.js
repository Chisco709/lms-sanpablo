#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 PREPARANDO CÓDIGO PARA PRODUCCIÓN...\n');

// Archivos que deben mantener logs específicos (sistemas críticos)
const KEEP_LOGS_IN = [
  'lib/db.ts',
  'app/api/health/route.ts',
  'lib/unlock-system.ts'
];

// Patrones de console.log a eliminar (pero mantener console.error para errores críticos)
const LOG_PATTERNS = [
  /console\.log\([^)]*\);?\s*$/gm,
  /console\.warn\([^)]*\);?\s*$/gm,
  // Mantener console.error pero solo en APIs, no en componentes
];

// Función para limpiar console.logs de un archivo
function cleanConsoleLogsFromFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return false;
    }

    // No limpiar archivos específicos que necesitan logs
    const shouldKeepLogs = KEEP_LOGS_IN.some(keepFile => 
      filePath.includes(keepFile.replace(/\\/g, '/'))
    );

    if (shouldKeepLogs) {
      console.log(`⚠️  Manteniendo logs en: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let cleaned = false;

    // Eliminar console.log y console.warn
    content = content.replace(/console\.log\([^)]*\);?\s*\n?/gm, '');
    content = content.replace(/console\.warn\([^)]*\);?\s*\n?/gm, '');
    
    // En componentes React, también eliminar console.error de desarrollo
    if (filePath.includes('app/(dashboard)') && !filePath.includes('api/')) {
      content = content.replace(/console\.error\([^)]*\);?\s*\n?/gm, '');
    }

    // Limpiar líneas vacías múltiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      cleaned = true;
      console.log(`✅ Limpiado: ${filePath}`);
    }

    return cleaned;
  } catch (error) {
    console.error(`❌ Error limpiando ${filePath}:`, error.message);
    return false;
  }
}

// Función para obtener todos los archivos TypeScript/JavaScript
function getAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Saltar directorios no importantes
          if (!item.startsWith('.') && 
              item !== 'node_modules' && 
              item !== 'dist' && 
              item !== 'scripts') {
            scanDirectory(fullPath);
          }
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(path.relative(process.cwd(), fullPath));
        }
      }
    } catch (error) {
      console.warn(`Advertencia: No se pudo leer directorio ${currentDir}`);
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Función principal de limpieza
async function runProductionCleanup() {
  try {
    console.log('🧹 Eliminando console.logs de desarrollo...\n');
    
    const files = getAllFiles('./app');
    const componentFiles = getAllFiles('./components');
    const allFiles = [...files, ...componentFiles];
    
    let cleanedCount = 0;
    
    for (const file of allFiles) {
      if (cleanConsoleLogsFromFile(file)) {
        cleanedCount++;
      }
    }
    
    console.log(`\n✅ Archivos limpiados: ${cleanedCount}`);
    console.log(`📁 Total archivos revisados: ${allFiles.length}`);
    
    // Crear configuración de producción
    console.log('\n🔧 Configurando para producción...');
    await createProductionConfig();
    
    console.log('\n🚀 ¡Código listo para producción!');
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('   1. npm run build');
    console.log('   2. Verificar que no hay errores');
    console.log('   3. npm run start (test local)');
    console.log('   4. Deploy a Vercel');
    
  } catch (error) {
    console.error('💥 Error en limpieza de producción:', error);
    process.exit(1);
  }
}

// Crear configuración optimizada para producción
async function createProductionConfig() {
  // Backup del config actual
  const configPath = './next.config.js';
  const backupPath = './next.config.js.backup';
  
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, backupPath);
    console.log('💾 Backup de next.config.js creado');
  }
  
  // Configuración optimizada para producción
  const productionConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // CONFIGURACIÓN DE PRODUCCIÓN SEGURA
  typescript: {
    // Solo permitir build si no hay errores críticos
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Verificar ESLint en build
    ignoreDuringBuilds: false,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https", 
        hostname: "uploadthing.com",
        pathname: "/**",
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600, // 1 hora cache
  },

  // Optimizaciones de producción
  poweredByHeader: false,
  compress: true,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Configuración para subida de archivos
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },

  // Optimizaciones experimentales estables
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },

  // Configuración de Webpack para producción
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Optimizaciones para producción
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;`;

  fs.writeFileSync(configPath, productionConfig);
  console.log('⚙️  next.config.js optimizado para producción');
}

// Ejecutar limpieza
runProductionCleanup().catch(console.error); 