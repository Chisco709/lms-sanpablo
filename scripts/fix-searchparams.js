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

// Función para arreglar searchParams async en un archivo
function fixSearchParamsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Buscar y reemplazar searchParams que no sean Promise
    if (content.includes('searchParams:') && !content.includes('searchParams: Promise<')) {
      // Patrón para encontrar definiciones de searchParams
      const searchParamsPattern = /searchParams:\s*{\s*([^}]+)\s*}/g;
      
      content = content.replace(searchParamsPattern, (match, params) => {
        modified = true;
        return `searchParams: Promise<{ ${params} }>`;
      });
      
      // Si hay uso de searchParams directamente, necesitamos await
      if (content.includes('...searchParams') && !content.includes('await searchParams')) {
        // Buscar el patrón donde se usa searchParams
        const usagePattern = /(\.\.\.)searchParams(?!Resolved)/g;
        if (usagePattern.test(content)) {
          // Agregar línea para resolver searchParams
          const funcPattern = /(const \w+ = async \([^)]*\) => {[^}]*?)(const)/;
          if (funcPattern.test(content)) {
            content = content.replace(funcPattern, '$1const resolvedSearchParams = await searchParams;\n\n  $2');
            content = content.replace(/(\.\.\.)searchParams(?!Resolved)/g, '$1resolvedSearchParams');
            modified = true;
          }
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ SearchParams actualizados en: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

console.log('🔧 Arreglando searchParams de Next.js 15...\n');

// Obtener todos los archivos page.tsx
const pageFiles = getAllPageFiles('./app');

console.log(`📁 Encontrados ${pageFiles.length} archivos page.tsx\n`);

// Arreglar cada archivo
pageFiles.forEach(file => {
  fixSearchParamsInFile(file);
});

console.log('\n✅ ¡Corrección de searchParams completada!');
console.log('📝 Todos los searchParams ahora son Promise<T> para Next.js 15'); 