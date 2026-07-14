# Horizons Editor — what to copy from local

Your original Horizons export is saved as **`app.tar.gz`** at the repo root.  
Run this anytime to see what changed:

```bash
npm run horizons:diff
```

**Note:** This repo now uses **MySQL + Express JWT** instead of PocketBase. Horizons still ships with its own PocketBase in older exports; for production prefer traditional Hostinger hosting with MySQL (see [`HOSTINGER_MYSQL.md`](./HOSTINGER_MYSQL.md)). Use this doc only if you still sync UI/API source into the Horizons Code tab.

---

## Quick answer

| Category | Action in Horizons |
|----------|-------------------|
| **Web UI / auth / blog / cart** | Copy in **Code** tab |
| **`apps/web/public/*` images** | Upload / replace in editor |
| **`apps/api/*`** | Copy if Horizons Code tab exposes `apps/api` (and ensure MySQL env on the server) |
| **`.env` files** | **Do not paste** — set secrets in Horizons / hPanel |
| **`README.md`, `.env.example`, `HOSTINGER_MYSQL.md`** | Optional docs |

---

## Files to copy into Horizons (as of last diff)

### New files (`+`)

**Web — paste into Horizons Code tab:**

- `apps/web/src/components/SocialAuthButtons.jsx`
- `apps/web/src/data/mockBlogPosts.js`
- `apps/web/src/lib/react-helmet-shim.jsx`
- `apps/web/src/pages/Cart.jsx`
- `apps/web/src/pages/admin/BlogCreate.jsx`
- `apps/web/src/pages/admin/BlogEdit.jsx`
- `apps/web/src/pages/admin/BlogList.jsx`
- `apps/web/src/pages/blog/BlogDetail.jsx`
- `apps/web/src/pages/blog/BlogIndex.jsx`

**Assets:**

- `apps/web/public/image_p30ugv6nhc.png` (logo)

### Modified files (`~`)

**Web:**

- `apps/web/src/App.jsx`
- `apps/web/src/components/ErrorBoundary.jsx`
- `apps/web/src/components/Footer.jsx`
- `apps/web/src/components/Header.jsx`
- `apps/web/src/components/LogoComponent.jsx`
- `apps/web/src/components/PlansList.jsx`
- `apps/web/src/contexts/AuthContext.jsx`
- `apps/web/src/contexts/LanguageContext.jsx`
- `apps/web/src/lib/pocketbaseClient.js` (MySQL-backed API client; name kept for compatibility)
- `apps/web/src/lib/translations.js`
- `apps/web/src/main.jsx`
- `apps/web/src/pages/LoginPage.jsx`
- `apps/web/src/pages/SignupPage.jsx`
- `apps/web/vite.config.js`
- `apps/web/package.json` (only if Horizons allows dependency changes)

**API:**

- `apps/api/src/api/ecommerce-subscriptions.js`
- Plus newer MySQL auth/data modules under `apps/api/src/` if you deploy the full API

---

## Easiest workflow

1. **Run** `npm run horizons:diff` before each Horizons publish.
2. In Horizons → **Code** → open each `~` / `+` file from the list.
3. On your PC, open the same file in Cursor → copy all → paste into Horizons → save.
4. Upload logo under `apps/web/public/`.
5. Click **Publish** → **Publish changes**.

Prefer deploying web + API with MySQL outside Horizons when ready — PocketBase is no longer part of this repo.

---

## Better long-term: use Git

You have no git commits yet, so `git status` shows everything. Fix that once:

```bash
git add .
git commit -m "Local dev baseline before Horizons sync"
```

After that, only new edits show up:

```bash
git status
git diff --name-only
```

Keep **`app.tar.gz`** in the repo (or tag the first commit) so `npm run horizons:diff` always compares against the original Horizons export.

---

## Copy-paste order (recommended)

Do these first — highest impact:

1. `apps/web/vite.config.js` (proxies / helmet fix)
2. `apps/web/src/main.jsx`
3. `apps/web/src/contexts/AuthContext.jsx`
4. `apps/web/src/App.jsx`
5. `apps/web/src/components/Header.jsx` + `Footer.jsx` + `LogoComponent.jsx`
6. `apps/web/src/pages/LoginPage.jsx` + `SignupPage.jsx`
7. `apps/web/src/lib/translations.js`
8. `apps/web/src/components/PlansList.jsx`
9. Blog + cart files
10. `apps/api` MySQL auth/data routes (if Horizons can host the full API)

Then **Publish** in Horizons — or deploy to Hostinger with MySQL per [`HOSTINGER_MYSQL.md`](./HOSTINGER_MYSQL.md).
