# Complete USSD Options Analysis - Null Errors & Missing Data

## Overview
Comprehensive analysis of all 5 USSD options and their complete flows for potential null errors and missing data handling.

---

## OPTION 1: Encontrar Transporte Agora (Find Transport Now)

### Flow: Main Menu → Location → Destination → Transport Info

### Level 1 (Select Option 1)
```typescript
const availableLocations = await getAvailableLocations();
if (availableLocations.length === 0) {
  return `END Nenhuma localização disponível no momento.`;
}
```
**Status**: ✅ **GOOD** - Handles empty results

### Level 2 (Select Location)
```typescript
const locationIndex = parseInt(userInput) - 1;
if (locationIndex < 0 || locationIndex >= locations.length) {
  return `END Opção inválida.`;
}
```
**Issues**:
- ❌ **Missing isNaN check** - If user enters "abc", parseInt returns NaN
- ❌ **No validation before parseInt** - Could cause issues

**Fix Needed**:
```typescript
const locationIndex = parseInt(userInput) - 1;
if (isNaN(locationIndex) || locationIndex < 0 || locationIndex >= locations.length) {
  return `END Opção inválida.`;
}
```

### Level 2 (Find Nearest Stop)
```typescript
const nearestStop = await findNearestStop(currentLocation);

if (!nearestStop) {
  return `END Nenhuma paragem encontrada perto de ${currentLocation}.`;
}
```
**Status**: ✅ **GOOD** - Handles null result

### Level 2 (Get Destinations)
```typescript
const destinations = await getAvailableDestinations(currentLocation);

if (destinations.length === 0) {
  return `END Nenhum transporte disponível de ${currentLocation}.`;
}
```
**Status**: ✅ **GOOD** - Handles empty results

### Level 3 (Select Destination)
```typescript
const currentLocation = locations[parseInt(secondChoice) - 1];

if (!currentLocation) {
  return `END Localização inválida.`;
}

const destIndex = parseInt(thirdInput) - 1;
if (destIndex < 0 || destIndex >= destinations.length) {
  return `END Opção inválida.`;
}
```
**Issues**:
- ❌ **Missing isNaN check on destIndex**
- ⚠️ **Potential undefined access** - If secondChoice is invalid, currentLocation is undefined

**Fix Needed**:
```typescript
const locationIndex = parseInt(secondChoice) - 1;
if (isNaN(locationIndex) || locationIndex < 0 || locationIndex >= locations.length) {
  return `END Opção inválida.`;
}
const currentLocation = locations[locationIndex];

const destIndex = parseInt(thirdInput) - 1;
if (isNaN(destIndex) || destIndex < 0 || destIndex >= destinations.length) {
  return `END Opção inválida.`;
}
```

### Level 3 (Find Transport Info)
```typescript
const transportInfo = await findTransportInfo(currentLocation, destination);

if (!transportInfo) {
  return `END Nenhum transporte encontrado de ${currentLocation} para ${destination}.`;
}
```
**Status**: ✅ **GOOD** - Handles null result (already fixed with comprehensive null checks)

### Level 3 (Create Mission)
```typescript
try {
  await createMissionForUser(phoneNumber, currentLocation, destination);
} catch (error) {
  console.error('Error creating mission:', error);
}
```
**Issues**:
- ⚠️ **Silent failure** - User gets success message even if mission creation fails
- ⚠️ **No user feedback** - User doesn't know if SMS notification will be sent

**Recommendation**: Consider adding a note if mission creation fails

---

## OPTION 2: Procurar Rotas (Search Routes)

### Flow: Main Menu → Origin → Route List → Route Details

### Level 1 (Select Option 2)
```typescript
const availableOrigins = await getAvailableOrigins();
if (availableOrigins.length === 0) {
  return `END Nenhuma rota disponível no momento.`;
}
```
**Status**: ✅ **GOOD** - Handles empty results

