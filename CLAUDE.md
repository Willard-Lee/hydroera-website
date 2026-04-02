# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HydroEra website built with **Payload CMS v3.81** + **Next.js 16 App Router** + **PostgreSQL**. Payload and Next.js run in a single instance — admin at `/admin`, frontend at `/`. Uses `@payloadcms/db-postgres` for the database adapter.

## Commands

```bash
pnpm dev                    # Start dev server (turbopack, fast refresh disabled)
pnpm build                  # Production build
pnpm start                  # Serve production build
pnpm lint                   # ESLint check
pnpm lint:fix               # ESLint autofix
pnpm payload generate:types # Regenerate src/payload-types.ts after schema changes
pnpm payload generate:importmap # Regenerate import map after creating/modifying admin components
npx tsc --noEmit            # Validate TypeScript (run after any code changes)
pnpm test:int               # Vitest integration tests (tests/int/)
pnpm test:e2e               # Playwright e2e tests (tests/e2e/, Chromium, auto-starts dev server)
pnpm payload migrate:create # Create a new DB migration
pnpm payload migrate        # Run pending migrations (required for production deploys)
```

## Architecture

### Payload CMS (Backend)

**Config** (`src/payload.config.ts`): Registers 5 collections (Pages, Posts, Media, Categories, Users), 2 globals (Header, Footer), plugins, PostgreSQL adapter, Lexical editor, Sharp image processing, and job/cron access via `CRON_SECRET` Bearer token.

**Collections** (`src/collections/`):

- **Pages** — Draft-enabled with autosave (100ms). Uses tabbed fields: Hero tab (group field with type select, richText, links, media), Content tab (`layout` blocks field), SEO tab (plugin-seo fields). Hooks: `revalidatePage` (afterChange — calls `revalidatePath`/`revalidateTag` on publish), `populatePublishedAt` (beforeChange). Access: `authenticated` for CUD, `authenticatedOrPublished` for read.
- **Posts** — Draft-enabled with autosave. Content uses Lexical rich text with inline blocks (Banner, Code, MediaBlock). Has `authors` relationship + `populatedAuthors` computed array (because Users collection is access-locked). Hooks: `revalidatePost`, `populateAuthors` (afterRead — manually fetches user data to bypass access control on Users). Categories relationship with nested-docs.
- **Media** — Upload collection to `/public/media`. Image sizes: thumbnail(300w), square(500x500), small(600w), medium(900w), large(1400w), xlarge(1920w), og(1200x630). Focal point enabled. Fields: `alt` (text), `caption` (richText). Folder support enabled.
- **Categories** — Simple title + auto-generated slug. Uses nested-docs plugin for hierarchical categories.
- **Users** — Auth-enabled. Only field is `name`. All access requires authentication (including read — this is why Posts needs `populateAuthors` hook).

**Globals** (`src/Header/config.ts`, `src/Footer/config.ts`): Both are arrays of `navItems` using the reusable `link` field (no appearance option). Max 6 items. Both have afterChange hooks that call `revalidateTag('global_header')`/`revalidateTag('global_footer')`. Admin uses `RowLabel` custom component (named export via `#RowLabel` path syntax).

**Plugins** (`src/plugins/index.ts`):
- `redirectsPlugin` — for pages/posts, afterChange triggers `revalidateRedirects` hook
- `nestedDocsPlugin` — for categories, auto-generates URL from slug chain
- `seoPlugin` — auto-generates title/URL from doc fields
- `formBuilderPlugin` — payment disabled, custom Lexical editor for confirmation messages
- `searchPlugin` — indexes posts collection, uses custom `beforeSyncWithSearch` and `searchFields`

**Access Control** (`src/access/`):
- `authenticated` — returns `Boolean(user)`, typed with `AccessArgs<User>`
- `authenticatedOrPublished` — if user return true, else return `{ _status: { equals: 'published' } }` (query constraint)
- `anyone` — always returns true

**Hooks** (`src/hooks/`):
- `populatePublishedAt` — beforeChange hook, sets `publishedAt` to now if not already set
- `revalidateRedirects` — afterChange hook on redirects collection, calls `revalidateTag('redirects')`

### Reusable Fields (`src/fields/`)

- **`link.ts`** — Group field factory. Creates internal (relationship to pages/posts) or external (custom URL) link with optional label, newTab, and appearance (default/outline). Uses `deepMerge` for overrides. Appearance can be disabled with `appearances: false`.
- **`linkGroup.ts`** — Array field wrapping `link`. Used for CTA buttons, nav items, hero links.
- **`defaultLexical.ts`** — Minimal Lexical editor (Paragraph, Bold, Italic, Underline, Link only). Links support internal docs (pages/posts) or external URLs with custom validation.

