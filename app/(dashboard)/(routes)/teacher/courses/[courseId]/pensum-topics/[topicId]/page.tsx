"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft,
    Save,
    Trash2,
    Plus,
    Edit3,
    BookOpen,
    Eye,
    CheckCircle,
    Clock,
    Layers,
    PlayCircle,
    FileText,
    Settings,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

// Tipos
interface PensumTopic {
    id: string;
    title: string;
    description: string | null;
    position: number;
    isPublished: boolean;
    courseId: string;
    chapters: Chapter[];
}

interface Chapter {
    id: string;
    title: string;
    description: string | null;
    isPublished: boolean;
    isFree: boolean;
    position: number;
    videoUrl: string | null;
    pdfUrl: string | null;
    googleFormUrl: string | null;
}

interface Course {
    id: string;
    title: string;
}

export default function PensumTopicEditPage() {
    const router = useRouter();
    const [topic, setTopic] = useState<PensumTopic | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValues, setTempValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    // Obtener IDs de la URL
    const pathSegments = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
    const courseId = pathSegments[pathSegments.indexOf('courses') + 1];
    const topicId = pathSegments[pathSegments.indexOf('pensum-topics') + 1];

    useEffect(() => {
        if (courseId && topicId) {
            fetchData();
        }
    }, [courseId, topicId]);

    const fetchData = async () => {
        try {
            const [topicResponse, courseResponse] = await Promise.all([
                axios.get(`/api/courses/${courseId}/pensum-topics/${topicId}`),
                axios.get(`/api/courses/${courseId}`)
            ]);
            setTopic(topicResponse.data);
            setCourse(courseResponse.data);
        } catch (error) {
            toast.error("Error al cargar los datos");
            router.push(`/teacher/courses/${courseId}`);
        } finally {
            setLoading(false);
        }
    };

    const updateField = async (field: string, value: any) => {
        if (!topic) return;
        
        try {
            setSaving(true);
            await axios.patch(`/api/courses/${courseId}/pensum-topics/${topicId}`, { [field]: value });
            setTopic({ ...topic, [field]: value });
            setEditingField(null);
            setTempValues({});
            toast.success("Campo actualizado exitosamente");
        } catch (error) {
            toast.error("Error al actualizar");
        } finally {
            setSaving(false);
        }
    };

    const publishTopic = async () => {
        try {
            setSaving(true);
            const endpoint = topic?.isPublished ? "unpublish" : "publish";
            await axios.patch(`/api/courses/${courseId}/pensum-topics/${topicId}/${endpoint}`);
            setTopic(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null);
            toast.success(topic?.isPublished ? "Tema despublicado" : "¡Tema publicado!");
        } catch (error) {
            toast.error("Error al cambiar estado de publicación");
        } finally {
            setSaving(false);
        }
    };

    const deleteTopic = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar este tema?")) return;
        
        try {
            setSaving(true);
            await axios.delete(`/api/courses/${courseId}/pensum-topics/${topicId}`);
            toast.success("Tema eliminado");
            router.push(`/teacher/courses/${courseId}`);
        } catch (error) {
            toast.error("Error al eliminar el tema");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!topic || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <Target className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Tema no encontrado</h2>
                    <Link href={`/teacher/courses/${courseId}`}>
                        <Button className="bg-green-500 hover:bg-green-600 text-black">
                            Volver al curso
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link href={`/teacher/courses/${courseId}`}>
                                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver al curso
                                </Button>
                            </Link>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl">
                                        <Layers className="h-6 w-6 text-black" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">
                                            {topic.title}
                                        </h1>
                                        <p className="text-slate-400">
                                            Tema del curso: {course.title}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={topic.isPublished ? "default" : "secondary"} className={
                                        topic.isPublished 
                                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    }>
                                        {topic.isPublished ? (
                                            <>
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Publicado
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="h-3 w-3 mr-1" />
                                                Borrador
                                            </>
                                        )}
                                    </Badge>
                                    <span className="text-slate-400 text-sm">
                                        {topic.chapters.length} clases asociadas
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={publishTopic}
                                disabled={saving}
                                className={
                                    topic.isPublished
                                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                                        : "bg-green-500 hover:bg-green-600 text-black"
                                }
                            >
                                {topic.isPublished ? "Despublicar" : "Publicar"}
                            </Button>
                            <Button
                                onClick={deleteTopic}
                                disabled={saving}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Información del tema */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Edit3 className="h-5 w-5 text-green-400" />
                                Información del Tema
                            </h3>

                            {/* Título */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-slate-400 mb-2 block">
                                    Título del tema
                                </label>
                                {editingField === "title" ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={tempValues.title || topic.title}
                                            onChange={(e) => setTempValues({...tempValues, title: e.target.value})}
                                            className="bg-slate-900/50 border-slate-600 text-white"
                                            placeholder="Título del tema"
                                        />
                                        <Button
                                            onClick={() => updateField("title", tempValues.title)}
                                            disabled={saving}
                                            size="sm"
                                            className="bg-green-500 hover:bg-green-600 text-black"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => {
                                            setEditingField("title");
                                            setTempValues({title: topic.title});
                                        }}
                                        className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 cursor-pointer hover:border-green-400 transition-colors"
                                    >
                                        <p className="text-white">{topic.title}</p>
                                    </div>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-slate-400 mb-2 block">
                                    Descripción
                                </label>
                                {editingField === "description" ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            value={tempValues.description || topic.description || ""}
                                            onChange={(e) => setTempValues({...tempValues, description: e.target.value})}
                                            className="bg-slate-900/50 border-slate-600 text-white min-h-24"
                                            placeholder="Descripción del tema"
                                            rows={4}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => updateField("description", tempValues.description)}
                                                disabled={saving}
                                                size="sm"
                                                className="bg-green-500 hover:bg-green-600 text-black"
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => setEditingField(null)}
                                                size="sm"
                                                variant="outline"
                                                className="border-slate-600 text-slate-300"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => {
                                            setEditingField("description");
                                            setTempValues({description: topic.description || ""});
                                        }}
                                        className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 cursor-pointer hover:border-green-400 transition-colors min-h-24"
                                    >
                                        <p className="text-white">
                                            {topic.description || "Haz clic para agregar una descripción del tema"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Posición */}
                            <div>
                                <label className="text-sm font-medium text-slate-400 mb-2 block">
                                    Posición en el curso
                                </label>
                                <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-600">
                                    <p className="text-white">
                                        Tema #{topic.position}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Clases del tema */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <PlayCircle className="h-5 w-5 text-yellow-400" />
                                    Clases del Tema
                                </h3>
                                <Link href={`/teacher/courses/${courseId}/chapters/create?topicId=${topicId}`}>
                                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Clase
                                    </Button>
                                </Link>
                            </div>

                            {topic.chapters.length > 0 ? (
                                <div className="space-y-4">
                                    {topic.chapters.map((chapter, index) => (
                                        <motion.div
                                            key={chapter.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-4 bg-slate-900/30 rounded-xl border border-slate-600 hover:border-yellow-400 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-yellow-400 font-bold text-sm">
                                                            {chapter.position}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{chapter.title}</h4>
                                                        <div className="flex gap-2 mt-1">
                                                            {chapter.videoUrl && (
                                                                <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                                                                    Video
                                                                </Badge>
                                                            )}
                                                            {chapter.pdfUrl && (
                                                                <Badge variant="outline" className="text-xs border-red-500 text-red-400">
                                                                    PDF
                                                                </Badge>
                                                            )}
                                                            {chapter.googleFormUrl && (
                                                                <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                                                                    Formulario
                                                                </Badge>
                                                            )}
                                                            {chapter.isFree && (
                                                                <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                                                                    Gratis
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={chapter.isPublished ? "default" : "secondary"}>
                                                        {chapter.isPublished ? "Publicado" : "Borrador"}
                                                    </Badge>
                                                    <Link href={`/teacher/courses/${courseId}/chapters/${chapter.id}`}>
                                                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                                            <Edit3 className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <PlayCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                    <h4 className="text-xl font-medium text-white mb-2">
                                        Sin clases
                                    </h4>
                                    <p className="text-slate-400 mb-6">
                                        Este tema aún no tiene clases asociadas
                                    </p>
                                    <Link href={`/teacher/courses/${courseId}/chapters/create?topicId=${topicId}`}>
                                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Crear primera clase
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Estadísticas del tema */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Target className="h-5 w-5 text-purple-400" />
                                Estadísticas
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                    <div className="text-2xl font-bold text-yellow-400">
                                        {topic.chapters.length}
                                    </div>
                                    <div className="text-sm text-yellow-300">Total Clases</div>
                                </div>
                                <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                    <div className="text-2xl font-bold text-green-400">
                                        {topic.chapters.filter(c => c.isPublished).length}
                                    </div>
                                    <div className="text-sm text-green-300">Publicadas</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 