### Level 2 (Select Origin)
```typescript
const locationIndex = parseInt(userInput) - 1;
if (locationIndex >= 0 && locationIndex < locations.length) {
  origin = locations[locationIndex];
} else {
  return `END Opção inválida.`;
}
```
**Issues**:
- ❌ **Missing isNaN check** - If user enters "abc", condition fails but no explicit check

**Fix Needed**:
```typescript
const locationIndex = parseInt(userInput) - 1;
if (isNaN(locationIndex) || locationIndex < 0 || locationIndex >= locations.length) {
  return `END Opção inválida.`;
}
origin = locations[locationIndex];
```

### Level 2 (Search Routes)
```typescript
const routes = await searchRoutes(origin);

if (routes.length === 0) {
  return `END Nenhuma rota encontrada de "${origin}".
  
Tente outro nome de local.`;
}
```
**Status**: ✅ **GOOD** - Handles empty results

### Level 3 (Select Route)
```typescript
const routeIndex = parseInt(thirdInput) - 1;

if (isNaN(routeIndex) || routeIndex < 0) {
  return `END Opção inválida.`;
}

// Get origin from predefined list
const locations = ['Matola', 'Maputo Centro', 'Baixa', ...];
const locationIndex = parseInt(secondChoice) - 1;
const origin = locations[locationIndex];

const routes = await searchRoutes(origin);

if (routeIndex >= routes.length) {
  return `END Opção inválida.`;
}
```
**Issues**:
- ❌ **CRITICAL: Hardcoded location list** - Doesn't match dynamic list from Level 2
- ❌ **Index mismatch** - User selects from dynamic list but code uses hardcoded list
- ❌ **No bounds check on locationIndex** - Could access undefined

**Fix Needed**:
```typescript
// Remove hardcoded list, use the same dynamic query
const locations = await getAvailableOrigins();
const locationIndex = parseInt(secondChoice) - 1;

if (isNaN(locationIndex) || locationIndex < 0 || locationIndex >= locations.length) {
  return `END Opção inválida.`;
}

const origin = locations[locationIndex];
```

### Level 3 (Display Route)
```typescript
const route = routes[routeIndex];

return `END ${route.name}

De: ${route.origin}
Para: ${route.destination}

Horario: ${route.hours || '05:00 - 22:00'}
Tarifa: ${route.fare || '20-30'} MT

Obrigado por usar nosso servico!`;
```
**Issues**:
- ⚠️ **Potential null access** - If route.name, route.origin, or route.destination is null
- ✅ **Good fallbacks** - Uses || for hours and fare

**Fix Needed**:
```typescript
return `END ${route.name || 'Rota'}

De: ${route.origin || 'N/A'}
Para: ${route.destination || 'N/A'}

Horario: ${route.hours || '05:00 - 22:00'}
Tarifa: ${route.fare || '20-30'} MT

Obrigado por usar nosso servico!`;
```

---

## OPTION 3: Paragens Próximas (Nearest Stops)

### Flow: Main Menu → Area → Stop List → Stop Details

### Level 1 (Select Option 3)
```typescript
const availableAreas = await getAvailableAreas();
if (availableAreas.length === 0) {
  return `END Nenhuma paragem disponível no momento.`;
}
```
**Status**: ✅ **GOOD** - Handles empty results

### Level 2 (Select Area)
```typescript
const areaIndex = parseInt(userInput) - 1;
if (areaIndex >= 0 && areaIndex < areas.length) {
  area = areas[areaIndex];
} else {
  return `END Opção inválida.`;
}
```
**Issues**:
- ❌ **Missing isNaN check**

**Fix Needed**: Same as Option 2

### Level 2 (Search Stops)
```typescript
const stops = await searchStops(area);

if (stops.length === 0) {
  return `END Nenhuma paragem encontrada em "${area}".`;
}
```
**Status**: ✅ **GOOD** - Handles empty results

