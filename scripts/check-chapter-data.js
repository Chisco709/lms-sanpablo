const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkChapterData() {
  try {
    console.log('🔍 Verificando datos de capítulos...\n');
    
    // Obtener todos los capítulos publicados
    const chapters = await prisma.chapter.findMany({
      where: {
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        pdfUrl: true,
        googleFormUrl: true,
        course: {
          select: {
            title: true
          }
        }
      }
    });

    console.log(`📚 Total de capítulos publicados: ${chapters.length}\n`);

    chapters.forEach((chapter, index) => {
      console.log(`--- Capítulo ${index + 1} ---`);
      console.log(`📖 Título: ${chapter.title}`);
      console.log(`🎓 Curso: ${chapter.course.title}`);
      console.log(`🎥 Video: ${chapter.videoUrl ? '✅ Configurado' : '❌ No configurado'}`);
      console.log(`📄 PDF: ${chapter.pdfUrl ? '✅ Configurado' : '❌ No configurado'}`);
      console.log(`📝 Google Form: ${chapter.googleFormUrl ? '✅ Configurado' : '❌ No configurado'}`);
      
      if (chapter.pdfUrl) {
        console.log(`   📄 URL del PDF: ${chapter.pdfUrl}`);
      }
      
      if (chapter.googleFormUrl) {
        console.log(`   📝 URL del Form: ${chapter.googleFormUrl}`);
      }
      
      console.log('');
    });

    // Estadísticas
    const withPdf = chapters.filter(c => c.pdfUrl).length;
    const withForm = chapters.filter(c => c.googleFormUrl).length;
    const withVideo = chapters.filter(c => c.videoUrl).length;

    console.log('📊 ESTADÍSTICAS:');
    console.log(`   🎥 Capítulos con video: ${withVideo}/${chapters.length}`);
    console.log(`   📄 Capítulos con PDF: ${withPdf}/${chapters.length}`);
    console.log(`   📝 Capítulos con Google Form: ${withForm}/${chapters.length}`);

  } catch (error) {
    console.error('❌ Error al verificar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkChapterData(); 