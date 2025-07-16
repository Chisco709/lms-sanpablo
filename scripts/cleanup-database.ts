import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function cleanupDatabase() {
    try {
        console.log("🧹 Iniciando limpieza de la base de datos...");

        // 1. Eliminar progreso de usuarios
        console.log("📊 Eliminando progreso de usuarios...");
        const deletedProgress = await database.userProgress.deleteMany({});
        console.log(`   ✅ ${deletedProgress.count} registros de progreso eliminados`);

        // 2. Eliminar compras
        console.log("💰 Eliminando compras...");
        const deletedPurchases = await database.purchase.deleteMany({});
        console.log(`   ✅ ${deletedPurchases.count} compras eliminadas`);

        // 3. Eliminar attachments
        console.log("📎 Eliminando archivos adjuntos...");
        const deletedAttachments = await database.attachment.deleteMany({});
        console.log(`   ✅ ${deletedAttachments.count} archivos adjuntos eliminados`);

        // 4. Eliminar capítulos
        console.log("📚 Eliminando capítulos...");
        const deletedChapters = await database.chapter.deleteMany({});
        console.log(`   ✅ ${deletedChapters.count} capítulos eliminados`);

        // 5. Eliminar temas del pensum
        console.log("📋 Eliminando temas del pensum...");
        const deletedPensumTopics = await database.pensumTopic.deleteMany({});
        console.log(`   ✅ ${deletedPensumTopics.count} temas del pensum eliminados`);

        // 6. Eliminar cursos
        console.log("🎓 Eliminando cursos...");
        const deletedCourses = await database.course.deleteMany({});
        console.log(`   ✅ ${deletedCourses.count} cursos eliminados`);

        // 7. Mantener categorías (opcionales)
        const totalCategories = await database.category.count();
        console.log(`   ℹ️ Se mantienen ${totalCategories} categorías`);

        console.log("\n🎉 ¡Limpieza completada exitosamente!");
        console.log("📝 La base de datos está limpia y lista para nuevos cursos");
        
    } catch (error) {
        console.error("❌ Error durante la limpieza:", error);
        throw error;
    } finally {
        await database.$disconnect();
    }
}

// Función principal
async function main() {
    console.log("⚠️  ADVERTENCIA: Esta operación eliminará TODOS los cursos y contenido relacionado");
    console.log("⚠️  ¿Estás seguro de que quieres continuar? (Esta acción no se puede deshacer)");
    console.log("");
    
    try {
        await cleanupDatabase();
    } catch (error) {
        console.error("💥 Error general:", error);
        process.exit(1);
    }
}

// Ejecutar la función main
main()
    .then(() => console.log("\n✨ Limpieza completada exitosamente"))
    .catch((e) => {
        console.error("💥 Error durante la limpieza:", e);
        process.exit(1);
    }); 