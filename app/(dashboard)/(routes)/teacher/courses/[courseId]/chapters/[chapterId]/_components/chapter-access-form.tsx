"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  isFree: z.boolean()
});

type FormData = {
  isFree: boolean;
};

interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: Boolean(initialData.isFree)
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormData) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Capítulo actualizado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Error al actualizar el capítulo");
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Configuración de acceso
        </h3>
        <Button onClick={toggleEdit} variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          {isEditing ? (
            "Cancelar"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar acceso
            </>
          )}
        </Button>
      </div>
      
      {!isEditing && (
        <p className={cn(
          "text-sm",
          initialData.isFree ? "text-green-400" : "text-yellow-400"
        )}>
          {initialData.isFree
            ? "Este capítulo es gratuito para todos"
            : "Este capítulo requiere inscripción al curso"
          }
        </p>
      )}
      
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-600 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-slate-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription className="text-white">
                      Marcar este capítulo como gratuito
                    </FormDescription>
                    <FormDescription className="text-slate-400 text-xs">
                      Los capítulos gratuitos son visibles para todos los usuarios sin necesidad de inscripción
                    </FormDescription>
                  </div>
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
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}; 