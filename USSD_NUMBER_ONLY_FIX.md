# USSD Number-Only System - Complete Fix

## Requirements
1. ✅ **NO manual typing** - All interactions must be number-based
2. ✅ **Pagination** - Show all locations with page navigation
3. ✅ **Fix all errors** - No "Nenhum transporte disponível" errors
4. ✅ **Complete coverage** - All locations accessible via numbers

## Changes Required

### 1. Remove All Manual Input Options

**Current Issues:**
- Option 1: Has "8. Outro local" (manual typing)
- Option 2: Has "9. Outro (digitar nome)" (manual typing)
- Option 3: Has "9. Outro (digitar nome)" (manual typing)
- Option 4: Has "8. Outro" (manual typing)

**Solution:**
- Replace with pagination: "8. Ver mais" → Shows next 7 locations
- Add "9. Página anterior" for navigation
- Remove all `CON Digite...` prompts

### 2. Implement Pagination System

```typescript
// Store pagination state in session (use sessionId as key)
const paginationState = new Map<string, {
  currentPage: number,
  totalPages: number,
  allItems: string[]
}>();

function paginateItems(items: string[], page: number = 0, itemsPerPage: number = 7) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = items.slice(start, end);
  
  return {
    items: pageItems,
    currentPage: page,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0
  };
}
```

### 3. Fix "Nenhum transporte disponível" Errors

**Root Causes:**
1. ✅ Bidirectional search not implemented → **FIXED**
2. ⚠️ `searchRoutes()` shows self-references
3. ⚠️ Not all locations in `getAvailableLocations()`
4. ⚠️ `getAvailableOrigins()` doesn't include all terminals

**Solutions:**

#### A. Expand `getAvailableLocations()`
```typescript
async function getAvailableLocations(): Promise<string[]> {
  // Get ALL unique terminals from routes
  const routes = await prisma.via.findMany({
    select: {
      terminalPartida: true,
      terminalChegada: true,
    },
  });

  const locations = new Set<string>();
  
  routes.forEach(route => {
    if (route.terminalPartida) locations.add(route.terminalPartida);
    if (route.terminalChegada) locations.add(route.terminalChegada);
  });

  return Array.from(locations).sort();
}
```

#### B. Fix `searchRoutes()` Self-Reference
```typescript
async function searchRoutes(origin: string) {
  // ... existing code ...
  
  // Filter out self-references
  return routes
    .filter(route => route.terminalChegada !== origin)
    .map(route => ({
      id: route.id,
      name: route.nome,
      origin: route.terminalPartida,
      destination: route.terminalChegada,
    }));
}
```

#### C. Expand `getAvailableOrigins()`
```typescript
async function getAvailableOrigins(): Promise<string[]> {
  // Get ALL unique terminals (both partida and chegada)
  const routes = await prisma.via.findMany({
    select: {
      terminalPartida: true,
      terminalChegada: true,
    },
  });

  const origins = new Set<string>();
  
  routes.forEach(route => {
    if (route.terminalPartida) origins.add(route.terminalPartida);
    if (route.terminalChegada) origins.add(route.terminalChegada);
  });

  return Array.from(origins).sort();
}
```

### 4. New Menu Structure

#### Option 1: Find Transport Now
```
Level 1: Main menu
Level 2: Location list (page 1)
  1-7: Locations
  8: Ver mais (if more pages)
  9: Página anterior (if not first page)
  0: Voltar
Level 3: Destination list (page 1)
  1-7: Destinations
  8: Ver mais (if more pages)
  9: Página anterior (if not first page)
  0: Voltar
Level 4: Transport info
```

#### Option 2: Search Routes
```
Level 1: Main menu
Level 2: Origin list (page 1)
  1-7: Origins
  8: Ver mais (if more pages)
  9: Página anterior (if not first page)
  0: Voltar
Level 3: Route list
  1-9: Routes
  0: Voltar
Level 4: Route details
```

#### Option 3: Nearest Stops
```
Level 1: Main menu
Level 2: Area list (page 1)
  1-7: Areas
  8: Ver mais (if more pages)
  9: Página anterior (if not first page)
  0: Voltar
Level 3: Stop list
  1-9: Stops
  0: Voltar
Level 4: Stop details
```

