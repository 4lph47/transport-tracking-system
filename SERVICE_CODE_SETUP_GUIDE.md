# USSD Service Code Setup Guide

## 🎯 What is a Service Code?

A **service code** is the number users dial to access your USSD application.

**Examples:**
- `*384*123#` - Your transport system
- `*150#` - Mobile money
- `*100#` - Check balance
- `*123#` - Customer service

**Format:** `*XXX#` or `*XXX*YYY#`

---

## 🔧 How to Get/Setup a Service Code

### For Sandbox (Testing)

#### Step 1: Go to Africa's Talking Dashboard
1. Login: https://account.africastalking.com/
2. Select: **Sandbox** environment
3. Navigate to: **USSD** → **Service Codes**

#### Step 2: Create a Service Code
You'll see a default sandbox code or can create one:

**Typical Sandbox Codes:**
- `*384*123#` (example)
- `*384*XXX#` (where XXX is your choice)

**Configuration:**
```
Service Code: *384*123#
Callback URL: https://your-ngrok-url.ngrok-free.app/api/ussd
Method: POST
Status: Active
```

#### Step 3: Test
- Use simulator: https://simulator.africastalking.com/
- Or dial from test phone numbers

---

### For Production (Real Users)

#### Step 1: Apply for a Service Code

**Option A: Shared Code (Cheaper/Faster)**
- Format: `*XXX*YYY#` (e.g., `*384*123#`)
- You get a sub-code under a shared main code
- **Cost:** Lower monthly fee
- **Setup time:** Usually instant or few hours
- **Best for:** Startups, testing, small scale

**Option B: Dedicated Code (Premium)**
- Format: `*XXX#` (e.g., `*123#`)
- You own the entire code
- **Cost:** Higher monthly fee
- **Setup time:** Can take days/weeks (requires telco approval)
- **Best for:** Large companies, banks, established services

#### Step 2: Request Through Africa's Talking

1. **Login to Dashboard:** https://account.africastalking.com/
2. **Go to:** USSD → Service Codes
3. **Click:** "Request New Service Code"
4. **Fill Form:**
   - Service name: "Transport System"
   - Description: "Public transport information system"
   - Type: Shared or Dedicated
   - Country: Mozambique
   - Preferred code: (suggest a code, e.g., `*384*123#`)

5. **Submit and Wait:**
   - Shared codes: Usually approved quickly
   - Dedicated codes: May take time for telco approval

#### Step 3: Configure Your Service Code

Once approved, configure it:

```
Service Code: *384*123# (your assigned code)
Callback URL: https://yourdomain.com/api/ussd
Method: POST
Timeout: 30 seconds
Status: Active
```

---

## 📱 Service Code Types

### 1. Shared Service Code
**Format:** `*XXX*YYY#`

**Example:** `*384*123#`
- `*384` = Main code (shared with others)
- `123` = Your unique sub-code

**Pros:**
- ✅ Cheaper
- ✅ Faster approval
- ✅ Good for starting out

**Cons:**
- ❌ Longer to dial
- ❌ Less memorable
- ❌ Shared with other services

**Cost:** ~$10-50/month (varies by country)

### 2. Dedicated Service Code
**Format:** `*XXX#`

**Example:** `*123#`
- You own the entire code

**Pros:**
- ✅ Shorter, easier to remember
- ✅ More professional
- ✅ Brand recognition

**Cons:**
- ❌ More expensive
- ❌ Longer approval process
- ❌ Requires telco approval

**Cost:** ~$100-500/month (varies by country)

### 3. Premium Service Code
**Format:** `*1XX#` or `*XXX#`

**Example:** `*100#`, `*150#`
- Very short, memorable codes
- Usually reserved for major services

**Pros:**
- ✅ Very short
- ✅ Highly memorable
- ✅ Premium branding

**Cons:**
- ❌ Very expensive
- ❌ Hard to get
- ❌ Usually reserved by telcos

**Cost:** $500+/month

---

## 🔧 Configuring Your Service Code

### In Africa's Talking Dashboard

#### 1. Navigate to USSD Settings
```
Dashboard → USSD → Service Codes → Your Code → Configure
```

#### 2. Set Callback URL
**Development (ngrok):**
```
https://abc123.ngrok-free.app/api/ussd
```

**Production (Vercel):**
```
https://transport-app.vercel.app/api/ussd
```

**Production (Custom Domain):**
```
https://transport.mz/api/ussd
```

#### 3. Configure Settings
```
Service Code: *384*123#
Callback URL: https://your-server.com/api/ussd
Method: POST
Timeout: 30 seconds
Max Concurrent Sessions: 100 (or as needed)
Status: Active ✅
```

#### 4. Save Configuration

---

## 🧪 Testing Your Service Code

### Method 1: Simulator (Recommended)
```
1. Go to: https://simulator.africastalking.com/
2. Environment: Sandbox or Production
3. Service Code: *384*123# (your code)
4. Phone Number: +258840000001 (test number)
5. Click: "Start Session"
6. Test all menu flows
```

### Method 2: Real Phone (Sandbox)
For sandbox testing, you need to:
1. Add your phone number to test numbers in dashboard
2. Dial the sandbox code
3. Test the flow

