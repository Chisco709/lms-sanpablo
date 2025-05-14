import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Primera Infancia" },
                { name: "Ingles" },
                { name: "Matematicas" },
                { name: "Quimica" },
                { name: "Fisica" },
            ]
        });

        console.log("Exitoso")
    } catch (error) {
        console.error("Error al enviar a la base de datos:", error)
    } finally {
        await database.$disconnect()
    }
}

// Ejecutar la función main
main()
    .then(() => console.log("Seeding completado"))
    .catch((e) => {
        console.error("Error durante el seeding:", e);
        process.exit(1);
    });