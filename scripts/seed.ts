import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
    try {
        console.log("🌱 Iniciando población de la base de datos...");

        // Crear categorías específicas para Instituto San Pablo
        const categories = [
            { name: "Primera Infancia" },
            { name: "Inglés" },
            { name: "Pedagogía" },
            { name: "Educación" },
            { name: "Desarrollo Infantil" },
            { name: "Psicología Infantil" },
            { name: "Metodologías de Enseñanza" },
            { name: "Estimulación Temprana" },
            { name: "Cuidado Infantil" },
            { name: "Desarrollo Cognitivo" }
        ];

        console.log("📚 Creando categorías educativas...");
        for (const category of categories) {
            await database.category.upsert({
                where: { name: category.name },
                update: {},
                create: category
            });
        }

        console.log("✅ Categorías educativas creadas exitosamente");

        // ⚠️  CURSOS AUTOMÁTICOS DESHABILITADOS
        console.log("ℹ️  Los cursos automáticos han sido deshabilitados");
        console.log("ℹ️  Para crear cursos, usa el modo profesor en la interfaz web");
        
        // Mostrar resumen
        const totalCategories = await database.category.count();
        const totalCourses = await database.course.count();
        
        console.log("\n📊 RESUMEN:");
        console.log(`   📚 Categorías disponibles: ${totalCategories}`);
        console.log(`   🎓 Cursos existentes: ${totalCourses}`);
        console.log("\n✅ Base de datos lista para Instituto San Pablo");
        
    } catch (error) {
        console.error("❌ Error poblando la base de datos:", error);
    } finally {
        await database.$disconnect();
    }
}

main();