// Renders DraftedPost JSON + a published-list (for the blog index) into HTML
// pages that match the Broward County Locksmith site brand. Pages link the site's
// shared /styles.css (CSS variables, nav, buttons, footer) and embed a small
// blog-specific style block so they stay readable even if site classes drift.

import type { DraftedPost, PublishedRecord } from "./types.ts";
import { SITE } from "./site.ts";
const BRAND = "Broward County Locksmith";
const PHONE_TEL = "+19548888800";
const PHONE_DISPLAY = "(954) 888-8800";

function esc(s: string): string {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const BRAND_MARK = `
<span class="brand-mark" aria-hidden="true">
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="20" r="9" stroke="#f5b841" stroke-width="2.4" fill="none"/>
    <circle cx="16" cy="20" r="2.4" fill="#f5b841"/>
    <path d="M22.5 22.5L40 22.5M34 22.5v8M40 22.5v6" stroke="#f5b841" stroke-width="2.4" stroke-linecap="round"/>
  </svg>
</span>`.trim();

function buildJsonLd(post: DraftedPost, url: string, heroUrl: string, publishedAt: string) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.metaDescription,
        image: heroUrl,
        datePublished: publishedAt,
        dateModified: publishedAt,
        author: { "@type": "Organization", name: BRAND, url: SITE },
        publisher: {
          "@type": "Organization",
          name: BRAND,
          logo: { "@type": "ImageObject", url: `${SITE}/blog/assets/logo.jpg` },
        },
        mainEntityOfPage: url,
      },
      post.faqs.length > 0 && {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ].filter(Boolean),
  };
  return JSON.stringify(data);
}

// Blog-specific styles layered on top of the site's /styles.css tokens.
const BLOG_STYLE = `
<style>
.blog-hero{ padding: 120px 0 36px; background: var(--bg-2, #131c30); border-bottom: 1px solid var(--line, #232f48) }
.blog-hero h1{ font-size: clamp(28px, 4.5vw, 44px); line-height: 1.15; margin: 14px 0 10px }
.breadcrumbs{ font-size: 13px; color: var(--muted, #8893ad) }
.breadcrumbs a{ color: var(--muted, #8893ad) }
.breadcrumbs a:hover{ color: var(--green, #f5b841) }
.post-meta{ color: var(--muted, #8893ad); font-size: 14px; margin: 0 }
.post-wrap{ padding: 36px 0 8px }
.container--narrow{ max-width: 800px; margin: 0 auto; padding: 0 24px }
.post-hero{ width: 100%; height: auto; border-radius: var(--radius, 12px); border: 1px solid var(--line, #232f48); margin-bottom: 28px }
.post-body{ color: var(--ink-2, #d6dceb); font-size: 17px; line-height: 1.75 }
.post-body h2{ font-size: clamp(22px, 3vw, 28px); margin: 36px 0 14px }
.post-body p{ margin: 0 0 16px }
.post-body ul, .post-body ol{ margin: 0 0 16px; padding-left: 24px }
.post-body li{ margin-bottom: 8px }
.post-body a{ color: var(--green, #f5b841); text-decoration: underline; text-underline-offset: 3px }
.post-body a:hover{ color: var(--green-2, #d99a23) }
.post-body strong{ color: var(--ink, #ffffff) }
.faq-wrap{ padding: 16px 0 32px }
.faq-item{ border: 1px solid var(--line, #232f48); border-radius: var(--radius, 12px); background: var(--bg-2, #131c30); margin-bottom: 12px; padding: 0 18px }
.faq-item summary{ cursor: pointer; padding: 16px 0; font-weight: 600; color: var(--ink, #ffffff); list-style: none; position: relative; padding-right: 28px }
.faq-item summary::after{ content: "+"; position: absolute; right: 4px; color: var(--green, #f5b841); font-size: 20px }
.faq-item[open] summary::after{ content: "–" }
.faq-item p{ color: var(--ink-2, #d6dceb); padding-bottom: 16px; margin: 0; line-height: 1.65 }
.post-cta{ background: var(--bg-2, #131c30); border-top: 1px solid var(--line, #232f48); padding: 48px 0; text-align: center }
.post-cta h2{ margin-bottom: 10px }
.post-cta p{ color: var(--muted, #8893ad); max-width: 560px; margin: 0 auto 22px }
.post-cta .cta-btns{ display: flex; gap: 14px; justify-content: center; flex-wrap: wrap }
.blog-grid{ display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 40px 0 56px }
.blog-card{ border: 1px solid var(--line, #232f48); border-radius: var(--radius, 12px); background: var(--bg-2, #131c30); padding: 22px; display: flex; flex-direction: column; gap: 10px }
.blog-card:hover{ border-color: var(--green, #f5b841) }
.blog-card .date{ color: var(--muted, #8893ad); font-size: 13px; margin: 0 }
.blog-card h2{ font-size: 19px; line-height: 1.3; margin: 0 }
.blog-card h2 a:hover{ color: var(--green, #f5b841) }
.blog-card .excerpt{ color: var(--ink-2, #d6dceb); font-size: 14.5px; line-height: 1.6; margin: 0; flex: 1 }
.blog-card .more{ color: var(--green, #f5b841); font-size: 14px; font-weight: 600 }
.blog-foot{ background: #000; border-top: 1px solid var(--line, #232f48); padding: 36px 0; text-align: center; color: #b0b0b8; font-size: 14px }
.blog-foot a{ color: var(--green, #f5b841) }
.blog-foot p{ margin: 6px 0 }
</style>`.trim();

