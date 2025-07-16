import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function deleteAutoCourses() {
    try {
        console.log("🧹 Eliminando cursos automáticos no deseados...");

        // Lista de títulos de cursos automáticos que queremos eliminar
        const autoCourseTitles = [
            "Técnico en Reparación de Computadoras",
            "Técnico en Electrónica Industrial", 
            "Técnico en Mecánica Automotriz",
            "Técnico en Instalaciones Eléctricas",
            "Técnico en Electricidad",
            "Técnico en Mecánica",
            "Técnico en Computación",
            "Técnico en Electrónica",
            "Técnico en Soldadura",
            "Técnico en Refrigeración",
            "Técnico en Automotriz",
            "Técnico en Construcción"
        ];

        // Buscar cursos que coincidan con estos títulos
        const coursesToDelete = await database.course.findMany({
            where: {
                title: {
                    in: autoCourseTitles
                }
            },
            include: {
                chapters: true,
                attachments: true,
                purchases: true,
                pensumTopics: true
            }
        });

        console.log(`📋 Encontrados ${coursesToDelete.length} cursos automáticos para eliminar:`);
        coursesToDelete.forEach(course => {
            console.log(`   - ${course.title}`);
        });

        if (coursesToDelete.length === 0) {
            console.log("✅ No hay cursos automáticos para eliminar");
            return;
        }

        // Eliminar cada curso y sus dependencias
        for (const course of coursesToDelete) {
            console.log(`🗑️ Eliminando curso: ${course.title}`);

            // 1. Eliminar progreso de usuarios relacionado a los capítulos
            if (course.chapters.length > 0) {
                const chapterIds = course.chapters.map(ch => ch.id);
                const deletedProgress = await database.userProgress.deleteMany({
                    where: {
                        chapterId: {
                            in: chapterIds
                        }
                    }
                });
                console.log(`   📊 ${deletedProgress.count} registros de progreso eliminados`);
            }

            // 2. Eliminar compras del curso
            const deletedPurchases = await database.purchase.deleteMany({
                where: {
                    courseId: course.id
                }
            });
            console.log(`   💰 ${deletedPurchases.count} compras eliminadas`);

            // 3. Eliminar attachments del curso
            const deletedAttachments = await database.attachment.deleteMany({
                where: {
                    courseId: course.id
                }
            });
            console.log(`   📎 ${deletedAttachments.count} archivos adjuntos eliminados`);

            // 4. Eliminar capítulos del curso
            const deletedChapters = await database.chapter.deleteMany({
                where: {
                    courseId: course.id
                }
            });
            console.log(`   📚 ${deletedChapters.count} capítulos eliminados`);

            // 5. Eliminar temas del pensum
            const deletedPensumTopics = await database.pensumTopic.deleteMany({
                where: {
                    courseId: course.id
                }
            });
            console.log(`   📋 ${deletedPensumTopics.count} temas del pensum eliminados`);

            // 6. Finalmente eliminar el curso
            await database.course.delete({
                where: {
                    id: course.id
                }
            });
            console.log(`   ✅ Curso eliminado: ${course.title}`);
        }

        // Mostrar estadísticas finales
        const remainingCourses = await database.course.count();
        const categories = await database.category.count();
        
        console.log("\n📊 ESTADÍSTICAS FINALES:");
        console.log(`   🎓 Cursos restantes: ${remainingCourses}`);
        console.log(`   📚 Categorías mantenidas: ${categories}`);
        console.log(`   🗑️ Cursos automáticos eliminados: ${coursesToDelete.length}`);
        console.log("\n✅ Limpieza de cursos automáticos completada exitosamente!");
        
    } catch (error) {
        console.error("❌ Error eliminando cursos automáticos:", error);
        throw error;
    } finally {
        await database.$disconnect();
    }
}

// Ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
    deleteAutoCourses()
        .then(() => {
            console.log("🎉 Script completado");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Error fatal:", error);
            process.exit(1);
        });
}

export default deleteAutoCourses; 