"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    BookOpen, 
    Save,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { use } from "react";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

export default function CreateChapterPage({ params }: PageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resolvedParams = use(params);
    const courseId = resolvedParams.courseId;
    const topicId = searchParams.get('topicId'); // Si viene de un tema del pensum
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isFree, setIsFree] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error("❌ El título es requerido");
            return;
        }

        try {
            setSaving(true);
            console.log("🚀 Creando capítulo...", { title, description, topicId });
            
            const payload = {
                title: title.trim(),
                description: description.trim() || null,
                isFree,
                ...(topicId && { pensumTopicId: topicId })
            };

            const response = await axios.post(`/api/courses/${courseId}/chapters`, payload);
            console.log("✅ Capítulo creado:", response.data);
            
            toast.success("🎉 ¡Clase creada exitosamente!");
            
            // Redirigir a la página de edición del capítulo
            router.push(`/teacher/courses/${courseId}/chapters/${response.data.id}`);
            
        } catch (error) {
            console.error("❌ Error al crear capítulo:", error);
            if (axios.isAxiosError(error)) {
                toast.error(`❌ Error: ${error.response?.data?.message || "Error al crear la clase"}`);
            } else {
                toast.error("❌ Error al crear la clase");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
            {/* Efectos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-10 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Link href={`/teacher/courses/${courseId}`}>
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver al curso
                            </Button>
                        </Link>
                        <div className="p-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl">
                            <BookOpen className="h-6 w-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Crear Nueva Clase
                            </h1>
                            <p className="text-slate-400">
                                Completa la información básica para tu nueva clase
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Formulario */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Título */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-slate-300">
                                    Título de la clase *
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Introducción a los fundamentos neurobiológicos"
                                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400"
                                    disabled={saving}
                                />
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-slate-300">
                                    Descripción (opcional)
                                </Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe brevemente el contenido de esta clase..."
                                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 min-h-24"
                                    disabled={saving}
                                />
                            </div>

                            {/* Acceso gratuito */}
                            <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-600">
                                <div className="space-y-1">
                                    <Label htmlFor="isFree" className="text-sm font-medium text-white">
                                        Acceso gratuito
                                    </Label>
                                    <p className="text-xs text-slate-400">
                                        Permitir que cualquier persona vea esta clase sin comprar el curso
                                    </p>
                                </div>
                                <Switch
                                    id="isFree"
                                    checked={isFree}
                                    onCheckedChange={setIsFree}
                                    disabled={saving}
                                />
                            </div>

                            {/* Información adicional */}
                            {topicId && (
                                <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-blue-400" />
                                    <p className="text-sm text-blue-300">
                                        Esta clase será asociada al tema del pensum seleccionado
                                    </p>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex gap-4 pt-6">
                                <Link href={`/teacher/courses/${courseId}`} className="flex-1">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                                        disabled={saving}
                                    >
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold"
                                    disabled={saving || !title.trim()}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Crear Clase
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 