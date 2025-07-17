// Sistema profesional de manejo de errores
import { logger } from './logger';

export interface ErrorContext {
  userId?: string;
  courseId?: string;
  chapterId?: string;
  operation?: string;
  additionalData?: Record<string, any>;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: ErrorContext;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: ErrorContext
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(`Database Error: ${message}`, 500, true, context);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(`Validation Error: ${message}`, 400, true, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: ErrorContext) {
    super(message, 401, true, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: ErrorContext) {
    super(message, 403, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', context?: ErrorContext) {
    super(`${resource} not found`, 404, true, context);
  }
}

// Función para manejar errores de manera centralizada
export function handleError(error: unknown, context?: ErrorContext): AppError {
  // Log del error
  logger.error('Error handled', context, error as Error);

  // Si ya es un AppError, lo devolvemos
  if (error instanceof AppError) {
    return error;
  }

  // Si es un error de Prisma
  if (isPrismaError(error)) {
    return handlePrismaError(error, context);
  }

  // Error genérico
  return new AppError(
    error instanceof Error ? error.message : 'Unknown error occurred',
    500,
    false,
    context
  );
}

// Detectar errores de Prisma
function isPrismaError(error: unknown): boolean {
  return error instanceof Error && (
    error.name === 'PrismaClientKnownRequestError' ||
    error.name === 'PrismaClientUnknownRequestError' ||
    error.name === 'PrismaClientValidationError'
  );
}

// Manejar errores específicos de Prisma
function handlePrismaError(error: any, context?: ErrorContext): AppError {
  const code = error.code;

  switch (code) {
    case 'P2002':
      return new ValidationError('Duplicate record found', context);
    case 'P2025':
      return new NotFoundError('Record', context);
    case 'P2003':
      return new ValidationError('Foreign key constraint failed', context);
    case 'P2021':
      return new DatabaseError('Table does not exist', context);
    default:
      return new DatabaseError(error.message || 'Database operation failed', context);
  }
}

// Utilidad para respuestas HTTP de error
export function getErrorResponse(error: AppError) {
  return {
    error: {
      message: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      context: error.context
    }
  };
}

// Función para validar que un error es operacional
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

// Wrapper para funciones async con manejo de errores
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error, context);
    }
  }) as T;
} 