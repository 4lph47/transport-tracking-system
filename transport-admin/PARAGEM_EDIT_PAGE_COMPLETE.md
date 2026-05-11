# Paragem Edit Page - Complete Implementation

**Date**: May 9, 2026  
**Status**: ✅ COMPLETE

---

## Overview

Created a fully functional paragem edit page that matches the creation page functionality, showing only nearby vias (within 100m radius) and displaying all nearby via routes on the map.

---

## Features Implemented

### 1. ✅ Load Existing Paragem Data
- Fetches paragem by ID from `/api/paragens/${id}`
- Loads current name, code, and location
- Loads associated vias
- Handles errors gracefully

### 2. ✅ Interactive Map
- Shows paragem location with marker
- Displays **all nearby via routes** (not just associated ones)
- Allows clicking to update location
- Auto-updates nearby vias when location changes
- Color-coded routes based on via colors

### 3. ✅ Smart Via Filtering
- Calculates which vias pass within 100m of paragem
- Shows only nearby vias in selection list
- Uses Haversine formula for accurate distance calculation
- Supports both JSON and semicolon-separated coordinate formats

### 4. ✅ Multi-Select Vias
- Checkboxes for selecting multiple vias
- "Select All" / "Deselect All" button
- Shows count of selected vias
- Info message showing number of nearby vias found

### 5. ✅ Professional UI
- Toast notifications for feedback
- Loading states
- Error handling
- Consistent with other pages
- Black/white/grey theme

---

## Key Differences from Creation Page

| Feature | Creation Page | Edit Page |
|---------|--------------|-----------|
| **Data Loading** | Empty form | Loads existing data |
| **Map Initialization** | Centered on default location | Centered on paragem location |
| **Via Routes** | Shows after clicking map | Shows immediately with nearby vias |
| **Form Action** | POST to create | PATCH to update |
| **Navigation** | Back to list | Back to details |

---

## Technical Implementation

### Distance Calculation (Haversine Formula)

```typescript
function calculateDistance(lat1, lon1, lat2, lon2): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
```

### Nearby Via Detection

```typescript
function isPointNearRoute(lat, lng, geoLocationPath, threshold = 100): boolean {
  // Parse route coordinates (JSON or semicolon format)
  const coordinates = parseCoordinates(geoLocationPath);
  
  // Check if any point on route is within threshold
  for (const [routeLng, routeLat] of coordinates) {
    const distance = calculateDistance(lat, lng, routeLat, routeLng);
    if (distance <= threshold) {
      return true;
    }
  }
  
  return false;
}
```

### Automatic Recalculation

```typescript
useEffect(() => {
  if (formData.latitude && formData.longitude && allVias.length > 0) {
    const geoLocation = `${formData.latitude},${formData.longitude}`;
    calculateNearbyVias(geoLocation, allVias);
  }
}, [formData.latitude, formData.longitude, allVias]);
```

When the user clicks on the map to update the location, nearby vias are automatically recalculated.

---

## User Experience Flow

### 1. Page Load
```
User navigates to /paragens/{id}/editar
  ↓
Fetch paragem data
  ↓
Fetch all vias
  ↓
Calculate nearby vias (100m radius)
  ↓
Initialize map with paragem marker
  ↓
Display nearby via routes on map
  ↓
Show nearby vias in selection list
```

### 2. Update Location
```
User clicks on map
  ↓
Update latitude/longitude in form
  ↓
Move marker to new position
  ↓
Recalculate nearby vias
  ↓
Update via selection list
  ↓
Update via routes on map
```

### 3. Save Changes
```
User clicks "Guardar Alterações"
  ↓
Validate form data
  ↓
PATCH /api/paragens/{id}
  ↓
Show success notification
  ↓
Redirect to paragem details page
```

---

## API Integration

