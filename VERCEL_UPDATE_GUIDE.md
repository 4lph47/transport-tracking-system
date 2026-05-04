# Update Vercel Deployment with Prisma Postgres

## Why the Map Shows 0 Buses

The Vercel deployment at https://transport-tracking-system-xltm.vercel.app/ is still using the old SQLite database configuration. We need to update it to use Prisma Postgres.

## Steps to Fix

### 1. Update Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `transport-tracking-system`
3. Go to **Settings** → **Environment Variables**
4. Add or update the following variable:

```
DATABASE_URL=postgres://a07ae726389b1d015dd3ead98a84066a11a37dcaaea8ca0704b239a844b4d38f:sk_0Aa21GuPYQLsvv08V8jZI@pooled.db.prisma.io:5432/postgres?sslmode=require
```

**Important:** Make sure to add this for all environments (Production, Preview, Development)

### 2. Redeploy the Application

After adding the environment variable, you need to trigger a new deployment:

**Option A: Via Git Push**
```bash
cd transport-client
git add .
git commit -m "Update to Prisma Postgres"
git push
```

**Option B: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy**

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

### 3. Verify the Deployment

Once deployed, visit:
- https://transport-tracking-system-xltm.vercel.app/ - Should show 25 buses on the map
- https://transport-tracking-system-xltm.vercel.app/api/buses - Should return JSON with 25 buses

## What Changed

### Before (SQLite)
```env
DATABASE_URL="file:./dev.db"
```
- SQLite database stored locally
- Not supported in Vercel serverless environment
- Data lost on each deployment

### After (Prisma Postgres)
```env
DATABASE_URL="postgres://...@pooled.db.prisma.io:5432/postgres"
```
- PostgreSQL database in the cloud
- Fully supported in Vercel
- Data persists across deployments
- Shared between local development and production

## Database Already Seeded

The Prisma Postgres database is already populated with:
- ✅ 25 Buses (Transportes)
- ✅ 18 Routes (Vias)
- ✅ 32 Stops (Paragens)
- ✅ 3 Users (Utentes)
- ✅ 2 Owners (Proprietários)
- ✅ 5 Drivers (Motoristas)

No need to run migrations or seed again - the database is ready!

## Troubleshooting

### If buses still don't appear after deployment:

1. **Check Vercel Logs:**
   ```bash
   vercel logs
   ```
   Look for database connection errors

2. **Verify Environment Variable:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure `DATABASE_URL` is set correctly
   - Make sure it's enabled for Production environment

3. **Force Rebuild:**
   ```bash
   vercel --force --prod
   ```

4. **Test API Endpoint:**
   Visit https://transport-tracking-system-xltm.vercel.app/api/buses
   - Should return JSON with `buses` array
   - Should have `total: 25`

### If you see "Prisma Client not generated" error:

The `package.json` already has `postinstall: "prisma generate"` which should handle this automatically. If it still fails:

1. Check Vercel build logs
2. Make sure `prisma` is in `devDependencies`
3. Try adding to `vercel.json`:
   ```json
   {
     "buildCommand": "prisma generate && next build"
   }
   ```

## USSD Integration

The USSD endpoints will also work with Prisma Postgres:
- `/api/ussd` - Africa's Talking USSD
- `/api/ussd-telerivet` - Telerivet USSD

Both endpoints use the same database, so users can:
- Register via USSD
- Track buses via USSD
- Save missions via USSD
- All data syncs with the web app

## Next Steps After Deployment

1. **Test the Web App:**
   - Visit https://transport-tracking-system-xltm.vercel.app/
   - Verify 25 buses appear on the map
   - Click on buses to see routes
   - Test search functionality

2. **Test USSD Integration:**
   - Configure Africa's Talking webhook to point to your Vercel URL
   - Test USSD flow: Dial your USSD code
   - Verify users can register and track buses

3. **Monitor Performance:**
   - Check Vercel Analytics
   - Monitor database queries in Prisma Studio
   - Watch for any errors in Vercel logs

## Security Note

⚠️ **Important:** The database connection string contains credentials. Make sure:
- Never commit `.env` files to Git (already in `.gitignore`)
- Only add DATABASE_URL via Vercel Dashboard (not in code)
- Rotate credentials if they're ever exposed

## Support

If you encounter issues:
1. Check Vercel logs: `vercel logs`
2. Check browser console for frontend errors
3. Test API endpoints directly
4. Verify environment variables in Vercel Dashboard

---

**Status:** Ready to Deploy
**Database:** Prisma Postgres (already seeded)
**Action Required:** Update DATABASE_URL in Vercel and redeploy
