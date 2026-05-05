# Multiple Vias Solution - Complete

## Problem Identified

Multiple buses (AAA-1055B, AAA-1056C, AAA-1054A) were all assigned to the same `viaId`, resulting in identical:
- Distance (11.4 km)
- Time (16 min)
- Price (115 MT)
- Route path on map

This was a **database issue**, not a code issue. All 3 buses shared the same Via record.

## Solution Implemented

Created a script (`create-multiple-vias-for-route.js`) that:

1. **Created 3 unique Via records** for the same origin-destination (Magoanine-Baixa) but with different paths:
   - **Via Zimpeto** (VIA-MAG-BAI-1) - Blue (#3B82F6)
   - **Via Hulene** (VIA-MAG-BAI-2) - Green (#10B981)
   - **Via Mussumbuluco** (VIA-MAG-BAI-3) - Orange (#F59E0B)

2. **Each Via has unique characteristics**:
   - Different paragens (stops)
   - Different geoLocationPath (street coordinates)
   - Different colors for map visualization
   - Different route lengths

3. **Reassigned buses** to unique vias:
   - AAA-1055B → Magoanine-Baixa (Via Zimpeto)
   - AAA-1056C → Magoanine-Baixa (Via Hulene)
   - AAA-1054A → Magoanine-Baixa (Via Mussumbuluco)

## Results

### Before (All buses identical):
```
AAA-1055B: 11.4 km, 16 min, 115 MT
AAA-1056C: 11.4 km, 16 min, 115 MT
AAA-1054A: 11.4 km, 16 min, 115 MT
```

### After (Each bus unique):
```
AAA-1055B (Via Zimpeto):       15.5 km, 21 min, 155 MT
AAA-1056C (Via Hulene):        12.5 km, 17 min, 126 MT
AAA-1054A (Via Mussumbuluco):  21.5 km, 29 min, 216 MT
```

## Route Details

### 1. Magoanine-Baixa (Via Zimpeto) - AAA-1055B
- **Color**: Blue (#3B82F6)
- **Distance**: 15.5 km
- **Time**: 21 minutes
- **Price**: 155 MT
- **Paragens**:
  1. Magoanine A [TERMINAL]
  2. Zimpeto
  3. Av. de Moçambique
  4. Xipamanine
  5. Praça dos Trabalhadores [TERMINAL]

### 2. Magoanine-Baixa (Via Hulene) - AAA-1056C
- **Color**: Green (#10B981)
- **Distance**: 12.5 km
- **Time**: 17 minutes
- **Price**: 126 MT
- **Paragens**:
  1. Magoanine A [TERMINAL]
  2. Hulene
  3. Maxaquene
  4. Xipamanine
  5. Praça dos Trabalhadores [TERMINAL]

### 3. Magoanine-Baixa (Via Mussumbuluco) - AAA-1054A
- **Color**: Orange (#F59E0B)
- **Distance**: 21.5 km
- **Time**: 29 minutes
- **Price**: 216 MT
- **Paragens**:
  1. Magoanine A [TERMINAL]
  2. Mussumbuluco
  3. T3 (Terminal)
  4. Av. de Moçambique
  5. Xipamanine
  6. Praça dos Trabalhadores [TERMINAL]

## Database Changes

### New Via Records Created:
- `VIA-MAG-BAI-1`: Magoanine-Baixa (Via Zimpeto)
- `VIA-MAG-BAI-2`: Magoanine-Baixa (Via Hulene)
- `VIA-MAG-BAI-3`: Magoanine-Baixa (Via Mussumbuluco)

### New Paragem Records Created:
- Av. de Moçambique (for Via Zimpeto)
- Hulene
- Maxaquene
- T3 (Terminal)
- Av. de Moçambique (for Via Mussumbuluco)

### ViaParagem Connections:
- Each Via connected to its unique set of paragens
- Terminal flags set correctly for start/end points

### Transporte Updates:
- AAA-1055B: `viaId` updated to VIA-MAG-BAI-1
- AAA-1056C: `viaId` updated to VIA-MAG-BAI-2
- AAA-1054A: `viaId` updated to VIA-MAG-BAI-3

## How to Apply to Other Routes

If you find other routes with duplicate buses, use the same approach:

1. **Identify the route** with duplicate buses
2. **Design alternative paths** with different streets/paragens
3. **Update the script** with new route configurations
4. **Run the script** to create vias and reassign buses

### Script Location:
- `create-multiple-vias-for-route.js` (root directory)
- `transport-client/create-multiple-vias-for-route.js` (copy in transport-client)

### Verification Script:
- `transport-client/verify-unique-routes.js`

## Frontend Impact

The frontend code already handles different vias correctly:
- ✅ Calculates distance based on via's paragens
- ✅ Calculates time based on distance and speed
- ✅ Calculates price based on distance (10 MT/km)
- ✅ Shows route path on map from via's geoLocationPath
- ✅ Displays via name and direction

**No frontend changes needed** - the existing code automatically adapts to the new unique vias.

## Key Principle

**Each bus can have the same origin and destination, but MUST have a different via (route) with different streets and paragens.**

This ensures:
- Realistic route diversity
- Different travel times and distances
- Varied pricing
- Unique map visualizations
- Better user experience

## Status

✅ **COMPLETE** - All 3 Magoanine-Baixa buses now have unique routes with different characteristics.

## Next Steps

1. Monitor the frontend to verify buses show different information
2. Apply the same solution to other routes if needed
3. Consider creating more route variations for popular routes
4. Update bus positions to reflect their specific routes

## Files Modified/Created

### Created:
- `create-multiple-vias-for-route.js` - Main script to create vias
- `transport-client/create-multiple-vias-for-route.js` - Copy for execution
- `transport-client/verify-unique-routes.js` - Verification script
- `MULTIPLE_VIAS_SOLUTION.md` - This documentation

### Database Tables Modified:
- `Via` - 3 new records created
- `Paragem` - 5 new records created
- `ViaParagem` - 16 new connections created
- `Transporte` - 3 records updated with new viaId

## Verification

Run the verification script to check results:
```bash
cd transport-client
node verify-unique-routes.js
```

This will show:
- Each bus's via name and code
- Route distance, time, and price
- List of paragens for each route
- Confirmation that all buses have unique vias
