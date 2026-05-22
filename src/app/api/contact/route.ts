import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { ProxyAgent } from 'undici';

import type { NextRequest } from 'next/server';
import type { Dispatcher } from 'undici';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const TELEGRAM_API = 'https://api.telegram.org';
const TELEGRAM_TIMEOUT_MS = Number(process.env.TELEGRAM_TIMEOUT_MS || 12_000);
const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS || 15_000);
const rateMap = new Map<string, { count: number; ts: number }>();
const proxyAgents = new Map<string, Dispatcher>();

interface Body {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
}

interface Lead {
  name: string;
  contact: string;
  message: string;
  ip: string;
  createdAt: string;
}

interface SendResult {
  ok: boolean;
  channel: 'telegram' | 'email';
  error?: unknown;
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

function buildTelegramText(lead: Lead) {
  const lines = [
    '<b>Новая заявка с ai-cardio.ru</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contact)}`,
    `<b>Сообщение:</b> ${escapeHtml(lead.message || '—')}`,
    '',
    `<b>IP:</b> ${escapeHtml(lead.ip)}`,
    `<b>Время:</b> ${lead.createdAt}`,
  ];

  return lines.join('\n').slice(0, 4000);
}

function buildEmailText(lead: Lead) {
  return [
    'Новая заявка с ai-cardio.ru',
    '',
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    `Сообщение: ${lead.message || '—'}`,
    '',
    `IP: ${lead.ip}`,
    `Время: ${lead.createdAt}`,
  ].join('\n');
}

function buildEmailHtml(lead: Lead) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a">
      <h2 style="margin:0 0 16px">Новая заявка с ai-cardio.ru</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td style="color:#64748b">Имя</td><td><b>${escapeHtml(lead.name)}</b></td></tr>
        <tr><td style="color:#64748b">Контакт</td><td><b>${escapeHtml(lead.contact)}</b></td></tr>
        <tr><td style="color:#64748b;vertical-align:top">Сообщение</td><td>${escapeHtml(lead.message || '—').replace(/\n/g, '<br/>')}</td></tr>
        <tr><td style="color:#64748b">IP</td><td>${escapeHtml(lead.ip)}</td></tr>
        <tr><td style="color:#64748b">Время</td><td>${lead.createdAt}</td></tr>
      </table>
    </div>
  `;
}

function getTelegramProxyAgent(proxyUrl?: string): Dispatcher | undefined {
  if (!proxyUrl) return undefined;

  const cached = proxyAgents.get(proxyUrl);
  if (cached) return cached;

  const agent = new ProxyAgent(proxyUrl);
  proxyAgents.set(proxyUrl, agent);
  return agent;
}

async function sendTelegram(lead: Lead): Promise<SendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const threadId = process.env.TELEGRAM_THREAD_ID;
  const telegramApi = (process.env.TELEGRAM_API_BASE || TELEGRAM_API).replace(/\/$/, '');
  const proxyAgent = getTelegramProxyAgent(process.env.TELEGRAM_PROXY_URL);

  if (!token || !chatId) {
    return { ok: false, channel: 'telegram', error: new Error('Telegram credentials are missing') };
  }

  const payload: Record<string, string | boolean> = {
    chat_id                 : chatId,
    text                    : buildTelegramText(lead),
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
      return {
        ok     : false,
        channel: 'telegram',
        error  : new Error(`Telegram responded ${res.status}: ${details}`),
      };
    }

    return { ok: true, channel: 'telegram' };
  } catch (error) {
    return { ok: false, channel: 'telegram', error };
  }
}

async function sendEmail(lead: Lead): Promise<SendResult> {
  const host = process.env.SMTP_HOST || 'smtp.yandex.ru';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO || user;
  const from = process.env.SMTP_FROM || user;

  if (!user || !pass || !to || !from) {
    return { ok: false, channel: 'email', error: new Error('SMTP credentials are missing') };
  }

  const transporter = createTransport({
    host,
    port,
    secure           : port === 465,
    auth             : { user, pass },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout  : SMTP_TIMEOUT_MS,
    socketTimeout    : SMTP_TIMEOUT_MS,
  });

  try {
    await transporter.sendMail({
      from   : `Cardio Assistant <${from}>`,
      to,
      replyTo: lead.contact,
      subject: `Новая заявка с сайта · ${lead.name}`,
      text   : buildEmailText(lead),
      html   : buildEmailHtml(lead),
    });

    return { ok: true, channel: 'email' };
  } catch (error) {
    return { ok: false, channel: 'email', error };
  }
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

  const lead: Lead = {
    name     : (body.name || '').trim().slice(0, 200),
    contact  : (body.email || '').trim().slice(0, 200),
    message  : (body.message || '').trim().slice(0, 3000),
    ip,
    createdAt: new Date().toISOString(),
  };

  if (!lead.name || !lead.contact) {
    return NextResponse.json({ error: 'Name and contact are required' }, { status: 400 });
  }

  const telegramResult = await sendTelegram(lead);
  if (telegramResult.ok) {
    return NextResponse.json({ ok: true, channel: telegramResult.channel });
  }

  console.error('Telegram send failed, trying email fallback', telegramResult.error);

  const emailResult = await sendEmail(lead);
  if (emailResult.ok) {
    return NextResponse.json({ ok: true, channel: emailResult.channel, fallback: true });
  }

  console.error('Email fallback failed', emailResult.error);
  return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
}
