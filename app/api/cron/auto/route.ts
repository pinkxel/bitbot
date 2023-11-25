import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('BITBOT v2')
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false });
  }
  return NextResponse.json({ ok: true });
}
