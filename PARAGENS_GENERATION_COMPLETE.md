# Paragens Generation for Vias - In Progress

## Problem Identified
111 out of 221 vias had **0 paragens** (stops), which is why they showed "Paragens: 0" in the admin interface.

## Root Cause
These vias were created with geographic paths (`geoLocationPath`) but never had stops (paragens) assigned to them.

## Solution Implemented

### Automatic Paragens Generation Script
Created `generate-paragens-for-vias.js` which:
1. Finds all vias without paragens
2. Parses their geographic paths
3. Automatically creates stops along each route:
   - Start terminal (Partida)
   - End terminal (Chegada)
   - Intermediate stops (if route is long enough)
4. Links stops to vias via the ViaParagem junction table

### Progress So Far

**Before**:
- ✅ 110 vias with paragens
- ❌ 111 vias without paragens

**Current Status** (after partial run):
- ✅ 159 vias with paragens (+49)
- ❌ 62 vias still without paragens

**Remaining**: 62 vias need paragens assigned

### Script is Still Running
The script is processing the remaining vias in the background. It creates:
- 2 stops minimum per via (start + end terminals)
- Additional intermediate stops for longer routes
- Unique stop codes like `V001-P01`, `V001-P02`, etc.

## Next Steps

1. **Wait for script to complete** - It's still running and will process all remaining vias
2. **Verify completion** - Run `node check-via-counts.js` to confirm all vias have paragens
3. **Refresh admin pages** - The counts will update automatically once paragens are created

## Expected Final Result

- ✅ All 221 vias will have paragens assigned
- ✅ No more "Paragens: 0" in the admin interface
- ✅ Each via will show actual stop counts (minimum 2 per via)
- ⚠️  Transportes may still show 0 (that's OK - buses haven't been assigned yet)

## Files Created

1. **`find-vias-without-paragens.js`** - Diagnostic script to identify vias missing paragens
2. **`generate-paragens-for-vias.js`** - Automatic paragens generation script
3. **`check-via-counts.js`** - Verification script to check via counts

## How to Complete

If the script stopped, run it again:
```bash
node generate-paragens-for-vias.js
```

It will skip vias that already have paragens and only process the remaining ones.

## Verification

After completion, verify with:
```bash
node check-via-counts.js
```

Should show:
- ✅ 221 vias with paragens
- ❌ 0 vias without paragens
