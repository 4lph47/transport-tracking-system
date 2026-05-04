# Environment Variables Setup Guide

## Overview

This guide explains how to configure environment variables for the Transport Tracking System.

## ✅ Current Status

Both `.env` files have been updated with:
- ✅ Prisma Postgres connection string
- ✅ Africa's Talking USSD credentials (sandbox)
- ✅ Telerivet webhook secret
- ✅ Proper formatting and comments

## 📁 Files Structure

```
transport-client/
├── .env                 # ✅ Configured (DO NOT COMMIT)
└── .env.example         # ✅ Template for developers

transport-admin/
├── .env                 # ✅ Configured (DO NOT COMMIT)
└── .env.example         # ✅ Template for developers

.gitignore               # ✅ Properly ignores .env files
```

## 🔐 Security

### ✅ Protected
- `.env` files are in `.gitignore`
- Connection strings contain credentials
- API keys are not exposed in code

### ⚠️ Important
- **NEVER** commit `.env` files to Git
- **NEVER** share connection strings publicly
- **ALWAYS** use environment variables in Vercel Dashboard
- **ROTATE** credentials if they're ever exposed

## 📝 Environment Variables Explained

### transport-client/.env

```env
# DATABASE_URL
# - Prisma Postgres connection string
# - Shared between client and admin apps
# - Contains credentials (keep secret!)
DATABASE_URL="postgres://..."

# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# - Optional: For enhanced map features
# - Get from: https://console.cloud.google.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key-here"

# AFRICASTALKING_USERNAME & AFRICASTALKING_API_KEY
# - For USSD integration
# - Use "sandbox" for testing
# - Get from: https://account.africastalking.com
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="atsk_..."

# TELERIVET_SECRET
# - Webhook secret for Telerivet USSD
# - Get from: https://telerivet.com
TELERIVET_SECRET="TransportUSSD2024SecureKey"
```

### transport-admin/.env

```env
# DATABASE_URL
# - Same as client app (shared database)
DATABASE_URL="postgres://..."

# NEXTAUTH_SECRET
# - For future authentication implementation
# - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"

# NEXTAUTH_URL
# - Admin panel URL
NEXTAUTH_URL="http://localhost:3001"
```

## 🚀 Setup Instructions

### For New Developers

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd transport-tracking-system
   ```

2. **Copy example files**
   ```bash
   # Client app
   cd transport-client
   cp .env.example .env
   
   # Admin app
   cd ../transport-admin
   cp .env.example .env
   ```

3. **Get credentials**
   - **Prisma Postgres:** Contact project admin or create new database at https://console.prisma.io
   - **Africa's Talking:** Sign up at https://africastalking.com (use sandbox for testing)
   - **Telerivet:** Sign up at https://telerivet.com (optional)
   - **Google Maps:** Get API key from https://console.cloud.google.com (optional)

4. **Update .env files**
   - Replace placeholder values with actual credentials
   - Keep the file secure and never commit it

5. **Install dependencies**
   ```bash
   cd transport-client
   npm install
   
   cd ../transport-admin
   npm install
   ```

6. **Generate Prisma Client**
   ```bash
   cd transport-client
   npx prisma generate
   ```

7. **Run migrations** (if needed)
   ```bash
   npx prisma migrate dev
   ```

8. **Seed database** (if needed)
   ```bash
   npm run db:seed
   ```

9. **Start development**
   ```bash
   npm run dev
   ```

## 🌐 Production (Vercel)

### Setting Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

#### Required Variables
```
DATABASE_URL=postgres://...@pooled.db.prisma.io:5432/postgres?sslmode=require
```

#### Optional Variables (for USSD)
```
AFRICASTALKING_USERNAME=your-username
AFRICASTALKING_API_KEY=your-api-key
TELERIVET_SECRET=your-secret
```

#### Optional Variables (for Maps)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

5. **Select environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. **Redeploy** after adding variables

### Vercel CLI Method

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Add new variable
vercel env add DATABASE_URL

# Deploy
vercel --prod
```

## 🔄 Switching Environments

### Development (Local)
```env
DATABASE_URL="postgres://...@pooled.db.prisma.io:5432/postgres"
AFRICASTALKING_USERNAME="sandbox"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel)
```env
DATABASE_URL="postgres://...@pooled.db.prisma.io:5432/postgres"
AFRICASTALKING_USERNAME="Overlord"  # Production username
NEXTAUTH_URL="https://your-app.vercel.app"
```

## 🧪 Testing Environment Variables

### Test Database Connection
```bash
cd transport-client
npx tsx scripts/verify-prisma.ts
```

Expected output:
```
✅ Connected to Prisma Postgres
📊 Database Statistics:
   - Transportes: 25
   - Vias: 18
   - Paragens: 32
```

### Test API Endpoints
```bash
# Start server
npm run dev

# Test in another terminal
curl http://localhost:3000/api/buses
```

### Test USSD (with ngrok)
```bash
# Start ngrok
ngrok http 3000

# Update webhook URL in Africa's Talking/Telerivet
# Test by dialing your USSD code
```

## 🐛 Troubleshooting

### "DATABASE_URL is not defined"
- Check if `.env` file exists
- Verify `DATABASE_URL` is in the file
- Restart the development server

### "Invalid connection string"
- Check for typos in the connection string
- Ensure no extra spaces or line breaks
- Verify the format: `postgres://user:pass@host:port/db`

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Cannot connect to database"
- Check internet connection (Prisma Postgres is cloud-hosted)
- Verify connection string is correct
- Check if database is active in Prisma Console

### Environment variables not loading in Vercel
- Verify variables are added in Vercel Dashboard
- Check they're enabled for the correct environment
- Redeploy after adding variables
- Check Vercel logs: `vercel logs`

## 📋 Checklist

### Local Development
- [ ] `.env` file created from `.env.example`
- [ ] `DATABASE_URL` configured
- [ ] Prisma Client generated
- [ ] Database connection verified
- [ ] Development server starts successfully

### Production Deployment
- [ ] Environment variables added to Vercel
- [ ] Variables enabled for Production environment
- [ ] Application redeployed
- [ ] Production site loads correctly
- [ ] API endpoints return data

### USSD Integration
- [ ] Africa's Talking credentials configured
- [ ] Webhook URL updated
- [ ] USSD flow tested
- [ ] Data syncs with web app

## 🔗 Resources

- **Prisma Postgres:** https://www.prisma.io/postgres
- **Vercel Environment Variables:** https://vercel.com/docs/environment-variables
- **Africa's Talking:** https://africastalking.com/docs
- **Telerivet:** https://telerivet.com/api/webhook/receiving
- **Next.js Environment Variables:** https://nextjs.org/docs/basic-features/environment-variables

## 📞 Support

If you encounter issues:
1. Check this guide
2. Review error messages carefully
3. Check Vercel logs: `vercel logs`
4. Verify environment variables in Vercel Dashboard
5. Test locally first before deploying

---

**Last Updated:** April 30, 2026
**Status:** ✅ Configured and Verified
