/* ============================================================
   resume.bfloore.online — build
   node build.js writes a static site to dist/.
   Cloudflare Pages: root directory `resume`, output `dist`.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const CFG = require('./site.config');
const CONTENT = require('./content');
const { vcard } = require('./vcard');
const RS = require('./state');
const R = require('./render');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const esc = R.esc;

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function write(rel, body) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, body);
}
function safeInline(js) {
  return js.replace(/<\/script/gi, '<\\/script');
}

function page({ title, desc, canonical, body, jsonld, boot }) {
  const full = title ? title + ' · ' + CFG.siteTitle : CFG.siteTitle;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${esc(CFG.person.full)}">
<link rel="canonical" href="${esc(CFG.siteUrl + canonical)}">
<meta property="og:site_name" content="${esc(CFG.siteTitle)}">
<meta property="og:title" content="${esc(title || CFG.siteTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(CFG.siteUrl + canonical)}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#07090a">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%2307090a'/%3E%3Ctext x='32' y='45' font-family='monospace' font-size='38' font-weight='700' fill='%23ffd500' text-anchor='middle'%3Eb%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700&family=Space+Grotesk:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8')}</style>
${jsonld || ''}
</head>
<body>
<a class="skip" href="#sheet">Skip to resume</a>
<header class="top">
  <a class="brand" href="/"><span class="b">b</span><span>resume</span></a>
  <nav><a href="#contact">Contact</a><a href="${esc(CFG.hubUrl)}">bfloore.online ↗</a></nav>
</header>
${body}
<footer class="foot">
  <p>${esc(CFG.person.full)} · Jacksonville, Florida · ${esc(CFG.person.remote)}</p>
  <p><a href="mailto:${esc(CFG.person.email)}">${esc(CFG.person.email)}</a> · <a href="${esc(CFG.person.linkedin)}">LinkedIn</a> · <a href="${esc(CFG.hubUrl)}">bfloore.online</a></p>
</footer>
${boot || ''}
</body>
</html>`;
}

async function main() {
  const card = vcard(CFG);
  let qr = await QRCode.toString(card, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark: '#111111', light: '#ffffff' }
  });
  qr = qr.replace(/<\?xml[^>]*>\s*/g, '').replace(/<svg /, '<svg aria-hidden="true" focusable="false" ');
  const modules = Number((qr.match(/viewBox="0 0 (\d+)/) || [])[1] || 0);
  if (!modules || modules > 73) throw new Error('QR is too dense to scan off a screen (' + modules + ' modules).');

  const payload = {
    siteTitle: CFG.siteTitle,
    siteUrl: CFG.siteUrl,
    hubUrl: CFG.hubUrl,
    person: CFG.person,
    identity: CONTENT.identity,
    remixes: CONTENT.remixes,
    modules: CONTENT.modules,
    variantMap: CONTENT.variantMap,
    presets: CONTENT.presets,
    moduleIds: CONTENT.moduleIds,
    qrSvg: qr
  };
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  const defaultState = RS.parseState('', { moduleIds: CONTENT.moduleIds, presets: CONTENT.presets });
  const boot = `<script type="application/json" id="resume-data">${json}</script>
<script>
${safeInline(fs.readFileSync(path.join(ROOT, 'state.js'), 'utf8'))}
${safeInline(fs.readFileSync(path.join(ROOT, 'render.js'), 'utf8'))}
${safeInline(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'))}
bootResume(JSON.parse(document.getElementById('resume-data').textContent));
</script>`;

  const body = `<main class="wrap">
  <div class="stage">
    <article class="sheet" id="sheet" aria-labelledby="name">
      <header class="who" id="who">${R.whoHtml(payload)}</header>
      <div class="controls">
        <p class="lede" id="deck">${esc(R.deckText(payload, defaultState))}</p>
        <div class="chips" id="remixes" role="group" aria-label="Resume remix">${R.remixesHtml(payload, defaultState)}</div>
        <div class="adjust" id="adjust" hidden></div>
        <p class="kicker" id="sec-label">Sections</p>
        <div class="chips" id="toggles" role="group" aria-labelledby="sec-label">${R.togglesHtml(payload, defaultState)}</div>
        <div class="toolbar">
          <button type="button" class="btn" id="cv" aria-pressed="false">Full CV</button>
          <button type="button" class="btn" id="copy">Copy link</button>
          <button type="button" class="btn primary" id="pdf" aria-describedby="pdf-hint">Download PDF</button>
          <span class="copied" id="copied" role="status"></span>
        </div>
        <p class="hint" id="pdf-hint">Download PDF opens the print dialog. Choose Save as PDF and turn off headers and footers for a clean page. The file matches the sections on screen. The vCard is a separate download.</p>
      </div>
      <div id="sections">${R.sectionsHtml(payload, defaultState)}</div>
      <noscript><p class="note">Remixes and section toggles use JavaScript. The contact card is Barry-Floore.vcf.</p></noscript>
    </article>
    <aside class="panel" id="contact" aria-label="Contact">${R.contactHtml(payload)}</aside>
  </div>
</main>`;

  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: CFG.person.full,
    alternateName: CFG.person.display,
    email: CFG.person.email,
    telephone: CFG.person.phoneE164,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CFG.person.city,
      addressRegion: CFG.person.region,
      addressCountry: 'US'
    },
    url: CFG.hubUrl,
    sameAs: [CFG.person.linkedin, CFG.hubUrl, CFG.siteUrl],
    description: CFG.siteTagline
  }).replace(/</g, '\\u003c')}</script>`;

  const html = page({
    title: 'Barry Floore — resume',
    desc: CFG.siteTagline,
    canonical: '/',
    body: body,
    jsonld: jsonld,
    boot: boot
  });

  if (/download full cv/i.test(html)) throw new Error('The page must not offer a full-CV download.');
  if (!html.includes('Download PDF') || !html.includes('Download vCard')) {
    throw new Error('PDF and vCard actions are missing.');
  }
  ['general', 'ai', 'freelance'].forEach(function (id) {
    if (!html.includes('data-remix="' + id + '"')) throw new Error('Missing remix chip ' + id);
  });

  rmrf(OUT);
  fs.mkdirSync(OUT, { recursive: true });
  write('index.html', html);
  write('Barry-Floore.vcf', card);
  write('_headers', `/Barry-Floore.vcf
  Content-Type: text/vcard; charset=utf-8
  Content-Disposition: attachment; filename="Barry-Floore.vcf"
`);
  write('404.html', page({
    title: 'Not found',
    desc: 'That page does not exist.',
    canonical: '/404',
    body: '<main class="page-hero"><p class="kicker">// 404</p><h1>Nothing here.</h1><p class="lede"><a href="/">Back to the resume →</a></p></main>'
  }));
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${CFG.siteUrl}/sitemap.xml\n`);
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${esc(CFG.siteUrl)}/</loc></url>
</urlset>
`);

  console.log('Built resume into dist/.');
  console.log('vCard ' + card.length + ' bytes · QR svg ' + qr.length + ' bytes · ' + CONTENT.modules.length + ' modules.');
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
