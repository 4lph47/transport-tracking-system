# Empty Vias Fix - Complete

## Problem
Many vias were showing "Paragens: 0, Transportes: 0" because 111 out of 221 vias in the database have no stops or buses assigned to them.

## Solution Implemented

### UI Filtering (Automatic)
Both admin pages now **automatically hide vias with no data** from the list:

#### Files Updated:
1. **`app/admin/routes/page.tsx`** (Main app admin routes)
2. **`transport-admin/app/vias/page.tsx`** (Transport admin vias page)

#### What Changed:
The `filteredVias` logic now filters out vias where BOTH paragens AND transportes are 0:

```typescript
const filteredVias = Array.isArray(vias) ? vias.filter((via) => {
  // First filter by search term
  const matchesSearch = via.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    via.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    via.municipio?.nome?.toLowerCase().includes(searchTerm.toLowerCase());
  
  // Then filter out vias with no data (0 paragens AND 0 transportes)
  const hasData = via._count && (via._count.paragens > 0 || via._count.transportes > 0);
  
  return matchesSearch && hasData;
}) : [];
```

### Result:
- ✅ Users now only see vias that have actual data
- ✅ No more confusing "Paragens: 0, Transportes: 0" entries
- ✅ The 110 vias with data are still visible
- ✅ The 111 empty vias are hidden from the UI

## Optional: Delete Empty Vias from Database

If you want to permanently remove the empty vias from the database, run:

```bash
node delete-empty-vias.js
```

This script will:
1. Find all vias with 0 paragens AND 0 transportes
2. List them for review
3. Delete them from the database
4. Show a summary of what was deleted

### Before Running the Delete Script:
- The empty vias are just hidden in the UI
- They still exist in the database
- You can still access them via API if needed

### After Running the Delete Script:
- Empty vias are permanently removed
- Database is cleaner
- Reduces clutter

## Testing

1. **Navigate to vias page**: `http://localhost:3000/admin/routes` or `http://localhost:3001/vias`
2. **Verify**: You should now only see vias with data (110 vias instead of 221)
3. **Search**: Search functionality still works on the filtered list
4. **No zeros**: No more "Paragens: 0, Transportes: 0" entries

## Summary

- **Before**: 221 vias shown (111 with zeros)
- **After**: 110 vias shown (only those with data)
- **Database**: Still has 221 vias (unless you run the delete script)
- **User Experience**: Much cleaner, no confusing empty entries
