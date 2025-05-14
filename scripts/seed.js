// Importar PrismaClient
const { PrismaClient } = require("@prisma/client");

// Crear una instancia de PrismaClient
const database = new PrismaClient();

async function main() {
  try {
    // Crear categorías en la base de datos
    await database.category.createMany({
      data: [
        { name: "Primera Infancia" },
        { name: "Ingles" },
        { name: "Matematicas" },
        { name: "Quimica" },
        { name: "Fisica" },
      ]
    });

    console.log("Categorías creadas exitosamente");
  } catch (error) {
    console.error("Error al enviar a la base de datos:", error);
  } finally {
    // Desconectar de la base de datos al terminar
    await database.$disconnect();
  }
}

// Ejecutar la función principal
main()
  .then(() => console.log("Seeding completado"))
  .catch((error) => {
    console.error("Error durante el proceso de seeding:", error);
    process.exit(1);
  }); 