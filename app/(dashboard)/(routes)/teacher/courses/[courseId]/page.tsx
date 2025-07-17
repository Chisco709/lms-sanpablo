"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Settings, 
    Eye, 
    Upload, 
    Plus, 
    Save,
    Trash2,
    BookOpen,
    Users,
    Target,
    Layers,
    PlayCircle,
    Edit3,
    GraduationCap,
    CheckCircle,
    AlertCircle,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { use } from "react";
import { PensumTopicsForm } from "./_components/pensum-topics-form";
import { FileUpload } from "@/components/file-upload";
import { SmartImageUpload } from "@/components/smart-image-upload";

// Tipos
interface Course {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isPublished: boolean;
    categoryId: string | null;
    userId: string;
    programId: string | null;
    periodId: string | null;
    unlockDate: Date | null;
    prerequisiteCourseId: string | null;
    createdAt: Date;
    updatedAt: Date;
    chapters: Chapter[];
    pensumTopics: PensumTopic[];
    attachments: Attachment[];
    category: { name: string } | null;
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

interface PensumTopic {
    id: string;
    title: string;
    description: string | null;
    position: number;
    isPublished: boolean;
    chapters: Chapter[];
}

interface Attachment {
    id: string;
    name: string;
    url: string;
}

interface PageProps {
    params: Promise<{ courseId: string }>;
}

export default function CourseEditPage({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const courseId = resolvedParams.courseId;
    
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValues, setTempValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            console.log("🔄 Fetching course with ID:", courseId);
            const response = await axios.get(`/api/courses/${courseId}`);
            console.log("📥 Course data received:", response.data);
            setCourse(response.data);
        } catch (error) {
            console.error("❌ Error fetching course:", error);
            toast.error("Error al cargar el curso");
            router.push("/teacher/courses");
        } finally {
            setLoading(false);
        }
    };

    const updateField = async (field: string, value: any) => {
        if (!course) {
            console.log("❌ No hay curso cargado");
            return;
        }
        
        try {
            console.log(`🔄 Actualizando campo "${field}" con valor:`, value);
            setSaving(true);
            
            const payload = { [field]: value };
            console.log("📤 Enviando a API:", payload);
            
            const response = await axios.patch(`/api/courses/${courseId}`, payload);
            console.log("📥 Respuesta de API:", response.data);
            
            // Actualizar el estado local inmediatamente
            setCourse(prevCourse => {
                if (!prevCourse) return prevCourse;
                const updatedCourse = { ...prevCourse, [field]: value };
                console.log("🔄 Estado local actualizado:", updatedCourse);
                return updatedCourse;
            });
            
            setEditingField(null);
            setTempValues({});
            
            console.log("✅ Campo actualizado exitosamente");
            
            // Solo mostrar toast si no es imageUrl (ya lo mostramos en handleImageUpload)
            if (field !== "imageUrl") {
                toast.success("✅ Campo actualizado exitosamente");
            }
        } catch (error) {
            console.error("❌ Error al actualizar campo:", error);
            if (axios.isAxiosError(error)) {
                console.error("❌ Error de API:", error.response?.data);
                toast.error(`❌ Error: ${error.response?.data?.message || "Error al actualizar"}`);
            } else {
                toast.error("❌ Error al actualizar");
            }
        } finally {
            setSaving(false);
        }
    };

    const publishCourse = async () => {
        try {
            setSaving(true);
            const endpoint = course?.isPublished ? "unpublish" : "publish";
            await axios.patch(`/api/courses/${courseId}/${endpoint}`);
            setCourse(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null);
            toast.success(course?.isPublished ? "Curso despublicado" : "¡Curso publicado!");
        } catch (error) {
            toast.error("Error al cambiar estado de publicación");
        } finally {
            setSaving(false);
        }
    };

