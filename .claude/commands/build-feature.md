---
description: Design and build a frontend page, block, or component connected to the Payload CMS backend — handles schema, types, component, registration, and styling.
argument-hint: Describe what you want to build (e.g. 'a team members grid block with photos and bios' or 'an about page with timeline and team section')
---

# Build Feature

You are helping build a new frontend feature for HydroEra, a Payload CMS v3 + Next.js 16 App Router project. Read `CLAUDE.md` for full architecture details before proceeding.

**User's request:** $ARGUMENTS

---

## Phase 0: Classify the Request

Analyze the request and classify it as one or more of:

1. **New Block** — a new layout block for the page builder (config.ts + Component.tsx + registration)
2. **New Page** — a page composed of existing/new blocks with hero configuration
3. **New Component** — a shared UI component in `src/components/` (not a Payload block)
4. **New Collection** — a new Payload collection with config, access control, and hooks
5. **Enhancement** — modifying an existing block, page, component, or collection
6. **Composite** — a combination of the above (e.g. "about page" = new blocks + page composition)

State your classification and list every artifact that will be created or modified.

---

## Phase 1: Explore Before Building

### 1a. Check for reuse first

Read `src/blocks/RenderBlocks.tsx` to see all 15 registered blocks. Before creating anything new, determine if an existing block already handles this or could be extended. The existing blocks are:

- `archive` — collection listing with filters
- `content` — flexible columns with richText
- `cta` — call to action with richText + links
- `formBlock` — form builder integration
- `mediaBlock` — single media display
- `servicesGrid` — card grid with icons, titles, descriptions, optional links
- `statsCounter` — animated number counters with progress rings
- `testimonials` — testimonial cards (fetches from Testimonials collection)
- `featureSplit` — side-by-side media + content layout
- `projectsShowcase` — project cards (fetches from Projects collection)
- `certifications` — certification/credential display
- `logoGrid` — logo/partner grid
- `mediaContentAccordion` — expandable content with media
- `download` — downloadable file listing
- `industriesGrid` — industry sector cards

If an existing block does 80%+ of what's needed, propose extending it instead of creating a new one. State the trade-off explicitly.

### 1b. Read reference patterns

Read at least two existing block pairs (config.ts + Component.tsx) that match the type of feature being built:

| Building this | Read these as reference |
|---------------|----------------------|
| Grid/card layout | `src/blocks/ServicesGrid/config.ts` + `Component.tsx` |
| Split/side-by-side | `src/blocks/FeatureSplit/config.ts` + `Component.tsx` |
| Data-fetching block | `src/blocks/Testimonials/Component.tsx` + `Client.tsx` |
| Simple content | `src/blocks/CallToAction/config.ts` + `Component.tsx` |
| Animated/interactive | `src/blocks/StatsCounter/config.ts` + `Component.tsx` |
| Accordion/expandable | `src/blocks/MediaContentAccordion/config.ts` + `Component.tsx` |

### 1c. Read the design system

