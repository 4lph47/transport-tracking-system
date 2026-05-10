# Pickup and Dropoff Markers - Fix Applied

## Problem Identified

The markers were not showing because the `isPickup` and `isDestination` flags were **not being copied** from the original `stops` array to the `stopsToRender` array in the TransportMap component.

## Root Cause

In `app/components/TransportMap.tsx`, when creating the `stopsToRender` array, the code was only copying:
- `nome` → `title`
- `isTerminal`

But it was **NOT copying**:
- `isPickup` ❌
- `isDestination` ❌
- `id` ❌

## Fix Applied

### 1. Updated `stopsToRender` mapping (Line ~395)

**BEFORE:**
```typescript
return {
  position: useSnapped ? closestPoint : stopLngLat,
  title: stop.nome,
  isTerminal: stop.isTerminal,
};
```

**AFTER:**
```typescript
return {
  position: useSnapped ? closestPoint : stopLngLat,
  title: stop.nome,
  isTerminal: stop.isTerminal,
  isPickup: stop.isPickup || false,      // ✅ ADDED
  isDestination: stop.isDestination || false,  // ✅ ADDED
  id: stop.id,  // ✅ ADDED
};
```

### 2. Simplified marker rendering logic (Line ~430)

**BEFORE:**
```typescript
// Complex coordinate matching that was failing
const matchingStop = stops?.find(s => 
  Math.abs(s.latitude - stop.position[1]) < 0.001 && 
  Math.abs(s.longitude - stop.position[0]) < 0.001
);

if (matchingStop?.isPickup) {
  // render green marker
}
```

**AFTER:**
```typescript
// Direct flag checking - much simpler and reliable
if (stop.isPickup) {
  console.log('🟢 Rendering PICKUP marker for:', stop.title);
  markerColor = "#10b981"; // Green for pickup
  markerSize = "20px";
  markerIcon = "🟢";
}
```

### 3. Added proper TypeScript typing

```typescript
let stopsToRender: Array<{
  position: [number, number];
  title: string;
  isTerminal: boolean;
  isPickup?: boolean;        // ✅ ADDED
  isDestination?: boolean;   // ✅ ADDED
  id?: string;               // ✅ ADDED
}>;
```

## How to Test

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to search:**
   - Go to http://localhost:3000/search
   - Select município: "Maputo"
   - Select via: "Rota 39b: Baixa - Boquisso"
   - Select origem: "Xipamanine"
   - Select destino: "Hulene"
   - Click "Pesquisar Transportes"

3. **Track a transport:**
   - Click on any transport from the results
   - The map should now show:
     - 🟢 **Green marker** at Xipamanine (pickup)
     - 🔴 **Red marker** at Hulene (dropoff)
     - Both with pulsing animations

4. **Check browser console:**
   You should see:
   ```
   🟢 Rendering PICKUP marker for: Xipamanine
   🔴 Rendering DESTINATION marker for: Hulene
   ```

## Expected Visual Result

### Map Display:
```
🏁 Albert Lithule (Terminal - dark gray)
⚪ Stop 1 (gray)
🟢 Xipamanine (PICKUP - green, pulsing)
⚪ Stop 2 (gray)
🔴 Hulene (DROPOFF - red, pulsing)
⚪ Stop 3 (gray)
🏁 Boquisso (Terminal - dark gray)
```

### Route Lines:
- **Gray line**: Full route (background)
- **Orange line**: Bus → Xipamanine (bus needs to travel here)
- **Blue line**: Xipamanine → Hulene (your journey)

## Files Changed

1. **`app/components/TransportMap.tsx`**
   - Added `isPickup`, `isDestination`, and `id` to `stopsToRender` mapping
   - Simplified marker rendering to use flags directly
   - Added TypeScript types
   - Added console logging for debugging

## Verification Checklist

✅ Build successful (no TypeScript errors)
✅ Flags are copied from stops to stopsToRender
✅ Marker rendering uses flags directly (no coordinate matching)
✅ Console logs added for debugging
✅ Proper TypeScript types added

## Next Steps

1. Run `npm run dev`
2. Test the markers on the map
3. Verify console logs show the markers being rendered
4. If markers still don't appear, check:
   - Browser console for errors
   - Network tab for API response
   - Server logs for API marking stops

The fix is complete and should now work correctly! 🎉
