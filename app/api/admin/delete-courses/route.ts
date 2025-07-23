import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar que sea el usuario autorizado (profesor)
    if (userId !== "user_2QZQZQZQZQZQZQZQZQZQZQZQZ") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Cursos a eliminar
    const coursesToDelete = [
      "Tecnico en instalaciones Electricas",
      "Tecnico en electronica industrial"
    ];

    console.log("🗑️ Deleting unwanted courses:", coursesToDelete);

    // Buscar los cursos
    const courses = await db.course.findMany({
      where: {
        title: {
          in: coursesToDelete
        }
      },
      select: {
        id: true,
        title: true,
        userId: true,
        isPublished: true,
        _count: {
          select: {
            chapters: true,
            purchases: true,
            attachments: true
          }
        }
      }
    });

    console.log(`📊 Found ${courses.length} courses to delete`);

    if (courses.length === 0) {
      return NextResponse.json({ 
        message: "No courses found to delete",
        deletedCount: 0 
      });
    }

    // Mostrar información de cada curso
    courses.forEach((course, index) => {
      console.log(`${index + 1}. Course: ${course.title}`);
      console.log(`   ID: ${course.id}`);
      console.log(`   User ID: ${course.userId}`);
      console.log(`   Published: ${course.isPublished}`);
      console.log(`   Chapters: ${course._count.chapters}`);
      console.log(`   Purchases: ${course._count.purchases}`);
      console.log(`   Attachments: ${course._count.attachments}`);
    });

    // Eliminar los cursos
    const deletedCourses = [];
    for (const course of courses) {
      try {
        console.log(`🗑️ Deleting course: ${course.title} (ID: ${course.id})`);
        
        // Eliminar el curso (esto eliminará en cascada todos los datos relacionados)
        await db.course.delete({
          where: {
            id: course.id
          }
        });
        
        console.log(`✅ Successfully deleted: ${course.title}`);
        deletedCourses.push(course.title);
      } catch (error) {
        console.error(`❌ Error deleting ${course.title}:`, error);
      }
    }

    // Verificar que se eliminaron
    const remainingCourses = await db.course.findMany({
      where: {
        title: {
          in: coursesToDelete
        }
      },
      select: {
        id: true,
        title: true
      }
    });

    if (remainingCourses.length === 0) {
      console.log('✅ All specified courses have been successfully deleted!');
    } else {
      console.log('⚠️  Some courses could not be deleted:');
      remainingCourses.forEach(course => {
        console.log(`   - ${course.title} (ID: ${course.id})`);
      });
    }

    return NextResponse.json({
      message: "Courses deleted successfully",
      deletedCount: deletedCourses.length,
      deletedCourses: deletedCourses,
      remainingCount: remainingCourses.length,
      remainingCourses: remainingCourses.map(c => c.title)
    });

  } catch (error) {
    console.error("❌ Error in deletion process:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 