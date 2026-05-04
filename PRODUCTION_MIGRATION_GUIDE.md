# Moving from Sandbox to Production - Complete Guide

## 🎯 Overview
You've created a production app in Africa's Talking. Here's what you need to do to migrate from sandbox to production.

---

## 📋 Step-by-Step Migration

### Step 1: Get Your Production Credentials ✅

From your Africa's Talking production app dashboard, get:

1. **Username** (Your app name, NOT "sandbox")
   - Example: `TransportMZ` or `MyAppName`
   - Found in: Dashboard → Settings → Username

2. **API Key** (Production API key)
   - Found in: Dashboard → Settings → API Key
   - Starts with `atsk_`
   - **Important:** This is different from sandbox key

3. **Service Code** (Your production USSD code)
   - Example: `*384*123#` or your assigned code
   - Found in: Dashboard → USSD → Service Codes

---

### Step 2: Update Your .env File 🔧

Open `transport-client/.env` and update:

```env
# Database - shared with admin app (absolute path)
DATABASE_URL="file:C:/Projectos externos/Transports Aplication/transport-admin/prisma/dev.db"

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key-here"

# Africa's Talking API Credentials - PRODUCTION
AFRICASTALKING_USERNAME="YOUR_APP_USERNAME_HERE"
AFRICASTALKING_API_KEY="YOUR_PRODUCTION_API_KEY_HERE"
```

**Replace:**
- `YOUR_APP_USERNAME_HERE` → Your production app username (e.g., `TransportMZ`)
- `YOUR_PRODUCTION_API_KEY_HERE` → Your production API key

**Example:**
```env
AFRICASTALKING_USERNAME="TransportMZ"
AFRICASTALKING_API_KEY="atsk_abc123def456..."
```

---

### Step 3: Configure Production USSD Service 📱

In your Africa's Talking production dashboard:

#### 3.1 Go to USSD Section
- Navigate to: **USSD** → **Service Codes**

#### 3.2 Create/Configure Your USSD Service
- **Service Code:** Your assigned code (e.g., `*384*123#`)
- **Callback URL:** Your production server URL
  - **Development:** `https://your-ngrok-url.ngrok-free.app/api/ussd`
  - **Production:** `https://yourdomain.com/api/ussd`
- **Method:** `POST`

#### 3.3 Important Settings
- **Timeout:** 30 seconds (recommended)
- **Max Sessions:** As needed for your traffic
- **Status:** Active ✅

---

### Step 4: Deploy to Production Server 🚀

You have two options:

#### Option A: Keep Using ngrok (Development/Testing)
```bash
# Terminal 1: Start your server
cd transport-client
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
# Update callback URL in Africa's Talking dashboard
```

**Pros:**
- ✅ Quick setup
- ✅ Good for testing
- ✅ No server needed

**Cons:**
- ❌ URL changes every restart (unless you have paid ngrok)
- ❌ Not suitable for production
- ❌ Server must be running on your computer

#### Option B: Deploy to Production Server (Recommended)
Deploy to a cloud provider:

**Popular Options:**
1. **Vercel** (Easiest for Next.js)
   ```bash
   npm install -g vercel
   cd transport-client
   vercel
   ```
   - Free tier available
   - Automatic HTTPS
   - Easy deployment

2. **Railway** (Good for full-stack)
   - Connect GitHub repo
   - Automatic deployments
   - Free tier available

3. **DigitalOcean/AWS/Azure** (Full control)
   - More complex setup
   - Full server control
   - Requires server management

4. **Heroku** (Simple deployment)
   - Easy setup
   - Free tier available
   - Good for Node.js apps

---

### Step 5: Update Callback URL 🔗

After deploying, update your callback URL in Africa's Talking:

**Format:**
```
https://your-production-domain.com/api/ussd
```

**Examples:**
- Vercel: `https://transport-app.vercel.app/api/ussd`
- Railway: `https://transport-app.up.railway.app/api/ussd`
- Custom domain: `https://transport.mz/api/ussd`
- ngrok (dev): `https://abc123.ngrok-free.app/api/ussd`

---

### Step 6: Test Production Environment 🧪

#### 6.1 Test with Simulator First
1. Go to: https://simulator.africastalking.com/
2. Select **Production** environment
3. Enter your production service code
4. Test all menu flows

#### 6.2 Test with Real Phone
1. Dial your production USSD code (e.g., `*384*123#`)
2. Test all features:
   - ✅ Find Transport Now
   - ✅ Search Routes
   - ✅ Nearest Stops
   - ✅ Calculate Fare
   - ✅ Help

#### 6.3 Monitor Logs
Check your server logs for:
- Incoming requests
- Response times
- Any errors

---

## 🔐 Security Checklist

### Environment Variables
- [ ] Production API key in `.env`
- [ ] `.env` file in `.gitignore`
- [ ] Never commit API keys to Git
- [ ] Use environment variables in production server

