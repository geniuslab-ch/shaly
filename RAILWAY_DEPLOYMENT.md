# Shaly Railway Deployment Guide

## Quick Start

Follow these steps to deploy Shaly to Railway:

### 1️⃣ Prepare GitHub Repository

```bash
# Add all files to git
git add .

# Commit changes
git commit -m "Prepare Shaly for Railway deployment"

# Push to GitHub (make sure you have a repo created)
git push origin main
```

### 2️⃣ Create Railway Project

1. Go to **[railway.app](https://railway.app)** and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your **Shaly repository**

### 3️⃣ Add Databases

**PostgreSQL:**
- In project dashboard: **"+ New"** → **"Database"** → **"PostgreSQL"**

**Redis:**
- In project dashboard: **"+ New"** → **"Database"** → **"Redis"**

### 4️⃣ Deploy Backend

**Create service:**
- **"+ New"** → **"GitHub Repo"** → Select Shaly repo

**Configure settings:**
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node dist/server.js`

**Add environment variables** (Settings → Variables):

```env
LINKEDIN_CLIENT_ID=<your_linkedin_client_id>
LINKEDIN_CLIENT_SECRET=<your_linkedin_client_secret>
JWT_SECRET=<generate with: openssl rand -base64 32>
PORT=${{PORT}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
FRONTEND_URL=<will add after frontend deployment>
LINKEDIN_REDIRECT_URI=${{RAILWAY_PUBLIC_DOMAIN}}/auth/linkedin/callback
NODE_ENV=production
```

### 5️⃣ Deploy Frontend

**Create service:**
- **"+ New"** → **"GitHub Repo"** → Select Shaly repo (again)

**Configure settings:**
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npx serve -s dist -p $PORT`

**Add environment variables:**

```env
VITE_API_URL=https://<your-backend-url>.railway.app
```

### 6️⃣ Update Backend FRONTEND_URL

Go back to backend service → Variables → Update:
```env
FRONTEND_URL=https://<your-frontend-url>.railway.app
```

### 7️⃣ Configure LinkedIn OAuth

1. Go to **[LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)**
2. Open your app → **"Auth"** tab
3. In **"OAuth 2.0 settings"** → **"Redirect URLs"**
4. Add: `https://<your-backend-url>.railway.app/auth/linkedin/callback`
5. **Save**

### 8️⃣ Test Your Deployment

1. Visit: `https://<your-frontend-url>.railway.app`
2. Click **"Connect with LinkedIn"**
3. Authorize the app
4. Create a test post
5. Verify everything works!

---

## Environment Variables Reference

### Backend

| Variable | Where to get it | Example |
|----------|----------------|---------|
| `LINKEDIN_CLIENT_ID` | LinkedIn Dev Portal | `78erufufkog0tg` |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn Dev Portal | `WPL_AP1.XXX` |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` | `xyz123...` |
| `DATABASE_URL` | Auto (Railway) | `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | Auto (Railway) | `${{Redis.REDIS_URL}}` |
| `FRONTEND_URL` | Frontend Railway URL | `https://shaly.railway.app` |
| `LINKEDIN_REDIRECT_URI` | Auto | `${{RAILWAY_PUBLIC_DOMAIN}}/auth/linkedin/callback` |

### Frontend

| Variable | Where to get it |
|----------|----------------|
| `VITE_API_URL` | Backend Railway URL |

---

## Troubleshooting

### ❌ Build failed

**Check:** Railway logs (click on service → Logs tab)

**Common issues:**
- Missing dependencies in `package.json`
- TypeScript compilation errors
- Wrong build command

### ❌ OAuth error "redirect_uri_mismatch"

**Fix:** Make sure redirect URI in LinkedIn Dev Portal **exactly matches**:
```
https://<your-backend-url>.railway.app/auth/linkedin/callback
```

### ❌ Can't connect to database

**Check:**
- PostgreSQL service is running (green in Railway dashboard)
- `DATABASE_URL` environment variable is set correctly
- Backend logs for connection errors

### ❌ Posts not scheduling

**Check:**
- Redis service is running
- Backend logs for BullMQ errors
- `REDIS_URL` is correctly configured

---

## Next Steps

✅ **Custom Domain** (optional):
- Railway Settings → Domains → "Add Custom Domain"

✅ **Monitoring**:
- Check logs regularly in Railway dashboard
- Set up notifications for deployments

✅ **Database Backups**:
- Railway Pro plan includes automated backups
- Or export manually: `railway run pg_dump`

---

**🎉 Congratulations! Shaly is now deployed on Railway!**