function headerPartial(): string {
  return `
<header class="nav">
  <div class="container nav-inner">
    <a class="brand" href="/" aria-label="${BRAND} — Home">
      ${BRAND_MARK}
      <span class="brand-text">
        <strong class="brand-name"><span class="g">Broward</span> Locksmith</strong>
        <em>24/7 Mobile · Licensed</em>
      </span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="/#areas">Locations</a>
      <a href="/#services">Services</a>
      <a href="/#about">About</a>
      <a href="/blog">Blog</a>
      <a href="/#contact">Contact</a>
    </nav>
  </div>
</header>`.trim();
}

function footerPartial(): string {
  return `
<footer class="blog-foot">
  <div class="container">
    <p><strong style="color:#fff">${BRAND}</strong> · 24/7 mobile locksmith — residential, automotive &amp; commercial · <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></p>
    <p>Licensed &amp; insured. Serving every city in Broward County, FL.</p>
    <p><a href="/">Home</a> · <a href="/blog">Blog</a> · <a href="/#services">Services</a> · <a href="/#contact">Contact</a></p>
  </div>
</footer>

<a href="tel:${PHONE_TEL}" class="call-fab" aria-label="Call ${PHONE_DISPLAY}">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.2 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
  Call 24/7
</a>`.trim();
}

const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%230b1220'/%3E%3Ccircle cx='22' cy='28' r='10' fill='none' stroke='%23f5b841' stroke-width='4'/%3E%3Ccircle cx='22' cy='28' r='3.5' fill='%23f5b841'/%3E%3Cpath d='M33 32h20M46 32v8M53 32v7' stroke='%23f5b841' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E`;

function headCommon(): string {
  return `
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<meta name="theme-color" content="#0b1220" />
<link rel="icon" href="${FAVICON}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/styles.css" />
${BLOG_STYLE}`.trim();
}

