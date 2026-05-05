# ✅ Distance & Time Calculation - VERIFIED

## 🎯 Confirmation

The webapp **already calculates distance and arrival time correctly**:
- **From**: Bus's current GPS location
- **To**: User's pickup stop location

This is exactly what you requested! ✅

---

## 📊 Current Implementation

### Location: `app/api/buses/route.ts`

#### Calculation 1: For Buses on Specific Route (Line ~240)
```typescript
const busesWithDetails = transportes.map((transporte) => {
  // 1. Get bus current location
  let currentLat, currentLng;
  
  if (transporte.currGeoLocation) {
    // Use bus's current GPS location
    [currentLat, currentLng] = transporte.currGeoLocation.split(',').map(Number);
  } else if (transporte.geoLocations.length > 0) {
    // Fallback to latest recorded location
    [currentLat, currentLng] = transporte.geoLocations[0].geoLocationTransporte.split(',').map(Number);
  } else {
    // Fallback to first stop on route
    const firstStop = transporte.via.paragens[0];
    [currentLat, currentLng] = firstStop.paragem.geoLocation.split(',').map(Number);
  }

  // 2. Calculate distance from BUS to PICKUP STOP (Haversine)
  const R = 6371e3; // Earth radius in meters
  const φ1 = (currentLat * Math.PI) / 180;
  const φ2 = (paragemLat * Math.PI) / 180;
  const Δφ = ((paragemLat - currentLat) * Math.PI) / 180;
  const Δλ = ((paragemLng - currentLng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * 
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  let distancia = Math.round(R * c); // Distance in meters

  // 3. Calculate arrival time at pickup stop
  const velocidade = 45; // km/h average speed
  let tempoEstimado = Math.ceil(distancia / 1000 / velocidade * 60); // minutes
  
  // 4. Handle edge cases
  if (distancia < 50) {
    tempoEstimado = 2; // Minimum 2 minutes
    distancia = 0;     // Show as "arriving"
  } else if (tempoEstimado === 0) {
    tempoEstimado = 1; // Minimum 1 minute
  }

  return {
    distancia,      // Distance from bus to pickup (meters)
    tempoEstimado,  // Time until bus arrives at pickup (minutes)
    velocidade,     // Average speed (45 km/h)
    latitude: currentLat,  // Bus current latitude
    longitude: currentLng, // Bus current longitude
    // ... other fields
  };
});
```

#### Calculation 2: For All Buses (Fallback) (Line ~190)
```typescript
// When no buses found on specific route, return all buses
const busesWithDistance = allBuses.map((bus) => {
  // Calculate distance from each bus to pickup stop
  const R = 6371e3;
  const φ1 = (bus.latitude * Math.PI) / 180;
  const φ2 = (paragemLat * Math.PI) / 180;
  const Δφ = ((paragemLat - bus.latitude) * Math.PI) / 180;
  const Δλ = ((paragemLng - bus.longitude) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * 
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  let distancia = Math.round(R * c);

  const velocidade = 45;
  let tempoEstimado = Math.ceil(distancia / 1000 / velocidade * 60);
  
  if (distancia < 50) {
    tempoEstimado = 2;
    distancia = 0;
  } else if (tempoEstimado === 0) {
    tempoEstimado = 1;
  }

  return {
    ...bus,
    distancia,
    tempoEstimado,
    velocidade,
  };
});

// Sort by arrival time (closest first)
busesWithDistance.sort((a, b) => a.tempoEstimado - b.tempoEstimado);
```

---

## 🎯 What Gets Calculated

### ✅ Bus → Pickup Stop (IMPLEMENTED)

```
🚌 Bus Current Location
    │
    │ ← distancia (meters)
    │ ← tempoEstimado (minutes)
    │ ← velocidade (45 km/h)
    ↓
🟢 User's Pickup Stop
```

**Example**:
- Bus at: Godinho (-25.9528, 32.4655)
- Pickup at: Portagem (-25.9392, 32.5147)
- Distance: 5,200 meters (5.2 km)
- Time: 7 minutes (at 45 km/h)

---

## 📱 API Response

### Example Response:
```json
{
  "buses": [
    {
      "id": "bus-123",
      "matricula": "ABC-1234",
      "via": "Rota Matola-Baixa",
      "direcao": "Portagem → Museu",
      
      // Bus current location
      "latitude": -25.9528,
      "longitude": 32.4655,
      
      // Distance and time to pickup stop
      "distancia": 5200,        // 5.2 km from bus to pickup
      "tempoEstimado": 7,       // 7 minutes until arrival
      "velocidade": 45,         // km/h
      
      "status": "Em Circulação"
    }
  ],
  "paragem": {
    "id": "paragem-123",
    "nome": "Portagem",
    "latitude": -25.9392,
    "longitude": 32.5147
  }
}
```

---

## 🎨 UI Display Examples

### Example 1: Search Results
```
┌─────────────────────────────────────────────────┐
│  🚌 Autocarro ABC-1234                          │
│  📍 Portagem → Museu                            │
│                                                  │
│  🚌 Localização: Godinho                        │
│  📏 Distância: 5.2 km                           │  ← Bus to Pickup
│  ⏱️  Chega em: 7 minutos                        │  ← Arrival at Pickup
│                                                  │
│  💰 Tarifa: 20 MT                               │
└─────────────────────────────────────────────────┘
```

