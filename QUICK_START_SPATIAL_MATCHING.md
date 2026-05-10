# Quick Start: Spatial Paragem Matching

## What Does This Do?

Automatically assigns paragens (stops) to vias (routes) when the route passes through or near the stop location.

## Quick Commands

### Check Current Status
```bash
node check-via-counts.js
```
Shows how many paragens each via has.

### Assign Stops to Routes (Recommended)
```bash
node match-paragens-to-vias-spatial.js
```
- Checks each stop and assigns it to all routes that pass nearby
- Distance threshold: 150 meters
- One stop can be assigned to multiple routes

### Alternative: Route-Centric Matching
```bash
node assign-paragens-to-vias-by-location.js
```
- Checks each route and finds nearby stops
- Distance threshold: 100 meters
- Faster but less comprehensive

## Configuration

Edit the script file to change settings:

```javascript
const DISTANCE_THRESHOLD = 150; // meters (50-200 recommended)
const DRY_RUN = false; // Set true to preview without changes
const SHOW_DETAILS = true; // Show detailed output
```

## Distance Thresholds

| Distance | Use Case |
|----------|----------|
| 50m | Very strict - only stops directly on route |
| 100m | Standard - typical walking distance |
| 150m | Relaxed - includes nearby stops (recommended) |
| 200m | Very relaxed - may include false positives |

## Workflow

### First Time
```bash
# 1. Preview (optional)
# Edit script: DRY_RUN = true
node match-paragens-to-vias-spatial.js

# 2. Run for real
# Edit script: DRY_RUN = false
node match-paragens-to-vias-spatial.js

# 3. Verify
node check-via-counts.js
```

### After Adding New Stops
```bash
node match-paragens-to-vias-spatial.js
```

### After Adding New Routes
```bash
node assign-paragens-to-vias-by-location.js
```

## What You'll See

### Example Output
```
🚏 OSM-6785767159 - Fábrica De Cimento (N2)
   Matches 8 via(s):
   ✅ VIA-038 - Maputo Centro - Boane (1) (6m, 8 segments)
   ✅ VIA-039 - Maputo Centro - Boane (2) (6m, 8 segments)
   ...
```

This means:
- Stop "Fábrica De Cimento" was found
- It matches 8 different routes
- It's 6 meters from the route
- It matches 8 segments of the route

### Summary
```
📊 Summary:
   Paragens processed: 450
   Paragens with matches: 380
   Total assignments made: 1,250
   Average assignments per matched paragem: 3.3
```

## Troubleshooting

### No Matches Found
- Increase `DISTANCE_THRESHOLD` (try 200m)
- Check if coordinates are valid
- Verify route paths exist

### Too Many Matches
- Decrease `DISTANCE_THRESHOLD` (try 50m)
- Check for coordinate format issues

### Script Times Out
- Normal for large datasets (963 stops × 221 routes)
- Let it run in background
- Check results with `node check-via-counts.js`

## Safety Features

- ✅ Safe to run multiple times (skips existing assignments)
- ✅ Dry-run mode to preview changes
- ✅ Duplicate prevention
- ✅ Error handling for invalid data
- ✅ No data deletion (only adds relationships)

## View Results

### Admin Panel
1. Navigate to `/vias` in the admin panel
2. Click on any via to see details
3. View all assigned paragens on the map
4. See paragem count in statistics

### Database Query
```javascript
// Get via with all paragens
const via = await prisma.via.findUnique({
  where: { id: 'via-id' },
  include: {
    paragens: {
      include: {
        paragem: true
      }
    }
  }
});
```

## Need Help?

See detailed documentation:
- `SPATIAL_PARAGEM_MATCHING.md` - Full technical details
- `SPATIAL_MATCHING_COMPLETE.md` - Implementation summary
