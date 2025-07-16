"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Plus, 
    BookOpen, 
    Users, 
    TrendingUp, 
    Eye,
    Edit3,
    MoreVertical,
    Search,
    Filter,
    Grid3X3,
    List,
    Star,
    Play,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar,
    Target,
    Zap,
    Sparkles,
    Trophy,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAnalytics, usePageTracking, useTimeTracking } from "@/hooks/use-analytics";

// Tipos
interface Course {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isPublished: boolean;
    categoryId: string | null;
    category?: {
        name: string;
    } | null;
    _count?: {
        chapters: number;
        purchases: number;
    };
    createdAt: string;
    updatedAt: string;
}

export default function TeacherCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const router = useRouter();

    // Analytics hooks
    const { trackTeacherAction, trackPageView } = useAnalytics();
    usePageTracking();
    useTimeTracking("Teacher - Dashboard Cursos");

    useEffect(() => {
        fetchCourses();
        trackTeacherAction("view_courses_dashboard", "Dashboard principal");
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get("/api/courses");
            setCourses(response.data);
        } catch (error) {
            toast.error("Error al cargar los cursos");
        } finally {
            setLoading(false);
        }
    };

    const publishCourse = async (courseId: string, isPublished: boolean) => {
        try {
            const action = isPublished ? "unpublish" : "publish";
            await axios.patch(`/api/courses/${courseId}/${action}`);
            
            setCourses(prev => prev.map(course => 
                course.id === courseId 
                    ? { ...course, isPublished: !isPublished }
                    : course
            ));
            
            trackTeacherAction(
                isPublished ? "unpublish_course" : "publish_course", 
                `Curso ID: ${courseId}`
            );
            
            toast.success(isPublished ? "Curso despublicado" : "Curso publicado");
        } catch (error) {
            toast.error("Error al cambiar el estado del curso");
        }
    };

    const deleteCourse = async (courseId: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este curso?")) return;
        
        try {
            await axios.delete(`/api/courses/${courseId}`);
            setCourses(prev => prev.filter(course => course.id !== courseId));
            trackTeacherAction("delete_course", `Curso ID: ${courseId}`);
            toast.success("Curso eliminado exitosamente");
        } catch (error) {
            toast.error("Error al eliminar el curso");
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || 
                            (filterStatus === "published" && course.isPublished) ||
                            (filterStatus === "draft" && !course.isPublished);
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: courses.length,
        published: courses.filter(c => c.isPublished).length,
        draft: courses.filter(c => !c.isPublished).length,
        students: courses.reduce((sum, c) => sum + (c._count?.purchases || 0), 0)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin animate-reverse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
            {/* Efectos de fondo premium */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Orbes principales */}
                <motion.div 
                    className="absolute -top-40 -left-40 w-80 h-80 bg-green-500/30 rounded-full blur-3xl"
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ 
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
                
                {/* Orbes secundarios */}
                <motion.div 
                    className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"
                    animate={{ 
                        x: [0, 30, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{ 
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"
                    animate={{ 
                        x: [0, -20, 0],
                        y: [0, 25, 0]
                    }}
                    transition={{ 
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3
                    }}
                />

                {/* Líneas flotantes */}
                <div className="absolute inset-0">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-px h-32 bg-gradient-to-b from-transparent via-green-400/20 to-transparent"
                            style={{
                                left: `${20 + i * 30}%`,
                                top: `${10 + i * 20}%`,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                height: [0, 128, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 1.5
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header premium */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <motion.div 
                                    className="relative"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 rounded-3xl blur-xl opacity-30"></div>
                                    <div className="relative p-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-3xl">
                                        <BookOpen className="h-10 w-10 text-black" />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.h1 
                                        className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Mis Cursos
                                    </motion.h1>
                                    <motion.p 
                                        className="text-slate-400 text-lg mt-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Gestiona y crea experiencias educativas extraordinarias
                                    </motion.p>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href="/teacher/create">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <Button className="relative bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold px-8 py-4 rounded-2xl shadow-2xl text-lg">
                                        <Plus className="h-6 w-6 mr-3" />
                                        Crear Curso
                                        <Sparkles className="h-5 w-5 ml-3 opacity-70" />
                                    </Button>
                                </div>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Estadísticas premium */}
                    <motion.div 
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {[
                            { 
                                label: "Total Cursos", 
                                value: stats.total, 
                                icon: BookOpen, 
                                gradient: "from-blue-500 via-purple-500 to-pink-500",
                                bg: "from-blue-500/10 to-purple-500/10"
                            },
                            { 
                                label: "Publicados", 
                                value: stats.published, 
                                icon: CheckCircle, 
                                gradient: "from-green-500 via-emerald-500 to-teal-500",
                                bg: "from-green-500/10 to-emerald-500/10"
                            },
                            { 
                                label: "Borradores", 
                                value: stats.draft, 
                                icon: Clock, 
                                gradient: "from-yellow-500 via-orange-500 to-red-500",
                                bg: "from-yellow-500/10 to-orange-500/10"
                            },
                            { 
                                label: "Estudiantes", 
                                value: stats.students, 
                                icon: Users, 
                                gradient: "from-pink-500 via-rose-500 to-red-500",
                                bg: "from-pink-500/10 to-rose-500/10"
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ 
                                    delay: 0.6 + index * 0.1,
                                    type: "spring",
                                    stiffness: 200
                                }}
                                whileHover={{ 
                                    y: -8,
                                    transition: { type: "spring", stiffness: 400 }
                                }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity" 
                                     style={{background: `linear-gradient(135deg, ${stat.gradient})`}} />
                                
                                <div className={`relative bg-gradient-to-br ${stat.bg} backdrop-blur-xl rounded-3xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient}`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <motion.div
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            initial={{ rotate: 0 }}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.8 }}
                                        >
                                            <Sparkles className="h-5 w-5 text-white/40" />
                                        </motion.div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <motion.div 
                                            className="text-3xl font-bold text-white"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ 
                                                delay: 0.8 + index * 0.1,
                                                type: "spring",
                                                stiffness: 300
                                            }}
                                        >
                                            {stat.value}
                                        </motion.div>
                                        <div className="text-slate-400 text-sm font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Barra de búsqueda y filtros premium */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-12"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10"></div>
                        <div className="relative p-8">
                            <div className="flex flex-col lg:flex-row gap-6 items-center">
                                {/* Búsqueda */}
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        placeholder="Buscar cursos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-green-400/50 focus:ring-green-400/20 rounded-2xl h-12"
                                    />
                                </div>

                                {/* Filtros */}
                                <div className="flex items-center gap-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 rounded-xl">
                                                <Filter className="h-4 w-4 mr-2" />
                                                {filterStatus === "all" ? "Todos" : 
                                                 filterStatus === "published" ? "Publicados" : "Borradores"}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 rounded-2xl">
                                            <DropdownMenuItem onClick={() => setFilterStatus("all")} className="text-white hover:bg-slate-800/50 rounded-xl">
                                                Todos
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setFilterStatus("published")} className="text-white hover:bg-slate-800/50 rounded-xl">
                                                Publicados
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setFilterStatus("draft")} className="text-white hover:bg-slate-800/50 rounded-xl">
                                                Borradores
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Toggle de vista */}
                                    <div className="flex bg-slate-900/50 rounded-2xl p-1 border border-slate-700/50">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-3 rounded-xl transition-all duration-300 ${
                                                viewMode === "grid" 
                                                    ? "bg-gradient-to-r from-green-500 to-yellow-500 text-black shadow-lg" 
                                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                            }`}
                                        >
                                            <Grid3X3 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-3 rounded-xl transition-all duration-300 ${
                                                viewMode === "list" 
                                                    ? "bg-gradient-to-r from-green-500 to-yellow-500 text-black shadow-lg" 
                                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                            }`}
                                        >
                                            <List className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Lista de cursos premium */}
                <AnimatePresence mode="wait">
                    {filteredCourses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-20"
                        >
                            <div className="relative max-w-md mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl border border-white/10"></div>
                                <div className="relative p-16">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="relative mb-8"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-700/20 rounded-full blur-2xl"></div>
                                        <Target className="relative h-20 w-20 text-slate-400 mx-auto" />
                                    </motion.div>
                                    
                                    <motion.h3 
                                        className="text-3xl font-bold text-white mb-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {searchTerm || filterStatus !== "all" ? "Sin resultados" : "Crea tu primer curso"}
                                    </motion.h3>
                                    
                                    <motion.p 
                                        className="text-slate-400 mb-10 text-lg"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {searchTerm || filterStatus !== "all" 
                                            ? "No encontramos cursos que coincidan con tu búsqueda"
                                            : "Comienza a compartir tu conocimiento con el mundo"
                                        }
                                    </motion.p>
                                    
                                    {!searchTerm && filterStatus === "all" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <Link href="/teacher/create">
                                                <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold px-8 py-4 rounded-2xl text-lg">
                                                    <Plus className="h-5 w-5 mr-3" />
                                                    Crear primer curso
                                                    <Sparkles className="h-4 w-4 ml-3" />
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className={`grid gap-8 ${
                            viewMode === "grid" 
                                ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
                                : "grid-cols-1"
                        }`}>
                            {filteredCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ 
                                        delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{ 
                                        y: -12,
                                        transition: { type: "spring", stiffness: 400 }
                                    }}
                                    className={`group relative ${
                                        viewMode === "list" ? "flex" : ""
                                    }`}
                                >
                                    {/* Efecto de brillo al hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-yellow-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                                    
                                    <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 group-hover:border-white/20 overflow-hidden transition-all duration-500 ${
                                        viewMode === "list" ? "flex w-full" : ""
                                    }`}>
                                        {/* Imagen del curso */}
                                        <div className={`relative ${viewMode === "list" ? "w-64 flex-shrink-0" : "aspect-video"}`}>
                                            {course.imageUrl ? (
                                                <Image
                                                    src={course.imageUrl}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                                    <BookOpen className="h-16 w-16 text-slate-500" />
                                                </div>
                                            )}
                                            
                                            {/* Overlay con estado */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            <div className="absolute top-4 left-4">
                                                <Badge 
                                                    className={`${
                                                        course.isPublished 
                                                            ? "bg-green-500/90 text-white" 
                                                            : "bg-yellow-500/90 text-black"
                                                    } backdrop-blur-sm border-0`}
                                                >
                                                    {course.isPublished ? "Publicado" : "Borrador"}
                                                </Badge>
                                            </div>
                                            
                                            {/* Precio */}
                                            <div className="absolute top-4 right-4">
                                                <Badge className="bg-black/60 text-white backdrop-blur-sm border-0">
                                                    {course.price ? `$${course.price.toLocaleString()} COP` : "Gratis"}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Contenido */}
                                        <div className="p-8 flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-green-400 transition-colors">
                                                        {course.title}
                                                    </h3>
                                                    {course.category && (
                                                        <Badge variant="outline" className="text-xs text-slate-400 border-slate-600 mb-3">
                                                            {course.category.name}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 rounded-2xl">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/teacher/courses/${course.id}`} className="text-white hover:bg-slate-800/50 cursor-pointer rounded-xl">
                                                                <Edit3 className="h-4 w-4 mr-2" />
                                                                Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {course.isPublished && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/courses/${course.id}`} className="text-white hover:bg-slate-800/50 cursor-pointer rounded-xl">
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Ver curso
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator className="bg-slate-600" />
                                                        <DropdownMenuItem 
                                                            onClick={() => publishCourse(course.id, course.isPublished)}
                                                            className="text-white hover:bg-slate-800/50 cursor-pointer rounded-xl"
                                                        >
                                                            {course.isPublished ? (
                                                                <>
                                                                    <Clock className="h-4 w-4 mr-2" />
                                                                    Despublicar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Publicar
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-600" />
                                                        <DropdownMenuItem 
                                                            onClick={() => deleteCourse(course.id)}
                                                            className="text-red-400 hover:bg-red-500/10 cursor-pointer rounded-xl"
                                                        >
                                                            <AlertCircle className="h-4 w-4 mr-2" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                                                {course.description || "Sin descripción disponible"}
                                            </p>

                                            {/* Métricas */}
                                            <div className="flex items-center justify-between text-sm mb-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Play className="h-4 w-4" />
                                                        <span>{course._count?.chapters || 0} clases</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Users className="h-4 w-4" />
                                                        <span>{course._count?.purchases || 0} estudiantes</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Acciones principales */}
                                            <div className="flex gap-3">
                                                <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                                                    <Button 
                                                        variant="outline" 
                                                        className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-green-400/50 rounded-xl transition-all"
                                                    >
                                                        <Edit3 className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </Button>
                                                </Link>
                                                {course.isPublished && (
                                                    <Link href={`/courses/${course.id}`}>
                                                        <Button 
                                                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-4"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}