# Vias Navigation Fix - Complete

## Issues Fixed

### 1. **404 Error When Clicking "Ver no mapa" in Vias Page**
**Problem**: Clicking the map icon in `transport-admin/app/vias/page.tsx` tried to navigate to `/admin/routes?via=${via.id}`, which doesn't exist in the transport-admin app.

**Solution**: Changed navigation to `/dashboard?via=${via.id}` which is the correct route in transport-admin.

**File**: `transport-admin/app/vias/page.tsx`
- Line 265: Changed from `router.push('/admin/routes?via=${via.id}')` to `router.push('/dashboard?via=${via.id}')`

### 2. **Dashboard Not Handling Via Query Parameter**
**Problem**: The dashboard page wasn't reading or handling the `via` query parameter to show the selected via on the map.

**Solution**: 
1. Added `useSearchParams` import from `next/navigation`
2. Added `searchParams` hook in the component
3. Added a new `useEffect` to read the `via` query parameter and set `selectedVia` state

**File**: `transport-admin/app/dashboard/page.tsx`
- Line 4: Added `useSearchParams` to imports
- Line 34: Added `const searchParams = useSearchParams();`
- Lines 127-137: Added new useEffect to handle via query parameter:
```typescript
// Handle via query parameter
useEffect(() => {
  const viaId = searchParams.get('via');
  if (viaId && viasData.length > 0) {
    // Check if the via exists in the data
    const viaExists = viasData.some(v => v.id === viaId);
    if (viaExists) {
      setSelectedVia(viaId);
    }
  }
}, [searchParams, viasData]);
```

### 3. **Improved Via Count Display in Admin Routes**
**Problem**: Via counts were displaying as "89 paragens" which could be confusing.

**Solution**: Changed format to "Paragens: 89" and "Transportes: 1" for better clarity.

**File**: `app/admin/routes/page.tsx`
- Lines 565-571: Changed display format from `{via._count.paragens} paragens` to `Paragens: {via._count.paragens}`

## How It Works Now

1. **From Vias Page**: 
   - User clicks "Ver no mapa" icon on any via
   - Navigates to `/dashboard?via={viaId}`
   - Dashboard loads and reads the query parameter
   - Map zooms to the selected via and highlights it

2. **From Dashboard**:
   - User can click on vias in the sidebar
   - Via is highlighted on the map
   - Other vias are hidden
   - Map zooms to show the selected via

## Testing

To test the fix:
1. Navigate to `http://localhost:3001/vias` (or whatever port transport-admin runs on)
2. Click the map icon on any via
3. Should navigate to dashboard with the via highlighted on the map
4. No 404 error should occur

## Related Files

- `transport-admin/app/vias/page.tsx` - Vias list page
- `transport-admin/app/dashboard/page.tsx` - Dashboard with map
- `app/admin/routes/page.tsx` - Main app admin routes (no changes needed, already working)
