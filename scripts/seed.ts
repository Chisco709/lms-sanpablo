import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
    try {
        // Crear categorías por defecto
        const categories = [
            { name: "Educación Temprana" },
            { name: "Inglés" },
            { name: "Carreras Técnicas" },
            { name: "Desarrollo Web" },
            { name: "Programación" },
            { name: "Diseño" },
            { name: "Marketing Digital" },
            { name: "Administración" }
        ];

        for (const category of categories) {
            await database.category.upsert({
                where: { name: category.name },
                update: {},
                create: category
            });
        }

        console.log("✅ Categorías creadas exitosamente");

        // Crear algunos cursos de ejemplo (opcional)
        const exampleCourses = [
            {
                userId: "user_example", // Cambiar por un userId real
                title: "Fundamentos de Educación Temprana",
                description: "Aprende los principios básicos para trabajar con niños en edad preescolar",
                price: 99.99,
                isPublished: true,
                categoryId: await database.category.findFirst({ where: { name: "Educación Temprana" } }).then(c => c?.id)
            },
            {
                userId: "user_example", // Cambiar por un userId real
                title: "Inglés Conversacional Básico",
                description: "Desarrolla habilidades de conversación en inglés desde cero",
                price: 79.99,
                isPublished: true,
                categoryId: await database.category.findFirst({ where: { name: "Inglés" } }).then(c => c?.id)
            }
        ];

        console.log("✅ Base de datos poblada exitosamente");
    } catch (error) {
        console.error("❌ Error poblando la base de datos:", error);
    } finally {
        await database.$disconnect();
    }
}

// Ejecutar la función main
main()
    .then(() => console.log("Seeding completado"))
    .catch((e) => {
        console.error("Error durante el seeding:", e);
        process.exit(1);
    });