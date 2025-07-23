const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUnwantedCourses() {
  try {
    console.log('🗑️ Deleting unwanted courses...\n');

    // Cursos a eliminar
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
      include: {
        chapters: {
          include: {
            userProgress: true,
            assignments: {
              include: {
                submissions: true
              }
            }
          }
        },
        pensumTopics: {
          include: {
            chapters: {
              include: {
                userProgress: true,
                assignments: {
                  include: {
                    submissions: true
                  }
                }
              }
            }
          }
        },
        attachments: true,
        purchases: true,
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
      console.log(`   Created: ${course.createdAt}`);
      console.log(`   Updated: ${course.updatedAt}`);
      console.log('');
    });

    // Confirmar eliminación
    console.log('⚠️  WARNING: This will permanently delete these courses and all related data!');
    console.log('   - All chapters and their content');
    console.log('   - All user progress');
    console.log('   - All assignments and submissions');
    console.log('   - All attachments');
    console.log('   - All purchases');
    console.log('   - All pensum topics');
    console.log('');

    // Simular eliminación (comentado por seguridad)
    console.log('🔒 SAFETY MODE: Delete operations are commented out for safety');
    console.log('   To actually delete, uncomment the delete operations in the script');
    console.log('');

    /*
    // ELIMINACIÓN REAL (descomenta para ejecutar)
    for (const course of courses) {
      console.log(`🗑️ Deleting course: ${course.title}`);
      
      // Eliminar el curso (esto eliminará en cascada todos los datos relacionados)
      await prisma.course.delete({
        where: {
          id: course.id
        }
      });
      
      console.log(`✅ Deleted: ${course.title}`);
    }
    */

    console.log('✅ Script completed (no actual deletion performed)');

  } catch (error) {
    console.error('❌ Error deleting courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
deleteUnwantedCourses(); 