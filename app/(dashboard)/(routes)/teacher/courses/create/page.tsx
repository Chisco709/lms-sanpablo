"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
});

const CreateCoursePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Curso creado exitosamente");
    } catch {
      toast.error("Error al crear el curso");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/teacher/courses">
          <Button variant="ghost" className="text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Cursos
          </Button>
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Crear Nuevo Curso
            </h1>
            <p className="text-slate-400">
              Comienza creando un título para tu curso
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Título del Curso
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Ej: Introducción a la Pedagogía Infantil"
                      className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-blue-400 font-medium mb-2">💡 Sugerencias</h3>
              <ul className="text-sm text-blue-300/80 space-y-1">
                <li>• Usa un título claro y descriptivo</li>
                <li>• Incluye el nivel o área de conocimiento</li>
                <li>• Evita títulos muy largos</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="border-slate-600 text-slate-300 hover:border-slate-500"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "Creando..." : "Crear Curso"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-slate-800/30 border border-slate-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">Próximos pasos</h3>
        <p className="text-slate-400 text-sm">
          Después de crear el curso, podrás agregar una descripción, imagen, 
          categoría y comenzar a crear capítulos con contenido.
        </p>
      </div>
    </div>
  );
};

export default CreateCoursePage; 