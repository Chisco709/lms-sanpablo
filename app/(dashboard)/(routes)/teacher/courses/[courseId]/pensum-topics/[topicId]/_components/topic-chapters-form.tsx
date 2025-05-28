"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, Video, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chapter, PensumTopic } from "@prisma/client";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TopicChaptersFormProps {
  initialData: PensumTopic & { chapters: Chapter[] };
  courseId: string;
  topicId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "El título de la clase es requerido",
  }),
});

export const TopicChaptersForm = ({
  initialData,
  courseId,
  topicId
}: TopicChaptersFormProps) => {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, {
        ...values,
        pensumTopicId: topicId
      });
      toast.success("Clase creada exitosamente");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${id}`);
      toast.success("Clase eliminada");
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  };

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  return (
    <div className="relative mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
        </div>
      )}
      <div className="font-medium flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          Clases del tema
        </div>
        <Button onClick={toggleCreating} variant="ghost" className="text-slate-300 hover:text-white">
          {isCreating ? (
            <>Cancelar</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar clase
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
                      placeholder="Ej: 'Fundamentos neurobiológicos y neuropsicológicos de los procesos cognitivos'"
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
              Crear clase
            </Button>
          </form>
        </Form>
      )}
      
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.chapters.length && "text-slate-500 italic"
        )}>
          {!initialData.chapters.length && "No hay clases en este tema"}
          
          <div className="space-y-2 mt-2">
            {initialData.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={cn(
                  "flex items-center gap-2 bg-slate-700 border-slate-600 border text-slate-300 rounded-md text-sm p-3",
                  chapter.isPublished && "bg-emerald-800/50 border-emerald-600 text-emerald-300"
                )}
              >
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">{chapter.title}</span>
                  {chapter.isPublished && (
                    <Badge className="bg-emerald-500 text-white text-xs">
                      Publicado
                    </Badge>
                  )}
                  {chapter.isFree && (
                    <Badge className="bg-green-500 text-white text-xs">
                      Gratis
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => onEdit(chapter.id)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(chapter.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!isCreating && initialData.chapters.length > 0 && (
        <p className="text-xs text-slate-500 mt-4">
          Arrastra y suelta para reordenar las clases
        </p>
      )}
    </div>
  )
} 