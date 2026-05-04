# 🔧 Africa's Talking Setup Checklist

## ❌ Problem: "You have reached Africa's Talking USSD Services..."

This message means Africa's Talking is working, but your callback URL isn't configured correctly.

---

## ✅ Step-by-Step Fix

### Step 1: Login to Africa's Talking

1. Go to: https://account.africastalking.com/
2. Login with your credentials
3. **IMPORTANT**: Click **"Go to Sandbox"** (top right corner)
   - You should see "SANDBOX" in orange at the top
   - If you see "LIVE", click to switch to Sandbox

---

### Step 2: Check USSD Configuration

1. **Left sidebar** → Click **"USSD"**
2. Look for your USSD channel

**Do you see a channel listed?**

#### If YES - Edit the Channel:
1. Click **"Edit"** or the channel name
2. Check these settings:

   **Service Code**: (e.g., `*384*12345#`)
   - Note this down - you'll dial it from your phone
   
   **Callback URL**: 
   ```
   https://tidy-cycles-help.loca.lt/api/ussd
   ```
   - ⚠️ Must be EXACTLY this
   - ⚠️ Must start with `https://`
   - ⚠️ Must end with `/api/ussd`
   - ⚠️ NO trailing slash after ussd
   
3. Click **"Save"**

#### If NO - Create a Channel:
1. Click **"Create Channel"**
2. Fill in:
   - **Channel Name**: Transport System
   - **Service Code**: (they'll assign one, like `*384*12345#`)
   - **Callback URL**: 
     ```
     https://tidy-cycles-help.loca.lt/api/ussd
     ```
3. Click **"Create"** or **"Save"**

---

### Step 3: Verify Callback URL Format

**CORRECT Format:**
```
✅ https://tidy-cycles-help.loca.lt/api/ussd
```

**WRONG Formats:**
```
❌ http://tidy-cycles-help.loca.lt/api/ussd  (http instead of https)
❌ https://tidy-cycles-help.loca.lt/api/ussd/ (trailing slash)
❌ https://tidy-cycles-help.loca.lt/ussd      (missing /api/)
❌ https://tidy-cycles-help.loca.lt           (missing /api/ussd)
```

---

### Step 4: Register Your Phone Number

1. Still in **USSD** section
2. Look for **"Phone Numbers"** or **"Simulator"** tab
3. Click **"Add Phone Number"**
4. Enter your number in international format:
   ```
   +258841234567
   ```
   - Must start with `+`
   - Must include country code (258 for Mozambique)
   - No spaces or dashes
5. Click **"Add"** or **"Register"**
6. You should receive an SMS to verify

---

### Step 5: Test Again

1. **From your phone**, dial:
   ```
   *384*12345#
   ```
   (Use YOUR service code from Step 2)

2. **You should see**:
   ```
   Bem-vindo ao Sistema de Transportes 🚌
   1. Procurar Rotas
   2. Paragens Próximas
   3. Minhas Rotas Salvas
   4. Ajuda
   ```

---

## 🔍 Still Seeing the Default Message?

### Check These:

#### 1. Are you in Sandbox mode?
- Top of page should say "SANDBOX" in orange
- If it says "LIVE", switch to Sandbox

#### 2. Is the callback URL saved?
- Go back to USSD → Your Channel
- Verify the URL is there
- Click Save again if needed

#### 3. Is your phone number registered?
- USSD → Phone Numbers
- Your number should be listed
- Status should be "Active" or "Verified"

#### 4. Are you using the correct service code?
- The code Africa's Talking gave you
- Usually looks like `*384*12345#`
- NOT just `*123#` (that's a different service)

#### 5. Wait a moment
- After saving, wait 30 seconds
- Try dialing again

---

## 🧪 Test with Simulator First

Before testing with your phone:

1. **USSD** section → **"Launch Simulator"** or **"Test"**
2. Enter your service code: `*384*12345#`
3. Click **"Send"**
4. You should see your menu in the simulator

**If simulator works but phone doesn't:**
- Phone number might not be registered
- Try adding it again

**If simulator doesn't work:**
- Callback URL is wrong
- Check the URL format again

---

## 📸 What You Should See in Dashboard

### USSD Section Should Show:

```
┌─────────────────────────────────────┐
│ USSD Channels                       │
├─────────────────────────────────────┤
│ Channel Name: Transport System      │
│ Service Code: *384*12345#           │
│ Callback URL: https://tidy-cycles...│
│ Status: Active                      │
│ [Edit] [Delete]                     │
└─────────────────────────────────────┘
```

### Phone Numbers Should Show:

```
┌─────────────────────────────────────┐
│ Test Phone Numbers                  │
├─────────────────────────────────────┤
│ +258841234567                       │
│ Status: Verified                    │
│ [Remove]                            │
└─────────────────────────────────────┘
```

---

## 🆘 Common Issues

### Issue 1: "Channel not found"
**Solution**: Create a new USSD channel

### Issue 2: "Invalid callback URL"
**Solution**: 
- Must be HTTPS (localtunnel provides this)
- Must be publicly accessible
- Test it in browser: https://tidy-cycles-help.loca.lt/api/ussd

### Issue 3: "Phone number not registered"
**Solution**: Add your number in USSD → Phone Numbers

### Issue 4: "Service code not working"
**Solution**: 
- Use the EXACT code from your channel
- Include the `*` and `#` symbols
- Example: `*384*12345#`

---

## ✅ Verification Checklist

Before testing again, verify:

- [ ] Logged into Africa's Talking
- [ ] In SANDBOX mode (not LIVE)
- [ ] USSD channel created
- [ ] Callback URL is: `https://tidy-cycles-help.loca.lt/api/ussd`
- [ ] Callback URL saved (clicked Save button)
- [ ] Phone number registered
- [ ] Phone number verified (received SMS)
- [ ] Service code noted down
- [ ] Waited 30 seconds after saving
- [ ] Ready to dial from phone

---

## 🎯 Quick Test

**Test in browser first:**

Open this URL in your browser:
```
https://tidy-cycles-help.loca.lt/api/ussd
```

You should see an error or blank page (that's OK - it needs POST data).

**If you see "This site can't be reached":**
- Your localtunnel stopped
- Restart it: `npx localtunnel --port 3000`
- Update the URL in Africa's Talking

---

## 📞 Need Help?

**Africa's Talking Support:**
- Email: help@africastalking.com
- Include:
  - Your username
  - Service code
  - Callback URL
  - Error message

**Check Status:**
- https://status.africastalking.com/

---

## 🎉 When It Works

You'll see:
```
Bem-vindo ao Sistema de Transportes 🚌
1. Procurar Rotas
2. Paragens Próximas
3. Minhas Rotas Salvas
4. Ajuda
```

Then you can:
- Press 1 → Search routes
- Press 2 → Find stops
- Press 4 → See help

---

**Follow these steps carefully and it will work!** 🚀
