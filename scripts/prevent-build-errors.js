const fs = require('fs');
const path = require('path');

console.log('🛠️  Configurando proyecto para prevenir errores de build...\n');

// Función para crear/actualizar archivo gitignore
function updateGitignore() {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const additionalEntries = [
    '',
    '# Build error prevention',
    '.eslintcache',
    '*.tsbuildinfo',
    'tsconfig.tsbuildinfo',
    '',
    '# Vercel',
    '.vercel',
    '',
    '# Misc',
    '.DS_Store',
    'Thumbs.db',
  ];

  try {
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    let needsUpdate = false;
    additionalEntries.forEach(entry => {
      if (entry && !gitignoreContent.includes(entry)) {
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      gitignoreContent += '\n' + additionalEntries.join('\n');
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ .gitignore actualizado');
    } else {
      console.log('✅ .gitignore ya está configurado');
    }
  } catch (error) {
    console.log('⚠️  No se pudo actualizar .gitignore:', error.message);
  }
}

// Función para verificar y crear archivo de tipos globales
function ensureGlobalTypes() {
  const typesDir = path.join(process.cwd(), 'types');
  const globalTypesPath = path.join(typesDir, 'global.d.ts');

  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  if (!fs.existsSync(globalTypesPath)) {
    const globalTypesContent = `// Tipos globales para prevenir errores de build
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      UPLOADTHING_SECRET: string;
      UPLOADTHING_APP_ID: string;
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_GA_ID?: string;
      VERCEL?: string;
      VERCEL_ENV?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }

  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
    dataLayer?: any[];
  }
}

export {};
`;

    fs.writeFileSync(globalTypesPath, globalTypesContent);
    console.log('✅ Tipos globales creados en types/global.d.ts');
  } else {
    console.log('✅ Tipos globales ya existen');
  }
}

// Función para verificar configuración de TypeScript
function checkTsConfig() {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  
  if (!fs.existsSync(tsConfigPath)) {
    console.log('❌ tsconfig.json no encontrado');
    return;
  }

  try {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    
    // Verificar configuraciones importantes
    const requiredOptions = {
      'strict': true,
      'skipLibCheck': true,
      'forceConsistentCasingInFileNames': true,
      'incremental': true,
    };

    let needsUpdate = false;
    Object.entries(requiredOptions).forEach(([option, value]) => {
      if (tsConfig.compilerOptions[option] !== value) {
        tsConfig.compilerOptions[option] = value;
        needsUpdate = true;
      }
    });

    // Asegurar includes
    if (!tsConfig.include) {
      tsConfig.include = [];
      needsUpdate = true;
    }

    const requiredIncludes = [
      "next-env.d.ts",
      "types/**/*.ts",
      "**/*.ts", 
      "**/*.tsx"
    ];

    requiredIncludes.forEach(include => {
      if (!tsConfig.include.includes(include)) {
        tsConfig.include.push(include);
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      console.log('✅ tsconfig.json actualizado');
    } else {
      console.log('✅ tsconfig.json ya está configurado');
    }
  } catch (error) {
    console.log('⚠️  Error al verificar tsconfig.json:', error.message);
  }
}

// Función para crear hook seguro de cliente
function createSafeClientHook() {
  const hooksDir = path.join(process.cwd(), 'hooks');
  const hookPath = path.join(hooksDir, 'use-client-safe.ts');

  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookContent = `'use client'

import { useEffect, useState } from 'react'

/**
 * Hook seguro para verificar si estamos en el cliente
 * Previene errores de hidratación
 */
export function useClientSafe() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * HOC para componentes que necesitan ejecutarse solo en el cliente
 */
export function withClientOnly<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ClientOnlyComponent(props: P) {
    const isClient = useClientSafe()
    
    if (!isClient) {
      return null // o un placeholder/skeleton
    }
    
    return <Component {...props} />
  }
}
`;

  if (!fs.existsSync(hookPath)) {
    fs.writeFileSync(hookPath, hookContent);
    console.log('✅ Hook seguro creado en hooks/use-client-safe.ts');
  } else {
    console.log('✅ Hook seguro ya existe');
  }
}

// Función principal
function setupBuildErrorPrevention() {
  console.log('📋 Ejecutando configuraciones...\n');
  
  updateGitignore();
  ensureGlobalTypes();
  checkTsConfig();
  createSafeClientHook();
  
  console.log('\n✨ Configuración completada!\n');
  console.log('🔧 Pasos adicionales recomendados:');
  console.log('1. Ejecuta: npm install');
  console.log('2. Ejecuta: npm run lint:fix');
  console.log('3. Ejecuta: npm run build:safe');
  console.log('4. Si hay errores, ejecuta: npm run fix-all-errors');
  console.log('\n🚀 El proyecto está configurado para evitar errores de build en Vercel');
}

// Ejecutar configuración
setupBuildErrorPrevention(); 