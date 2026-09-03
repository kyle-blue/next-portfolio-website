@AGENTS.md

# kblue.io — working rules

Personal portfolio for Kyle Doidge. Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript strict · Biome · pnpm. Deployed as a standalone Docker image to Cloud Run (`terraform/`).

## Commands
- `pnpm dev` / `pnpm build` / `pnpm check` (typecheck + lint + build; run before every commit)
- `pnpm lint:fix` formats and fixes with Biome (4-space indent, double quotes, 100 cols)
- `terraform -chdir=terraform fmt -recursive && terraform -chdir=terraform validate` after any `.tf` change

## Code
- All copy lives in `src/content/cv.ts`; tools/icons in `src/content/tech.tsx`. Components never hard-code CV facts.
- `src/components/` holds the page sections; `src/styles/site.css` holds all styling, scoped under `.site` with the `cx-` class prefix. Tailwind utilities are fine for one-offs; tokens are CSS custom properties on `.site`.
- Server components by default. `"use client"` only for effects, observers, state.
- No new dependencies without a clear reason. Effects (canvas, scroll, reveal) are hand-written.
- Accessibility is not optional: semantic landmarks, real buttons, `aria-expanded`, keyboard-reachable tooltips, visible focus rings, `prefers-reduced-motion` respected.
- Responsive from 360px up; never allow horizontal overflow.

## Motion
- Ease-out tweens only (`--ease`), 150–450ms. No springs, bounce or overshoot.
- Animate `transform`, `opacity`, colours and `outline`; avoid `border-width` or layout properties. Anything that changes state gets a transition.

## Infrastructure
- Terraform is applied by hand from `terraform/` (never from CI). CI only builds, pushes and rolls out the image.
- Config lives in `variables.tf`; keep defaults correct for project `kyle-507414`, region `europe-west4`.

## Git
- Make small, progressive commits as work lands (imperative subject, ≤ 72 chars, body only when it adds context).
- Never add `Co-authored-by` or any other trailer to commit messages.
- Never push. Pushing is done by Kyle.
