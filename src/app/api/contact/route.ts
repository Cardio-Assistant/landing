import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

import { LEGAL_DOCS } from '@/legal/documents';

import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS || 15_000);
// An edition of a legal document is the date it came into force, e.g. 2026-10-13.
const EDITION = /^\d{4}-\d{2}-\d{2}$/;
const rateMap = new Map<string, { count: number; ts: number }>();

interface Body {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
  consent?: boolean;
  consentVersion?: string;
}

interface Lead {
  name: string;
  contact: string;
  message: string;
  ip: string;
  createdAt: string;
  // Proof of the consent (art. 9 of Federal Law 152-FZ): the edition of the consent the person saw.
  consentVersion: string;
}

interface SendResult {
  ok: boolean;
  channel: 'email';
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
    `Согласие на обработку ПД: дано, редакция ${lead.consentVersion}`,
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
        <tr><td style="color:#64748b">Согласие на обработку ПД</td><td>дано, редакция ${escapeHtml(lead.consentVersion)}</td></tr>
      </table>
    </div>
  `;
}

async function sendEmail(lead: Lead): Promise<SendResult> {
  const host = process.env.SMTP_HOST || 'smtp.beget.com';
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

  // The consent to the processing of personal data is given with its own checkbox, and the
  // form cannot be sent without it. The server does not rely on the browser: a request
  // without the consent is refused before anything is read, stored or forwarded.
  if (body.consent !== true) {
    return NextResponse.json({ error: 'Consent to personal data processing is required' }, { status: 400 });
  }

  const lead: Lead = {
    name          : (body.name || '').trim().slice(0, 200),
    contact       : (body.email || '').trim().slice(0, 200),
    message       : (body.message || '').trim().slice(0, 3000),
    ip,
    createdAt     : new Date().toISOString(),
    consentVersion: EDITION.test(body.consentVersion || '') ? String(body.consentVersion) : LEGAL_DOCS.consentContacts.version,
  };

  if (!lead.name || !lead.contact) {
    return NextResponse.json({ error: 'Name and contact are required' }, { status: 400 });
  }

  // Requests are delivered only by e-mail to the operator's mailbox on the mail service of
  // the ai-cardio.ru domain (Russia); nothing is sent to foreign services.
  const emailResult = await sendEmail(lead);
  if (emailResult.ok) {
    return NextResponse.json({ ok: true, channel: emailResult.channel });
  }

  console.error('Email send failed', emailResult.error);
  return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
}
