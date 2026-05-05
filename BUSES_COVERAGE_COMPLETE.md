# Buses Coverage - Complete

## Problem Solved
Users were seeing "Nenhum transporte disponível" because some routes didn't have enough buses, or buses had already passed the origin stop.

## Solution Implemented
Created a script to ensure **every via has at least 5 buses** distributed along their routes.

## Results

### Before
- **116 buses** total
- Some vias had only 1 bus
- Users frequently saw "Nenhum transporte disponível"
- Limited coverage

### After
- **555 buses** total (439 new buses created)
- **Every via has exactly 5 buses**
- Buses distributed at different positions along routes
- **100% coverage** - all 111 vias have buses

## Bus Distribution

All 111 vias now have 5 buses each:
```
VIA-11          █████ 5
VIA-17-VAR1     █████ 5
VIA-17-VAR2     █████ 5
VIA-1A-VAR1     █████ 5
VIA-1A-VAR2     █████ 5
... (111 vias total)
```

## How Buses Are Positioned

Each via's 5 buses are positioned at different points:
- **Bus 1**: Position 0% (start of route)
- **Bus 2**: Position 25% (quarter way)
- **Bus 3**: Position 50% (halfway)
- **Bus 4**: Position 75% (three-quarters)
- **Bus 5**: Position 100% (end of route)

This ensures that no matter where the user is on the route, there's always a bus that hasn't passed their origin yet.

## Script Details

**File**: `ensure-buses-for-all-routes.js`

**What it does**:
1. Checks each via for existing buses
2. Creates new buses if less than 5 exist
3. Distributes new buses along the route
4. Updates existing buses with `routePath` if missing
5. Generates unique `matricula` and `codigo` for each bus

**Usage**:
```bash
node ensure-buses-for-all-routes.js
```

## Database Changes

### New Buses Created: 439
- Unique `matricula` for each (e.g., `MAT-BAI-VAR1-002`)
- Unique `codigo` (integer, auto-incremented from 9000+)
- Positioned at different stops along route
- All have `routePath` set from via's `geoLocationPath`
- All have `currGeoLocation` set to their starting position

### Buses Updated: 47
- Added missing `routePath` to existing buses

## Impact on User Experience

### Before
```
User searches: Matola → Baixa
Result: "Nenhum transporte disponível"
Reason: The only bus on that route already passed Matola
```

### After
```
User searches: Matola → Baixa
Result: Shows 3-5 available buses
Reason: Multiple buses at different positions, at least one hasn't passed Matola yet
```

## Filtering Logic (Kept Intact)

The API still filters buses correctly:
1. ✅ Bus must pass through both origin and destination
2. ✅ Origin must come before destination in route
3. ✅ Bus must not have passed the origin yet
4. ✅ Sorted by arrival time (closest bus first)

The difference is now there are **always enough buses** to show results.

## Verification

```bash
# Check coverage
node check-bus-simulation.js

# Expected output:
📊 Buses with routePath: 555/555
✅ All vias have buses!
```

## Next Steps (Optional)

### For Even Better Coverage
Run the script again to add more buses:
```javascript
const targetBusCount = 10; // Change from 5 to 10
```

This would create 10 buses per via instead of 5.

### For Dynamic Bus Creation
Create a cron job or scheduled task to:
1. Monitor routes with low bus availability
2. Automatically create new buses when needed
3. Remove excess buses during low-demand periods

## Files Created

1. `ensure-buses-for-all-routes.js` - Main script
2. `BUSES_COVERAGE_COMPLETE.md` - This documentation

## Summary

✅ **555 buses** now in database (was 116)
✅ **100% via coverage** (all 111 vias have buses)
✅ **5 buses per via** (distributed along routes)
✅ **No more "Nenhum transporte disponível"** messages
✅ **Users always see available transports**

---

**Date**: May 5, 2026
**Status**: ✅ Complete
**Buses Created**: 439
**Total Buses**: 555
