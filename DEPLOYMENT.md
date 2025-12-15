# NubemSecrets Deployment Guide

## Prerequisites

Before deploying NubemSecrets, ensure you have:

1. GCP Project with billing enabled (`nubemsecrets-2025`)
2. Required APIs enabled:
   - Cloud Run API
   - Cloud Build API
   - Secret Manager API
   - Container Registry API
3. OAuth credentials configured in GCP Console
4. Secrets created in Secret Manager

## Setup GCP Secrets

Create the required secrets in GCP Secret Manager:

```bash
# Google OAuth Client ID
echo -n "YOUR_GOOGLE_CLIENT_ID" | gcloud secrets create google-oauth-client-id \
  --data-file=- \
  --project=nubemsecrets-2025

# Google OAuth Client Secret
echo -n "YOUR_GOOGLE_CLIENT_SECRET" | gcloud secrets create google-oauth-client-secret \
  --data-file=- \
  --project=nubemsecrets-2025

# Session Secret (generate a random string)
openssl rand -base64 32 | gcloud secrets create session-secret \
  --data-file=- \
  --project=nubemsecrets-2025
```

## Configure OAuth Redirect URIs

In Google Cloud Console > APIs & Services > Credentials:

1. Select your OAuth 2.0 Client ID
2. Add authorized redirect URIs:
   - `https://nubemsecrets-api-y54rldgyva-ew.a.run.app/auth/google/callback`
   - `http://localhost:8080/auth/google/callback` (for development)

## Deploy to Cloud Run

### Option 1: Using the deployment script

```bash
./deploy.sh
```

### Option 2: Manual deployment

```bash
# Build the Docker image
gcloud builds submit --tag gcr.io/nubemsecrets-2025/nubemsecrets-app \
  --project=nubemsecrets-2025

# Deploy to Cloud Run
gcloud run deploy nubemsecrets-api \
  --image gcr.io/nubemsecrets-2025/nubemsecrets-app \
  --platform managed \
  --region europe-west1 \
  --project nubemsecrets-2025 \
  --allow-unauthenticated \
  --set-secrets GOOGLE_CLIENT_ID=google-oauth-client-id:latest \
  --set-secrets GOOGLE_CLIENT_SECRET=google-oauth-client-secret:latest \
  --set-secrets SESSION_SECRET=session-secret:latest \
  --set-env-vars NODE_ENV=production \
  --set-env-vars GCP_PROJECT_ID=nubemsecrets-2025 \
  --set-env-vars GCP_REGION=europe-west1 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10
```

### Option 3: Using GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Build and Deploy
        run: |
          gcloud builds submit --tag gcr.io/nubemsecrets-2025/nubemsecrets-app
          gcloud run deploy nubemsecrets-api \
            --image gcr.io/nubemsecrets-2025/nubemsecrets-app \
            --platform managed \
            --region europe-west1 \
            --project nubemsecrets-2025
```

## Verify Deployment

After deployment, test the service:

```bash
# Check health endpoint
curl https://nubemsecrets-api-y54rldgyva-ew.a.run.app/health

# Expected response:
# {"status":"healthy","timestamp":"...","environment":"production","project":"nubemsecrets-2025"}
```

## Access the Application

Open your browser and navigate to:
https://nubemsecrets-api-y54rldgyva-ew.a.run.app

You should see the login page with the Google OAuth button.

## Troubleshooting

### OAuth Errors

If you get OAuth errors:
1. Verify OAuth credentials are correct in Secret Manager
2. Check redirect URIs are properly configured
3. Ensure the OAuth consent screen is configured

### Secret Manager Errors

If secrets cannot be accessed:
1. Verify secrets exist: `gcloud secrets list --project=nubemsecrets-2025`
2. Check service account has access to secrets
3. Grant Secret Manager Secret Accessor role if needed:
```bash
gcloud projects add-iam-policy-binding nubemsecrets-2025 \
  --member="serviceAccount:670545000531-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Build Errors

If Cloud Build fails:
1. Ensure Cloud Build API is enabled
2. Check Cloud Build service account has permissions
3. Verify Dockerfile syntax

### View Logs

```bash
gcloud run services logs read nubemsecrets-api \
  --project=nubemsecrets-2025 \
  --region=europe-west1 \
  --limit=50
```

## Update Deployment

To update the service after code changes:

```bash
git add .
git commit -m "Update: description of changes"
git push origin main

# Rebuild and redeploy
./deploy.sh
```

## Rollback

If you need to rollback to a previous version:

```bash
# List revisions
gcloud run revisions list --service=nubemsecrets-api \
  --project=nubemsecrets-2025 \
  --region=europe-west1

# Rollback to specific revision
gcloud run services update-traffic nubemsecrets-api \
  --to-revisions=nubemsecrets-api-00001-xxx=100 \
  --project=nubemsecrets-2025 \
  --region=europe-west1
```

## Cost Optimization

Cloud Run pricing is pay-per-use. To optimize costs:

1. Set appropriate CPU/memory limits
2. Configure min-instances to 0 (scale to zero when idle)
3. Set max-instances to prevent runaway costs
4. Use Cloud Run's request-based billing

Current configuration:
- Memory: 512Mi
- CPU: 1
- Min instances: 0
- Max instances: 10
- Timeout: 300s

## Security Considerations

1. **Secrets**: All sensitive data stored in Secret Manager
2. **Authentication**: OAuth 2.0 with Google
3. **HTTPS**: Enforced by Cloud Run
4. **Session**: Secure cookies in production
5. **CORS**: Configured to allow only same-origin
6. **Helmet**: Security headers enabled

## Monitoring

Set up monitoring and alerts:

```bash
# View metrics in Cloud Console
gcloud run services describe nubemsecrets-api \
  --project=nubemsecrets-2025 \
  --region=europe-west1 \
  --format="value(status.url)"
```

Monitor:
- Request count
- Response latency
- Error rate
- Instance count
- Memory usage
- CPU utilization

## Support

For issues or questions:
- GitHub Issues: https://github.com/NUbem000/NubemSecrets/issues
- Email: david.anguera@nubemsystems.es
