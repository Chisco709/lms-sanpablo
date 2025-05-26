import { db } from "../lib/db";

/**
 * Script para crear categorías por defecto en el sistema
 */

async function seedCategories() {
  console.log("🌱 Creando categorías por defecto...");

  const categories = [
    "Programación",
    "Desarrollo Web",
    "Bases de Datos",
    "Diseño Gráfico",
    "Marketing Digital",
    "Administración",
    "Contabilidad",
    "Recursos Humanos",
    "Logística",
    "Salud Ocupacional",
    "Inglés",
    "Matemáticas",
    "Comunicación",
    "Emprendimiento",
    "Tecnología"
  ];

  try {
    for (const categoryName of categories) {
      // Verificar si la categoría ya existe
      const existingCategory = await db.category.findFirst({
        where: {
          name: categoryName
        }
      });

      if (!existingCategory) {
        await db.category.create({
          data: {
            name: categoryName
          }
        });
        console.log(`✅ Categoría creada: ${categoryName}`);
      } else {
        console.log(`⚠️ Categoría ya existe: ${categoryName}`);
      }
    }

    console.log("\n🎉 ¡Categorías creadas exitosamente!");
    
  } catch (error) {
    console.error("❌ Error creando categorías:", error);
    throw error;
  }
}

// Función principal
async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error("💥 Error general:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { seedCategories }; 