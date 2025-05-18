"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chapter } from "@prisma/client";

// Regex mejorado para YouTube
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&\S*)?$/;

const formSchema = z.object({
  videoUrl: z.string()
    .min(1, "Se requiere un enlace de YouTube")
    .regex(YOUTUBE_REGEX, "Formato inválido. Ejemplo válido: https://youtu.be/ABCD1234")
});

type FormValues = z.infer<typeof formSchema>;

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, formState: { isSubmitting, isValid }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { videoUrl: initialData.videoUrl || "" }
  });

  const videoUrl = watch("videoUrl");

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:v=|\/)([\w-]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Video actualizado");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Error al guardar");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video del capítulo
        <Button 
          onClick={() => setIsEditing(!isEditing)} 
          variant="ghost"
          aria-label={isEditing ? "Cancelar" : "Editar"}
        >
          {isEditing ? (
            "Cancelar"
          ) : initialData.videoUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Cambiar video
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar video
            </>
          )}
        </Button>
      </div>

      {!isEditing && initialData.videoUrl && (
        <div className="relative aspect-video mt-4">
          <iframe
            src={getYouTubeEmbedUrl(initialData.videoUrl)!}
            className="w-full h-full rounded-lg shadow-md"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Controller
            name="videoUrl"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Input
                  {...field}
                  placeholder="Ej: https://youtu.be/ABCD1234"
                  className="w-full"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                )}
                {videoUrl && getYouTubeEmbedUrl(videoUrl) && (
                  <div className="aspect-video mt-4">
                    <iframe
                      src={getYouTubeEmbedUrl(videoUrl)!}
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}
          />
          
          <div className="flex gap-2">
            <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-slate-800 hover:bg-slate-900 text-white" // Cambia estas clases
            >
  {isSubmitting ? "Guardando..." : "Guardar cambios"}
</Button>
          </div>
        </form>
      )}
    </div>
  );
};