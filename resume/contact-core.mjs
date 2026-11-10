/* Server-side contact handler for resume.bfloore.online.
   Recipients and provider keys come from the environment only.
   This file must not contain a mailbox address. */

export const MESSAGES = {
  unconfigured: 'The contact form is not set up yet. Book a time still works.',
  check: 'That message could not be checked. Try again.',
  invalid: 'Please add a name, a valid email, and a message.',
  tooLong: 'That message is too long.',
  rate: 'Too many messages from this network. Wait a few minutes and try again.',
  send: 'The message could not be sent. Book a time, or try again later.'
};

const WINDOW_MS = 10 * 60 * 1000;
const IP_LIMIT = 5;
const GLOBAL_LIMIT = 40;
const MAX_BODY = 20000;
const memory = new Map();

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

function isEmail(value) {
  if (typeof value !== 'string') return false;
  const s = value.trim();
  if (s.length < 3 || s.length > 120) return false;
  if (/[\r\n\0]/.test(s)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function fromAddress(value) {
  const s = String(value || '').trim();
  if (!s || s.length > 160 || /[\r\n\0]/.test(s)) return '';
  const wrapped = s.match(/^(.*)<([^<>]+)>$/);
  if (wrapped) {
    const name = wrapped[1].trim().replace(/["<>]/g, '');
    const email = wrapped[2].trim();
    if (!name || !isEmail(email)) return '';
    return name + ' <' + email + '>';
  }
  return isEmail(s) ? s : '';
}

export function recipients(value) {
  const list = String(value || '')
    .split(',')
    .map(function (part) { return part.trim(); })
    .filter(isEmail);
  return list.slice(0, 5);
}

export function hostnamesOf(env) {
  const raw = String((env && env.TURNSTILE_HOSTNAMES) || '').trim();
  const parts = (raw || 'resume.bfloore.online')
    .split(',')
    .map(function (part) { return part.trim().toLowerCase(); })
    .filter(Boolean);
  return parts.filter(function (host) {
    return /^[a-z0-9.-]+$/.test(host) && host.indexOf('..') === -1 && host.length <= 253;
  });
}

export function isConfigured(env) {
  if (!env) return false;
  if (!String(env.RESEND_API_KEY || '').trim()) return false;
  if (!String(env.TURNSTILE_SECRET || '').trim()) return false;
  if (!String(env.TURNSTILE_SITE_KEY || '').trim()) return false;
  if (!fromAddress(env.CONTACT_FROM)) return false;
  if (!recipients(env.CONTACT_TO).length) return false;
  if (!hostnamesOf(env).length) return false;
  return true;
}

function clientIp(request) {
  return String(request.headers.get('cf-connecting-ip') || '').trim() || 'unknown';
}

export function allowRate(store, ip, now) {
  function hit(key, limit) {
    const prev = (store.get(key) || []).filter(function (t) { return now - t < WINDOW_MS; });
    if (prev.length >= limit) {
      store.set(key, prev);
      return false;
    }
    prev.push(now);
    store.set(key, prev);
    return true;
  }
  if (store.size > 1000) {
    const first = store.keys().next().value;
    store.delete(first);
  }
  if (!hit('ip:' + (ip || 'unknown'), IP_LIMIT)) return false;
  if (!hit('global', GLOBAL_LIMIT)) return false;
  return true;
}

function originHost(request) {
  const origin = request.headers.get('origin');
  if (origin) {
    try { return new URL(origin).hostname.toLowerCase(); } catch (err) { return ''; }
  }
  const referer = request.headers.get('referer');
  if (referer) {
    try { return new URL(referer).hostname.toLowerCase(); } catch (err) { return ''; }
  }
  return '';
}

function cleanName(value) {
  if (typeof value !== 'string') return '';
  const name = value.replace(/[\r\n\0]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!name || name.length > 80) return '';
  return name;
}

function cleanMessage(value) {
  if (typeof value !== 'string') return '';
  const message = value.replace(/\0/g, '').trim();
  if (!message || message.length > 4000) return '';
  return message;
}

function honeypotTripped(body) {
  const value = body && body.company;
  if (value == null) return false;
  return String(value).trim() !== '';
}

function pageLine(value, hosts) {
  if (typeof value !== 'string' || value.length > 500) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    if (hosts.indexOf(url.hostname.toLowerCase()) === -1) return '';
    return url.toString();
  } catch (err) {
    return '';
  }
}

async function verifyTurnstile(fetchImpl, env, token, ip, hosts) {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) return false;
  if (!hosts.length) return false;
  let result;
  try {
    const body = new URLSearchParams({
      secret: String(env.TURNSTILE_SECRET).trim(),
      response: token
    });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);
    const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body,
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return false;
    result = await response.json();
  } catch (err) {
    return false;
  }
  return !!(
    result &&
    result.success === true &&
    result.action === 'contact' &&
    hosts.indexOf(String(result.hostname || '').toLowerCase()) !== -1
  );
}

async function sendMail(fetchImpl, env, note) {
  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + String(env.RESEND_API_KEY).trim(),
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from: fromAddress(env.CONTACT_FROM),
      to: recipients(env.CONTACT_TO),
      reply_to: note.email,
      subject: 'Resume inquiry from ' + note.name,
      text: note.text
    }),
    signal: AbortSignal.timeout(10000)
  });
  return response.ok;
}

