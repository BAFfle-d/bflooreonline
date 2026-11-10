/* ============================================================
   reviews.bfloore.online — build
   Vercel runs `node build.js` on every push. It reads posts/*.md,
   writes static pages to dist/. To publish: upload a file named
     posts/YYYY-MM-DD-your-post-slug.md
   Rules:
     _anything.md         draft, never published
     future date in name  hidden until a build on/after that date
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const CFG = require('./site.config.js');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'posts');
const OUT = path.join(ROOT, 'dist');
const NAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const today = new Date().toISOString().slice(0, 10);
const IMG_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'JPG', 'JPEG', 'PNG', 'WEBP'];

/* ---------- helpers ---------- */
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const fmtDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return MONTHS[m - 1] + ' ' + d + ', ' + y; };
const nicheLabel = (n) => (n && CFG.niches[n]) || n || 'General';
const nicheSlug = (n) => String(n || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-');
function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function write(rel, body) { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, body); }
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}

/* front matter: simple `key: value` lines between --- fences */
function parse(raw, file) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) throw new Error(file + ': missing the --- header block at the top');
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+)\s*:\s*(.*)$/i);
    if (kv) meta[kv[1].toLowerCase()] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: m[2] };
}

/* A parsed hostname equals the allowed host, or is a subdomain of it. */
function hostIs(hostname, allowed) {
  const host = String(hostname || '').toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
  const want = String(allowed || '').toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
  if (!host || !want) return false;
  if (host === want) return true;
  const labels = host.split('.');
  const wantLabels = want.split('.');
  if (!wantLabels.length || wantLabels.length >= labels.length) return false;
  if (wantLabels.some((label) => label === '')) return false;
  return labels.slice(labels.length - wantLabels.length).join('.') === want;
}

/* affiliate handling */
function isAffiliate(href) {
  try {
    const host = new URL(href).hostname;
    return CFG.affiliateHosts.some((allowed) => hostIs(host, allowed));
  } catch (e) { return false; }
}
function tagAmazon(href) {
  if (!CFG.amazonTag) return href;
  try {
    const u = new URL(href);
    if (hostIs(u.hostname, 'amazon.com')) { u.searchParams.set('tag', CFG.amazonTag); return u.toString(); }
  } catch (e) {}
  return href;
}

function render(md) {
  let affiliate = false;
  const r = new marked.Renderer();
  r.link = (href, title, text) => {
    const ext = /^https?:/.test(href);
    if (ext && isAffiliate(href)) {
      affiliate = true;
      return '<a href="' + esc(tagAmazon(href)) + '"' + (title ? ' title="' + esc(title) + '"' : '') +
        ' rel="sponsored nofollow noopener" target="_blank" class="aff">' + text + '<span class="aff-tag">affiliate</span></a>';
    }
    return '<a href="' + esc(href) + '"' + (title ? ' title="' + esc(title) + '"' : '') + (ext ? ' rel="noopener" target="_blank"' : '') + '>' + text + '</a>';
  };
  r.image = (href, title, text) => '<figure><img src="' + esc(href) + '" alt="' + esc(text) + '" loading="lazy">' + (title ? '<figcaption>' + esc(title) + '</figcaption>' : '') + '</figure>';
  const html = marked.parse(md, { renderer: r, mangle: false, headerIds: false });
  return { html, affiliate };
}

