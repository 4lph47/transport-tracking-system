# Bus Simulation Fix - Buses Not Following Roads

## Problem Identified

**Root Cause**: The bus simulation is NOT running. Buses are showing static positions from the last simulation run (May 4, 22:10).

### Evidence
```
📊 Buses with routePath: 69/116
⏰ GeoLocations updated in last 5 minutes: 0
Last update: Mon May 04 2026 22:10:33 GMT+0200
```

## Why Buses Appear Static

1. **Simulation Not Active**: The `startBusSimulation()` function is not running
2. **Static Coordinates**: Buses show last known positions from database
3. **No Road Following**: Without active simulation, buses don't move along OSRM routes

## How the System Should Work

### Correct Flow:
1. **Startup** → `/api/startup` is called when app loads
2. **Initialize** → `initializeBusPositions()` fetches OSRM routes for each bus
3. **Simulate** → `startBusSimulation(30000)` updates positions every 30 seconds
4. **Update DB** → Each bus's `currGeoLocation` is updated with interpolated position along OSRM route
5. **Display** → Main page reads `currGeoLocation` and shows buses on roads

### Current Flow (BROKEN):
1. ✅ **Startup** → `/api/startup` is called
2. ✅ **Initialize** → Positions initialized (69 buses have routePath)
3. ❌ **Simulate** → Simulation stops or never starts properly
4. ❌ **Update DB** → No updates (last update was yesterday)
5. ❌ **Display** → Shows static positions

## The Simulation Code (CORRECT)

The simulation code in `lib/busSimulator.ts` is **CORRECT**:

```typescript
// ✅ Fetches OSRM routes that follow roads
async function getRouteFromOSRM(waypoints: [number, number][]): Promise<[number, number][]>

// ✅ Interpolates position along route
function interpolatePosition(start: [number, number], end: [number, number], progress: number)

// ✅ Updates database with new position
await prisma.transporte.update({
  where: { id: transporteId },
  data: { currGeoLocation: newPosition },
});
```

## Why Simulation Might Stop

### Possible Causes:

1. **Server Restart**: Simulation runs in-memory, lost on restart
2. **Error in Loop**: Exception in `updateBusPosition()` breaks the interval
3. **OSRM Timeout**: Slow OSRM responses during initialization
4. **Memory Issue**: Process killed due to memory constraints

### Evidence from Code:

```typescript
// Simulation uses setInterval - stops if process restarts
simulationInterval = setInterval(async () => {
  // Updates every 30 seconds
}, 30000);
```

## Solution

### Option 1: Restart the Simulation (Quick Fix)

**Run this command:**
```bash
node restart-simulation.js
```

This calls `/api/startup` which will:
- Re-initialize bus positions with OSRM routes
- Restart the simulation interval
- Begin updating positions every 30 seconds

### Option 2: Make Simulation Persistent (Long-term Fix)

**Problem**: Simulation stops when server restarts (Vercel serverless functions)

**Solutions**:

#### A. Use Vercel Cron Jobs
```typescript
// vercel.json
{
  "crons": [{
    "path": "/api/simulation",
    "schedule": "*/1 * * * *" // Every minute
  }]
}
```

#### B. Use External Service (Recommended for Production)
- Deploy simulation as separate service (Railway, Render, Fly.io)
- Use persistent process (PM2, systemd)
- Call API to update positions

#### C. Client-Side Simulation (Not Recommended)
- Move simulation to client
- Each user simulates independently
- Inconsistent state across users

## Verification Steps

### 1. Check if Simulation is Running

```bash
node check-bus-simulation.js
```

Look for:
```
⏰ GeoLocations updated in last 5 minutes: [should be > 0]
```

### 2. Restart Simulation

```bash
node restart-simulation.js
```

### 3. Wait 30 Seconds and Check Again

```bash
node check-bus-simulation.js
```

Should see recent updates.

### 4. Check Main Page

- Open `http://localhost:3000`
- Buses should be moving along roads
- Positions update every 10 seconds (polling)

## Why Main Page Code is Correct

The main page (`app/page.tsx`) is **CORRECT**:

```typescript
// ✅ Fetches buses from API
fetch('/api/buses')

// ✅ Uses actual database coordinates
latitude: currentLat,  // From currGeoLocation
longitude: currentLng,

// ✅ Updates markers without flickering
if (distance > 0.0001) { // Only update if moved significantly
  existingMarker.setLngLat(newLngLat);
}
```

## Why busLocationService is Correct

The service (`lib/busLocationService.ts`) is **CORRECT**:

```typescript
// ✅ Reads actual position from database (updated by simulation)
if (bus.currGeoLocation) {
  [currentLat, currentLng] = bus.currGeoLocation.split(',').map(Number);
}

// ✅ Returns coordinates for display
return {
  latitude: currentLat,
  longitude: currentLng,
  // ...
};
```

## Summary

| Component | Status | Issue |
|-----------|--------|-------|
| Simulation Code | ✅ Correct | Follows roads using OSRM |
| Main Page | ✅ Correct | Displays actual coordinates |
| Bus Service | ✅ Correct | Reads from database |
| **Simulation Process** | ❌ **NOT RUNNING** | **Needs restart** |

## Action Required

**Immediate**: Restart the simulation
```bash
node restart-simulation.js
```

**Long-term**: Implement persistent simulation (Vercel Cron or external service)

## Expected Behavior After Fix

1. Buses move along roads (OSRM routes)
2. Positions update every 30 seconds in database
3. Main page shows moving buses (polls every 10 seconds)
4. No flickering (stable sort order + distance threshold)
5. Buses follow actual streets (not straight lines)

---

**Created**: May 5, 2026
**Status**: Simulation not running - needs restart
