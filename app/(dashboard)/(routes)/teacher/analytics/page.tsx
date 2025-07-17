"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    Users, 
    BookOpen, 
    TrendingUp, 
    BarChart3,
    CheckCircle,
    RefreshCw,
    PlayCircle,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

// Tipos para las estadísticas
interface CourseStats {
    id: string;
    title: string;
    imageUrl: string | null;
    studentsEnrolled: number;
    completionRate: number;
    revenue: number;
    isPublished: boolean;
    createdAt: string;
    category: { name: string } | null;
    _count: {
        chapters: number;
        purchases: number;
    };
}

interface AnalyticsData {
    overview: {
        totalCourses: number;
        publishedCourses: number;
        totalStudents: number;
        totalRevenue: number;
        averageCompletionRate: number;
    };
    courseStats: CourseStats[];
    recentActivity: {
        id: string;
        type: 'enrollment' | 'completion' | 'video_watched';
        studentName: string;
        courseName: string;
        timestamp: string;
        details: string;
    }[];
    topPerformingCourses: CourseStats[];
}

export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
    const [refreshing, setRefreshing] = useState(false);
    const [dataCache, setDataCache] = useState<Record<string, AnalyticsData>>({});

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedPeriod]);

    const fetchAnalyticsData = async () => {
        try {
            // Verificar cache primero
            if (dataCache[selectedPeriod]) {
                setAnalyticsData(dataCache[selectedPeriod]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const response = await axios.get(`/api/teacher/analytics?period=${selectedPeriod}`);
            
            // Guardar en cache
            setDataCache(prev => ({
                ...prev,
                [selectedPeriod]: response.data
            }));
            
            setAnalyticsData(response.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            toast.error("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        // Limpiar cache para forzar nueva carga
        setDataCache(prev => ({
            ...prev,
            [selectedPeriod]: undefined as any
        }));
        await fetchAnalyticsData();
        setRefreshing(false);
        toast.success("Datos actualizados");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                    <span className="text-white">Cargando analytics...</span>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-green-400 mb-4">
                        <BarChart3 className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No hay datos disponibles</h3>
                    <p className="text-slate-400 mb-4">Aún no tienes cursos o estudiantes para mostrar estadísticas.</p>
                    <Button 
                        onClick={fetchAnalyticsData} 
                        className="bg-green-500 hover:bg-green-600 border border-green-400"
                    >
                        Reintentar
                    </Button>
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
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/teacher/courses"
                                className="flex items-center gap-2 text-green-400 hover:text-yellow-400 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Volver a cursos</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                className="bg-black/70 border border-green-400/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-400"
                            >
                                <option value="7d">Últimos 7 días</option>
                                <option value="30d">Últimos 30 días</option>
                                <option value="90d">Últimos 90 días</option>
                                <option value="1y">Último año</option>
                            </select>
                            
                            <Button
                                onClick={refreshData}
                                disabled={refreshing}
                                className="bg-green-500 hover:bg-green-600 border border-green-400"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl">
                                <BarChart3 className="h-8 w-8 text-black" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    Analytics Dashboard
                                </h1>
                                <p className="text-slate-400">
                                    Métricas detalladas de tus cursos y estudiantes
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Métricas principales con diseño consistente */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-black/70 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/20">
                                <Users className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">
                                {analyticsData.overview.totalStudents}
                            </p>
                            <p className="text-slate-400 text-sm">Total Estudiantes</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/70 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-green-500/20">
                                <BookOpen className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">
                                {analyticsData.overview.publishedCourses}/{analyticsData.overview.totalCourses}
                            </p>
                            <p className="text-slate-400 text-sm">Cursos Publicados</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-black/70 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-yellow-500/20">
                                <TrendingUp className="h-6 w-6 text-yellow-400" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">
                                {analyticsData.overview.averageCompletionRate}%
                            </p>
                            <p className="text-slate-400 text-sm">Tasa de Completado</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-black/70 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-purple-500/20">
                                <TrendingUp className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">$0</p>
                            <p className="text-slate-400 text-sm">Ingresos</p>
                            <p className="text-xs text-slate-500 mt-1">Sistema en desarrollo</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de cursos */}
                    <div className="lg:col-span-2">
                        <div className="bg-black/70 backdrop-blur-xl rounded-2xl border border-green-400/30">
                            <div className="p-6 border-b border-slate-800/30">
                                <h3 className="text-xl font-bold text-white mb-2">Tus Cursos</h3>
                                <p className="text-slate-400 text-sm">
                                    Rendimiento de cada curso publicado
                                </p>
                            </div>
                            <div className="p-6">
                                {analyticsData.courseStats.length === 0 ? (
                                    <div className="text-center py-8">
                                        <BookOpen className="h-12 w-12 text-green-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-white mb-2">No hay cursos publicados</h3>
                                        <p className="text-slate-400">Publica tu primer curso para ver las estadísticas aquí.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {analyticsData.courseStats.map((course, index) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-800/50 transition-all"
                                            >
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                                                    {course.imageUrl ? (
                                                        <Image
                                                            src={course.imageUrl}
                                                            alt={course.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <BookOpen className="h-6 w-6 text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="ml-4 flex-1">
                                                    <h4 className="font-medium text-white">{course.title}</h4>
                                                    <p className="text-sm text-slate-400">
                                                        {course.category?.name || 'Sin categoría'} • Creado {formatDate(course.createdAt)}
                                                    </p>
                                                    <div className="flex items-center mt-2 space-x-4 text-xs text-slate-400">
                                                        <span className="flex items-center">
                                                            <Users className="h-3 w-3 mr-1" />
                                                            {course.studentsEnrolled} estudiantes
                                                        </span>
                                                        <span className="flex items-center">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            {course.completionRate}% completado
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <div className="w-16">
                                                        <Progress 
                                                            value={course.completionRate} 
                                                            className="h-2"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actividad reciente */}
                    <div>
                        <div className="bg-black/70 backdrop-blur-xl rounded-2xl border border-green-400/30">
                            <div className="p-6 border-b border-slate-800/30">
                                <h3 className="text-xl font-bold text-white mb-2">Actividad Reciente</h3>
                                <p className="text-slate-400 text-sm">
                                    Últimas acciones de tus estudiantes
                                </p>
                            </div>
                            <div className="p-6">
                                {analyticsData.recentActivity.length === 0 ? (
                                    <div className="text-center py-8">
                                        <PlayCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                                        <p className="text-sm text-slate-400">Sin actividad reciente</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {analyticsData.recentActivity.map((activity, index) => (
                                            <motion.div
                                                key={activity.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start space-x-3"
                                            >
                                                <div className={`p-1 rounded-full ${
                                                    activity.type === 'completion' ? 'bg-green-500/20' :
                                                    activity.type === 'enrollment' ? 'bg-blue-500/20' : 'bg-yellow-500/20'
                                                }`}>
                                                    {activity.type === 'completion' ? (
                                                        <CheckCircle className="h-3 w-3 text-green-400" />
                                                    ) : activity.type === 'enrollment' ? (
                                                        <Users className="h-3 w-3 text-blue-400" />
                                                    ) : (
                                                        <PlayCircle className="h-3 w-3 text-yellow-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white">{activity.studentName}</p>
                                                    <p className="text-xs text-slate-400">{activity.details}</p>
                                                    <p className="text-xs text-slate-500">{activity.courseName}</p>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {formatDate(activity.timestamp)}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}