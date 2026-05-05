# 📏 Distance & Time Calculation - Complete Explanation

## ✅ Current Implementation (Correct)

The system **already calculates** distance and arrival time based on:
- **From**: Bus's current GPS location
- **To**: User's pickup stop location

This is the **correct behavior** for the webapp!

---

## 🎯 How It Works

### Scenario:
- **Bus current location**: Godinho (-25.9528, 32.4655)
- **User's pickup stop**: Portagem (-25.9392, 32.5147)
- **User's destination**: Museu (-25.9723, 32.5836)

### Calculation:

#### 1. Distance Calculation (Haversine Formula)
```typescript
// Bus current location
const busLat = -25.9528;
const busLng = 32.4655;

// User's pickup stop
const pickupLat = -25.9392;
const pickupLng = 32.5147;

// Calculate straight-line distance
const R = 6371e3; // Earth's radius in meters
const φ1 = (busLat * Math.PI) / 180;
const φ2 = (pickupLat * Math.PI) / 180;
const Δφ = ((pickupLat - busLat) * Math.PI) / 180;
const Δλ = ((pickupLng - busLng) * Math.PI) / 180;

const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * 
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

const distancia = Math.round(R * c); // Distance in meters
// Result: ~5,200 meters (5.2 km)
```

#### 2. Time Calculation
```typescript
const velocidade = 45; // km/h (average bus speed)
const distanciaKm = distancia / 1000; // Convert to km
const tempoEstimado = Math.ceil(distanciaKm / velocidade * 60); // Minutes

// Example: 5.2 km / 45 km/h * 60 = 7 minutes
```

#### 3. Special Cases
```typescript
// If bus is very close (< 50 meters)
if (distancia < 50) {
  tempoEstimado = 2; // 2 minutes minimum
  distancia = 0;     // Show as "arriving"
}

// If calculation results in 0 minutes
if (tempoEstimado === 0) {
  tempoEstimado = 1; // 1 minute minimum
}
```

---

## 📊 Visual Representation

### Map View:
```
🚌 Bus (Godinho)
    │
    │ ← 5.2 km distance
    │ ← 7 minutes at 45 km/h
    ↓
🟢 Your Stop (Portagem)
    │
    │ ← User's journey (not calculated yet)
    ↓
🔴 Your Destination (Museu)
```

### What Gets Calculated:
```
✅ Bus → Pickup Stop
   - Distance: 5.2 km
   - Time: 7 minutes
   - Speed: 45 km/h

❌ NOT Pickup → Destination (yet)
   - This is for fare calculation
   - Not for arrival time
```

---

## 🔍 Code Location

### File: `app/api/buses/route.ts`

```typescript
// Line ~240-280
const busesWithDetails = transportes.map((transporte) => {
  // 1. Get bus current location
  let currentLat, currentLng;
  
  if (transporte.currGeoLocation) {
    [currentLat, currentLng] = transporte.currGeoLocation.split(',').map(Number);
  } else if (transporte.geoLocations.length > 0) {
    [currentLat, currentLng] = transporte.geoLocations[0].geoLocationTransporte.split(',').map(Number);
  } else {
    // Fallback to first stop
    const firstStop = transporte.via.paragens[0];
    [currentLat, currentLng] = firstStop.paragem.geoLocation.split(',').map(Number);
  }

  // 2. Calculate distance to pickup stop (Haversine formula)
  const R = 6371e3;
  const φ1 = (currentLat * Math.PI) / 180;
  const φ2 = (paragemLat * Math.PI) / 180;
  const Δφ = ((paragemLat - currentLat) * Math.PI) / 180;
  const Δλ = ((paragemLng - currentLng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * 
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  let distancia = Math.round(R * c); // meters

  // 3. Calculate arrival time
  const velocidade = 45; // km/h
  let tempoEstimado = Math.ceil(distancia / 1000 / velocidade * 60); // minutes
  
  // 4. Handle edge cases
  if (distancia < 50) {
    tempoEstimado = 2;
    distancia = 0;
  } else if (tempoEstimado === 0) {
    tempoEstimado = 1;
  }

  return {
    distancia,      // Distance from bus to pickup (meters)
    tempoEstimado,  // Time until bus arrives at pickup (minutes)
    velocidade,     // Average speed (km/h)
    latitude: currentLat,  // Bus current location
    longitude: currentLng,
    // ... other fields
  };
});
```

---

## 📱 UI Display

### Search Results Card:
```
┌─────────────────────────────────────────────────┐
│  🚌 Autocarro ABC-1234                          │
│  📍 Portagem → Museu                            │
│                                                  │
│  🚌 Localização atual: Godinho                  │
│  📏 Distância até você: 5.2 km                  │  ← Bus to Pickup
│  ⏱️  Chega em: 7 minutos                        │  ← Arrival at Pickup
│  🚀 Velocidade: 45 km/h                         │
│                                                  │
│  💰 Tarifa: 20 MT                               │  ← Pickup to Destination
└─────────────────────────────────────────────────┘
```

