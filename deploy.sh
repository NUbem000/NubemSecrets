#!/bin/bash
set -e

PROJECT_ID="nubemsecrets-2025"
REGION="europe-west1"
SERVICE_NAME="nubemsecrets-api"
IMAGE_NAME="gcr.io/${PROJECT_ID}/nubemsecrets-app"

echo "🚀 Deploying NubemSecrets to Cloud Run..."

# Build and submit to Cloud Build
echo "📦 Building Docker image..."
gcloud builds submit --tag ${IMAGE_NAME} --project=${PROJECT_ID}

# Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --allow-unauthenticated \
  --set-secrets GOOGLE_CLIENT_ID=google-oauth-client-id:latest \
  --set-secrets GOOGLE_CLIENT_SECRET=google-oauth-client-secret:latest \
  --set-secrets SESSION_SECRET=session-secret:latest \
  --set-env-vars NODE_ENV=production \
  --set-env-vars GCP_PROJECT_ID=${PROJECT_ID} \
  --set-env-vars GCP_REGION=${REGION} \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10

echo "✅ Deployment complete!"
echo "🌐 Service URL:"
gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --project ${PROJECT_ID} \
  --format "value(status.url)"
