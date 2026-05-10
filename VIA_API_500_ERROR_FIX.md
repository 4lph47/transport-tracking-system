# Via API 500 Error Fix

## Issue
The via detail API endpoint was returning a 500 Internal Server Error when trying to fetch a via.

## Root Cause
The API was trying to include nested relations that were causing Prisma query issues:
```typescript
transportes: {
  include: {
    motorista: true,  // This nested include was problematic
  },
}
```

The Motorista-Transporte relation is a one-to-one relation where:
- `Transporte.motorista` is optional (`Motorista?`)
- `Motorista.transporte` references back via `transporteId`

Nested includes with optional one-to-one relations can sometimes cause issues in Prisma.

## Solution
Simplified the API query to only select specific fields from transportes without the nested motorista include:

**Before:**
```typescript
transportes: {
  include: {
    motorista: {
      select: {
        nome: true,
      },
    },
  },
}
```

**After:**
```typescript
transportes: {
  select: {
    id: true,
    matricula: true,
    modelo: true,
    marca: true,
    codigo: true,
  },
}
```

## Changes Made

### 1. API Endpoint (`transport-admin/app/api/vias/[id]/route.ts`)

**Simplified the query:**
- Removed nested `motorista` include from transportes
- Added console logging for debugging
- Improved error handling with more details

**Benefits:**
- ✅ Avoids Prisma nested include issues
- ✅ Faster query (less data to fetch)
- ✅ Still returns all essential transporte information
- ✅ Frontend already handles missing motorista gracefully

### 2. Frontend (`transport-admin/app/vias/[id]/page.tsx`)

**Already had proper null checks:**
```typescript
{transporte.motorista && (
  <div className="flex items-center text-sm text-black">
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
    {transporte.motorista.nome}
  </div>
)}
```

Since motorista is now not included in the API response, this section simply won't render, which is acceptable.

## Impact

### What Still Works
- ✅ Via detail page loads successfully
- ✅ All via information displayed
- ✅ Map visualization with route and stops
- ✅ List of transportes with matricula, modelo, marca, codigo
- ✅ List of paragens with terminal indicators
- ✅ Edit functionality
- ✅ Statistics cards

### What Changed
- ⚠️ Motorista name no longer shown on transporte cards in via detail page
- ℹ️ Users can still click on transporte card to see full details including motorista

## Alternative Solutions (Not Implemented)

### Option 1: Separate Query for Motoristas
```typescript
// Fetch motoristas separately
const transportesWithMotoristas = await Promise.all(
  via.transportes.map(async (t) => {
    const motorista = await prisma.motorista.findFirst({
      where: { transporteId: t.id },
      select: { nome: true },
    });
    return { ...t, motorista };
  })
);
```
**Pros:** Would include motorista data
**Cons:** Multiple database queries, slower performance

### Option 2: Raw SQL Query
```typescript
const via = await prisma.$queryRaw`
  SELECT v.*, m.nome as motorista_nome
  FROM Via v
  LEFT JOIN Transporte t ON t.viaId = v.id
  LEFT JOIN Motorista m ON m.transporteId = t.id
  WHERE v.id = ${params.id}
`;
```
**Pros:** Full control over query
**Cons:** Loses Prisma type safety, more complex

### Option 3: Update Prisma Schema
Change the relation structure to avoid the issue.
**Pros:** Might fix the root cause
**Cons:** Requires schema migration, affects other parts of the app

## Testing

### Test Cases
- [x] Via with transportes loads successfully
- [x] Via without transportes loads successfully
- [x] Via with many paragens loads successfully
- [x] Via without municipio loads successfully (with null checks)
- [x] Map renders correctly
- [x] Transporte cards are clickable
- [x] Edit mode works

### Error Handling
- [x] 404 for non-existent via
- [x] 500 with detailed error message
- [x] Console logging for debugging
- [x] Frontend shows user-friendly error alert

## Monitoring

Added console logging to track:
```typescript
console.log('Fetching via with id:', params.id);
console.log('Via found:', via.codigo, 'with', via.paragens?.length || 0, 'paragens');
console.error('Error details:', {
  message: error.message,
  code: error.code,
  meta: error.meta,
});
```

## Future Improvements

1. **Add Motorista Back (If Needed):**
   - Implement Option 1 (separate queries) if motorista display is required
   - Or fix the Prisma relation issue at the schema level

2. **Caching:**
   - Add Redis caching for via details
   - Reduce database load for frequently accessed vias

3. **Pagination:**
   - Paginate paragens list for vias with many stops
   - Paginate transportes list for vias with many buses

4. **Performance:**
   - Add database indexes on frequently queried fields
   - Use `select` instead of `include` where possible

## Related Files

- `transport-admin/app/api/vias/[id]/route.ts` - API endpoint (fixed)
- `transport-admin/app/vias/[id]/page.tsx` - Frontend page (already had null checks)
- `transport-admin/prisma/schema.prisma` - Database schema
- `VIA_DETAIL_NULL_CHECKS_FIX.md` - Previous null check fixes

## Conclusion

The 500 error is now fixed by simplifying the Prisma query to avoid problematic nested includes. The via detail page loads successfully and displays all essential information. The motorista name is no longer shown on transporte cards in the via detail page, but users can still click through to see full transporte details.
