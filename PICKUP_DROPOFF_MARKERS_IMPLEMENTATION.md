# Pickup and Dropoff Markers Implementation

## Overview

This document describes the implementation of pickup and dropoff markers on the transport tracking map. When a user selects an origem (pickup point) and destino (dropoff point), the map now displays distinct visual markers to show where to board and where to get off.

## Features Implemented

### 1. Visual Markers

#### Green Pickup Marker (🟢 P)
- **Color**: #10b981 (emerald green)
- **Size**: 20px diameter
- **Icon**: White "P" letter
- **Animation**: Pulsing effect
- **Popup**: "📍 Sua paragem de embarque" (Your boarding stop)
- **Purpose**: Shows where the user should board the bus

#### Red Dropoff Marker (🔴 D)
- **Color**: #ef4444 (red)
- **Size**: 20px diameter
- **Icon**: White "D" letter
- **Animation**: Pulsing effect
- **Popup**: "🎯 Seu destino" (Your destination)
- **Purpose**: Shows where the user should get off the bus

#### Regular Stop Markers
- **Color**: #6b7280 (gray)
- **Size**: 14px diameter
- **Purpose**: Shows all other stops along the route

#### Terminal Markers
- **Color**: #1f2937 (dark gray)
- **Size**: 18px diameter
- **Icon**: 🏁
- **Purpose**: Shows terminal/end stops

### 2. Route Highlighting

The map displays different route segments with distinct colors:

- **Gray Line** (background): Full route from start to end
- **Blue Line** (highlighted): User's journey segment (origem → destino)
- **Orange Line**: Bus-to-pickup segment (where bus needs to travel to reach user)

### 3. Data Flow

```
User Selection (Search Page)
    ↓
    município, via, origem (paragemId), destino (destinationId)
    ↓
Search Results → Click Transport
    ↓
Track Page: /track/[busId]?paragem=[paragemId]&destination=[destinationId]
    ↓
API Call: /api/bus/[busId]?paragem=[paragemId]&destination=[destinationId]
    ↓
API marks stops with isPickup and isDestination flags
    ↓
TransportMap receives stops array with flags
    ↓
Map renders markers based on flags
```

## Files Modified

### 1. `/app/api/bus/[id]/route.ts`
**Purpose**: Mark stops with pickup and destination flags

**Changes**:
- Added logic to mark stops with `isPickup` and `isDestination` flags based on query parameters
- Added console logging for debugging
- Extended busData type to include journey details

**Key Code**:
```typescript
// Mark pickup and destination stops if provided
if (paragemId && busData.stops) {
  busData.stops = busData.stops.map(stop => ({
    ...stop,
    isPickup: stop.id === paragemId,
    isDestination: destinationId ? stop.id === destinationId : false
  }));
}
```

### 2. `/app/components/TransportMap.tsx`
**Purpose**: Render pickup and dropoff markers on the map

**Existing Features** (already implemented):
- Marker rendering logic based on `isPickup` and `isDestination` flags
- Different colors and sizes for different marker types
- Pulsing animations for special markers
- Route segment highlighting
- Popup content with descriptions

**Changes**:
- Added console logging for debugging

**Key Code**:
```typescript
if (matchingStop?.isPickup) {
  markerColor = "#10b981"; // Green for pickup
  markerSize = "20px";
  markerIcon = "🟢";
} else if (matchingStop?.isDestination) {
  markerColor = "#ef4444"; // Red for destination
  markerSize = "20px";
  markerIcon = "🔴";
}
```

### 3. `/app/track/[id]/page.tsx`
**Purpose**: Pass stops data to TransportMap component

**Changes**:
- Added console logging to verify stops data from API
- Stops are already being passed to TransportMap via props

**Key Code**:
```typescript
<TransportMap
  transportLat={transport.latitude}
  transportLng={transport.longitude}
  paragemLat={paragemLat}
  paragemLng={paragemLng}
  transportMatricula={transport.matricula}
  routeCoords={routeCoords}
  stops={stops}  // ← Stops with isPickup/isDestination flags
  paragemNome={paragemNome}
  destinationLat={destinationLat || undefined}
  destinationLng={destinationLng || undefined}
  destinationNome={destinationNome || undefined}
  userJourney={transport.userJourney}
/>
```

## How It Works

### Step 1: User Selects Route and Stops
1. User goes to `/search`
2. Selects município (e.g., "Maputo")
3. Selects via/rota (e.g., "Rota 39b: Baixa - Boquisso")
4. Selects origem/pickup (e.g., "Xipamanine")
5. Selects destino/dropoff (e.g., "Hulene")
6. Clicks "Pesquisar Transportes"

### Step 2: User Tracks a Transport
1. User clicks on a transport from search results
2. Browser navigates to: `/track/[busId]?paragem=[paragemId]&destination=[destinationId]`

