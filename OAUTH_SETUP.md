# Google & Apple Sign-In setup

The app already implements OAuth. You only need provider credentials in `apps/api/.env`, then restart the API.

## Google (recommended first)

1. Open [Google Cloud Console](https://console.cloud.google.com/) → create or select a project.
2. **APIs & Services → OAuth consent screen**
   - User type: External (unless Workspace-only)
   - App name: MemorIAmobile
   - Add your email as test user while in Testing
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://127.0.0.1:3000`
     - `http://localhost:3000`
     - production site origin, e.g. `https://www.memoriamobile.com`
   - Authorized redirect URIs:
     - `http://127.0.0.1:3001/auth/oauth/google/callback`
     - `http://localhost:3001/auth/oauth/google/callback`
     - production: `https://YOUR_API_HOST/auth/oauth/google/callback`
4. Copy **Client ID** and **Client secret** into `apps/api/.env`:

```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=http://127.0.0.1:3001/auth/oauth/google/callback
WEB_APP_URL=http://127.0.0.1:3000
```

5. Restart `npm run dev` (or the API). Login/Signup should show **Sign in with Google**.

Production: set `GOOGLE_REDIRECT_URI` and `WEB_APP_URL` to your live HTTPS URLs.

## Apple Sign In

Requires a paid [Apple Developer](https://developer.apple.com/) account (~$99/year).

1. Certificates, Identifiers & Profiles → **Identifiers**
   - Create an **App ID** with “Sign In with Apple”
   - Create a **Services ID** (this is `APPLE_CLIENT_ID`) — enable Sign In with Apple, set return URL to:
     - `http://127.0.0.1:3001/auth/oauth/apple/callback`
     - production HTTPS callback
2. **Keys** → create a key with Sign In with Apple → download `.p8` once.
3. Put in `apps/api/.env`:

```env
APPLE_CLIENT_ID=com.memoriamobile.web   # Services ID
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_KEY_ID=XXXXXXXXXX
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----"
APPLE_REDIRECT_URI=http://127.0.0.1:3001/auth/oauth/apple/callback
```

4. Restart the API. **Sign in with Apple** appears when all `APPLE_*` vars are set.

## How the flow works

1. User clicks Google/Apple → browser goes to `/hcgi/api/auth/oauth/{provider}`
2. Provider redirects to API callback with `code`
3. API creates/links MySQL user → redirects to `WEB_APP_URL/login?token=JWT`
4. Frontend stores JWT → opens dashboard

## Checklist if it fails

| Symptom | Fix |
|---------|-----|
| Button missing | Empty `GOOGLE_CLIENT_ID` / secret — fill `.env` and restart API |
| `redirect_uri_mismatch` | URI in Google Console must **exactly** match `GOOGLE_REDIRECT_URI` |
| Works locally, not production | Add production redirect URI; update `.env` on server |
| Apple only | Paid Apple Developer + Services ID + `.p8` key required |
