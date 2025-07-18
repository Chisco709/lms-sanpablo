"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, BookOpen, Edit, Grip, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chapter, PensumTopic } from "@prisma/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  pensumTopicId: z.string().min(1, "Debes seleccionar un tema del pensum"),
});

interface ChaptersListProps {
  initialData: Chapter[];
  courseId: string;
  pensumTopics?: PensumTopic[];
}

export const ChaptersList = ({
  initialData,
  courseId,
  pensumTopics = []
}: ChaptersListProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      pensumTopicId: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const hasPensumTopics = pensumTopics && pensumTopics.length > 0;

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
        
        {hasPensumTopics ? (
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
        ) : (
          <div className="text-slate-500 text-sm">
            Primero crea temas de pensum
          </div>
        )}
      </div>

      {/* Mensaje cuando no hay temas de pensum */}
      {!hasPensumTopics && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-400 font-medium mb-2">
                ⚡ Flujo de trabajo mejorado
              </h3>
              <div className="text-yellow-300/80 text-sm space-y-1">
                <p><strong>1. Crea temas de pensum primero</strong> (ej: "Fundamentos", "Práctica")</p>
                <p><strong>2. Luego crea capítulos</strong> y asígnalos a cada tema</p>
                <p><strong>3. Organiza mejor</strong> el contenido para los estudiantes</p>
              </div>
              <p className="text-yellow-400 text-sm mt-3">
                👆 Desplázate hacia abajo para crear tu primer tema de pensum
              </p>
            </div>
          </div>
        </div>
      )}

      {isCreating && hasPensumTopics && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600"
          >
            <FormField
              control={form.control}
              name="pensumTopicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Tema del pensum</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue placeholder="Selecciona un tema del pensum" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pensumTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Título del capítulo</FormLabel>
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
                Crear capítulo
              </Button>
            </div>
          </form>
        </Form>
      )}

      <div className={cn(
        "space-y-2",
        isUpdating && "pointer-events-none opacity-60"
      )}>
        {initialData.length === 0 && hasPensumTopics && (
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