# Restart and Test Instructions

## What Was Fixed

### Issue
The via details page was showing cached data for transportes count.

### Solution Applied
1. ✅ Added cache-busting to API calls
2. ✅ Added `dynamic = 'force-dynamic'` to API route
3. ✅ Added cache-control headers to prevent caching
4. ✅ Added timestamp parameter to force fresh data

## Current Database State

**Verified**: Each via has exactly **1 transporte** assigned (not 10).

- Total Vias: 111
- Total Transportes: 111  
- Assignment: 1 transporte per via

## Steps to Test

### 1. Stop the Dev Server
Press `Ctrl+C` in the terminal where the dev server is running.

### 2. Clear Next.js Cache
```bash
cd transport-admin
rm -rf .next
```

Or on Windows:
```powershell
cd transport-admin
Remove-Item -Recurse -Force .next
```

### 3. Restart Dev Server
```bash
npm run dev
```

### 4. Clear Browser Cache
In your browser:
- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to hard refresh
- Or open DevTools (F12) → Network tab → Check "Disable cache"

### 5. Test a Via Details Page
1. Navigate to any via (e.g., `/vias/[via-id]`)
2. Open browser console (F12)
3. Look for these logs:
   ```
   Via data received: {...}
   Transportes count: 1
   Transportes array: [...]
   Transportes length: 1
   ```
4. Check the statistics card shows: **"Transportes: 1"**
5. Check the transportes section shows **1 transporte card**

## Expected Results

### Statistics Card
```
Transportes
1
```

### Transportes Section
Should show 1 transporte card with:
- Matricula
- Modelo - Marca
- Motorista name
- Codigo badge

## If You Want 10 Transportes Per Via

The current system has:
- 111 vias
- 111 transportes
- 1:1 assignment

To have 10 transportes per via, you need:
- 111 vias × 10 = **1,110 transportes total**
- Currently missing: **999 transportes**

### Options:
1. **Create more transportes** in the database
2. **Modify assignment logic** to assign multiple transportes to same via
3. **Clarify business requirements**: Should multiple transportes operate on the same route?

## Verification Script

To check database state anytime:
```bash
cd transport-admin
node check-via-transportes-count.js
```

This will show:
- Total vias and transportes
- Distribution of transportes per via
- Sample via details

## Files Modified

1. `app/api/vias/[id]/route.ts` - Cache control
2. `app/vias/[id]/page.tsx` - Cache-busting fetch
3. `check-via-transportes-count.js` - Diagnostic script
4. `VIA_TRANSPORTES_STATUS.md` - Status documentation

## Need Help?

If the issue persists after following these steps:
1. Check browser console for any errors
2. Check server terminal for API logs
3. Run the verification script to confirm database state
4. Verify you're looking at the correct via ID
