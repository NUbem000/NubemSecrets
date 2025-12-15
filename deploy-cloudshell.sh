#!/bin/bash
# Deploy NubemSecrets from Cloud Shell
# This script is designed to run in GCP Cloud Shell where all permissions are correct

set -e

PROJECT_ID="nubemsecrets-2025"
REGION="europe-west1"
SERVICE_NAME="nubemsecrets-api"
IMAGE_NAME="gcr.io/${PROJECT_ID}/nubemsecrets-app"

echo "========================================="
echo "🚀 NubemSecrets Deployment"
echo "========================================="
echo ""

# Set project
echo "📋 Setting project to ${PROJECT_ID}..."
gcloud config set project ${PROJECT_ID}

# Enable APIs
echo "🔧 Enabling required APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com \
  --project=${PROJECT_ID}

echo "✅ APIs enabled"
echo ""

# Build Docker image
echo "📦 Building Docker image..."
echo "This will take 3-5 minutes..."
gcloud builds submit --tag ${IMAGE_NAME}

echo "✅ Docker image built successfully"
echo ""

# Deploy to Cloud Run
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
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

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""

# Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format "value(status.url)")

echo "🌐 Your application is live at:"
echo "   ${SERVICE_URL}"
echo ""
echo "📋 Next steps:"
echo "   1. Open: ${SERVICE_URL}"
echo "   2. Click 'Sign in with Google'"
echo "   3. Start managing your secrets!"
echo ""
echo "⚠️  IMPORTANT: Configure OAuth redirect URIs"
echo "   Go to: https://console.cloud.google.com/apis/credentials?project=${PROJECT_ID}"
echo "   Add this redirect URI: ${SERVICE_URL}/auth/google/callback"
echo ""
echo "========================================="