### Example 2: Live Tracking
```
┌─────────────────────────────────────────────────┐
│  🚌 Rastreando Autocarro ABC-1234               │
│                                                  │
│  📍 Autocarro está em: Godinho                  │
│  📏 Distância até você: 5.2 km                  │
│  ⏱️  Chegará em: 7 minutos                      │
│  🚀 Velocidade: 45 km/h                         │
│                                                  │
│  🟢 Sua paragem: Portagem                       │
│  🔴 Seu destino: Museu                          │
└─────────────────────────────────────────────────┘
```

### Example 3: Map View
```
┌─────────────────────────────────────────────────┐
│                    MAPA                          │
│                                                  │
│  🚌 ← Autocarro (Godinho)                       │
│   │                                              │
│   │ 5.2 km                                       │
│   │ 7 min                                        │
│   ↓                                              │
│  🟢 ← Você (Portagem)                           │
│   │                                              │
│   │ 2.0 km                                       │
│   │ 3 min                                        │
│   ↓                                              │
│  🔴 ← Destino (Museu)                           │
│                                                  │
│  ⏱️  Tempo total: 10 minutos                    │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Calculation Details

### Haversine Formula (Great-Circle Distance)

The system uses the **Haversine formula** to calculate the shortest distance between two points on Earth's surface (great-circle distance).

**Formula**:
```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

Where:
- φ = latitude in radians
- λ = longitude in radians
- R = Earth's radius (6,371 km or 6,371,000 meters)
- d = distance

**Why Haversine?**
- ✅ Accurate for GPS coordinates
- ✅ Accounts for Earth's curvature
- ✅ Works for any distance (short or long)
- ✅ Standard in mapping applications

### Time Calculation

```
Time (minutes) = Distance (km) / Speed (km/h) × 60
```

**Example**:
```
Distance: 5.2 km
Speed: 45 km/h
Time: 5.2 / 45 × 60 = 6.93 ≈ 7 minutes
```

### Edge Cases

1. **Very Close (< 50 meters)**:
   ```typescript
   if (distancia < 50) {
     tempoEstimado = 2;  // Minimum 2 minutes
     distancia = 0;      // Show as "arriving"
   }
   ```

2. **Zero Time**:
   ```typescript
   if (tempoEstimado === 0) {
     tempoEstimado = 1;  // Minimum 1 minute
   }
   ```

---

## 📊 Data Flow

```
┌──────────────────────────────────────────────────┐
│  1. User selects pickup stop: Portagem          │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  2. API fetches buses on route                   │
│     - Get bus current GPS location               │
│     - Get pickup stop coordinates                │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  3. Calculate for each bus:                      │
│     - Distance (Haversine formula)               │
│     - Time (Distance / Speed)                    │
│     - Handle edge cases                          │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  4. Sort buses by arrival time (closest first)   │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  5. Return to frontend:                          │
│     - distancia (meters)                         │
│     - tempoEstimado (minutes)                    │
│     - velocidade (km/h)                          │
│     - latitude, longitude (bus location)         │
└──────────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

- [x] Distance calculated from bus to pickup stop
- [x] Time calculated based on distance and speed
- [x] Uses Haversine formula (accurate for GPS)
- [x] Average speed: 45 km/h
- [x] Edge cases handled (< 50m, 0 minutes)
- [x] Buses sorted by arrival time
- [x] Works for specific route buses
- [x] Works for all buses (fallback)
- [x] Returns bus current location (lat, lng)
- [x] Returns distance in meters
- [x] Returns time in minutes

---

## 🎯 Summary

### ✅ What's Working (Correct Implementation):

1. **Distance Calculation**: ✅
   - From: Bus current GPS location
   - To: User's pickup stop
   - Method: Haversine formula
   - Unit: Meters

2. **Time Calculation**: ✅
   - Based on: Distance and average speed
   - Speed: 45 km/h
   - Unit: Minutes

3. **Edge Cases**: ✅
   - Very close (< 50m): Show as arriving
   - Zero time: Minimum 1 minute

4. **Sorting**: ✅
   - Buses sorted by arrival time
   - Closest bus shown first

### 📱 Frontend Usage:

```typescript
// Fetch buses for pickup stop
const response = await fetch(`/api/buses?paragemId=${pickupId}&viaId=${routeId}`);
const data = await response.json();

// Display for each bus
data.buses.forEach(bus => {
  console.log(`Bus ${bus.matricula}:`);
  console.log(`  Distance: ${bus.distancia / 1000} km`);
  console.log(`  Arrives in: ${bus.tempoEstimado} minutes`);
  console.log(`  Current location: ${bus.latitude}, ${bus.longitude}`);
});
```

---

**Status**: ✅ VERIFIED AND WORKING CORRECTLY

The webapp already calculates distance and arrival time exactly as you requested:
- Distance from bus location to your pickup stop
- Arrival time at your pickup stop

This is the standard behavior for all transport apps! 🎉
