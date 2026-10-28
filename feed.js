/* ============================================================
   /api/feed — the blogroll.
   Pulls every writing + audio feed, merges them, sorts newest
   first. Cached at Vercel's edge for an hour, served stale for a
   day while it refreshes. No dependencies.
   Add a source: one line in SOURCES.
   ============================================================ */
const SOURCES = [
  { id: 'medium',   label: 'Medium',                url: 'https://medium.com/feed/@bfloore',                  home: 'https://medium.com/@bfloore',                    kind: 'essay'   },
  { id: 'substack', label: 'Substack',              url: 'https://barryfloore.substack.com/feed',             home: 'https://barryfloore.substack.com',               kind: 'dispatch'},
  { id: 'gaslight', label: 'American Gaslighter',   url: 'https://americangaslightercom.wordpress.com/feed/', home: 'https://americangaslightercom.wordpress.com',    kind: 'blog'    },
  { id: 'ceai',     label: 'Cultivating Ethical AI',url: 'https://anchor.fm/s/eed77758/podcast/rss',          home: 'https://open.spotify.com/show/2nGTlVMwCufnCq4NUssGT9', kind: 'episode' },
  { id: 'liars',    label: 'The Lying Liars',       url: 'https://media.rss.com/the-lying-liars/feed.xml',    home: 'https://thelyingliars.online',                   kind: 'episode' }
];
/* titles that are platform placeholders, not posts */
const SKIP = /^(coming soon|welcome to|hello world)/i;
/* boilerplate the hosts inject; scrubbed from titles and excerpts */
const TITLE_NOISE = [/\s*\[\s*TheLyingLiars\.online\s*\]\s*/gi];
const BODY_NOISE = [/Hey! I'd love to hear your thoughts, send me a voice note\.?/gi, /module description\s*-*/gi];
function scrub(s, list) { list.forEach((re) => { s = s.replace(re, ' '); }); return s.replace(/\s+/g, ' ').trim(); }

function decode(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&apos;|&#039;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function strip(html) {
  return decode(decode(html))
    .replace(/<(script|style|figure)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
function tag(block, name) {
  const m = block.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i'));
  return m ? m[1] : '';
}
function clip(s, n) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…';
}
function duration(raw) {
  raw = strip(raw);
  if (!raw) return '';
  let secs = /:/.test(raw) ? raw.split(':').reduce((a, v) => a * 60 + (+v || 0), 0) : +raw;
  if (!secs) return '';
  const m = Math.round(secs / 60);
  return m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60) + 'm' : m + ' min';
}

function parse(xml, src) {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  return items.map((it) => {
    const title = scrub(strip(tag(it, 'title')), TITLE_NOISE);
    let link = strip(tag(it, 'link'));
    if (!link) { const g = strip(tag(it, 'guid')); if (/^https?:/.test(g)) link = g; }
    const date = new Date(strip(tag(it, 'pubDate')) || strip(tag(it, 'dc:date')));
    const body = tag(it, 'description') || tag(it, 'content:encoded') || tag(it, 'itunes:summary');
    return {
      id: src.id + ':' + (link || title).replace(/[?#].*$/, '').slice(-80),
      source: src.id,
      title,
      url: link || src.home,
      date: isNaN(date) ? null : date.toISOString(),
      excerpt: clip(scrub(strip(body), BODY_NOISE), 220),
      duration: src.kind === 'episode' ? duration(tag(it, 'itunes:duration')) : '',
      kind: src.kind
    };
  }).filter((i) => i.title && i.date && !SKIP.test(i.title));
}

async function pull(src) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(src.url, { signal: ctl.signal, headers: { 'user-agent': 'bfloore.online feed reader' } });
    clearTimeout(t);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return { ok: true, items: parse(await r.text(), src) };
  } catch (e) {
    return { ok: false, items: [], error: String(e.message || e) };
  }
}

const ARCHIVE = require('./_archive.js');

async function build(limit = 160) {
  const results = await Promise.all(SOURCES.map(pull));
  /* cross-posts (Substack mirrors Medium): keep the first source's copy */
  const seen = new Set();
  const items = results.flatMap((r) => r.items).concat(ARCHIVE)
    .filter((i) => { const k = i.title.toLowerCase().replace(/[^a-z0-9]+/g, ''); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
  return {
    updated: new Date().toISOString(),
    sources: SOURCES.map((s, i) => ({ id: s.id, label: s.label, home: s.home, kind: s.kind, ok: results[i].ok, count: items.filter((x) => x.source === s.id).length }))
      .concat([{ id: 'archive', label: 'Archive · 2008–09', home: 'https://cincywestsidequeer.blogspot.com', kind: 'archive', ok: true, count: ARCHIVE.length }]),
    items
  };
}

module.exports = async function handler(req, res) {
  const data = await build();
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('access-control-allow-origin', '*');
  res.status(200).send(JSON.stringify(data));
};
module.exports.build = build;
