const fs = require('fs');
const path = require('path');

// Lista de archivos que tienen errores de sintaxis
const filesToFix = [
  'app/(dashboard)/(routes)/courses/[courseId]/chapters/[chapterId]/page.tsx',
  'app/(dashboard)/(routes)/courses/[courseId]/page.tsx',
  'app/(dashboard)/(routes)/search/page.tsx',
  'app/(dashboard)/(routes)/student/page.tsx',
  'app/(dashboard)/(routes)/teacher/courses/[courseId]/pensum-topics/[topicId]/page.tsx'
];

function fixPageSyntax(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // 1. Arreglar user.id, en objetos donde debería ser userId: user.id
    const userIdRegex = /{\s*user\.id\s*,/g;
    if (content.match(userIdRegex)) {
      content = content.replace(userIdRegex, '{ userId: user.id,');
      modified = true;
      console.log(`✅ ${filePath}: Arreglado user.id, por userId: user.id,`);
    }

    // 2. Arreglar user.id al final de objetos
    const userIdEndRegex = /,\s*user\.id\s*}/g;
    if (content.match(userIdEndRegex)) {
      content = content.replace(userIdEndRegex, ', userId: user.id }');
      modified = true;
      console.log(`✅ ${filePath}: Arreglado user.id al final de objeto`);
    }

    // 3. Arreglar user.id solo en objetos
    const userIdSoloRegex = /{\s*user\.id\s*}/g;
    if (content.match(userIdSoloRegex)) {
      content = content.replace(userIdSoloRegex, '{ userId: user.id }');
      modified = true;
      console.log(`✅ ${filePath}: Arreglado user.id solo en objeto`);
    }

    // 4. Arreglar where: { user.id }
    const whereUserIdRegex = /where:\s*{\s*user\.id\s*}/g;
    if (content.match(whereUserIdRegex)) {
      content = content.replace(whereUserIdRegex, 'where: { userId: user.id }');
      modified = true;
      console.log(`✅ ${filePath}: Arreglado where: { user.id }`);
    }

    // 5. Arreglar user.id: user.id (duplicado incorrecto)
    const duplicateUserIdRegex = /user\.id:\s*user\.id/g;
    if (content.match(duplicateUserIdRegex)) {
      content = content.replace(duplicateUserIdRegex, 'userId: user.id');
      modified = true;
      console.log(`✅ ${filePath}: Arreglado user.id: user.id duplicado`);
    }

    // 6. Arreglar params destructuring que falta await
    if (!content.includes('await params') && content.includes('const { ') && content.includes('} = params')) {
      const paramsDestructRegex = /const\s*{\s*([^}]+)\s*}\s*=\s*params;/g;
      content = content.replace(paramsDestructRegex, 'const { $1 } = await params;');
      modified = true;
      console.log(`✅ ${filePath}: Agregado await a destructuring de params`);
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

console.log('🔧 Arreglando errores de sintaxis en páginas...\n');

filesToFix.forEach(fixPageSyntax);

console.log('\n✅ Proceso completado!'); 