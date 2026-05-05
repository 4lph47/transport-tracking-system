# Bidirectional Buses & Dynamic Selectors - Complete ✅

## Problem Solved
Users were seeing "Nenhum transporte disponível" because:
1. **Buses only traveled in one direction** - If user wanted to go from Albasine → Museu but buses only went Museu → Albasine, they'd see "Wrong direction (destino before origem)"
2. **Selectors showed ALL routes** - Even routes without any buses, leading to empty results

## Solution Implemented

### 1. Created Backward-Direction Buses
**Script:** `create-bidirectional-buses.js`

**What it does:**
- Creates 2 additional buses per via traveling in the OPPOSITE direction
- Backward buses have "R" suffix in matricula (e.g., `MAT-BAI-R01`, `21-R08`)
- Reversed `routePath` coordinates for proper map display
- Positioned at end of route (going backward)

**Results:**
```
📊 Total vias processed: 111
🔄 Backward buses created: 222
📈 Total buses now: 999 (was 777)
📊 Each via now has: 9 buses (7 forward + 2 backward)
```

**Example:**
- **Forward buses (7):** Matola Gare → Baixa (matriculas: MAT-BAI-001 to MAT-BAI-007)
- **Backward buses (2):** Baixa → Matola Gare (matriculas: MAT-BAI-R08, MAT-BAI-R09)

### 2. Dynamic Selectors - Only Show Routes with Buses
**New API:** `transport-client/app/api/available-routes/route.ts`

**What it does:**
- Returns ONLY municipios/vias/paragens that have buses
- Filters at database level using Prisma queries
- Cascading filters: Municipio → Via → Paragem

**Query Logic:**
```typescript
// Only municipios with vias that have buses
municipios.where({
  vias: {
    some: {
      transportes: { some: {} }
    }
  }
})

// Only vias with buses
vias.where({
  municipioId: selected,
  transportes: { some: {} }
})

// Only paragens on vias with buses
paragens.where({
  viaParagens: {
    some: {
      viaId: { in: selectedRouteVias }
    }
  }
})
```

### 3. Updated Search Page
**File:** `transport-client/app/search/page.tsx`

**Changes:**
1. Changed from `/api/locations` to `/api/available-routes`
2. Added `handleMunicipioChange()` - Dynamically loads vias when municipio selected
3. Added `handleViaChange()` - Dynamically loads paragens when via selected
4. Selectors now cascade: Pick municipio → Load vias → Pick via → Load paragens

**User Flow:**
```
1. Page loads → Shows only municipios with buses
2. User selects "Maputo" → Loads only vias in Maputo with buses
3. User selects "Matola Gare → Baixa" → Loads only paragens on that route with buses
4. User selects origem & destino → Searches across ALL via variants
5. Results show buses in BOTH directions (forward + backward)
```

## Impact

### Before:
- ❌ Users saw "Wrong direction" errors
- ❌ Selectors showed routes with no buses
- ❌ "Nenhum transporte disponível" was common
- ❌ Could only travel in one direction per route

### After:
- ✅ Buses available in BOTH directions
- ✅ Selectors only show routes with buses
- ✅ No more empty results
- ✅ Users can travel any direction on any route
- ✅ 999 buses covering all 111 vias bidirectionally

## Technical Details

### Database Changes
- Added 222 new buses with reversed routes
- No schema changes required
- Backward buses use existing `routePath` field (reversed coordinates)

### API Changes
- New endpoint: `/api/available-routes` (filters by bus availability)
- Existing endpoint: `/api/buses` (unchanged, still handles search)
- Backward compatible: Old `/api/locations` still works

### Frontend Changes
- Dynamic loading of selectors based on bus availability
- Cascading filters prevent selecting routes without buses
- No visual changes - same UI, smarter data

## Files Modified
1. `create-bidirectional-buses.js` - Script to create backward buses
2. `transport-client/app/api/available-routes/route.ts` - New API endpoint
3. `transport-client/app/search/page.tsx` - Updated to use new API

## Testing Checklist
- [x] Script creates 222 backward buses successfully
- [x] Backward buses have reversed routePath
- [x] Backward buses have "R" suffix in matricula
- [x] API returns only routes with buses
- [x] Selectors cascade properly (municipio → via → paragem)
- [x] Search works in both directions
- [ ] Test on live site: Search Albasine → Museu (should show buses now)
- [ ] Test on live site: All selector options should have buses

## Next Steps
1. Commit changes to GitHub
2. Deploy to production
3. Monitor for "Nenhum transporte disponível" errors (should be zero)
4. Consider adding more backward buses if needed (currently 2 per via)

## Notes
- Backward buses are real buses in the database, not virtual
- They participate in simulation and move along routes
- Users see them as regular buses (no special indication)
- The "R" suffix is internal - users just see matricula
- System automatically searches both forward and backward buses
