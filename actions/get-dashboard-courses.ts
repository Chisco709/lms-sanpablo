import { Category, Course } from "@prisma/client"
import { getProgress } from "@/actions/get-progress"
import { db } from "@/lib/db"

type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
}

type GetDashboardCourses = {
  userId: string
}

export const getDashboardCourses = async ({
  userId,
}: GetDashboardCourses): Promise<{
  completedCourses: CourseWithProgressWithCategory[]
  coursesInProgress: CourseWithProgressWithCategory[]
}> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    })

    const coursesWithProgress: CourseWithProgressWithCategory[] = []

    for (const purchase of purchasedCourses) {
      const progress = await getProgress(userId, purchase.course.id)
      
      const courseWithProgress: CourseWithProgressWithCategory = {
        ...purchase.course,
        progress
      }
      
      coursesWithProgress.push(courseWithProgress)
    }

    const completedCourses = coursesWithProgress.filter((course) => course.progress === 100)
    const coursesInProgress = coursesWithProgress.filter(
      (course) => (course.progress ?? 0) < 100
    )

    return {
      completedCourses,
      coursesInProgress,
    }
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error)
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
} 