    const deleteCourse = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) return;
        
        try {
            setSaving(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Curso eliminado");
            router.push("/teacher/courses");
        } catch (error) {
            toast.error("Error al eliminar el curso");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (url?: string) => {
        try {
            console.log("🖼️ HandleImageUpload llamado con URL:", url);
            
            if (!url) {
                toast.error("❌ Error: No se recibió URL de la imagen");
                return;
            }
            
            console.log("💾 Guardando imagen en curso:", courseId);
            
            // Mostrar toast de progreso
            toast.loading("💾 Guardando imagen...", { id: "image-save" });
            
            // Actualizar estado local primero para UI inmediata
            setCourse(prevCourse => {
                if (!prevCourse) return prevCourse;
                return { ...prevCourse, imageUrl: url };
            });
            
            // Luego guardar en la base de datos
            await updateField("imageUrl", url);
            
            // Limpiar loading toast y mostrar éxito
            toast.dismiss("image-save");
            toast.success("🎉 ¡Imagen guardada exitosamente!");
            
            console.log("✅ Imagen guardada y estado actualizado");
            
        } catch (error) {
            console.error("❌ Error detallado:", error);
            toast.dismiss("image-save");
            toast.error("❌ Error al guardar la imagen");
            
            // Revertir estado local si falló
            if (course?.imageUrl !== url) {
                setCourse(prevCourse => {
                    if (!prevCourse) return prevCourse;
                    return { ...prevCourse, imageUrl: prevCourse.imageUrl };
                });
            }
        }
    };

    const completionStats = () => {
        if (!course) return { completed: 0, total: 0, percentage: 0 };
        
        let completed = 0;
        const total = 4; // título, descripción, imagen, contenido
        
        if (course.title) completed++;
        if (course.description) completed++;
        if (course.imageUrl) completed++;
        if (course.chapters.length > 0 || course.pensumTopics.length > 0) completed++;
        
        return { completed, total, percentage: (completed / total) * 100 };
    };

    const stats = completionStats();

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

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Curso no encontrado</h2>
                    <Link href="/teacher/courses">
                        <Button className="bg-green-500 hover:bg-green-600 text-black">
                            Volver a mis cursos
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "overview", label: "Información", icon: Settings },
        { id: "content", label: "Contenido", icon: BookOpen },
        { id: "students", label: "Estudiantes", icon: Users },
        { id: "analytics", label: "Estadísticas", icon: Target }
    ];

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
                            <Link href="/teacher/courses">
                                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                    ← Volver
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {course.title}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <Badge variant={course.isPublished ? "default" : "secondary"} className={
                                        course.isPublished 
                                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    }>
                                        {course.isPublished ? (
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
                                    {course.category && (
                                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                                            {course.category.name}
                                        </Badge>
                                    )}
                                    <span className="text-slate-400 text-sm">
                                        {stats.completed}/{stats.total} campos completados
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {course.isPublished && (
                                <Link href={`/courses/${course.id}`}>
                                    <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver curso
                                    </Button>
                                </Link>
                            )}
                            <Button
                                onClick={publishCourse}
                                disabled={saving}
                                className={
                                    course.isPublished
                                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                                        : "bg-green-500 hover:bg-green-600 text-black"
                                }
                            >
                                {course.isPublished ? "Despublicar" : "Publicar"}
                            </Button>
                            <Button
                                onClick={deleteCourse}
                                disabled={saving}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Progreso del curso</span>
                            <span className="text-green-400">{Math.round(stats.percentage)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <motion.div 
                                className="h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.percentage}%` }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Navegación por tabs */}
                <div className="mb-8">
                    <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                                    activeTab === tab.id
                                        ? "bg-gradient-to-r from-green-500 to-yellow-500 text-black"
                                        : "text-slate-400 hover:text-white hover:bg-slate-700"
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenido principal */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Información básica */}
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <Edit3 className="h-5 w-5 text-green-400" />
                                            Información Básica
                                        </h3>

                                        {/* Título */}
                                        <div className="mb-6">
                                            <label className="text-sm font-medium text-slate-400 mb-2 block">
                                                Título del curso
                                            </label>
                                            {editingField === "title" ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={tempValues.title || course.title}
                                                        onChange={(e) => setTempValues({...tempValues, title: e.target.value})}
                                                        className="bg-slate-900/50 border-slate-600 text-white"
                                                        placeholder="Título del curso"
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
                                                        setTempValues({title: course.title});
                                                    }}
                                                    className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 cursor-pointer hover:border-green-400 transition-colors"
                                                >
                                                    <p className="text-white">{course.title || "Sin título"}</p>
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
                                                        value={tempValues.description || course.description || ""}
                                                        onChange={(e) => setTempValues({...tempValues, description: e.target.value})}
                                                        className="bg-slate-900/50 border-slate-600 text-white min-h-24"
                                                        placeholder="Descripción del curso"
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
                                                        setTempValues({description: course.description || ""});
                                                    }}
                                                    className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 cursor-pointer hover:border-green-400 transition-colors min-h-24"
                                                >
                                                    <p className="text-white">
                                                        {course.description || "Haz clic para agregar una descripción"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Precio */}
                                        <div>
                                            <label className="text-sm font-medium text-slate-400 mb-2 block">
                                                Precio (Pesos colombianos)
                                            </label>
                                            {editingField === "price" ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="number"
                                                        value={tempValues.price || course.price || ""}
                                                        onChange={(e) => setTempValues({...tempValues, price: e.target.value})}
                                                        className="bg-slate-900/50 border-slate-600 text-white"
                                                        placeholder="0 = Gratis"
                                                    />
                                                    <Button
                                                        onClick={() => updateField("price", Number(tempValues.price) || 0)}
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
                                                        setEditingField("price");
                                                        setTempValues({price: course.price?.toString() || "0"});
                                                    }}
                                                    className="p-3 bg-slate-900/30 rounded-lg border border-slate-600 cursor-pointer hover:border-green-400 transition-colors"
                                                >
                                                    <p className="text-white">
                                                        {course.price ? `$${course.price.toLocaleString()} COP` : "Gratis"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Imagen del curso */}
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <Upload className="h-5 w-5 text-purple-400" />
                                            Imagen del Curso
                                        </h3>

                                        <div className="relative">
                                            {saving && (
                                                <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center z-10">
                                                    <div className="text-center">
                                                        <div className="w-8 h-8 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-2"></div>
                                                        <p className="text-white text-sm">Guardando imagen...</p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {course.imageUrl ? (
                                                <div className="relative group">
                                                    <img
                                                        src={course.imageUrl}
                                                        alt={course.title}
                                                        className="w-full h-48 object-cover rounded-xl border border-slate-600"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                                        <div className="text-center">
                                                            <p className="text-white text-sm mb-4">¿Cambiar imagen?</p>
                                                            <Button 
                                                                onClick={() => updateField("imageUrl", "")}
                                                                disabled={saving}
                                                                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 mb-2"
                                                            >
                                                                <Upload className="h-4 w-4 mr-2" />
                                                                Cambiar imagen
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <SmartImageUpload
                                                        endpoint="courseImage"
                                                        onSuccess={handleImageUpload}
                                                    />
                                                    <div className="text-center">
                                                        <p className="text-slate-400 text-sm">
                                                            La imagen se guardará automáticamente después de subirla
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Estadísticas rápidas */}
                                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <Target className="h-5 w-5 text-yellow-400" />
                                            Estadísticas
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                                <div className="text-2xl font-bold text-green-400">
                                                    {course.chapters.length}
                                                </div>
                                                <div className="text-sm text-green-300">Clases</div>
                                            </div>
                                            <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                                <div className="text-2xl font-bold text-yellow-400">
                                                    {course.pensumTopics.length}
                                                </div>
                                                <div className="text-sm text-yellow-300">Temas</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "content" && (
                            <div className="space-y-8">
                                {/* Sección de Temas del Pensum - Componente funcional */}
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                    <PensumTopicsForm
                                        initialData={course}
                                        courseId={course.id}
                                    />
                                </div>

                                {/* Sección de Clases */}
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <PlayCircle className="h-5 w-5 text-yellow-400" />
                                            Clases
                                        </h3>
                                        <Link href={`/teacher/courses/${course.id}/chapters/create`}>
                                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Agregar Clase
                                            </Button>
                                        </Link>
                                    </div>

                                    {course.chapters.length > 0 ? (
                                        <div className="space-y-4">
                                            {course.chapters.map((chapter, index) => (
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
                                                                <PlayCircle className="h-4 w-4 text-yellow-400" />
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
                                                        <Badge variant={chapter.isPublished ? "default" : "secondary"}>
                                                            {chapter.isPublished ? "Publicado" : "Borrador"}
                                                        </Badge>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <PlayCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                            <h4 className="text-xl font-medium text-white mb-2">
                                                Sin clases creadas
                                            </h4>
                                            <p className="text-slate-400 mb-6">
                                                Crea tu primera clase con videos, PDFs y formularios
                                            </p>
                                            <Link href={`/teacher/courses/${course.id}/chapters/create`}>
                                                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Crear primera clase
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "students" && (
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                <div className="text-center py-12">
                                    <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                    <h4 className="text-xl font-medium text-white mb-2">
                                        Gestión de Estudiantes
                                    </h4>
                                    <p className="text-slate-400">
                                        Próximamente: Ver estudiantes inscritos, progreso y estadísticas
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === "analytics" && (
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                                <div className="text-center py-12">
                                    <Target className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                    <h4 className="text-xl font-medium text-white mb-2">
                                        Análisis y Estadísticas
                                    </h4>
                                    <p className="text-slate-400">
                                        Próximamente: Métricas de engagement, completación y más
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}



