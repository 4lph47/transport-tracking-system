# Municipios API Fix

## Problem
The Nova Via page was trying to fetch from `/api/municipios` which didn't exist, causing a "Unexpected token '<'" error because it was receiving an HTML 404 page instead of JSON.

## Solution
Created the missing `/api/municipios` API endpoint with full pagination support.

## Changes Made

### 1. Created API Endpoint
**File**: `transport-admin/app/api/municipios/route.ts`

Features:
- ✅ Full pagination support (`?page=X&limit=Y`)
- ✅ Search functionality (`?search=termo`)
- ✅ Count-only mode (`?countOnly=true`)
- ✅ Returns municipio data: `{ id, nome, codigo, provinciaId }`
- ✅ Ordered by name (ascending)
- ✅ Error handling with proper status codes

### 2. Updated Nova Via Page
**File**: `transport-admin/app/vias/novo/page.tsx`

**Before:**
```typescript
const response = await fetch('/api/municipios');
const data = await response.json();
setMunicipios(data);
```

**After:**
```typescript
const response = await fetch('/api/municipios?limit=1000');
if (!response.ok) {
  throw new Error('Failed to fetch municipios');
}
const result = await response.json();
setMunicipios(result.data || []);
```

Changes:
- ✅ Fetches with high limit to get all municipios for dropdown
- ✅ Checks response status before parsing JSON
- ✅ Handles paginated response structure (`result.data`)
- ✅ Shows error notification on failure
- ✅ Proper error handling

## API Endpoint Specification

### GET `/api/municipios`

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for nome or codigo
- `countOnly` (optional): Return only count (true/false)

#### Response Format

**Paginated Response:**
```json
{
  "data": [
    {
      "id": "1",
      "nome": "Maputo",
      "codigo": "MPT-001",
      "provinciaId": "1"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 61,
    "totalPages": 7
  }
}
```

**Count-Only Response:**
```json
{
  "total": 61
}
```

#### Error Response:
```json
{
  "error": "Erro ao buscar municípios"
}
```
Status: 500

## Benefits

1. **Fixes the Error**: No more "Unexpected token '<'" errors
2. **Pagination Ready**: API supports pagination for future municipios list page
3. **Search Support**: Can search municipios by name or code
4. **Consistent Pattern**: Follows same pattern as other APIs (paragens, vias, etc.)
5. **Proper Error Handling**: Returns JSON errors instead of HTML
6. **Scalable**: Can handle large numbers of municipios efficiently

## Testing Checklist

- [x] API endpoint created
- [x] Nova Via page updated to use new endpoint
- [x] Error handling implemented
- [x] Pagination support added
- [x] Search functionality included
- [ ] Test Nova Via page loads without errors
- [ ] Test municipios dropdown populates correctly
- [ ] Test creating a via with selected municipio

## Future Enhancements

The API is ready for:
- Municipios list page with pagination
- Municipios search functionality
- Municipios management (CRUD operations)
- Integration with provincias filtering
