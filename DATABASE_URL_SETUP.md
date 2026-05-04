# 🔗 Database URL Setup - Quick Reference

## What You Need to Do

### 1️⃣ Get PostgreSQL URL from Vercel

After creating the database in Vercel, you'll see:

```
POSTGRES_PRISMA_URL="postgres://default:ABC123XYZ@ep-cool-name-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
```

**Copy this entire URL!**

---

### 2️⃣ Update Local Environment Files

#### File: `transport-client/.env`

```env
# PostgreSQL Database (Vercel)
DATABASE_URL="postgres://default:ABC123XYZ@ep-cool-name-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key-here"

# Africa's Talking API Credentials
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="atsk_9303150b73d8556e297edcaf51c5e7da478697751c0e6ac9b40755cd625e4b8793de775a"

# Telerivet Webhook Secret (optional)
TELERIVET_SECRET="TransportUSSD2024SecureKey"
```

#### File: `transport-admin/.env`

```env
# PostgreSQL Database (Vercel) - SAME URL as transport-client
DATABASE_URL="postgres://default:ABC123XYZ@ep-cool-name-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
```

**CRITICAL:** Both files must have the **EXACT SAME** `DATABASE_URL`!

---

### 3️⃣ Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | (Already set by Vercel) |
| `POSTGRES_PRISMA_URL` | (Already set by Vercel) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps key |
| `AFRICASTALKING_USERNAME` | `sandbox` |
| `AFRICASTALKING_API_KEY` | Your Africa's Talking key |
| `TELERIVET_SECRET` | `TransportUSSD2024SecureKey` |

---

## Why This Works

### Before (SQLite - Local Only)
```
transport-client/.env:
DATABASE_URL="file:C:/Projectos externos/.../dev.db"
                ↓
        Local SQLite file
                ↓
        ❌ Vercel can't access this!
```

### After (PostgreSQL - Cloud)
```
transport-client/.env:
DATABASE_URL="postgres://...vercel-storage.com..."
                ↓
        PostgreSQL on Vercel
                ↓
        ✅ Accessible from anywhere!

transport-admin/.env:
DATABASE_URL="postgres://...vercel-storage.com..."
                ↓
        Same PostgreSQL database
                ↓
        ✅ Both apps share data!

Vercel Production:
DATABASE_URL="postgres://...vercel-storage.com..."
                ↓
        Same PostgreSQL database
                ↓
        ✅ USSD & Web app share data!
```

---

## Testing Connection

### Test from transport-client
```bash
cd transport-client
npx prisma db push
```

**Expected:** "Your database is now in sync with your Prisma schema."

### Test from transport-admin
```bash
cd transport-admin
npx prisma db push
```

**Expected:** "Your database is now in sync with your Prisma schema."

---

## Common Mistakes

### ❌ WRONG: Different URLs
```
transport-client/.env:
DATABASE_URL="postgres://...database-1..."

transport-admin/.env:
DATABASE_URL="postgres://...database-2..."
```
**Problem:** Two separate databases, data not shared!

### ✅ CORRECT: Same URL
```
transport-client/.env:
DATABASE_URL="postgres://...same-database..."

transport-admin/.env:
DATABASE_URL="postgres://...same-database..."
```
**Result:** One database, all data shared!

---

## Security Note

**Never commit `.env` files to Git!**

Your `.gitignore` already excludes them:
```
.env
.env*.local
.env.local
```

This keeps your database credentials safe.

---

## Quick Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init_postgresql

# Seed database
npx prisma db seed

# View database
npx prisma studio

# Push schema without migration
npx prisma db push
```

---

## Need Help?

If you see errors like:
- "Can't reach database server"
- "Connection timeout"
- "Authentication failed"

**Check:**
1. DATABASE_URL is copied correctly (no extra spaces)
2. Vercel database is active (check Vercel Dashboard → Storage)
3. You're using `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)
