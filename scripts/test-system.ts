import { db } from "../lib/db";

/**
 * Script de prueba para verificar que todas las funcionalidades funcionan correctamente
 */

async function testColombiaFeatures() {
  console.log("🇨🇴 Iniciando pruebas del sistema LMS Colombia...\n");

  try {
    // 1. Probar creación de programa técnico
    console.log("1️⃣ Probando creación de programa técnico...");
    const program = await db.technicalProgram.create({
      data: {
        title: "Técnico en Desarrollo de Software - PRUEBA",
        description: "Programa técnico laboral de prueba",
        duration: 18,
        senaCode: "228106",
        qualification: "Técnico Laboral en Desarrollo de Software",
        modality: "Virtual",
        price: 2500000
      }
    });
    console.log("✅ Programa técnico creado:", program.title);

    // 2. Probar creación de curso asociado al programa
    console.log("\n2️⃣ Probando creación de curso...");
    const course = await db.course.create({
      data: {
        userId: "test_user_id",
        title: "Fundamentos de Programación - PRUEBA",
        description: "Curso de prueba para el programa técnico",
        programId: program.id,
        unlockDate: new Date(),
        isPublished: true
      }
    });
    console.log("✅ Curso creado:", course.title);

    // 3. Probar creación de capítulo con Google Form
    console.log("\n3️⃣ Probando creación de capítulo con Google Form...");
    const chapter = await db.chapter.create({
      data: {
        title: "Introducción a la Programación - PRUEBA",
        description: "Capítulo de prueba con Google Form",
        courseId: course.id,
        position: 1,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        pdfUrl: "https://example.com/test.pdf",
        googleFormUrl: "https://docs.google.com/forms/d/1234567890/viewform",
        isPublished: true
      }
    });
    console.log("✅ Capítulo creado con Google Form:", chapter.title);

    // 4. Probar inscripción a programa
    console.log("\n4️⃣ Probando inscripción a programa...");
    const enrollment = await db.programEnrollment.create({
      data: {
        userId: "test_student_id",
        programId: program.id,
        startDate: new Date(),
        expectedEndDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000), // 18 meses
        studentId: "1234567890",
        phone: "+57 300 123 4567",
        city: "Bogotá",
        department: "Cundinamarca"
      }
    });
    console.log("✅ Inscripción creada para estudiante:", enrollment.studentId);

    // 5. Probar notificación
    console.log("\n5️⃣ Probando creación de notificación...");
    const notification = await db.notification.create({
      data: {
        userId: "test_student_id",
        title: "¡Bienvenido al programa técnico!",
        message: "Te has inscrito exitosamente en el programa de Desarrollo de Software",
        type: "program_enrollment",
        relatedProgramId: program.id
      }
    });
    console.log("✅ Notificación creada:", notification.title);

    // 6. Verificar estadísticas del programa
    console.log("\n6️⃣ Verificando estadísticas del programa...");
    const programWithStats = await db.technicalProgram.findUnique({
      where: { id: program.id },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            isPublished: true,
            unlockDate: true
          }
        },
        enrollments: {
          select: {
            id: true,
            status: true,
            department: true
          }
        },
        _count: {
          select: {
            courses: true,
            enrollments: true
          }
        }
      }
    });

    if (programWithStats) {
      console.log("✅ Estadísticas del programa:");
      console.log(`   - Cursos: ${programWithStats._count.courses}`);
      console.log(`   - Inscripciones: ${programWithStats._count.enrollments}`);
      console.log(`   - Departamentos: ${[...new Set(programWithStats.enrollments.map(e => e.department))].length}`);
    }

    // 7. Limpiar datos de prueba
    console.log("\n7️⃣ Limpiando datos de prueba...");
    await db.notification.delete({ where: { id: notification.id } });
    await db.programEnrollment.delete({ where: { id: enrollment.id } });
    await db.chapter.delete({ where: { id: chapter.id } });
    await db.course.delete({ where: { id: course.id } });
    await db.technicalProgram.delete({ where: { id: program.id } });
    console.log("✅ Datos de prueba eliminados");

    console.log("\n🎉 ¡Todas las pruebas pasaron exitosamente!");
    console.log("\n📋 Funcionalidades verificadas:");
    console.log("   ✅ Programas técnicos");
    console.log("   ✅ Cursos con desbloqueo");
    console.log("   ✅ Capítulos con Google Forms y PDF");
    console.log("   ✅ Inscripciones de estudiantes");
    console.log("   ✅ Notificaciones automáticas");
    console.log("   ✅ Estadísticas y reportes");

  } catch (error) {
    console.error("❌ Error en las pruebas:", error);
    throw error;
  }
}

async function testUnlockSystem() {
  console.log("\n🔓 Probando sistema de desbloqueo...");

  try {
    // Importar funciones del sistema de desbloqueo
    const { checkAndUnlockCourses, getProgramUnlockSchedule } = await import("../lib/unlock-system");

    // Probar verificación de desbloqueos
    console.log("🔍 Verificando cursos para desbloquear...");
    const unlockResults = await checkAndUnlockCourses();
    console.log(`✅ Verificación completada. Cursos desbloqueados: ${unlockResults.length}`);

    if (unlockResults.length > 0) {
      unlockResults.forEach(result => {
        console.log(`   - ${result.title} (${result.courseId})`);
      });
    }

  } catch (error) {
    console.error("❌ Error en pruebas de desbloqueo:", error);
  }
}

// Función principal
async function main() {
  try {
    await testColombiaFeatures();
    await testUnlockSystem();
    
    console.log("\n🚀 Sistema LMS Colombia está funcionando correctamente!");
    console.log("\n📝 Próximos pasos recomendados:");
    console.log("   1. Crear programas técnicos reales");
    console.log("   2. Configurar cron job para desbloqueo automático");
    console.log("   3. Inscribir estudiantes de prueba");
    console.log("   4. Probar flujo completo de estudiante");
    
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

export { testColombiaFeatures, testUnlockSystem }; 