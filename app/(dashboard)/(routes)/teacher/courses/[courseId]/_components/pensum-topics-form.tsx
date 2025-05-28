"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, BookOpen, GripVertical, Trash2, Eye, EyeOff, BarChart3, Copy } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Course, PensumTopic } from "@prisma/client";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PensumTopicsFormProps {
  initialData: Course & { pensumTopics: (PensumTopic & { chapters: any[] })[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "El título del tema es requerido",
  }),
});

export const PensumTopicsForm = ({
  initialData,
  courseId
}: PensumTopicsFormProps) => {
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
      await axios.post(`/api/courses/${courseId}/pensum-topics`, values);
      toast.success("Tema del pensum creado exitosamente");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/pensum-topics/reorder`, {
        list: updateData
      });
      toast.success("Temas reordenados");
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/pensum-topics/${id}`);
  };

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/pensum-topics/${id}`);
      toast.success("Tema eliminado exitosamente");
      router.refresh();
    } catch {
      toast.error("Error al eliminar el tema");
    }
  };

  const onTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/pensum-topics/${id}/unpublish`);
        toast.success("Tema despublicado");
      } else {
        await axios.patch(`/api/courses/${courseId}/pensum-topics/${id}/publish`);
        toast.success("Tema publicado");
      }
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  };

  const onDuplicate = async (topic: PensumTopic & { chapters: any[] }) => {
    try {
      await axios.post(`/api/courses/${courseId}/pensum-topics`, {
        title: `${topic.title} (Copia)`
      });
      toast.success("Tema duplicado exitosamente");
      router.refresh();
    } catch {
      toast.error("Error al duplicar el tema");
    }
  };

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  // Estadísticas
  const totalTopics = initialData.pensumTopics.length;
  const publishedTopics = initialData.pensumTopics.filter(topic => topic.isPublished).length;
  const totalChapters = initialData.pensumTopics.reduce((acc, topic) => acc + (topic.chapters?.length || 0), 0);

  return (
    <div className="relative mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
        </div>
      )}
      
      {/* Header con estadísticas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">Temas del Pensum</span>
          </div>
          <Button onClick={toggleCreating} variant="ghost" className="text-slate-300 hover:text-white">
            {isCreating ? (
              <>Cancelar</>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar tema
              </>
            )}
          </Button>
        </div>

        {/* Estadísticas */}
        {totalTopics > 0 && (
          <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Estadísticas:</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-300">
                <strong className="text-white">{totalTopics}</strong> tema{totalTopics !== 1 ? 's' : ''}
              </span>
              <span className="text-emerald-300">
                <strong className="text-emerald-400">{publishedTopics}</strong> publicado{publishedTopics !== 1 ? 's' : ''}
              </span>
              <span className="text-blue-300">
                <strong className="text-blue-400">{totalChapters}</strong> clase{totalChapters !== 1 ? 's' : ''} total
              </span>
            </div>
          </div>
        )}
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
                      placeholder="Ej: 'Neurodidáctica (Pedagógica, Psicológica y Didáctica)'"
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
              Crear tema
            </Button>
          </form>
        </Form>
      )}
      
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.pensumTopics.length && "text-slate-500 italic"
        )}>
          {!initialData.pensumTopics.length && "No hay temas del pensum"}
          
          <div className="space-y-2 mt-2">
            {initialData.pensumTopics.map((topic) => (
              <div
                key={topic.id}
                className={cn(
                  "flex items-center gap-2 bg-slate-700 border-slate-600 border text-slate-300 rounded-md text-sm p-3",
                  topic.isPublished && "bg-emerald-800/50 border-emerald-600 text-emerald-300"
                )}
              >
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">{topic.title}</span>
                  {topic.isPublished && (
                    <Badge className="bg-emerald-500 text-white text-xs">
                      Publicado
                    </Badge>
                  )}
                  <Badge className="bg-blue-500 text-white text-xs">
                    {topic.chapters?.length || 0} clase{(topic.chapters?.length || 0) !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => onEdit(topic.id)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => onDuplicate(topic)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => onTogglePublish(topic.id, topic.isPublished)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    {topic.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-slate-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-300">
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el tema
                          &quot;{topic.title}&quot; y todas sus clases asociadas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(topic.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!isCreating && initialData.pensumTopics.length > 0 && (
        <p className="text-xs text-slate-500 mt-4">
          Arrastra y suelta para reordenar los temas
        </p>
      )}
    </div>
  );
}; 