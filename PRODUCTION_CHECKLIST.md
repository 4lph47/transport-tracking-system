# Production Migration - Quick Checklist ✅

## 🎯 What You Need from Africa's Talking Dashboard

### 1. Get Your Production Credentials
Go to your Africa's Talking production app dashboard and get:

- [ ] **Username** (Your app name, e.g., "TransportMZ")
  - Location: Dashboard → Settings → Username
  - ⚠️ NOT "sandbox"

- [ ] **API Key** (Production key starting with `atsk_`)
  - Location: Dashboard → Settings → API Key
  - ⚠️ Different from sandbox key

- [ ] **Service Code** (Your USSD code, e.g., `*384*123#`)
  - Location: Dashboard → USSD → Service Codes
  - ⚠️ Your assigned production code

---

## 🔧 Configuration Steps

### 2. Update Your .env File
```bash
# Open the file
code transport-client/.env
```

**Change these lines:**
```env
# FROM (Sandbox):
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="atsk_efab8c78d30d66aca71223167c9887c7b362b9e4037b365f8d8dca2c9965a5046400e070"

# TO (Production):
AFRICASTALKING_USERNAME="YourAppName"
AFRICASTALKING_API_KEY="your_production_api_key_here"
```

- [ ] Username updated to your app name
- [ ] API key updated to production key
- [ ] File saved

---

### 3. Choose Deployment Option

#### Option A: Keep Using ngrok (Quick Testing)
```bash
# Terminal 1
cd transport-client
npm run dev

# Terminal 2
ngrok http 3000
```
- [ ] ngrok running
- [ ] Copy HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

**Callback URL:** `https://your-ngrok-url.ngrok-free.app/api/ussd`

#### Option B: Deploy to Vercel (Recommended for Production)
```bash
npm install -g vercel
cd transport-client
vercel
```
- [ ] Vercel CLI installed
- [ ] Project deployed
- [ ] Copy production URL (e.g., `https://transport-app.vercel.app`)

**Callback URL:** `https://your-vercel-url.vercel.app/api/ussd`

---

### 4. Configure USSD in Africa's Talking

Go to: **Dashboard → USSD → Service Codes**

- [ ] Service Code: Your production code (e.g., `*384*123#`)
- [ ] Callback URL: Your server URL + `/api/ussd`
- [ ] Method: `POST`
- [ ] Status: `Active` ✅
- [ ] Settings saved

---

### 5. Test Your Production Setup

#### Test with Simulator
- [ ] Go to: https://simulator.africastalking.com/
- [ ] Select: **Production** environment
- [ ] Enter your service code
- [ ] Test all menu options:
  - [ ] 1. Find Transport Now
  - [ ] 2. Search Routes
  - [ ] 3. Nearest Stops
  - [ ] 4. Calculate Fare
  - [ ] 5. Help

#### Test with Real Phone
- [ ] Dial your production USSD code
- [ ] Test complete flow
- [ ] Verify no emojis appear
- [ ] Check all information displays correctly

---

## 🚨 Troubleshooting

### If USSD doesn't work:

**Check 1: Credentials**
- [ ] Username is NOT "sandbox"
- [ ] API key is from production app
- [ ] No extra spaces in .env

**Check 2: Server**
- [ ] Server is running
- [ ] URL is accessible (test in browser)
- [ ] URL uses HTTPS (not HTTP)

**Check 3: Africa's Talking**
- [ ] Service code is active
- [ ] Callback URL is correct
- [ ] Method is POST

**Check 4: Logs**
- [ ] Check server terminal for errors
- [ ] Check Africa's Talking logs in dashboard

---

## 📊 Quick Reference

### Sandbox vs Production

| Item | Sandbox | Production |
|------|---------|------------|
| Username | `sandbox` | Your app name |
| API Key | Sandbox key | Production key |
| Phone Numbers | Test only | Real numbers |
| USSD Code | Test code | Your assigned code |

### Your Current Setup

**Before (Sandbox):**
```env
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="atsk_efab..."
```

**After (Production):**
```env
AFRICASTALKING_USERNAME="________"  ← Fill this
AFRICASTALKING_API_KEY="________"   ← Fill this
```

---

## ✅ Final Checklist

Before going live:
- [ ] Production credentials in `.env`
- [ ] Server deployed and running
- [ ] Callback URL configured in Africa's Talking
- [ ] USSD service active
- [ ] Tested in simulator
- [ ] Tested with real phone
- [ ] All features working
- [ ] No errors in logs

---

## 🎉 You're Ready!

Once all checkboxes are ticked, your USSD system is live in production!

**Next Steps:**
1. Monitor usage
2. Collect user feedback
3. Plan future features (SMS notifications, real GPS, etc.)

---

**Need Help?** See `PRODUCTION_MIGRATION_GUIDE.md` for detailed instructions.
