# Map Markers Update - Nova Via Page

## Summary
Updated the map markers in the Nova Via page to match the style used in other maps across the admin panel. Changed from default MapLibre pin markers to custom circular markers (colored dots with white borders).

## Changes Made

### File: `transport-admin/app/vias/novo/page.tsx`

#### 1. Added Markers Reference
```typescript
const markersRef = useRef<maplibregl.Marker[]>([]);
```
- Tracks all markers added to the map
- Allows for proper cleanup and color updates

#### 2. Updated Marker Style
**Before:**
```typescript
new maplibregl.Marker({ color: formData.cor })
  .setLngLat(coords)
  .addTo(map.current!);
```

**After:**
```typescript
// Create custom marker element
const el = document.createElement("div");
el.style.cssText = `
  width: 14px;
  height: 14px;
  background: ${formData.cor};
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  cursor: pointer;
`;

const marker = new maplibregl.Marker({ element: el })
  .setLngLat(coords)
  .addTo(map.current!);

markersRef.current.push(marker);
```

#### 3. Added Color Update Effect
```typescript
useEffect(() => {
  markersRef.current.forEach(marker => {
    const el = marker.getElement();
    if (el) {
      el.style.background = formData.cor;
    }
  });
}, [formData.cor]);
```
- Updates all existing marker colors when the user changes the route color
- Provides real-time visual feedback

#### 4. Improved Clear Route Function
**Before:**
```typescript
const markers = document.querySelectorAll('.maplibregl-marker');
markers.forEach(marker => marker.remove());
```

**After:**
```typescript
markersRef.current.forEach(marker => marker.remove());
markersRef.current = [];
```
- Properly removes markers using MapLibre API
- Clears the markers array
- More reliable and cleaner approach

## Marker Style Specifications

### Circular Marker Design
- **Size**: 14px × 14px
- **Background**: Dynamic (matches selected route color)
- **Border**: 3px solid white
- **Shape**: Perfect circle (border-radius: 50%)
- **Shadow**: 0 2px 6px rgba(0,0,0,0.3)
- **Cursor**: Pointer

### Consistency Across Maps
This style now matches the markers used in:
- ✅ Vias detail page (`vias/[id]/page.tsx`)
- ✅ Paragens novo page (`paragens/novo/page.tsx`)
- ✅ Paragens edit page (`paragens/[id]/editar/page.tsx`)
- ✅ Transportes pages (using bus emoji markers)

## Features

### Dynamic Color Updates
- When the user changes the route color picker, all markers automatically update to match
- Route line and markers stay synchronized
- Provides immediate visual feedback

### Proper Cleanup
- Markers are properly removed when clearing the route
- No memory leaks or orphaned DOM elements
- Clean state management

### Visual Consistency
- Matches the design language of other admin maps
- Professional appearance
- Better user experience

## Testing Checklist

- [x] Markers appear as colored circles instead of pins
- [x] Markers match the selected route color
- [x] Changing color updates all existing markers
- [x] Clear route button removes all markers
- [x] Markers have white border and shadow
- [x] Markers are clickable (cursor: pointer)
- [x] Multiple markers can be added
- [x] Route line color matches marker color

## User Experience Improvements

1. **Visual Consistency**: All maps now use the same marker style
2. **Color Synchronization**: Markers automatically update when color changes
3. **Professional Appearance**: Clean, modern circular markers
4. **Better Visibility**: White border makes markers stand out on any background
5. **Intuitive Design**: Matches user expectations from other map interfaces
