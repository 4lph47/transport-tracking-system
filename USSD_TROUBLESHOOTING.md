# USSD Troubleshooting Guide

Common issues and solutions when testing USSD with Africa's Talking.

---

## 🔧 Before You Start

### Quick Checklist

Run through this before testing:

```bash
# 1. Is your app running?
cd transport-client
npm run dev
# Should see: ✓ Ready on http://localhost:3000

# 2. Is ngrok running?
ngrok http 3000
# Should see: Forwarding https://xxxxx.ngrok-free.app -> http://localhost:3000

# 3. Test locally first
node test-ussd-local.js
# Should see responses without errors
```

---

## ❌ Common Issues

### Issue 1: "No response when dialing USSD code"

**Symptoms**: You dial `*384*12345#` but nothing happens

**Solutions**:

1. **Check if you're in Sandbox mode**
   - Go to Africa's Talking dashboard
   - Make sure you see "SANDBOX" at the top
   - Live mode requires payment

2. **Verify your phone number is registered**
   ```
   Dashboard → USSD → Phone Numbers
   Add: +258841234567 (your number)
   ```

3. **Check the service code**
   - Use the EXACT code Africa's Talking gave you
   - It might be `*384*12345#` or different
   - Find it: Dashboard → USSD → Your Channel

4. **Try the simulator first**
   ```
   Dashboard → USSD → Launch Simulator
   Test there before using your phone
   ```

---

### Issue 2: "Connection timeout" or "Service unavailable"

**Symptoms**: USSD starts but shows error message

**Solutions**:

1. **Check ngrok is running**
   ```bash
   # Should see this in ngrok terminal:
   Session Status: online
   Forwarding: https://xxxxx.ngrok-free.app -> http://localhost:3000
   ```

2. **Verify callback URL in Africa's Talking**
   ```
   Dashboard → USSD → Your Channel → Edit
   Callback URL: https://xxxxx.ngrok-free.app/api/ussd
   
   ⚠️  Must be HTTPS (ngrok provides this)
   ⚠️  Must end with /api/ussd
   ⚠️  No trailing slash
   ```

3. **Check ngrok URL hasn't changed**
   - Free ngrok URLs change every restart
   - Copy new URL from ngrok terminal
   - Update in Africa's Talking dashboard

4. **Test the endpoint directly**
   ```bash
   curl -X POST https://your-ngrok-url.ngrok-free.app/api/ussd \
     -d "sessionId=test123&serviceCode=*384*12345#&phoneNumber=+258841234567&text="
   
   # Should return: CON Bem-vindo ao Sistema...
   ```

---

### Issue 3: "Invalid session" or session resets

**Symptoms**: Menu works but loses your place, starts over

**Solutions**:

1. **Check session handling**
   - Each request should have same `sessionId`
   - Africa's Talking manages this automatically
   - Don't worry about it unless you see different IDs in logs

2. **Check your logs**
   ```bash
   # In your npm run dev terminal, look for:
   📱 USSD Request: { sessionId: 'ATUid_xxx', text: '1*Matola' }
   
   # Session ID should be same for entire conversation
   ```

---

### Issue 4: "No routes found" or empty results

**Symptoms**: Search works but returns no results

**Solutions**:

1. **Check your database has data**
   ```bash
   cd transport-client
   npx prisma studio
   
   # Check "Via" table has routes
   # Check "Paragem" table has stops
   ```

2. **Test with exact names from database**
   ```
   If database has: "Matola Rio"
   Try searching: "Matola" or "Rio"
   Not: "matola rio" (case doesn't matter but spelling does)
   ```

3. **Check database connection**
   ```bash
   # In transport-client/.env
   DATABASE_URL="file:./prisma/dev.db"
   
   # Make sure file exists:
   ls prisma/dev.db
   ```

4. **Run seed if database is empty**
   ```bash
   cd transport-client
   npx prisma db seed
   ```

---

### Issue 5: "Characters look weird" or encoding issues

**Symptoms**: Portuguese characters (ã, ç, é) show as �

**Solutions**:

1. **Check your database encoding**
   - Should be UTF-8
   - Usually automatic with Prisma

2. **Check response headers**
   - Already set in code: `Content-Type: text/plain`
   - Should work automatically

