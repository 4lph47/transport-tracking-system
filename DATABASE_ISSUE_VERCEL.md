# 🚨 DATABASE ISSUE: Why You See 0 Buses on Vercel

## The Problem

Your map shows **0 autocarros** because Vercel **CANNOT access your local SQLite database**.

### Current Configuration (NOT WORKING on Vercel)
```env
DATABASE_URL="file:C:/Projectos externos/Transports Aplication/transport-admin/prisma/dev.db"
```

This path points to a file on **YOUR LOCAL COMPUTER** (C: drive). Vercel's servers don't have access to this file.

---

## Why SQLite Doesn't Work on Vercel

1. **Serverless Environment**: Vercel uses serverless functions that don't have persistent file storage
2. **No File System**: Each request runs in a temporary container that gets destroyed after
3. **Read-Only**: Even if you deploy the .db file, Vercel's filesystem is read-only

---

## ✅ SOLUTION: Use a Cloud Database

You have 3 main options:

### Option 1: Vercel Postgres (RECOMMENDED - Easiest)

**Pros:**
- Integrated with Vercel
- Automatic environment variable setup
- Free tier available (256 MB)
- No configuration needed

**Steps:**
1. Go to https://vercel.com/dashboard
2. Select your project: `transport-tracking-system`
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name (e.g., `transport-db`)
7. Click **Create**
8. Vercel will automatically add `DATABASE_URL` to your environment variables
9. Update your Prisma schema to use PostgreSQL
10. Run migrations and seed

**Cost:** FREE for up to 256 MB

---

### Option 2: Supabase (FREE, PostgreSQL)

**Pros:**
- Generous free tier (500 MB database, 2 GB bandwidth)
- Built-in authentication (if you need it later)
- Real-time subscriptions
- Easy to use dashboard

**Steps:**
1. Sign up at https://supabase.com
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (URI format)
5. Add to Vercel environment variables:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
6. Update Prisma schema to use PostgreSQL
7. Run migrations and seed

**Cost:** FREE

---

### Option 3: PlanetScale (FREE, MySQL-compatible)

**Pros:**
- Free tier (5 GB storage, 1 billion row reads/month)
- Branching for database changes
- No need for migrations in production

**Steps:**
1. Sign up at https://planetscale.com
2. Create a new database
3. Get connection string
4. Add to Vercel environment variables
5. Update Prisma schema to use MySQL
6. Run migrations and seed

**Cost:** FREE

---

## 🔧 How to Migrate from SQLite to PostgreSQL

### Step 1: Update Prisma Schema

Change the datasource in `transport-client/prisma/schema.prisma`:

**FROM (SQLite):**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**TO (PostgreSQL):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Update Environment Variable

In Vercel Dashboard → Settings → Environment Variables:

**Add:**
```
DATABASE_URL=<your-postgres-connection-string>
```

### Step 3: Run Migrations

```bash
cd transport-client
npx prisma migrate dev --name init
```

### Step 4: Seed the Database

```bash
npx prisma db seed
```

### Step 5: Redeploy

```bash
git add .
git commit -m "Switch to PostgreSQL for Vercel deployment"
git push origin main
```

Vercel will automatically redeploy.

---

## 🎯 RECOMMENDED: Use Vercel Postgres

This is the **easiest and fastest** solution:

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Storage tab → Create Database → Postgres**
4. **Done!** Vercel handles everything

Then just:
1. Update `prisma/schema.prisma` to use `postgresql`
2. Run `npx prisma migrate dev`
3. Run `npx prisma db seed`
4. Push to GitHub (auto-deploys)

---

## 📊 Comparison

| Option | Setup Time | Free Tier | Best For |
|--------|------------|-----------|----------|
| **Vercel Postgres** | 2 minutes | 256 MB | Quick setup, integrated |
| **Supabase** | 5 minutes | 500 MB | More features, larger DB |
| **PlanetScale** | 5 minutes | 5 GB | Large databases |

---

## ⚡ Quick Start: Vercel Postgres (5 Minutes)

```bash
# 1. Create database in Vercel Dashboard (2 min)
# 2. Update schema
cd transport-client

# 3. Edit prisma/schema.prisma - change provider to "postgresql"

# 4. Install Prisma CLI if needed
npm install -D prisma

# 5. Generate Prisma Client
npx prisma generate

# 6. Create migration
npx prisma migrate dev --name init

# 7. Seed database
npx prisma db seed

# 8. Push to GitHub
git add .
git commit -m "Add PostgreSQL support for Vercel"
git push origin main
```

**Result:** Your map will show all 25 buses! 🎉

---

## 🔍 How to Verify It's Working

After setting up the database:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Deployments → Latest → Functions
   - Look for `/api/buses` logs
   - Should see: "Found X buses in circulation"

2. **Test API Directly:**
   ```bash
   curl https://transport-tracking-system-xltm.vercel.app/api/buses
   ```
   
   Should return JSON with buses array

3. **Check the Map:**
   - Visit https://transport-tracking-system-xltm.vercel.app/
   - Should see "25 autocarros" in the top-left corner
   - Buses should appear on the map

---

## 🆘 Need Help?

If you get stuck, let me know which option you want to use and I'll guide you through it step by step!
