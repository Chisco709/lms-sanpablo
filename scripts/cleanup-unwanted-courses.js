const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function cleanupUnwantedCourses() {
  console.log('🧹 Iniciando limpieza de cursos no deseados...\n');

  try {
    // Categorías no deseadas para eliminar
    const unwantedCategories = [
      'Técnico en Mecánica',
      'Técnico en Electricidad', 
      'Técnico en Soldadura',
      'Técnico en Refrigeración',
      'Técnico en Automotriz',
      'Técnico en Construcción',
      'Técnico en Computación',
      'Técnico en Electrónica',
      'Matemáticas',
      'Química',
      'Física',
      'Music',
      'Photography',
      'Fitness',
      'Accounting',
      'Computer Science',
      'Filming',
      'Engineering'
    ];

    // Palabras clave en títulos de cursos a eliminar
    const unwantedKeywords = [
      'mecánica',
      'mecanic',
      'electricidad',
      'electric',
      'soldadura',
      'refrigeración',
      'automotriz',
      'construcción',
      'reparación',
      'hardware',
      'circuitos',
      'motor',
      'automotive'
    ];

    console.log('📊 Consultando datos actuales...');
    
    // Contar datos antes de la limpieza
    const totalCoursesBefore = await db.course.count();
    const totalCategoriesBefore = await db.category.count();
    
    console.log(`   Cursos actuales: ${totalCoursesBefore}`);
    console.log(`   Categorías actuales: ${totalCategoriesBefore}\n`);

    // 1. Eliminar cursos con títulos que contengan palabras clave no deseadas
    console.log('🗑️  Eliminando cursos con contenido técnico no deseado...');
    
    for (const keyword of unwantedKeywords) {
      const coursesToDelete = await db.course.findMany({
        where: {
          title: {
            contains: keyword,
            mode: 'insensitive'
          }
        },
        select: {
          id: true,
          title: true
        }
      });

      if (coursesToDelete.length > 0) {
        console.log(`   🔍 Encontrados ${coursesToDelete.length} cursos con "${keyword}"`);
        
        for (const course of coursesToDelete) {
          // Eliminar compras asociadas
          await db.purchase.deleteMany({
            where: { courseId: course.id }
          });
          
          // Eliminar capítulos y sus dependencias
          await db.chapter.deleteMany({
            where: { courseId: course.id }
          });
          
          // Eliminar temas de pensum
          await db.pensumTopic.deleteMany({
            where: { courseId: course.id }
          });
          
          // Eliminar adjuntos
          await db.attachment.deleteMany({
            where: { courseId: course.id }
          });
          
          // Eliminar el curso
          await db.course.delete({
            where: { id: course.id }
          });
          
          console.log(`     ✅ Eliminado: "${course.title}"`);
        }
      }
    }

    // 2. Eliminar categorías no deseadas
    console.log('\n🏷️  Eliminando categorías técnicas no deseadas...');
    
    for (const categoryName of unwantedCategories) {
      const category = await db.category.findFirst({
        where: {
          name: categoryName
        }
      });
      
      if (category) {
        // Verificar si hay cursos usando esta categoría
        const coursesWithCategory = await db.course.count({
          where: {
            categoryId: category.id
          }
        });
        
        if (coursesWithCategory > 0) {
          console.log(`   ⚠️  Categoría "${categoryName}" tiene ${coursesWithCategory} cursos asociados - omitiendo`);
        } else {
          await db.category.delete({
            where: { id: category.id }
          });
          console.log(`   ✅ Eliminada categoría: "${categoryName}"`);
        }
      }
    }

    // 3. Limpiar cursos sin categoría asignada que puedan ser de ejemplo
    console.log('\n🔍 Verificando cursos sin categoría...');
    
    const coursesWithoutCategory = await db.course.findMany({
      where: {
        categoryId: null
      },
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    });
    
    if (coursesWithoutCategory.length > 0) {
      console.log(`   📝 Encontrados ${coursesWithoutCategory.length} cursos sin categoría`);
      coursesWithoutCategory.forEach(course => {
        console.log(`     - "${course.title}" (${course.createdAt.toLocaleDateString()})`);
      });
    }

    // Estadísticas finales
    console.log('\n📊 Resultados de la limpieza:');
    
    const totalCoursesAfter = await db.course.count();
    const totalCategoriesAfter = await db.category.count();
    
    console.log(`   Cursos eliminados: ${totalCoursesBefore - totalCoursesAfter}`);
    console.log(`   Categorías eliminadas: ${totalCategoriesBefore - totalCategoriesAfter}`);
    console.log(`   Cursos restantes: ${totalCoursesAfter}`);
    console.log(`   Categorías restantes: ${totalCategoriesAfter}`);

    // Mostrar categorías restantes
    const remainingCategories = await db.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            courses: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log('\n📚 Categorías actuales:');
    remainingCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat._count.courses} cursos)`);
    });

    console.log('\n✨ Limpieza completada exitosamente!');
    console.log('🎯 El sistema ahora contiene solo cursos relevantes para Instituto San Pablo\n');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await db.$disconnect();
  }
}

// Ejecutar la limpieza
cleanupUnwantedCourses(); 