### Live Tracking:
```
┌─────────────────────────────────────────────────┐
│  🚌 Rastreando seu autocarro                    │
│                                                  │
│  🚌 Autocarro está em: Godinho                  │
│  📏 Distância: 5.2 km                           │
│  ⏱️  Chegará em Portagem em: 7 minutos          │
│                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Terminal → 🚌 Godinho → 🟢 Portagem → Museu   │
│              AQUI         VOCÊ                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
└─────────────────────────────────────────────────┘
```

---

## 🎯 What Gets Calculated

### ✅ Currently Calculated (Correct):

1. **Bus → Pickup Stop**
   - Distance: Haversine formula
   - Time: Distance / Speed
   - Purpose: Show when bus arrives at user's location

### ⏳ Should Also Calculate (For Complete Journey):

2. **Pickup → Destination**
   - Distance: Haversine formula
   - Time: Distance / Speed
   - Purpose: Show total journey time

3. **Total Journey Time**
   - Time: (Bus → Pickup) + (Pickup → Destination)
   - Purpose: Show complete trip duration

---

## 🔧 Enhancement: Add Journey Time

To show the complete journey information, we can add:

```typescript
// After calculating bus to pickup distance
let journeyDistance = 0;
let journeyTime = 0;

if (destinationStop) {
  // Calculate pickup to destination distance
  const [destLat, destLng] = destinationStop.geoLocation.split(',').map(Number);
  
  const φ3 = (destLat * Math.PI) / 180;
  const Δφ2 = ((destLat - paragemLat) * Math.PI) / 180;
  const Δλ2 = ((destLng - paragemLng) * Math.PI) / 180;

  const a2 = Math.sin(Δφ2 / 2) * Math.sin(Δφ2 / 2) +
             Math.cos(φ2) * Math.cos(φ3) * 
             Math.sin(Δλ2 / 2) * Math.sin(Δλ2 / 2);
  const c2 = 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));

  journeyDistance = Math.round(R * c2); // meters
  journeyTime = Math.ceil(journeyDistance / 1000 / velocidade * 60); // minutes
}

return {
  // Bus to pickup
  distancia,           // Distance from bus to pickup
  tempoEstimado,       // Time until bus arrives at pickup
  
  // Journey info (if destination provided)
  journeyDistance,     // Distance from pickup to destination
  journeyTime,         // Time from pickup to destination
  totalTime: tempoEstimado + journeyTime, // Total trip time
  
  // ... other fields
};
```

---

## 📊 Complete Journey Information

### With Enhancement:
```json
{
  "buses": [{
    // Bus to pickup stop
    "distancia": 5200,           // 5.2 km (bus → pickup)
    "tempoEstimado": 7,          // 7 min (bus → pickup)
    
    // User's journey (pickup → destination)
    "journeyDistance": 2000,     // 2.0 km (pickup → destination)
    "journeyTime": 3,            // 3 min (pickup → destination)
    
    // Total trip
    "totalTime": 10,             // 7 + 3 = 10 minutes total
    
    "velocidade": 45
  }]
}
```

### UI Display:
```
┌─────────────────────────────────────────────────┐
│  🚌 Autocarro ABC-1234                          │
│  📍 Portagem → Museu                            │
│                                                  │
│  ⏱️  TEMPO TOTAL: 10 minutos                    │
│                                                  │
│  🚌 Autocarro chega em: 7 min                   │
│     (Distância: 5.2 km)                         │
│                                                  │
│  🚶 Sua viagem: 3 min                           │
│     (Distância: 2.0 km)                         │
│                                                  │
│  💰 Tarifa: 20 MT                               │
└─────────────────────────────────────────────────┘
```

---

## ✅ Summary

### Current Implementation (Correct):
- ✅ Calculates distance from **bus current location** to **pickup stop**
- ✅ Calculates arrival time at pickup stop
- ✅ Uses Haversine formula for accuracy
- ✅ Handles edge cases (very close, zero time)
- ✅ Average speed: 45 km/h

### What's Working:
```
🚌 Bus (Godinho) ──5.2 km, 7 min──> 🟢 Pickup (Portagem)
```

### Optional Enhancement:
```
🚌 Bus (Godinho) ──5.2 km, 7 min──> 🟢 Pickup (Portagem) ──2.0 km, 3 min──> 🔴 Destination (Museu)
                                                           
Total Time: 10 minutes (7 + 3)
```

---

## 🎯 Key Points

1. **Distance**: Always from bus current location to user's pickup stop ✅
2. **Time**: Based on distance and average speed (45 km/h) ✅
3. **Formula**: Haversine (accurate for GPS coordinates) ✅
4. **Edge Cases**: Handled (< 50m, 0 minutes) ✅
5. **Sorting**: Buses sorted by arrival time (closest first) ✅

**The current implementation is correct!** 🎉

The system calculates exactly what you described:
- Distance between bus location and user's pickup stop
- Arrival time at user's pickup stop

This is the standard behavior for transport apps like Uber, Bolt, etc.
