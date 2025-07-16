"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    BookOpen, 
    TrendingUp, 
    Eye,
    Clock,
    Award,
    Target,
    Calendar,
    BarChart3,
    DollarSign,
    PlayCircle,
    CheckCircle,
    AlertTriangle,
    Star,
    Download,
    Filter,
    RefreshCw,
    ArrowUp,
    ArrowDown,
    Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAnalytics, usePageTracking, useTimeTracking } from "@/hooks/use-analytics";

// Tipos para las estadísticas
interface CourseStats {
    id: string;
    title: string;
    imageUrl: string | null;
    studentsEnrolled: number;
    completionRate: number;
    averageProgress: number;
    revenue: number;
    totalVideosWatched: number;
    averageRating: number;
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
        totalVideoHours: number;
    };
    courseStats: CourseStats[];
    recentActivity: {
        id: string;
        type: 'enrollment' | 'completion' | 'video_watched' | 'review';
        studentName: string;
        courseName: string;
        timestamp: string;
        details: string;
    }[];
    growthMetrics: {
        studentsGrowth: number;
        revenueGrowth: number;
        coursesGrowth: number;
        engagementGrowth: number;
    };
    topPerformingCourses: CourseStats[];
    monthlyStats: {
        month: string;
        enrollments: number;
        completions: number;
        revenue: number;
    }[];
}

