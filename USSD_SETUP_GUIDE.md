# USSD Setup Guide - Africa's Talking

Complete guide to test USSD with your phone using Africa's Talking.

## 📋 Prerequisites

- Africa's Talking account (free sandbox)
- Your phone with active SIM card
- Internet connection
- Running transport-client app

---

## 🚀 Step-by-Step Setup

### Step 1: Africa's Talking Account Setup

1. **Sign up**: https://account.africastalking.com/auth/register
2. **Verify your email**
3. **Login to dashboard**
4. **Click "Go to Sandbox"** (top right corner)

### Step 2: Get Your Credentials

1. In Sandbox, go to **Settings** (left menu)
2. Note down:
   ```
   Username: sandbox
   API Key: [Click "Generate API Key"]
   ```
3. Keep these safe (you'll need them later for advanced features)

### Step 3: Expose Your Local Server

You need a public URL for Africa's Talking to reach your local server.

#### Option A: Using ngrok (Recommended)

```bash
# Download ngrok from: https://ngrok.com/download
# Or install via chocolatey:
choco install ngrok

# Start your Next.js app first
cd transport-client
npm run dev

# In another terminal, expose port 3000
ngrok http 3000
```

You'll see output like:
```
Forwarding: https://abc123-xyz.ngrok-free.app -> http://localhost:3000
```

**Copy this URL**: `https://abc123-xyz.ngrok-free.app`

#### Option B: Using localtunnel (Free alternative)

```bash
npm install -g localtunnel

# Start your app
cd transport-client
npm run dev

# In another terminal
lt --port 3000
```

### Step 4: Create USSD Channel

1. In Africa's Talking Sandbox, go to **USSD** (left menu)
2. Click **"Create Channel"**
3. Fill in:
   - **Service Code**: They'll assign you one (e.g., `*384*12345#`)
   - **Callback URL**: `https://your-ngrok-url.ngrok-free.app/api/ussd`
   - Example: `https://abc123-xyz.ngrok-free.app/api/ussd`
4. Click **"Create"**

### Step 5: Add Test Phone Number

1. Still in **USSD** section
2. Find **"Phone Numbers"** or **"Launch Simulator"**
3. Add your phone number in international format:
   ```
   Example: +258841234567 (Mozambique)
   ```
4. You'll receive an SMS to verify

### Step 6: Test with Your Phone! 📱

1. **Make sure everything is running**:
   ```bash
   # Terminal 1: Your app
   cd transport-client
   npm run dev
   
   # Terminal 2: ngrok
   ngrok http 3000
   ```

2. **From your phone, dial**:
   ```
   *384*12345#
   ```
   (Use the service code Africa's Talking gave you)

3. **You should see**:
   ```
   Bem-vindo ao Sistema de Transportes 🚌
   1. Procurar Rotas
   2. Paragens Próximas
   3. Minhas Rotas Salvas
   4. Ajuda
   ```

4. **Try it out**:
   - Press `1` → Enter
   - Type `Matola` → Enter
   - Select a route number → Enter
   - See route details!

---

## 🎯 Testing Flow Example

```
You dial: *384*12345#

Screen shows:
┌─────────────────────────┐
│ Bem-vindo ao Sistema    │
│ de Transportes 🚌       │
│                         │
│ 1. Procurar Rotas       │
│ 2. Paragens Próximas    │
│ 3. Minhas Rotas Salvas  │
│ 4. Ajuda                │
└─────────────────────────┘

You type: 1

Screen shows:
┌─────────────────────────┐
│ Procurar Rotas de       │
│ Autocarro               │
│                         │
│ Digite a origem         │
│ (ex: Matola):           │
└─────────────────────────┘

You type: Matola

Screen shows:
┌─────────────────────────┐
│ Rotas de Matola:        │
│                         │
│ 1. Maputo Centro        │
│ 2. Baixa                │
│ 3. Costa do Sol         │
│                         │
│ Digite o número para    │
│ detalhes:               │
└─────────────────────────┘

You type: 1

Screen shows:
┌─────────────────────────┐
│ 🚌 Matola → Maputo      │
│    Centro               │
│                         │
│ 📍 De: Matola           │
│ 📍 Para: Maputo Centro  │
│                         │
│ ⏰ Horário:             │
│    05:00 - 22:00        │
│ 💰 Tarifa: ~20-30 MT    │
│                         │
│ Obrigado por usar       │
│ nosso serviço!          │
└─────────────────────────┘
```

---

## 🔍 Monitoring & Debugging

### Watch Your Logs

In your terminal running `npm run dev`, you'll see:

```
📱 USSD Request: {
  sessionId: 'ATUid_abc123...',
  serviceCode: '*384*12345#',
  phoneNumber: '+258841234567',
  text: '1*Matola*1'
}
📤 USSD Response: END 🚌 Matola → Maputo Centro...
```

### Common Issues

**Issue**: "Connection failed" or no response
- ✅ Check ngrok is running
- ✅ Check ngrok URL is correct in Africa's Talking
- ✅ Check your app is running on port 3000

**Issue**: "Invalid service code"
- ✅ Use the exact code Africa's Talking gave you
- ✅ Make sure you're in sandbox mode

**Issue**: "Phone number not registered"
- ✅ Add your number in Africa's Talking dashboard
- ✅ Verify via SMS

**Issue**: ngrok URL changes every time
- ✅ Free ngrok URLs change on restart
- ✅ Update Africa's Talking callback URL each time
- ✅ Or use ngrok paid ($8/month) for static URL

---

## 🌐 Using Africa's Talking Simulator (Alternative)

If you can't test with your phone immediately:

1. Go to **USSD** → **Launch Simulator**
2. Enter your service code
3. Test the flow in the web simulator
4. Then test with real phone

---

## 📱 USSD Response Format

Africa's Talking expects responses in this format:

- **CON** = Continue (show message, wait for input)
  ```
  CON Welcome! Choose option:
  1. Option A
  2. Option B
  ```

- **END** = End session (show message, close)
  ```
  END Thank you! Session ended.
  ```

---

## 🚀 Going to Production

When ready for production:

1. **Upgrade to Live Account** (not sandbox)
2. **Purchase USSD Short Code** (e.g., `*123#`)
   - Cost varies by country
   - Usually $50-500/month
3. **Deploy your app**:
   ```bash
   cd transport-client
   vercel deploy
   # Or deploy to your server
   ```
4. **Update callback URL** to production URL
5. **Test thoroughly** before announcing

---

## 💡 Tips

- **Keep messages short**: USSD has 182 character limit per screen
- **Use numbers for navigation**: Easier than typing text
- **Provide "0" to go back**: Better UX
- **Test on different phones**: Some carriers behave differently
- **Log everything**: Helps with debugging

---

## 📞 Support

- **Africa's Talking Docs**: https://developers.africastalking.com/docs/ussd/overview
- **Africa's Talking Support**: help@africastalking.com
- **Community Slack**: https://slackin-africastalking.now.sh/

---

## ✅ Checklist

Before testing:
- [ ] Africa's Talking account created
- [ ] Sandbox mode activated
- [ ] USSD channel created
- [ ] Phone number registered
- [ ] transport-client app running (`npm run dev`)
- [ ] ngrok running and URL copied
- [ ] Callback URL updated in Africa's Talking
- [ ] Ready to dial from phone!

---

**Happy Testing! 🎉**

Dial your USSD code and see your transport system come to life on your phone!