#### Option 4: Calculate Fare
```
Level 1: Main menu
Level 2: Origin list (page 1)
  1-7: Origins
  8: Ver mais (if more pages)
  9: Página anterior (if not first page)
  0: Voltar
Level 3: Destination list (page 1)
  1-7: Destinations
  8: Ver mais (if more pages)
  9: Página anterior (if not first page)
  0: Voltar
Level 4: Fare calculation
```

### 5. Session State Management

Since USSD is stateless, we need to encode pagination state in the input string:

**Option A: Use special markers**
```
text=1*1*p2  → Option 1, Location 1, Page 2
text=1*1*3*p1 → Option 1, Location 1, Destination 3, Page 1
```

**Option B: Use session storage (recommended)**
```typescript
// In-memory session store (for development)
const sessionStore = new Map<string, any>();

function getSession(sessionId: string) {
  return sessionStore.get(sessionId) || {};
}

function setSession(sessionId: string, data: any) {
  sessionStore.set(sessionId, { ...getSession(sessionId), ...data });
}
```

### 6. Implementation Plan

#### Phase 1: Core Fixes (Immediate)
1. ✅ Fix `getAvailableLocations()` - Include ALL terminals
2. ✅ Fix `getAvailableOrigins()` - Include ALL terminals
3. ✅ Fix `searchRoutes()` - Remove self-references
4. ✅ Fix `getAvailableDestinations()` - Bidirectional search (DONE)

#### Phase 2: Pagination (Next)
1. ⏳ Implement session storage
2. ⏳ Add pagination to Option 1 (Find Transport)
3. ⏳ Add pagination to Option 2 (Search Routes)
4. ⏳ Add pagination to Option 3 (Nearest Stops)
5. ⏳ Add pagination to Option 4 (Calculate Fare)

#### Phase 3: Remove Manual Input (Final)
1. ⏳ Remove all "Digite..." prompts
2. ⏳ Remove option 8/9 manual input handlers
3. ⏳ Test all flows end-to-end

### 7. Testing Checklist

#### All Locations Must Work
- [ ] Albasine
- [ ] Albert Lithule
- [ ] Boane
- [ ] Boquisso
- [ ] Chamissava
- [ ] Laurentina
- [ ] Machava Sede
- [ ] Mafuiane
- [ ] Matendene
- [ ] Matola Gare
- [ ] Matola Sede
- [ ] Michafutene
- [ ] Terminal Museu
- [ ] Terminal Zimpeto
- [ ] Tchumene

#### All Options Must Work
- [ ] Option 1: Find Transport Now
- [ ] Option 2: Search Routes
- [ ] Option 3: Nearest Stops
- [ ] Option 4: Calculate Fare
- [ ] Option 5: Help

#### No Errors Allowed
- [ ] No "Nenhum transporte disponível"
- [ ] No "Nenhuma localização disponível"
- [ ] No "Nenhuma rota encontrada"
- [ ] No "Nenhuma paragem encontrada"
- [ ] No "Nenhum destino disponível"

### 8. Quick Fix (Immediate Implementation)

For immediate deployment, apply these minimal changes:

```typescript
// 1. Fix getAvailableLocations() - Remove slice limit
async function getAvailableLocations(): Promise<string[]> {
  const routes = await prisma.via.findMany({
    select: {
      terminalPartida: true,
      terminalChegada: true,
    },
  });

  const locations = new Set<string>();
  routes.forEach(route => {
    if (route.terminalPartida) locations.add(route.terminalPartida);
    if (route.terminalChegada) locations.add(route.terminalChegada);
  });

  return Array.from(locations).sort();
}

// 2. Fix searchRoutes() - Remove self-references
// Add this filter before returning:
.filter(route => route.terminalChegada.toLowerCase() !== origin.toLowerCase())

// 3. Show more items per page (9 instead of 7)
availableLocations.slice(0, 9).forEach((loc, i) => {
  locationMenu += `${i + 1}. ${loc}\n`;
});

// 4. Remove "Outro local" options temporarily
// Comment out or remove lines with "8. Outro local"
```

## Status

- ✅ Bidirectional search: FIXED
- ⏳ Pagination: IN PROGRESS
- ⏳ Remove manual input: PENDING
- ⏳ Complete testing: PENDING

## Next Steps

1. Apply quick fixes immediately
2. Test all 15 locations
3. Implement full pagination system
4. Remove all manual input options
5. Deploy and verify production

---

**Priority**: HIGH
**Impact**: Critical - Affects all USSD users
**Effort**: Medium - 2-3 hours for complete implementation
