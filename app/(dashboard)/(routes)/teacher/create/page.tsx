"use client";

import * as z from "zod";
import axios from "axios"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,

} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1,{
        message: "Title is required",
    }),
})


const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    })
    
    const { isSubmitting, isValid } = form.formState;

    const onSubmit =async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values)
            router.push(`/teacher/courses/${response.data.id}`)
            toast.success("Curso creado") 

        
        
        
        } catch {
            toast.error("Algo esta fallando")
        }
    } 
    
    return(
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Crear Nuevo Curso
                    </h1>
                    <p className="text-sm text-slate-400">
                        ¿Cómo te gustaría llamar tu curso? No te preocupes, lo puedes cambiar después
                    </p>
                </div>
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">
                                <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-white font-medium">
                                            Título del curso
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                            disabled={isSubmitting}
                                            placeholder="ej. 'Desarrollo Web Avanzado'"
                                            className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400"
                                            {...field }/>
                                        </FormControl>
                                        <FormDescription className="text-slate-400">
                                            ¿Qué quieres enseñar en este curso?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <div className="flex items-center gap-x-3 pt-4">
                                    <Link href="/teacher/courses">
                                        <Button
                                        type="button"
                                        variant="outline"
                                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className="bg-green-500 hover:bg-green-400 text-black font-medium">
                                        {isSubmitting ? "Creando..." : "Continuar"}
                                    </Button>
                                </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
export default CreatePage