3. **Test with simple ASCII first**
   - Change "Bem-vindo" to "Bem-vindo" (no special chars)
   - If that works, it's an encoding issue

---

### Issue 6: ngrok "Visit Site" button appears

**Symptoms**: When testing, you see ngrok warning page

**Solutions**:

1. **Skip the warning** (for testing)
   - Click "Visit Site"
   - This is normal for free ngrok

2. **Disable warning** (ngrok paid feature)
   ```bash
   ngrok http 3000 --domain=your-static-domain.ngrok-free.app
   ```

3. **Use alternative**: localtunnel
   ```bash
   npm install -g localtunnel
   lt --port 3000
   ```

---

### Issue 7: "Too many requests" or rate limiting

**Symptoms**: Works then stops working

**Solutions**:

1. **Sandbox limits**
   - Africa's Talking sandbox has limits
   - Usually 100 requests/day
   - Check: Dashboard → Usage

2. **Wait and try again**
   - Limits reset daily
   - Or upgrade to paid account

---

## 🔍 Debugging Tools

### 1. Check Endpoint Locally

```bash
node test-ussd-local.js
```

Should show:
```
📤 Sending: { text: '' }
📱 Response:
────────────────────────────────────────
CON Bem-vindo ao Sistema de Transportes 🚌
1. Procurar Rotas
2. Paragens Próximas
...
```

### 2. Check Logs in Real-Time

```bash
# Terminal 1: Run app with verbose logging
cd transport-client
npm run dev

# Watch for:
📱 USSD Request: { ... }
📤 USSD Response: CON ...
```

### 3. Test with cURL

```bash
# Test initial menu
curl -X POST http://localhost:3000/api/ussd \
  -d "sessionId=test&serviceCode=*384*12345#&phoneNumber=+258841234567&text="

# Test option selection
curl -X POST http://localhost:3000/api/ussd \
  -d "sessionId=test&serviceCode=*384*12345#&phoneNumber=+258841234567&text=1"

# Test search
curl -X POST http://localhost:3000/api/ussd \
  -d "sessionId=test&serviceCode=*384*12345#&phoneNumber=+258841234567&text=1*Matola"
```

### 4. Check Africa's Talking Logs

```
Dashboard → USSD → Logs
See all requests and responses
```

---

## 📱 Phone-Specific Issues

### Vodacom Mozambique

- USSD codes work normally
- May have slight delay (2-3 seconds)
- If timeout, increase in Africa's Talking settings

### Tmcel

- Works with standard USSD codes
- Sometimes requires `#` at the end: `*384*12345##`

### Movitel

- Standard USSD support
- May need to enable USSD in phone settings

---

## 🆘 Still Not Working?

### 1. Use Africa's Talking Simulator

```
Dashboard → USSD → Launch Simulator
Enter your service code
Test the full flow
```

If simulator works but phone doesn't:
- Issue is with phone/carrier
- Contact Africa's Talking support

If simulator doesn't work:
- Issue is with your endpoint
- Check logs and test locally

### 2. Check Africa's Talking Status

https://status.africastalking.com/

### 3. Contact Support

- Email: help@africastalking.com
- Slack: https://slackin-africastalking.now.sh/
- Include:
  - Your username
  - Service code
  - Error message
  - Logs from dashboard

---

## ✅ Success Indicators

You know it's working when:

1. ✅ Local test script runs without errors
2. ✅ ngrok shows incoming requests
3. ✅ Your terminal shows USSD logs
4. ✅ Africa's Talking simulator works
5. ✅ Your phone shows the menu
6. ✅ Navigation works (1, 2, 3 options)
7. ✅ Search returns results
8. ✅ Route details display correctly

---

## 💡 Pro Tips

1. **Always test locally first**
   ```bash
   node test-ussd-local.js
   ```

2. **Keep ngrok running**
   - Don't restart unless necessary
   - URL changes = update Africa's Talking

3. **Monitor both terminals**
   - Terminal 1: npm run dev (see logs)
   - Terminal 2: ngrok (see requests)

4. **Use Africa's Talking simulator**
   - Faster than phone testing
   - Better for debugging
   - Use phone for final validation

5. **Start simple**
   - Test main menu first
   - Then add features one by one
   - Don't test everything at once

---

**Need more help?** Check the main guide: `USSD_SETUP_GUIDE.md`
