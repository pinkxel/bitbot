// /api/cron/auto/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // Aquí reemplazas con el código que quieres ejecutar cuando se ejecute el cron job.
  console.log('BITBOT');
  return new NextResponse();
}