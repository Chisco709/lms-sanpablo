// Endpoint de health check para monitoreo del sistema
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";
import { logger } from "@/lib/logger";
import { withSecurity } from "@/lib/security";
import { getErrorResponse } from "@/lib/error-handler";

// GET /api/health - Health check básico
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Verificar estado de la base de datos
    const dbHealth = await database.healthCheck();
    
    // Estadísticas básicas del sistema
    const systemStats = await database.getSystemStats();
    const dbStats = database.getStats();
    
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: dbHealth.status === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      responseTime,
      services: {
        database: dbHealth,
        application: {
          status: 'ok',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          queryCount: dbStats.queryCount
        }
      },
      metrics: {
        ...systemStats,
        performance: {
          responseTime,
          slowQueryThreshold: dbStats.slowQueryThreshold
        }
      }
    };

    logger.info('Health check completed', {
      status: healthData.status,
      responseTime,
      dbLatency: dbHealth.latency
    });

    return NextResponse.json(healthData, {
      status: healthData.status === 'ok' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    logger.error('Health check failed', {}, error as Error);
    
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        database: { status: 'unknown' },
        application: { status: 'error' }
      }
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
  }
}

// POST /api/health - Health check detallado (solo para administradores)
export const POST = withSecurity(async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('details') === 'true';
    
    if (!includeDetails) {
      return NextResponse.json({ message: 'Use GET for basic health check' });
    }

    // Health check detallado
    const [dbHealth, systemStats] = await Promise.all([
      database.healthCheck(),
      database.getSystemStats()
    ]);

    // Información adicional del sistema
    const detailedHealth = {
      status: dbHealth.status === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      system: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      },
      database: dbHealth,
      metrics: systemStats,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || 'unknown'
      }
    };

    logger.info('Detailed health check completed', {
      status: detailedHealth.status,
      memoryUsage: detailedHealth.system.memory.heapUsed,
      uptime: detailedHealth.system.uptime
    });

    return NextResponse.json(detailedHealth);

  } catch (error) {
    logger.error('Detailed health check failed', {}, error as Error);
    
    return NextResponse.json(
      getErrorResponse(error as any),
      { status: 500 }
    );
  }
}, {
  requireTeacher: true, // Solo profesores pueden acceder al health check detallado
  rateLimit: { maxRequests: 10, windowMs: 60000 } // 10 requests por minuto
}); 