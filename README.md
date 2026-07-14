# MemorIAmobile

Web platform for [MemorIAmobile](https://www.memoriamobile.com): accounts, service plans/checkout, and foundations for phone sync.

npm workspaces monorepo with React, Express, and MySQL.

## Stack

| Layer | Tech |
|-------|------|
| Web | React 18, Vite, React Router, Tailwind, Radix UI |
| API | Node.js, Express 5 |
| Data / Auth | MySQL + JWT (Google/Apple OAuth optional) |
| Payments | Hostinger Ecommerce API (Stripe-backed) |

## Structure

```
apps/
  web/   # Frontend — http://localhost:3000
  api/   # Express API — http://localhost:3001
```

Dev proxy:

- `/hcgi/api` → Express API  

## Prerequisites

- Node.js 20+
- npm 10+
- MySQL 8+ (local or Hostinger)

## Setup

```bash
npm install
```

### Environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Fill MySQL credentials, `JWT_SECRET`, and optional OAuth keys in `apps/api/.env`.  
See [`.env.example`](./.env.example) for the overview and [`HOSTINGER_MYSQL.md`](./HOSTINGER_MYSQL.md) for production.

### Database

```bash
npm run migrate
```

Migrations also run when the API starts.

## Run

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |

```bash
npm run build   # Build web → dist/apps/web
npm run start   # API only
npm run lint    # Lint web + api
```

## API routes (summary)

| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | No |
| POST | `/auth/signup`, `/auth/login` | No |
| GET | `/auth/providers` | No |
| GET/POST | `/auth/oauth/*` | No |
| POST | `/auth/forgot-password`, `/auth/reset-password` | No |
| GET/POST/PATCH/DELETE | `/data/:collection` | Yes (where required) |
| GET/POST | `/ecommerce/subscriptions` | Yes |
| POST | `/ecommerce/subscriptions/manage` | Yes |
| POST | `/integrated-ai/stream` | Yes |
| POST | `/stories/generate` | Yes |
| POST | `/device/connect`, `/device/sync` | Yes |
| POST | `/export/video`, `/pdf`, `/slideshow`, `/social-media` | Yes |
| POST/GET | `/analysis/batch`, `/analysis/status/:id` | Yes |

Protected routes expect a JWT Bearer token from login/signup/OAuth.

OAuth setup: [`OAUTH_SETUP.md`](./OAUTH_SETUP.md).

## Client priorities

1. Secure login / registration  
2. Working shopping cart for services  
3. Admin Blog / News  
4. Web ↔ mobile sync (notifications, contacts/photos with permission)  
5. Git repo + docs + publish on hosting  

Social integrations can come later.

## Notes

- PocketBase has been removed; auth and data use MySQL via the Express API.
- Do not commit real `.env` files or secrets.
- Mobile strategy notes: [`apps/web/MOBILE_APP_GUIDE.md`](./apps/web/MOBILE_APP_GUIDE.md)
