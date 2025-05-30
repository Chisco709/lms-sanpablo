const fs = require('fs');
const path = require('path');

// Función para obtener todos los archivos page.tsx
function getAllPageFiles(dirPath) {
  const files = [];
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !['node_modules', '.next', '.git', 'dist'].includes(item)) {
        traverse(fullPath);
      } else if (stat.isFile() && item === 'page.tsx') {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dirPath);
  return files;
}

// Función para arreglar params async en un archivo
function fixParamsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Patrones para encontrar y reemplazar params
    const patterns = [
      // Params con un parámetro
      {
        regex: /params:\s*{\s*(\w+):\s*string\s*}/g,
        replacement: 'params: Promise<{ $1: string }>'
      },
      // Params con dos parámetros
      {
        regex: /params:\s*{\s*(\w+):\s*string;\s*(\w+):\s*string\s*}/g,
        replacement: 'params: Promise<{ $1: string; $2: string }>'
      },
      // Params con tres parámetros
      {
        regex: /params:\s*{\s*(\w+):\s*string;\s*(\w+):\s*string;\s*(\w+):\s*string\s*}/g,
        replacement: 'params: Promise<{ $1: string; $2: string; $3: string }>'
      },
      // Params genérico cualquier cantidad
      {
        regex: /params:\s*{\s*([^}]+)\s*}/g,
        replacement: (match, paramsList) => {
          if (paramsList.includes('Promise<')) return match; // Ya está arreglado
          return `params: Promise<{ ${paramsList} }>`;
        }
      }
    ];
    
    patterns.forEach(({ regex, replacement }) => {
      if (typeof replacement === 'function') {
        content = content.replace(regex, replacement);
      } else if (regex.test(content)) {
        content = content.replace(regex, replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Params actualizados en: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

console.log('🔧 Arreglando params de Next.js 15...\n');

// Obtener todos los archivos page.tsx
const pageFiles = getAllPageFiles('./app');

console.log(`📁 Encontrados ${pageFiles.length} archivos page.tsx\n`);

// Arreglar cada archivo
pageFiles.forEach(file => {
  fixParamsInFile(file);
});

console.log('\n✅ ¡Corrección de params completada!');
console.log('📝 Todos los params ahora son Promise<T> para Next.js 15'); 