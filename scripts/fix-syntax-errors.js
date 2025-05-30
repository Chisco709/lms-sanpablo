const fs = require('fs');
const path = require('path');

// Lista de archivos que tienen errores de sintaxis
const filesToFix = [
  'app/api/programs/[programId]/enroll/route.ts',
  'app/api/courses/[courseId]/students/[studentId]/route.ts',
  'app/api/courses/[courseId]/students/route.ts',
  'app/api/courses/[courseId]/chapters/route.ts',
  'app/api/courses/[courseId]/chapters/reorder/route.ts',
  'app/api/courses/[courseId]/attachments/[attachmentId]/route.ts',
  'app/api/courses/[courseId]/attachments/route.ts'
];

function fixSyntaxErrors(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // 1. Arreglar user.id, en objetos donde debería ser userId: user.id
    // Buscar patrones como { user.id, } o { user.id } y cambiarlos por { userId: user.id, }
    const userIdRegex = /{\s*user\.id\s*,/g;
    if (content.match(userIdRegex)) {
      content = content.replace(userIdRegex, '{ userId: user.id,');
      modified = true;
      console.log(`✅ ${filePath}: Arreglado user.id, por userId: user.id,`);
    }

    // 2. Arreglar user.id al final de objetos
    const userIdEndRegex = /{\s*([^}]*),\s*user\.id\s*}/g;
    if (content.match(userIdEndRegex)) {
      content = content.replace(userIdEndRegex, '{ $1, userId: user.id }');
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

    // 4. Arreglar data: { user.id, ... }
    const dataUserIdRegex = /data:\s*{\s*user\.id\s*,/g;
    if (content.match(dataUserIdRegex)) {
      content = content.replace(dataUserIdRegex, 'data: { userId: user.id,');
      modified = true;
      console.log(`✅ ${filePath}: Arreglado data: { user.id,`);
    }

    // 5. Arreglar where: { user.id }
    const whereUserIdRegex = /where:\s*{\s*user\.id\s*}/g;
    if (content.match(whereUserIdRegex)) {
      content = content.replace(whereUserIdRegex, 'where: { userId: user.id }');
      modified = true;
      console.log(`✅ ${filePath}: Arreglado where: { user.id }`);
    }

    // 6. Arreglar params destructuring que falta await
    if (!content.includes('await params') && content.includes('const { ') && content.includes('} = params')) {
      // Buscar líneas como const { programId } = params;
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

console.log('🔧 Arreglando errores de sintaxis...\n');

filesToFix.forEach(fixSyntaxErrors);

console.log('\n✅ Proceso completado!'); 