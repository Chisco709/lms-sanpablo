import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { StudentPageClient } from "./student-page-client"

const StudentPage = async () => {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/")
  }

  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const coursesWithPurchaseInfo = courses.map((course) => ({
      ...course,
      progress: null,
      isPurchased: course.purchases.length > 0,
    }))

    const purchasedCourses = coursesWithPurchaseInfo.filter(course => course.isPurchased)
    const availableCourses = coursesWithPurchaseInfo.filter(course => !course.isPurchased)

    return (
      <StudentPageClient 
        purchasedCourses={purchasedCourses}
        availableCourses={availableCourses}
      />
    )
  } catch (error) {
    console.error("[STUDENT_PAGE]", error)
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Oops, algo salió mal
          </h1>
          <p className="text-gray-400 mb-8">
            No pudimos cargar tus cursos. Por favor intenta de nuevo.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-full font-medium text-black bg-yellow-400 hover:bg-yellow-300 transition-all duration-300"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }
}

export default StudentPage