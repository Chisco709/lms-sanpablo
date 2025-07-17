import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDataCache } from './use-data-cache';
import toast from 'react-hot-toast';

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
  _count: {
    chapters: number;
    purchases: number;
  };
}

interface AnalyticsData {
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  completionRate: number;
  recentActivity: Array<{
    id: string;
    type: string;
    details: string;
    timestamp: string;
  }>;
  topPerformingCourses: Course[];
}

export function useTeacherData() {
  const cache = useDataCache<any>({ ttl: 2 * 60 * 1000 }); // 2 minutos TTL
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async (): Promise<Course[]> => {
    const cacheKey = 'teacher-courses';
    
    // Verificar cache primero
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      setLoading(true);
      const response = await axios.get('/api/courses');
      const courses = response.data;
      
      // Guardar en cache
      cache.set(cacheKey, courses);
      
      return courses;
    } catch (error) {
      toast.error('Error al cargar cursos');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const fetchAnalytics = useCallback(async (period: string = '30d'): Promise<AnalyticsData> => {
    const cacheKey = `teacher-analytics-${period}`;
    
    // Verificar cache primero
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/teacher/analytics?period=${period}`);
      const analytics = response.data;
      
      // Guardar en cache
      cache.set(cacheKey, analytics);
      
      return analytics;
    } catch (error) {
      toast.error('Error al cargar analytics');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const deleteCourse = useCallback(async (courseId: string): Promise<void> => {
    try {
      await axios.delete(`/api/courses/${courseId}`);
      
      // Invalidar cache de cursos
      cache.invalidatePattern('teacher-courses');
      cache.invalidatePattern('teacher-analytics');
      
      toast.success('Curso eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar curso');
      throw error;
    }
  }, [cache]);

  const updateCourse = useCallback(async (courseId: string, data: Partial<Course>): Promise<void> => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data);
      
      // Invalidar cache
      cache.invalidatePattern('teacher-courses');
      cache.invalidatePattern('teacher-analytics');
      
      toast.success('Curso actualizado');
    } catch (error) {
      toast.error('Error al actualizar curso');
      throw error;
    }
  }, [cache]);

  const refreshData = useCallback((pattern?: string) => {
    if (pattern) {
      cache.invalidatePattern(pattern);
    } else {
      cache.clear();
    }
  }, [cache]);

  return {
    fetchCourses,
    fetchAnalytics,
    deleteCourse,
    updateCourse,
    refreshData,
    loading,
    cacheSize: cache.size
  };
} 