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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast"

interface ChapterTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    chapterId: string
}

const formSchema = z.object({
    title: z.string().min(1)
})

export const ChapterTitleForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);


    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData, 
    })


    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Título del capítulo actualizado")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Algo malo esta pasando")
        }
    }

    return(
         <div className="mt-6 border border-slate-700 bg-slate-800/50 rounded-md p-4">
            <div className="font-medium flex items-center justify-between text-white">
                Título del Capítulo
                <Button onClick={toggleEdit} variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                    {isEditing ? (
                        <>Cancelar</>
                    )  : (
                        <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Editar Título
                    </>

                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2 text-slate-300">
                    {initialData.title}
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
                        name="title"
                        render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                disabled={isSubmitting}
                                placeholder="e.g 'Introducción al curso'"
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
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