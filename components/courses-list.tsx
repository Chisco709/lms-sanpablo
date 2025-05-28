import { Category, Course } from "@prisma/client"
import { CourseCard } from "@/components/course-card"

type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
  isPurchased?: boolean
}

interface CoursesListProps {
  items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl || "/placeholder-course.jpg"}
            chaptersLength={item.chapters.length}
            price={item.price || 0}
            progress={item.progress}
            category={item?.category?.name || "Sin categoría"}
            isPurchased={item.isPurchased}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-lg text-gray-400 mt-12 py-8">
          <p className="font-medium">No se encontraron cursos disponibles</p>
        </div>
      )}
    </div>
  )
} 