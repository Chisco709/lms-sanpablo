import { Course } from "@prisma/client"
import { CourseCardV2 } from "@/components/course-card-v2"
import { memo } from "react"

type CourseWithProgress = Course & {
  chapters: { id: string }[]
  progress: number | null
  isPurchased?: boolean
}

interface CoursesListProps {
  items: CourseWithProgress[]
}

export const CoursesList = memo(({ items }: CoursesListProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center text-lg text-gray-400 mt-12 py-8" role="status" aria-live="polite">
        <p className="font-medium">No se encontraron cursos disponibles</p>
      </div>
    )
  }

  return (
    <section aria-label="Lista de cursos disponibles">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item) => (
          <CourseCardV2
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl || "/logo-sanpablo.jpg"}
            chaptersLength={item.chapters.length}
            progress={item.progress}
            description={item.description || undefined}
            isPurchased={item.isPurchased}
          />
        ))}
      </div>
    </section>
  )
})

CoursesList.displayName = 'CoursesList'