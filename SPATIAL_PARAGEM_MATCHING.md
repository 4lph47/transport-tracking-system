# Spatial Paragem Matching - Automatic Assignment

## Overview

These scripts automatically assign paragens (stops) to vias (routes) based on geographic proximity. If a via's route passes through or near a paragem location, that paragem will be automatically linked to the via.

## How It Works

### Distance Calculation
Uses the **Haversine formula** to calculate the shortest distance between a paragem's coordinates and each segment of a via's route path.

### Matching Algorithm
1. Parse each via's `geoLocationPath` into coordinate segments
2. For each paragem, calculate the distance to every segment of every via
3. If the distance is within the threshold (default: 100-150m), create a match
4. Create `ViaParagem` relationships for all matches

### Terminal Detection
Automatically detects if a paragem is a terminal stop based on:
- Name contains "terminal", "partida", or "chegada"
- Name matches via's `terminalPartida` or `terminalChegada`

## Scripts

### 1. `assign-paragens-to-vias-by-location.js`
**Approach:** Via-centric (processes each via and finds matching paragens)

**Best for:**
- Assigning stops to specific vias
- When you want to see which stops each via picks up
- Ensuring all vias have adequate stop coverage

**Configuration:**
```javascript
const DISTANCE_THRESHOLD = 100; // meters
const DRY_RUN = false; // Set true to preview
```

**Usage:**
```bash
node assign-paragens-to-vias-by-location.js
```

**Output Example:**
```
📍 Processing: V001 - Maputo-Matola
   📊 Route has 245 coordinates
   🎯 Found 12 matching paragens
   ✅ Assigned: P001 - Praça dos Trabalhadores (45m away)
   ✅ Assigned: P002 - Avenida Julius Nyerere (78m away)
   ...
   ✅ Assigned 12 paragens to V001
```

### 2. `match-paragens-to-vias-spatial.js`
**Approach:** Paragem-centric (processes each paragem and finds matching vias)

**Best for:**
- Ensuring all stops are assigned to appropriate vias
- Finding all vias that pass through a specific area
- More comprehensive matching (one stop can match multiple vias)

**Configuration:**
```javascript
const DISTANCE_THRESHOLD = 150; // meters
const MIN_MATCHES = 1; // Minimum matching segments
const DRY_RUN = false; // Set true to preview
const SHOW_DETAILS = true; // Show detailed output
```

**Usage:**
```bash
node match-paragens-to-vias-spatial.js
```

**Output Example:**
```
🚏 P001 - Praça dos Trabalhadores
   Matches 3 via(s):
   ✅ V001 - Maputo-Matola (45m, 2 segments)
   ✅ V002 - Polana - Machava (67m, 1 segments)
   ✅ V003 - Sommerschield - Matola Rio (89m, 1 segments)
```

## Distance Thresholds

### Recommended Values

| Threshold | Use Case |
|-----------|----------|
| 50m | Very strict - only stops directly on route |
| 100m | Standard - typical walking distance |
| 150m | Relaxed - includes nearby stops |
| 200m | Very relaxed - may include false positives |

### Factors to Consider
- **Urban areas:** Use smaller threshold (50-100m) due to dense stop placement
- **Rural areas:** Use larger threshold (150-200m) due to sparse stops
- **Route accuracy:** If GPS paths are approximate, use larger threshold
- **Stop density:** More stops = smaller threshold to avoid over-matching

## Workflow

### Initial Setup (First Time)
```bash
# 1. Preview what would be assigned (dry run)
# Edit script: DRY_RUN = true
node match-paragens-to-vias-spatial.js

# 2. Review the output and adjust DISTANCE_THRESHOLD if needed

# 3. Run for real
# Edit script: DRY_RUN = false
node match-paragens-to-vias-spatial.js

# 4. Verify results
node check-via-counts.js
```

### Adding New Stops
When you add new paragens to the database:
```bash
# Run spatial matching to assign them to vias
node match-paragens-to-vias-spatial.js
```

### Adding New Vias
When you add new vias to the database:
```bash
# Run via-centric matching to find stops along the route
node assign-paragens-to-vias-by-location.js
```

