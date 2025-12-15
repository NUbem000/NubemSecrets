# NubemSecrets - Quick Start Guide

## What You Have Now

✅ **Complete Full-Stack Application**
- React frontend with OAuth login and dashboard
- Node.js backend with REST API
- GCP Secret Manager integration
- Production-ready Docker container

✅ **GitHub Repository**: https://github.com/NUbem000/NubemSecrets

✅ **GCP Project Configured**: nubemsecrets-2025
- All secrets configured
- APIs enabled
- Billing active
- Service account permissions set

## Deploy NOW in 3 Steps

### Step 1: Configure OAuth Redirect URIs

1. Go to GCP Console: https://console.cloud.google.com/apis/credentials?project=nubemsecrets-2025
2. Click on your OAuth 2.0 Client ID
3. Add these Authorized redirect URIs:
   ```
   https://nubemsecrets-api-y54rldgyva-ew.a.run.app/auth/google/callback
   http://localhost:8080/auth/google/callback
   ```
4. Click "Save"

### Step 2: Deploy Using Cloud Shell

1. Open Cloud Shell in GCP Console (top right icon)
2. Run these commands:

```bash
# Clone the repository
git clone https://github.com/NUbem000/NubemSecrets.git
cd NubemSecrets

# Make script executable
chmod +x deploy.sh

# Deploy!
./deploy.sh
```

That's it! The script will:
- Build the Docker image
- Push to Container Registry
- Deploy to Cloud Run
- Configure all environment variables and secrets

### Step 3: Test the Application

After deployment completes, the script will show you the service URL.

Open your browser to: https://nubemsecrets-api-y54rldgyva-ew.a.run.app

You should see:
1. ✅ A beautiful login page with "Sign in with Google" button
2. ✅ Click to login → OAuth flow
3. ✅ After login → User dashboard
4. ✅ Create, view, update, delete secrets

## Alternative: Deploy from Your Mac

If Docker is not available, use Cloud Shell (Step 2 above).

If you have Docker installed:

```bash
cd /Users/david/NubemSecrets
./deploy.sh
```

## What the App Does

### For Users:
1. **Login**: Click "Sign in with Google"
2. **Dashboard**: See all your secrets
3. **Create**: Add new secrets with name and value
4. **View**: Click to see secret value
5. **Copy**: One-click copy to clipboard
6. **Update**: Add new version of existing secret
7. **Delete**: Remove secrets with confirmation

### Under the Hood:
- Secrets stored in GCP Secret Manager (not in database)
- Each user's secrets labeled with their email
- Automatic versioning of secrets
- OAuth 2.0 authentication
- Session-based authorization
- HTTPS enforced
- Security headers enabled

## Troubleshooting

### "OAuth Error" after login
- Check redirect URIs are configured (Step 1)
- Verify secrets exist: `gcloud secrets list --project=nubemsecrets-2025`

### "Cannot access secrets"
- Service account already has permissions (we ran setup-secrets.sh)
- Verify: `gcloud projects get-iam-policy nubemsecrets-2025`

### Build fails
- Use Cloud Shell (always works)
- Check Cloud Build is enabled: `gcloud services list --enabled --project=nubemsecrets-2025`

### View logs
```bash
gcloud run services logs read nubemsecrets-api \
  --project=nubemsecrets-2025 \
  --region=europe-west1 \
  --limit=50
```

## Project Structure

```
NubemSecrets/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx      # OAuth login page
│   │   │   └── Dashboard.jsx  # User dashboard
│   │   └── styles/            # CSS files
│   └── package.json
│
├── server/           # Express backend
│   ├── config/
│   │   └── passport.js        # OAuth config
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   └── secrets.js         # Secrets API
│   └── index.js               # Server entry
│
├── Dockerfile        # Production build
├── cloudbuild.yaml   # CI/CD config
├── deploy.sh         # Deploy script ⭐
└── README.md         # Full documentation
```

## Key Files

- **deploy.sh** - One-command deployment
- **DEPLOYMENT.md** - Complete deployment guide
- **PROJECT_SUMMARY.md** - Technical overview
- **README.md** - User documentation

## Development

Want to modify the app?

```bash
# Install dependencies
cd /Users/david/NubemSecrets
npm install
cd client && npm install

# Start backend (terminal 1)
npm run dev:server

# Start frontend (terminal 2)
npm run dev:client

# Access at http://localhost:5173
```

## What's Next?

1. ✅ Deploy the app (3 steps above)
2. ✅ Test login and features
3. ✅ Share with your team
4. Optional: Set up CI/CD with GitHub Actions
5. Optional: Add custom domain
6. Optional: Add more features

## Cost

- **No traffic**: $0 (scales to zero)
- **Normal usage**: $1-5/month
- **Heavy usage**: $10-30/month

## Support

- **Repository**: https://github.com/NUbem000/NubemSecrets
- **Issues**: https://github.com/NUbem000/NubemSecrets/issues
- **Email**: david.anguera@nubemsystems.es

---

## Summary

You have a **complete, production-ready secrets management platform**:

✅ Modern React UI with OAuth
✅ Secure backend with GCP integration
✅ Docker containerized
✅ Deployment scripts ready
✅ Complete documentation
✅ GitHub repository

**Time to deploy: 5 minutes using Cloud Shell** 🚀

Just run:
```bash
git clone https://github.com/NUbem000/NubemSecrets.git && cd NubemSecrets && ./deploy.sh
```

That's it! You're done! 🎉
