# Testing Pickup and Dropoff Markers

## How to Test

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the search page:**
   - Go to http://localhost:3000/search
   - Select a município (e.g., "Maputo")
   - Select a via/rota (e.g., "Rota 39b: Baixa - Boquisso")
   - Select an origem/pickup stop (e.g., "Xipamanine")
   - Select a destino/dropoff stop (e.g., "Hulene")
   - Click "Pesquisar Transportes"

3. **Click on a transport to track it**

4. **Check the console logs:**
   
   **In the terminal (server-side):**
   - Look for: `🔍 Marking stops - paragemId: xxx destinationId: xxx`
   - Look for: `✅ Marked PICKUP stop: [stop name]`
   - Look for: `✅ Marked DESTINATION stop: [stop name]`
   
   **In the browser console (client-side):**
   - Look for: `🔍 Track Page - Received stops from API:`
   - Look for: `🔍 Track Page - Stops with isPickup:`
   - Look for: `🔍 Track Page - Stops with isDestination:`
   - Look for: `🗺️ TransportMap - Adding stops and bus`
   - Look for: `🗺️ Stops with isPickup:`
   - Look for: `🗺️ Stops with isDestination:`

5. **Check the map:**
   - You should see a **GREEN marker with "P"** at your pickup stop (origem)
   - You should see a **RED marker with "D"** at your dropoff stop (destino)
   - Both markers should have a pulsing animation
   - The route line should be:
     - **Gray** for the full route (background)
     - **Blue** for your journey segment (origem → destino)
     - **Orange** for the bus-to-pickup segment

## Expected Behavior

### Markers:
- **Green Pickup Marker (🟢 P)**: 
  - Size: 20px
  - Color: #10b981 (green)
  - Popup: "📍 Sua paragem de embarque"
  - Pulsing animation

- **Red Dropoff Marker (🔴 D)**:
  - Size: 20px
  - Color: #ef4444 (red)
  - Popup: "🎯 Seu destino"
  - Pulsing animation

- **Regular Stop Markers**:
  - Size: 14px
  - Color: #6b7280 (gray)
  - No special animation

- **Terminal Markers**:
  - Size: 18px
  - Color: #1f2937 (dark gray)
  - Icon: 🏁

## Troubleshooting

If markers don't appear:

1. **Check API Response:**
   - Open browser DevTools → Network tab
   - Find the request to `/api/bus/[id]?paragem=xxx&destination=xxx`
   - Check the response JSON
   - Verify that `stops` array contains objects with `isPickup: true` and `isDestination: true`

2. **Check Console Logs:**
   - Verify the logs show the correct number of marked stops
   - Check if stops are being passed to TransportMap

3. **Check Map Rendering:**
   - Open browser console
   - Look for any JavaScript errors
   - Check if the map loaded successfully

## API Endpoint Test

You can test the API directly:

```bash
# Replace [busId], [paragemId], and [destinationId] with actual IDs
curl "http://localhost:3000/api/bus/[busId]?paragem=[paragemId]&destination=[destinationId]"
```

Example response should include:
```json
{
  "stops": [
    {
      "id": "stop1",
      "nome": "Stop Name",
      "latitude": -25.xxx,
      "longitude": 32.xxx,
      "isTerminal": false,
      "isPickup": false,
      "isDestination": false
    },
    {
      "id": "stop2",
      "nome": "Pickup Stop",
      "latitude": -25.xxx,
      "longitude": 32.xxx,
      "isTerminal": false,
      "isPickup": true,  ← Should be true for pickup
      "isDestination": false
    },
    {
      "id": "stop3",
      "nome": "Dropoff Stop",
      "latitude": -25.xxx,
      "longitude": 32.xxx,
      "isTerminal": false,
      "isPickup": false,
      "isDestination": true  ← Should be true for destination
    }
  ]
}
```
