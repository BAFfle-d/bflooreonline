# resume.bfloore.online

Static interactive resume for Barry Floore. It sits next to `reviews/` and uses the same visual family: dark field `#07090a`, amber `#ffd500`, the “b” mark, and Unbounded, Space Grotesk, Newsreader, and JetBrains Mono.

The page is one self-contained site. Remixes, section toggles, the contact card, and PDF export all run in the browser. There is no login and no backend.

## Build

From this directory:

```bash
npm install
npm run build
```

`npm run build` runs `node build.js`. Either command writes `dist/`.

```bash
npm test
npx serve dist
```

`dist/` is generated. It is not committed.

## Cloudflare Pages

DNS stays outside this repo. When the site is connected, set:

| Setting | Value |
| --- | --- |
| Root directory | `resume` |
| Build command | `npm run build` (or `node build.js`) |
| Build output directory | `dist` |

That matches `reviews/`: the Pages project root is the app folder, and the build writes `dist/`. `vercel.json` records the same build command, output folder, and `cleanUrls` for a Vercel-style static host. Cloudflare Pages reads the files in `dist/` directly, including `_headers` for the vCard content type.

## Remixes

Three compositions, and no others:

| Chip | URL |
| --- | --- |
| General (the page you land on) | `/` |
| AI trainer | `/?remix=ai` |
| Business owner / freelancer | `/?remix=freelance` |

General is the short at-a-glance resume: blended summary, light AI experience, light projects, education, and core skills. Customer service and clinical background stay off until a section chip turns them on.

AI trainer uses the AI summary, the full AI experience, AI skills, education, and a light project list.

Business owner / freelancer uses the operator summary, projects and properties, operator skills, selected client-ops roles, education, and AI experience as supporting contracts.

Section chips show and hide modules. **Copy link** puts the current remix and the visible sections in the query string (`on=`), so the URL opens the same page again. The browser back button steps through those changes.

## Full CV, PDF, and vCard

**Full CV** turns every module on, using the long form of each section. Hide anything that should not travel with this copy. **Download PDF** opens the print dialog for whatever is still on screen. Choose **Save as PDF**, and turn off browser headers and footers if you want a clean page. There is no separate download of the entire raw CV.

The contact card is separate from the PDF. Its QR code encodes a vCard (name, email, voice number, SMS number, Jacksonville, LinkedIn, and the hub). **Download vCard** saves `Barry-Floore.vcf`, and a phone camera can add the same card from the code.

## Edit the words

- `content.js` — sections, remix presets, and which variant each remix shows
- `site.config.js` — name, email, phones, links, site URL

Keep remix chips to General, AI trainer, and Business owner / freelancer.
