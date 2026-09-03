terraform {
  required_version = ">= 1.9.0"

  # Remote state in GCS. Create the bucket once before `terraform init`:
  #   gcloud storage buckets create gs://kyle-507414-terraform-state \
  #     --project=kyle-507414 --location=europe-west4 --uniform-bucket-level-access
  backend "gcs" {
    bucket = "kyle-507414-terraform-state"
    prefix = "portfolio/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.1"
    }
  }
}
