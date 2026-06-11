# Broward County Locksmith — Blog Agent

Twice-daily AI blog generator. Each run drafts one SEO-optimized article via
Claude, generates a branded hero image via OpenAI, renders it to a static page,
and writes it into the root of this repo (`blog/<slug>/` + `sitemap.xml`). The
GitHub Actions workflow commits the new files and the host connected to this
repo auto-deploys to https://browardcountylocksmith.com.

Ported from the Home Advisor Locksmith blog agent — same pipeline, restyled to
the Broward County deep-navy & amber brand. One difference: that repo keeps the site under
`site/`, while here the static site lives at the repo root, so the agent folder
is `blog-agent/` and published posts go to `blog/`.

## What each article includes (the "optimized" format)

- SEO title (<60 chars) + 150–160-char meta description
- One `<h1>`, 5–7 `<h2>` sections, ~1,000–1,500 words
- Exactly 5 FAQs rendered as `<details>` **plus FAQ schema**
- `Article` + `BreadcrumbList` + `FAQPage` JSON-LD structured data
- Canonical URL, Open Graph + Twitter cards, branded 1200×630 hero
- Internal links to the homepage + blog; auto-updated blog index + sitemap

## How it picks topics

Walks [`src/lib/topics.ts`](src/lib/topics.ts) in order, publishing the first
topic not yet in [`state.json`](state.json). ~60 topics ship across
residential, automotive, commercial, smart-lock, security, and cost verticals —
about a month of runway at two posts per day. Add more to the end of the
array; never reorder or reuse an `id`.

## Quickstart

```bash
cd blog-agent
npm install
cp .env.example .env       # add ANTHROPIC_API_KEY + OPENAI_API_KEY
npm run post:dry           # draft + hero + preview, WITHOUT writing into the site
npm run post               # generate + write into ../blog/<slug>/ + update index/sitemap
npm run post:next          # show which topic is next, no API calls
```

## Production (GitHub Actions)

Runs twice daily at **9 AM and 5 PM ET** (crons `0 13 * * *` and `0 21 * * *`)
via [`.github/workflows/blog.yml`](../.github/workflows/blog.yml).
Required repo secrets:

| Secret | Why |
|---|---|
| `ANTHROPIC_API_KEY` | Claude drafts the article |
| `OPENAI_API_KEY` | gpt-image-1 generates the hero |
| `SITE_URL` | optional — defaults to `https://browardcountylocksmith.com` |

Trigger manually from **Actions → Blog Post (2x daily) → Run workflow** (set
**Dry run = true** to draft without publishing — the article still uploads as a
downloadable preview artifact).

## Files

```
blog-agent/
├── src/
│   ├── index.ts              # orchestrates draft → image → render → write → state
│   └── lib/
│       ├── topics.ts         # the topic queue — main thing you edit
│       ├── anthropic.ts      # Claude prompt + JSON contract (brand voice lives here)
│       ├── image.ts          # OpenAI hero generation
│       ├── logo.ts           # crop to 1200×630 + logo overlay (logo-optional)
│       ├── render.ts         # HTML templates (deep-navy & amber brand styling)
│       ├── publish.ts        # writes into the repo root, regenerates index + sitemap
│       ├── state.ts          # state.json read/write
│       └── types.ts
├── assets/logo.jpg           # hero overlay logo
├── state.json                # published queue (auto-updated)
└── .env.example
```

## Editing the brand voice

The Claude system prompt — voice, brand facts, what-not-to-write rules (no fake
reviews, no lock-picking how-tos) — is at the top of
[`src/lib/anthropic.ts`](src/lib/anthropic.ts). The phone number is in both
`anthropic.ts` and [`src/lib/render.ts`](src/lib/render.ts) — currently
**(954) 888-8800**, matching the social agent.
