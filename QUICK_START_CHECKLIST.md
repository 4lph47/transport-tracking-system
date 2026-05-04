# ✅ Quick Start Checklist - PostgreSQL Setup

Follow these steps in order to get your USSD + Web App working on Vercel.

---

## 📝 Pre-Setup Checklist

Before you start, make sure you have:
- [ ] Vercel account (https://vercel.com)
- [ ] Project deployed on Vercel (https://transport-tracking-system-xltm.vercel.app)
- [ ] Git repository connected to Vercel
- [ ] Africa's Talking account with USSD service

---

## 🚀 Setup Steps (30 minutes)

### STEP 1: Create PostgreSQL Database (5 min)

- [ ] Go to https://vercel.com/dashboard
- [ ] Select project: **transport-tracking-system**
- [ ] Click **Storage** tab
- [ ] Click **Create Database**
- [ ] Select **Postgres**
- [ ] Name: `transport-db`
- [ ] Region: **Washington, D.C., USA (iad1)**
- [ ] Click **Create**
- [ ] **COPY** the `POSTGRES_PRISMA_URL` value

**Your URL will look like:**
```
postgres://default:ABC123XYZ@ep-cool-name-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15
```

---

### STEP 2: Update Local Environment Files (2 min)

#### Update `transport-client/.env`

- [ ] Open file: `transport-client/.env`
- [ ] Find line: `DATABASE_URL="file:C:/..."`
- [ ] Replace with: `DATABASE_URL="<paste-your-POSTGRES_PRISMA_URL>"`
- [ ] Save file

#### Update `transport-admin/.env`

- [ ] Open file: `transport-admin/.env`
- [ ] Find line: `DATABASE_URL="file:./prisma/dev.db"`
- [ ] Replace with: `DATABASE_URL="<paste-SAME-URL-as-above>"`
- [ ] Save file

**CRITICAL:** Both files must have the **EXACT SAME** URL!

---

### STEP 3: Update Vercel Environment Variables (3 min)

- [ ] Go to Vercel Dashboard → Project → **Settings** → **Environment Variables**
- [ ] Verify `DATABASE_URL` is set (auto-added by Vercel)
- [ ] Add/Update these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps key | All |
| `AFRICASTALKING_USERNAME` | `sandbox` | All |
| `AFRICASTALKING_API_KEY` | Your AT key | All |
| `TELERIVET_SECRET` | `TransportUSSD2024SecureKey` | All |

- [ ] Click **Save** for each variable

---

### STEP 4: Run Database Migrations (5 min)

Open terminal in `transport-client` folder:

```bash
cd transport-client

# Install dependencies (if needed)
npm install

# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init_postgresql
```

**Expected output:**
```
✔ Generated Prisma Client
The following migration(s) have been created and applied:
migrations/
  └─ 20240504000000_init_postgresql/
    └─ migration.sql
Your database is now in sync with your schema.
```

- [ ] Migration completed successfully

---

### STEP 5: Seed the Database (5 min)

Still in `transport-client` folder:

```bash
npx prisma db seed
```

**Expected output:**
```
🌱 Seeding database...
✅ Created 2 provinces
✅ Created 2 cities
✅ Created 2 municipalities
✅ Created 18 routes
✅ Created 32 stops
✅ Created 25 buses
✅ Created 5 drivers
✅ Created 2 owners
✅ Created 3 users
🎉 Database seeded successfully!
```

- [ ] Seed completed successfully

---

### STEP 6: Verify Data (2 min)

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555

- [ ] Check `Via` table: Should have **18 routes**
- [ ] Check `Paragem` table: Should have **32 stops**
- [ ] Check `Transporte` table: Should have **25 buses**

Close Prisma Studio when done.

---

### STEP 7: Test Locally (3 min)

```bash
npm run dev
```

Visit: http://localhost:3000

- [ ] Map loads
- [ ] Shows "**25 autocarros**" in top-left corner
- [ ] Buses appear on map
- [ ] Click a bus to see route

**Test USSD endpoint:**

```bash
# In PowerShell
$body = @{sessionId='test123'; serviceCode='*384*123#'; phoneNumber='+258867570587'; text=''}
Invoke-WebRequest -Uri 'http://localhost:3000/api/ussd' -Method POST -Body $body -ContentType 'application/x-www-form-urlencoded' -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected:**
```
CON Bem-vindo ao Sistema de Transportes
1. Encontrar Transporte Agora
2. Procurar Rotas
3. Paragens Próximas
4. Calcular Tarifa
5. Ajuda
```

- [ ] Web app works locally
- [ ] USSD endpoint works locally

---

### STEP 8: Deploy to Vercel (5 min)

```bash
git add .
git commit -m "Switch to PostgreSQL for production deployment"
git push origin main
```

- [ ] Code pushed to GitHub
- [ ] Vercel auto-deploys (check Dashboard → Deployments)
- [ ] Wait for "Ready" status

---

### STEP 9: Verify Production (3 min)

Visit: https://transport-tracking-system-xltm.vercel.app/

- [ ] Map loads
- [ ] Shows "**25 autocarros**"
- [ ] Buses appear on map

**Test production USSD:**

```bash
$body = @{sessionId='test123'; serviceCode='*384*123#'; phoneNumber='+258867570587'; text=''}
Invoke-WebRequest -Uri 'https://transport-tracking-system-xltm.vercel.app/api/ussd' -Method POST -Body $body -ContentType 'application/x-www-form-urlencoded' -UseBasicParsing | Select-Object -ExpandProperty Content
```

- [ ] Production web app works
- [ ] Production USSD API works

---

### STEP 10: Update Africa's Talking (2 min)

- [ ] Login to https://account.africastalking.com/
- [ ] Go to **USSD** section
- [ ] Find your service code
- [ ] Update **Callback URL** to:
  ```
  https://transport-tracking-system-xltm.vercel.app/api/ussd
  ```
- [ ] Click **Save**

---

### STEP 11: Test from Phone (Final Test!)

- [ ] Dial your USSD code (e.g., `*384*123#`)
- [ ] Should see main menu
- [ ] Try option 2 (Procurar Rotas)
- [ ] Select Matola
- [ ] Should see list of routes

---

## ✅ Success Criteria

After completing all steps, you should have:

### Web App
- ✅ Map shows 25 buses
- ✅ Buses have correct GPS coordinates
- ✅ Click bus shows route and stops
- ✅ User location marker appears

### USSD Service
- ✅ Main menu appears when dialing code
- ✅ Route search returns results
- ✅ Transport info shows bus details
- ✅ Fare calculator works

### Database
- ✅ 18 routes in Via table
- ✅ 32 stops in Paragem table
- ✅ 25 buses in Transporte table
- ✅ All data accessible from web app, USSD, and admin panel

### Integration
- ✅ USSD and web app share same database
- ✅ Admin panel can add/edit data
- ✅ Changes appear in both USSD and web app
- ✅ Real-time data synchronization

---

## 🆘 Troubleshooting

### Issue: "Can't reach database server"
**Solution:**
- Check DATABASE_URL is correct in `.env`
- Make sure you copied `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)
- Verify Vercel database is active in Dashboard → Storage

### Issue: "No buses showing on map"
**Solution:**
- Check Vercel logs: Dashboard → Functions → `/api/buses`
- Verify seed ran: `npx prisma studio` → check Transporte table
- Test API: `curl https://your-app.vercel.app/api/buses`

### Issue: "USSD returns 'Nenhuma rota encontrada'"
**Solution:**
- Verify routes exist: `npx prisma studio` → Via table
- Check location mapping in `app/api/ussd/route.ts`
- Test locally first before testing on Africa's Talking

### Issue: "Migration failed"
**Solution:**
- Delete `prisma/migrations` folder
- Run `npx prisma migrate dev --name init` again
- Check PostgreSQL connection string is correct

---

## 📚 Reference Documents

- **POSTGRESQL_SETUP_GUIDE.md** - Detailed step-by-step guide
- **DATABASE_URL_SETUP.md** - Quick reference for database URLs
- **SYSTEM_ARCHITECTURE.md** - How everything connects
- **VERCEL_DEPLOYMENT_COMPLETE.md** - Deployment checklist

---

## 🎉 You're Done!

Your transport tracking system is now fully operational with:
- ✅ Cloud database (PostgreSQL)
- ✅ USSD service (Africa's Talking)
- ✅ Web app (Vercel)
- ✅ Admin panel (local)
- ✅ All systems integrated and sharing data

**Next Steps:**
1. Monitor Vercel logs for any errors
2. Test USSD from multiple phones
3. Add more routes via admin panel
4. Consider adding real-time GPS tracking

Need help? Check the troubleshooting section or refer to the detailed guides!
