// Sistema de seguridad para LMS San Pablo
import { auth, currentUser } from "@clerk/nextjs/server";
import { logger } from './logger';

export interface SecurityContext {
  userId: string;
  role?: string;
  permissions?: string[];
  resourceId?: string;
  action?: string;
}

// Funciones de autenticación
export async function validateAuth(): Promise<SecurityContext> {
  const { userId } = await auth();
  
  if (!userId) {
    logger.warn('Unauthorized access attempt');
    throw new Error('Authentication required');
  }

  const user = await currentUser();
  
  return {
    userId,
    role: user?.publicMetadata?.role as string,
    permissions: user?.publicMetadata?.permissions as string[]
  };
}

export async function validateTeacherAuth(): Promise<SecurityContext> {
  const context = await validateAuth();
  
  // Verificar credenciales de profesor específicas
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  
  if (email !== 'chiscojjcm@gmail.com') {
    logger.warn('Unauthorized teacher access attempt', { userId: context.userId, email });
    throw new Error('Teacher access denied');
  }

  logger.info('Teacher authenticated successfully', { userId: context.userId });
  
  return {
    ...context,
    role: 'teacher',
    permissions: ['manage_courses', 'manage_students', 'view_analytics']
  };
}

// Validación de permisos
export function hasPermission(context: SecurityContext, requiredPermission: string): boolean {
  if (!context.permissions) return false;
  return context.permissions.includes(requiredPermission);
}

export function requirePermission(context: SecurityContext, requiredPermission: string): void {
  if (!hasPermission(context, requiredPermission)) {
    logger.warn('Permission denied', { 
      userId: context.userId, 
      requiredPermission,
      userPermissions: context.permissions 
    });
    throw new Error(`Permission denied: ${requiredPermission}`);
  }
}

// Validación de acceso a recursos
export async function validateCourseAccess(userId: string, courseId: string): Promise<boolean> {
  try {
    // Esta función debería verificar si el usuario tiene acceso al curso
    // Por ahora, simplificado para profesores
    const context = await validateAuth();
    
    if (context.role === 'teacher') {
      return true; // Los profesores tienen acceso a todos los cursos
    }

    // Para estudiantes, verificar inscripción
    // Aquí iría la lógica de verificación con la base de datos
    logger.info('Course access validation', { userId, courseId });
    
    return false; // Por defecto, denegar acceso
  } catch (error) {
    logger.error('Course access validation failed', { userId, courseId }, error as Error);
    return false;
  }
}

export async function validateChapterAccess(userId: string, courseId: string, chapterId: string): Promise<boolean> {
  try {
    // Primero verificar acceso al curso
    const hasCourseAccess = await validateCourseAccess(userId, courseId);
    if (!hasCourseAccess) return false;

    // Verificar si el capítulo es gratuito o si el usuario tiene acceso
    logger.info('Chapter access validation', { userId, courseId, chapterId });
    
    return true; // Simplificado por ahora
  } catch (error) {
    logger.error('Chapter access validation failed', { userId, courseId, chapterId }, error as Error);
    return false;
  }
}

// Sanitización de datos
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres peligrosos básicos
    .slice(0, 1000); // Limitar longitud
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}

// Validación de IDs
export function isValidId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  
  // Validar UUID v4 básico
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function validateIds(...ids: string[]): void {
  for (const id of ids) {
    if (!isValidId(id)) {
      throw new Error(`Invalid ID format: ${id}`);
    }
  }
}

// Rate limiting básico (en memoria)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const existing = rateLimitMap.get(identifier);
  
  if (!existing || existing.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= maxRequests) {
    logger.warn('Rate limit exceeded', { identifier, count: existing.count });
    return false;
  }
  
  existing.count++;
  return true;
}

// Wrapper para rutas API con seguridad
export function withSecurity<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  options: {
    requireAuth?: boolean;
    requireTeacher?: boolean;
    requiredPermission?: string;
    rateLimit?: { maxRequests: number; windowMs: number };
  } = {}
): T {
  return (async (...args: any[]) => {
    try {
      // Rate limiting
      if (options.rateLimit) {
        const identifier = args[0]?.userId || 'anonymous';
        if (!checkRateLimit(identifier, options.rateLimit.maxRequests, options.rateLimit.windowMs)) {
          throw new Error('Rate limit exceeded');
        }
      }

      // Autenticación
      if (options.requireAuth || options.requireTeacher) {
        const context = options.requireTeacher 
          ? await validateTeacherAuth()
          : await validateAuth();

        // Verificar permisos específicos
        if (options.requiredPermission) {
          requirePermission(context, options.requiredPermission);
        }

        // Agregar contexto al primer argumento si es un objeto
        if (typeof args[0] === 'object' && args[0] !== null) {
          args[0].securityContext = context;
        }
      }

      return await handler(...args);
    } catch (error) {
      logger.error('Security validation failed', {}, error as Error);
      throw error;
    }
  }) as T;
} 