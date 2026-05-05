# ✅ Bus Route vs User Journey - Update Summary

## 🎯 What Was Changed

### **Problem**:
The system was showing the **full bus route** (Terminal A → Terminal B) instead of the **user's journey segment** (Pickup Stop → Destination Stop).

### **Solution**:
Updated the buses API to:
1. Accept an optional `destinationId` parameter
2. Return both the user's journey AND the full bus route
3. Mark stops with `isPickup` and `isDestination` flags

---

## 🔧 Technical Changes

### **File Modified**: `app/api/buses/route.ts`

#### 1. Added `destinationId` Parameter
```typescript
const destinationId = searchParams.get('destinationId'); // User's destination stop
```

#### 2. Validate Destination Stop
```typescript
let destinationStop = null;
if (destinationId) {
  destinationStop = await prisma.paragem.findUnique({
    where: { id: destinationId },
  });
  
  // Verify destination is also on this route
  const destViaParagem = await prisma.viaParagem.findFirst({
    where: {
      viaId: viaId,
      paragemId: destinationId
    }
  });
  
  if (!destViaParagem) {
    destinationStop = null; // Ignore invalid destination
  }
}
```

#### 3. Return User Journey Information
```typescript
{
  // Show user's journey if destination provided, otherwise show full route
  direcao: destinationStop 
    ? `${paragem.nome} → ${destinationStop.nome}` 
    : `${transporte.via.terminalPartida} → ${transporte.via.terminalChegada}`,
  
  // Full bus route (for reference)
  fullRoute: `${transporte.via.terminalPartida} → ${transporte.via.terminalChegada}`,
  
  // User's journey segment
  userJourney: destinationStop ? {
    from: paragem.nome,
    to: destinationStop.nome,
    fromId: paragem.id,
    toId: destinationStop.id
  } : null,
  
  // Mark stops
  stops: transporte.via.paragens.map((vp) => ({
    id: vp.paragem.id,
    nome: vp.paragem.nome,
    latitude: lat,
    longitude: lng,
    isTerminal: vp.terminalBoolean,
    isPickup: vp.paragem.id === paragemId,
    isDestination: destinationStop ? vp.paragem.id === destinationId : false,
  }))
}
```

---

## 📊 API Response Examples

### **Example 1: Without Destination** (Show full route)
```bash
GET /api/buses?paragemId=paragem-123&viaId=via-456
```

**Response**:
```json
{
  "buses": [{
    "direcao": "Terminal Matola Sede → Praça dos Trabalhadores",
    "fullRoute": "Terminal Matola Sede → Praça dos Trabalhadores",
    "userJourney": null,
    "stops": [
      { "nome": "Terminal Matola Sede", "isPickup": false, "isDestination": false },
      { "nome": "Portagem", "isPickup": true, "isDestination": false },
      { "nome": "Museu", "isPickup": false, "isDestination": false },
      { "nome": "Praça dos Trabalhadores", "isPickup": false, "isDestination": false }
    ]
  }]
}
```

### **Example 2: With Destination** (Show user journey)
```bash
GET /api/buses?paragemId=paragem-123&viaId=via-456&destinationId=paragem-789
```

**Response**:
```json
{
  "buses": [{
    "direcao": "Portagem → Museu",
    "fullRoute": "Terminal Matola Sede → Praça dos Trabalhadores",
    "userJourney": {
      "from": "Portagem",
      "to": "Museu",
      "fromId": "paragem-123",
      "toId": "paragem-789"
    },
    "stops": [
      { "nome": "Terminal Matola Sede", "isPickup": false, "isDestination": false },
      { "nome": "Portagem", "isPickup": true, "isDestination": false },
      { "nome": "Museu", "isPickup": false, "isDestination": true },
      { "nome": "Praça dos Trabalhadores", "isPickup": false, "isDestination": false }
    ]
  }]
}
```

---

## 🎨 How to Use in Frontend

### **Option 1: Show User Journey Only**
```typescript
// When user selects both pickup and destination
const url = `/api/buses?paragemId=${pickupId}&viaId=${routeId}&destinationId=${destId}`;
const response = await fetch(url);
const data = await response.json();

// Display: "Portagem → Museu"
console.log(data.buses[0].direcao);
```

