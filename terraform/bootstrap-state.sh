#!/usr/bin/env bash
# One-time: create the GCS bucket that holds Terraform state (idempotent).
# Run once, logged in as the project owner, before the first `terraform init`.
set -euo pipefail

PROJECT="kyle-507414"
BUCKET="gs://${PROJECT}-terraform-state"
LOCATION="europe-west4"

if gcloud storage buckets describe "$BUCKET" --project="$PROJECT" >/dev/null 2>&1; then
    echo "state bucket $BUCKET already exists"
else
    gcloud storage buckets create "$BUCKET" \
        --project="$PROJECT" \
        --location="$LOCATION" \
        --uniform-bucket-level-access \
        --public-access-prevention
    gcloud storage buckets update "$BUCKET" --versioning
    echo "created $BUCKET"
fi
