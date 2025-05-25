const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    // Primero, obtener las categorías existentes
    const categories = await database.category.findMany();
    
    if (categories.length === 0) {
      console.log("No hay categorías. Ejecuta primero el script de categorías.");
      return;
    }

    // Crear cursos de prueba
    const testCourses = [
      {
        title: "Introducción a JavaScript",
        description: "Aprende los fundamentos de JavaScript desde cero. Este curso te enseñará variables, funciones, objetos y mucho más.",
        imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop",
        price: 150000,
        categoryId: categories.find(c => c.name === "Informática")?.id || categories[0].id,
        isPublished: true,
        userId: "user_2example123" // Cambia esto por un userId real de tu sistema
      },
      {
        title: "Diseño Gráfico con Photoshop",
        description: "Domina las herramientas de Photoshop para crear diseños profesionales. Desde lo básico hasta técnicas avanzadas.",
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
        price: 200000,
        categoryId: categories.find(c => c.name === "Fotografía")?.id || categories[0].id,
        isPublished: true,
        userId: "user_2example123"
      },
      {
        title: "Inglés Conversacional",
        description: "Mejora tu inglés conversacional con ejercicios prácticos y situaciones reales del día a día.",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
        price: 120000,
        categoryId: categories.find(c => c.name === "Idiomas")?.id || categories[0].id,
        isPublished: true,
        userId: "user_2example123"
      },
      {
        title: "Matemáticas Básicas",
        description: "Refuerza tus conocimientos en matemáticas básicas: álgebra, geometría y aritmética.",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
        price: 80000,
        categoryId: categories.find(c => c.name === "Matemáticas")?.id || categories[0].id,
        isPublished: true,
        userId: "user_2example123"
      }
    ];

    for (const courseData of testCourses) {
      const course = await database.course.create({
        data: courseData
      });

      // Crear algunos capítulos para cada curso
      await database.chapter.createMany({
        data: [
          {
            title: "Introducción al curso",
            description: "Bienvenida y objetivos del curso",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            position: 1,
            isPublished: true,
            courseId: course.id
          },
          {
            title: "Conceptos fundamentales",
            description: "Los conceptos básicos que necesitas conocer",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            position: 2,
            isPublished: true,
            courseId: course.id
          },
          {
            title: "Práctica guiada",
            description: "Ejercicios prácticos paso a paso",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            position: 3,
            isPublished: true,
            courseId: course.id
          }
        ]
      });

      console.log(`Curso creado: ${course.title}`);
    }

    console.log("✅ Cursos de prueba creados exitosamente");
  } catch (error) {
    console.log("❌ Error creando cursos de prueba:", error);
  } finally {
    await database.$disconnect();
  }
}

main(); 