### **Option 2: Show Full Route**
```typescript
// When user only selects pickup (no destination yet)
const url = `/api/buses?paragemId=${pickupId}&viaId=${routeId}`;
const response = await fetch(url);
const data = await response.json();

// Display: "Terminal Matola Sede → Praça dos Trabalhadores"
console.log(data.buses[0].direcao);
```

### **Option 3: Show Both**
```typescript
// Show user journey with full route context
const bus = data.buses[0];

if (bus.userJourney) {
  console.log(`Sua viagem: ${bus.direcao}`);
  console.log(`Rota completa: ${bus.fullRoute}`);
} else {
  console.log(`Rota: ${bus.direcao}`);
}
```

---

## 🗺️ Map Visualization

### **Highlight User Journey on Map**:
```typescript
const bus = data.buses[0];

// Draw full route path (gray line)
drawRoutePath(bus.routeCoords, { color: 'gray', width: 2 });

// Highlight user journey segment (blue line)
if (bus.userJourney) {
  const pickupStop = bus.stops.find(s => s.isPickup);
  const destStop = bus.stops.find(s => s.isDestination);
  drawJourneySegment(pickupStop, destStop, { color: 'blue', width: 4 });
}

// Add stop markers
bus.stops.forEach(stop => {
  if (stop.isPickup) {
    addMarker(stop, { color: 'green', label: 'Pickup' });
  } else if (stop.isDestination) {
    addMarker(stop, { color: 'red', label: 'Destination' });
  } else if (stop.isTerminal) {
    addMarker(stop, { color: 'black', label: 'Terminal' });
  } else {
    addMarker(stop, { color: 'gray' });
  }
});
```

---

## ✅ Benefits

1. **Clear User Journey**: User sees exactly where they board and exit
2. **Full Context**: Full route still available for reference
3. **Accurate Fare**: Can calculate fare based on journey distance
4. **Better UX**: Clear visual distinction between pickup and destination
5. **Flexible**: Frontend can choose what to display

---

## 🚀 Next Steps for Frontend

### **1. Update Search Page** (`app/search/page.tsx`)
- Add destination selector
- Pass `destinationId` to buses API
- Display `direcao` (user journey) instead of full route

### **2. Update Map Display** (`app/components/TransportMap.tsx`)
- Highlight user journey segment
- Add pickup marker (green)
- Add destination marker (red)
- Show full route in gray

### **3. Update Fare Calculation**
- Calculate fare based on `userJourney` distance
- Not based on full route distance

### **4. Update USSD Service** (`app/api/ussd/route.ts`)
- Already handles user journey correctly
- Shows "De: X Para: Y" format

---

## 📝 Example Scenarios

### **Scenario 1: User Searches for Transport**
1. User selects pickup: "Portagem"
2. User selects destination: "Museu"
3. System shows: "Portagem → Museu" (user journey)
4. Map highlights: Portagem (green) → Museu (red)
5. Fare calculated: Distance from Portagem to Museu

### **Scenario 2: User Browses Routes**
1. User selects route: "Rota Matola-Baixa"
2. User selects pickup: "Portagem"
3. System shows: "Terminal Matola Sede → Praça dos Trabalhadores" (full route)
4. Map shows: All stops, Portagem marked as pickup (green)

### **Scenario 3: User Tracks Bus**
1. User tracking bus from Portagem to Museu
2. Display: "Sua viagem: Portagem → Museu"
3. Map shows: Bus moving along full route, journey segment highlighted
4. Notification: "Autocarro chegando em Portagem em 5 minutos"

---

## 📚 Documentation

- **Full Explanation**: See `BUS_ROUTE_JOURNEY_EXPLANATION.md`
- **API Documentation**: See API response examples above
- **Frontend Integration**: See "Next Steps for Frontend" section

---

**Status**: ✅ API Updated and Ready  
**Next**: Frontend integration to use new `destinationId` parameter  
**Impact**: Better UX, accurate journey information, correct fare calculation
