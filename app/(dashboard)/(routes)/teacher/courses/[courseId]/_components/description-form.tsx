"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {Pencil} from "lucide-react";
import { useRouter } from "next/navigation" 

import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormItem,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast"
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";

interface DescriptionFormProps {
    initialData: Course
    courseId: string;
}

const formSchema = z.object({
    description: z.string().min(1, {
        message: "La descripción es requerida",
    })
})

export const DescriptionForm = ({
    initialData,
    courseId
}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""    
        }, 
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Descripción actualizada exitosamente")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Algo salió mal")
        }
    }

    return(
         <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
            <div className="font-medium flex items-center justify-between text-white">
                Descripción del Curso
                <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white">
                    {isEditing ? (
                        <>Cancelar</>
                    )  : (
                        <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Editar Descripción
                    </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic",
                    initialData.description && "text-slate-300"
                )}>
                    {initialData.description || "Sin descripción"}
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
                        name="description"
                        render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Textarea 
                                disabled={isSubmitting}
                                placeholder="Ej: 'Este curso se trata sobre...'"
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-yellow-400 resize-none"
                                {...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>    
                        )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                            >
                                Guardar
                            </Button>
                        </div>
                        
                    </form>
                </Form>
            )}
        </div>
    ) 
}