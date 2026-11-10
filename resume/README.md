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

That matches `reviews/`: the Pages project root is the app folder, and the build writes `dist/`. `vercel.json` records the same build command, output folder, and `cleanUrls` for a Vercel-style static host. Cloudflare Pages reads the files in `dist/` directly.

## Remixes

Six compositions:

| Chip | URL |
| --- | --- |
| General (the page you land on) | `/` |
| AI trainer | `/?remix=ai` |
| Business owner / freelancer | `/?remix=freelance` |
| Health / education | `/?remix=health` |
| Remote support / crisis | `/?remix=support` |
| Content creation | `/?remix=creative` |

General is the short at-a-glance resume: blended summary, light AI experience, light projects, education, and core skills. Customer service and clinical background stay off until a section chip turns them on.

AI trainer uses the AI summary, the full AI experience, AI skills, education, and a light project list.

Business owner / freelancer uses the operator summary, a practice-length project list, operator skills, selected client-ops roles, education, and AI experience as supporting contracts.

Health / education uses the health-education summary, AI experience with a Pearson and Appen healthcare lens, crisis-focused customer service, the clinical background, education, and health skills. Projects and operator skills stay off until a section chip turns them on.

Remote support / crisis uses the support summary, crisis-focused customer service, the clinical background, education, and support skills. AI experience stays off until a section chip turns it on.

Content creation uses the publishing summary, the creative portfolio, education, operator skills, and creative skills. Customer service and clinical background stay off until a section chip turns them on.

Section chips show and hide modules. **Copy link** puts the current remix and the visible sections in the query string (`on=`), so the URL opens the same page again. The browser back button steps through those changes.

## Full CV, PDF, and vCard

**Full CV** turns every module on, using the long form of each section. Hide anything that should not travel with this copy. **Download PDF** opens the print dialog for whatever is still on screen. Choose **Save as PDF**, and turn off browser headers and footers if you want a clean page. There is no separate download of the entire raw CV.

The contact card is separate from the PDF. Its QR code encodes a vCard (name, email, voice number, SMS number, Jacksonville, LinkedIn, and the hub). The page links say Email, Call, and Text. **Download vCard** builds `Barry-Floore.vcf` in the browser, and a phone camera can add the same card from the code. Print still writes the address and numbers onto the PDF.

## Edit the words

- `content.js` — sections, remix presets, and which variant each remix shows
- `site.config.js` — name, email, phones, links, site URL. The visible name stays Barry Floore / b. floore. `alternateName` is schema only and is not shown in the header.

Remix chips are General, AI trainer, Business owner / freelancer, Health / education, Remote support / crisis, and Content creation.
