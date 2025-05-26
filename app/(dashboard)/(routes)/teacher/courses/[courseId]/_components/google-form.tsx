"use client";

import axios from "axios";
import { Pencil, ExternalLink, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface GoogleFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    googleFormUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal(""))
});

export const GoogleForm = ({
    initialData,
    courseId
}: GoogleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            googleFormUrl: initialData?.googleFormUrl || ""
        }
    });

    const { isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Formulario de Google actualizado");
            setIsEditing(false);
            router.refresh();
        } catch {
            toast.error("Error al actualizar");
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeForm = async () => {
        try {
            setIsSubmitting(true);
            await axios.patch(`/api/courses/${courseId}`, { googleFormUrl: null });
            toast.success("Formulario de Google eliminado");
            setIsEditing(false);
            router.refresh();
        } catch {
            toast.error("Error al eliminar");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValidGoogleFormUrl = (url: string) => {
        return url.includes('docs.google.com/forms') || url.includes('forms.gle');
    };

    return (
        <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
            <div className="font-medium flex items-center justify-between text-white">
                Formulario de Google
                <Button
                    onClick={toggleEdit}
                    variant="ghost"
                    disabled={isSubmitting}
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                    {isEditing ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            {initialData.googleFormUrl ? "Editar" : "Agregar"} formulario
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <div className="mt-4">
                    {!initialData.googleFormUrl ? (
                        <p className="text-sm text-slate-400 italic">
                            No hay formulario de Google configurado
                        </p>
                    ) : (
                        <div className="flex items-center p-4 w-full bg-slate-700/50 border border-slate-600 rounded-lg group hover:bg-slate-600/50 transition-all duration-200">
                            {/* Icono */}
                            <div className="flex-shrink-0 mr-4">
                                <div className="h-16 w-16 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-green-400" />
                                </div>
                            </div>

                            {/* Información */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-slate-200 mb-1">
                                    Formulario de Google Forms
                                </h4>
                                <p className="text-xs text-slate-400 mb-2">
                                    Formulario interactivo para estudiantes
                                </p>
                                
                                {/* Botones de acción */}
                                <div className="flex gap-2">
                                    <a
                                        href={initialData.googleFormUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        Abrir formulario
                                    </a>
                                </div>
                            </div>

                            {/* Botón eliminar */}
                            <button
                                onClick={removeForm}
                                className="ml-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-500/20"
                                disabled={isSubmitting}
                                title="Eliminar formulario"
                                aria-label="Eliminar formulario"
                            >
                                <X className="h-4 w-4 text-red-400 hover:text-red-300"/>
                            </button>
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
                            name="googleFormUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="https://docs.google.com/forms/d/..."
                                            {...field}
                                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-yellow-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        
                        <div className="text-xs text-slate-400 p-3 bg-slate-700/30 rounded-lg">
                            <p className="font-medium mb-2">Instrucciones:</p>
                            <ul className="space-y-1">
                                <li>• Crea un formulario en <span className="text-green-400">Google Forms</span></li>
                                <li>• Haz clic en &quot;Enviar&quot; y copia el enlace</li>
                                <li>• Pega la URL completa aquí</li>
                                <li>• Los estudiantes podrán acceder al formulario desde el curso</li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}; 