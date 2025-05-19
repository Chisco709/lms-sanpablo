

import { auth } from "@clerk/nextjs/server";
import LandingPage from "../components/landing-page";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <LandingPage />;
  }

  // Dashboard de estudiante con el mismo diseño que Browse
  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* Puedes poner aquí el UserButton si quieres */}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/search">
          <div className="w-full h-32 flex items-center justify-center bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer text-xl font-semibold border border-gray-200">
            Buscar cursos
          </div>
        </Link>
        <Link href="/teacher/courses">
          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-xl font-semibold border border-gray-200">
            Teacher mode
          </div>
        </Link>
      </div>
      {/* Aquí puedes agregar más widgets o cards como en Browse */}
    </main>
  );
}