### Block System (Layout Builder)

Pages use a `layout` field (type: `blocks`) to compose content. Each block has:
- **Config** (`src/blocks/<Name>/config.ts`) — Payload `Block` type with `slug`, `interfaceName`, `fields`
- **Component** (`src/blocks/<Name>/Component.tsx`) — React component typed with generated `payload-types`

**Existing blocks:**
- `cta` (CallToAction) — richText + linkGroup (max 2 links, default/outline appearances)
- `content` (Content) — columns array, each with size (oneThird/half/twoThirds/full), richText, optional link
- `mediaBlock` (MediaBlock) — single media upload relationship
- `archive` (Archive) — populateBy (collection or selection), relationTo, categories filter, limit, or selectedDocs
- `formBlock` (FormBlock) — relationship to forms collection, optional intro richText
- `banner` (Banner) — style (info/warning/error/success) + richText (used as inline block in Posts rich text)
- `code` (Code) — language select + code field (used as inline block in Posts rich text)

**`src/blocks/RenderBlocks.tsx`** maps `blockType` to component via `blockComponents` object. To add a new block:
1. Create `src/blocks/<Name>/config.ts` exporting a `Block`
2. Create `src/blocks/<Name>/Component.tsx` typed with the generated interface
3. Add the config to the `blocks` array in `src/collections/Pages/index.ts`
4. Add the mapping in `blockComponents` in `src/blocks/RenderBlocks.tsx`
5. Run `pnpm payload generate:types` and `pnpm payload generate:importmap`

### Hero System

`src/heros/config.ts` defines a hero group field with: type select (none/highImpact/mediumImpact/lowImpact), richText (Lexical with H1-H4), linkGroup (max 2), media upload (conditional — only for highImpact/mediumImpact).

`src/heros/RenderHero.tsx` maps type string to component:
- `highImpact` — full-viewport dark overlay hero with background image, centered text, CTA links. Client component (`'use client'`) that sets header theme to dark.
- `mediumImpact` — similar with media
- `lowImpact` — text-only hero
- `none` — renders nothing

### Frontend (Next.js App Router)

**Layout** (`src/app/(frontend)/layout.tsx`): Sets up HTML with Geist fonts, `<InitTheme />` in head (prevents FOUC), wraps children in `<Providers>` (ThemeProvider + HeaderThemeProvider), renders AdminBar (draft mode indicator), Header, children, Footer.

**Homepage** (`src/app/(frontend)/page.tsx`): Re-exports `[slug]/page.tsx` — the homepage is the page with slug "home".

**Dynamic pages** (`src/app/(frontend)/[slug]/page.tsx`):
- `generateStaticParams` — fetches all page slugs for static generation
- `queryPageBySlug` — cached query using `React.cache`, respects `draftMode()`, sets `overrideAccess: draft` (only bypasses access control in draft mode)
- Renders: `<PageClient />` (client component for header theme reset), `<PayloadRedirects />`, `<LivePreviewListener />` (only in draft), `<RenderHero />`, `<RenderBlocks />`
- Falls back to `homeStatic` seed data if no page found for "home" slug

**Posts archive** (`src/app/(frontend)/posts/page.tsx`): `force-static` with 600s revalidate. Fetches posts with depth 1, limit 12, uses `select` to limit fields. Renders `CollectionArchive` + `Pagination`.

**Post detail** (`src/app/(frontend)/posts/[slug]/page.tsx`): Same pattern as pages — `generateStaticParams`, cached query, renders `PostHero` + `RichText` content + `RelatedPosts`.

### Key Components

- **`Media`** (`src/components/Media/`) — Dispatches to `ImageMedia` or `VideoMedia` based on mimeType. `ImageMedia` is a client component using `next/image` with blur placeholder, responsive sizes from breakpoints, and `getMediaUrl()` for URL construction.
- **`CMSLink`** (`src/components/Link/`) — Resolves Payload link field to `next/link`. Handles internal references (builds href from slug + relationTo) and external URLs. Renders as inline `<Link>` or `<Button asChild>` based on `appearance` prop.
- **`RichText`** (`src/components/RichText/`) — Wraps `@payloadcms/richtext-lexical/react`'s `ConvertRichText` with custom JSX converters for inline blocks (banner, mediaBlock, code, cta) and internal doc links. Supports prose styling and container gutter.
- **`PayloadRedirects`** — Server component that checks cached redirects and calls `redirect()` or `notFound()`. Used in every page to support the redirects plugin.
- **`ui/`** — shadcn/ui primitives (button, card, checkbox, input, label, select, textarea, pagination)