### Level 3 (Select Stop)
```typescript
const stopIndex = parseInt(thirdInput) - 1;

if (isNaN(stopIndex) || stopIndex < 0) {
  return `END Opção inválida.`;
}

// Get area from predefined list
const areas = ['Centro', 'Baixa', 'Matola', ...];
const areaIndex = parseInt(secondChoice) - 1;
const area = areas[areaIndex];

const stops = await searchStops(area);

if (stopIndex >= stops.length) {
  return `END Opção inválida.`;
}
```
**Issues**:
- ❌ **CRITICAL: Hardcoded area list** - Same issue as Option 2
- ❌ **Index mismatch** - User selects from dynamic list but code uses hardcoded list
- ❌ **No bounds check on areaIndex**

**Fix Needed**: Same pattern as Option 2

### Level 3 (Display Stop)
```typescript
const stop = stops[stopIndex];

return `END ${stop.name}

${stop.routes ? `Rotas: ${stop.routes}` : 'Sem informacao de rotas'}

Obrigado por usar nosso servico!`;
```
**Issues**:
- ⚠️ **Potential null access** - If stop.name is null
- ✅ **Good fallback** - Checks stop.routes before displaying

**Fix Needed**:
```typescript
return `END ${stop.name || 'Paragem'}

${stop.routes ? `Rotas: ${stop.routes}` : 'Sem informacao de rotas'}

Obrigado por usar nosso servico!`;
```

---

## OPTION 4: Calcular Tarifa (Calculate Fare)

### Flow: Main Menu → Origin → Destination → Fare Calculation

### Level 1 (Select Option 4)
```typescript
const fareLocations = await getAvailableLocations();
if (fareLocations.length === 0) {
  return `END Nenhuma localização disponível no momento.`;
}
```
**Status**: ✅ **GOOD** - Handles empty results

### Level 2 (Select Origin)
```typescript
const locationIndex = parseInt(userInput) - 1;
if (locationIndex < 0 || locationIndex >= locations.length) {
  return `END Opção inválida.`;
}
```
**Issues**:
- ❌ **Missing isNaN check**

### Level 2 (Get Destinations)
```typescript
const allDestinations = await getAvailableDestinations(origin);

// Filter out same origin
const destinations = allDestinations.filter(d => d !== origin);

if (destinations.length === 0) {
  return `END Nenhum destino disponível de ${origin}.`;
}
```
**Status**: ✅ **GOOD** - Handles empty results and filters origin

### Level 3 (Select Destination)
```typescript
const origin = locations[parseInt(secondChoice) - 1];

if (!origin) {
  return `END Origem inválida.`;
}

const destIndex = parseInt(thirdInput) - 1;
if (destIndex < 0 || destIndex >= destinations.length) {
  return `END Opção inválida.`;
}
```
**Issues**:
- ❌ **Missing isNaN check on destIndex**
- ⚠️ **Potential undefined access** - If secondChoice is invalid

**Fix Needed**: Same pattern as Option 1

### Level 3 (Calculate Fare)
```typescript
const fareInfo = await calculateFare(origin, destination);

return `END CALCULO DE TARIFA

DE: ${origin}
PARA: ${destination}

DISTANCIA: ${fareInfo.distance} km
TARIFA: ${fareInfo.fare} MT
TEMPO: ${fareInfo.duration}

ROTAS DISPONIVEIS: ${fareInfo.routeCount}`;
```
**Issues**:
- ⚠️ **No null check on fareInfo** - If calculateFare returns null, will crash
- ⚠️ **Potential null properties** - fareInfo.distance, fareInfo.fare, etc.

**Fix Needed**:
```typescript
const fareInfo = await calculateFare(origin, destination);

if (!fareInfo) {
  return `END Erro ao calcular tarifa. Tente novamente.`;
}

return `END CALCULO DE TARIFA

DE: ${origin || 'N/A'}
PARA: ${destination || 'N/A'}

