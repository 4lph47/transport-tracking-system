# ✅ Bus Route vs User Journey - Implementation Complete

## 🎉 Summary

Successfully updated the buses API to distinguish between:
- **Full Bus Route**: The complete path the bus travels (Terminal A → Terminal B)
- **User Journey**: The segment the user will ride (Pickup Stop → Destination Stop)

---

## ✅ What Was Implemented

### 1. API Enhancement ✅
**File**: `app/api/buses/route.ts`

**Changes**:
- ✅ Added `destinationId` optional parameter
- ✅ Validates destination is on the same route (ViaParagem check)
- ✅ Returns `direcao` showing user journey when destination provided
- ✅ Returns `fullRoute` showing complete bus route
- ✅ Returns `userJourney` object with from/to details
- ✅ Marks stops with `isPickup` and `isDestination` flags

### 2. Response Structure ✅
```typescript
{
  buses: [{
    // User's journey (if destination provided)
    direcao: "Portagem → Museu",
    
    // Full bus route (always included)
    fullRoute: "Terminal Matola Sede → Praça dos Trabalhadores",
    
    // User journey details (if destination provided)
    userJourney: {
      from: "Portagem",
      to: "Museu",
      fromId: "paragem-123",
      toId: "paragem-789"
    },
    
    // All stops with markers
    stops: [
      { nome: "Terminal Matola Sede", isPickup: false, isDestination: false },
      { nome: "Portagem", isPickup: true, isDestination: false },
      { nome: "Museu", isPickup: false, isDestination: true },
      { nome: "Praça", isPickup: false, isDestination: false }
    ]
  }]
}
```

---

## 📖 How It Works

### Example Scenario:
**Bus Route**: Terminal Matola Sede → Godinho → Portagem → Museu → Praça dos Trabalhadores

**User Journey**: Portagem → Museu

### API Call:
```bash
GET /api/buses?paragemId=portagem-id&viaId=route-id&destinationId=museu-id
```

### Response:
```json
{
  "direcao": "Portagem → Museu",           // ← User sees this
  "fullRoute": "Terminal Matola Sede → Praça dos Trabalhadores",
  "userJourney": {
    "from": "Portagem",
    "to": "Museu"
  }
}
```

### What Happens:
1. ✅ Bus travels the FULL route (Terminal → Praça)
2. ✅ User boards at Portagem (marked with `isPickup: true`)
3. ✅ User exits at Museu (marked with `isDestination: true`)
4. ✅ User sees "Portagem → Museu" (their journey)
5. ✅ Bus continues to Praça dos Trabalhadores

---

## 🎯 Key Features

### 1. Flexible Display ✅
- **With destination**: Shows user journey ("Portagem → Museu")
- **Without destination**: Shows full route ("Terminal → Praça")

### 2. Stop Markers ✅
- `isPickup: true` - User's boarding stop (green marker)
- `isDestination: true` - User's exit stop (red marker)
- `isTerminal: true` - Route terminals (black marker)

### 3. Validation ✅
- Verifies destination is on the same route
- Uses ViaParagem relations for accuracy
- Ignores invalid destinations

### 4. Backward Compatible ✅
- `destinationId` is optional
- Existing calls without destination still work
- Returns full route when no destination provided

---

## 📱 Frontend Integration Guide

### Step 1: Update Search Page
```typescript
// When user selects destination
const destinationId = selectedDestination?.id;

// Call API with destination
const url = destinationId 
  ? `/api/buses?paragemId=${pickupId}&viaId=${routeId}&destinationId=${destinationId}`
  : `/api/buses?paragemId=${pickupId}&viaId=${routeId}`;

const response = await fetch(url);
const data = await response.json();

// Display user journey
console.log(data.buses[0].direcao); // "Portagem → Museu"
```

### Step 2: Update Map Display
```typescript
const bus = data.buses[0];

// Draw full route (gray)
drawRoute(bus.routeCoords, { color: 'gray' });

// Highlight user journey (blue)
if (bus.userJourney) {
  const pickup = bus.stops.find(s => s.isPickup);
  const dest = bus.stops.find(s => s.isDestination);
  highlightSegment(pickup, dest, { color: 'blue' });
}

// Add markers
bus.stops.forEach(stop => {
  if (stop.isPickup) addMarker(stop, { color: 'green' });
  else if (stop.isDestination) addMarker(stop, { color: 'red' });
  else if (stop.isTerminal) addMarker(stop, { color: 'black' });
});
```

