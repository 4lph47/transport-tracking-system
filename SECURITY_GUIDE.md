# 🔒 Security Guide - API Keys & Credentials

## ⚠️ CRITICAL: You Shared Your API Key!

**What happened:** You posted your Africa's Talking API key in chat.

**Risk:** Anyone who saw it can use your account, make requests, and potentially incur charges.

---

## 🚨 IMMEDIATE ACTION REQUIRED

### Step 1: Revoke the Exposed API Key

1. Go to: https://account.africastalking.com/
2. Login
3. Click **"Go to Sandbox"** (top right)
4. Go to **Settings** (left menu)
5. Find **API Key** section
6. Click **"Revoke"** or **"Regenerate API Key"**
7. Confirm the action

### Step 2: Generate New API Key

1. Still in Settings → API Key
2. Click **"Generate API Key"**
3. **Copy the new key** (you'll only see it once!)
4. Store it securely (see below)

---

## ✅ How to Store API Keys Securely

### 1. Use Environment Variables

**Your `.env` file** (already set up):
```bash
# transport-client/.env

# Africa's Talking API Credentials
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="your-new-api-key-here"
```

**Steps:**
1. Open `transport-client/.env`
2. Replace `your-new-api-key-here` with your NEW key
3. Save the file
4. **NEVER commit this file to git** (already in .gitignore ✓)

### 2. Access in Your Code

If you need to use the API key in your code:

```typescript
// Example: Using Africa's Talking SDK
const africastalking = require('africastalking')({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME
});
```

**Note:** For the USSD endpoint we created, you DON'T need the API key! Africa's Talking calls your endpoint, not the other way around.

---

## 🚫 What NOT to Do

### ❌ Never Do This:

1. **Don't paste API keys in chat/messages**
   ```
   ❌ "My key is: atsk_123456..."
   ```

2. **Don't commit to git**
   ```bash
   ❌ git add .env
   ❌ git commit -m "Added API keys"
   ```

3. **Don't hardcode in source files**
   ```typescript
   ❌ const apiKey = "atsk_123456...";
   ```

4. **Don't share in screenshots**
   ```
   ❌ [Screenshot showing .env file]
   ```

5. **Don't put in client-side code**
   ```typescript
   ❌ const NEXT_PUBLIC_API_KEY = "atsk_123456...";
   ```

---

## ✅ What TO Do

### ✓ Always Do This:

1. **Store in .env files**
   ```bash
   ✓ AFRICASTALKING_API_KEY="your-key-here"
   ```

2. **Add .env to .gitignore** (already done ✓)
   ```
   ✓ .env*
   ```

3. **Use environment variables**
   ```typescript
   ✓ process.env.AFRICASTALKING_API_KEY
   ```

4. **Create .env.example** (template without real values)
   ```bash
   ✓ AFRICASTALKING_API_KEY="your-api-key-here"
   ```

5. **Use different keys for dev/production**
   ```
   ✓ Sandbox key for development
   ✓ Live key for production
   ```

---

## 🔐 Other Sensitive Data

### What Else to Protect:

- Database URLs with passwords
- Google Maps API keys (if restricted)
- JWT secrets
- OAuth client secrets
- Payment gateway keys
- Email service credentials

### Already Protected in Your Project:

```bash
# transport-client/.env (protected by .gitignore)
DATABASE_URL="..."                          # ✓ Protected
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."      # ⚠️ Public (NEXT_PUBLIC_)
AFRICASTALKING_API_KEY="..."               # ✓ Protected
```

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser. Only use this prefix for truly public keys.

---

## 🛡️ Best Practices

### 1. Regular Key Rotation
- Rotate API keys every 3-6 months
- Rotate immediately if exposed

### 2. Use Key Restrictions
- Restrict by IP address (if possible)
- Restrict by domain (for browser keys)
- Set usage limits

### 3. Monitor Usage
- Check Africa's Talking dashboard regularly
- Set up usage alerts
- Review logs for suspicious activity

### 4. Separate Keys for Environments
```
Development:  sandbox key
Staging:      test key
Production:   live key
```

### 5. Team Access
- Don't share keys via chat/email
- Use secret management tools (1Password, LastPass, etc.)
- Revoke access when team members leave

---

## 🚀 For Production Deployment

### Environment Variables on Vercel

```bash
# In Vercel dashboard:
Settings → Environment Variables

Add:
AFRICASTALKING_USERNAME = "your-live-username"
AFRICASTALKING_API_KEY = "your-live-api-key"
```

### Environment Variables on Your Server

```bash
# On your server:
export AFRICASTALKING_USERNAME="your-live-username"
export AFRICASTALKING_API_KEY="your-live-api-key"

# Or add to ~/.bashrc or ~/.profile
```

---

## 📋 Security Checklist

Before deploying:

- [ ] All API keys in .env files
- [ ] .env files in .gitignore
- [ ] No hardcoded secrets in code
- [ ] Different keys for dev/production
- [ ] Keys restricted (IP/domain if possible)
- [ ] Usage monitoring enabled
- [ ] Team members have secure access
- [ ] Old/exposed keys revoked

---

## 🆘 If You Exposed a Key

1. **Revoke immediately** (don't wait!)
2. **Generate new key**
3. **Update .env file**
4. **Restart your app**
5. **Monitor for suspicious activity**
6. **Learn from it** (we all make mistakes!)

---

## 📚 Resources

- **Africa's Talking Security**: https://developers.africastalking.com/docs/security
- **OWASP API Security**: https://owasp.org/www-project-api-security/
- **GitHub Secret Scanning**: https://docs.github.com/en/code-security/secret-scanning

---

## ✅ Action Items for You

1. **Right now:**
   - [ ] Go to Africa's Talking dashboard
   - [ ] Revoke the exposed API key
   - [ ] Generate new API key
   - [ ] Save new key in `transport-client/.env`

2. **Going forward:**
   - [ ] Never share API keys in chat
   - [ ] Always use .env files
   - [ ] Check .gitignore before committing
   - [ ] Rotate keys regularly

---

**Remember:** It's okay to make mistakes! The important thing is to fix them quickly and learn. 🔒

**Your USSD system will work fine once you update the .env file with your NEW key!**