### Server Security
- [ ] HTTPS enabled (required by Africa's Talking)
- [ ] CORS configured if needed
- [ ] Rate limiting implemented (optional)
- [ ] Error logging enabled

### Database
- [ ] Database backed up
- [ ] Production database separate from development
- [ ] Database connection secure

---

## 📊 Differences: Sandbox vs Production

| Feature | Sandbox | Production |
|---------|---------|------------|
| **Username** | `sandbox` | Your app name |
| **API Key** | Sandbox key | Production key |
| **Phone Numbers** | Test numbers only | Real phone numbers |
| **SMS Cost** | Free | Charged per SMS |
| **USSD Code** | Test code | Your assigned code |
| **Reliability** | Testing only | Production-ready |
| **Support** | Limited | Full support |

---

## 💰 Production Costs

### USSD
- **Incoming requests:** Usually free or very low cost
- **Outgoing responses:** Included in USSD session
- **Cost model:** Per session or monthly fee (check with Africa's Talking)

### SMS (Future Feature)
- **Cost:** Per SMS sent
- **Pricing:** Varies by country (check Africa's Talking pricing)
- **Example:** ~$0.01 - $0.05 per SMS in Mozambique

### Voice & Airtime (Future Features)
- **Voice:** Per minute
- **Airtime:** Transaction fee
- **Check:** Africa's Talking pricing page

---

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid Credentials"
**Cause:** Wrong username or API key
**Solution:** 
- Verify username matches your app name (not "sandbox")
- Check API key is from production app
- Ensure no extra spaces in .env file

### Issue 2: "Callback URL Not Reachable"
**Cause:** Server not accessible or wrong URL
**Solution:**
- Test URL in browser: `https://your-url.com/api/ussd`
- Ensure HTTPS (not HTTP)
- Check server is running
- Verify firewall allows incoming requests

### Issue 3: "Service Code Not Found"
**Cause:** USSD code not configured or inactive
**Solution:**
- Check service code in Africa's Talking dashboard
- Ensure status is "Active"
- Verify callback URL is set

### Issue 4: "Session Timeout"
**Cause:** Server response too slow
**Solution:**
- Optimize database queries
- Add caching if needed
- Increase timeout in Africa's Talking settings

### Issue 5: ngrok URL Changes
**Cause:** Free ngrok URLs change on restart
**Solution:**
- Use paid ngrok for persistent URLs
- Or deploy to production server (Vercel, Railway, etc.)

---

## 📝 Production Deployment Checklist

### Before Going Live
- [ ] Production credentials configured in `.env`
- [ ] Server deployed to production (or ngrok running)
- [ ] Callback URL updated in Africa's Talking
- [ ] USSD service code active
- [ ] Database populated with real data
- [ ] All features tested in simulator
- [ ] Tested with real phone number
- [ ] Error logging enabled
- [ ] Monitoring setup (optional)

### After Going Live
- [ ] Monitor server logs for errors
- [ ] Check USSD session success rate
- [ ] Monitor response times
- [ ] Collect user feedback
- [ ] Plan for scaling if needed

---

## 🎯 Quick Start Commands

### Update .env File
```bash
# Open .env file
code transport-client/.env

# Update these lines:
AFRICASTALKING_USERNAME="YourAppName"
AFRICASTALKING_API_KEY="your_production_api_key"
```

### Restart Server (if running)
```bash
# Stop current server (Ctrl+C)
# Then restart:
cd transport-client
npm run dev
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd transport-client
vercel

# Follow prompts to deploy
# Copy the production URL
# Update callback URL in Africa's Talking
```

---

## 📞 Support Resources

### Africa's Talking
- **Dashboard:** https://account.africastalking.com/
- **Documentation:** https://developers.africastalking.com/
- **Support:** support@africastalking.com
- **Community:** https://help.africastalking.com/

### Your System
- **Server Logs:** Check terminal output
- **Database:** Check `transport-admin/prisma/dev.db`
- **Documentation:** See all `.md` files in project root

---

## ✅ Summary

### What You Need to Do:

1. **Get production credentials** from Africa's Talking dashboard
   - Username (your app name)
   - API Key (production key)
   - Service Code (your USSD code)

2. **Update `.env` file** with production credentials
   ```env
   AFRICASTALKING_USERNAME="YourAppName"
   AFRICASTALKING_API_KEY="your_production_key"
   ```

3. **Deploy your server** (or keep using ngrok for testing)
   - Vercel (recommended)
   - Railway
   - Or keep ngrok running

4. **Configure USSD service** in Africa's Talking
   - Set callback URL
   - Activate service code

5. **Test everything**
   - Simulator first
   - Then real phone

### That's It! 🎉

Your USSD system will now work with real phone numbers in production.

---

**Need Help?** Check the troubleshooting section or contact Africa's Talking support.

**Status:** 📋 Ready to migrate to production
**Next Step:** Update your `.env` file with production credentials
