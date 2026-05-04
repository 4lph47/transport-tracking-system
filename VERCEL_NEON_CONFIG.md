# Vercel Configuration for Neon Database

## Quick Setup (3 Steps)

### Step 1: Add Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Select project: **transport-tracking-system**
3. Click **Settings** → **Environment Variables**
4. Click **Add New**

### Step 2: Enter Variable

**Key:**
```
DATABASE_URL
```

**Value:**
```
postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Environments:** (Check all three)
- ✅ Production
- ✅ Preview  
- ✅ Development

Click **Save**

### Step 3: Redeploy

**Option A - Git Push:**
```bash
git add .
git commit -m "Switch to Neon database"
git push
```

**Option B - Vercel Dashboard:**
- Go to **Deployments** tab
- Click **Redeploy** on latest deployment

---

## Verify Deployment

After deployment completes:

1. **Visit:** https://transport-tracking-system-xltm.vercel.app/
2. **Expected:** Map shows **25 autocarros**
3. **Test API:** https://transport-tracking-system-xltm.vercel.app/api/buses

---

## That's It! 🎉

Your app is now using Neon PostgreSQL:
- ✅ Serverless database
- ✅ Auto-scaling
- ✅ Connection pooling
- ✅ Free tier included
- ✅ Already seeded with 25 buses

---

## Optional: USSD Configuration

Only add these if using USSD services:

```
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=atsk_9303150b73d8556e297edcaf51c5e7da478697751c0e6ac9b40755cd625e4b8793de775a
TELERIVET_SECRET=TransportUSSD2024SecureKey
```

---

## Troubleshooting

### Buses still show 0?

1. **Check environment variable:**
   - Vercel Dashboard → Settings → Environment Variables
   - Verify `DATABASE_URL` is set correctly

2. **Check deployment:**
   - Vercel Dashboard → Deployments
   - Look for any errors in build logs

3. **Force rebuild:**
   ```bash
   vercel --prod --force
   ```

4. **Check Vercel logs:**
   ```bash
   vercel logs
   ```

---

**Need Help?** Check `NEON_SETUP_COMPLETE.md` for detailed documentation.
