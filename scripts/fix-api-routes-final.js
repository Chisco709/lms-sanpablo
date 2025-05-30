const fs = require('fs');
const path = require('path');

// Lista de archivos que necesitan arreglos
const filesToFix = [
  'app/api/programs/[programId]/enroll/route.ts',
  'app/api/courses/[courseId]/students/[studentId]/route.ts',
  'app/api/courses/[courseId]/students/route.ts',
  'app/api/courses/[courseId]/checkout/route.ts',
  'app/api/courses/[courseId]/chapters/route.ts',
  'app/api/courses/[courseId]/chapters/reorder/route.ts',
  'app/api/courses/[courseId]/attachments/[attachmentId]/route.ts',
  'app/api/courses/[courseId]/attachments/route.ts'
];

function fixApiRoute(filePath) {
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
        /import\s*{\s*auth\s*}\s*from\s*["']@clerk\/nextjs\/server["']/g,
        'import { currentUser } from "@clerk/nextjs/server"'
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

    // 4. Cambiar userId por user.id en where clauses
    content = content.replace(/userId(?=\s*[,}])/g, 'user.id');

    // 5. Arreglar params para Next.js 15
    // Buscar patrones como { params }: { params: { courseId: string } }
    const paramsRegex = /{\s*params\s*}:\s*{\s*params:\s*{([^}]+)}\s*}/g;
    const matches = content.match(paramsRegex);
    
    if (matches) {
      matches.forEach(match => {
        const promiseVersion = match.replace(
          /{\s*params\s*}:\s*{\s*params:\s*({[^}]+})\s*}/,
          '{ params }: { params: Promise<$1> }'
        );
        content = content.replace(match, promiseVersion);
        modified = true;
        console.log(`✅ ${filePath}: Convertido params a Promise`);
      });

      // Agregar await params al inicio de la función
      if (!content.includes('await params')) {
        // Buscar el primer uso de params.algo y agregar destructuring
        const paramUsageRegex = /params\.(\w+)/;
        const paramMatch = content.match(paramUsageRegex);
        
        if (paramMatch) {
          // Extraer todos los parámetros usados
          const allParamMatches = content.match(/params\.(\w+)/g);
          const paramNames = [...new Set(allParamMatches.map(m => m.replace('params.', '')))];
          
          const destructuring = `const { ${paramNames.join(', ')} } = await params;`;
          
          // Insertar después de la declaración de user
          content = content.replace(
            /(const user = await currentUser\(\);)/,
            `$1\n    ${destructuring}`
          );
          
          // Reemplazar todos los params.algo por solo algo
          paramNames.forEach(param => {
            content = content.replace(new RegExp(`params\\.${param}`, 'g'), param);
          });
          
          modified = true;
          console.log(`✅ ${filePath}: Agregado destructuring de params`);
        }
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

console.log('🔧 Arreglando API routes para Next.js 15...\n');

filesToFix.forEach(fixApiRoute);

console.log('\n✅ Proceso completado!'); 