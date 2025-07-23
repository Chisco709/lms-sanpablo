const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteSpecificCourses() {
  try {
    console.log('🗑️ Deleting specific unwanted courses...\n');

    // Cursos específicos a eliminar
    const coursesToDelete = [
      "Tecnico en instalaciones Electricas",
      "Tecnico en electronica industrial"
    ];

    console.log('📋 Courses to delete:');
    coursesToDelete.forEach(course => {
      console.log(`   - ${course}`);
    });
    console.log('');

    // Buscar los cursos
    const courses = await prisma.course.findMany({
      where: {
        title: {
          in: coursesToDelete
        }
      },
      select: {
        id: true,
        title: true,
        userId: true,
        isPublished: true,
        _count: {
          select: {
            chapters: true,
            purchases: true,
            attachments: true
          }
        }
      }
    });

    console.log(`📊 Found ${courses.length} courses to delete:\n`);

    if (courses.length === 0) {
      console.log('✅ No courses found to delete');
      return;
    }

    // Mostrar información de cada curso
    courses.forEach((course, index) => {
      console.log(`${index + 1}. Course: ${course.title}`);
      console.log(`   ID: ${course.id}`);
      console.log(`   User ID: ${course.userId}`);
      console.log(`   Published: ${course.isPublished}`);
      console.log(`   Chapters: ${course._count.chapters}`);
      console.log(`   Purchases: ${course._count.purchases}`);
      console.log(`   Attachments: ${course._count.attachments}`);
      console.log('');
    });

    // Preguntar confirmación
    console.log('⚠️  WARNING: This will permanently delete these courses and all related data!');
    console.log('   - All chapters and their content');
    console.log('   - All user progress');
    console.log('   - All assignments and submissions');
    console.log('   - All attachments');
    console.log('   - All purchases');
    console.log('   - All pensum topics');
    console.log('');

    // ELIMINACIÓN REAL
    console.log('🚀 Starting deletion process...\n');

    for (const course of courses) {
      console.log(`🗑️ Deleting course: ${course.title} (ID: ${course.id})`);
      
      try {
        // Eliminar el curso (esto eliminará en cascada todos los datos relacionados)
        await prisma.course.delete({
          where: {
            id: course.id
          }
        });
        
        console.log(`✅ Successfully deleted: ${course.title}`);
      } catch (error) {
        console.error(`❌ Error deleting ${course.title}:`, error.message);
      }
    }

    console.log('\n✅ Deletion process completed!');

    // Verificar que se eliminaron
    const remainingCourses = await prisma.course.findMany({
      where: {
        title: {
          in: coursesToDelete
        }
      },
      select: {
        id: true,
        title: true
      }
    });

    if (remainingCourses.length === 0) {
      console.log('✅ All specified courses have been successfully deleted!');
    } else {
      console.log('⚠️  Some courses could not be deleted:');
      remainingCourses.forEach(course => {
        console.log(`   - ${course.title} (ID: ${course.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error in deletion process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
deleteSpecificCourses(); 