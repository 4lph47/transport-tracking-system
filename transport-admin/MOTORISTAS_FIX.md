# Motoristas Display Fix

## Issue
The motoristas page was showing 0 motoristas even though there are 111 motoristas in the database.

## Root Cause
The API endpoint returns data in a paginated format:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 111,
    "totalPages": 12
  }
}
```

But the frontend was expecting a simple array and wasn't correctly extracting the `data` property.

## Solution
Updated the `fetchMotoristas()` function in `transport-admin/app/motoristas/page.tsx` to:
1. Request a higher limit (1000) to get all motoristas
2. Correctly handle both array and paginated response formats
3. Extract the `data` property from the paginated response

### Code Change
```typescript
async function fetchMotoristas() {
  try {
    const response = await fetch('/api/motoristas?limit=1000');
    const result = await response.json();
    // Handle both array and paginated response formats
    const data = Array.isArray(result) ? result : (result.data || []);
    setMotoristas(data);
  } catch (error) {
    console.error('Erro ao carregar motoristas:', error);
    setMotoristas([]);
  } finally {
    setLoading(false);
  }
}
```

## Database Status
✅ **111 motoristas** found in database
- All are **active** (status: 'ativo')
- All have **transportes assigned**
- All have valid contact information

### Sample Motoristas:
1. Abasi Muthisse - ACG-003M
2. Abasi Ngovene - ACD-002M
3. Amadi Chicuamba - ACJ-005M
4. Amadi Macie - ACD-003M
5. Amadi Santos - ACA-002M
... (106 more)

## Testing
Run the check script to verify motoristas in database:
```bash
cd transport-admin
node scripts/check-motoristas.js
```

## Files Modified
1. `transport-admin/app/motoristas/page.tsx` - Fixed data fetching
2. `transport-admin/scripts/check-motoristas.js` - Created diagnostic script

## Result
✅ Motoristas page now displays all 111 motoristas correctly
✅ Search and filter functionality works as expected
✅ Pagination displays correct data
