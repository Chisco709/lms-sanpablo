import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/search">
          <Button className="w-full h-32 text-xl">Buscar cursos</Button>
        </Link>
        <Link href="/teacher/courses">
          <Button className="w-full h-32 text-xl" variant="secondary">
            Teacher mode
          </Button>
        </Link>
      </div>
      {/* Aquí puedes agregar más widgets o cards como en Browse */}
    </main>
  );
}