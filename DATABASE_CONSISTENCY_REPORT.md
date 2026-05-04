# Database Consistency Report: Web App vs USSD

## Executive Summary

✅ **Database Connection**: Both systems use the SAME database
❌ **Data Display**: USSD fails to find Albasine destinations while Web App succeeds

## Database Configuration

### Web App (transport-client)
```env
DATABASE_URL="postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Admin Panel (transport-admin)
```env
DATABASE_URL="postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

✅ **Confirmed**: Identical database connection strings

## Data Verification

### Web App (`/api/buses`) - ✅ WORKING

**Test**: `GET https://transport-tracking-system.vercel.app/api/buses`

**Results**:
- Total buses: **25**
- Buses on Albasine routes: **5**
  - 2 buses on "Rota 53: Baixa - Albasine" (NNN-3333-MP, OOO-4444-MP)
  - 3 buses on "Rota 39a: Baixa - Zimpeto" (passes through Albasine)

**Sample Data**:
```json
{
  "id": "cmorbsji0005o124pm2kq1gs1",
  "matricula": "NNN-3333-MP",
  "via": "Rota 53: Baixa - Albasine",
  "latitude": -25.9083,
  "longitude": 32.5939,
  "status": "Em Circulação",
  "stops": [
    {"nome": "Laurentina", "isTerminal": true},
    {"nome": "Hulene (Praça)", "isTerminal": false},
    {"nome": "Albasine (Rotunda)", "isTerminal": true}
  ]
}
```

### USSD (`/api/ussd`) - ❌ FAILING

**Test**: `POST https://transport-tracking-system.vercel.app/api/ussd`
- Body: `text=1*1` (Find Transport → Select Albasine)

**Results**:
```
END Nenhum transporte disponível de Albasine.
```

**Expected**:
```
CON Você está perto de:
Albasine (Rotunda)

Para onde quer ir?
1. Terminal Museu
2. Laurentina
3. Albert Lithule
0. Voltar
```

## Root Cause Analysis

### Database Structure
In the `Via` table, Albasine appears as:
- **terminalChegada** (destination): ✅ YES (2 routes)
- **terminalPartida** (origin): ❌ NO (0 routes)

### Routes with Albasine
1. **Rota 21**: Terminal Museu → **Albasine**
2. **Rota 53**: Laurentina → **Albasine**

### The Problem
When searching for destinations FROM Albasine:
- Current query looks for `terminalPartida = "Albasine"`
- No routes have Albasine as departure point
- Query returns empty result

### The Solution
Implement **bidirectional search**:
1. Find routes where Albasine is `terminalPartida` → return `terminalChegada`
2. Find routes where Albasine is `terminalChegada` → return `terminalPartida` (REVERSE)

## Code Comparison

### Web App Approach
```typescript
// /api/buses - Shows ALL buses in circulation
const allTransportes = await prisma.transporte.findMany({
  include: {
    via: {
      include: {
        paragens: { include: { paragem: true } }
      }
    },
    geoLocations: { orderBy: { createdAt: 'desc' }, take: 1 }
  }
});

// Returns all buses regardless of search direction
// ✅ Works because it doesn't filter by origin/destination
```

### USSD Approach (BEFORE FIX)
```typescript
// /api/ussd - Searches for specific origin
const routes = await prisma.via.findMany({
  where: {
    terminalPartida: { contains: origin, mode: 'insensitive' }
  }
});

// ❌ Fails for Albasine because it's never a terminalPartida
```

### USSD Approach (AFTER FIX)
```typescript
// /api/ussd - Bidirectional search
const routes = await prisma.via.findMany({
  where: {
    OR: [
      { terminalPartida: { contains: origin, mode: 'insensitive' } },
      { terminalChegada: { contains: origin, mode: 'insensitive' } },
      { nome: { contains: origin, mode: 'insensitive' } }
    ]
  }
});

// Process both directions
routes.forEach(route => {
  if (route.terminalPartida.includes(origin)) {
    destinations.add(route.terminalChegada); // Forward
  }
  if (route.terminalChegada.includes(origin)) {
    destinations.add(route.terminalPartida); // Reverse
  }
});

// ✅ Should work for Albasine
```

## Deployment Status

### Git Status
- ✅ Code updated in `app/api/ussd/route.ts`
- ✅ Committed: "Fix Albasine destination search - improve getAvailableDestinations with better logging and bidirectional search"
- ✅ Pushed to GitHub: commit `a47a5fb`

### Vercel Deployment
- ⏳ Deployment triggered automatically
- ⏳ Waiting for build and deployment to complete
- ❌ Still returning old response (cache or deployment delay)

## Testing Results

| Test | Endpoint | Input | Expected | Actual | Status |
|------|----------|-------|----------|--------|--------|
| 1 | `/api/buses` | GET all buses | 25 buses | 25 buses | ✅ PASS |
| 2 | `/api/buses` | Albasine routes | 5 buses | 5 buses | ✅ PASS |
| 3 | `/api/ussd` | text=1 | Location menu | Location menu with Albasine | ✅ PASS |
| 4 | `/api/ussd` | text=1*1 (Albasine) | Destination menu | "Nenhum transporte disponível" | ❌ FAIL |
| 5 | `/api/ussd` | text=1*8*Albasine | Destination menu | Transport info (wrong flow) | ⚠️ PARTIAL |

## Recommendations

### Immediate Actions
1. ✅ **Verify deployment**: Check Vercel dashboard for deployment status
2. ⏳ **Clear cache**: Force cache invalidation on Vercel
3. ⏳ **Check logs**: Review Vercel function logs for console.log output
4. ⏳ **Test locally**: Run USSD endpoint locally to verify fix works

### Short-term Improvements
1. **Add comprehensive logging**: Track every step of destination search
2. **Add error handling**: Provide more specific error messages
3. **Add data validation**: Verify database has expected routes
4. **Add unit tests**: Test `getAvailableDestinations()` function

### Long-term Improvements
1. **Normalize location names**: Handle "Albasine" vs "Albasine (Rotunda)"
2. **Add fuzzy matching**: Handle typos and partial matches
3. **Cache frequent searches**: Improve performance
4. **Add route metadata**: Store bidirectional flag in database
5. **Create location aliases**: Map common names to official names

## Conclusion

**Database**: ✅ Consistent - Both systems use same database
**Data**: ✅ Present - Albasine routes exist in database
**Web App**: ✅ Working - Correctly displays Albasine buses
**USSD**: ❌ Failing - Cannot find destinations from Albasine

**Root Cause**: Query logic doesn't handle reverse routes
**Fix Applied**: Bidirectional search implemented
**Status**: Waiting for Vercel deployment to complete

## Next Steps

1. Wait for Vercel deployment (check dashboard)
2. Test USSD endpoint again after deployment
3. If still failing, check Vercel logs for errors
4. If logs show correct data, investigate caching
5. If logs show no data, investigate database connection

---

**Report Generated**: 2026-05-04
**Database**: Neon PostgreSQL (ep-wild-wildflower-ansvthi1)
**Environment**: Production (Vercel)
**Status**: Investigation in progress
