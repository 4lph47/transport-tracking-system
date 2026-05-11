# 🚨 EMERGENCY FIX - OOM Error (UPDATED FOR WINDOWS)

## ✅ Quick Fix (Do This NOW)

### The Easiest Way:

Just run the normal dev command - it's now fixed!

```bash
cd transport-admin
npm run dev
```

That's it! The memory settings are now built-in.

---

### Alternative Methods:

**Option 1 - Use the Batch File:**
```bash
cd transport-admin
start-dev.bat
```

**Option 2 - PowerShell:**
```bash
cd transport-admin
.\start-dev.ps1
```

---

## What Changed?

✅ Installed `cross-env` package (works on Windows, Mac, Linux)
✅ Updated `package.json` to use cross-env
✅ Memory limit (4GB) is now automatic

---

## What This Does

Increases Node.js memory from **512MB** to **4GB** so it doesn't crash.

---

## If Still Crashing

1. **Close everything else** (browsers, apps)
2. **Restart your computer**
3. **Try again with:** `npm run dev`

---

## Verify It's Working

You should see:
```
▲ Next.js 16.2.4
- Local:        http://localhost:3001
✓ Ready in X seconds
```

No OOM errors! ✅

---

**Status:** Fixed! Just run `npm run dev` ✅
