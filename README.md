# kblue.io

Personal portfolio for Kyle Doidge. Next.js 16 (App Router) + React 19 + Tailwind v4,
built to a standalone Docker image and served from Google Cloud Run at
[www.kblue.io](https://www.kblue.io).

Blueprint-grey, monospace-labelled design with one teal ink: an animated topographic
height field behind the hero, a vertical experience timeline whose spine draws itself
as you scroll, tooltipped tech icons, and a sidebar index on desktop.

## Local development

```bash
pnpm install          # also installs the pre-commit hook (biome + tsc)
pnpm dev              # http://localhost:3000
pnpm check            # typecheck + lint + build
```

Content lives in `src/content/cv.ts` (transcribed from the CV) and `src/content/tech.tsx`
(tool/technology registry with brand icons). The CV PDF is served from
`public/Kyle-Doidge-CV.pdf`.

## Project layout

```
src/
├── app/                # routes: /, robots, sitemap, icon, opengraph-image
├── components/         # page sections, hero field, timeline, tooltips, nav
├── content/            # cv.ts (all copy), tech.tsx (icons + tooltip data)
├── lib/                # fonts, section index, SEO metadata
├── styles/site.css     # all styling, scoped under .site
└── config.ts           # per-environment config (NEXT_PUBLIC_ENVIRONMENT)
terraform/              # Cloud Run + Artifact Registry + WIF + domain mappings
.github/workflows/      # qa.yaml (PRs), deploy.yaml (push to main → build → push → deploy)
Dockerfile              # multi-stage standalone build, non-root, port 8080
```

## Deploying

1. **Infrastructure (once, by hand):** see [`terraform/README.md`](terraform/README.md).
   `terraform apply` creates the Cloud Run service, registry, CI identity and the
   `www.kblue.io` / `kblue.io` domain mappings.
2. **DNS:** add the Cloud Run records in Cloudflare as *DNS only* (table in the Terraform
   README).
3. **GitHub secrets:** `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT`
   (values in the Terraform README / `terraform output`).
4. **Ship:** every push to `main` runs QA, builds and pushes the image, rolls the Cloud
   Run service to it, smoke-checks it and rolls back automatically on failure.

## Running the container locally

```bash
docker build -t kblue-portfolio .
docker run --rm -p 8080:8080 kblue-portfolio
```
