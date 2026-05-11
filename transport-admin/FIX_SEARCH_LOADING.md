# Fix Search Loading - Only Update List, Not Whole Page

## Problem
When searching in list pages, the entire page shows a loading spinner and disappears (header, stats cards, etc.). This is bad UX.

## Solution
Add a separate `listLoading` state that only shows a spinner in the table area while keeping the rest of the page visible.

## Pages to Fix
1. ✅ Paragens - DONE
2. ✅ Transportes - DONE  
3. ✅ Proprietários - DONE
4. ✅ Motoristas - DONE
5. ✅ Vias - DONE
6. ✅ Províncias - DONE
7. ✅ Municípios - DONE

## Status: ✅ ALL COMPLETE

## Changes Required for Each Page

### Step 1: Add listLoading State
```typescript
const [loading, setLoading] = useState(true);
const [listLoading, setListLoading] = useState(false);  // ADD THIS
```

### Step 2: Update Fetch Function
```typescript
async function fetchItems() {
  try {
    // Use listLoading for subsequent fetches, loading for initial load
    if (items.length > 0) {
      setListLoading(true);
    } else {
      setLoading(true);
    }
    
    // ... fetch logic ...
    
  } finally {
    setLoading(false);
    setListLoading(false);  // ADD THIS
  }
}
```

### Step 3: Wrap Table with Loading Spinner
```typescript
<div className="overflow-x-auto">
  {listLoading ? (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ) : (
    <table className="w-full">
      {/* table content */}
    </table>
  )}
</div>
```

## Result
- Initial page load: Full page loading spinner (good)
- Search/filter: Only table area shows spinner, header and stats remain visible (better UX)