### Step 3: API Marks Stops
1. Track page calls: `/api/bus/[busId]?paragem=[paragemId]&destination=[destinationId]`
2. API fetches bus data using `getBusLocation(busId)`
3. API iterates through stops array and marks:
   - `isPickup: true` for the stop matching `paragemId`
   - `isDestination: true` for the stop matching `destinationId`
4. API returns bus data with marked stops

### Step 4: Map Renders Markers
1. TransportMap receives stops array with flags
2. For each stop, checks if it has special flags:
   - If `isPickup === true`: Renders green marker with "P"
   - If `isDestination === true`: Renders red marker with "D"
   - Otherwise: Renders regular gray marker
3. Map also highlights the route segments:
   - Finds pickup and destination indices in route
   - Draws gray line for full route
   - Draws blue line for user journey segment
   - Draws orange line for bus-to-pickup segment

## Testing

### Manual Testing Steps

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to search page:**
   - Go to http://localhost:3000/search
   - Select município, via, origem, and destino
   - Click "Pesquisar Transportes"

3. **Track a transport:**
   - Click on any transport from the results
   - Observe the map

4. **Verify markers:**
   - ✅ Green marker at origem (pickup point)
   - ✅ Red marker at destino (dropoff point)
   - ✅ Both markers have pulsing animation
   - ✅ Clicking markers shows correct popup text
   - ✅ Route is highlighted in different colors

### Console Logs for Debugging

**Server-side (Terminal):**
```
🚌 Fetching bus with ID: xxx paragem: xxx destination: xxx
🔍 Marking stops - paragemId: xxx destinationId: xxx
🔍 Total stops: 9
✅ Marked PICKUP stop: Xipamanine xxx
✅ Marked DESTINATION stop: Hulene xxx
🔍 Stops after marking: [{ nome: 'Xipamanine', isPickup: true, ... }]
```

**Client-side (Browser Console):**
```
🔍 Track Page - Received stops from API: 9
🔍 Track Page - Stops with isPickup: 1
🔍 Track Page - Stops with isDestination: 1
🗺️ TransportMap - Adding stops and bus
🗺️ Total stops received: 9
🗺️ Stops with isPickup: 1
🗺️ Stops with isDestination: 1
```

### API Testing

Test the API directly with curl:
```bash
curl "http://localhost:3000/api/bus/[busId]?paragem=[paragemId]&destination=[destinationId]"
```

Expected response structure:
```json
{
  "id": "bus123",
  "matricula": "BUS-9023",
  "via": "Rota 39b: Baixa - Boquisso",
  "stops": [
    {
      "id": "stop1",
      "nome": "Albert Lithule",
      "latitude": -25.9734,
      "longitude": 32.5694,
      "isTerminal": true,
      "isPickup": false,
      "isDestination": false
    },
    {
      "id": "stop2",
      "nome": "Xipamanine",
      "latitude": -25.9442,
      "longitude": 32.5639,
      "isTerminal": false,
      "isPickup": true,  ← Pickup marker
      "isDestination": false
    },
    {
      "id": "stop3",
      "nome": "Hulene",
      "latitude": -25.9083,
      "longitude": 32.5939,
      "isTerminal": false,
      "isPickup": false,
      "isDestination": true  ← Dropoff marker
    }
  ]
}
```

## Troubleshooting

### Issue: Markers not showing

**Possible causes:**
1. API not marking stops correctly
2. Stops not being passed to TransportMap
3. Map not rendering markers

**Solution:**
1. Check server console for marking logs
2. Check browser console for stops data
3. Verify API response in Network tab
4. Check for JavaScript errors in console

### Issue: Wrong markers showing

**Possible causes:**
1. Wrong paragemId or destinationId in URL
2. Stop IDs don't match

**Solution:**
1. Verify URL parameters
2. Check API logs to see which stops are being marked
3. Verify stop IDs in database

### Issue: Markers showing but no animation

**Possible causes:**
1. CSS not loading
2. Animation styles not applied

**Solution:**
1. Check browser DevTools → Elements → Styles
2. Verify `.paragem-pulse` class is applied
3. Check for CSS conflicts

## Future Enhancements

Possible improvements:
1. Add distance indicators on markers
2. Add estimated time to reach each marker
3. Add turn-by-turn directions
4. Add voice notifications when approaching stops
5. Add ability to share specific pickup/dropoff locations
6. Add favorite pickup/dropoff combinations

## Summary

The pickup and dropoff markers feature is now fully implemented and working. Users can:
- Select their boarding stop (origem) and destination stop (destino)
- See clear visual markers on the map showing where to board (green) and where to get off (red)
- See the route highlighted to show their specific journey segment
- Click on markers to see popup information

The implementation uses:
- Server-side marking of stops in the API
- Client-side rendering of markers in TransportMap
- Distinct visual styles for different marker types
- Smooth animations and interactive popups
