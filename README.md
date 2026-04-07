# HydroEra Website

Corporate website for **HydroEra** — a Malaysian water pump solutions company. Built with Payload CMS v3.81, Next.js 16 (App Router), PostgreSQL, and Tailwind CSS 4.

**Live site:** [hydroera-website.vercel.app](https://hydroera-website.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| CMS | Payload CMS v3.81 |
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | PostgreSQL (Neon) |
| Styling | Tailwind CSS 4, shadcn/ui |
| Storage | Vercel Blob Storage |
| Deployment | Vercel |
| Language | TypeScript |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database (local or hosted)

### Setup

```bash
# Clone the repo
git clone https://github.com/WillardLee/hydroera-website.git
cd hydroera-website

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Fill in DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint autofix |
| `pnpm payload generate:types` | Regenerate TypeScript types after schema changes |
| `pnpm payload generate:importmap` | Regenerate import map after admin component changes |
| `pnpm payload migrate:create` | Create a new DB migration |
| `pnpm payload migrate` | Run pending migrations |

## Architecture

Payload CMS and Next.js run in a single instance. The admin panel is served at `/admin` and the frontend at `/`.

### Collections

| Collection | Description |
|-----------|-------------|
| **Pages** | Draft-enabled with autosave. Hero + layout builder + SEO tabs. |
| **Posts** | Blog/news with Lexical rich text, authors, categories. |
| **Products** | Water pump products with specs, gallery, documents. |
| **Projects** | Completed project case studies with sector, client, location. |
| **Careers** | Job listings. |
| **Testimonials** | Client testimonials. |
| **Media** | Uploads with multiple image sizes, focal point, folders. |
| **Categories** | Hierarchical taxonomy via nested-docs plugin. |
| **Users** | Auth-enabled admin users. |

### Globals

- **Header** — Navigation links + CTA button
- **Footer** — Navigation links

### Layout Blocks

Pages are composed using a layout builder with these blocks:

| Block | Description |
|-------|-------------|
| Content | Flexible columns with rich text and links |
| Call To Action | Rich text + CTA buttons |
| Media | Single media display |
| Archive | Auto-populated or hand-picked post listings |
| Form | Embedded form builder forms |
| Services Grid | Service cards in grid layout |
| Stats Counter | Animated number counters |
| Testimonials | Client testimonial carousel |
| Feature Split | Side-by-side content + media with highlights |
| Project Showcase | Featured projects from the Projects collection |
| Certifications | 3D stacked card carousel for certificates |
| Logo Grid | Partner logos in grid or auto-scroll marquee |
| Media Content Accordion | Split layout with image + accordion |
| Download | Downloadable files in grid or list layout |

### Hero Types

- **High Impact** — Full-viewport dark overlay with background image
- **Medium Impact** — Similar with media
- **Low Impact** — Text-only
- **None** — No hero

## Features

- Draft/publish workflow with autosave
- Live preview in admin panel
- On-demand ISR revalidation via Payload hooks
- SEO management (meta title, description, OG image)
- Search (powered by Payload Search plugin)
- Redirects management
- Scheduled publishing via jobs queue
- Dark/light mode toggle
- Back-to-top button
- Responsive design (mobile-first)
- Admin login with recent email suggestions

## Plugins

- `@payloadcms/plugin-seo` — SEO fields and auto-generation
- `@payloadcms/plugin-form-builder` — Dynamic form creation
- `@payloadcms/plugin-nested-docs` — Hierarchical categories
- `@payloadcms/plugin-redirects` — URL redirect management
- `@payloadcms/plugin-search` — Full-text search indexing
- `@payloadcms/storage-vercel-blob` — Media storage on Vercel Blob

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Secret key for Payload auth |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of the site |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
| `CRON_SECRET` | Bearer token for cron/job endpoints |
| `PREVIEW_SECRET` | Secret for draft preview URLs |

## Deployment

The site is deployed on **Vercel** with PostgreSQL on Neon and media on Vercel Blob Storage.

For production deploys with schema changes:

```bash
pnpm payload migrate:create   # Create migration locally
pnpm payload migrate           # Run before pnpm start
```

## Seed Data

Click "Seed database" in the admin panel to populate demo content. This is **destructive** and will replace existing data.

## License

MIT
