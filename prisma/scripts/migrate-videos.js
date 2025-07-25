// prisma/scripts/migrate-videos.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateVideos() {
  console.log('Iniciando migración de videos...');
  
  try {
    // 1. Obtener todos los capítulos con videoUrl
    const chapters = await prisma.chapter.findMany({
      where: {
        videoUrl: { not: null }
      },
      select: {
        id: true,
        videoUrl: true,
        title: true,
        courseId: true
      }
    });

    console.log(`Encontrados ${chapters.length} capítulos con video para migrar`);

    // 2. Por cada capítulo, crear un ChapterVideo
    for (const chapter of chapters) {
      await prisma.$transaction(async (tx) => {
        // Verificar si ya existe un video para este capítulo
        const existingVideo = await tx.chapterVideo.findFirst({
          where: { chapterId: chapter.id }
        });

        if (!existingVideo) {
          // Crear el video
          await tx.chapterVideo.create({
            data: {
              title: `Video de ${chapter.title}`,
              url: chapter.videoUrl,
              position: 0,
              isPrimary: true,
              chapterId: chapter.id
            }
          });
          console.log(`Migrado video para capítulo ${chapter.id}`);
        }
      });
    }

    console.log('Migración completada con éxito');
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateVideos();
