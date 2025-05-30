const fs = require('fs');
const path = require('path');

// Correcciones críticas específicas
const criticalFixes = [
  {
    file: 'app/(dashboard)/(routes)/search/_components/categories.tsx',
    fixes: [
      {
        search: 'FcGears',
        replace: 'FcMechanics',
        description: 'Reemplazar FcGears inexistente por FcMechanics'
      },
      {
        search: "import {\n  FcAutomotive,\n  FcBusiness,\n  FcElectronics,\n  FcEngineering,\n  FcFilmReel,\n  FcGears,\n  FcMultipleDevices,\n  FcMusic,\n  FcOldTimeCamera,\n  FcSalesPerformance,\n  FcSportsMode,\n} from 'react-icons/fc';",
        replace: "import {\n  FcAutomotive,\n  FcBusiness,\n  FcElectronics,\n  FcEngineering,\n  FcFilmReel,\n  FcMechanics,\n  FcMultipleDevices,\n  FcMusic,\n  FcOldTimeCamera,\n  FcSalesPerformance,\n  FcSportsMode,\n} from 'react-icons/fc';",
        description: 'Actualizar import para usar FcMechanics'
      }
    ]
  }
];

// Correcciones de Clerk en múltiples archivos
const clerkFiles = [
  'app/api/programs/[programId]/enroll/route.ts',
  'app/api/programs/route.ts'
];

clerkFiles.forEach(filePath => {
  criticalFixes.push({
    file: filePath,
    fixes: [
      {
        search: "import { auth } from '@clerk/nextjs';",
        replace: "import { currentUser } from '@clerk/nextjs';",
        description: 'Actualizar import de Clerk'
      },
      {
        search: "const { userId } = auth();",
        replace: "const user = await currentUser();\n  const userId = user?.id;\n  \n  if (!userId) {\n    return new NextResponse('Unauthorized', { status: 401 });\n  }",
        description: 'Actualizar uso de auth() a currentUser()'
      }
    ]
  });
});

// Función para aplicar correcciones a un archivo específico
function applyFixesToFile(filePath, fixes) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ Archivo no encontrado: ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    fixes.forEach(({ search, replace, description }) => {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        modified = true;
        console.log(`✅ ${description} en: ${filePath}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`💾 Archivo actualizado: ${filePath}\n`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

console.log('🚨 Aplicando correcciones críticas...\n');

criticalFixes.forEach(({ file, fixes }) => {
  applyFixesToFile(file, fixes);
});

console.log('✅ ¡Correcciones críticas aplicadas!'); 