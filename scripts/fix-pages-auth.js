const fs = require('fs');
const path = require('path');

// Lista de archivos que necesitan arreglos
const filesToFix = [
  'app/page.tsx',
  'app/(dashboard)/(routes)/teacher/courses/[courseId]/pensum-topics/[topicId]/page.tsx',
  'app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/page.tsx',
  'app/(dashboard)/(routes)/teacher/courses/page.tsx',
  'app/(dashboard)/(routes)/student/page.tsx',
  'app/(dashboard)/(routes)/progress/page.tsx',
  'app/(dashboard)/(routes)/search/page.tsx',
  'app/(dashboard)/(routes)/page.tsx',
  'app/(dashboard)/(routes)/goals/page.tsx',
  'app/(dashboard)/(routes)/community/page.tsx',
  'app/(dashboard)/(routes)/certificates/page.tsx',
  'app/(dashboard)/(routes)/courses/[courseId]/page.tsx',
  'app/(dashboard)/(routes)/courses/[courseId]/chapters/[chapterId]/page.tsx'
];

function fixPageAuth(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // 1. Cambiar import de auth por currentUser
    if (content.includes('import { auth }') && content.includes('@clerk/nextjs/server')) {
      content = content.replace(
        /import\s*{\s*auth\s*}\s*from\s*["']@clerk\/nextjs\/server["'];?/g,
        'import { currentUser } from "@clerk/nextjs/server";'
      );
      modified = true;
      console.log(`✅ ${filePath}: Cambiado import de auth por currentUser`);
    }

    // 2. Cambiar const { userId } = await auth(); por const user = await currentUser();
    if (content.includes('const { userId } = await auth()')) {
      content = content.replace(
        /const\s*{\s*userId\s*}\s*=\s*await\s+auth\(\);?/g,
        'const user = await currentUser();'
      );
      modified = true;
      console.log(`✅ ${filePath}: Cambiado auth() por currentUser()`);
    }

    // 3. Cambiar !userId por !user
    if (content.includes('!userId')) {
      content = content.replace(/!userId/g, '!user');
      modified = true;
      console.log(`✅ ${filePath}: Cambiado !userId por !user`);
    }

    // 4. Cambiar userId por user.id en where clauses y otros usos
    content = content.replace(/userId(?=\s*[,}:\)])/g, 'user.id');

    // 5. Arreglar params para Next.js 15 en páginas con parámetros dinámicos
    if (filePath.includes('[') && filePath.includes(']')) {
      // Buscar interface de props
      const interfaceRegex = /interface\s+\w+Props\s*{\s*params:\s*{([^}]+)}\s*;?\s*}/g;
      const interfaceMatch = content.match(interfaceRegex);
      
      if (interfaceMatch) {
        interfaceMatch.forEach(match => {
          const promiseVersion = match.replace(
            /params:\s*{([^}]+)}/,
            'params: Promise<{$1}>'
          );
          content = content.replace(match, promiseVersion);
          modified = true;
          console.log(`✅ ${filePath}: Convertido params interface a Promise`);
        });
      }

      // Buscar destructuring de params y agregar await
      if (content.includes('params }') && !content.includes('await params')) {
        // Buscar patrones como const { courseId } = params;
        const paramsDestructRegex = /const\s*{\s*([^}]+)\s*}\s*=\s*params;/g;
        content = content.replace(paramsDestructRegex, 'const { $1 } = await params;');
        modified = true;
        console.log(`✅ ${filePath}: Agregado await a destructuring de params`);
      }
    }

    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ ${filePath}: Archivo actualizado exitosamente`);
    } else {
      console.log(`ℹ️ ${filePath}: No necesita cambios`);
    }

  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

console.log('🔧 Arreglando páginas con auth deprecado...\n');

filesToFix.forEach(fixPageAuth);

console.log('\n✅ Proceso completado!'); 