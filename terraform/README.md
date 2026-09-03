# Infrastructure — kblue.io on Cloud Run

Single flat Terraform configuration for the portfolio: Cloud Run service (scale to
zero), Artifact Registry, Workload Identity Federation for GitHub Actions, and the
`www.kblue.io` (canonical) / `kblue.io` (redirects to www) domain mappings. Modelled
on the Still `web_frontend` module, minus the database/VPC/secrets that a static site
does not need.

| Item | Value |
| --- | --- |
| Project | `kyle-507414` (name "kyle", number `639022547931`) |
| Region | `europe-west4` (supports Cloud Run domain mappings) |
| Service | `kblue-portfolio` |
| Registry | `europe-west4-docker.pkg.dev/kyle-507414/container-repo/portfolio-web` |
| State | `gs://kyle-507414-terraform-state` prefix `portfolio/state` |

## First deploy

```bash
gcloud auth login
gcloud auth application-default login   # Terraform uses ADC
gcloud config set project kyle-507414

./bootstrap-state.sh                    # creates the state bucket (once)
terraform init
terraform plan
terraform apply
```

`apply` enables the APIs, creates the registry, the CI identity, the runtime service
account, the Cloud Run service (running Google's placeholder "hello" image until the
pipeline ships the real one) and the two domain mappings.

The domain mappings only succeed because the account running `apply` is a verified
owner of `kblue.io` (already done in Search Console). If you ever run this as another
identity, verify the domain first: https://search.google.com/search-console.

## DNS (Cloudflare)

`terraform output dns_records` prints the records once the mappings exist. They are
fixed for Cloud Run, so you can add them in Cloudflare *before* applying to avoid the
apply waiting on certificate provisioning:

| Name | Type | Content |
| --- | --- | --- |
| `@` | A | `216.239.32.21` |
| `@` | A | `216.239.34.21` |
| `@` | A | `216.239.36.21` |
| `@` | A | `216.239.38.21` |
| `@` | AAAA | `2001:4860:4802:32::15` |
| `@` | AAAA | `2001:4860:4802:34::15` |
| `@` | AAAA | `2001:4860:4802:36::15` |
| `@` | AAAA | `2001:4860:4802:38::15` |
| `www` | CNAME | `ghs.googlehosted.com` |

**Set every record to DNS only (grey cloud), not Proxied.** Google provisions and
renews the TLS certificate itself and cannot do so behind Cloudflare's proxy — Google
needs to see the real A/AAAA/CNAME records to validate the domain, and while proxied
it only sees Cloudflare's edge IPs, so the certificate stays stuck in
`CertificatePending` forever and Cloudflare has no valid origin certificate to
complete a handshake with (`Error 525`). Cloudflare's redirect rules and Page Rules
also only run on proxied traffic, so with DNS-only records they are inert regardless
of direction — the `kblue.io` → `www.kblue.io` redirect lives entirely in
`next.config.ts`; do not add a matching rule in Cloudflare. Certificate issuance takes
~15 minutes after DNS propagates; until then `https://www.kblue.io` returns a
certificate error while the `*.run.app` URL already works.

## GitHub Actions

The deploy workflow needs two repository secrets, both printed by `terraform output`:

| Secret | Value |
| --- | --- |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/639022547931/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `GCP_SERVICE_ACCOUNT` | `portfolio-github-actions@kyle-507414.iam.gserviceaccount.com` |

The CI service account can only push to the registry, update the Cloud Run service
and act as the (permissionless) runtime service account. It cannot run Terraform;
infrastructure changes are applied by hand from this directory.

## Day 2

- Change sizing/scaling in `variables.tf` (or `terraform.tfvars`) and `terraform apply`.
  The deployed image is ignored by Terraform, so an apply never rolls the site back.
- `terraform destroy` removes everything except the state bucket and the enabled APIs.
- `terraform fmt -recursive && terraform validate` run in CI on every PR.

## Cost

Everything below sits inside GCP's always-free tier for a personal site's traffic.

| Resource | Monthly estimate |
| --- | --- |
| Cloud Run, scale to zero, request-based billing | £0 (free tier: 2M requests, 180k vCPU-s, 360k GiB-s) |
| Artifact Registry (~5 images × ~150 MB, cleanup policy) | £0–0.10 (first 0.5 GB free, then ~$0.10/GB) |
| Managed TLS certificate + domain mapping | £0 |
| Egress | £0 (1 GB/month free to most regions; a page view is ~0.5–1 MB) |
| GCS state bucket | < £0.01 |
| GitHub Actions (public repo) | £0 |
| **Total** | **≈ £0–1 / month** |

Realistic worst case with a burst of traffic (say 50k page views in a month) is still
under £2. Setting `min_instances = 1` to eliminate cold starts adds roughly £5–8/month
(idle instance billed at the idle vCPU/memory rate).
