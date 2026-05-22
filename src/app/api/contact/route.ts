import { NextResponse } from 'next/server';
import { ProxyAgent } from 'undici';

import type { NextRequest } from 'next/server';
import type { Dispatcher } from 'undici';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const TELEGRAM_API = 'https://api.telegram.org';
const TELEGRAM_TIMEOUT_MS = 12_000;
const rateMap = new Map<string, { count: number; ts: number }>();
const proxyAgents = new Map<string, Dispatcher>();

interface Body {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
}

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildTelegramText({
  name,
  contact,
  message,
  ip,
}: {
  name: string;
  contact: string;
  message: string;
  ip: string;
}) {
  const lines = [
    '<b>Новая заявка с ai-cardio.ru</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Контакт:</b> ${escapeHtml(contact)}`,
    `<b>Сообщение:</b> ${escapeHtml(message || '—')}`,
    '',
    `<b>IP:</b> ${escapeHtml(ip)}`,
    `<b>Время:</b> ${new Date().toISOString()}`,
  ];

  return lines.join('\n').slice(0, 4000);
}

function getTelegramProxyAgent(proxyUrl?: string): Dispatcher | undefined {
  if (!proxyUrl) return undefined;

  const cached = proxyAgents.get(proxyUrl);
  if (cached) return cached;

  const agent = new ProxyAgent(proxyUrl);
  proxyAgents.set(proxyUrl, agent);
  return agent;
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
  const contact = (body.email || '').trim().slice(0, 200);
  const message = (body.message || '').trim().slice(0, 3000);

  if (!name || !contact) {
    return NextResponse.json({ error: 'Name and contact are required' }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const threadId = process.env.TELEGRAM_THREAD_ID;
  const telegramApi = (process.env.TELEGRAM_API_BASE || TELEGRAM_API).replace(/\/$/, '');
  const proxyAgent = getTelegramProxyAgent(process.env.TELEGRAM_PROXY_URL);

  if (!token || !chatId) {
    console.error('Telegram credentials are missing');
    return NextResponse.json({ error: 'Server is not configured' }, { status: 500 });
  }

  const payload: Record<string, string | boolean> = {
    chat_id                 : chatId,
    text                    : buildTelegramText({ name, contact, message, ip }),
    parse_mode              : 'HTML',
    disable_web_page_preview: true,
  };

  if (threadId) {
    payload.message_thread_id = threadId;
  }

  try {
    const requestOptions: RequestInit & { dispatcher?: Dispatcher } = {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload),
      signal : AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    };

    if (proxyAgent) {
      requestOptions.dispatcher = proxyAgent;
    }

    const res = await fetch(`${telegramApi}/bot${token}/sendMessage`, requestOptions);

    if (!res.ok) {
      const details = await res.text().catch(() => '');
      console.error('Telegram send failed', res.status, details);
      return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Telegram request failed', e);
    return NextResponse.json({ error: 'Telegram is unavailable' }, { status: 502 });
  }
}