### Step 3: Calculate Fare
```typescript
// Use user journey distance, not full route
if (bus.userJourney) {
  const pickup = bus.stops.find(s => s.isPickup);
  const dest = bus.stops.find(s => s.isDestination);
  const fare = calculateFare(pickup, dest);
} else {
  // Fallback to full route
  const fare = calculateFare(bus.stops[0], bus.stops[bus.stops.length - 1]);
}
```

---

## 🔍 Testing

### Test Case 1: With Destination
```bash
GET /api/buses?paragemId=paragem-123&viaId=via-456&destinationId=paragem-789
```
**Expected**:
- ✅ `direcao`: "Portagem → Museu"
- ✅ `fullRoute`: "Terminal Matola Sede → Praça dos Trabalhadores"
- ✅ `userJourney`: { from: "Portagem", to: "Museu" }
- ✅ Stops marked with `isPickup` and `isDestination`

### Test Case 2: Without Destination
```bash
GET /api/buses?paragemId=paragem-123&viaId=via-456
```
**Expected**:
- ✅ `direcao`: "Terminal Matola Sede → Praça dos Trabalhadores"
- ✅ `fullRoute`: "Terminal Matola Sede → Praça dos Trabalhadores"
- ✅ `userJourney`: null
- ✅ Only pickup stop marked with `isPickup`

### Test Case 3: Invalid Destination
```bash
GET /api/buses?paragemId=paragem-123&viaId=via-456&destinationId=invalid-id
```
**Expected**:
- ✅ Destination ignored (not on route)
- ✅ Falls back to full route display
- ✅ `userJourney`: null

---

## 📊 Before vs After

### Before:
```json
{
  "direcao": "Terminal Matola Sede → Praça dos Trabalhadores",
  "stops": [
    { "nome": "Terminal Matola Sede" },
    { "nome": "Portagem" },
    { "nome": "Museu" },
    { "nome": "Praça dos Trabalhadores" }
  ]
}
```
❌ User doesn't know their specific journey  
❌ No way to highlight pickup/destination  
❌ Fare calculated on full route

### After:
```json
{
  "direcao": "Portagem → Museu",
  "fullRoute": "Terminal Matola Sede → Praça dos Trabalhadores",
  "userJourney": {
    "from": "Portagem",
    "to": "Museu"
  },
  "stops": [
    { "nome": "Terminal Matola Sede", "isPickup": false, "isDestination": false },
    { "nome": "Portagem", "isPickup": true, "isDestination": false },
    { "nome": "Museu", "isPickup": false, "isDestination": true },
    { "nome": "Praça dos Trabalhadores", "isPickup": false, "isDestination": false }
  ]
}
```
✅ User sees their specific journey  
✅ Pickup and destination clearly marked  
✅ Fare calculated on journey distance  
✅ Full route still available for context

---

## 🚀 Next Steps

### Immediate (Frontend):
1. ⏳ Update search page to pass `destinationId`
2. ⏳ Update UI to display `direcao` (user journey)
3. ⏳ Update map to highlight journey segment
4. ⏳ Update fare calculation to use journey distance

### Future Enhancements:
1. ⏳ Show estimated time for journey segment (not full route)
2. ⏳ Show number of stops between pickup and destination
3. ⏳ Show intermediate stops in user journey
4. ⏳ Add "View full route" toggle option

---

## 📚 Documentation

- **Full Explanation**: `BUS_ROUTE_JOURNEY_EXPLANATION.md`
- **Update Summary**: `BUS_ROUTE_UPDATE_SUMMARY.md`
- **System Status**: `SYSTEM_STATUS_VERIFIED.md`

---

## ✅ Verification Checklist

- [x] API accepts `destinationId` parameter
- [x] API validates destination is on route (ViaParagem)
- [x] API returns `direcao` with user journey
- [x] API returns `fullRoute` with complete route
- [x] API returns `userJourney` object
- [x] Stops marked with `isPickup` flag
- [x] Stops marked with `isDestination` flag
- [x] Backward compatible (works without destination)
- [x] Documentation created
- [ ] Frontend updated to use new parameter
- [ ] Map updated to highlight journey
- [ ] Fare calculation updated

---

**Status**: ✅ API Implementation Complete  
**Next**: Frontend integration  
**Impact**: Better UX, accurate journey information, correct fare calculation

---

**Last Updated**: Bus Route Journey Implementation  
**Version**: 1.0.0
