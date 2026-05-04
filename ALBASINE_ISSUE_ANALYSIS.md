# Albasine Search Issue - Complete Analysis

## Problem Statement
When users select "Albasine" as their origin location in the USSD system, they receive the message:
```
END Nenhum transporte disponível de Albasine.
```

However, the web app successfully shows buses going to/from Albasine.

## Database Analysis

### Routes with Albasine (from seed.ts)

1. **Rota 21: Museu → Albasine**
   - `terminalPartida`: "Terminal Museu"
   - `terminalChegada`: "Albasine"
   - Buses: 2 buses on this route

2. **Rota 53: Baixa → Albasine**
   - `terminalPartida`: "Laurentina"
   - `terminalChegada`: "Albasine"
   - Buses: 2 buses on this route (NNN-3333-MP, OOO-4444-MP)

3. **Rota 39a: Baixa → Zimpeto** (via Albasine)
   - `terminalPartida`: "Albert Lithule"
   - `terminalChegada`: "Terminal Zimpeto"
   - Passes through: "Albasine (Rotunda)" as a stop
   - Buses: 3 buses on this route

### Stop (Paragem)
- **Name**: "Albasine (Rotunda)"
- **Code**: PAR-ALBAZINE
- **Location**: -25.8373,32.6382

## Root Cause

**Albasine only appears as `terminalChegada` (destination), never as `terminalPartida` (origin)** in the Via table.

When a user searches for destinations FROM Albasine:
- The system looks for routes where Albasine is the departure point
- No routes exist with `terminalPartida = "Albasine"`
- Therefore, no destinations are found

## Expected Behavior

When searching FROM Albasine, the system should return:
1. **Terminal Museu** (reverse of Rota 21)
2. **Laurentina** (reverse of Rota 53)
3. **Albert Lithule** (reverse of Rota 39a, since it passes through Albasine)

## Web App vs USSD Comparison

### Web App (`/api/buses`)
✅ **Works correctly** - Shows 25 buses including:
- 2 buses on "Rota 53: Baixa - Albasine"
- 3 buses on "Rota 39a: Baixa - Zimpeto" (via Albasine)
- Displays all buses in circulation with their routes

### USSD (`/api/ussd`)
❌ **Fails** - Cannot find destinations from Albasine
- Uses `getAvailableDestinations()` function
- Function needs to handle bidirectional search
- Should find reverse routes when origin is a `terminalChegada`

## Solution Implemented

Updated `getAvailableDestinations()` function to:

```typescript
async function getAvailableDestinations(origin: string): Promise<string[]> {
  // 1. Search for routes where origin matches terminalPartida OR terminalChegada
  const routes = await prisma.via.findMany({
    where: {
      OR: [
        { terminalPartida: { contains: origin, mode: 'insensitive' } },
        { terminalChegada: { contains: origin, mode: 'insensitive' } },
        { nome: { contains: origin, mode: 'insensitive' } }
      ]
    }
  });

  // 2. Collect destinations bidirectionally
  routes.forEach(route => {
    // If origin matches departure → add arrival as destination
    if (route.terminalPartida.toLowerCase().includes(normalizedOrigin)) {
      destinations.add(route.terminalChegada);
    }
    
    // If origin matches arrival → add departure as destination (REVERSE)
    if (route.terminalChegada.toLowerCase().includes(normalizedOrigin)) {
      destinations.add(route.terminalPartida);
    }
  });

  // 3. Filter out the origin itself and return sorted
  return Array.from(destinations)
    .filter(d => !d.toLowerCase().includes(normalizedOrigin))
    .sort();
}
```

## Testing Required

### Test Case 1: Select Albasine from menu
```
Input: text=1*1 (Option 1: Find Transport, Option 1: Albasine)
Expected Output: Menu showing destinations:
1. Terminal Museu
2. Laurentina
3. Albert Lithule (or Terminal Zimpeto)
0. Voltar
```

### Test Case 2: Type "Albasine" manually
```
Input: text=1*8*Albasine
Expected Output: Same as Test Case 1
```

### Test Case 3: Calculate fare from Albasine
```
Input: text=4*1 (Option 4: Calculate Fare, Option 1: Albasine)
Expected Output: Menu showing destinations (same as Test Case 1)
```

## Verification Steps

1. ✅ Check database has Albasine routes (CONFIRMED - 2 routes)
2. ✅ Check web app shows Albasine buses (CONFIRMED - 25 buses total, 2 on Rota 53)
3. ✅ Update `getAvailableDestinations()` with bidirectional search (DONE)
4. ✅ Add logging to track search process (DONE)
5. ⏳ Deploy to Vercel (IN PROGRESS)
6. ⏳ Test USSD endpoint after deployment (PENDING)
7. ⏳ Verify logs show correct search results (PENDING)

## Database Consistency Check

Both systems use the same database:
```
DATABASE_URL="postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

✅ **Confirmed**: Web app and USSD use identical database connection

## Next Steps

1. Wait for Vercel deployment to complete (~30-60 seconds)
2. Test USSD endpoint with Albasine selection
3. Check Vercel logs for console.log output from `getAvailableDestinations()`
4. If still failing, add more detailed logging to identify exact query issue
5. Consider adding database index on `terminalPartida` and `terminalChegada` for performance

## Additional Improvements Needed

1. **Normalize location names**: Handle variations like "Albasine" vs "Albasine (Rotunda)"
2. **Add fuzzy matching**: Handle typos and partial matches
3. **Cache results**: Store frequently searched routes in memory
4. **Add route direction**: Indicate if route is forward or reverse
5. **Show all stops**: Include intermediate stops as potential destinations

## Status: IN PROGRESS
- Code updated: ✅
- Committed to Git: ✅
- Pushed to GitHub: ✅
- Deployed to Vercel: ⏳ (waiting for deployment)
- Tested and verified: ⏳ (pending deployment)
