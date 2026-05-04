# Quick Reference - Transport Tracking System

## 🚀 Quick Start

```bash
# Start development server
cd transport-client
npm run dev
# Visit: http://localhost:3000

# View database
npx prisma studio

# Verify database
npx tsx scripts/verify-prisma.ts

# Reseed database
npm run db:seed
```

## 📊 Database Status

- **Type:** Prisma Postgres (PostgreSQL)
- **Status:** ✅ Operational and seeded
- **Buses:** 25
- **Routes:** 18
- **Stops:** 32

## 🔗 Important URLs

### Local
- **Web App:** http://localhost:3000
- **API:** http://localhost:3000/api/buses
- **Prisma Studio:** http://localhost:5555

### Production
- **Web App:** https://transport-tracking-system-xltm.vercel.app/
- **API:** https://transport-tracking-system-xltm.vercel.app/api/buses
- **Status:** ⚠️ Needs DATABASE_URL update

## 🔧 Fix Production (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project → Settings → Environment Variables
3. Add:
   ```
   DATABASE_URL=postgres://a07ae726389b1d015dd3ead98a84066a11a37dcaaea8ca0704b239a844b4d38f:sk_0Aa21GuPYQLsvv08V8jZI@pooled.db.prisma.io:5432/postgres?sslmode=require
   ```
4. Redeploy

## 📱 USSD Endpoints

- **Africa's Talking:** `/api/ussd`
- **Telerivet:** `/api/ussd-telerivet`

Update webhooks to:
```
https://transport-tracking-system-xltm.vercel.app/api/ussd
```

## 🐛 Troubleshooting

### Map shows 0 buses?
```bash
# Check API
curl http://localhost:3000/api/buses

# Regenerate Prisma Client
npx prisma generate

# Restart server
npm run dev
```

### Database connection error?
```bash
# Verify connection
npx tsx scripts/verify-prisma.ts

# Check .env file
cat .env | grep DATABASE_URL
```

## 📝 Key Commands

```bash
# Prisma
npx prisma studio          # Open database GUI
npx prisma generate        # Regenerate client
npx prisma migrate dev     # Create migration
npx prisma migrate deploy  # Deploy migration
npx prisma db seed         # Seed database

# Development
npm run dev                # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Verification
npx tsx scripts/verify-prisma.ts  # Test database
```

## 🔑 Environment Variables

```env
# Required
DATABASE_URL="postgres://...@pooled.db.prisma.io:5432/postgres"

# Optional (for USSD)
AFRICASTALKING_USERNAME="your-username"
AFRICASTALKING_API_KEY="your-api-key"
TELERIVET_SECRET="your-secret"

# Optional (for maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-key"
```

## 📚 Documentation Files

- `SETUP_COMPLETE_SUMMARY.md` - Full setup documentation
- `PRISMA_POSTGRES_SETUP_COMPLETE.md` - Database migration details
- `VERCEL_UPDATE_GUIDE.md` - Production deployment guide
- `QUICK_REFERENCE.md` - This file

## ✅ Checklist

### Local Development
- [x] Database migrated to Prisma Postgres
- [x] Database seeded with 25 buses
- [x] All API routes updated
- [x] Verification script created
- [x] Local development working

### Production Deployment
- [ ] DATABASE_URL added to Vercel
- [ ] Application redeployed
- [ ] Buses visible on map
- [ ] USSD webhooks updated
- [ ] End-to-end testing complete

## 🆘 Need Help?

1. Check browser console for errors
2. Check Vercel logs: `vercel logs`
3. Test API endpoints directly
4. Run verification script
5. Review documentation files

---

**Status:** Local ✅ | Production ⚠️ (needs DATABASE_URL)
**Next Step:** Update Vercel environment variables
