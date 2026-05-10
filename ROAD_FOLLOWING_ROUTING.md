# Road-Following Routing Implementation

## Summary
Implemented road-following routing for the Nova Via page so that routes follow actual roads on the map instead of drawing straight lines between clicked points.

## How It Works

### 1. User Interaction
- User clicks on the map to add waypoints
- Markers appear at each clicked location
- Route automatically follows roads between waypoints

### 2. Routing Service
Uses **OSRM (Open Source Routing Machine)** - a free, open-source routing service:
- API: `https://router.project-osrm.org/route/v1/driving/`
- No API key required
- Returns road-following coordinates

### 3. Data Flow

```
User clicks map
    ↓
Add waypoint to routeCoordinates
    ↓
Fetch route from OSRM API
    ↓
Update routedPath with road-following coordinates
    ↓
Draw route on map following roads
    ↓
Save routedPath to database
```

## Technical Implementation

### State Management
```typescript
const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
// Waypoints clicked by user

const [routedPath, setRoutedPath] = useState<[number, number][]>([]);
// Road-following path from OSRM
```

### Routing API Call
```typescript
const coords = routeCoordinates.map(c => `${c[0]},${c[1]}`).join(';');
const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

const response = await fetch(url);
const data = await response.json();
const routeGeometry = data.routes[0].geometry.coordinates;
setRoutedPath(routeGeometry);
```

### Fallback Behavior
If routing fails (no internet, API error, etc.):
- Falls back to straight lines between points
- Ensures the feature always works

## Features

### ✅ Road-Following
- Routes follow actual streets and roads
- Respects one-way streets and turn restrictions
- Uses driving profile (optimized for vehicles)

### ✅ Real-Time Updates
- Route updates automatically when adding/removing waypoints
- Color changes apply immediately
- Smooth user experience

### ✅ Accurate Data
- Saves the complete road-following path to database
- Includes all intermediate points along roads
- Can be used for accurate distance calculations

### ✅ Error Handling
- Graceful fallback to straight lines if routing fails
- No crashes or broken functionality
- User can still create routes offline

## Benefits

1. **Realistic Routes**: Routes follow actual roads, not straight lines
2. **Better Planning**: See exactly which roads the route uses
3. **Accurate Distances**: Road-following path gives real travel distances
4. **Professional Look**: Routes look natural and realistic
5. **Free Service**: OSRM is free and open-source

## Limitations

### OSRM Public Server
- Rate limited (reasonable use only)
- May be slow during peak times
- No guaranteed uptime

### Solutions for Production
1. **Self-host OSRM**: Run your own OSRM server
2. **Use Mapbox Directions**: Paid service with better reliability
3. **Use Google Maps Directions**: Paid service with excellent coverage

## Example Usage

### Creating a Route
1. Click "Nova Via" button
2. Fill in via details (name, code, municipality, etc.)
3. Click on map to add waypoints
4. Route automatically follows roads between points
5. Add more waypoints to refine the route
6. Click "Criar Via" to save

### Route Appears As
- Colored line following roads
- Markers at each waypoint
- Smooth curves around corners
- Follows street network

## API Response Example

```json
{
  "code": "Ok",
  "routes": [{
    "geometry": {
      "coordinates": [
        [32.5892, -25.9655],
        [32.5893, -25.9656],
        [32.5894, -25.9657],
        // ... hundreds of points following roads
      ],
      "type": "LineString"
    },
    "distance": 1234.5,
    "duration": 123.4
  }]
}
```

## Future Enhancements

1. **Show Distance**: Display total route distance
2. **Show Duration**: Display estimated travel time
3. **Alternative Routes**: Show multiple route options
4. **Avoid Highways**: Add routing preferences
5. **Waypoint Dragging**: Drag waypoints to adjust route
6. **Route Optimization**: Automatically optimize waypoint order

## Files Modified

- `transport-admin/app/vias/novo/page.tsx`
  - Added `routedPath` state
  - Added OSRM routing API integration
  - Updated route drawing to use routed path
  - Updated submit to save routed path

## Testing

- [x] Click to add waypoints
- [x] Route follows roads
- [x] Multiple waypoints work
- [x] Color changes apply to route
- [x] Clear route removes everything
- [x] Submit saves routed path
- [x] Fallback to straight lines works
- [ ] Test with poor internet connection
- [ ] Test with many waypoints (10+)
- [ ] Verify saved routes display correctly

## Notes

- OSRM uses OpenStreetMap data
- Routes are optimized for driving
- Works worldwide where OSM has road data
- Mozambique has good OSM coverage in major cities
