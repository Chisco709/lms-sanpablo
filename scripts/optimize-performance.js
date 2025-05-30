#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando optimización de rendimiento...\n');

// 1. Limpiar caché y dependencias
console.log('🧹 Limpiando caché y regenerando dependencias...');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('✅ Eliminado .next');
  }
  
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
    console.log('✅ Eliminado node_modules');
  }
  
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('✅ Eliminado package-lock.json');
  }
  
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache NPM limpiado');
  
} catch (error) {
  console.error('❌ Error limpiando:', error.message);
}

// 2. Regenerar Prisma
console.log('\n🗄️ Regenerando Prisma Client...');
try {
  execSync('npx prisma generate --no-engine', { stdio: 'inherit' });
  console.log('✅ Prisma Client regenerado');
} catch (error) {
  console.error('❌ Error con Prisma:', error.message);
}

// 3. Reinstalar dependencias
console.log('\n📦 Reinstalando dependencias...');
try {
  execSync('npm install --force', { stdio: 'inherit' });
  console.log('✅ Dependencias instaladas');
} catch (error) {
  console.error('❌ Error instalando:', error.message);
}

// 4. Optimizar package.json
console.log('\n⚙️ Optimizando configuración...');
try {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Agregar scripts de optimización
  packageData.scripts = {
    ...packageData.scripts,
    "dev:fast": "next dev --turbo",
    "build:analyze": "ANALYZE=true next build",
    "optimize": "node scripts/optimize-performance.js",
    "clean": "rm -rf .next && rm -rf node_modules && rm -f package-lock.json"
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
  console.log('✅ Scripts optimizados agregados');
  
} catch (error) {
  console.error('❌ Error optimizando package.json:', error.message);
}

// 5. Crear archivo de variables de entorno optimizado
console.log('\n🌍 Verificando variables de entorno...');
try {
  const envPath = path.join(process.cwd(), '.env.example');
  const envContent = `# Variables de entorno para desarrollo
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Database
DATABASE_URL="your_database_url_here"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Upload Thing
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"

# Mux (para videos)
MUX_TOKEN_ID="your_mux_token_id"
MUX_TOKEN_SECRET="your_mux_token_secret"

# Stripe (opcional para pagos)
STRIPE_API_KEY="your_stripe_api_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`;
  
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env.example', envContent);
    console.log('✅ Archivo .env.example creado');
  }
  
} catch (error) {
  console.error('❌ Error con variables de entorno:', error.message);
}

console.log('\n🎉 Optimización completada!');
console.log('\n📝 Próximos pasos:');
console.log('1. Configura tu archivo .env con las variables correctas');
console.log('2. Ejecuta: npm run dev');
console.log('3. Para desarrollo rápido usa: npm run dev:fast');
console.log('\n💡 Consejos de rendimiento:');
console.log('- Usa lazy loading para componentes pesados');
console.log('- Implementa memorización con useMemo y useCallback');
console.log('- Optimiza imágenes con next/image');
console.log('- Reduce re-renders innecesarios'); 