# Transport Assignment to Via - Implementation Complete

## Overview
Implemented functionality to assign and unassign transportes to vias with intelligent filtering based on route proximity.

## Features Implemented

### 1. Via Details Page - Transport Assignment
**Location**: `transport-admin/app/vias/[id]/page.tsx`

#### Edit Mode Features:
- **"Atribuir Transporte" Button**: 
  - Only visible when in edit mode
  - Opens modal to select available transportes
  - No "+" prefix (clean design)

#### Transport Filtering Logic:
Transportes are available for assignment if:
1. They have NO via assigned, OR
2. Their assigned via's route is within 50 meters of the target via's route

This allows transportes to be reassigned to nearby/overlapping routes while preventing assignment to distant routes.

#### Modal Features:
- Lists all available transportes with:
  - Matricula (license plate)
  - Modelo and Marca (model and brand)
  - Motorista name (if assigned)
  - Current via (if any)
  - Codigo (transport code)
- Radio button selection
- Shows message if no transportes available
- Assign button with loading state

#### Unassign Functionality:
- Small "X" button appears on top-right of each transporte card in edit mode
- Click to unassign transporte from via
- Confirmation via notification toast
- Refreshes data after unassignment

### 2. API Endpoint Enhancement
**Location**: `transport-admin/app/api/transportes/[id]/route.ts`

#### Added PATCH Method:
```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
)
```

**Features**:
- Accepts partial updates (only provided fields are updated)
- Supports `viaId` parameter for assignment/unassignment
- Returns updated transporte with relations (via, motorista, proprietarios)
- Proper error handling

**Usage**:
```javascript
// Assign transporte to via
fetch(`/api/transportes/${transporteId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ viaId: viaId }),
});

// Unassign transporte from via
fetch(`/api/transportes/${transporteId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ viaId: null }),
});
```

## Technical Details

### Distance Calculation
Uses Haversine formula to calculate distance between coordinates:
```typescript
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

### Route Proximity Check
Compares every point of one via's route with every point of another via's route:
- If ANY two points are within 50m, routes are considered "close"
- This allows transportes on overlapping or nearby routes to be reassigned

### Coordinate Format Support
Handles both coordinate formats:
1. **JSON Array**: `[[lng1, lat1], [lng2, lat2], ...]`
2. **Semicolon-separated**: `lng1,lat1;lng2,lat2;...`

## User Interface

### Professional Design
- White/grey/black color scheme
- Backdrop blur for modals
- Toast notifications (no browser alerts)
- Smooth transitions
- Loading states for async operations

### Edit Mode Workflow
1. Click "Editar" button on via details page
2. "Atribuir Transporte" button becomes visible
3. Click to open modal with available transportes
4. Select transporte and click "Atribuir"
5. Transporte card appears with small "X" button
6. Click "X" to unassign if needed
7. Click "Guardar" to save all changes

## Why Not in Via Creation?
Transport assignment is only available in edit mode (after via creation) because:
1. Via must exist in database before transportes can reference it
2. Route proximity filtering requires saved via route
3. Cleaner workflow: create via first, then assign resources
4. Consistent with paragens association pattern

## Testing Checklist
- [x] PATCH endpoint accepts viaId parameter
- [x] Available transportes filtered correctly (no via OR nearby via)
- [x] Modal shows transporte details
- [x] Assign button works and refreshes data
- [x] Unassign button appears in edit mode
- [x] Unassign button removes assignment
- [x] Notifications show success/error messages
- [x] No TypeScript errors
- [x] Professional UI design maintained

## Files Modified
1. `transport-admin/app/vias/[id]/page.tsx` - Added transport assignment UI and logic
2. `transport-admin/app/api/transportes/[id]/route.ts` - Added PATCH endpoint

## Next Steps (Optional Enhancements)
- Add bulk transport assignment (assign multiple at once)
- Add transport search/filter in modal
- Show transport capacity vs via demand
- Add transport schedule/timetable management
- Show transport real-time location on via route
