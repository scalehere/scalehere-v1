# CLAUDE.md — ScaleHere / Scale SD

## Role
Senior UI designer and front-end developer. Prioritize clean, modern, premium design at every step.

## Project
Rebuilding the website for **Scale SD**, a social media marketing agency based in San Diego, CA.
Replacing their Wix site with a custom-coded Next.js site. Mostly single-page — the main marketing site uses anchor nav, plus standalone routes for `/privacy` (legal disclosures) and `/calendar` (ad-driven booking funnel, `noindex`).

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
- `app/sandbox/` (gitignored) — local-only dev tools at `localhost:3000/sandbox/<name>`. One folder per tool with `page.tsx`. Use for any sandbox, dev tool, or visual-tuning utility — not standalone HTML in `.claude/`.
- `components/blocks/` — composed page sections (Hero, Services, Testimonials, About, CTA, Footer, etc.) — large, opinionated, usually used once
- `components/ui/` — atomic primitives (button, blue-button, accordion, dialog, infinite-slider, progressive-blur) + self-contained animation mechanics (circular-gallery, radial-orbital-timeline, zoom-parallax) + perf utilities (lazy-section — IntersectionObserver wrapper deferring child mount until scrolled near, used to lazy-load below-fold sections in `app/page.tsx`) + floating widgets (scroll-to-top). **Primary CTAs ship through `<BlueButton>`** (`size`: hero/nav/cta/send + `variant`: primary/secondary)
- `my_references/prompts/` (gitignored) — 21st.dev integration prompts (one `.txt` per section, historical scaffolding reference only — not loaded at runtime)
- `lib/utils.ts` — `cn()` helper + `smoothScrollToHash()` for anchor links
- `lib/contact-dialog-context.tsx` — `ContactDialogProvider` + `useContactDialog` hook (shared dialog state)
- `lib/feature-flags.ts` — runtime feature flags; `PIXEL_LIVE` gates Meta Pixel sections in privacy policy + cookie notice copy (flip to `true` in the same commit that installs the Pixel script)

## Reference Docs — load on demand, not at startup

`my_references/my_files/INDEX.md` is the navigation map. Read it at session start; it points to everything else.

Trigger-load (only when the task touches the area):
- Visual / palette / button / typography / chrome work → `.claude/docs/design-tokens.md`
- Section order / anchor nav / `app/page.tsx` changes → `.claude/docs/sections.md`
- Mobile / per-breakpoint / touch-vs-pointer → `.claude/docs/responsive.md`
- Resuming uncommitted work / mid-session continuation → `my_references/my_files/session-log.md`
- Strategic planning / cross-tier decisions → full `my_references/my_files/HANDOFF.md` (default startup reads only the priority-queue section)

> **Note to fresh clones / external collaborators:** `my_references/`, `.claude/`, and the user-level `~/.claude/PLAYBOOK.md` are gitignored / outside-repo personal refs — they're NOT in the repo or its git history. The committed code + this CLAUDE.md are the canonical project state. Don't try to reconstruct what's missing; work from the code.

## Design Direction
- Deep blue-black background — fixed SVG mesh (`public/backgrounds/site-mesh.svg`) on `body::before` with hue-rotate + brightness/saturate filters. Electric blue accent (`#3B82F6`) — Electric Black scheme
- Chrome accent: `.chrome-border` utility for cards (3px gallery, 1px stat). Hero uses `public/backgrounds/hero-arc.png` as background. Brand logos in `public/scalehere_logos/`: `chrome_logo.webp` (full-res chrome S+star — About-section orbit center "sun") and `basic_logo.webp` (smaller webp variant — faint watermark behind the nav wordmark)
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
- **Always open a feature branch before starting any task** — `git checkout -b type/scope` off main. Direct commits to main are reserved for truly trivial one-liners only. Vercel preview URLs only exist on branches — required for review before anything hits main.
- Never push unless explicitly asked to
- After completing a significant change: ask user to check in browser before committing
- Never commit broken code

## Commit & PR messages

Every rule below applies to commits, PR titles, PR bodies, and code comments shipped to the repo. Same rules apply across all four surfaces.

**Format (Conventional Commits):** `type(scope): description` — types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `revert`. Scope = component/section name in lowercase. Description: under 72 chars, lowercase, no period. Example: `fix(hero): trust strip single-row flex with responsive labels`.

**Body (when one is needed):** 1–2 opening lines on *what + why*. Use bullets for enumerable changes (files, options, before/after). Use prose for reasoning and trade-offs. Wrap at ~72 chars. Skip the body entirely on trivial one-liners where the subject line says it all.

**Atomic commits — one concern per commit.** Keeps `git revert`, `git blame`, `git log --grep` clean. Applies even to tiny fixes: if it's a separate concern from the feature shipping alongside, commit it separately.

