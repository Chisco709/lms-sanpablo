import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ImageDebug } from "@/components/image-debug";

const DebugImagesPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  // Verificar que sea el usuario autorizado
  if (user.primaryEmailAddress?.emailAddress !== "chiscojjcm@gmail.com") {
    return redirect("/");
  }

  // Obtener todos los cursos del profesor
  const courses = await db.course.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          🐛 Debug Images
        </h1>
        <p className="text-slate-400">
          Debugging tool for course images - {courses.length} courses found
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{courses.length}</div>
          <div className="text-sm text-slate-400">Total Courses</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {courses.filter(c => c.imageUrl && c.imageUrl.trim() !== '').length}
          </div>
          <div className="text-sm text-slate-400">With Images</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {courses.filter(c => c.isPublished).length}
          </div>
          <div className="text-sm text-slate-400">Published</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {courses.filter(c => c.isPublished && c.imageUrl && c.imageUrl.trim() !== '').length}
          </div>
          <div className="text-sm text-slate-400">Published with Images</div>
        </div>
      </div>

      {/* Course Images Debug */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Course Images Debug</h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <ImageDebug
                key={course.id}
                courseId={course.id}
                imageUrl={course.imageUrl || ''}
                title={course.title}
              />
            ))}
          </div>
        )}
      </div>

      {/* Raw Data */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Raw Course Data</h2>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <pre className="text-xs text-slate-300 overflow-auto max-h-96">
            {JSON.stringify(courses, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugImagesPage; 