const fs = require('fs');
const path = require('path');

// Función para obtener todos los archivos route.ts
function getAllApiRoutes(dirPath) {
  const files = [];
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !['node_modules', '.next', '.git', 'dist'].includes(item)) {
        traverse(fullPath);
      } else if (stat.isFile() && item === 'route.ts') {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dirPath);
  return files;
}

// Función para arreglar params en routes API
function fixApiRouteParams(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Patrones específicos para API routes
    const apiPatterns = [
      // Función con params como segundo argumento
      {
        search: /{\s*params\s*}:\s*{\s*params:\s*{\s*([^}]+)\s*}\s*}/g,
        replace: '{ params }: { params: Promise<{ $1 }> }',
        description: 'Actualizar params en API route'
      }
    ];
    
    apiPatterns.forEach(({ search, replace, description }) => {
      if (search.test(content)) {
        content = content.replace(search, replace);
        modified = true;
        console.log(`✅ ${description} en: ${filePath}`);
      }
    });
    
    // Si se modificó, agregar await params al inicio de la función
    if (modified && !content.includes('await params')) {
      // Buscar funciones export async function
      const functionPattern = /(export async function \w+\s*\([^)]*\)\s*{\s*)(try\s*{)?/;
      if (functionPattern.test(content)) {
        content = content.replace(functionPattern, (match, beforeTry, tryBlock) => {
          if (tryBlock) {
            return `${beforeTry}${tryBlock}\n    const resolvedParams = await params;\n    const { `;
          } else {
            return `${beforeTry}const resolvedParams = await params;\n  const { `;
          }
        });
        
        // Reemplazar destructuring de params
        content = content.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*params;?/g, '$1 } = resolvedParams;');
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

console.log('🔧 Arreglando API routes para Next.js 15...\n');

// Obtener todos los archivos route.ts
const apiFiles = getAllApiRoutes('./app/api');

console.log(`📁 Encontrados ${apiFiles.length} archivos route.ts\n`);

// Arreglar cada archivo
apiFiles.forEach(file => {
  fixApiRouteParams(file);
});

console.log('\n✅ ¡Corrección de API routes completada!');
console.log('📝 Todos los params en API routes ahora son Promise<T>'); 