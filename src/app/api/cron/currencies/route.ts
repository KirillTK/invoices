import type { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  console.log('TEST CRON', request);
}