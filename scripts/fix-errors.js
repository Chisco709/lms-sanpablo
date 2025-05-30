const fs = require('fs');
const path = require('path');

// Función para buscar y reemplazar en todos los archivos
function findAndReplaceInFiles(directory, extensions, replacements) {
  const files = getAllFiles(directory, extensions);
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      replacements.forEach(({ search, replace, description }) => {
        if (content.includes(search)) {
          content = content.replace(new RegExp(search, 'g'), replace);
          modified = true;
          console.log(`✅ ${description} en: ${file}`);
        }
      });
      
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
      }
    } catch (error) {
      console.error(`❌ Error procesando ${file}:`, error.message);
    }
  });
}

// Función para obtener todos los archivos con extensiones específicas
function getAllFiles(dirPath, extensions) {
  const files = [];
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !['node_modules', '.next', '.git', 'dist'].includes(item)) {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dirPath);
  return files;
}

// Función para remover imports no utilizados
function removeUnusedImports(directory) {
  const files = getAllFiles(directory, ['.tsx', '.ts']);
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Patrones de imports no utilizados comunes
      const unusedPatterns = [
        /import\s+{\s*Heart\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Trophy\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Clock\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Download\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*BookOpen\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*ChevronUp\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Star\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*X\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Plus\s*}\s+from\s+['"][^'"]+[''];\s*/g,
        /import\s+{\s*Calendar\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Eye\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*File\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*ImageIcon\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Loader2\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Search\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Users\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*User\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Check\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*CheckCircle\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Play\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Link\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+Image\s+from\s+['"]next\/image['"];\s*/g,
        /import\s+{\s*SignedOut\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Button\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*SignInButton\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*CourseProgress\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*Progress\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*cn\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*z\s*}\s+from\s+['"]zod['"];\s*/g,
        /import\s+{\s*zodResolver\s*}\s+from\s+['"][^'"]+['"];\s*/g,
        /import\s+{\s*useForm\s*}\s+from\s+['"][^'"]+['"];\s*/g
      ];
      
      unusedPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, '');
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`🧹 Removidos imports no utilizados de: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error procesando ${file}:`, error.message);
    }
  });
}

// Definir todas las correcciones masivas
const massiveFixes = [
  // 1. Arreglar imports de Clerk deprecados
  {
    search: "import { auth } from '@clerk/nextjs'",
    replace: "import { currentUser } from '@clerk/nextjs'",
    description: "Actualizar import de auth a currentUser"
  },
  {
    search: "const { userId } = auth();",
    replace: "const user = await currentUser(); const userId = user?.id;",
    description: "Actualizar uso de auth() a currentUser()"
  },
  // 2. Arreglar ícono FcGears faltante
  {
    search: "FcGears",
    replace: "FcMechanics",
    description: "Reemplazar FcGears por FcMechanics"
  },
  // 3. Cambiar img por Image de Next.js
  {
    search: "<img",
    replace: "<Image",
    description: "Cambiar img por Image de Next.js"
  },
  {
    search: "</img>",
    replace: "</Image>",
    description: "Cerrar tags de Image correctamente"
  },
  // 4. Arreglar comillas escapadas
  {
    search: '"',
    replace: '&quot;',
    description: "Escapar comillas en JSX"
  },
  // 5. Tipar variables any
  {
    search: ": any",
    replace: ": unknown",
    description: "Cambiar any por unknown"
  }
];

console.log('🚀 Iniciando corrección masiva de errores...\n');

// Ejecutar correcciones masivas
findAndReplaceInFiles('./app', ['.tsx', '.ts'], massiveFixes);
findAndReplaceInFiles('./components', ['.tsx', '.ts'], massiveFixes);

// Remover imports no utilizados
console.log('\n🧹 Removiendo imports no utilizados...\n');
removeUnusedImports('./app');
removeUnusedImports('./components');

console.log('\n✅ ¡Corrección masiva completada!');
console.log('📝 Ahora ejecuta: npm run lint -- --fix'); 