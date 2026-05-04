# Quick Reference Guide

## System Status

✅ **PRODUCTION READY**  
✅ **All 28 routes have buses** (76 total)  
✅ **100% data quality**  
✅ **0 critical issues**

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Routes | 28 |
| Stops | 59 |
| Buses | 76 |
| Relations | 124 |
| Data Quality | 100% |

---

## API Endpoints

### Webapp

```bash
# Get all buses
GET /api/buses

# Get buses by stop and route
GET /api/buses?paragemId=X&viaId=Y

# Get single bus
GET /api/bus/[id]
```

### USSD

```bash
# Service code
*384*123#
```

---

## Shared Service

```typescript
// Import
import { 
  getBusLocation, 
  getAllBusesWithLocations,
  getCurrentStreetLocation 
} from '@/lib/busLocationService';

// Get single bus
const bus = await getBusLocation(busId);

// Get all buses
const buses = await getAllBusesWithLocations();

// Get street location
const location = getCurrentStreetLocation(routeCode, progress);
```

---

## Verification Scripts

```bash
# Check routes have buses
node check-routes-buses.js

# Verify data sync
node verify-data-sync.js

# Fix data issues
node fix-data-issues.js
```

---

## Common Tasks

### Add New Route
1. Add route to database (Via table)
2. Add stops to route (ViaParagem table)
3. Add buses to route (Transporte table)
4. Add street waypoints to `lib/busLocationService.ts`

### Add New Bus
1. Create bus in Transporte table
2. Link to route (viaId)
3. Set initial location (currGeoLocation)
4. Create GeoLocation record

### Update Street Waypoints
1. Edit `lib/busLocationService.ts`
2. Find route in `routePathsWithStreets`
3. Update waypoints array
4. Test with `getCurrentStreetLocation()`

---

## Troubleshooting

### No buses showing
- Check database: `node check-routes-buses.js`
- Verify API: `curl http://localhost:3000/api/buses`
- Check logs for errors

### Wrong street location
- Verify route code in `routePathsWithStreets`
- Check waypoints are correct
- Test progress calculation (0-1)

### USSD not working
- Check Africa's Talking credentials
- Verify callback URL is set
- Check logs: `console.log('📱 USSD Request:', ...)`

---

## Environment Variables

```env
DATABASE_URL="postgresql://..."
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="atsk_..."
TELERIVET_SECRET="..."
```

---

## Documentation

- **FINAL_SYSTEM_STATUS.md** - Complete system overview
- **WEBAPP_USSD_UPDATE_COMPLETE.md** - Latest updates
- **DATA_SYNC_VERIFICATION_COMPLETE.md** - Data verification
- **ROUTE_STOPS_AND_SHARED_SERVICE_COMPLETE.md** - Implementation details

---

## Support

- **Email**: info@transporte.mz
- **USSD**: `*384*123#`
- **Webapp**: Your domain

---

**Last Updated**: May 4, 2026  
**Status**: ✅ PRODUCTION READY
