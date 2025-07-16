import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
    try {
        console.log("🌱 Iniciando población de la base de datos...");

        // Crear categorías específicas para programas técnicos
        const categories = [
            { name: "Técnico en Computación" },
            { name: "Técnico en Electrónica" },
            { name: "Técnico en Mecánica" },
            { name: "Técnico en Electricidad" },
            { name: "Técnico en Soldadura" },
            { name: "Técnico en Refrigeración" },
            { name: "Técnico en Automotriz" },
            { name: "Técnico en Construcción" },
            { name: "Primera Infancia" },
            { name: "Inglés" },
            { name: "Matemáticas" },
            { name: "Química" },
            { name: "Física" }
        ];

        console.log("📚 Creando categorías técnicas...");
        for (const category of categories) {
            await database.category.upsert({
                where: { name: category.name },
                update: {},
                create: category
            });
        }

        console.log("✅ Categorías técnicas creadas exitosamente");

        // ⚠️  CURSOS AUTOMÁTICOS DESHABILITADOS
        console.log("ℹ️  Los cursos automáticos han sido deshabilitados");
        console.log("ℹ️  Para crear cursos de demostración, usa el modo profesor en la interfaz web");
        
        // Mostrar resumen
        const totalCategories = await database.category.count();
        const totalCourses = await database.course.count();
        
        console.log("\n📊 RESUMEN:");
        console.log(`   📚 Categorías disponibles: ${totalCategories}`);
        console.log(`   🎓 Cursos existentes: ${totalCourses}`);
        console.log("\n✅ Base de datos lista para usar");
        
    } catch (error) {
        console.error("❌ Error poblando la base de datos:", error);
    } finally {
        await database.$disconnect();
    }
}

// Ejecutar la función main
main()
    .then(() => console.log("\n✨ Seeding completado exitosamente"))
    .catch((e) => {
        console.error("💥 Error durante el seeding:", e);
        process.exit(1);
    });