### Method 3: Real Phone (Production)
Once in production:
1. Dial your production code: `*384*123#`
2. Works on any phone
3. Real users can access it

---

## 🌍 Service Codes by Country

### Mozambique
**Format:** Usually `*XXX*YYY#` for shared codes

**Popular Codes:**
- `*150#` - M-Pesa
- `*155#` - e-Mola
- `*123#` - Vodacom services

**Your Code:** Request through Africa's Talking
- Suggested: `*384*123#` or similar
- Must be approved by Mozambican telcos

### Other Countries
Each country has different regulations:
- **Kenya:** `*XXX#` or `*XXX*YYY#`
- **Nigeria:** `*XXX#` or `*XXX*YYY#`
- **South Africa:** `*XXX#` or `*XXX*YYY#`

---

## 💰 Pricing (Approximate)

### Sandbox (Free)
- ✅ Free testing
- ✅ Limited to test numbers
- ✅ Good for development

### Production - Shared Code
- 💵 $10-50/month
- ✅ Real users
- ✅ Format: `*XXX*YYY#`

### Production - Dedicated Code
- 💵 $100-500/month
- ✅ Real users
- ✅ Format: `*XXX#`
- ✅ More professional

### Per Session Cost
- Usually: $0.001 - $0.01 per session
- Or: Unlimited sessions with monthly fee
- Check with Africa's Talking for exact pricing

---

## 📋 Setup Checklist

### Sandbox Setup
- [ ] Login to Africa's Talking
- [ ] Go to Sandbox environment
- [ ] Navigate to USSD → Service Codes
- [ ] Note your sandbox code (e.g., `*384*123#`)
- [ ] Configure callback URL
- [ ] Set method to POST
- [ ] Activate service
- [ ] Test in simulator

### Production Setup
- [ ] Create production app in Africa's Talking
- [ ] Request service code (shared or dedicated)
- [ ] Wait for approval
- [ ] Configure callback URL (production server)
- [ ] Set method to POST
- [ ] Activate service
- [ ] Test in simulator
- [ ] Test with real phone
- [ ] Go live!

---

## 🚨 Common Issues

### Issue 1: "Service Code Not Found"
**Cause:** Code not configured or inactive
**Solution:**
- Check code is active in dashboard
- Verify you're in correct environment (sandbox/production)
- Ensure code is approved

### Issue 2: "Invalid Service Code"
**Cause:** Wrong format or not assigned to you
**Solution:**
- Use exact code from dashboard
- Include `*` and `#` symbols
- Check environment (sandbox vs production)

### Issue 3: "Callback Failed"
**Cause:** Server not reachable
**Solution:**
- Verify callback URL is correct
- Ensure server is running
- Check URL uses HTTPS
- Test URL in browser

### Issue 4: Can't Dial Code on Real Phone
**Cause:** Using sandbox code on real phone
**Solution:**
- Sandbox codes only work with test numbers
- Use production code for real phones
- Or add your number to sandbox test numbers

---

## 🎯 Quick Start

### For Testing (Right Now)

#### Step 1: Check Your Sandbox Code
```
1. Login: https://account.africastalking.com/
2. Go to: Sandbox → USSD → Service Codes
3. Note your code: *384*123# (example)
```

#### Step 2: Configure Callback
```
Callback URL: https://your-ngrok-url.ngrok-free.app/api/ussd
Method: POST
Status: Active
```

#### Step 3: Test in Simulator
```
1. Go to: https://simulator.africastalking.com/
2. Environment: Sandbox
3. Service Code: *384*123#
4. Start Session
```

### For Production (When Ready)

#### Step 1: Request Production Code
```
1. Login to production dashboard
2. Go to: USSD → Service Codes
3. Click: "Request New Code"
4. Fill form and submit
5. Wait for approval
```

#### Step 2: Configure Production Code
```
Service Code: *384*123# (your assigned code)
Callback URL: https://yourdomain.com/api/ussd
Method: POST
Status: Active
```

#### Step 3: Go Live
```
1. Test in simulator
2. Test with real phone
3. Monitor usage
4. Collect feedback
```

---

## 📞 Getting Help

### Africa's Talking Support
- **Email:** support@africastalking.com
- **Docs:** https://developers.africastalking.com/
- **Community:** https://help.africastalking.com/

### Questions to Ask Support
1. "What service codes are available in Mozambique?"
2. "How much does a shared code cost?"
3. "How long does approval take?"
4. "Can I test with my phone number in sandbox?"

---

## ✅ Summary

### What is a Service Code?
- The number users dial (e.g., `*384*123#`)
- Connects to your USSD application
- Assigned by Africa's Talking

### How to Get One?

**Sandbox (Testing):**
- ✅ Automatic/default code provided
- ✅ Free
- ✅ Configure in dashboard

**Production (Real Users):**
- 📝 Request through dashboard
- ⏳ Wait for approval
- 💰 Monthly fee applies
- ✅ Configure callback URL

### Your Next Steps?

**If Testing:**
1. Check your sandbox code in dashboard
2. Configure callback URL
3. Test in simulator

**If Going to Production:**
1. Request production code
2. Wait for approval
3. Configure and test
4. Go live!

---

**Need help with your specific service code?** Let me know what you need!
