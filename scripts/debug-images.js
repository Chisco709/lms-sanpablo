const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugImages() {
  try {
    console.log('🔍 Debugging course images...\n');

    // Obtener todos los cursos con sus imágenes
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
        isPublished: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    console.log(`📊 Total courses found: ${courses.length}\n`);

    // Analizar cada curso
    courses.forEach((course, index) => {
      console.log(`${index + 1}. Course: ${course.title}`);
      console.log(`   ID: ${course.id}`);
      console.log(`   Published: ${course.isPublished}`);
      console.log(`   Image URL: ${course.imageUrl || 'NULL/EMPTY'}`);
      console.log(`   User ID: ${course.userId}`);
      console.log(`   Created: ${course.createdAt}`);
      console.log(`   Updated: ${course.updatedAt}`);
      console.log('');
    });

    // Estadísticas
    const coursesWithImages = courses.filter(c => c.imageUrl && c.imageUrl.trim() !== '');
    const publishedCourses = courses.filter(c => c.isPublished);
    const publishedWithImages = publishedCourses.filter(c => c.imageUrl && c.imageUrl.trim() !== '');

    console.log('📈 Statistics:');
    console.log(`   Total courses: ${courses.length}`);
    console.log(`   Courses with images: ${coursesWithImages.length}`);
    console.log(`   Published courses: ${publishedCourses.length}`);
    console.log(`   Published courses with images: ${publishedWithImages.length}`);
    console.log(`   Courses without images: ${courses.length - coursesWithImages.length}`);

    // Verificar URLs válidas
    const validUrls = coursesWithImages.filter(c => {
      try {
        new URL(c.imageUrl);
        return true;
      } catch {
        return false;
      }
    });

    console.log(`   Valid image URLs: ${validUrls.length}`);
    console.log(`   Invalid image URLs: ${coursesWithImages.length - validUrls.length}`);

    // Mostrar URLs inválidas
    const invalidUrls = coursesWithImages.filter(c => {
      try {
        new URL(c.imageUrl);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      console.log('\n❌ Invalid URLs:');
      invalidUrls.forEach(course => {
        console.log(`   ${course.title}: ${course.imageUrl}`);
      });
    }

    // Mostrar URLs válidas
    if (validUrls.length > 0) {
      console.log('\n✅ Valid URLs:');
      validUrls.forEach(course => {
        console.log(`   ${course.title}: ${course.imageUrl}`);
      });
    }

  } catch (error) {
    console.error('❌ Error debugging images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
debugImages(); 