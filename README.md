# Unban Solutions

Production website for [unbansolutions.com](https://www.unbansolutions.com), built with React, TypeScript, Vite and Tailwind CSS.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Useful commands:

- `npm run lint` — static code checks
- `npm test` — security and content-integrity tests
- `npm run build` — type-check, production build and route metadata generation
- `npm run check` — the full local/CI verification pipeline

## Production behavior

- Each public route receives its own generated HTML title, description, canonical URL and social metadata.
- The blog is currently a non-clickable “coming soon” preview. Local article drafts may stay under ignored `content/blog-drafts` and are not tracked or copied into the public build.
- Unknown paths are served by the static `404.html`; there is no wildcard SPA rewrite that turns them into soft 404s.
- Google Analytics and Meta Pixel load only after explicit consent. Consent can be withdrawn from the footer or Privacy Policy.
- The contact endpoint accepts same-origin multipart requests, validates fields and file signatures, enforces size/rate limits and reads the Resend key only from the environment.
- Contact messages are delivered only to `CONTACT_EMAIL`; the endpoint does not send an automatic reply to the submitter.
- The former empty Supabase account shell (`/login`, `/register` and `/portal`) is intentionally retired; legacy URLs redirect to the contact funnel.

## Required Vercel environment

Configure `RESEND_API_KEY` as a server-only secret. For a rate limit shared by all serverless instances, also configure `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` and a random `RATE_LIMIT_SALT`; the endpoint keeps a local safety limit if Redis is unavailable. `CONTACT_EMAIL`, `FROM_EMAIL` and `SITE_URL` may override their documented defaults. Analytics IDs are public and may be overridden with the `VITE_` variables in `.env.example`.

Two Resend keys were embedded in earlier, already-published commits. Revoke both historical keys in Resend and configure a newly generated key before the next deployment. Rewriting Git history is optional cleanup and does not replace key revocation.

## Content rules

- Do not publish success rates, recovery counts, ratings or testimonials without a dated evidence source.
- Never promise a platform outcome; the relevant platform makes the final decision.
- Update `public/sitemap.xml` and add route metadata in `scripts/prerender.mjs` whenever a public route changes. Publish blog routes only after their drafts are approved.
- Never request passwords or two-factor authentication codes through the contact form.
