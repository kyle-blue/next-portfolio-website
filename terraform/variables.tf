variable "project_id" {
  description = "GCP project ID (the project named \"kyle\")"
  type        = string
  default     = "kyle-507414"
}

variable "project_number" {
  description = "GCP project number"
  type        = string
  default     = "639022547931"
}

variable "region" {
  description = "Region for Cloud Run and Artifact Registry. Must be a region that supports Cloud Run domain mappings (europe-west4 does; europe-west2/London does not)."
  type        = string
  default     = "europe-west4"
}

variable "environment" {
  description = "Deployment environment label"
  type        = string
  default     = "prod"
}

variable "service_name" {
  description = "Cloud Run service name"
  type        = string
  default     = "kblue-portfolio"
}

variable "image" {
  description = <<-EOT
    Container image used when the Cloud Run service is FIRST created. CI/CD owns the
    image afterwards (Terraform ignores drift on it), so this only needs to be a valid,
    runnable image. The default is Google's public hello container so `terraform apply`
    succeeds before the first pipeline run has pushed anything to Artifact Registry.
  EOT
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "domains" {
  description = "Custom domains mapped to the service. www is the canonical host; the apex redirects to it inside Next.js."
  type        = list(string)
  default     = ["www.kblue.io", "kblue.io"]
}

variable "github_repository" {
  description = "GitHub repository (owner/repo) allowed to deploy via Workload Identity Federation"
  type        = string
  default     = "kyle-blue/next-portfolio-website"
}

variable "min_instances" {
  description = "Minimum Cloud Run instances. 0 = scale to zero (cheapest; ~1-2s cold start on first hit)."
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum Cloud Run instances. A single instance handles 80 concurrent requests; a portfolio never needs more."
  type        = number
  default     = 1
}

variable "cpu" {
  description = "vCPU per instance"
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory per instance"
  type        = string
  default     = "512Mi"
}

variable "image_retention_days" {
  description = "Artifact Registry: delete image versions older than this (except the most recent `images_to_keep`)."
  type        = number
  default     = 30
}

variable "images_to_keep" {
  description = "Artifact Registry: always keep this many most-recent image versions for rollbacks."
  type        = number
  default     = 5
}

variable "deletion_protection" {
  description = "Protect the Cloud Run service from `terraform destroy`. Off by default for a personal site."
  type        = bool
  default     = false
}
