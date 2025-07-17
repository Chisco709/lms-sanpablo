"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
    Plus, 
    BookOpen, 
    Users, 
    Eye,
    Edit3,
    MoreVertical,
    Search,
    Grid3X3,
    List,
    Clock,
    CheckCircle,
    Settings,
    Trash2
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

// Tipos
interface Course {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isPublished: boolean;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
    category: { name: string } | null;
    _count?: {
        chapters: number;
        purchases: number;
    };
}

export default function TeacherCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [coursesCache, setCoursesCache] = useState<Course[] | null>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // Usar cache si existe
            if (coursesCache) {
                setCourses(coursesCache);
                setLoading(false);
                return;
            }

            const response = await axios.get("/api/courses");
            setCourses(response.data);
            setCoursesCache(response.data); // Guardar en cache
        } catch (error) {
            toast.error("Error al cargar los cursos");
        } finally {
            setLoading(false);
        }
    };

    const deleteCourse = async (courseId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) return;
        
        try {
            await axios.delete(`/api/courses/${courseId}`);
            const updatedCourses = courses.filter(course => course.id !== courseId);
            setCourses(updatedCourses);
            setCoursesCache(updatedCourses); // Actualizar cache
            toast.success("Curso eliminado exitosamente");
        } catch (error) {
            toast.error("Error al eliminar el curso");
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = 
            filterStatus === "all" ||
            (filterStatus === "published" && course.isPublished) ||
            (filterStatus === "draft" && !course.isPublished);
        
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: courses.length,
        published: courses.filter(c => c.isPublished).length,
        draft: courses.filter(c => !c.isPublished).length,
        students: courses.reduce((acc, course) => acc + (course._count?.purchases || 0), 0)
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                    <span className="text-white">Cargando cursos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            {/* Efectos de fondo consistentes con el LMS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute left-[-15%] top-[-15%] w-[400px] h-[400px] bg-green-500/30 rounded-full blur-[120px] opacity-70" />
                <div className="absolute right-[-10%] bottom-[-10%] w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-[100px] opacity-60" />
                <div className="absolute right-[10%] top-[10%] w-[200px] h-[200px] bg-green-400/10 rounded-full blur-[80px] opacity-50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header consistente con el LMS */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl">
                                <BookOpen className="h-8 w-8 text-black" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    Mis Cursos
                                </h1>
                                <p className="text-slate-400">
                                    Gestiona y crea experiencias educativas increíbles
                                </p>
                            </div>
                        </div>
                        
                        <Link href="/teacher/create">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-xl shadow-lg">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Crear Curso
                                </Button>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Estadísticas animadas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                        {[
                            { label: "Total Cursos", value: stats.total, icon: BookOpen, color: "from-blue-500 to-purple-500" },
                            { label: "Publicados", value: stats.published, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
                            { label: "Borradores", value: stats.draft, icon: Clock, color: "from-yellow-500 to-orange-500" },
                            { label: "Estudiantes", value: stats.students, icon: Users, color: "from-pink-500 to-rose-500" }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-black/70 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">{stat.label}</p>
                                        <motion.p 
                                            className="text-2xl font-bold text-white"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                                        >
                                            {stat.value}
                                        </motion.p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Controles de búsqueda y filtros */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black/70 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6 mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar cursos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 w-64 bg-slate-800/50 border-slate-700 text-white"
                                />
                            </div>
                            
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-400"
                            >
                                <option value="all">Todos</option>
                                <option value="published">Publicados</option>
                                <option value="draft">Borradores</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className="bg-slate-800/50 border-slate-700"
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className="bg-slate-800/50 border-slate-700"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Lista de cursos */}
                {filteredCourses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-black/70 backdrop-blur-xl rounded-2xl border border-green-400/30 p-12 text-center"
                    >
                        <BookOpen className="h-16 w-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            {courses.length === 0 ? "No tienes cursos aún" : "No se encontraron cursos"}
                        </h3>
                        <p className="text-slate-400 mb-6">
                            {courses.length === 0 
                                ? "Crea tu primer curso para comenzar a enseñar"
                                : "Prueba con otros términos de búsqueda"
                            }
                        </p>
                        {courses.length === 0 && (
                            <Link href="/teacher/create">
                                <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear tu primer curso
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                ) : (
                    <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }>
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={viewMode === "grid"
                                    ? "bg-black/70 backdrop-blur-xl rounded-2xl border border-green-400/30 overflow-hidden hover:border-green-400/50 transition-all"
                                    : "bg-black/70 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6 flex items-center space-x-4 hover:border-green-400/50 transition-all"
                                }
                            >
                                {viewMode === "grid" ? (
                                    <>
                                        <div className="relative h-48 bg-slate-800">
                                            {course.imageUrl ? (
                                                <Image
                                                    src={course.imageUrl}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="h-12 w-12 text-slate-400" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <Badge 
                                                    variant={course.isPublished ? "default" : "secondary"}
                                                    className={course.isPublished 
                                                        ? "bg-green-500/20 text-green-400 border-green-400/30" 
                                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                                                    }
                                                >
                                                    {course.isPublished ? "Publicado" : "Borrador"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-semibold text-white mb-2 line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-slate-400 mb-4">
                                                {course.category?.name || 'Sin categoría'} • {formatDate(course.createdAt)}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                                                <span className="flex items-center">
                                                    <BookOpen className="h-4 w-4 mr-1" />
                                                    {course._count?.chapters || 0} capítulos
                                                </span>
                                                <span className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {course._count?.purchases || 0} estudiantes
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full bg-slate-800/50 border-slate-700">
                                                        <Settings className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/courses/${course.id}`} className="text-white">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Ver como estudiante
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-700" />
                                                        <DropdownMenuItem 
                                                            onClick={() => deleteCourse(course.id)}
                                                            className="text-red-400"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative w-20 h-20 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                            {course.imageUrl ? (
                                                <Image
                                                    src={course.imageUrl}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="h-8 w-8 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-white">{course.title}</h3>
                                                    <p className="text-sm text-slate-400 mt-1">
                                                        {course.category?.name || 'Sin categoría'} • {formatDate(course.createdAt)}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-sm text-slate-400 mt-2">
                                                        <span className="flex items-center">
                                                            <BookOpen className="h-4 w-4 mr-1" />
                                                            {course._count?.chapters || 0} capítulos
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Users className="h-4 w-4 mr-1" />
                                                            {course._count?.purchases || 0} estudiantes
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge 
                                                        variant={course.isPublished ? "default" : "secondary"}
                                                        className={course.isPublished 
                                                            ? "bg-green-500/20 text-green-400 border-green-400/30" 
                                                            : "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                                                        }
                                                    >
                                                        {course.isPublished ? "Publicado" : "Borrador"}
                                                    </Badge>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/teacher/courses/${course.id}`} className="text-white">
                                                                    <Settings className="h-4 w-4 mr-2" />
                                                                    Editar curso
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/courses/${course.id}`} className="text-white">
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Ver como estudiante
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-slate-700" />
                                                            <DropdownMenuItem 
                                                                onClick={() => deleteCourse(course.id)}
                                                                className="text-red-400"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}