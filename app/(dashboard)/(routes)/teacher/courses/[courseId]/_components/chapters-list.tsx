"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, BookOpen, Edit, Eye, EyeOff, Grip, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Chapter } from "@prisma/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
});

interface ChaptersListProps {
  initialData: Chapter[];
  courseId: string;
}

export const ChaptersList = ({
  initialData,
  courseId
}: ChaptersListProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Capítulo creado");
      form.reset();
      setIsCreating(false);
      router.refresh();
    } catch {
      toast.error("Error al crear el capítulo");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      });
      toast.success("Capítulos reordenados");
      router.refresh();
    } catch {
      toast.error("Error al reordenar capítulos");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-green-400" />
          Capítulos del curso
        </h2>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white"
        >
          {isCreating ? "Cancelar" : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Agregar capítulo
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Ej: Introducción al tema"
                      className="bg-slate-900 border-slate-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Crear
              </Button>
            </div>
          </form>
        </Form>
      )}

      <div className={cn(
        "space-y-2",
        isUpdating && "pointer-events-none opacity-60"
      )}>
        {initialData.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">No hay capítulos creados</p>
            <p className="text-slate-500 text-sm">Agrega el primer capítulo para comenzar</p>
          </div>
        )}

        {initialData.map((chapter) => (
          <div
            key={chapter.id}
            className={cn(
              "flex items-center gap-x-2 bg-slate-700/50 border border-slate-600 rounded-lg p-3",
              chapter.isPublished && "border-green-500/30 bg-green-500/10"
            )}
          >
            <div className="flex items-center gap-x-2 flex-1">
              <Grip className="h-4 w-4 text-slate-400 cursor-move" />
              <span className="text-slate-300 text-sm">
                {chapter.title}
              </span>
              
              <div className="ml-auto flex items-center gap-x-2">
                {chapter.isFree && (
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                    Gratis
                  </span>
                )}
                
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full border",
                  chapter.isPublished 
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                )}>
                  {chapter.isPublished ? "Publicado" : "Borrador"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-x-1">
              <Button
                onClick={() => onEdit(chapter.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {initialData.length > 0 && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            💡 Arrastra los capítulos para reordenarlos. Haz clic en "Editar" para agregar contenido.
          </p>
        </div>
      )}
    </div>
  );
}; 