DISTANCIA: ${fareInfo.distance || '0.0'} km
TARIFA: ${fareInfo.fare || '0'} MT
TEMPO: ${fareInfo.duration || 'N/A'}

ROTAS DISPONIVEIS: ${fareInfo.routeCount || 0}`;
```

### calculateFare Function
```typescript
return {
  distance: distance.toFixed(1),
  fare: fare.toString(),
  duration: `${duration} min`,
  routeCount: routes.length
};
```
**Status**: ✅ **GOOD** - Always returns valid object with fallback in catch block

---

## OPTION 5: Ajuda (Help)

### Flow: Main Menu → Help Message

```typescript
case '5':
  return `END Sistema de Transportes - Ajuda

Marque *384*123# para:
- Encontrar transporte proximo
- Ver tempo de chegada
- Calcular tarifa
- Procurar rotas

Suporte: info@transporte.mz`;
```
**Status**: ✅ **PERFECT** - No database queries, no null risks

---

## INVALID INPUT HANDLING

### Main Menu Invalid Option
```typescript
default:
  return `END Opção inválida. Por favor, tente novamente.`;
```
**Status**: ✅ **GOOD** - Handles invalid options

### Back Navigation (0)
Multiple places check for `userInput === '0'` or `thirdInput === '0'`
**Status**: ✅ **GOOD** - Consistently handled

---

## HELPER FUNCTIONS ANALYSIS

### getAvailableLocations()
```typescript
routes.forEach(route => {
  if (route.terminalPartida) locations.add(route.terminalPartida);
  if (route.terminalChegada) locations.add(route.terminalChegada);
});
```
**Status**: ✅ **GOOD** - Checks for null before adding

### getAvailableOrigins()
```typescript
return routes
  .map(r => r.terminalPartida)
  .filter(t => t && t.trim().length > 0);
```
**Status**: ✅ **GOOD** - Filters out null/empty values

### getAvailableDestinations()
```typescript
return routes
  .map(r => r.terminalChegada)
  .filter(t => t && t.trim().length > 0 && t !== origin);
```
**Status**: ✅ **GOOD** - Filters out null/empty values and origin

### searchRoutes()
```typescript
return routes.map(route => ({
  id: route.id,
  name: route.nome,
  origin: route.terminalPartida,
  destination: route.terminalChegada,
  fare: '20-30',
  hours: '05:00 - 22:00'
}));
```
**Issues**:
- ⚠️ **No null checks** - If route.nome, terminalPartida, or terminalChegada is null

**Fix Needed**:
```typescript
return routes.map(route => ({
  id: route.id,
  name: route.nome || 'Rota',
  origin: route.terminalPartida || 'N/A',
  destination: route.terminalChegada || 'N/A',
  fare: '20-30',
  hours: '05:00 - 22:00'
}));
```

### searchStops()
```typescript
return stops.map(stop => ({
  id: stop.id,
  name: stop.nome,
  routes: stop.vias.map(v => v.via ? v.via.nome : 'N/A').filter(n => n !== 'N/A').join(', ') || 'N/A'
}));
```
**Status**: ✅ **GOOD** - Already fixed with null checks

### findNearestStop()
```typescript
if (!stop) return null;

return {
  id: stop.id,
  name: stop.nome,
  location: stop.geoLocation
};
```
**Issues**:
- ⚠️ **No null checks on properties** - If stop.nome or stop.geoLocation is null

**Fix Needed**:
```typescript
if (!stop) return null;

return {
  id: stop.id,
  name: stop.nome || 'Paragem',
  location: stop.geoLocation || '0,0'
};
```

### createMissionForUser()
```typescript
user = await prisma.utente.create({
  data: {
    nome: `User ${phoneNumber.slice(-4)}`,
    telefone: phoneNumber,
    email: `${phoneNumber}@temp.com`,
    senha: 'temp',
    mISSION: `USSD-${phoneNumber}-${Date.now()}`,
  }
});
```
**Issues**:
- ⚠️ **Security risk** - All users have password 'temp'
- ⚠️ **Invalid email** - Not a real email format
- ⚠️ **No phone validation** - Accepts any string

