"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: initialData.isFree,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Capítulo actualizado");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el capítulo");
      console.error("Chapter update error:", error);
    }
  };

  return (
    <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-white">
        Configuración de Acceso
        <Button
          onClick={toggleEdit}
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-700"
          aria-label={isEditing ? "Cancelar edición" : "Habilitar edición"}
        >
          {isEditing ? (
            "Cancelar"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar Acceso
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2 text-slate-300">
          {initialData.isFree
            ? "✅ Este capítulo es gratuito"
            : "🔒 Acceso requerido para este capítulo"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-600 p-4 bg-slate-700/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Acceso gratuito"
                      className="border-slate-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription className="text-slate-300">
                      Marca esta opción para hacer el capítulo gratuito para todos los estudiantes
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};