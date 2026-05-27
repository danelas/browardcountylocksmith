# Broward County Locksmith

Single-page marketing site for a 24/7 mobile locksmith serving every city in Broward County, FL.

## Stack

- Static HTML / CSS / vanilla JS — no build step.
- Poppins via Google Fonts.
- Schema.org `Locksmith` JSON-LD for local SEO.

## Local preview

Open `index.html` directly, or serve the folder:

```sh
npx serve .
```

## Customize

- Phone number: search/replace `(954) 555-0142` and `+19545550142`.
- License number: `LK-2840` in the utility bar and footer.
- Lead form: wire `main.js` `form.addEventListener('submit', …)` to Formspree, Make.com, or your CRM.
- Service areas: edit the `#areas` section in `index.html`.

## Deploy

Drop the folder on Netlify, Vercel, Cloudflare Pages, or GitHub Pages.
