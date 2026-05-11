# Assign Transportes to Vias - Instructions

## Overview
This will assign each transporte to a via and set the transporte's location to the start of the via's path.

## How to Run

### Option 1: Using the API Endpoint (Recommended)

1. **Start the development server**:
   ```bash
   cd transport-admin
   npm run dev
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:3000/dashboard
   ```

3. **Open the browser console** (F12 → Console tab)

4. **Run this command** in the console:
   ```javascript
   fetch('/api/assign-transportes', { method: 'POST' })
     .then(res => res.json())
     .then(data => console.log(data))
   ```

5. **Check the response** - You should see:
   ```json
   {
     "success": true,
     "message": "All transportes assigned to vias successfully!",
     "stats": {
       "totalVias": 111,
       "totalTransportes": 111,
       "assigned": 111,
       "avgPerVia": "1.0",
       "maputo": { ... },
       "matola": { ... },
       "topVias": [ ... ],
       "verification": {
         "transportesWithVia": 111,
         "transportesWithLocation": 111,
         "allAssigned": true,
         "allHaveLocation": true
       }
     }
   }
   ```

### Option 2: Using cURL

```bash
curl -X POST http://localhost:3000/api/assign-transportes
```

### Option 3: Using Postman

1. Create a new POST request
2. URL: `http://localhost:3000/api/assign-transportes`
3. Click "Send"

## What It Does

1. **Gets all vias** (111 total: 70 Maputo, 41 Matola)
2. **Gets all transportes** (111 total)
3. **Distributes transportes evenly** across vias (cycles through vias)
4. **Sets transporte location** to the start point of the via
5. **Updates database** with via assignment and location

## Expected Results

### Distribution
- **Total transportes**: 111
- **Total vias**: 111
- **Average per via**: 1.0 transporte per via
- **Maputo**: ~70 transportes across 70 vias
- **Matola**: ~41 transportes across 41 vias

### Location Format
- **Via path format**: `lng,lat;lng,lat;...` (longitude first)
- **Transporte location format**: `lat,lng` (latitude first)
- **Example**: Via path starts at `32.5892,-25.9655` → Transporte location set to `-25.9655,32.5892`

### Database Updates
Each transporte will have:
- `viaId`: ID of the assigned via
- `codigoVia`: Code of the assigned via
- `currGeoLocation`: Start coordinates of the via (lat,lng format)

## Verification

After running, check:

1. **Dashboard graphs** should now show transportes per via
2. **Top Vias graph** should show counts > 0
3. **Via details pages** should show assigned transportes
4. **Map** should show transporte locations at via start points

## Troubleshooting

### Error: "Can't reach database server"
- Make sure the dev server is running (`npm run dev`)
- Check your `.env` file has correct `DATABASE_URL`
- Try restarting the dev server

### Error: "No vias found"
- Run the via creation scripts first
- Verify vias exist: `node check-vias-distribution.js`

### Error: "No transportes found"
- Check if transportes exist in database
- Verify seed data was loaded

## Rollback

If you need to unassign all transportes:

```javascript
fetch('/api/unassign-transportes', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log(data))
```

(Note: You'll need to create this endpoint if needed)

## Manual Verification

Check the database directly:

```sql
-- Count transportes with vias
SELECT COUNT(*) FROM "Transporte" WHERE "viaId" IS NOT NULL;

-- Count transportes with locations
SELECT COUNT(*) FROM "Transporte" WHERE "currGeoLocation" IS NOT NULL;

-- Top vias with most transportes
SELECT v.nome, COUNT(t.id) as count
FROM "Via" v
LEFT JOIN "Transporte" t ON t."viaId" = v.id
GROUP BY v.id, v.nome
ORDER BY count DESC
LIMIT 10;
```

## Success Indicators

✅ All 111 transportes assigned to vias
✅ All 111 transportes have locations
✅ Dashboard "Top Vias" shows counts
✅ Via details pages show transportes
✅ Map shows transporte markers at via starts

## Next Steps

After assignment:
1. View dashboard to see updated graphs
2. Click on vias to see assigned transportes
3. Check map for transporte locations
4. Test real-time tracking features
