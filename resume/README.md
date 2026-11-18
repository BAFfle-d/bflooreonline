# resume.bfloore.online

## Barry Floore

Barry Floore (b. floore) is a writer, composer, producer, and AI data trainer in Jacksonville, Florida. The resume says the work is 100% remote. Schema.org `alternateName` is `b. floore` and `Michael Floore`. Michael is not in the header or the vCard.

The general page describes 5+ years of AI safety labeling, preference ranking, and output auditing, plus operating bfloore.online, reviews.bfloore.online, Stashandset, and DataZeroOne, with remote support and multi-channel service. The longer record on the page includes Handshake AI, Mercor AI, Appen / CrowdGen, contract AI training, Pearson scoring, crisis and live-chat work, critical-care nursing at Baptist Health Jacksonville (2011–2019), and nursing degrees from Jacksonville University (B.S., M.S., Cum Laude, Sigma Theta Tau) plus a B.A. from Miami University (Ohio).

Creative work on the page includes FRIENDLY ROBOTS!, Benny, The Lying Liars, three musicals in progress, and the podcast Cultivating Ethical AI. A longer recruiter-facing writeup, taken only from this resume and the hub copy, is in `docs/wiki/Barry-Floore.md`.

The page does not show a personal email address or a personal phone number. Book a time and the contact form are the public contact paths.

## The project

Static resume with six remixes (General, AI trainer, Business owner / freelancer, Health / education, Remote support / crisis, Content creation). The remix chips and the section toggles sit in a side panel (a sticky rail on a wide screen, a slide-over on a narrow one). Copy link keeps the view in the URL. Full CV shows every section's long form. Download PDF opens the print dialog and expands Earlier roles and Show all.

The default page is the general resume. Experience opens on Handshake AI, Mercor, Appen / CrowdGen, and Pearson, plus a one-line Baptist Health role and the Centific healthcare QA role. Various contracts stays under Earlier roles. Education, six projects, and the core AI skills follow. Customer service and the extra skill tracks turn on from the versions panel. The longer clinical writeup stays on the health, support, and full CV views.

Contact:

- **Book a time:** https://calendly.com/barryfloore
- **Form:** `POST /api/contact` on a Cloudflare Pages Function. Recipients and the mail key are environment variables, not client HTML, JS, or JSON. Turnstile, a honeypot (`company`), and a basic per-isolate rate limit (5 posts per IP per 10 minutes, plus a small global cap) sit in front of sending. The form stays disabled, with a plain message, until the environment exists. A visitor can still book a time.
- **vCard and QR:** assembled in the browser from reversed pieces. Download vCard saves `Barry-Floore.vcf`. The card carries the business line and the website. It does not carry a personal email or a personal phone number. The page has no `tel:`, `sms:`, or `mailto:` link.

Adobe Stock and Getty Images portfolio URLs are empty strings in `site.config.js`. Those rows render nothing until a real `https` URL is filled in. Instagram uses the profile already named on the hub.

`npm test` and `npm run build` (`node build.js`) write `dist/`. `dist/` is not committed. Cloudflare Pages project: `bfloore-resume`. Output directory: `dist`.

A dashboard upload of only `dist/` does not deploy the Function. From this directory:

```bash
npm install
npm test
npm run build
npx wrangler pages deploy dist --project-name=bfloore-resume
```

A Git-connected Pages project with root `resume`, build `npm run build`, and output `dist` also picks up `functions/`. `vercel.json` mirrors the static build for a Vercel-style host. The live site is Pages. The hub at www.bfloore.online stays on Vercel, and its Resume / CV link stays on https://resume.bfloore.online/.

Edit `content.js` for the words and `site.config.js` for the name, vCard pieces, and Calendly URL. Do not put recipient addresses in either file.

### What the owner still has to create

DNS for bfloore.online stays at Namecheap. Mail uses [Resend](https://resend.com) (free tier, HTTPS API) so the domain does not have to move to Cloudflare.

1. **Resend.** Create an account. Add the domain `bfloore.online` and put the DNS records Resend shows (DKIM and the SPF / return-path records) on Namecheap’s Advanced DNS. Do not change the nameservers. Set the from-address to a mailbox on that verified domain.
2. **Cloudflare Turnstile.** Create a widget (managed) whose domains include `resume.bfloore.online`. The widget’s client action is `contact`. Turnstile does not require the zone to be proxied. For local `wrangler pages dev` only, localhost may be on the widget and in `.dev.vars`. Do not put `localhost` or `127.0.0.1` in the production hostname list.
3. **Pages project `bfloore-resume`**, production environment:
   - `RESEND_API_KEY` — secret
   - `CONTACT_TO`: secret. The recipient list lives only in the Pages environment. Do not put those addresses in the repo.
   - `CONTACT_FROM` — secret, for example `Barry Floore <resume@bfloore.online>` after the domain verifies
   - `TURNSTILE_SECRET` — secret
   - `TURNSTILE_SITE_KEY` — the public site key
   - `TURNSTILE_HOSTNAMES` — `resume.bfloore.online` (optional; that host is the default)

Copy `resume/.dev.vars.example` to `resume/.dev.vars` for local development. `.dev.vars` is gitignored. Leave production hostnames out of the local file.

Until those values exist, `GET /api/contact` reports the form as not configured and the page tells the visitor to book a time. A send that Resend rejects (domain not verified yet, bad key) shows a generic failure and does not print the recipients.
