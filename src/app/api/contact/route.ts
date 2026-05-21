import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const rateMap = new Map<string, { count: number; ts: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = rateMap.get(ip);
  if (!rec || now - rec.ts > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, ts: now });
    return true;
  }
  if (rec.count >= RATE_MAX) return false;
  rec.count += 1;
  return true;
}

interface Body {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.website && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name || '').trim().slice(0, 200);
  const email = (body.email || '').trim().slice(0, 200);
  const message = (body.message || '').trim().slice(0, 5000);

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and contact are required' }, { status: 400 });
  }

  const host = process.env.SMTP_HOST || 'smtp.yandex.ru';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO || user;
  const from = process.env.SMTP_FROM || user;

  if (!user || !pass) {
    console.error('SMTP credentials are missing');
    return NextResponse.json({ error: 'Server is not configured' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure             : port === 465,
    auth               : { user, pass },
    connectionTimeout  : 10_000,
    greetingTimeout    : 10_000,
    socketTimeout      : 15_000,
  });

  const subject = `Новая заявка с сайта · ${name}`;
  const text = [
    `Имя: ${name}`,
    `Контакт: ${email}`,
    `Сообщение: ${message || '—'}`,
    `IP: ${ip}`,
    `Время: ${new Date().toISOString()}`,
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#0f172a">
      <h2 style="margin:0 0 16px">Новая заявка с ai-cardio.ru</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td style="color:#64748b">Имя</td><td><b>${escapeHtml(name)}</b></td></tr>
        <tr><td style="color:#64748b">Контакт</td><td><b>${escapeHtml(email)}</b></td></tr>
        <tr><td style="color:#64748b;vertical-align:top">Сообщение</td><td>${escapeHtml(message || '—').replace(/\n/g, '<br/>')}</td></tr>
        <tr><td style="color:#64748b">IP</td><td>${escapeHtml(ip)}</td></tr>
        <tr><td style="color:#64748b">Время</td><td>${new Date().toISOString()}</td></tr>
      </table>
    </div>
  `;

  try {
    await transporter.sendMail({
      from   : `Cardio Assistant <${from}>`,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Mail send failed', e);
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  }
}