**Recommendations**:
- Hash the password or generate random one
- Make email optional or use proper format
- Validate phone number format

---

## SUMMARY OF CRITICAL ISSUES

### 🔴 **CRITICAL (Must Fix)**

1. **Hardcoded Location Lists** (Options 2 & 3, Level 3)
   - Lines 521, 557
   - Causes index mismatch between user selection and code
   - **Impact**: User selects "Aeroporto" but code thinks they selected "Matola"
   
2. **Missing isNaN Checks** (All options)
   - Multiple parseInt() calls without validation
   - **Impact**: User enters "abc", gets undefined behavior

3. **Missing Bounds Checks** (Options 1, 2, 3, 4)
   - Array access without validating index
   - **Impact**: Accessing undefined, potential crashes

### 🟡 **HIGH (Should Fix)**

4. **Missing Null Checks in Display** (Options 2, 3)
   - route.name, route.origin, stop.name could be null
   - **Impact**: Shows "null" in USSD response

5. **No Null Check on fareInfo** (Option 4)
   - If calculateFare fails, no fallback
   - **Impact**: Potential crash

6. **Missing Null Checks in Helper Functions**
   - searchRoutes(), findNearestStop()
   - **Impact**: Potential null in responses

### 🟢 **MEDIUM (Nice to Have)**

7. **Silent Mission Creation Failure** (Option 1)
   - User doesn't know if SMS will be sent
   - **Impact**: Poor user experience

8. **Security Issues** (createMissionForUser)
   - Weak password, invalid email
   - **Impact**: Security risk

---

## TESTING CHECKLIST

### Option 1: Encontrar Transporte
- [ ] Valid flow (1 → 1 → 1)
- [ ] Invalid location index (1 → 99)
- [ ] Non-numeric input (1 → abc)
- [ ] Back navigation (1 → 1 → 0)
- [ ] No destinations available
- [ ] No transport found

### Option 2: Procurar Rotas
- [ ] Valid flow (2 → 1 → 1)
- [ ] Invalid origin index (2 → 99)
- [ ] Non-numeric input (2 → abc)
- [ ] Custom origin (2 → 9 → Matola)
- [ ] No routes found
- [ ] Hardcoded list mismatch

### Option 3: Paragens Próximas
- [ ] Valid flow (3 → 1 → 1)
- [ ] Invalid area index (3 → 99)
- [ ] Non-numeric input (3 → abc)
- [ ] Custom area (3 → 9 → Centro)
- [ ] No stops found
- [ ] Hardcoded list mismatch

### Option 4: Calcular Tarifa
- [ ] Valid flow (4 → 1 → 1)
- [ ] Invalid origin index (4 → 99)
- [ ] Invalid destination index (4 → 1 → 99)
- [ ] Non-numeric input (4 → abc)
- [ ] No destinations available
- [ ] Fare calculation failure

### Option 5: Ajuda
- [ ] Valid flow (5)

### General
- [ ] Invalid main menu option (99)
- [ ] Zero input (0)
- [ ] Empty input ("")
- [ ] Special characters (*#)

---

## RECOMMENDED FIXES PRIORITY

1. **Immediate** (Before production):
   - Fix hardcoded location lists (Options 2 & 3)
   - Add isNaN checks to all parseInt calls
   - Add bounds checks to all array access

2. **High Priority** (This week):
   - Add null checks to display functions
   - Add null check on fareInfo
   - Fix helper function null handling

3. **Medium Priority** (Next sprint):
   - Improve mission creation error handling
   - Fix security issues in user creation
   - Add comprehensive logging

4. **Low Priority** (Backlog):
   - Extract magic numbers to constants
   - Refactor duplicate code
   - Add phone number validation