export function renderBlogPost(post: DraftedPost, publishedAt: string): string {
  const url = `${SITE}/blog/${post.slug}`;
  const heroUrl = `${SITE}/blog/${post.slug}/hero.jpg`;

  const sectionsHtml = post.sections
    .map(
      (s) => `
    <section>
      <h2>${esc(s.heading)}</h2>
      ${s.body}
    </section>`
    )
    .join("\n");

  const faqsHtml =
    post.faqs.length > 0
      ? `
  <section class="faq-wrap" aria-labelledby="faq-h">
    <div class="container--narrow">
      <h2 id="faq-h" style="margin-bottom:18px">Frequently Asked Questions</h2>
      ${post.faqs
        .map(
          (f) => `
      <details class="faq-item">
        <summary>${esc(f.question)}</summary>
        <p>${esc(f.answer)}</p>
      </details>`
        )
        .join("\n      ")}
    </div>
  </section>`
      : "";

  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return `<!doctype html>
<html lang="en">
<head>
${headCommon()}

<title>${esc(post.title)} | ${BRAND}</title>
<meta name="description" content="${esc(post.metaDescription)}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="${BRAND}" />
<meta property="og:title" content="${esc(post.title)}" />
<meta property="og:description" content="${esc(post.metaDescription)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${heroUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="article:published_time" content="${publishedAt}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(post.title)}" />
<meta name="twitter:description" content="${esc(post.metaDescription)}" />
<meta name="twitter:image" content="${heroUrl}" />

<script type="application/ld+json">${buildJsonLd(post, url, heroUrl, publishedAt)}</script>
</head>
<body>

${headerPartial()}

<article class="blog-hero" id="main">
  <div class="container--narrow">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <a href="/blog">Blog</a> <span aria-hidden="true">›</span>
      <span aria-current="page">${esc(post.title)}</span>
    </nav>
    <h1>${esc(post.h1)}</h1>
    <p class="post-meta">Published ${esc(formattedDate)}</p>
  </div>
</article>

<section class="post-wrap">
  <div class="container--narrow">
    <img class="post-hero" src="hero.jpg" alt="${esc(post.title)}" width="1200" height="630" loading="eager" />
    <div class="post-body">
      ${sectionsHtml}
    </div>
  </div>
</section>

${faqsHtml}

<section class="post-cta">
  <div class="container--narrow">
    <h2>Locked out or need a lock changed today?</h2>
    <p>24/7 mobile locksmith — we come to you. Up-front pricing quoted before dispatch. Serving all of Broward County.</p>
    <div class="cta-btns">
      <a class="btn btn-primary" href="tel:${PHONE_TEL}">Call ${PHONE_DISPLAY}</a>
      <a class="btn btn-outline" href="/#contact">Get a Free Quote</a>
    </div>
  </div>
</section>

${footerPartial()}
</body>
</html>
`;
}

export function renderBlogIndex(records: PublishedRecord[]): string {
  const sorted = [...records].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const url = `${SITE}/blog`;

  return `<!doctype html>
<html lang="en">
<head>
${headCommon()}

<title>Locksmith Tips &amp; Guides | ${BRAND}</title>
<meta name="description" content="Real-world locksmith advice from licensed pros — lockouts, rekeying, car keys, smart locks, home and business security. 24/7 mobile service across Broward County, FL." />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow" />
</head>
<body>

${headerPartial()}

<header class="blog-hero" id="main">
  <div class="container">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <span aria-current="page">Blog</span>
    </nav>
    <h1>Locksmith Tips &amp; <span class="g">Guides</span></h1>
    <p class="post-meta">Real-world advice from licensed locksmiths — lockouts, rekeying, car keys, smart locks, and keeping your home and business secure.</p>
  </div>
</header>

<section>
  <div class="container">
    ${
      sorted.length === 0
        ? `<p style="text-align:center;color:var(--muted,#8893ad);padding:48px 0;">No posts yet — check back soon.</p>`
        : `<div class="blog-grid">
      ${sorted
        .map((r) => {
          const dateStr = new Date(r.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          return `
      <article class="blog-card">
        <p class="date">${esc(dateStr)}</p>
        <h2><a href="/blog/${esc(r.slug)}">${esc(r.title)}</a></h2>
        <p class="excerpt">${esc(r.excerpt)}</p>
        <a class="more" href="/blog/${esc(r.slug)}">Read more ›</a>
      </article>`;
        })
        .join("\n      ")}
    </div>`
    }
  </div>
</section>

${footerPartial()}
</body>
</html>
`;
}
