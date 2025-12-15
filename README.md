# NubemSecrets

Secure secrets management platform with OAuth authentication and Google Cloud integration.

## Features

- Google OAuth 2.0 authentication
- Secure secrets storage using GCP Secret Manager
- Modern React frontend with responsive design
- RESTful API backend with Express
- User-specific secret management
- Create, read, update, and delete secrets
- Copy to clipboard functionality

## Architecture

- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express
- **Authentication**: Passport.js with Google OAuth
- **Secrets Storage**: GCP Secret Manager
- **Deployment**: Cloud Run (GCP)

## Local Development

### Prerequisites

- Node.js 20+
- GCP Account with Secret Manager enabled
- Google OAuth credentials

### Setup

1. Clone the repository
```bash
git clone https://github.com/nubemsystems/NubemSecrets.git
cd NubemSecrets
```

2. Install dependencies
```bash
npm run install:all
```

3. Configure environment variables

Backend (.env):
```bash
NODE_ENV=development
PORT=8080
GCP_PROJECT_ID=nubemsecrets-2025
GCP_REGION=europe-west1
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080
```

Frontend (client/.env):
```bash
VITE_API_URL=http://localhost:8080
```

4. Start development servers

Terminal 1 - Backend:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev:client
```

5. Open http://localhost:5173

## Production Deployment

### Build and Deploy to Cloud Run

1. Build Docker image
```bash
gcloud builds submit --tag gcr.io/nubemsecrets-2025/nubemsecrets-app
```

2. Deploy to Cloud Run
```bash
gcloud run deploy nubemsecrets-api \
  --image gcr.io/nubemsecrets-2025/nubemsecrets-app \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-secrets GOOGLE_CLIENT_ID=google-oauth-client-id:latest \
  --set-secrets GOOGLE_CLIENT_SECRET=google-oauth-client-secret:latest \
  --set-secrets SESSION_SECRET=session-secret:latest \
  --set-env-vars NODE_ENV=production \
  --set-env-vars GCP_PROJECT_ID=nubemsecrets-2025 \
  --set-env-vars GCP_REGION=europe-west1
```

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/user` - Get current user
- `GET /auth/logout` - Logout

### Secrets Management
- `GET /api/secrets` - List all secrets
- `GET /api/secrets/:name` - Get secret value
- `POST /api/secrets` - Create new secret
- `PUT /api/secrets/:name` - Update secret
- `DELETE /api/secrets/:name` - Delete secret

## Security Features

- OAuth 2.0 authentication
- Session-based authorization
- Secrets stored in GCP Secret Manager
- HTTPS only in production
- CORS protection
- Helmet security headers

## License

MIT

## Author

NubemSystems - david.anguera@nubemsystems.es
