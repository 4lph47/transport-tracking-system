# 🚨 Quick Fix: "You have reached Africa's Talking USSD Services"

## The Problem

You're seeing the default Africa's Talking message instead of your menu. This means the callback URL isn't configured.

---

## ⚡ Quick Fix (2 minutes)

### 1. Go to Africa's Talking Dashboard

**URL**: https://account.africastalking.com/

### 2. Make Sure You're in SANDBOX

- Top right corner → Click **"Go to Sandbox"**
- You should see **"SANDBOX"** in orange at the top

### 3. Go to USSD Section

- Left sidebar → Click **"USSD"**

### 4. Do You See a Channel?

#### ✅ If YES (you see a channel):

1. Click **"Edit"** on your channel
2. Find **"Callback URL"** field
3. **Paste this EXACTLY**:
   ```
   https://tidy-cycles-help.loca.lt/api/ussd
   ```
4. Click **"Save"**
5. Wait 30 seconds
6. Try dialing again

#### ❌ If NO (no channel listed):

1. Click **"Create Channel"**
2. Fill in:
   - **Channel Name**: `Transport System`
   - **Callback URL**: 
     ```
     https://tidy-cycles-help.loca.lt/api/ussd
     ```
3. Click **"Create"**
4. Note the **Service Code** they give you (e.g., `*384*12345#`)

### 5. Register Your Phone

1. Still in USSD section
2. Find **"Phone Numbers"** tab
3. Click **"Add Phone Number"**
4. Enter: `+258841234567` (your number with country code)
5. Verify via SMS

### 6. Test Again

Dial from your phone:
```
*384*YOUR_CODE#
```

---

## 🎯 The Exact URL to Use

**Copy and paste this into Africa's Talking:**

```
https://tidy-cycles-help.loca.lt/api/ussd
```

**Important:**
- ✅ Starts with `https://` (not http)
- ✅ Ends with `/api/ussd` (no trailing slash)
- ✅ Exact URL from localtunnel

---

## 🧪 Test It First

**Option 1: Use Africa's Talking Simulator**

1. USSD section → **"Launch Simulator"**
2. Enter your service code
3. Click Send
4. Should show your menu

**Option 2: Test the URL**

Open in browser:
```
https://tidy-cycles-help.loca.lt/api/ussd
```

Should show something (even if it's an error - that's OK).

If it says "can't be reached" → Your localtunnel stopped.

---

## ❓ What's Your Service Code?

Look in Africa's Talking USSD section:
- Should be something like: `*384*12345#`
- This is what you dial from your phone
- NOT just `*123#`

---

## 🔄 If Still Not Working

### Check:

1. **Are you in Sandbox?**
   - Top of page says "SANDBOX"?

2. **Is callback URL saved?**
   - Go back and check it's there

3. **Is your phone registered?**
   - USSD → Phone Numbers → Your number listed?

4. **Correct service code?**
   - Use the one from your channel, not a random one

5. **Waited 30 seconds?**
   - After saving, wait a bit before testing

---

## 💡 Pro Tip

**Test with simulator FIRST before using your phone!**

If simulator works → Phone should work
If simulator doesn't work → Fix callback URL

---

## ✅ Success Looks Like This

When you dial `*384*YOUR_CODE#`, you see:

```
Bem-vindo ao Sistema de Transportes 🚌
1. Procurar Rotas
2. Paragens Próximas
3. Minhas Rotas Salvas
4. Ajuda
```

---

**Need more help?** Read `AFRICA_TALKING_SETUP_CHECKLIST.md` for detailed steps.
