# USSD Quick Start - 5 Minutes to Testing

Get your USSD running on your phone in 5 minutes.

## 🚀 Super Quick Setup

### 1. Sign Up (2 minutes)

1. Go to: https://account.africastalking.com/auth/register
2. Sign up → Verify email → Login
3. Click **"Go to Sandbox"** (top right)

### 2. Create USSD Channel (1 minute)

1. Left menu → **USSD**
2. Click **"Create Channel"**
3. Note your service code (e.g., `*384*12345#`)
4. Leave Callback URL empty for now

### 3. Start Your App (1 minute)

```bash
# Terminal 1: Start app
cd transport-client
npm run dev

# Terminal 2: Expose with ngrok
ngrok http 3000
```

Copy the ngrok URL: `https://xxxxx.ngrok-free.app`

### 4. Update Callback URL (30 seconds)

1. Back to Africa's Talking → USSD → Your Channel
2. Click **Edit**
3. Callback URL: `https://xxxxx.ngrok-free.app/api/ussd`
4. Save

### 5. Add Your Phone (30 seconds)

1. USSD section → **Phone Numbers**
2. Add: `+258841234567` (your number)
3. Verify via SMS

### 6. Test! 📱

Dial from your phone:
```
*384*12345#
```

(Use YOUR service code from step 2)

---

## 🎯 What You'll See

```
Bem-vindo ao Sistema de Transportes 🚌
1. Procurar Rotas
2. Paragens Próximas
3. Minhas Rotas Salvas
4. Ajuda
```

Try:
- Press `1` → Type `Matola` → Select route number

---

## ❌ Not Working?

### Quick Fixes

**No response?**
```bash
# Check both are running:
# Terminal 1: npm run dev ✓
# Terminal 2: ngrok http 3000 ✓
```

**Connection error?**
- Update callback URL with new ngrok URL
- ngrok URLs change on restart (free version)

**No routes found?**
- Check database has data: `npx prisma studio`
- Try exact names from your database

**Still stuck?**
```bash
# Test locally first:
node test-ussd-local.js

# Should show menu without errors
```

---

## 📚 Full Guides

- **Complete Setup**: `USSD_SETUP_GUIDE.md`
- **Troubleshooting**: `USSD_TROUBLESHOOTING.md`
- **Code**: `transport-client/app/api/ussd/route.ts`

---

## 🎉 Success!

If you see the menu on your phone, you're done! 

Now you can:
- Search for bus routes
- Find stops
- See route details

All from your phone via USSD! 📱🚌
