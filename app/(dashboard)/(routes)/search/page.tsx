import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { SearchInput } from "@/components/search-input"
import { getCourses } from "@/actions/get-courses"
import { CoursesList } from "@/components/courses-list"
import { Categories } from "./_components/categories"

interface SearchPageProps {
  searchParams: Promise<{
    title?: string
    categoryId?: string
  }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/")
  }

  const resolvedSearchParams = await searchParams

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const courses = await getCourses({ userId: user.id,
    ...resolvedSearchParams,
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Explora Nuestros <span className="text-yellow-400">Cursos</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descubre una amplia variedad de cursos diseñados para impulsar tu carrera profesional
          </p>
        </div>
        
        <Categories items={categories} />
        <CoursesList items={courses} />
        
        {courses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No se encontraron cursos
            </h3>
            <p className="text-gray-400">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage