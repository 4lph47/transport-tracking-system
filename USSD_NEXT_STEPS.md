# 🎯 USSD Next Steps - What to Do Now

## 🚨 FIRST: Secure Your API Key

**You exposed your API key! Fix this first:**

1. **Revoke the old key**:
   - Go to: https://account.africastalking.com/
   - Settings → API Key → Revoke

2. **Generate new key**:
   - Click "Generate API Key"
   - Copy it (you'll only see it once!)

3. **Save securely**:
   - Open `transport-client/.env`
   - Replace `your-new-api-key-here` with your NEW key
   - Save and close

4. **Never share again**:
   - Read `SECURITY_GUIDE.md` for details

---

## ✅ Then: Test Your USSD

### Step 1: Test Locally (2 minutes)

```bash
# Make sure your app is running
cd transport-client
npm run dev

# In another terminal, test the endpoint
node test-ussd-local.js
```

**Expected output:**
```
📱 Response:
────────────────────────────────────────
CON Bem-vindo ao Sistema de Transportes 🚌
1. Procurar Rotas
2. Paragens Próximas
3. Minhas Rotas Salvas
4. Ajuda
────────────────────────────────────────
```

If you see this, your endpoint works! ✓

---

### Step 2: Expose Your Server (1 minute)

```bash
# Download ngrok from: https://ngrok.com/download
# Or install: choco install ngrok

# Run ngrok
ngrok http 3000
```

**Copy the URL:**
```
Forwarding: https://abc123-xyz.ngrok-free.app
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            Copy this part!
```

---

### Step 3: Configure Africa's Talking (2 minutes)

1. **Go to**: https://account.africastalking.com/
2. **Login** → Click "Go to Sandbox"
3. **Left menu** → USSD
4. **Click** "Create Channel" (or edit existing)
5. **Fill in**:
   - Service Code: (they give you one, like `*384*12345#`)
   - Callback URL: `https://your-ngrok-url.ngrok-free.app/api/ussd`
   - Example: `https://abc123-xyz.ngrok-free.app/api/ussd`
6. **Save**

---

### Step 4: Add Your Phone (1 minute)

1. Still in **USSD** section
2. Find **"Phone Numbers"** or **"Test Numbers"**
3. **Add your number**: `+258841234567`
4. **Verify** via SMS

---

### Step 5: Test with Your Phone! 📱

1. **Make sure both are running**:
   - Terminal 1: `npm run dev` ✓
   - Terminal 2: `ngrok http 3000` ✓

2. **From your phone, dial**:
   ```
   *384*12345#
   ```
   (Use YOUR service code from Step 3)

3. **You should see**:
   ```
   Bem-vindo ao Sistema de Transportes 🚌
   1. Procurar Rotas
   2. Paragens Próximas
   3. Minhas Rotas Salvas
   4. Ajuda
   ```

4. **Try it**:
   - Press `1`
   - Type `Matola`
   - Select a route
   - See details!

---

## 🎉 Success Indicators

You know it's working when:

- ✅ Local test shows menu
- ✅ ngrok shows "Session Status: online"
- ✅ Africa's Talking channel is created
- ✅ Your phone number is verified
- ✅ Dialing shows the menu
- ✅ Navigation works (1, 2, 3)
- ✅ Search returns results
- ✅ Route details display

---

## ❌ Troubleshooting

### "No response when dialing"

**Check:**
- [ ] App is running (`npm run dev`)
- [ ] ngrok is running (`ngrok http 3000`)
- [ ] Callback URL is correct in Africa's Talking
- [ ] Phone number is registered
- [ ] Using correct service code

**Fix:**
```bash
# Restart everything:
# Terminal 1:
cd transport-client
npm run dev

# Terminal 2:
ngrok http 3000
# Copy new URL → Update in Africa's Talking
```

### "Connection timeout"

**Check:**
- [ ] ngrok URL hasn't changed
- [ ] Callback URL ends with `/api/ussd`
- [ ] No typos in callback URL

**Fix:**
- Copy ngrok URL again
- Update in Africa's Talking dashboard
- Test with simulator first

### "No routes found"

**Check:**
- [ ] Database has data
- [ ] Searching with correct names

**Fix:**
```bash
# Check database:
cd transport-client
npx prisma studio

# Look at "Via" table
# Try searching exact names from there
```

---

## 📚 Full Guides Available

- `USSD_QUICK_START.md` - 5-minute setup
- `USSD_SETUP_GUIDE.md` - Detailed guide
- `USSD_TROUBLESHOOTING.md` - Common issues
- `USSD_COMPLETE_SUMMARY.md` - Everything
- `SECURITY_GUIDE.md` - **READ THIS!**

---

## 🔄 Daily Workflow

When testing:

```bash
# 1. Start app
cd transport-client
npm run dev

# 2. Start ngrok (if URL changed, update Africa's Talking)
ngrok http 3000

# 3. Test from phone
# Dial your USSD code

# 4. Watch logs in Terminal 1
# See requests and responses
```

---

## 💡 Pro Tips

1. **Keep ngrok running** - URL changes when you restart
2. **Test locally first** - Use `test-ussd-local.js`
3. **Use simulator** - Africa's Talking has web simulator
4. **Watch logs** - See what's happening in real-time
5. **Start simple** - Test main menu before adding features

---

## 🚀 When Ready for Production

1. **Deploy your app**:
   ```bash
   vercel deploy
   ```

2. **Upgrade Africa's Talking**:
   - Switch from Sandbox to Live
   - Purchase USSD short code
   - Update callback URL to production

3. **Test thoroughly**:
   - All menu options
   - Different phones
   - Error scenarios

---

## ✅ Your Checklist

**Right now:**
- [ ] Revoke exposed API key
- [ ] Generate new API key
- [ ] Save in `.env` file
- [ ] Read `SECURITY_GUIDE.md`

**Then test:**
- [ ] Run `node test-ussd-local.js`
- [ ] Start `npm run dev`
- [ ] Start `ngrok http 3000`
- [ ] Configure Africa's Talking
- [ ] Add phone number
- [ ] Dial from phone
- [ ] Test all features

**Going forward:**
- [ ] Never share API keys
- [ ] Keep ngrok running while testing
- [ ] Monitor logs
- [ ] Improve features
- [ ] Deploy to production

---

## 🆘 Need Help?

1. **Check troubleshooting**: `USSD_TROUBLESHOOTING.md`
2. **Check setup guide**: `USSD_SETUP_GUIDE.md`
3. **Africa's Talking support**: help@africastalking.com
4. **Community Slack**: https://slackin-africastalking.now.sh/

---

**You're almost there! Just secure that API key and start testing! 🎉**
