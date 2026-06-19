# Deployment Guide

Architecture:

- **Database** — MongoDB Atlas (managed cluster)
- **API server** — Render (Node web service, built from `render.yaml`)
- **Frontend** — Netlify (static Vite/React build, configured by `netlify.toml`)

The frontend and backend run on different domains, so the server issues
cross-site cookies (`sameSite=none; secure`) when `NODE_ENV=production`. Both
sides must be served over HTTPS (Render and Netlify both provide this by default).

---

## 1. MongoDB Atlas

1. Create a cluster, then a database user (username + password).
2. **Network Access → Add IP** → allow `0.0.0.0/0` (Render has no static
   outbound IP on the free plan). Lock this down later if you move to a paid tier.
3. **Connect → Drivers** and copy the SRV string. It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<app>
   ```
   This becomes `DB_CONNECTION_URL`. The database name is set separately via
   `DATABASE` (currently `nexvolt`) and applied through the Mongoose `dbName`
   option — the path in the URI is ignored.

---

## 2. Backend → Render

1. Push this repo to GitHub.
2. Render dashboard → **New + → Blueprint** → select the repo. Render reads
   [`render.yaml`](render.yaml) and creates the `product-management-api` service.
3. Fill in the prompted secrets (every `sync: false` var):
   - `DB_CONNECTION_URL` — the Atlas SRV string from step 1
   - `JSON_WEB_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`
   - `EMAIL_USER`, `EMAIL_PASS` (Gmail app password)
   - `CLOUDINARY_URL`
   - `SSL_STORE_ID`, `SSL_STORE_PASSWORD`
   - `SERVER_URL` — this service's URL, e.g. `https://product-management-api.onrender.com`
   - `CLIENT_URL` — your Netlify URL (fill in after step 3; redeploy if needed)
4. Build = `npm install && npm run build:server`, Start = `npm run start:server`
   (already set in the blueprint). Health check hits `/`.

> `CLIENT_URL` must exactly match the Netlify origin or CORS will block the
> browser. No trailing slash.

---

## 3. Frontend → Netlify

1. Netlify → **Add new site → Import from Git** → select the repo.
   [`netlify.toml`](netlify.toml) sets base `src/client`, build `npm run build`,
   publish `src/client/dist`, and the SPA redirect for react-router.
2. **Site settings → Environment variables** → add:
   ```
   VITE_API_HOST_NAME = https://product-management-api.onrender.com
   ```
   (your Render URL, no trailing slash). Vite reads this at **build time**, so
   redeploy after changing it.
3. Deploy. Copy the resulting `https://<site>.netlify.app` URL into Render's
   `CLIENT_URL` env var and redeploy the API.

---

## 4. Smoke test

1. Visit the Render URL `/` → `{"message":"Hello World!"}`.
2. Open the Netlify site, log in, and confirm in DevTools → Network that auth
   requests return `Set-Cookie` and subsequent requests are authenticated.
   If cookies don't stick, re-check: `NODE_ENV=production` on Render,
   `CLIENT_URL` matches the Netlify origin, and both sites are HTTPS.

## Local development

Unchanged: copy `.env.template` → `.env` (server) and `src/client/.env.example`
→ `src/client/.env`, then `npm run dev`.