**Voice — first-person, as if the owner wrote it.** "I switched to font-heading", not "owner asked me to" or "Claude switched". No "Claude", "owner", "user", or "boss" references in commits, PR bodies, session-log, or in-repo docs. Even when a decision came from someone else (boss, stakeholder), surface it as the owner's own call — internal chain-of-command stays invisible in committed history.

**No external references in artifacts.** Don't cite gitignored files (`PLAYBOOK.md`, `.claude/`, `my_references/`, `HANDOFF.md`), internal tier/task numbering (Tier 1B, B1a), screenshot filenames, or "boss feedback from X date". These read as dead links to anyone outside the personal setup (GitHub view, fresh clone, future collaborator). Inline the reasoning instead of citing the source. Committed git hashes and merged PR numbers are fine — they resurface from git history. CLAUDE.md itself is the only exception: it's Claude's entry point and references to gitignored docs there are intentional.

**No workflow/process meta in artifacts.** Commit bodies, PR descriptions, and code comments describe the WORK, not the WORKFLOW. No "merge strategy: rebase because...", no "after reconsidering...", no "why we picked this tool over that one" essays. Process-meta lives in chat or session-log — never in shipped artifacts.

**No `Co-Authored-By` lines** in commit messages, ever.

**PR bodies** are Summary + Test plan + (optional) Known follow-ups. No "Why this approach" sections, no merge-strategy reasoning.

**Merge strategy is per-PR, not codified.** When merging, present squash/merge-commit/rebase options with tradeoffs and recommend one for the specific PR. Don't push a default.

**Before writing a commit message:** read `my_references/my_files/session-log.md` first to capture the full scope of the session's work, not just the last edit. Don't write narrow messages that miss the substance.

**Pre-commit discipline:**
- Run `npm run build` before committing when the change touches TypeScript, logic, imports, or config. Only local check that matches Vercel's deploy build — `npm run dev` is lenient and only reports on routes you actually visit.
- Ask for confirmation before committing — never on own initiative.
- Update reference docs first (HANDOFF, session-log, CLAUDE.md if convention shifted), then commit.

## Session habits (token efficiency)

The 4 highest-leverage tactics, kept here because PLAYBOOK is on-demand and these need to be present at decision time:
- `/clear` between unrelated tasks — resets context, costs nothing
- `/compact` proactively when session gets long — don't wait for auto-compact
- One prompt, one task — stacking multiplies wrong directions and produces messy diffs
- Default to Sonnet; Opus only when ambiguity / multi-file judgment / wrong-direction risk warrants the premium

Full reference in `~/.claude/PLAYBOOK.md` TOKEN EFFICIENCY section.

## Session Protocols

### Start session (default — main folder, sequential work)
1. Run `git status`, `git log -5`, `git branch --show-current` (parallel, one tool call)
2. Read `HANDOFF.md` priority-queue section only (top of file, until `### Tier 2`)
3. Read `INDEX.md` (compact navigation map — points to everything else)
4. If working tree dirty / mid-session continuation → read `session-log.md` last entry only
5. Acknowledge state in 2-3 sentences, ask what task

DO NOT auto-read `design-tokens.md`, `sections.md`, `responsive.md`, or full `HANDOFF.md`. Trigger-load those only after the task is identified.

### Start session (worktree / parallel — abbreviated)

Three ways this starts — pick the matching path:

**A. VS Code opened directly inside a worktree folder (task already in progress):**
1. `git status`, `git log -3` (parallel)
2. CLAUDE.md loads automatically — read ONLY the files the task touches
3. Skip HANDOFF, session-log, INDEX, `.claude/docs` unless task-relevant
4. Acknowledge task in 1-2 sentences, start work

**B. Main folder session, task named immediately ("start session + open worktree for X"):**
1. `git status`, `git log -3` (parallel) — skip HANDOFF and INDEX entirely, task is known
2. Open or create the worktree for the named branch
3. Run worktree setup checklist (see below)
4. Read ONLY the files the task touches
5. Acknowledge task in 1-2 sentences, start work

**C. Main folder session, task unknown at start:**
→ Follow the default start session protocol above (full HANDOFF + INDEX read), then open worktree once task is identified

### Worktree setup checklist
After creating or entering a worktree, always:
1. `npm install` inside the worktree folder
2. Copy `.env.local` from the main project root into the worktree folder
3. Note the dev port — if main project is already on 3000, worktree dev will auto-use 3001
4. Worktree is at `.claude/worktrees/<name>/` — hidden folder, enable "Show hidden items" in File Explorer to browse it

### End session
1. Ask owner if ready to commit
2. After commit: reset `session-log.md` per existing convention (clear committed entries, keep notes about uncommitted work / next steps)
3. Update `HANDOFF.md` only if scope changed (item shipped, item added, decision locked)
4. Update CLAUDE.md only if a convention changed (rare)
5. PLAYBOOK changes are cross-project — sync manually, not per-session
