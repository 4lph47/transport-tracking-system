# Transport Client Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd transport-client
npm install
```

### 2. Setup Database

The client app shares the database with the admin app. Make sure the admin database is set up first:

```bash
cd ../transport-admin
npx prisma migrate dev
npx prisma db seed
```

### 3. Generate Prisma Client

```bash
cd ../transport-client
npx prisma generate
```

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## How to Use

### For Users (Passengers)

1. **Select Your Location**:
   - Choose your municipality (Município)
   - Choose the route (Via) - shows direction like "Zimpeto → Baixa"
   - Choose your bus stop (Paragem)

2. **View Available Buses**:
   - See all buses heading to your stop
   - View estimated arrival time and distance
   - Buses are sorted by arrival time (closest first)

3. **Track a Bus**:
   - Click "Acompanhar" on any bus
   - See the bus moving in real-time on the map
   - View the complete route with all stops
   - See your stop highlighted on the map

### Features

- **Real-time tracking**: Buses animate along their routes at 45 km/h
- **Accurate routes**: Routes follow actual roads using OSRM routing
- **Multiple buses**: See all buses on the same route
- **Stop indicators**: 
  - 🚩 Green flag = Start terminal
  - 🏁 Checkered flag = End terminal
  - Gray dots = Regular stops
- **3D map**: MapLibre GL JS with 3D buildings (60° pitch)
- **Bus icon**: 2D SVG bus that rotates to follow the route direction

## Database Structure

The app uses the following data:

### Current Routes (from seed data)

1. **Zimpeto - Baixa** (Maputo)
   - Stops: Terminal Zimpeto → Paragem Albazine → Paragem Xipamanine → Paragem Sommerschield → Paragem Polana → Terminal Baixa
   - Buses: AAA-1234-MP, BBB-5678-MP

2. **Costa do Sol** (Maputo)
   - Stops: Terminal Costa do Sol → ... → Terminal Baixa
   - Buses: CCC-9012-MP

### Adding More Data

To add more routes, buses, or stops, use the admin app at `http://localhost:3001`

## API Endpoints

### GET `/api/locations`
Returns all municipalities, routes, and stops for the selectors.

**Response**:
```json
{
  "municipios": [...],
  "vias": [...],
  "paragens": [...]
}
```

### GET `/api/buses?paragemId={id}&viaId={id}`
Returns all buses going to a specific stop on a specific route.

**Response**:
```json
{
  "buses": [
    {
      "id": "...",
      "matricula": "AAA-1234-MP",
      "via": "Zimpeto - Baixa",
      "direcao": "Terminal Zimpeto → Terminal Baixa",
      "distancia": 1200,
      "tempoEstimado": 5,
      "velocidade": 45,
      "latitude": -25.9812,
      "longitude": 32.5532,
      "status": "Em Circulação",
      "routeCoords": [[lng, lat], ...],
      "stops": [...]
    }
  ],
  "paragem": {
    "id": "...",
    "nome": "Paragem Albazine",
    "latitude": -25.9812,
    "longitude": 32.5532
  }
}
```

### GET `/api/bus/{id}`
Returns a single bus with its complete route data.

**Response**:
```json
{
  "id": "...",
  "matricula": "AAA-1234-MP",
  "via": "Zimpeto - Baixa",
  "direcao": "Terminal Zimpeto → Terminal Baixa",
  "velocidade": 45,
  "latitude": -25.9812,
  "longitude": 32.5532,
  "status": "Em Circulação",
  "routeCoords": [[lng, lat], ...],
  "stops": [
    {
      "id": "...",
      "nome": "Terminal Zimpeto",
      "latitude": -25.9892,
      "longitude": 32.5432,
      "isTerminal": true
    },
    ...
  ]
}
```

## Troubleshooting

### Database not found
Make sure you've run the seed in the admin app first:
```bash
cd transport-admin
npx prisma db seed
```

### Prisma client not generated
Run:
```bash
cd transport-client
npx prisma generate
```

### No buses showing up
Check that:
1. The database has been seeded
2. You're selecting a route that has buses (try "Zimpeto - Baixa")
3. The API is returning data (check browser console)

### Map not loading
Check that:
1. MapLibre GL JS is installed: `npm install maplibre-gl`
2. The map container has a height set
3. Browser console for any errors

## Environment Variables

Create a `.env` file in `transport-client/`:

```env
# Database - shared with admin app
DATABASE_URL="file:../transport-admin/prisma/dev.db"

# Google Maps API Key (optional, for future features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key-here"
```

## Next Steps

1. **Add more routes**: Use the admin app to add more vias and paragens
2. **Add more buses**: Assign more transportes to different routes
3. **Real-time updates**: Implement WebSocket for live position updates
4. **User accounts**: Add authentication for saved routes and notifications
5. **Push notifications**: Alert users when their bus is approaching

## Support

For issues or questions, check:
- `DYNAMIC_ROUTES_IMPLEMENTATION.md` - Technical implementation details
- `DATABASE_STRUCTURE.md` - Database schema documentation
- `SYSTEM_OVERVIEW.md` - Overall system architecture
