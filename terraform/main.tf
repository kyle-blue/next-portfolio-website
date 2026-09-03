# ---------------------------------------------------------------------------
# kblue.io — personal portfolio on Cloud Run
#
# Single-service, scale-to-zero deployment modelled on the Still web-frontend
# module. Everything lives in this one file:
#   1. APIs
#   2. Artifact Registry (with cleanup so storage cost stays ~zero)
#   3. Workload Identity Federation + service account for GitHub Actions
#   4. Runtime service account for the Cloud Run service (no roles)
#   5. Cloud Run v2 service + public access
#   6. Custom domain mappings (kblue.io, www.kblue.io)
# ---------------------------------------------------------------------------

provider "google" {
  project = var.project_id
  region  = var.region
}

locals {
  labels = {
    project     = "kblue-portfolio"
    environment = var.environment
    managed-by  = "terraform"
  }

  registry_repo_id = "container-repo"
  image_name       = "portfolio-web"
  registry_path    = "${var.region}-docker.pkg.dev/${var.project_id}/${local.registry_repo_id}"
}

# ---------------------------------------------------------------------------
# 1. APIs
# ---------------------------------------------------------------------------
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "serviceusage.googleapis.com",
  ])

  project                    = var.project_id
  service                    = each.value
  disable_dependent_services = false
  disable_on_destroy         = false
}

# ---------------------------------------------------------------------------
# 2. Artifact Registry
# ---------------------------------------------------------------------------
resource "google_artifact_registry_repository" "containers" {
  project       = var.project_id
  location      = var.region
  repository_id = local.registry_repo_id
  description   = "Container images for kblue.io"
  format        = "DOCKER"
  labels        = local.labels

  # Keep storage close to the 0.5 GB free tier: drop untagged layers quickly,
  # drop anything older than `image_retention_days`, but always keep the last
  # `images_to_keep` versions so rollbacks stay possible.
  cleanup_policy_dry_run = false

  cleanup_policies {
    id     = "delete-untagged"
    action = "DELETE"
    condition {
      tag_state  = "UNTAGGED"
      older_than = "86400s"
    }
  }

  cleanup_policies {
    id     = "delete-old"
    action = "DELETE"
    condition {
      tag_state  = "ANY"
      older_than = "${var.image_retention_days * 86400}s"
    }
  }

  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions {
      keep_count = var.images_to_keep
    }
  }

  depends_on = [google_project_service.required_apis]
}

# ---------------------------------------------------------------------------
# 3. Workload Identity Federation for GitHub Actions (keyless deploys)
# ---------------------------------------------------------------------------
resource "google_iam_workload_identity_pool" "github" {
  project                   = var.project_id
  workload_identity_pool_id = "github-pool"
  display_name              = "GitHub Actions Pool"
  description               = "Workload Identity Pool for GitHub Actions CI/CD"

  depends_on = [google_project_service.required_apis]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Actions Provider"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  # Only this repository may exchange tokens.
  attribute_condition = "attribute.repository == \"${var.github_repository}\""
}

resource "google_service_account" "github_actions" {
  project      = var.project_id
  account_id   = "portfolio-github-actions"
  display_name = "Portfolio GitHub Actions CI/CD"
  description  = "Used by kyle-blue/next-portfolio-website GitHub Actions to push images and roll out Cloud Run revisions"
}

resource "google_service_account_iam_member" "github_wif_binding" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repository}"
}

# Push + pull images.
resource "google_artifact_registry_repository_iam_member" "github_actions_push" {
  project    = var.project_id
  location   = var.region
  repository = google_artifact_registry_repository.containers.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.github_actions.email}"
}

# Roll out new revisions (`gcloud run services update`). run.developer is the
# least-privileged predefined role that allows updating a service.
resource "google_project_iam_member" "github_actions_run_developer" {
  project = var.project_id
  role    = "roles/run.developer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Deploying a revision that runs as the runtime SA requires actAs on it.
resource "google_service_account_iam_member" "github_actions_use_runtime_sa" {
  service_account_id = google_service_account.runtime.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.github_actions.email}"
}

# ---------------------------------------------------------------------------
# 4. Runtime service account — deliberately has NO project roles. A static
#    Next.js site needs nothing from GCP at runtime; stdout logs are collected
#    by Cloud Run regardless.
# ---------------------------------------------------------------------------
resource "google_service_account" "runtime" {
  project      = var.project_id
  account_id   = "portfolio-web-runtime"
  display_name = "Portfolio web runtime"
  description  = "Identity the kblue.io Cloud Run service runs as (no permissions)"
}

# ---------------------------------------------------------------------------
# 5. Cloud Run service
# ---------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "web" {
  name                = var.service_name
  location            = var.region
  project             = var.project_id
  ingress             = "INGRESS_TRAFFIC_ALL"
  deletion_protection = var.deletion_protection
  labels              = local.labels

  template {
    service_account                  = google_service_account.runtime.email
    max_instance_request_concurrency = 80
    timeout                          = "60s"

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = var.image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
        # Request-based billing: CPU is only billed while serving requests.
        cpu_idle          = true
        startup_cpu_boost = true
      }

      env {
        name  = "NEXT_TELEMETRY_DISABLED"
        value = "1"
      }

      env {
        name  = "HOSTNAME"
        value = "0.0.0.0"
      }

      startup_probe {
        http_get {
          path = "/"
          port = 8080
        }
        initial_delay_seconds = 0
        period_seconds        = 2
        failure_threshold     = 15
        timeout_seconds       = 2
      }
    }
  }

  lifecycle {
    # CI/CD owns the deployed image; ignore drift so `terraform apply` never
    # rolls the site back to the placeholder or an older image.
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }

  depends_on = [google_project_service.required_apis]
}

# Public site: anyone may invoke.
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ---------------------------------------------------------------------------
# 6. Custom domains. Requires the identity running `terraform apply` to be a
#    verified owner of kblue.io (Search Console / Webmaster Central) — it is.
#    Managed TLS certificates are provisioned by Google once DNS resolves.
# ---------------------------------------------------------------------------
resource "google_cloud_run_domain_mapping" "web" {
  for_each = toset(var.domains)

  location = var.region
  name     = each.value
  project  = var.project_id

  metadata {
    namespace = var.project_id
    labels    = local.labels
  }

  spec {
    route_name = google_cloud_run_v2_service.web.name
  }
}
