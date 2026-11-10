# resume.bfloore.online

The interactive resume is the `resume/` app in this repository. It is deployed to the Cloudflare Pages project `bfloore-resume` and served at [https://resume.bfloore.online](https://resume.bfloore.online/). The hub’s Resume / CV link points there.

## What it does

The page is one resume with six remixes. The chips are General, AI trainer, Business owner / freelancer, Health / education, Remote support / crisis, and Content creation. General is the page you land on (`/`). The others are `/?remix=ai`, `freelance`, `health`, `support`, and `creative`.

Section chips show and hide modules. Copy link puts the current remix and the visible sections in the query string. Full CV turns every module on, using the long form of each section. Download PDF opens the print dialog for whatever is still on screen. There is no separate download of a hidden full CV. Choose Save as PDF in the print dialog, and turn off browser headers and footers for a clean page.

Contact is separate from the PDF:

- Book a time goes to [https://calendly.com/barryfloore](https://calendly.com/barryfloore).
- A contact form posts to a Pages Function. Recipient addresses are not in the page, the client script, or the JSON payload. Until the function’s environment is set, the form stays disabled and tells the visitor to book a time.
- A QR code and a Download vCard button build the same vCard in the browser from reversed pieces (name, one email, voice number, SMS number, Jacksonville, LinkedIn, and the hub). The built files do not contain those values as plaintext. Call and Text links are filled in by the browser the same way. The page does not show an email address.

Spam controls on the form are Cloudflare Turnstile (checked on the server), a honeypot field, and a basic per-isolate rate limit. Mail is sent with the Resend HTTPS API so it does not depend on moving `bfloore.online` DNS onto Cloudflare. DNS for that domain stays at Namecheap.

## How it is built

`content.js` holds the sections, remix presets, and which variant each remix shows. `site.config.js` holds the public name, the schema alternate names, the vCard contact pieces, and the Calendly URL. `node build.js` (also `npm run build`) writes a static site to `dist/`. `npm test` checks the remix rules, the sealed contact data, the vCard, and the contact handler.

The build seals the vCard contact into reversed pieces before it is embedded. JSON-LD names Barry Floore, with alternate names b. floore and Michael Floore, and does not include an email or a phone number. Brand files in `resume/brand/` (the hub’s “b” card as favicon SVG, ICO, PNG sizes, apple-touch icon, and a 1200×630 `og.png`) are copied into `dist/`.

`resume/functions/api/contact.js` is a Cloudflare Pages Function. `GET /api/contact` reports whether the form is configured and, if it is, returns only the public Turnstile site key. `POST /api/contact` checks the origin, the honeypot, the rate limit, and Turnstile’s siteverify result (`success`, action `contact`, and an allowed hostname) before it calls Resend. A filled honeypot gets a success response and no email. Missing configuration returns a clear “not set up” response and does not call Resend.

`dist/_routes.json` limits Function invocations to `/api/*` so the static files are not billed as Function requests.

## Deploy

Cloudflare Pages project: `bfloore-resume`.

Dragging only `dist/` into the dashboard publishes the static site and does not publish the Function. From `resume/`, after `npm run build`:

```bash
npx wrangler pages deploy dist --project-name=bfloore-resume
```

Wrangler uploads `dist/` and the `functions/` directory next to it. A Git-connected Pages project can use root directory `resume`, build command `npm run build`, and output directory `dist`. That also picks up `functions/`.

`vercel.json` in `resume/` records the same build command and output folder for a static host. The live resume site is the Pages project, not the hub’s Vercel project.

The owner’s accounts, secrets, and DNS records are listed in `resume/README.md`. The form does nothing useful until those exist.

## Place in the set of sites

[www.bfloore.online](https://www.bfloore.online/) is the hub. It is the repository root (`index.html` and assets), deployed on Vercel. There is no separate hub build. The page is a board of five modules. The Professional card’s Resume / CV item opens `https://resume.bfloore.online/`. The same card links DataZeroOne and About & Contact. Creative content, professional writing, shopping, and sites & apps are the other modules. The “b” on the center card is the mark used for the favicons and social images.

[reviews.bfloore.online](https://reviews.bfloore.online/) is the affiliate review site in `reviews/`. It is a static build (`npm run build` in that folder) with its own `vercel.json`. The hub’s writing feed and link list point at it. The resume lists it as a property Barry runs.

Other properties linked from the hub, and named where the resume already names them:

- [friendlyrobots.online](https://friendlyrobots.online/) — FRIENDLY ROBOTS!
- [afamilytragedy.com](https://afamilytragedy.com/) — Benny
- [thelyingliars.online](https://thelyingliars.online/) — The Lying Liars
- [slopthemusical.com](https://slopthemusical.com/), [saintelmo.online](https://saintelmo.online/) (Geoff & Maxie), [spuncalliope.wordpress.com](https://spuncalliope.wordpress.com/) — the musicals
- [serialimages.vercel.app](https://serialimages.vercel.app/) — Serial Images
- [stashandset.com](https://stashandset.com/) and [dataonezero.com](https://dataonezero.com/) — named on the resume
- Amazon author store, Etsy, and Gumroad — linked from the hub’s shop card
- Social and writing links on the hub: Instagram, TikTok, YouTube, Facebook, LinkedIn (`linkedin.com/in/barryfloore` on the hub; the resume links `linkedin.com/in/mbfloore`), Medium, Substack, American Gaslighter, Cultivating Ethical AI, and the 2007–09 archive

The hub, the resume, and the reviews site share one repository. They deploy separately.
