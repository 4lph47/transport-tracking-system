# USSD Null Errors and Missing Data Analysis

## Critical Issues Found

### 1. **geoLocation Parsing - Potential Crash**
**Location**: `findTransportInfo()` - Lines 1015-1016
```typescript
const [origemLat, origemLng] = origemParagem.geoLocation.split(',').map(Number);
const [destinoLat, destinoLng] = destinoParagem.geoLocation.split(',').map(Number);
```
**Issue**: If `geoLocation` is null or malformed, this will crash
**Fix Needed**: Add null checks and validation

### 2. **Transport Properties - Null Access**
**Location**: `findTransportInfo()` - Line 1095
```typescript
busId: `${transport.marca} ${transport.modelo} - ${transport.matricula}`,
```
**Issue**: If `marca` or `modelo` is null, will show "null null - AAA-1234"
**Fix Needed**: Provide fallback values

### 3. **Array Access Without Bounds Check**
**Location**: Multiple places in Level 2 and 3 handlers
```typescript
const currentLocation = locations[parseInt(secondChoice) - 1];
const origin = locations[parseInt(secondChoice) - 1];
```
**Issue**: If index is out of bounds, returns undefined
**Fix Needed**: Already has checks (`if (!currentLocation)`) but could be more robust

### 4. **Missing Null Check on Via Paragens**
**Location**: `findTransportInfo()` - Line 1027
```typescript
const firstStop = transport.via.paragens[0];
if (firstStop) {
  [currentLat, currentLng] = firstStop.paragem.geoLocation.split(',').map(Number);
}
```
**Issue**: `firstStop.paragem.geoLocation` could be null
**Fix Needed**: Add null check before split

### 5. **Division by Zero Risk**
**Location**: `getBusLocationName()` - Line 1120
```typescript
const progress = currentDistance / totalDistance;
```
**Issue**: If `totalDistance` is 0, will result in Infinity or NaN
**Fix Needed**: Add check for zero

### 6. **Missing Error Handling in Mission Creation**
**Location**: Level 3 handler - Lines 430-434
```typescript
try {
  await createMissionForUser(phoneNumber, currentLocation, destination);
} catch (error) {
  console.error('Error creating mission:', error);
}
```
**Issue**: Error is caught but user doesn't see any indication
**Impact**: User gets success message even if mission creation fails
**Fix Needed**: Consider informing user if mission creation fails

### 7. **Hardcoded Location Lists**
**Location**: Level 3 handler - Lines 577-578
```typescript
const locations = ['Matola', 'Maputo Centro', 'Baixa', 'Costa do Sol', 'Sommerschield', 'Polana', 'Aeroporto', 'Maxaquene'];
const areas = ['Centro', 'Baixa', 'Matola', 'Sommerschield', 'Polana', 'Costa do Sol', 'Maxaquene', 'Aeroporto'];
```
**Issue**: These don't match the dynamic locations from database
**Impact**: Can cause index mismatch errors
**Fix Needed**: Use the same dynamic lists from Level 2

### 8. **Missing Validation on User Input**
**Location**: Multiple parseInt() calls
```typescript
const locationIndex = parseInt(userInput) - 1;
```
**Issue**: If user enters non-numeric input, parseInt returns NaN
**Fix Needed**: Add isNaN() checks (some places have it, others don't)

### 9. **Potential Null in Stop Routes**
**Location**: `searchStops()` - Line 838
```typescript
routes: stop.vias.map(v => v.via.nome).join(', ') || 'N/A'
```
**Issue**: If `v.via` is null, will crash
**Fix Needed**: Add null check in map

### 10. **Missing Fallback for Empty Results**
**Location**: `getAvailableLocations()`, `getAvailableOrigins()`, etc.
**Issue**: Functions return empty arrays on error, but callers check `length === 0`
**Impact**: Good - already handled
**Status**: ✅ OK

## Medium Priority Issues

### 11. **Inconsistent Error Messages**
- Some errors say "Opção inválida"
- Others say "Nenhum transporte disponível"
- Should be consistent and user-friendly

### 12. **Missing Timeout Handling**
**Issue**: USSD requests take 10-15 seconds
**Impact**: May timeout on slow connections
**Recommendation**: Add caching or optimize queries further

### 13. **No Validation on Phone Number Format**
**Location**: `createMissionForUser()`
**Issue**: Accepts any phone number format
**Recommendation**: Validate format before creating user

### 14. **Temporary Email Generation**
**Location**: `createMissionForUser()` - Line 1253
```typescript
email: `${phoneNumber}@temp.com`,
```
**Issue**: Not a valid email format
**Recommendation**: Use proper temporary email or make it optional

### 15. **Default Password**
**Location**: `createMissionForUser()` - Line 1254
```typescript
senha: 'temp',
```
**Issue**: Security risk - all USSD users have same password
**Recommendation**: Generate random password or hash it

## Low Priority Issues

### 16. **Magic Numbers**
- Speed constants (45 km/h, 30 km/h) should be named constants
- Fare calculation (10 MT/km) should be configurable

### 17. **Duplicate Code**
- `searchRoutes()` and `searchStops()` have similar structure
- Could be refactored into a generic search function

### 18. **Missing Logging**
- Should log when users select options
- Would help debug user flow issues

## Recommendations Summary

### High Priority Fixes:
1. ✅ Add null checks for geoLocation parsing
2. ✅ Add fallback values for transport properties
3. ✅ Add null checks for paragem.geoLocation
4. ✅ Fix hardcoded location lists in Level 3
5. ✅ Add validation for all parseInt() calls

### Medium Priority:
6. Consider adding response caching for performance
7. Improve error messages consistency
8. Add phone number validation

### Low Priority:
9. Extract magic numbers to constants
10. Refactor duplicate code
11. Add more detailed logging

## Test Cases Needed

1. Test with null geoLocation
2. Test with transport missing marca/modelo
3. Test with empty via.paragens array
4. Test with invalid user input (letters instead of numbers)
5. Test with out-of-bounds array access
6. Test with malformed phone numbers
7. Test with database connection failure
8. Test with no transportes available