### GET `/api/paragens/${id}`
**Response**:
```json
{
  "id": "abc123",
  "nome": "Praça dos Heróis",
  "codigo": "PAR-001",
  "geoLocation": "-25.9655,32.5892",
  "vias": [
    {
      "via": {
        "id": "via1",
        "nome": "Via 1",
        "codigo": "V001",
        "cor": "#3B82F6",
        "geoLocationPath": "[[32.58,25.96],[32.59,25.97]]"
      },
      "terminalBoolean": false
    }
  ]
}
```

### PATCH `/api/paragens/${id}`
**Request**:
```json
{
  "nome": "Updated Name",
  "codigo": "PAR-002",
  "geoLocation": "-25.9655,32.5892",
  "viaIds": ["via1", "via2", "via3"]
}
```

### GET `/api/vias?limit=1000`
**Response** (paginated):
```json
{
  "data": [
    {
      "id": "via1",
      "nome": "Via 1",
      "codigo": "V001",
      "geoLocationPath": "[[32.58,-25.96],[32.59,-25.97]]",
      "cor": "#3B82F6"
    }
  ],
  "pagination": {...}
}
```

---

## Validation Rules

1. **Nome** - Required, non-empty
2. **Código** - Required, non-empty
3. **Location** - Required (latitude and longitude)
4. **Vias** - At least one via must be selected

---

## Error Handling

### Paragem Not Found
```
Shows error page with:
- Red error icon
- "Paragem Não Encontrada" message
- "Voltar para Paragens" button
```

### No Nearby Vias
```
Shows warning message:
- Yellow warning icon
- "Nenhuma via próxima encontrada"
- Suggestion to update location or check area
```

### Save Errors
```
Shows toast notification:
- Red background
- Error message from API
- Auto-dismisses after 3 seconds
```

---

## Map Features

### Via Route Display
- **Color**: Uses via's color (or default blue)
- **Width**: 4px
- **Opacity**: 0.7
- **Style**: Rounded joins and caps

### Paragem Marker
- **Size**: 18px diameter
- **Color**: Grey (#6b7280)
- **Border**: 3px white
- **Shadow**: Subtle drop shadow
- **Popup**: Shows paragem name

### Interaction
- **Click map**: Update paragem location
- **Drag**: Pan around
- **Scroll**: Zoom in/out
- **Navigation controls**: Top-right corner

---

## Comparison with Creation Page

### Similarities ✅
- Same via filtering logic (100m radius)
- Same distance calculation (Haversine)
- Same map display (routes + marker)
- Same UI components and styling
- Same validation rules

### Differences 📝
- **Pre-filled form** vs empty form
- **Update operation** vs create operation
- **Shows existing routes** immediately
- **Different navigation** (back to details vs list)

---

## Testing Checklist

- [x] Page loads existing paragem data
- [x] Map shows paragem location
- [x] Map shows nearby via routes
- [x] Via list shows only nearby vias (100m)
- [x] Clicking map updates location
- [x] Location update recalculates nearby vias
- [x] Can select/deselect vias
- [x] "Select All" button works
- [x] Form validation works
- [x] Save updates paragem successfully
- [x] Toast notifications appear
- [x] Redirects to details page after save
- [x] Handles errors gracefully
- [x] No console errors

---

## Files Created/Modified

### Created
1. `transport-admin/app/paragens/[id]/editar/page.tsx` - Edit page component

### Modified
None (new page)

---

## Benefits

1. **Consistent UX** - Matches creation page behavior
2. **Smart Filtering** - Only shows relevant vias
3. **Visual Feedback** - Map shows all nearby routes
4. **Easy Updates** - Click map to change location
5. **Professional** - Matches other admin pages

---

## Future Enhancements

Optional improvements:
1. **Drag marker** - Allow dragging marker to update location
2. **Distance display** - Show distance to each via
3. **Route preview** - Highlight route on hover
4. **Batch edit** - Edit multiple paragens at once
5. **History** - Show edit history

---

**Created By**: Kiro AI  
**Date**: May 9, 2026  
**Status**: ✅ Production Ready  
**Lines of Code**: ~650 lines
