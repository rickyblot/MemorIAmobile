# Hostinger MySQL setup (PocketBase removed)

MemorIAmobile now uses **MySQL + Express** for auth and data. PocketBase is no longer required.

## Node.js GitHub deploy (Build Settings)

Use **Website → Node.js** (not PHP/static Git). Suggested commands:

| Setting | Value |
|--------|--------|
| Install | `npm install` |
| Build | `npm run build` |
| Start | `npm start` |

After build, Express serves the SPA from `dist/apps/web` and the API at `/hcgi/api`.

Set these **environment variables** in the Hostinger Node panel (required or the app exits and you may see **403**):

```env
PORT=<Hostinger usually sets this>
NODE_ENV=production
JWT_SECRET=<long-random-string>
MYSQL_HOST=...
MYSQL_PORT=3306
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...
CORS_ORIGIN=*
WEB_APP_URL=https://your-hostingersite.com
API_PUBLIC_URL=https://your-hostingersite.com/hcgi/api
```

Optional: `GOOGLE_*` / `APPLE_*` for OAuth. Do **not** rely on `apps/api/.env` on Hostinger — use the panel.

## 1. Create the database in hPanel

1. Open the site in Hostinger → **Bases de datos** → **Administración** (or Databases → Management).
2. Create a new MySQL database, user, and password.
3. Note: host (often `localhost` on shared hosting, or a hostname Hostinger shows), database name, user, password, port `3306`.
4. Optional: open **phpMyAdmin** to inspect tables after migrate.

## 2. Configure the API

Copy [`apps/api/.env.example`](../apps/api/.env.example) to `apps/api/.env` on the server and set:

```env
MYSQL_HOST=...
MYSQL_PORT=3306
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...
JWT_SECRET=<long-random-string>
WEB_APP_URL=https://www.your-domain.com
API_PUBLIC_URL=https://www.your-domain.com/hcgi/api
```

## 3. Run migrations

```bash
npm install
npm run migrate --prefix apps/api
```

Or start the API once — `src/main.js` runs migrations on boot.

## 4. Google / Apple login (optional)

In Google Cloud Console create an OAuth Web client and set:

- Authorized redirect URI: `https://your-api-host/auth/oauth/google/callback`
  (same value as `GOOGLE_REDIRECT_URI`)

For Apple, fill `APPLE_*` from your Apple Developer account.

## 5. Uploads

User files are stored under `apps/api/uploads/` and served at `/uploads/...` (proxied as `/hcgi/api/uploads/...`).

Ensure this directory is writable and included in backups. Do not commit it to Git.
