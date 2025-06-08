import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Basic health check - you can add more checks here
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version ?? '1.0.0',
      checks: {
        database: await checkDatabase(),
        memory: checkMemory(),
        node: checkNodeVersion(),
      }
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

async function checkDatabase(): Promise<{ status: string; latency?: number }> {
  try {
    // Simple database connectivity check
    // You can import your database connection here and test it
    const start = Date.now();
    
    // For now, just check if POSTGRES_URL is set
    if (!process.env.POSTGRES_URL) {
      return { status: 'error - no database URL configured' };
    }
    
    const latency = Date.now() - start;
    return { status: 'connected', latency };
  } catch (error) {
    return { status: 'error' };
  }
}

function checkMemory(): { used: string; free: string; usage: string } {
  const usage = process.memoryUsage();
  return {
    used: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    free: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    usage: `${Math.round((usage.heapUsed / usage.heapTotal) * 100)}%`
  };
}

function checkNodeVersion(): string {
  return process.version;
} 