"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, Check, X, Trophy, CheckCircle, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

interface NotificationsPanelProps {
  courseId: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedCourseId?: string;
  relatedChapterId?: string;
}

export const NotificationsPanel = ({ courseId }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/teacher/notifications/${courseId}`);
      setNotifications(response.data);
      
      const unread = response.data.filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`/api/teacher/notifications/${notificationId}/read`);
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success("✅ Notificación marcada como leída");
    } catch (error) {
      toast.error("❌ Error al marcar como leída");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`/api/teacher/notifications/${courseId}/read-all`);
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
      
      toast.success("✅ Todas las notificaciones marcadas como leídas");
    } catch (error) {
      toast.error("❌ Error al marcar todas como leídas");
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [courseId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "course_completion":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "chapter_completion":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="relative bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 text-white"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-4 w-4 text-yellow-500" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">
                📢 Notificaciones
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Marcar todas
                  </Button>
                )}
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <p className="text-slate-400 text-sm mt-1">
                {unreadCount} {unreadCount === 1 ? 'nueva' : 'nuevas'}
              </p>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="w-6 h-6 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Cargando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer border-l-4 ${
                      notification.isRead 
                        ? 'border-l-transparent bg-slate-800/20' 
                        : 'border-l-yellow-500 bg-yellow-500/10'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-semibold text-sm leading-tight ${
                            notification.isRead ? 'text-slate-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h4>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Calendar className="h-3 w-3 text-slate-500" />
                            <span className="text-xs text-slate-500">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        <p className={`text-sm mt-1 leading-relaxed ${
                          notification.isRead ? 'text-slate-400' : 'text-slate-200'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {!notification.isRead && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md text-xs font-medium">
                              <BellRing className="h-3 w-3" />
                              Nueva
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
              <Button
                onClick={fetchNotifications}
                variant="ghost"
                size="sm"
                className="w-full text-slate-400 hover:text-white text-sm"
              >
                🔄 Actualizar notificaciones
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 