## Technical Details

### Haversine Formula
Calculates great-circle distance between two points on Earth:
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}
```

### Point-to-Line-Segment Distance
Finds the closest point on a line segment to a given point:
1. Project the point onto the infinite line
2. Clamp the projection to the segment endpoints
3. Calculate distance from point to clamped position

### Data Structure

**Via GeoLocationPath Format:**
```
"lng1,lat1;lng2,lat2;lng3,lat3;..."
```

**Paragem GeoLocation Format:**
```
"lat,lng"
```

**ViaParagem Relationship:**
```javascript
{
  viaId: string,
  paragemId: string,
  codigoVia: string,
  codigoParagem: string,
  terminalBoolean: boolean
}
```

## Performance

### Optimization Tips
1. **Batch processing:** Scripts process all matches before committing
2. **Skip existing:** Automatically skips already-linked paragens
3. **Early filtering:** Vias without valid routes are filtered out first
4. **Spatial indexing:** Consider adding PostGIS for large datasets

### Expected Runtime
- 221 vias × 1000 paragens = ~221,000 comparisons
- Typical runtime: 30-60 seconds
- With 10,000 paragens: 2-5 minutes

## Troubleshooting

### No Matches Found
**Possible causes:**
- Distance threshold too small
- Coordinate format mismatch (lat/lng vs lng/lat)
- Invalid coordinates in database
- Route path not properly formatted

**Solutions:**
- Increase `DISTANCE_THRESHOLD`
- Verify coordinate formats
- Check for NaN values in coordinates
- Validate `geoLocationPath` format

### Too Many Matches
**Possible causes:**
- Distance threshold too large
- Stops very close together
- Route passes through dense areas

**Solutions:**
- Decrease `DISTANCE_THRESHOLD`
- Increase `MIN_MATCHES` requirement
- Filter by municipio/region

### Duplicate Assignments
**Handled automatically:**
- Scripts catch `P2002` (unique constraint) errors
- Already-linked paragens are skipped
- Safe to run multiple times

## Examples

### Example 1: Standard Urban Routes
```bash
# Configuration
DISTANCE_THRESHOLD = 100m
MIN_MATCHES = 1

# Result
Via V001: 45 paragens assigned
Via V002: 38 paragens assigned
Average: 35 paragens per via
```

### Example 2: Rural/Highway Routes
```bash
# Configuration
DISTANCE_THRESHOLD = 200m
MIN_MATCHES = 1

# Result
Via V050: 12 paragens assigned
Via V051: 8 paragens assigned
Average: 10 paragens per via
```

### Example 3: Strict Matching
```bash
# Configuration
DISTANCE_THRESHOLD = 50m
MIN_MATCHES = 2

# Result
Via V001: 18 paragens assigned (only stops directly on route)
Via V002: 15 paragens assigned
Average: 12 paragens per via
```

## Integration with Admin Panel

After running spatial matching, the admin panel will automatically show:
- Updated paragem counts on vias list page
- All assigned paragens on via detail page
- Paragens marked on route map
- Terminal indicators for start/end stops

## Future Enhancements

1. **Direction-aware matching:** Only assign stops in the direction of travel
2. **Stop ordering:** Automatically order stops by position along route
3. **Duplicate detection:** Merge stops that are very close together
4. **Route optimization:** Suggest route adjustments to include more stops
5. **Real-time matching:** Assign stops automatically when creating new vias
6. **Web interface:** Admin panel UI for manual stop assignment/removal

## Related Files

- `generate-paragens-for-vias.js` - Creates terminal stops for vias
- `check-via-counts.js` - Verifies paragem assignments
- `transport-admin/app/vias/[id]/page.tsx` - Via detail page showing stops
- `transport-admin/app/api/vias/[id]/route.ts` - API for via data

## Summary

These spatial matching scripts solve the problem of manually assigning stops to routes by automatically detecting when a route passes through a stop location. This ensures:
- ✅ All vias have appropriate stops assigned
- ✅ Stops are assigned to all relevant vias
- ✅ Terminal stops are properly identified
- ✅ Geographic accuracy is maintained
- ✅ Manual assignment work is minimized
