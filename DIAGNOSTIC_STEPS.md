# Diagnostic Steps - Why Markers Aren't Showing

Follow these steps to diagnose the issue:

## Step 1: Check if you're selecting origem AND destino

**IMPORTANT**: The markers will ONLY show if you select BOTH:
- ✅ Origem (pickup stop)
- ✅ Destino (dropoff stop)

If you only select origem without destino, NO special markers will appear!

### How to select both:
1. Go to `/search`
2. Select município (e.g., "Maputo")
3. Select via (e.g., "Rota 39b: Baixa - Boquisso")
4. Select **Sua Paragem (Origem)** - e.g., "Xipamanine"
5. Select **Seu Destino (opcional)** - e.g., "Hulene" ← **DON'T SKIP THIS!**
6. Click "Pesquisar Transportes"

## Step 2: Check the URL

After clicking "Pesquisar Transportes", check the URL in your browser:

**Correct URL should look like:**
```
http://localhost:3000/search?municipio=xxx&via=xxx&paragem=xxx&destination=xxx
                                                              ↑              ↑
                                                           origem        destino
```

**If your URL looks like this (NO destination parameter):**
```
http://localhost:3000/search?municipio=xxx&via=xxx&paragem=xxx
```
Then you didn't select a destination! Go back and select one.

## Step 3: Check the track page URL

After clicking on a transport, check the URL:

**Correct URL should look like:**
```
http://localhost:3000/track/[busId]?paragem=xxx&destination=xxx
                                            ↑              ↑
                                         origem        destino
```

**If your URL looks like this (NO destination parameter):**
```
http://localhost:3000/track/[busId]?paragem=xxx
```
Then the destination wasn't passed! This means markers won't show.

## Step 4: Check browser console

Open browser console (F12 → Console tab) and look for these logs:

### Expected logs when markers ARE working:
```
🗺️ TransportMap - Received props:
🗺️ stops prop: Array(9)
🗺️ stops length: 9
🗺️ Stops with isPickup: 1
🗺️ Stops with isDestination: 1
🟢 Pickup stop found: Xipamanine xxx
🔴 Destination stop found: Hulene xxx
🗺️ TransportMap - Initializing map
🗺️ Stops available: 9
🗺️ TransportMap - Adding stops and bus
🗺️ Total stops received: 9
🗺️ Stops with isPickup: 1
🗺️ Stops with isDestination: 1
🟢 Rendering PICKUP marker for: Xipamanine
🔴 Rendering DESTINATION marker for: Hulene
```

### If you see this (NO destination selected):
```
🗺️ Stops with isPickup: 1
🗺️ Stops with isDestination: 0  ← ZERO!
```
This means you didn't select a destination in the search form.

### If you see this (NO stops at all):
```
🗺️ stops prop: undefined
🗺️ stops length: 0
```
This means the API didn't return stops data.

## Step 5: Check server logs (terminal)

In your terminal where `npm run dev` is running, look for:

### Expected logs when API is working:
```
🚌 Fetching bus with ID: xxx paragem: xxx destination: xxx
🔍 Marking stops - paragemId: xxx destinationId: xxx
🔍 Total stops: 9
✅ Marked PICKUP stop: Xipamanine xxx
✅ Marked DESTINATION stop: Hulene xxx
🔍 Stops after marking: [{ nome: 'Xipamanine', isPickup: true, ... }]
```

### If you see this (NO destination):
```
🚌 Fetching bus with ID: xxx paragem: xxx destination: null
```
This means the destination parameter wasn't passed to the API.

## Step 6: Check Network tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click on a transport to track it
4. Find the request to `/api/bus/[busId]?paragem=xxx&destination=xxx`
5. Click on it and check the Response tab

### Expected response:
```json
{
  "stops": [
    {
      "id": "stop1",
      "nome": "Albert Lithule",
      "isPickup": false,
      "isDestination": false
    },
    {
      "id": "stop2",
      "nome": "Xipamanine",
      "isPickup": true,  ← Should be true
      "isDestination": false
    },
    {
      "id": "stop3",
      "nome": "Hulene",
      "isPickup": false,
      "isDestination": true  ← Should be true
    }
  ]
}
```

## Common Issues

### Issue 1: "I only see gray markers"
**Cause**: You didn't select a destination (destino) in the search form.
**Solution**: Go back to search and select BOTH origem AND destino.

### Issue 2: "The destination dropdown is empty"
**Cause**: You haven't selected a via yet, or the via has no stops.
**Solution**: Select a via first, then the destination dropdown will populate.

### Issue 3: "I selected both but still no markers"
**Possible causes**:
1. Browser cache - Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Old build - Run `npm run build` then `npm run dev`
3. JavaScript error - Check browser console for errors

### Issue 4: "Console shows isPickup: undefined"
**Cause**: The API is not marking the stops correctly.
**Solution**: Check server logs to see if the API is receiving the paragem and destination parameters.

## Quick Test

Run this in your browser console when on the track page:

```javascript
// Check if stops have the flags
const stops = document.querySelector('[data-stops]');
console.log('Stops data:', stops);

// Or check the API directly
fetch(window.location.pathname.replace('/track/', '/api/bus/') + window.location.search)
  .then(r => r.json())
  .then(data => {
    console.log('API Response:', data);
    console.log('Stops with isPickup:', data.stops?.filter(s => s.isPickup).length);
    console.log('Stops with isDestination:', data.stops?.filter(s => s.isDestination).length);
  });
```

## Still Not Working?

If you've followed all steps and markers still don't show:

1. **Clear browser cache completely**
2. **Restart the dev server** (`npm run dev`)
3. **Check for JavaScript errors** in browser console
4. **Share the console logs** - both browser and server
5. **Share the Network tab response** for the `/api/bus/[id]` request

## Expected Visual Result

When everything is working, you should see:

```
Map with route line and these markers:

🏁 Terminal (dark gray, 18px)
⚪ Regular stop (gray, 14px)
🟢 XIPAMANINE (green, 20px, pulsing) ← YOUR PICKUP
⚪ Regular stop (gray, 14px)
🔴 HULENE (red, 20px, pulsing) ← YOUR DROPOFF
⚪ Regular stop (gray, 14px)
🏁 Terminal (dark gray, 18px)
```

The green and red markers should be noticeably larger and have a pulsing animation.
