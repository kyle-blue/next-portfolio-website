output "service_url" {
  description = "Default *.run.app URL of the Cloud Run service (works before DNS is set up)"
  value       = google_cloud_run_v2_service.web.uri
}

output "service_name" {
  description = "Cloud Run service name"
  value       = google_cloud_run_v2_service.web.name
}

output "image_repository" {
  description = "Artifact Registry path CI pushes to"
  value       = "${local.registry_path}/${local.image_name}"
}

output "github_actions_service_account" {
  description = "GitHub repository secret GCP_SERVICE_ACCOUNT"
  value       = google_service_account.github_actions.email
}

output "workload_identity_provider" {
  description = "GitHub repository secret GCP_WORKLOAD_IDENTITY_PROVIDER"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "dns_records" {
  description = "DNS records to create at the registrar/DNS host (Cloudflare) for each mapped domain. Use DNS-only (grey cloud) records."
  value = {
    for domain, mapping in google_cloud_run_domain_mapping.web :
    domain => [
      for rr in try(mapping.status[0].resource_records, []) :
      { name = rr.name == "" ? "@" : rr.name, type = rr.type, rrdata = rr.rrdata }
    ]
  }
}
