# 🚀 PostgreSQL Setup Guide - Complete Integration

This guide will help you set up PostgreSQL so that **BOTH** the USSD service and web app can access the same database.

---

## 📋 Overview

After this setup:
- ✅ Web app on Vercel will show all buses on the map
- ✅ USSD service will query the same database for routes and transport info
- ✅ Admin panel can manage buses, routes, and stops
- ✅ All three systems share the same data in real-time

---

## STEP 1: Create PostgreSQL Database on Vercel

### 1.1 Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: **transport-tracking-system**
3. Click on the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Name it: `transport-db`
7. Select region: **Washington, D.C., USA (iad1)** (closest to Africa)
8. Click **Create**

### 1.2 Get Connection String
After creation, Vercel will show you environment variables. You'll see:
```
POSTGRES_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb"
```

**IMPORTANT:** Copy the `POSTGRES_PRISMA_URL` value - this is what you'll use!

---

## STEP 2: Update Local Environment Files

### 2.1 Update `transport-client/.env`

**BEFORE:**
```env
DATABASE_URL="file:C:/Projectos externos/Transports Aplication/transport-admin/prisma/dev.db"
```

**AFTER:**
```env
# PostgreSQL Database (Vercel)
DATABASE_URL="<paste-your-POSTGRES_PRISMA_URL-here>"

# Example:
# DATABASE_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
```

### 2.2 Update `transport-admin/.env`

**BEFORE:**
```env
DATABASE_URL="file:./prisma/dev.db"
```

**AFTER:**
```env
# PostgreSQL Database (Vercel) - SAME as transport-client
DATABASE_URL="<paste-your-POSTGRES_PRISMA_URL-here>"
```

**CRITICAL:** Both `.env` files must have the **EXACT SAME** `DATABASE_URL` so they share the database!

---

## STEP 3: Update Vercel Environment Variables

### 3.1 Add Environment Variables in Vercel

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

Add/Update these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `<your-POSTGRES_PRISMA_URL>` | Already added by Vercel |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `<your-api-key>` | For maps |
| `AFRICASTALKING_USERNAME` | `sandbox` | For USSD |
| `AFRICASTALKING_API_KEY` | `<your-api-key>` | For USSD |
| `TELERIVET_SECRET` | `TransportUSSD2024SecureKey` | Optional |

**Make sure to set for:** Production, Preview, and Development

---

## STEP 4: Run Database Migrations

Now we'll create the database tables in PostgreSQL.

### 4.1 Install Dependencies (if needed)
```bash
cd transport-client
npm install
```

### 4.2 Generate Prisma Client
```bash
npx prisma generate
```

### 4.3 Create Migration
```bash
npx prisma migrate dev --name init_postgresql
```

This will:
- Create all tables in PostgreSQL
- Generate migration files
- Update Prisma Client

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "verceldb"

PostgreSQL database created at xxxxx.postgres.vercel-storage.com:5432

Applying migration `20240504000000_init_postgresql`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240504000000_init_postgresql/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client
```

---

## STEP 5: Seed the Database

Now let's add all the transport data (routes, buses, stops).

### 5.1 Check Seed File
Make sure `transport-client/prisma/seed.ts` exists and has the seed data.

### 5.2 Run Seed
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

### 5.3 Verify Data
```bash
npx prisma studio
```

This opens a web interface where you can see all your data. Check:
- ✅ 18 routes in `Via` table
- ✅ 32 stops in `Paragem` table
- ✅ 25 buses in `Transporte` table

---

## STEP 6: Update Admin Panel

The admin panel also needs to use PostgreSQL.

### 6.1 Navigate to Admin
```bash
cd ../transport-admin
```

### 6.2 Install Dependencies
```bash
npm install
```

### 6.3 Generate Prisma Client
```bash
npx prisma generate
```

### 6.4 Run Migration (if needed)
```bash
npx prisma migrate deploy
```

**Note:** Since both apps share the same database, the tables already exist. This just syncs the schema.

---

## STEP 7: Test Locally

### 7.1 Test Client App
```bash
cd transport-client
npm run dev
```

Visit: http://localhost:3000

**Expected:**
- ✅ Map loads
- ✅ Shows "25 autocarros" in top-left
- ✅ Buses appear on map
- ✅ Click bus to see route

### 7.2 Test USSD Endpoint
```bash
# In PowerShell
$body = @{sessionId='test123'; serviceCode='*384*123#'; phoneNumber='+258867570587'; text=''}
Invoke-WebRequest -Uri 'http://localhost:3000/api/ussd' -Method POST -Body $body -ContentType 'application/x-www-form-urlencoded' -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected output:**
```
CON Bem-vindo ao Sistema de Transportes
1. Encontrar Transporte Agora
2. Procurar Rotas
3. Paragens Próximas
4. Calcular Tarifa
5. Ajuda
```

### 7.3 Test Route Search
```bash
$body = @{sessionId='test123'; serviceCode='*384*123#'; phoneNumber='+258867570587'; text='2*1'}
Invoke-WebRequest -Uri 'http://localhost:3000/api/ussd' -Method POST -Body $body -ContentType 'application/x-www-form-urlencoded' -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected:** Should show routes from Matola

---

## STEP 8: Deploy to Vercel

### 8.1 Commit Changes
```bash
cd transport-client
git add .
git commit -m "Switch to PostgreSQL for production deployment"
git push origin main
```

### 8.2 Vercel Auto-Deploy
Vercel will automatically:
- Detect the push
- Build the app
- Deploy to production
- Use the PostgreSQL database

### 8.3 Monitor Deployment
1. Go to Vercel Dashboard → Deployments
2. Watch the build logs
3. Wait for "Ready" status

---

## STEP 9: Verify Production

### 9.1 Test Web App
Visit: https://transport-tracking-system-xltm.vercel.app/

**Expected:**
- ✅ Map loads
- ✅ Shows "25 autocarros"
- ✅ Buses appear on map

### 9.2 Test USSD API
```bash
$body = @{sessionId='test123'; serviceCode='*384*123#'; phoneNumber='+258867570587'; text=''}
Invoke-WebRequest -Uri 'https://transport-tracking-system-xltm.vercel.app/api/ussd' -Method POST -Body $body -ContentType 'application/x-www-form-urlencoded' -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected:** Same USSD menu as local test

