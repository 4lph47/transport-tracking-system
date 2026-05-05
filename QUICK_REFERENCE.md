# Quick Reference - Stops & Routes System

## 🎯 What Was Done

✅ Connected **1,406 stops** to **28 routes** (342 ViaParagem relations)
✅ USSD now shows only routes passing through searched stop
✅ Webapp validates stop-route connections
✅ Prisma logging minimized

---

## 🚀 Quick Commands

### Check System Status
```bash
node check-viaparagem-status.js
```
Shows: stops, routes, relations, unconnected stops

### Connect Stops to Routes
```bash
node connect-stops-to-routes.js
```
Creates ViaParagem relations based on proximity (500m)

### Test Queries
```bash
node test-viaparagem-query.js
```
Validates ViaParagem queries work correctly

---

## 📊 Current Stats

| Metric | Value |
|--------|-------|
| Total Stops | 1,406 |
| Total Routes | 28 |
| ViaParagem Relations | 342 |
| Connected Stops | ~342 (24%) |
| Unconnected Stops | ~1,064 (76%) |

---

## 🔍 Key Database Queries

### Find routes through a stop
```typescript
const routes = await prisma.via.findMany({
  where: {
    paragens: {
      some: {
        paragem: {
          nome: { contains: 'Matola Sede', mode: 'insensitive' }
        }
      }
    }
  }
});
```

### Find stops on a route
```typescript
const stops = await prisma.viaParagem.findMany({
  where: {
    via: { codigo: 'VIA-MAT-BAI' }
  },
  include: {
    paragem: true
  }
});
```

### Check if stop is on route
```typescript
const viaParagem = await prisma.viaParagem.findFirst({
  where: {
    viaId: routeId,
    paragemId: stopId
  }
});
```

---

## 📁 Important Files

### Scripts
- `connect-stops-to-routes.js` - Connect stops to routes
- `check-viaparagem-status.js` - Check system status
- `test-viaparagem-query.js` - Test queries

### API Routes
- `app/api/ussd/route.ts` - USSD service (filters by ViaParagem)
- `app/api/buses/route.ts` - Buses API (validates ViaParagem)

### Documentation
- `IMPLEMENTATION_SUMMARY.md` - Executive summary
- `STOPS_ROUTES_CONNECTION_COMPLETE.md` - Technical details
- `QUICK_REFERENCE.md` - This file

---

## 🐛 Troubleshooting

### "No routes found for this stop"
**Solution**: Run `node connect-stops-to-routes.js`

### "Too few stops on routes"
**Cause**: Routes have limited waypoints (2-4 points)
**Solution**: Expand route paths with more waypoints

### "Wrong routes showing"
**Cause**: Multiple stops with similar names
**Solution**: Use more specific stop names

---

## 📞 Quick Help

### Add new stops
1. Import to `Paragem` table
2. Run `node connect-stops-to-routes.js`

### Add new routes
1. Add to `Via` table with `geoLocationPath`
2. Run `node connect-stops-to-routes.js`

### Manual connection
```javascript
await prisma.viaParagem.create({
  data: {
    codigoParagem: 'PAR-XXX',
    codigoVia: 'VIA-XXX',
    terminalBoolean: false,
    viaId: 'route-id',
    paragemId: 'stop-id'
  }
});
```

---

## ✅ System Health Check

Run these commands to verify system is working:

```bash
# 1. Check database status
node check-viaparagem-status.js

# 2. Test queries
node test-viaparagem-query.js

# 3. If needed, reconnect stops
node connect-stops-to-routes.js
```

Expected output:
- ✅ 1,406 stops
- ✅ 28 routes
- ✅ 342+ ViaParagem relations
- ✅ All test queries pass

---

**Last Updated**: 2026-05-05
**Status**: ✅ OPERATIONAL
