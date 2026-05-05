# Route Selector Fix - Complete

## Problem Solved
The route selector was showing duplicate entries with "(Via A)", "(Via B)", "(Via C)" variants, making it confusing for users.

### Before
```
Selector options:
- Matola Gare → Baixa (Via A)
- Matola Gare → Baixa (Via B)
- Matola Gare → Baixa (Via C)
- Matola Gare → Baixa (Via D)
- Matola Gare → Baixa (Via E)
```

### After
```
Selector options:
- Matola Gare → Baixa
```

## Solution Implemented

### Frontend Changes (`transport-client/app/search/page.tsx`)

1. **Group vias by unique routes**:
```typescript
const uniqueRoutes = viasFiltered.reduce((acc, via) => {
  const routeKey = `${via.terminalPartida} → ${via.terminalChegada}`;
  if (!acc[routeKey]) {
    acc[routeKey] = {
      displayName: routeKey,
      viaIds: [],
      firstVia: via
    };
  }
  acc[routeKey].viaIds.push(via.id);
  return acc;
}, {});
```

2. **Show only unique route names**:
- Changed label from "Via / Rota" to "Rota"
- Display format: `Terminal Partida → Terminal Chegada`
- No more "(Via A)", "(Via B)" suffixes

3. **Get stops from all vias in route**:
```typescript
const paragensFiltered = selectedRouteData
  ? paragens?.filter((paragem) => 
      selectedRouteData.viaIds.some(viaId => paragem.viaIds.includes(viaId))
    ) || []
  : [];
```

### Backend Changes (`transport-client/app/api/buses/route.ts`)

1. **Accept multiple via IDs**:
```typescript
const viaIds = searchParams.get('viaIds'); // New: comma-separated IDs
const viaId = searchParams.get('viaId');   // Legacy: single ID

// Parse via IDs (support both single and multiple)
let viaIdFilter: string[] | undefined;
if (viaIds) {
  viaIdFilter = viaIds.split(',');
}
```

2. **Search across all via variants**:
```typescript
const allTransportes = await prisma.transporte.findMany({
  where: viaIdFilter ? { viaId: { in: viaIdFilter } } : {},
  // ...
});
```

## How It Works

### User Flow

1. **User selects**: "Matola Gare → Baixa"
2. **System finds**: All vias with this route (VIA-MGARE-BAI-VAR1, VAR2, VAR3, VAR4, VAR5)
3. **API searches**: Buses from all 5 via variants
4. **User sees**: All available buses, regardless of which via variant they're on

### Example

**User Selection**:
- Município: Maputo
- Rota: Matola Gare → Baixa
- Origem: Matola Gare
- Destino: Museu

**Behind the Scenes**:
```
API Call: /api/buses?paragemId=xxx&destinoId=yyy&viaIds=via1,via2,via3,via4,via5

Database Query:
WHERE viaId IN ('VIA-MGARE-BAI-VAR1', 'VIA-MGARE-BAI-VAR2', 'VIA-MGARE-BAI-VAR3', 'VIA-MGARE-BAI-VAR4', 'VIA-MGARE-BAI-VAR5')

Result: Shows buses from all 5 variants (25 buses total, 5 per variant)
```

## Benefits

### For Users
✅ **Cleaner interface** - No confusing "(Via A)", "(Via B)" labels
✅ **Simpler selection** - Just pick origin → destination
✅ **More results** - Automatically searches all via variants
✅ **Better UX** - Intuitive route names

### For System
✅ **Backward compatible** - Still supports single `viaId` parameter
✅ **More efficient** - Single API call instead of multiple
✅ **Flexible** - Easy to add more via variants without UI changes
✅ **Scalable** - Works with any number of via variants

## Technical Details

### API Parameters

**New (Recommended)**:
```
GET /api/buses?paragemId=xxx&destinoId=yyy&viaIds=via1,via2,via3
```

**Legacy (Still Supported)**:
```
GET /api/buses?paragemId=xxx&destinoId=yyy&viaId=via1
```

### Database Query

**Before** (single via):
```sql
SELECT * FROM Transporte WHERE viaId = 'VIA-MGARE-BAI-VAR1'
```

**After** (multiple vias):
```sql
SELECT * FROM Transporte WHERE viaId IN ('VIA-MGARE-BAI-VAR1', 'VIA-MGARE-BAI-VAR2', ...)
```

## Impact on Results

### Example: Matola Gare → Baixa

**Before** (selecting Via A only):
- Shows: 5 buses from VIA-MGARE-BAI-VAR1
- Misses: 20 buses from other variants

**After** (automatic search across all variants):
- Shows: 25 buses from all 5 variants
- Complete coverage

## Files Modified

1. `transport-client/app/search/page.tsx`
   - Added route grouping logic
   - Modified selector to show unique routes
   - Updated API call to pass multiple via IDs

2. `transport-client/app/api/buses/route.ts`
   - Added `viaIds` parameter support
   - Modified query to search multiple vias
   - Maintained backward compatibility

## Testing

### Test Cases

1. ✅ Select route with multiple variants → Shows all buses
2. ✅ Select route with single variant → Works correctly
3. ✅ Legacy API calls with `viaId` → Still work
4. ✅ New API calls with `viaIds` → Work correctly
5. ✅ Stops from all variants → Displayed correctly

### Verification

```bash
# Check unique routes in selector
# Should show: "Matola Gare → Baixa" (once)
# Not: "Matola Gare → Baixa (Via A)", "(Via B)", etc.

# Check API response
# Should include buses from all via variants
```

## Commits

### Transport-Client Submodule
**Commit**: `ee084d1`
```
Fix: Show unique routes in selector without Via variants
- Groups all vias by route (terminalPartida → terminalChegada)
- API searches across all vias that serve the selected route
- Changed label from 'Via / Rota' to 'Rota'
```

### Main Repository
**Commit**: `e9dc288`
```
Update transport-client: Unique route selector without Via variants
```

## Summary

✅ **Cleaner UI** - No more duplicate route entries
✅ **Better UX** - Simple, intuitive route selection
✅ **More results** - Searches all via variants automatically
✅ **Backward compatible** - Legacy API calls still work
✅ **Pushed to GitHub** - All changes committed

---

**Date**: May 5, 2026
**Status**: ✅ Complete
**Impact**: Improved user experience, cleaner interface
