import { NextResponse } from 'next/server';

export async function GET(req, res) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false });
  }
  return NextResponse.json({ ok: true });
}
