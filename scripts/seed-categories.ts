const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Informática" },
        { name: "Música" },
        { name: "Fitness" },
        { name: "Fotografía" },
        { name: "Contabilidad" },
        { name: "Ingeniería" },
        { name: "Filmación" },
        { name: "Educación" },
        { name: "Idiomas" },
        { name: "Literatura" },
        { name: "Matemáticas" },
        { name: "Ciencias" },
      ]
    });

    console.log("Categorías creadas exitosamente");
  } catch (error) {
    console.log("Error creando categorías:", error);
  } finally {
    await database.$disconnect();
  }
}

main(); 