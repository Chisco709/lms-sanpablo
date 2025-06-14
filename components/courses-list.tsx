import { Category, Course } from "@prisma/client"
import { CourseCard } from "@/components/course-card"
import { memo } from "react"

type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
  isPurchased?: boolean
}

interface CoursesListProps {
  items: CourseWithProgressWithCategory[]
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
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl || "/logo-sanpablo.jpg"}
            chaptersLength={item.chapters.length}
            price={item.price || 0}
            progress={item.progress}
            category={item?.category?.name || "Sin categoría"}
            description={item.description || undefined}
            isPurchased={item.isPurchased}
          />
        ))}
      </div>
    </section>
  )
})

CoursesList.displayName = 'CoursesList'