### Globals Data Fetching

`src/utilities/getGlobals.ts` exports `getCachedGlobal(slug, depth)` which wraps `payload.findGlobal()` in `unstable_cache` with tag `global_${slug}`. Header and Footer components call this to fetch nav data server-side with caching.

### Revalidation Flow

On-demand revalidation via Payload hooks → Next.js cache:
- Page publish/unpublish → `revalidatePath('/' + slug)` + `revalidateTag('pages-sitemap')`
- Post publish/unpublish → `revalidatePath('/posts/' + slug)` + `revalidateTag('posts-sitemap')`
- Header/Footer change → `revalidateTag('global_header')` / `revalidateTag('global_footer')`
- Redirect change → `revalidateTag('redirects')`
- All hooks check `context.disableRevalidate` to skip during seeding

### Styling

Tailwind CSS 4 with `@tailwindcss/typography` plugin. CSS custom properties in OKLch color space for theming. Light/dark mode via `[data-theme]` attribute. Container utility manually defined in `globals.css` with responsive max-widths. Breakpoints: sm(640px) md(768px) lg(1024px) xl(1280px) 2xl(1376px). Fonts: Geist Sans + Geist Mono via CSS variables.

Dynamic Tailwind classes that are constructed at runtime (e.g. `lg:col-span-${size}`) must be listed in `@source inline(...)` directives in `globals.css` so they are included in the build.

### Admin Component Paths

Payload admin custom components are referenced by **file path strings** (not imports). Paths are relative to `importMap.baseDir` (set to `src/`). Named exports use `#ExportName` suffix (e.g. `@/Header/RowLabel#RowLabel`). Import map auto-generated at `src/app/(payload)/admin/importMap.js`.

## Critical Payload CMS Patterns

### Local API Access Control

The Local API **bypasses all access control by default**. When passing a `user`, you MUST set `overrideAccess: false`:
```typescript
// WRONG — access control is silently bypassed
await payload.find({ collection: 'posts', user: someUser })

// CORRECT
await payload.find({ collection: 'posts', user: someUser, overrideAccess: false })
```

### Transaction Safety in Hooks

Always pass `req` to nested operations inside hooks to maintain transaction atomicity:
```typescript
afterChange: [async ({ doc, req }) => {
  await req.payload.create({ collection: 'audit-log', data: { docId: doc.id }, req })
}]
```

### Preventing Infinite Hook Loops

Use `context` flags when a hook triggers an update on the same collection:
```typescript
afterChange: [async ({ doc, req, context }) => {
  if (context.skipHooks) return
  await req.payload.update({ collection: 'posts', id: doc.id, data: { ... }, context: { skipHooks: true }, req })
}]
```

### Getting the Payload Instance

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'
const payload = await getPayload({ config })
```

### Draft Mode Pattern

Page queries use `overrideAccess: draft` — access control is only bypassed when draft mode is active. This ensures public visitors see only published content while editors in preview can see drafts.

## After Schema Changes

1. Run `pnpm payload generate:types` to regenerate `src/payload-types.ts`
2. Run `pnpm payload generate:importmap` if you created/modified admin components
3. Run `npx tsc --noEmit` to verify type correctness

## Environment Variables

`DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `CRON_SECRET`, `PREVIEW_SECRET`

## Database

PostgreSQL with `push: true` in dev (auto-schema sync). For production, create migrations with `pnpm payload migrate:create` and run with `pnpm payload migrate` before `pnpm start`.

## Seed Data

Click "seed database" in the admin panel or hit the seed endpoint (`src/endpoints/seed/`). Clears all collections/globals, creates demo user (`demo-author@example.com` / `password`), fetches sample images from GitHub, seeds categories, posts (sequentially for consistent ordering), pages (home + contact with form), and header/footer nav. Uses `context: { disableRevalidate: true }` during seeding to avoid revalidation errors. **Destructive** — drops existing data.

## Additional AI Context

Detailed Payload CMS patterns and rules are available in `AGENTS.md` (root) and `.cursor/rules/` (13 context files covering security, access control, hooks, fields, components, queries, endpoints, adapters, and plugin development). The `AGENTS.md` file should be read before making any Payload schema or backend changes.