Read `src/app/(frontend)/globals.css` for:
- Brand colors: `--color-hydroera-blue` (#165DFB), `--color-hydroera-cyan` (#0090bc), `--color-hydroera-slate` (#475569), etc.
- Font variables: `--font-sans` (Inter), `--font-serif` (Playfair Display), `--font-mono` (Geist Mono)
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- Light/dark theme oklch color tokens

Note available utilities:
- `cn()` from `src/utilities/ui` for class merging
- `lucide-react` for icons
- shadcn/ui primitives in `src/components/ui/`
- `<Media>` component for Payload images
- `<CMSLink>` component for Payload links
- `<RichText>` component for Lexical rich text

---

## Phase 2: Design Before Coding

Present a design document in the chat **before writing any code**. Get user confirmation before proceeding.

### 2a. Payload Schema Design (if new block or collection)

Specify:
- **Block slug** — camelCase (e.g. `teamGrid`, `pricingTable`)
- **interfaceName** — PascalCase + "Block" suffix (e.g. `TeamGridBlock`)
- **labels** — singular and plural for the admin UI
- **Complete field list** with types

Follow these field conventions:
- Use `eyebrow` (text) + `heading` (text) + `subheading` (textarea) pattern for section headers
- Add `admin.description` to every field to guide content editors
- Use `admin.initCollapsed: true` on array fields
- Use the `link()` factory from `src/fields/link.ts` for CTA links — never define link structures manually
- Use `enableLink` (checkbox) + conditional `link()` for optional links
- Use `upload` with `relationTo: 'media'` for images
- Use `richText` with `lexicalEditor` features when rich content is needed
- Use `relationship` fields to reference other collections
- Use `select` fields for visual variants (layout, theme, background)

### 2b. Component Architecture

Choose one of these patterns:
- **Server Component** (default): block only renders props data, no interactivity
- **Async Server Component**: block fetches additional data from Payload using `getPayload({ config: configPromise })`
- **Server + Client split**: server component fetches data, passes to a `Client.tsx` with `'use client'` for interactivity (carousel, accordion, counter animation)

Only use `'use client'` when the component genuinely needs browser APIs, event handlers, or React state.

### 2c. Styling Plan

Specify:
- Responsive layout approach (grid columns, flex, etc.)
- Which HydroEra brand tokens and Tailwind classes will be used
- Any dynamic classes needing `@source inline()` directives in globals.css
- Follow consistent spacing: blocks get `my-16` wrapper from RenderBlocks automatically
- Follow section header pattern: centered `max-w-2xl mx-auto text-center mb-12` with eyebrow/heading/subheading

---

## Phase 3: Implement

Execute in this exact order:

### Step 1: Block Config (if new block)

Create `src/blocks/<Name>/config.ts`:
- Export the `Block` object with slug, interfaceName, labels, and fields
- If the block has array fields with row labels, create a named export admin component using `#ExportName` path syntax

### Step 2: Block Component (if new block)

Create `src/blocks/<Name>/Component.tsx`:
- Type the component with generated types from `payload-types.ts` or define a local props type
- Use the project's established component patterns (`cn()`, `<Media>`, `<CMSLink>`, `<RichText>`, lucide icons)
- Do NOT add scroll/reveal animations inside the component — `RenderBlocks.tsx` wraps all blocks in `<ScrollReveal>` automatically
- If interactivity is needed, also create `src/blocks/<Name>/Client.tsx` with `'use client'`

### Step 3: Register the Block

1. Import the config in `src/collections/Pages/index.ts` and add it to the `blocks` array in the `layout` field (line ~89)
2. Import the component in `src/blocks/RenderBlocks.tsx` and add it to the `blockComponents` object

### Step 4: Dynamic Tailwind Classes (if needed)

If the component constructs Tailwind classes at runtime (e.g. `lg:col-span-${size}`), add the classes to `@source inline(...)` directives in `src/app/(frontend)/globals.css`.

### Step 5: Generate Types and Validate

Run these commands in order:
```bash
pnpm payload generate:types
pnpm payload generate:importmap   # only if admin components were created (RowLabel, etc.)
npx tsc --noEmit                  # validate TypeScript
```

### Step 6: Verify

Suggest the user:
1. Start the dev server with `pnpm dev`
2. Go to `/admin` and create or edit a page
3. Add the new block in the Content tab
4. Fill in fields and preview the page

---

## Phase 4: Page Composition (if request involves a full page)

If the user asked for an entire page, provide:
- **Hero type** recommendation (none/highImpact/mediumImpact/lowImpact) with specific settings (overlay opacity, text alignment, breadcrumbs)
- **Block sequence** — ordered list of which blocks to add in the Payload admin and what content to put in each
- **SEO guidance** — meta title, description, and OG image recommendations

---

## Rules

1. **Never duplicate functionality.** Extend existing blocks if they handle 80%+ of the need.
2. **Always use `interfaceName`** on block configs for predictable type generation.
3. **Always add `admin.description`** to every field — this is a HydroEra convention.
4. **Prefer server components.** Only `'use client'` for genuine browser API / state needs.
5. **Naming conventions:** slug = camelCase, interfaceName = PascalCase + "Block", component export = PascalCase + "Block".
6. **Use the link factory** from `src/fields/link.ts` — never manually define link field structures.
7. **Don't add animations inside blocks** — `ScrollReveal` in `RenderBlocks.tsx` handles this automatically.
8. **Pass `req` in hooks** for transaction safety when creating nested Payload operations.
9. **Run type generation and tsc** after every schema change — never skip this step.
10. **Match the HydroEra design system** — use brand colors, Inter/Playfair fonts, consistent spacing and responsive patterns from existing blocks.
