import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE() {
    try {
        const user = await currentUser();
        
        // Solo permitir al administrador principal
        if (!user || user.primaryEmailAddress?.emailAddress !== "chiscojjcm@gmail.com") {
            return new NextResponse("No autorizado", { status: 401 });
        }

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
        const coursesToDelete = await db.course.findMany({
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

        console.log(`📋 Encontrados ${coursesToDelete.length} cursos automáticos para eliminar`);

        if (coursesToDelete.length === 0) {
            return NextResponse.json({ 
                message: "No hay cursos automáticos para eliminar",
                deleted: 0 
            });
        }

        let deletedCount = 0;
        const deletedCourses = [];

        // Eliminar cada curso y sus dependencias
        for (const course of coursesToDelete) {
            console.log(`🗑️ Eliminando curso: ${course.title}`);

            try {
                // 1. Eliminar progreso de usuarios relacionado a los capítulos
                if (course.chapters.length > 0) {
                    const chapterIds = course.chapters.map(ch => ch.id);
                    await db.userProgress.deleteMany({
                        where: {
                            chapterId: {
                                in: chapterIds
                            }
                        }
                    });
                }

                // 2. Eliminar compras del curso
                await db.purchase.deleteMany({
                    where: {
                        courseId: course.id
                    }
                });

                // 3. Eliminar attachments del curso
                await db.attachment.deleteMany({
                    where: {
                        courseId: course.id
                    }
                });

                // 4. Eliminar capítulos del curso
                await db.chapter.deleteMany({
                    where: {
                        courseId: course.id
                    }
                });

                // 5. Eliminar temas del pensum
                await db.pensumTopic.deleteMany({
                    where: {
                        courseId: course.id
                    }
                });

                // 6. Finalmente eliminar el curso
                await db.course.delete({
                    where: {
                        id: course.id
                    }
                });

                deletedCourses.push(course.title);
                deletedCount++;
                console.log(`   ✅ Curso eliminado: ${course.title}`);

            } catch (error) {
                console.error(`❌ Error eliminando curso ${course.title}:`, error);
            }
        }

        // Estadísticas finales
        const remainingCourses = await db.course.count();
        
        return NextResponse.json({
            success: true,
            message: "Cursos automáticos eliminados exitosamente",
            deleted: deletedCount,
            deletedCourses,
            remainingCourses,
            details: {
                coursesDeleted: deletedCount,
                coursesRemaining: remainingCourses
            }
        });

    } catch (error) {
        console.error("❌ Error en eliminación de cursos automáticos:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
} 