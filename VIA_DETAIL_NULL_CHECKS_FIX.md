# Via Detail Page - Null Checks Fix

## Issue
Runtime error when viewing via detail page:
```
TypeError: Cannot read properties of undefined (reading 'nome')
```

## Root Cause
The via detail page was trying to access `via.municipio.nome` without checking if `municipio` exists. Some vias in the database may not have a `municipioId` set, causing the municipio relation to be `null` or `undefined`.

## Solution
Added defensive null checks throughout the via detail page component to handle missing or undefined data gracefully.

## Changes Made

### 1. Header Section
**Before:**
```typescript
<p className="text-black mt-1">{via.codigo} - {via.municipio.nome}</p>
```

**After:**
```typescript
<p className="text-black mt-1">{via.codigo}{via.municipio ? ` - ${via.municipio.nome}` : ''}</p>
```

### 2. Via Information Section
**Before:**
```typescript
<p className="text-lg text-black">{via.municipio.nome}</p>
<p className="text-lg text-black">{via.terminalPartida}</p>
<p className="text-lg text-black">{via.terminalChegada}</p>
```

**After:**
```typescript
<p className="text-lg text-black">{via.municipio?.nome || 'N/A'}</p>
<p className="text-lg text-black">{via.terminalPartida || 'N/A'}</p>
<p className="text-lg text-black">{via.terminalChegada || 'N/A'}</p>
```

### 3. Statistics Cards
**Before:**
```typescript
<p className="text-3xl font-bold text-black">{via._count.paragens}</p>
<p className="text-3xl font-bold text-black">{via._count.transportes}</p>
```

**After:**
```typescript
<p className="text-3xl font-bold text-black">{via._count?.paragens || 0}</p>
<p className="text-3xl font-bold text-black">{via._count?.transportes || 0}</p>
```

### 4. Section Headers
**Before:**
```typescript
<h3>Transportes Atribuídos ({via._count.transportes})</h3>
<h3>Paragens ({via._count.paragens})</h3>
```

**After:**
```typescript
<h3>Transportes Atribuídos ({via._count?.transportes || 0})</h3>
<h3>Paragens ({via._count?.paragens || 0})</h3>
```

### 5. Fetch Function Error Handling
**Before:**
```typescript
async function fetchVia(id: string) {
  try {
    const response = await fetch(`/api/vias/${id}`);
    const data = await response.json();
    setVia(data);
    setFormData({
      nome: data.nome,
      terminalPartida: data.terminalPartida,
      terminalChegada: data.terminalChegada,
      cor: data.cor,
    });
  } catch (error) {
    console.error('Erro ao carregar via:', error);
  } finally {
    setLoading(false);
  }
}
```

**After:**
```typescript
async function fetchVia(id: string) {
  try {
    const response = await fetch(`/api/vias/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Ensure data has required structure
    if (!data) {
      throw new Error('No data received from API');
    }
    
    setVia(data);
    setFormData({
      nome: data.nome || '',
      terminalPartida: data.terminalPartida || '',
      terminalChegada: data.terminalChegada || '',
      cor: data.cor || '#3B82F6',
    });
  } catch (error) {
    console.error('Erro ao carregar via:', error);
    alert('Erro ao carregar via. Por favor, tente novamente.');
  } finally {
    setLoading(false);
  }
}
```

## Null Safety Patterns Used

### 1. Optional Chaining (`?.`)
```typescript
via.municipio?.nome  // Returns undefined if municipio is null/undefined
via._count?.paragens // Returns undefined if _count is null/undefined
```

### 2. Nullish Coalescing (`||`)
```typescript
via.municipio?.nome || 'N/A'  // Returns 'N/A' if nome is falsy
via._count?.paragens || 0     // Returns 0 if paragens is falsy
```

### 3. Conditional Rendering
```typescript
{via.municipio ? ` - ${via.municipio.nome}` : ''}
```

### 4. Default Values
```typescript
nome: data.nome || '',
cor: data.cor || '#3B82F6',
```

## Benefits

1. **No More Runtime Errors:** Page won't crash if data is missing
2. **Better UX:** Shows 'N/A' or '0' instead of crashing
3. **Graceful Degradation:** Page still works with partial data
4. **Better Error Messages:** User gets feedback if something goes wrong
5. **Defensive Programming:** Handles edge cases proactively

## Testing Checklist

- [x] Via with complete data (municipio, terminals, counts)
- [x] Via without municipio
- [x] Via without terminals
- [x] Via without paragens
- [x] Via without transportes
- [x] Via with null/undefined _count
- [x] API error handling
- [x] Network error handling

## Related Files

- `transport-admin/app/vias/[id]/page.tsx` - Via detail page (fixed)
- `transport-admin/app/api/vias/[id]/route.ts` - API endpoint (already correct)

## Prevention

To prevent similar issues in the future:

1. **Always use optional chaining** when accessing nested properties
2. **Provide default values** for all data from API
3. **Validate API responses** before using them
4. **Add TypeScript strict null checks** in tsconfig.json
5. **Test with incomplete data** during development

## TypeScript Improvement (Optional)

Consider making the Via interface more explicit about optional fields:

```typescript
interface Via {
  id: string;
  nome: string;
  codigo: string;
  cor: string;
  terminalPartida?: string;  // Optional
  terminalChegada?: string;  // Optional
  geoLocationPath: string;
  municipio?: {              // Optional
    id: string;
    nome: string;
  };
  _count?: {                 // Optional
    paragens: number;
    transportes: number;
  };
  paragens?: Array<...>;     // Optional
  transportes?: Array<...>;  // Optional
}
```

This makes it clear which fields might be missing and forces developers to handle those cases.

## Conclusion

The via detail page is now robust and handles missing data gracefully. Users will see 'N/A' or '0' for missing values instead of experiencing a crash.
