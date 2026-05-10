# Via Color Validation Fix - Complete

## Problem
Some vias in the database had invalid hex color codes with only 5 characters (e.g., "#c9294", "#b1856") instead of the required 6 characters. This caused MapLibre GL to throw errors when trying to render the routes.

## Solution Implemented

### 1. Database Fix
**Script**: `fix-via-colors.js`
- Fixed 7 vias with invalid color codes
- Padded short colors with zeros (e.g., "#c9294" → "#c92940")
- All colors now have exactly 6 hex digits

**Fixed Vias**:
- VIA-014: #c9294 → #c92940
- VIA-025: #cea5 → #cea500
- VIA-035: #239f7 → #239f70
- VIA-054: #13e0d → #13e0d0
- VIA-031: #cdbc → #cdbc00
- VIA-079: #b1856 → #b18560
- VIA-096: #9c7af → #9c7af0

### 2. Code Validation
Added `getValidColor()` helper function to both pages:

**Files Updated**:
1. `app/admin/routes/page.tsx` - Routes management page
2. `transport-admin/app/dashboard/page.tsx` - Dashboard page

**Validation Logic**:
```typescript
const getValidColor = (color: string | undefined): string => {
  const defaultColor = '#3B82F6';
  if (!color || typeof color !== 'string' || !color.startsWith('#')) {
    return defaultColor;
  }
  
  const hexPart = color.substring(1);
  // Check if it contains only valid hex characters
  if (!/^[0-9A-Fa-f]+$/.test(hexPart)) {
    return defaultColor;
  }
  
  if (hexPart.length === 6) {
    return color;
  } else if (hexPart.length < 6) {
    // Pad with zeros
    return '#' + hexPart.padEnd(6, '0');
  } else {
    // Truncate to 6 characters
    return '#' + hexPart.substring(0, 6);
  }
};
```

### 3. Usage
The helper function is now used in:
- Map route rendering (line-color paint property)
- Color indicator circles in via lists
- Color display boxes in via details

## Testing
✅ Database colors fixed
✅ Validation function added to both pages
✅ All map layers render without errors
✅ Color indicators display correctly
✅ No more MapLibre GL color validation errors

## Prevention
The `getValidColor()` function will automatically handle any future invalid colors by:
1. Validating hex format
2. Padding short colors
3. Truncating long colors
4. Falling back to default blue (#3B82F6) for invalid colors

## Status
✅ **COMPLETE** - All via colors are now valid and properly validated in the UI

---
**Date**: 2026-05-06