### 9.3 Test Buses API
```bash
Invoke-WebRequest -Uri 'https://transport-tracking-system-xltm.vercel.app/api/buses' -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected:** JSON with 25 buses

---

## STEP 10: Update Africa's Talking

Now that everything works, update your USSD callback URL.

### 10.1 Login to Africa's Talking
Visit: https://account.africastalking.com/

### 10.2 Update Callback URL
1. Go to **USSD** section
2. Find your service code
3. Update **Callback URL** to:
   ```
   https://transport-tracking-system-xltm.vercel.app/api/ussd
   ```
4. Click **Save**

### 10.3 Test USSD from Phone
Dial your USSD code (e.g., `*384*123#`)

**Expected:**
```
Bem-vindo ao Sistema de Transportes
1. Encontrar Transporte Agora
2. Procurar Rotas
3. Paragens Próximas
4. Calcular Tarifa
5. Ajuda
```

---

## 🎯 How USSD and Web App Communicate

### Shared Database Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                     │
│              (Vercel Postgres - Cloud)                   │
│                                                          │
│  Tables: Via, Paragem, Transporte, GeoLocation, etc.   │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Web App    │  │ USSD Service │  │ Admin Panel  │
│   (Vercel)   │  │   (Vercel)   │  │   (Local)    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
   Users see         Users dial        Admin manages
   buses on map      USSD code         routes & buses
```

### Real-Time Data Flow

1. **Admin adds a new bus** → Saved to PostgreSQL
2. **Web app queries `/api/buses`** → Reads from PostgreSQL → Shows on map
3. **User dials USSD** → `/api/ussd` queries PostgreSQL → Returns transport info
4. **All three see the same data instantly!**

### Example: User Finds Transport via USSD

```
User dials: *384*123#
↓
Africa's Talking → POST to /api/ussd
↓
USSD Handler queries PostgreSQL:
  - searchRoutes('Matola')
  - findTransportInfo('Matola', 'Baixa')
↓
Returns: Bus info (ID, location, ETA, fare)
↓
User sees: "AUTOCARRO: Mercedes Benz Sprinter - AAA-123-MZ"
```

### Example: User Views Map

```
User visits: https://transport-tracking-system-xltm.vercel.app/
↓
Browser → GET /api/buses
↓
API queries PostgreSQL:
  - SELECT * FROM Transporte
  - JOIN Via, Paragem, GeoLocation
↓
Returns: JSON with 25 buses
↓
Map displays all buses with routes
```

---

## 🔍 Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
1. Check DATABASE_URL is correct in `.env`
2. Make sure you're using `POSTGRES_PRISMA_URL` (with pgbouncer)
3. Check Vercel database is active

### Issue: "No buses showing on map"

**Solution:**
1. Check Vercel logs: Dashboard → Functions → `/api/buses`
2. Verify seed ran successfully: `npx prisma studio`
3. Test API directly: `curl https://your-app.vercel.app/api/buses`

### Issue: "USSD returns 'Nenhuma rota encontrada'"

**Solution:**
1. Check database has routes: `npx prisma studio` → Via table
2. Verify location mapping in `ussd/route.ts`
3. Test locally first before testing on Africa's Talking

### Issue: "Migration failed"

**Solution:**
1. Delete `prisma/migrations` folder
2. Run `npx prisma migrate dev --name init` again
3. If still fails, check PostgreSQL connection string

---

## 📊 Database Schema Summary

### Key Tables for USSD & Web App

| Table | Purpose | Used By |
|-------|---------|---------|
| `Via` | Routes (e.g., Matola → Baixa) | USSD, Web, Admin |
| `Paragem` | Stops/Terminals | USSD, Web, Admin |
| `Transporte` | Buses | Web (map), Admin |
| `ViaParagem` | Route stops | USSD (route search) |
| `GeoLocation` | Bus GPS history | Web (tracking) |
| `Utente` | Users | Web (auth) |
| `MISSION` | User saved routes | Web (my routes) |

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] PostgreSQL database created on Vercel
- [ ] Both `.env` files updated with same DATABASE_URL
- [ ] Prisma schema updated to `postgresql`
- [ ] Migrations ran successfully
- [ ] Database seeded with 18 routes, 32 stops, 25 buses
- [ ] Local web app shows buses on map
- [ ] Local USSD endpoint returns menu
- [ ] Code pushed to GitHub
- [ ] Vercel deployed successfully
- [ ] Production web app shows buses
- [ ] Production USSD API works
- [ ] Africa's Talking callback URL updated
- [ ] USSD works from phone

---

## 🎉 You're Done!

Your system is now fully integrated:
- ✅ USSD service queries live database
- ✅ Web app displays real-time bus locations
- ✅ Admin panel manages all data
- ✅ All three systems share the same PostgreSQL database

**Next Steps:**
1. Test USSD from your phone
2. Monitor Vercel logs for any errors
3. Add more routes and buses via admin panel
4. Consider adding real-time GPS updates

Need help? Check the troubleshooting section or ask for assistance!
