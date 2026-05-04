# Dynamic Routes Implementation

## Overview
The transport-client app now fetches real bus data from the database and displays dynamic routes based on actual Via (route) data. Each bus follows its own route with real stops from the database.

## Changes Made

### 1. API Routes Created

#### `/api/locations` - GET
Fetches all available locations for the selectors:
- **Municipios** (municipalities)
- **Vias** (routes) with their terminals
- **Paragens** (stops) with their associated vias

#### `/api/buses` - GET
Fetches buses going to a specific stop on a specific via:
- **Query params**: `paragemId`, `viaId`
- **Returns**: Array of buses with:
  - Bus details (matricula, via, direction)
  - Current location
  - Distance and estimated time to the stop
  - Route coordinates from the Via's `geoLocationPath`
  - All stops on the route
- **Sorting**: Buses sorted by estimated arrival time (closest first)

#### `/api/bus/[id]` - GET
Fetches a single bus with its complete route data:
- Bus details
- Route coordinates
- All stops on the route
- Current location

### 2. Database Integration

#### Prisma Setup
- Installed `@prisma/client@5.22.0` and `prisma@5.22.0` (compatible with Node 20.11)
- Created `prisma/schema.prisma` (shared schema with transport-admin)
- Created `.env` with `DATABASE_URL` pointing to admin's database: `file:../transport-admin/prisma/dev.db`
- Generated Prisma client

#### Database Structure Used
- **Municipio**: Cities/municipalities
- **Via**: Routes with `geoLocationPath` (semicolon-separated coordinates)
- **Paragem**: Bus stops with `geoLocation`
- **ViaParagem**: Junction table linking vias and paragens
- **Transporte**: Buses with `currGeoLocation` and assigned `viaId`
- **GeoLocation**: Historical location data for buses

### 3. Frontend Updates

#### Main Page (`/app/page.tsx`)
- **Before**: Used hardcoded mock data
- **After**: 
  - Fetches real data from `/api/locations` on mount
  - Displays actual municipios, vias, and paragens from database
  - Via selector shows route direction (Terminal A → Terminal B)
  - Removed "Direção" selector (direction is part of Via)
  - Reduced steps from 4 to 3

#### Search Page (`/app/search/page.tsx`)
- **Before**: Displayed mock buses
- **After**:
  - Fetches buses from `/api/buses` with selected paragem and via
  - Displays real buses that serve the selected stop
  - Shows accurate distance and time estimates
  - Each bus has its own route data

#### Track Page (`/app/track/[id]/page.tsx`)
- **Before**: Used mock data and hardcoded paragem coordinates
- **After**:
  - Fetches bus data from `/api/bus/[id]`
  - Uses real route coordinates from the bus's Via
  - Uses real stops from the database
  - Passes route data to TransportMap component

#### TransportMap Component (`/app/components/TransportMap.tsx`)
- **Before**: Used hardcoded route coordinates and stops
- **After**:
  - Accepts optional `routeCoords` and `stops` props
  - Uses provided route coordinates if available
  - Falls back to OSRM routing if no coordinates provided
  - Renders stops from database with correct names and terminal indicators
  - Each bus follows its own unique route

### 4. Route Coordinate Format

Routes are stored in the database as `geoLocationPath`:
```
"lng1,lat1;lng2,lat2;lng3,lat3;..."
```

Example from seed data:
```
Zimpeto - Baixa: "-25.9892,32.5432;-25.9812,32.5532;-25.9732,32.5632;..."
```

The API parses this into an array of `[lng, lat]` tuples for MapLibre GL JS.

### 5. Stop Indicators

Stops are rendered with visual indicators:
- **Terminals**: Larger dark circles (18px)
- **Regular stops**: Smaller gray circles (14px)
- **Start terminal**: Green flag emoji 🚩 with green background
- **End terminal**: Checkered flag emoji 🏁 with red background

### 6. Distance Calculation

Uses Haversine formula to calculate accurate distances between:
- Bus current location and user's selected stop
- Estimates time based on 45 km/h average speed

## Current Database Data

From `transport-admin/prisma/seed.ts`:

### Vias (Routes)
1. **Zimpeto - Baixa** (VIA-001)
   - 6 stops: Zimpeto → Albazine → Xipamanine → Sommerschield → Polana → Baixa
   - 2 buses: AAA-1234-MP, BBB-5678-MP

2. **Costa do Sol** (VIA-002)
   - 4 stops: Costa do Sol → (intermediate stops) → Baixa
   - 1 bus: CCC-9012-MP

### Buses
- **AAA-1234-MP**: Toyota Hiace, 15 seats, on Zimpeto-Baixa route
- **BBB-5678-MP**: Mercedes Sprinter, 18 seats, on Zimpeto-Baixa route
- **CCC-9012-MP**: VW Quantum, 14 seats, on Costa do Sol route

## How It Works

1. **User selects location**:
   - Chooses Municipio → filters Vias
   - Chooses Via → filters Paragens on that Via
   - Chooses Paragem (their stop)

2. **Search for buses**:
   - API finds all buses on the selected Via
   - Calculates distance from each bus to the selected stop
   - Returns buses sorted by arrival time

3. **View bus on map**:
   - Bus follows its Via's route coordinates
   - Map shows all stops on the route
   - Bus animates at 45 km/h along the route
   - Route follows actual roads (from Via's geoLocationPath)

## Future Enhancements

1. **Real-time updates**: Connect to WebSocket for live bus positions
2. **Multiple directions**: Add support for bidirectional routes (A→B and B→A)
3. **Route optimization**: Use OSRM to refine routes if geoLocationPath is sparse
4. **ETA updates**: Recalculate arrival times based on traffic and actual speed
5. **Stop notifications**: Alert users when bus is approaching their stop

## Testing

To test the implementation:

1. Start the admin app and run the seed:
   ```bash
   cd transport-admin
   npx prisma migrate dev
   npx prisma db seed
   ```

2. Start the client app:
   ```bash
   cd transport-client
   npm run dev
   ```

3. Navigate to `http://localhost:3000`
4. Select: Maputo → Zimpeto - Baixa → Any stop
5. You should see 2 buses (AAA-1234-MP and BBB-5678-MP)
6. Click "Acompanhar" to track a bus on the map

## Notes

- The client app shares the same database as the admin app
- Route coordinates are pre-calculated and stored in the database
- OSRM is used as a fallback if route coordinates are not available
- All buses on the same Via follow the same route but may be at different positions
