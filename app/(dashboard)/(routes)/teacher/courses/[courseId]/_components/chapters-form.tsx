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
    message: "El título es requerido",
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
      toast.success("Capítulo creado exitosamente");
      form.reset();
      setIsCreating(false);
      router.refresh();
    } catch (error) {
      toast.error("Algo salió mal");
      console.error("Error creating chapter:", error);
    }
  };

  // Handler para reordenar capítulos
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
        </div>
      )}
      
      <div className="font-medium flex items-center justify-between text-white">
        Capítulos del Curso
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          variant="ghost" 
          className="text-slate-300 hover:text-white"
        >
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
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-yellow-400"
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
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              Crear Capítulo
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.chapters.length && "text-slate-500 italic"
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
        <p className="text-xs text-slate-500 mt-4">
          Arrastra y suelta para reordenar los capítulos
        </p>
      )}
    </div>
  );
}; 