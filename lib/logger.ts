// Sistema de logging profesional para producción
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class ProductionLogger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isServer = typeof window === 'undefined';

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isServer) return false; // Solo logs del servidor en producción
    
    const logLevels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    const minLevel = this.isProduction ? 'info' : 'debug';
    return logLevels[level] >= logLevels[minLevel];
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as any : undefined
    };
  }

  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const logMessage = this.isProduction 
      ? JSON.stringify(entry)
      : `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(logMessage, entry.context);
        break;
      case 'info':
        console.info(logMessage, entry.context);
        break;
      case 'warn':
        console.warn(logMessage, entry.context);
        break;
      case 'error':
        console.error(logMessage, entry.context, entry.error);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.output(this.createLogEntry('debug', message, context));
  }

  info(message: string, context?: Record<string, any>): void {
    this.output(this.createLogEntry('info', message, context));
  }

  warn(message: string, context?: Record<string, any>): void {
    this.output(this.createLogEntry('warn', message, context));
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.output(this.createLogEntry('error', message, context, error));
  }

  // Métodos específicos para APIs
  apiRequest(method: string, path: string, userId?: string): void {
    this.info('API Request', { method, path, userId });
  }

  apiResponse(method: string, path: string, status: number, duration: number): void {
    this.info('API Response', { method, path, status, duration });
  }

  apiError(method: string, path: string, error: Error, userId?: string): void {
    this.error('API Error', { method, path, userId }, error);
  }

  // Métodos para eventos de negocio
  courseCreated(courseId: string, userId: string): void {
    this.info('Course Created', { courseId, userId });
  }

  chapterCreated(chapterId: string, courseId: string, userId: string): void {
    this.info('Chapter Created', { chapterId, courseId, userId });
  }

  userAuthenticated(userId: string, email?: string): void {
    this.info('User Authenticated', { userId, email });
  }

  fileUploaded(fileName: string, size: number, userId: string): void {
    this.info('File Uploaded', { fileName, size, userId });
  }

  databaseQuery(query: string, duration: number): void {
    if (duration > 1000) { // Solo queries lentas
      this.warn('Slow Database Query', { query, duration });
    }
  }
}

// Singleton logger
export const logger = new ProductionLogger();

// Alias para compatibilidad con database.ts
export const dbLogger = logger;

// Interfaz para contexto de logs
export interface LogContext {
  userId?: string;
  courseId?: string;
  chapterId?: string;
  operation?: string;
  [key: string]: any;
}

// Utilidad para envolver APIs con logging
export function withApiLogging<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  method: string,
  path: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();
    const userId = args[0]?.userId; // Asumir primer arg tiene userId
    
    try {
      logger.apiRequest(method, path, userId);
      const result = await handler(...args);
      const duration = Date.now() - startTime;
      logger.apiResponse(method, path, 200, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.apiError(method, path, error as Error, userId);
      logger.apiResponse(method, path, 500, duration);
      throw error;
    }
  }) as T;
} 