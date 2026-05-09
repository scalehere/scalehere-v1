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
- `components/ui/` — atomic primitives (button, blue-button, accordion, dialog, infinite-slider, progressive-blur) + self-contained animation mechanics (circular-gallery, radial-orbital-timeline, zoom-parallax) + perf utilities (lazy-section — IntersectionObserver wrapper deferring child mount until scrolled near, used to lazy-load below-fold sections in `app/page.tsx`) + floating widgets (scroll-to-top). **Primary CTAs ship through `<BlueButton>`** (`size`: hero/nav/cta/send + `variant`: primary/secondary)
- `components/prompts/` — 21st.dev integration prompts (one `.txt` per section)
- `lib/utils.ts` — `cn()` helper + `smoothScrollToHash()` for anchor links
- `lib/contact-dialog-context.tsx` — `ContactDialogProvider` + `useContactDialog` hook (shared dialog state)

## Reference Docs — load on demand, not at startup

`my_references/my_files/INDEX.md` is the navigation map. Read it at session start; it points to everything else.

Trigger-load (only when the task touches the area):
- Visual / palette / button / typography / chrome work → `.claude/docs/design-tokens.md`
- Section order / anchor nav / `app/page.tsx` changes → `.claude/docs/sections.md`
- Mobile / per-breakpoint / touch-vs-pointer → `.claude/docs/responsive.md`
- Resuming uncommitted work / mid-session continuation → `my_references/my_files/session-log.md`
- Strategic planning / cross-tier decisions → full `my_references/my_files/HANDOFF.md` (default startup reads only the priority-queue section)

> **Note to fresh clones / external collaborators:** `my_references/`, `.claude/`, and the cross-project `../../PLAYBOOK.md` are gitignored personal/local refs — they're NOT in the repo or its git history. The committed code + this CLAUDE.md are the canonical project state. Don't try to reconstruct what's missing; work from the code.

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
- Update `my_references/my_files/session-log.md` after each meaningful change — not just at end of session
- Before every commit: ask for confirmation — never commit on your own initiative
- Never push unless explicitly asked to
- After completing a significant change: ask user to check in browser before committing
- Never commit broken code; no Co-Authored-By in commit messages
- **Conventional Commits:** `type(scope): description` — types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `revert`. Scope = component/section name in lowercase. Description: under 72 chars, lowercase, no period. Example: `fix(hero): trust strip single-row flex with responsive labels`
- **Commit body (when one is needed):** 1–2 opening lines on *what + why*. Use bullets for enumerable changes (files, options, before/after). Use prose for reasoning and trade-offs. Wrap at ~72 chars. Skip the body entirely on trivial one-liners where the subject line says it all.
- **Atomic commits — one concern per commit.** Keeps `git revert`, `git blame`, `git log --grep` clean. Applies even to tiny fixes: if it's a separate concern from the feature shipping alongside, commit it separately
- **Run `npm run build` before committing when the change touches TypeScript, logic, imports, or config.** It's the only local check that matches Vercel's deploy build — `npm run dev` is lenient and only reports on routes you actually visit

## Session habits (token efficiency)

The 4 highest-leverage tactics, kept here because PLAYBOOK is on-demand and these need to be present at decision time:
- `/clear` between unrelated tasks — resets context, costs nothing
- `/compact` proactively when session gets long — don't wait for auto-compact
- One prompt, one task — stacking multiplies wrong directions and produces messy diffs
- Default to Sonnet; Opus only when ambiguity / multi-file judgment / wrong-direction risk warrants the premium

Full reference in `../../PLAYBOOK.md` TOKEN EFFICIENCY section.

## Session Protocols

### Start session (default — main folder, sequential work)
1. Run `git status`, `git log -5`, `git branch --show-current` (parallel, one tool call)
2. Read `HANDOFF.md` priority-queue section only (top of file, until `### Tier 2`)
3. Read `INDEX.md` (compact navigation map — points to everything else)
4. If working tree dirty / mid-session continuation → read `session-log.md` last entry only
5. Acknowledge state in 2-3 sentences, ask what task

DO NOT auto-read `design-tokens.md`, `sections.md`, `responsive.md`, or full `HANDOFF.md`. Trigger-load those only after the task is identified.

### Start session (worktree / parallel — abbreviated)
For a session spawned in a worktree on a specific named task:
1. `git status`, `git log -3` (parallel)
2. Read CLAUDE.md (auto) + ONLY the file(s) the task touches
3. Skip HANDOFF, session-log, INDEX, `.claude/docs` unless task-relevant
4. Acknowledge task in 1-2 sentences, start work

### End session
1. Ask owner if ready to commit
2. After commit: reset `session-log.md` per existing convention (clear committed entries, keep notes about uncommitted work / next steps)
3. Update `HANDOFF.md` only if scope changed (item shipped, item added, decision locked)
4. Update CLAUDE.md only if a convention changed (rare)
5. PLAYBOOK changes are cross-project — sync manually, not per-session
