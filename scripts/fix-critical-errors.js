#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚨 SOLUCIONANDO ERRORES CRÍTICOS...\n');

// 1. Limpiar cache corrupto
console.log('🧹 Limpiando cache corrupto...');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('✅ Eliminado .next');
  }
  
  if (fs.existsSync('node_modules/.cache')) {
    fs.rmSync('node_modules/.cache', { recursive: true, force: true });
    console.log('✅ Eliminado cache de node_modules');
  }
  
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache de npm limpiado');
} catch (error) {
  console.log('⚠️ Error limpiando cache:', error.message);
}

// 2. Regenerar Prisma
console.log('\n🔄 Regenerando Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client regenerado');
} catch (error) {
  console.log('⚠️ Error regenerando Prisma:', error.message);
}

// 3. Verificar dependencias críticas
console.log('\n📦 Verificando dependencias críticas...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const criticalDeps = [
  '@clerk/nextjs',
  'next',
  'react',
  'react-dom',
  '@prisma/client',
  'prisma'
];

const missingDeps = criticalDeps.filter(dep => 
  !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
);

if (missingDeps.length > 0) {
  console.log('⚠️ Dependencias faltantes:', missingDeps);
  try {
    execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas');
  } catch (error) {
    console.log('❌ Error instalando dependencias:', error.message);
  }
} else {
  console.log('✅ Todas las dependencias críticas están presentes');
}

// 4. Verificar archivos de configuración
console.log('\n⚙️ Verificando configuraciones...');

// Verificar next.config.js
if (!fs.existsSync('next.config.js')) {
  console.log('⚠️ next.config.js no encontrado, creando...');
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      }
    ]
  }
};

module.exports = nextConfig;`;
  fs.writeFileSync('next.config.js', nextConfig);
  console.log('✅ next.config.js creado');
}

// Verificar middleware.ts
if (!fs.existsSync('middleware.ts')) {
  console.log('⚠️ middleware.ts no encontrado, creando...');
  const middleware = `import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};`;
  fs.writeFileSync('middleware.ts', middleware);
  console.log('✅ middleware.ts creado');
}

console.log('\n🎉 ERRORES CRÍTICOS SOLUCIONADOS!');
console.log('📝 Ejecuta: npm run dev para iniciar el servidor'); 