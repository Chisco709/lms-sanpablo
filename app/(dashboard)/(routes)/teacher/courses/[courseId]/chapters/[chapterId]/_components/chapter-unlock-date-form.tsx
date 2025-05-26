"use client";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Calendar, Clock, CheckCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChapterUnlockDateFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  unlockDate: z.string().min(1, {
    message: "La fecha de desbloqueo es requerida",
  }),
});

export const ChapterUnlockDateForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterUnlockDateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unlockDate: initialData?.unlockDate 
        ? new Date(initialData.unlockDate).toISOString().slice(0, 16)
        : "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const unlockDate = new Date(values.unlockDate).toISOString();
      
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        unlockDate: unlockDate
      });
      
      toast.success("📅 Fecha de desbloqueo configurada exitosamente");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("❌ Error al configurar la fecha de desbloqueo");
    }
  };

  const onRemove = async () => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        unlockDate: null
      });
      
      toast.success("🗑️ Fecha de desbloqueo eliminada");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("❌ Error al eliminar la fecha de desbloqueo");
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isDateInFuture = (date: Date | string) => {
    return new Date(date) > new Date();
  };

  return (
    <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          <span>Fecha de Desbloqueo</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
          {isEditing ? (
            "Cancelar"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {initialData.unlockDate ? "Editar fecha" : "Configurar fecha"}
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {!initialData.unlockDate ? (
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Sin fecha de desbloqueo</h3>
                  <p className="text-slate-400 text-sm">
                    Este capítulo se desbloqueará según las reglas del curso
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`border rounded-lg p-4 ${
              isDateInFuture(initialData.unlockDate) 
                ? 'bg-yellow-500/10 border-yellow-500/30' 
                : 'bg-green-500/10 border-green-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isDateInFuture(initialData.unlockDate)
                      ? 'bg-yellow-500/20'
                      : 'bg-green-500/20'
                  }`}>
                    {isDateInFuture(initialData.unlockDate) ? (
                      <Clock className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">
                      {isDateInFuture(initialData.unlockDate) 
                        ? 'Se desbloqueará el:' 
                        : 'Desbloqueado desde:'
                      }
                    </h4>
                    <p className={`text-sm ${
                      isDateInFuture(initialData.unlockDate) 
                        ? 'text-yellow-300' 
                        : 'text-green-300'
                    }`}>
                      {formatDate(initialData.unlockDate)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onRemove}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:text-white hover:bg-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="unlockDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        type="datetime-local"
                        disabled={isSubmitting}
                        placeholder="Selecciona fecha y hora"
                        {...field}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      />
                      
                      {/* Botones de fecha rápida */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            tomorrow.setHours(9, 0, 0, 0);
                            field.onChange(tomorrow.toISOString().slice(0, 16));
                          }}
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          Mañana 9:00 AM
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nextWeek = new Date();
                            nextWeek.setDate(nextWeek.getDate() + 7);
                            nextWeek.setHours(9, 0, 0, 0);
                            field.onChange(nextWeek.toISOString().slice(0, 16));
                          }}
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          Próxima semana
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nextMonth = new Date();
                            nextMonth.setMonth(nextMonth.getMonth() + 1);
                            nextMonth.setHours(9, 0, 0, 0);
                            field.onChange(nextMonth.toISOString().slice(0, 16));
                          }}
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          Próximo mes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            field.onChange("");
                          }}
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          Limpiar
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Guardar fecha
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Información adicional */}
      <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-start gap-2 text-blue-400 text-sm">
          <Calendar className="h-4 w-4 mt-0.5" />
          <div>
            <p className="text-blue-200 font-medium mb-1">Información sobre fechas de desbloqueo:</p>
            <ul className="text-blue-300/80 space-y-1 text-xs">
              <li>• Los estudiantes verán cuándo se desbloqueará el capítulo</li>
              <li>• Si no configuras fecha, se usarán las reglas del curso</li>
              <li>• Los capítulos gratuitos siempre están disponibles</li>
              <li>• La fecha se muestra en hora de Colombia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 