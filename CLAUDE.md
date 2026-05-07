# CLAUDE.md — ScaleHere / Scale SD

## Role
Senior UI designer and front-end developer. Prioritize clean, modern, premium design at every step.

## Project
Rebuilding the website for **Scale SD**, a social media marketing agency based in San Diego, CA.
Replacing their Wix site with a custom-coded Next.js site. Single-page — all nav uses anchor links, no multi-page routing.

Live: scalehere.com (preview: scalehere-v1-wine.vercel.app)

## Tech Stack
- **Next.js** + TypeScript
- **Tailwind CSS v4** — all layout, spacing, styling. No `tailwind.config.js`; tokens live in `app/globals.css` via `@theme inline {}` and `:root`
- **shadcn/ui** — pre-built components. Note: this project uses `@base-ui/react/button` — `Button` does NOT support `asChild`. For secondary buttons use `buttonVariants()` with `<Link>`
- **Framer Motion** (`motion/react`) — animations

## Build Commands
```bash
npm run dev     # local preview at localhost:3000
npm run build   # production build (matches Vercel's deploy build)
```

## Key Directories
- `app/` — layout, globals, page (section order defined in `app/page.tsx`)
- `components/blocks/` — composed page sections (Hero, Services, Testimonials, About, CTA, Footer, etc.) — large, opinionated, usually used once
- `components/ui/` — atomic primitives (button, glass-button, accordion, dialog, infinite-slider, progressive-blur) + self-contained animation mechanics (circular-gallery, radial-orbital-timeline, zoom-parallax) + floating widgets (scroll-to-top). **Primary CTAs ship through `<GlassButton>`** (hero/nav/cta/send via `size` prop)
- `components/prompts/` — 21st.dev integration prompts (one `.txt` per section)
- `lib/utils.ts` — `cn()` helper + `smoothScrollToHash()` for anchor links
- `lib/contact-dialog-context.tsx` — `ContactDialogProvider` + `useContactDialog` hook (shared dialog state)

## Reference Docs (load at session start when present)
- `.claude/docs/design-tokens.md` — full design spec: palette, typography, button/glass system, chrome placement
- `.claude/docs/sections.md` — section order, anchor map, folder convention, prompt-file status
- `.claude/docs/responsive.md` — per-breakpoint behavior, pointer-aware feature gates (touch vs mouse), what changes mobile/tablet/desktop
- `my_references/files/HANDOFF.md` — open work: Fix List, To Do, Audits, deferred polish
- `my_references/files/session-log.md` — running log; reset after each commit
- `my_references/files/INDEX.md` — table of contents for all reference docs

## Design Direction
- Deep blue-black background — pure-CSS layered radial+linear gradient on `body::before` (position: fixed). Electric blue accent (`#3B82F6`) — Electric Black scheme
- Chrome accent: `.chrome-border` utility for cards (3px gallery, 1px stat). Brand logo (`public/scale_sd_logo.webp`) appears as hero background (full inset, opacity 0.5) + About-section orbit center ("sun")
- Two fonts: Montserrat (headings — 500/700/900 scale) + Karla (body/UI — 400/700 + italic). Full scale in `.claude/docs/design-tokens.md`
- Subtle scroll/hover animations — never flashy
- Mobile responsive always

## Brand Voice
- Confident but approachable — "We treat clients like family"
- San Diego roots, serves LA and beyond
- Results-focused: real numbers, real outcomes

## Coding Behavior
- Never break working features — ask if unsure before large changes
- Ask user to check in browser before committing any UI change
- Keep components reusable, code clean
- Explain what you're doing in plain English — user is a beginner

## Workflow Notes
- Before every task: restate interpretation in plain English and ask for confirmation before touching any files
- Update `my_references/files/session-log.md` after each meaningful change — not just at end of session
- Before every commit: ask for confirmation — never commit on your own initiative
- Never push unless explicitly asked to
- After completing a significant change: ask user to check in browser before committing
- Never commit broken code; no Co-Authored-By in commit messages
- **Conventional Commits:** `type(scope): description` — types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `revert`. Scope = component/section name in lowercase. Description: under 72 chars, lowercase, no period. Example: `fix(hero): trust strip single-row flex with responsive labels`
- **Commit body (when one is needed):** 1–2 opening lines on *what + why*. Use bullets for enumerable changes (files, options, before/after). Use prose for reasoning and trade-offs. Wrap at ~72 chars. Skip the body entirely on trivial one-liners where the subject line says it all.
- **Atomic commits — one concern per commit.** Keeps `git revert`, `git blame`, `git log --grep` clean. Applies even to tiny fixes: if it's a separate concern from the feature shipping alongside, commit it separately
- **Run `npm run build` before committing when the change touches TypeScript, logic, imports, or config.** It's the only local check that matches Vercel's deploy build — `npm run dev` is lenient and only reports on routes you actually visit
