#!/bin/bash
set -e

PROJECT_ID="nubemsecrets-2025"

echo "🔐 Setting up GCP Secrets for NubemSecrets..."

# Check if secrets already exist
echo "📋 Checking existing secrets..."
gcloud secrets list --project=${PROJECT_ID}

echo ""
echo "⚠️  To complete the setup, you need to ensure the following secrets exist:"
echo ""
echo "1. google-oauth-client-id"
echo "2. google-oauth-client-secret"
echo "3. session-secret"
echo ""
echo "If any are missing, create them using:"
echo ""
echo "# For OAuth Client ID:"
echo "echo -n 'YOUR_CLIENT_ID' | gcloud secrets create google-oauth-client-id --data-file=- --project=${PROJECT_ID}"
echo ""
echo "# For OAuth Client Secret:"
echo "echo -n 'YOUR_CLIENT_SECRET' | gcloud secrets create google-oauth-client-secret --data-file=- --project=${PROJECT_ID}"
echo ""
echo "# For Session Secret (generate random):"
echo "openssl rand -base64 32 | gcloud secrets create session-secret --data-file=- --project=${PROJECT_ID}"
echo ""
echo "📝 OAuth Configuration:"
echo "Configure your OAuth credentials at:"
echo "https://console.cloud.google.com/apis/credentials?project=${PROJECT_ID}"
echo ""
echo "Add these Authorized redirect URIs:"
echo "- https://nubemsecrets-api-y54rldgyva-ew.a.run.app/auth/google/callback"
echo "- http://localhost:8080/auth/google/callback"
echo ""

# Check if service account has permissions
echo "🔑 Checking service account permissions..."
SERVICE_ACCOUNT="670545000531-compute@developer.gserviceaccount.com"

echo "Granting Secret Manager access to service account..."
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None

echo ""
echo "✅ Secrets setup complete!"
echo "Next step: Run ./deploy.sh to deploy the application"
