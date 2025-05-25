"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Componentes UI
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Otros
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { ChaptersList } from "./chapters-list";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "El título es requerido", // Mejor mensaje de error
  }),
});

export const ChaptersForm = ({
  initialData,
  courseId,
}: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // Handler para crear capítulo
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Capítulo creado");
      form.reset(); // Limpiar el formulario después de enviar
      setIsCreating(false);
      router.refresh();
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
      console.error("Error creating chapter:", error);
    }
  };

  // Handler para reordenar capítulos
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, { // Corregido: await axios.put
        list: updateData,
      });
      toast.success("Capítulos reordenados");
      router.refresh();
    } catch (error) {
      toast.error("Error al reordenar capítulos");
      console.error("Error reordering chapters:", error);
    } finally {
      setIsUpdating(false);
    }
  };



  return (
    <div className="relative mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-emerald-400"/>
        </div>
      )}
      
      <div className="font-medium flex items-center justify-between text-white">
        Capítulos del Curso
        <Button onClick={() => setIsCreating(!isCreating)} variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
          {isCreating ? (
            "Cancelar"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Añadir Capítulo
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Ej: 'Introducción al curso...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Crear Capítulo
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.chapters.length && "text-slate-400 italic"
        )}>
          {!initialData.chapters.length && "No hay capítulos"}
          <ChaptersList
            onEdit={(id: string) => router.push(`/teacher/courses/${courseId}/chapters/${id}`)}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}

      {!isCreating && initialData.chapters.length > 0 && (
        <p className="text-xs text-slate-400 mt-4">
          Arrastra y suelta para reordenar los capítulos
        </p>
      )}
    </div>
  );
}; 