/* ---------- read posts ---------- */
const posts = [];
const skipped = [];
for (const file of (fs.existsSync(SRC) ? fs.readdirSync(SRC) : []).sort()) {
  if (!file.endsWith('.md')) continue;
  if (file.startsWith('_')) { skipped.push(file + ' (draft)'); continue; }
  const n = file.match(NAME);
  if (!n) { skipped.push(file + ' (name must look like 2026-11-03-my-post.md)'); continue; }
  const [, date, slug] = n;
  if (date > today) { skipped.push(file + ' (scheduled for ' + date + ')'); continue; }
  const { meta, body } = parse(fs.readFileSync(path.join(SRC, file), 'utf8'), file);
  if (!meta.title) throw new Error(file + ': needs a title: line in the header');
  const { html, affiliate } = render(body);
  /* cover image, in priority order:
     1. cover: line in the header (a path in this folder, or a full https:// URL)
     2. an image in img/posts/ named after the post: best-cat-water-fountains.jpg
        or 2026-11-10-best-cat-water-fountains.jpg (jpg, jpeg, png, webp, gif, avif) */
  let cover = meta.cover || '';
  if (cover && !/^https?:\/\//.test(cover) && !fs.existsSync(path.join(ROOT, cover.replace(/^\//, '')))) {
    skipped.push(file + ': cover image ' + cover + ' not found, published without it');
    cover = '';
  }
  if (!cover) {
    const stem = file.replace(/\.md$/, '');
    for (const base of [slug, stem]) {
      const hit = IMG_EXT.map((e) => 'img/posts/' + base + '.' + e).find((f) => fs.existsSync(path.join(ROOT, f)));
      if (hit) { cover = hit; break; }
    }
  }
  const coverSrc = !cover ? '' : /^https?:\/\//.test(cover) ? cover : '/' + cover.replace(/^\//, '');
  const words = body.split(/\s+/).filter(Boolean).length;
  posts.push({
    file, date, slug,
    title: meta.title,
    summary: meta.summary || body.replace(/[#*_>\[\]()`!-]/g, '').trim().split(/\s+/).slice(0, 32).join(' ') + '…',
    niche: (meta.niche || 'general').toLowerCase(),
    cover: coverSrc,
    coverAbs: !coverSrc ? '' : /^https?:/.test(coverSrc) ? coverSrc : CFG.siteUrl + coverSrc,
    coverAlt: meta.cover_alt || meta.title,
    updated: meta.updated || '',
    html, affiliate,
    minutes: Math.max(1, Math.round(words / 230)),
    url: '/posts/' + slug + '/'
  });
}
posts.sort((a, b) => (a.date < b.date ? 1 : -1));

/* ---------- page shell ---------- */
const CSS = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
function page({ title, desc, canonical, body, og = {}, jsonld = '' }) {
  const full = title ? title + ' · ' + CFG.siteTitle : CFG.siteTitle;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(CFG.siteUrl + canonical)}">
<link rel="alternate" type="application/rss+xml" title="${esc(CFG.siteTitle)}" href="/rss.xml">
<meta property="og:site_name" content="${esc(CFG.siteTitle)}">
<meta property="og:title" content="${esc(title || CFG.siteTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(CFG.siteUrl + canonical)}">
<meta property="og:type" content="${og.type || 'website'}">
${og.image ? `<meta property="og:image" content="${esc(og.image)}">\n<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<meta name="theme-color" content="#07090a">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%2307090a'/%3E%3Ctext x='32' y='45' font-family='monospace' font-size='38' font-weight='700' fill='%23ffd500' text-anchor='middle'%3Eb%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700&family=Space+Grotesk:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
${jsonld}
</head>
<body>
<header class="top">
  <a class="brand" href="/"><span class="b">b</span><span>reviews</span></a>
  <nav><a href="/">All</a><a href="/rss.xml">RSS</a><a href="${esc(CFG.hubUrl)}">bfloore.online ↗</a></nav>
</header>
${body}
<footer class="foot">
  <p>${esc(CFG.disclosure.split('. ')[0])}.</p>
  <p>Written by <a href="${esc(CFG.hubUrl)}">${esc(CFG.author)}</a> in Jacksonville, Florida · <a href="/rss.xml">RSS</a> · <a href="/sitemap.xml">Sitemap</a></p>
</footer>
</body>
</html>`;
}

function card(p) {
  return `<a class="card" href="${p.url}" data-niche="${esc(nicheSlug(p.niche))}">
  ${p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.coverAlt)}" loading="lazy">` : `<div class="ph">${esc(nicheLabel(p.niche))}</div>`}
  <div class="c-in">
    <div class="meta"><span class="niche">${esc(nicheLabel(p.niche))}</span><time datetime="${p.date}">${fmtDate(p.date)}</time></div>
    <h2>${esc(p.title)}</h2>
    <p>${esc(p.summary)}</p>
    <span class="more">Read · ${p.minutes} min →</span>
  </div>
</a>`;
}

/* ---------- build ---------- */
rmrf(OUT);
fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(ROOT, 'img'), path.join(OUT, 'img'));

const niches = [...new Set(posts.map((p) => p.niche))];
const chips = niches.length > 1
  ? `<div class="chips"><a class="chip on" href="/">All <b>${posts.length}</b></a>${niches.map((n) => `<a class="chip" href="/niche/${nicheSlug(n)}/">${esc(nicheLabel(n))} <b>${posts.filter((p) => p.niche === n).length}</b></a>`).join('')}</div>`
  : '';

function listPage(list, heading, sub, canonical, activeNiche) {
  const ch = chips.replace(/class="chip on"/, activeNiche ? 'class="chip"' : 'class="chip on"')
    .replace(new RegExp(`class="chip" href="/niche/${activeNiche}/"`), `class="chip on" href="/niche/${activeNiche}/"`);
  return page({
    title: activeNiche ? heading : '',
    desc: sub,
    canonical,
    body: `<main class="list">
  <section class="hero"><p class="kicker">// ${esc(activeNiche ? 'niche' : 'reviews · picks · buying guides')}</p><h1>${esc(heading)}</h1><p class="lede">${esc(sub)}</p></section>
  ${ch}
  <div class="grid">${list.length ? list.map(card).join('\n') : '<p class="empty">First post coming soon.</p>'}</div>
</main>`
  });
}

write('index.html', listPage(posts, CFG.siteTitle, CFG.siteTagline, '/', ''));
for (const n of niches) {
  const list = posts.filter((p) => p.niche === n);
  write(`niche/${nicheSlug(n)}/index.html`, listPage(list, nicheLabel(n), `Every ${nicheLabel(n).toLowerCase()} review and buying guide, newest first.`, `/niche/${nicheSlug(n)}/`, nicheSlug(n)));
}

for (const p of posts) {
  const related = posts.filter((q) => q !== p && q.niche === p.niche).slice(0, 3);
  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.summary,
    datePublished: p.date, dateModified: p.updated || p.date,
    author: { '@type': 'Person', name: CFG.author, url: CFG.hubUrl },
    image: p.coverAbs || undefined,
    mainEntityOfPage: CFG.siteUrl + p.url
  })}</script>`;
  write(`posts/${p.slug}/index.html`, page({
    title: p.title, desc: p.summary, canonical: p.url, og: { type: 'article', image: p.coverAbs }, jsonld,
    body: `<main class="post">
  <a class="back" href="/niche/${nicheSlug(p.niche)}/">← ${esc(nicheLabel(p.niche))}</a>
  <h1>${esc(p.title)}</h1>
  <div class="meta"><span class="niche">${esc(nicheLabel(p.niche))}</span><time datetime="${p.date}">${fmtDate(p.date)}</time>${p.updated ? `<span>updated ${fmtDate(p.updated)}</span>` : ''}<span>${p.minutes} min read</span></div>
  ${p.affiliate ? `<aside class="disclosure">${esc(CFG.disclosure)}</aside>` : ''}
  ${p.cover ? `<img class="cover" src="${esc(p.cover)}" alt="${esc(p.coverAlt)}">` : ''}
  <article class="prose">${p.html}</article>
  ${related.length ? `<section class="related"><h3>More ${esc(nicheLabel(p.niche).toLowerCase())}</h3><div class="grid small">${related.map(card).join('')}</div></section>` : ''}
</main>`
  }));
}

write('404.html', page({ title: 'Not found', desc: 'That page does not exist.', canonical: '/404', body: '<main class="list"><section class="hero"><p class="kicker">// 404</p><h1>Nothing here.</h1><p class="lede"><a href="/">Back to every review →</a></p></section></main>' }));

/* feeds */
const abs = (u) => CFG.siteUrl + u;
write('feed.json', JSON.stringify({
  version: 'https://jsonfeed.org/version/1.1', title: CFG.siteTitle, home_page_url: CFG.siteUrl, feed_url: abs('/feed.json'),
  items: posts.map((p) => ({ id: abs(p.url), url: abs(p.url), title: p.title, summary: p.summary, date_published: p.date + 'T12:00:00Z', tags: [nicheLabel(p.niche)], image: p.coverAbs || undefined }))
}, null, 1));
write('rss.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(CFG.siteTitle)}</title><link>${esc(CFG.siteUrl)}</link><description>${esc(CFG.siteTagline)}</description><language>en-us</language>
${posts.map((p) => `<item><title>${esc(p.title)}</title><link>${esc(abs(p.url))}</link><guid>${esc(abs(p.url))}</guid><pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate><category>${esc(nicheLabel(p.niche))}</category><description>${esc(p.summary)}</description></item>`).join('\n')}
</channel></rss>`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${esc(CFG.siteUrl)}/</loc></url>
${niches.map((n) => `<url><loc>${esc(abs('/niche/' + nicheSlug(n) + '/'))}</loc></url>`).join('\n')}
${posts.map((p) => `<url><loc>${esc(abs(p.url))}</loc><lastmod>${p.updated || p.date}</lastmod></url>`).join('\n')}
</urlset>`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${CFG.siteUrl}/sitemap.xml\n`);

console.log(`Built ${posts.length} post(s) into dist/.`);
if (skipped.length) console.log('Notes:\n  ' + skipped.join('\n  '));
if (!CFG.amazonTag) console.log('Note: amazonTag is empty in site.config.js, so Amazon links are not tagged yet.');
