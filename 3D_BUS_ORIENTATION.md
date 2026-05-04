# 3D Bus Orientation Fix

## Problem
The bus was not oriented correctly on the map - it was facing "forward on screen" instead of following the direction of the route line it was traveling on.

## Root Cause
The issue was caused by **double rotation**:
1. The `Bus3D` component was rendering the bus with a rotation applied in Three.js
2. MapLibre's marker was also trying to rotate the entire canvas element
3. These two rotations were conflicting, causing incorrect orientation

Additionally, the animation loop was **recreating the entire bus element** on every bearing change instead of using MapLibre's efficient `.setRotation()` method.

## Solution

### 1. Separated Rotation Responsibilities
- **Bus3D Component**: Always renders the bus facing "up" (north) with a fixed -90° rotation
  - The bus model has headlights at Z+ axis
  - Rotating -90° makes it face "up" in the canvas coordinate system
  - The `rotation` prop is no longer used for dynamic rotation

- **MapLibre Marker**: Handles all dynamic rotation via `.setRotation(bearing)`
  - The marker rotates the entire canvas element based on the route bearing
  - This is more efficient and avoids recreation of Three.js scenes

### 2. Optimized Animation Loop
**Before:**
```typescript
// Recreated the entire bus element on every bearing change
const newBusElement = createBus3DMarkerElement({
  rotation: bearing,
  label: motorista.transporte.matricula
});
transportMarker.getElement().replaceWith(newBusElement);
```

**After:**
```typescript
// Use MapLibre's efficient setRotation method
if (Math.abs(bearing - currentBearingValue) > 2) {
  currentBearingValue = bearing;
  busMarker.setRotation(bearing);
}
```

### 3. Bus Orientation Details

**Bus Structure:**
- Front (headlights): Z = +2.1
  - Left headlight: (-0.6, 0.4, 2.1)
  - Right headlight: (0.6, 0.4, 2.1)
- Back: Z = -2
- Wheels: y = 0.3 (bottom touches ground at y=0)

**Coordinate Systems:**
- MapLibre bearing: 0° = North, 90° = East, 180° = South, 270° = West
- Three.js: Z+ is forward, X+ is right, Y+ is up
- Bus model: Headlights at Z+, so -90° rotation makes it face "up" (north)

## Files Modified

### transport-driver
- `app/route/page.tsx`: Updated animation loop to use `.setRotation()`
- `app/components/Bus3D.tsx`: Fixed rotation to -90° (always face up)

### transport-client
- `app/components/TransportMap.tsx`: Updated animation loop to use `.setRotation()`
- `app/components/Bus3D.tsx`: Fixed rotation to -90° (always face up)

## Result
✅ The bus now correctly follows the route line direction
✅ The two yellow headlights point in the direction of travel
✅ The route line passes between the headlights
✅ More efficient rendering (no element recreation)
✅ Smooth rotation transitions