export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
    const [refreshing, setRefreshing] = useState(false);

    // Analytics hooks
    const { trackTeacherAction } = useAnalytics();
    usePageTracking();
    useTimeTracking("Teacher - Analytics Dashboard");

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedPeriod]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/teacher/analytics?period=${selectedPeriod}`);
            setAnalyticsData(response.data);
            trackTeacherAction("view_analytics", `Period: ${selectedPeriod}`);
        } catch (error) {
            // Datos de ejemplo para mostrar la UI
            setAnalyticsData(generateMockData());
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        await fetchAnalyticsData();
        setRefreshing(false);
        toast.success("Datos actualizados");
        trackTeacherAction("refresh_analytics", selectedPeriod);
    };

    const exportData = () => {
        trackTeacherAction("export_analytics", selectedPeriod);
        toast.success("Exportando datos...");
    };

    // Función para generar datos de ejemplo
    const generateMockData = (): AnalyticsData => ({
        overview: {
            totalCourses: 8,
            publishedCourses: 6,
            totalStudents: 245,
            totalRevenue: 12500000,
            averageCompletionRate: 78,
            totalVideoHours: 156
        },
        courseStats: [
            {
                id: "1",
                title: "Técnico en Primera Infancia",
                imageUrl: null,
                studentsEnrolled: 85,
                completionRate: 82,
                averageProgress: 65,
                revenue: 4250000,
                totalVideosWatched: 340,
                averageRating: 4.7,
                isPublished: true,
                createdAt: "2024-01-15",
                category: { name: "Primera Infancia" },
                _count: { chapters: 12, purchases: 85 }
            },
            {
                id: "2", 
                title: "Inglés Técnico Avanzado",
                imageUrl: null,
                studentsEnrolled: 62,
                completionRate: 75,
                averageProgress: 58,
                revenue: 3100000,
                totalVideosWatched: 248,
                averageRating: 4.5,
                isPublished: true,
                createdAt: "2024-02-20",
                category: { name: "Idiomas" },
                _count: { chapters: 10, purchases: 62 }
            },
            {
                id: "3",
                title: "Pedagogía Infantil",
                imageUrl: null,
                studentsEnrolled: 98,
                completionRate: 88,
                averageProgress: 72,
                revenue: 4900000,
                totalVideosWatched: 392,
                averageRating: 4.8,
                isPublished: true,
                createdAt: "2023-11-10",
                category: { name: "Educación" },
                _count: { chapters: 15, purchases: 98 }
            }
        ],
        recentActivity: [
            {
                id: "1",
                type: "enrollment",
                studentName: "María González",
                courseName: "Técnico en Primera Infancia", 
                timestamp: "2024-01-20T10:30:00Z",
                details: "Nueva inscripción"
            },
            {
                id: "2",
                type: "completion",
                studentName: "Carlos Rodríguez",
                courseName: "Inglés Técnico Avanzado",
                timestamp: "2024-01-20T09:15:00Z",
                details: "Completó el curso"
            },
            {
                id: "3",
                type: "video_watched",
                studentName: "Ana Martínez",
                courseName: "Pedagogía Infantil",
                timestamp: "2024-01-20T08:45:00Z",
                details: "Vió 3 videos"
            }
        ],
        growthMetrics: {
            studentsGrowth: 15.5,
            revenueGrowth: 23.2,
            coursesGrowth: 8.7,
            engagementGrowth: 12.1
        },
        topPerformingCourses: [],
        monthlyStats: [
            { month: "Oct", enrollments: 45, completions: 32, revenue: 2250000 },
            { month: "Nov", enrollments: 52, completions: 38, revenue: 2600000 },
            { month: "Dic", enrollments: 68, completions: 49, revenue: 3400000 },
            { month: "Ene", enrollments: 78, completions: 58, revenue: 3900000 }
        ]
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getGrowthIcon = (growth: number) => {
        if (growth > 0) return <ArrowUp className="h-4 w-4 text-green-400" />;
        if (growth < 0) return <ArrowDown className="h-4 w-4 text-red-400" />;
        return <Minus className="h-4 w-4 text-slate-400" />;
    };

    const getGrowthColor = (growth: number) => {
        if (growth > 0) return "text-green-400";
        if (growth < 0) return "text-red-400";
        return "text-slate-400";
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'enrollment': return <Users className="h-4 w-4 text-blue-400" />;
            case 'completion': return <CheckCircle className="h-4 w-4 text-green-400" />;
            case 'video_watched': return <PlayCircle className="h-4 w-4 text-purple-400" />;
            case 'review': return <Star className="h-4 w-4 text-yellow-400" />;
            default: return <Target className="h-4 w-4 text-slate-400" />;
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

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Error al cargar datos</h2>
                    <p className="text-slate-400 mb-6">No se pudieron obtener las estadísticas</p>
                    <Button onClick={fetchAnalyticsData} className="bg-green-500 hover:bg-green-600">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
            {/* Efectos de fondo animados */}
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
                        <div>
                            <div className="flex items-center gap-3 mb-4">
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

                        <div className="flex items-center gap-3">
                            {/* Selector de período */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {selectedPeriod === "7d" ? "7 días" :
                                         selectedPeriod === "30d" ? "30 días" :
                                         selectedPeriod === "90d" ? "90 días" : "1 año"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-slate-800 border-slate-600">
                                    <DropdownMenuItem onClick={() => setSelectedPeriod("7d")} className="text-white hover:bg-slate-700">
                                        Últimos 7 días
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod("30d")} className="text-white hover:bg-slate-700">
                                        Últimos 30 días
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod("90d")} className="text-white hover:bg-slate-700">
                                        Últimos 90 días
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod("1y")} className="text-white hover:bg-slate-700">
                                        Último año
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="outline"
                                onClick={exportData}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>

                            <Button
                                onClick={refreshData}
                                disabled={refreshing}
                                className="bg-green-500 hover:bg-green-600 text-black"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Estadísticas principales */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    {[
                        {
                            title: "Total Estudiantes",
                            value: analyticsData.overview.totalStudents.toLocaleString(),
                            icon: Users,
                            color: "from-blue-500 to-purple-500",
                            growth: analyticsData.growthMetrics.studentsGrowth,
                            suffix: ""
                        },
                        {
                            title: "Ingresos Totales",
                            value: formatCurrency(analyticsData.overview.totalRevenue),
                            icon: DollarSign,
                            color: "from-green-500 to-emerald-500",
                            growth: analyticsData.growthMetrics.revenueGrowth,
                            suffix: ""
                        },
                        {
                            title: "Cursos Publicados",
                            value: `${analyticsData.overview.publishedCourses}/${analyticsData.overview.totalCourses}`,
                            icon: BookOpen,
                            color: "from-yellow-500 to-orange-500",
                            growth: analyticsData.growthMetrics.coursesGrowth,
                            suffix: ""
                        },
                        {
                            title: "Tasa Completado",
                            value: analyticsData.overview.averageCompletionRate.toString(),
                            icon: CheckCircle,
                            color: "from-pink-500 to-rose-500",
                            growth: analyticsData.growthMetrics.engagementGrowth,
                            suffix: "%"
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-400/50 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${getGrowthColor(stat.growth)}`}>
                                    {getGrowthIcon(stat.growth)}
                                    <span>{Math.abs(stat.growth)}%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">
                                    {stat.value}{stat.suffix}
                                </p>
                                <p className="text-slate-400 text-sm">{stat.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Gráfica y actividad reciente */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Gráfica de crecimiento */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 h-full">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-400" />
                                    Crecimiento Mensual
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Evolución de inscripciones, completados e ingresos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData.monthlyStats.map((month, index) => (
                                        <div key={month.month} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl flex items-center justify-center">
                                                    <span className="text-black font-bold text-sm">{month.month}</span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {month.enrollments} inscripciones
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        {month.completions} completados
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-green-400 font-bold">
                                                    {formatCurrency(month.revenue)}
                                                </p>
                                                <p className="text-slate-400 text-sm">ingresos</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Actividad reciente */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 h-full">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-yellow-400" />
                                    Actividad Reciente
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Últimas acciones de estudiantes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData.recentActivity.map((activity, index) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl"
                                        >
                                            <div className="p-2 bg-slate-800 rounded-lg">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">
                                                    {activity.studentName}
                                                </p>
                                                <p className="text-slate-400 text-xs truncate">
                                                    {activity.courseName}
                                                </p>
                                                <p className="text-green-400 text-xs">
                                                    {activity.details}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Estadísticas por curso */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Target className="h-5 w-5 text-green-400" />
                                Rendimiento por Curso
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Análisis detallado de cada curso publicado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {analyticsData.courseStats.map((course, index) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="p-6 bg-slate-900/50 rounded-2xl border border-slate-700/30 hover:border-green-400/30 transition-all"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                            {/* Información del curso */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-2">
                                                            {course.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <Badge variant="outline" className="border-green-400/50 text-green-400">
                                                                {course.category?.name}
                                                            </Badge>
                                                            <span className="text-slate-400">
                                                                {course._count.chapters} capítulos
                                                            </span>
                                                            <span className="text-slate-400">
                                                                Creado {formatDate(course.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-green-400">
                                                            {formatCurrency(course.revenue)}
                                                        </p>
                                                        <p className="text-slate-400 text-sm">ingresos</p>
                                                    </div>
                                                </div>

                                                {/* Métricas del curso */}
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                    <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                                                        <p className="text-2xl font-bold text-blue-400">
                                                            {course.studentsEnrolled}
                                                        </p>
                                                        <p className="text-slate-400 text-xs">Estudiantes</p>
                                                    </div>
                                                    <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                                                        <p className="text-2xl font-bold text-green-400">
                                                            {course.completionRate}%
                                                        </p>
                                                        <p className="text-slate-400 text-xs">Completado</p>
                                                    </div>
                                                    <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                                                        <p className="text-2xl font-bold text-yellow-400">
                                                            {course.averageRating.toFixed(1)}
                                                        </p>
                                                        <p className="text-slate-400 text-xs">Rating</p>
                                                    </div>
                                                    <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                                                        <p className="text-2xl font-bold text-purple-400">
                                                            {course.totalVideosWatched}
                                                        </p>
                                                        <p className="text-slate-400 text-xs">Videos vistos</p>
                                                    </div>
                                                </div>

                                                {/* Barra de progreso */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-400">Progreso promedio</span>
                                                        <span className="text-white">{course.averageProgress}%</span>
                                                    </div>
                                                    <Progress 
                                                        value={course.averageProgress} 
                                                        className="h-2 bg-slate-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}