export async function handleContact(request, env, deps) {
  const method = request.method;
  if (method === 'GET') {
    if (!isConfigured(env)) return json(200, { ok: true, configured: false });
    return json(200, {
      ok: true,
      configured: true,
      turnstileSiteKey: String(env.TURNSTILE_SITE_KEY).trim()
    });
  }
  if (method !== 'POST') return json(405, { ok: false, error: MESSAGES.check });

  const hosts = hostnamesOf(env);
  const host = originHost(request);
  if (!host || hosts.indexOf(host) === -1) return json(403, { ok: false, error: MESSAGES.check });

  const claimed = Number(request.headers.get('content-length') || 0);
  if (claimed > MAX_BODY) return json(413, { ok: false, error: MESSAGES.tooLong });
  const type = String(request.headers.get('content-type') || '').toLowerCase();
  if (type.indexOf('application/json') === -1) return json(400, { ok: false, error: MESSAGES.invalid });

  const fetchImpl = (deps && deps.fetch) || fetch;
  const store = (deps && deps.store) || memory;
  const now = (deps && deps.now) || Date.now();
  if (!allowRate(store, clientIp(request), now)) return json(429, { ok: false, error: MESSAGES.rate });

  let text = '';
  try { text = await request.text(); } catch (err) { return json(400, { ok: false, error: MESSAGES.invalid }); }
  if (text.length > MAX_BODY) return json(413, { ok: false, error: MESSAGES.tooLong });

  let body;
  try { body = JSON.parse(text); } catch (err) { return json(400, { ok: false, error: MESSAGES.invalid }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json(400, { ok: false, error: MESSAGES.invalid });
  }

  if (honeypotTripped(body)) return json(200, { ok: true });

  if (!isConfigured(env)) return json(503, { ok: false, error: MESSAGES.unconfigured });

  const name = cleanName(body.name);
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = cleanMessage(body.message);
  if (!name || !isEmail(email) || !message) return json(400, { ok: false, error: MESSAGES.invalid });

  const token = body['cf-turnstile-response'];
  const ip = clientIp(request);
  const turned = await verifyTurnstile(fetchImpl, env, token, ip, hosts);
  if (!turned) return json(403, { ok: false, error: MESSAGES.check });

  const page = pageLine(body.page, hosts);
  const letter = [
    'Name: ' + name,
    'Reply-to: ' + email,
    page ? 'Page: ' + page : null,
    '',
    message
  ].filter(function (line) { return line !== null; }).join('\n');

  let sent = false;
  try {
    sent = await sendMail(fetchImpl, env, { name: name, email: email, text: letter });
  } catch (err) {
    sent = false;
  }
  if (!sent) return json(502, { ok: false, error: MESSAGES.send });
  return json(200, { ok: true });
}
