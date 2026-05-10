# Rotas Selector Fix - Complete Guide

## Problem
The "rotas" (vias) selector was not showing options when a municipio was selected, and the API was returning 500 errors.

## Root Causes Found

### 1. **Wrong Relation Name in API**
- The API was using `viaParagens` but the Prisma schema defines it as `vias`
- This caused the query to fail

### 2. **Database Connection String Issue**
- The `channel_binding=require` parameter can cause issues with Prisma
- Removed it from the DATABASE_URL

### 3. **Wrong API Endpoint**
- The `transport-client` app uses `/api/available-routes` (not `/api/locations`)
- This API filters to show only routes with available buses

## Fixes Applied

### ✅ Fix 1: Updated DATABASE_URL
**File:** `transport-client/.env`

**Changed from:**
```
DATABASE_URL="postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Changed to:**
```
DATABASE_URL="postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### ✅ Fix 2: Fixed Relation Name in API
**File:** `transport-client/app/api/available-routes/route.ts`

**Changed from:**
```typescript
viaParagens: {
  some: {
    viaId: {
      in: viaIdsForRoute
    }
  }
}
```

**Changed to:**
```typescript
vias: {
  some: {
    viaId: {
      in: viaIdsForRoute
    }
  }
}
```

### ✅ Fix 3: Added Better Error Handling
- Added database connection testing
- Added detailed error logging
- Added stack traces in development mode

### ✅ Fix 4: Created Test Endpoints
- `/api/test-db` - Test database connection and queries
- `test-db-connection.js` - Node script to test database directly

## How to Test

### Step 1: Test Database Connection
```bash
cd transport-client
node test-db-connection.js
```

**Expected output:**
```
✅ Municipios: X
✅ Vias: Y
✅ Transportes: Z
✅ Found N municipios with buses
✅ All tests passed!
```

### Step 2: Start Dev Server
```bash
cd transport-client
npm run dev
```

### Step 3: Test API Endpoints
Open in browser:
1. http://localhost:3000/api/test-db
2. http://localhost:3000/api/available-routes

**Expected:** Both should return JSON with data (no 500 errors)

### Step 4: Test the Search Page
1. Go to http://localhost:3000/search
2. Select a municipio from the dropdown
3. The "Via / Rota" dropdown should now populate with options
4. Select a via
5. The "Sua Paragem" dropdown should populate
6. Click "Pesquisar Transportes"

## Verification Checklist

- [ ] Database connection test passes
- [ ] `/api/test-db` returns success
- [ ] `/api/available-routes` returns municipios
- [ ] Selecting a municipio shows vias in the dropdown
- [ ] Selecting a via shows paragens in the dropdown
- [ ] No 500 errors in browser console
- [ ] No errors in terminal/server logs

## If Still Not Working

### Check 1: Verify Database Has Data
```bash
cd transport-client
node test-db-connection.js
```

If counts are 0, you need to seed the database.

### Check 2: Check Server Logs
Look at the terminal where `npm run dev` is running. You should see:
```
🔍 API /available-routes called
✅ Found X municipios with buses
```

### Check 3: Check Browser Console
Open DevTools (F12) and look for:
- Network tab: Check if `/api/available-routes` returns 200 (not 500)
- Console tab: Look for error messages

### Check 4: Verify Prisma Client is Generated
```bash
cd transport-client
npx prisma generate
```

## Technical Details

### Why the Selector Wasn't Updating

1. **API Error:** The `/api/available-routes` endpoint was failing with 500 error
2. **No Data Loaded:** Because the API failed, no municipios/vias/paragens were loaded
3. **Empty Dropdowns:** With no data, the selectors remained empty

### The Fix

1. **Fixed Database Connection:** Removed problematic connection parameter
2. **Fixed Prisma Query:** Used correct relation name (`vias` instead of `viaParagens`)
3. **Added Error Handling:** Better logging to catch future issues
4. **Added Tests:** Created test endpoints to verify everything works

## Next Steps

After confirming the fix works:

1. **Remove Debug Code** (optional):
   - Remove the yellow DEBUG panel from `transport-client/app/search/page.tsx`
   - Remove test endpoints if not needed

2. **Deploy to Production:**
   - Ensure production DATABASE_URL also doesn't have `channel_binding=require`
   - Test on production environment

3. **Monitor:**
   - Watch server logs for any errors
   - Check user feedback

## Files Modified

1. `transport-client/.env` - Updated DATABASE_URL
2. `transport-client/app/api/available-routes/route.ts` - Fixed relation name and error handling
3. `transport-client/app/api/test-db/route.ts` - Created (new test endpoint)
4. `transport-client/test-db-connection.js` - Created (new test script)

## Summary

The rotas selector issue was caused by:
1. ❌ Wrong Prisma relation name in the API query
2. ❌ Problematic database connection parameter

Both issues have been fixed. The selector should now work correctly!
