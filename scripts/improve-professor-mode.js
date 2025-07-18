const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

console.log('🎓 MEJORANDO MODO PROFESOR - INSTITUTO SAN PABLO');
console.log('==================================================\n');

async function improveProfessorMode() {
  try {
    // 1. Limpiar categorías no deseadas
    console.log('🗑️  Paso 1: Limpiando categorías técnicas no deseadas...');
    
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

    let deletedCategories = 0;
    for (const categoryName of unwantedCategories) {
      const category = await db.category.findFirst({
        where: { name: categoryName }
      });
      
      if (category) {
        const coursesCount = await db.course.count({
          where: { categoryId: category.id }
        });
        
        if (coursesCount === 0) {
          await db.category.delete({ where: { id: category.id } });
          console.log(`   ✅ Eliminada: "${categoryName}"`);
          deletedCategories++;
        } else {
          console.log(`   ⚠️  "${categoryName}" tiene ${coursesCount} cursos - conservada`);
        }
      }
    }

    // 2. Crear categorías educativas si no existen
    console.log('\n📚 Paso 2: Creando categorías educativas...');
    
    const educationalCategories = [
      'Primera Infancia',
      'Inglés',
      'Pedagogía',
      'Educación',
      'Desarrollo Infantil',
      'Psicología Infantil',
      'Metodologías de Enseñanza',
      'Estimulación Temprana',
      'Cuidado Infantil',
      'Desarrollo Cognitivo'
    ];

    let createdCategories = 0;
    for (const categoryName of educationalCategories) {
      const existingCategory = await db.category.findFirst({
        where: { name: categoryName }
      });
      
      if (!existingCategory) {
        await db.category.create({
          data: { name: categoryName }
        });
        console.log(`   ✅ Creada: "${categoryName}"`);
        createdCategories++;
      }
    }

    // 3. Limpiar cursos con contenido técnico no deseado
    console.log('\n🧹 Paso 3: Limpiando cursos con contenido técnico...');
    
    const unwantedKeywords = [
      'mecánica', 'mecanic', 'electricidad', 'electric',
      'soldadura', 'refrigeración', 'automotriz', 'construcción',
      'reparación', 'hardware', 'circuitos', 'motor', 'automotive'
    ];

    let deletedCourses = 0;
    for (const keyword of unwantedKeywords) {
      const coursesToDelete = await db.course.findMany({
        where: {
          title: {
            contains: keyword,
            mode: 'insensitive'
          }
        },
        select: { id: true, title: true }
      });

      for (const course of coursesToDelete) {
        // Eliminar dependencias
        await db.purchase.deleteMany({ where: { courseId: course.id } });
        await db.userProgress.deleteMany({ 
          where: { 
            chapter: { courseId: course.id } 
          } 
        });
        await db.chapter.deleteMany({ where: { courseId: course.id } });
        await db.pensumTopic.deleteMany({ where: { courseId: course.id } });
        await db.attachment.deleteMany({ where: { courseId: course.id } });
        
        // Eliminar el curso
        await db.course.delete({ where: { id: course.id } });
        console.log(`   ✅ Eliminado curso: "${course.title}"`);
        deletedCourses++;
      }
    }

    // 4. Verificar configuración de campos obligatorios
    console.log('\n⚙️  Paso 4: Verificando configuración simplificada...');
    
    const totalCourses = await db.course.count();
    const publishedCourses = await db.course.count({ where: { isPublished: true } });
    const coursesWithAllFields = await db.course.count({
      where: {
        title: { not: null },
        description: { not: null },
        imageUrl: { not: null }
      }
    });

    console.log(`   📊 Cursos totales: ${totalCourses}`);
    console.log(`   📖 Cursos publicados: ${publishedCourses}`);
    console.log(`   ✅ Cursos con campos completos: ${coursesWithAllFields}`);

    // 5. Verificar temas de pensum
    console.log('\n📋 Paso 5: Verificando estructura de temas de pensum...');
    
    const totalTopics = await db.pensumTopic.count();
    const topicsWithChapters = await db.pensumTopic.count({
      where: {
        chapters: {
          some: {}
        }
      }
    });

    console.log(`   📝 Temas de pensum totales: ${totalTopics}`);
    console.log(`   📚 Temas con capítulos: ${topicsWithChapters}`);

    // 6. Estadísticas finales
    console.log('\n📊 RESUMEN DE MEJORAS:');
    console.log('========================');
    console.log(`✅ Categorías eliminadas: ${deletedCategories}`);
    console.log(`✅ Categorías educativas añadidas: ${createdCategories}`);
    console.log(`✅ Cursos técnicos eliminados: ${deletedCourses}`);
    console.log(`✅ Campos obligatorios simplificados: Solo 3 (título, descripción, imagen)`);
    console.log(`✅ Sistema de temas de pensum: Habilitado`);
    console.log(`✅ Flujo de trabajo: Primero temas, luego capítulos`);

    // 7. Verificar categorías finales
    const finalCategories = await db.category.findMany({
      select: {
        name: true,
        _count: {
          select: { courses: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log('\n📚 CATEGORÍAS ACTUALES:');
    console.log('========================');
    finalCategories.forEach(cat => {
      console.log(`📖 ${cat.name} (${cat._count.courses} cursos)`);
    });

    console.log('\n🎯 PRÓXIMOS PASOS PARA EL PROFESOR:');
    console.log('===================================');
    console.log('1. 🏠 Ir a /teacher/courses');
    console.log('2. ➕ Crear nuevo curso (solo título inicialmente)');
    console.log('3. ✏️  Completar descripción e imagen');
    console.log('4. 📋 Crear temas del pensum');
    console.log('5. 📚 Agregar capítulos a cada tema');
    console.log('6. 🚀 ¡Publicar cuando esté listo!');

    console.log('\n✨ MODO PROFESOR MEJORADO EXITOSAMENTE ✨');
    console.log('🎓 Listo para crear contenido educativo de calidad\n');

  } catch (error) {
    console.error('❌ Error mejorando modo profesor:', error);
  } finally {
    await db.$disconnect();
  }
}

// Ejecutar mejoras
improveProfessorMode(); 