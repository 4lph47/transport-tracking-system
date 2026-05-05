# 🚌 Bus Route vs User Journey - Complete Explanation

## 📋 Concept Overview

### **Bus Route** (Full Path)
The complete path the bus travels from start to finish.

**Example**: Terminal Matola Sede → Godinho → Portagem → Museu → Praça dos Trabalhadores

### **User Journey** (Segment)
The portion of the bus route the user will ride.

**Example**: Portagem → Museu (user boards at Portagem, exits at Museu)

---

## 🎯 How It Works

### Scenario:
- **Bus Route**: Terminal Matola Sede → Godinho → Portagem → Museu → Praça dos Trabalhadores
- **User Pickup**: Portagem
- **User Destination**: Museu

### What Happens:

1. **Bus travels the FULL route**:
   ```
   Terminal Matola Sede → Godinho → Portagem → Museu → Praça dos Trabalhadores
   ```

2. **User boards at Portagem**:
   ```
   Terminal Matola Sede → Godinho → [USER BOARDS] Portagem → Museu → Praça dos Trabalhadores
   ```

3. **User exits at Museu**:
   ```
   Terminal Matola Sede → Godinho → Portagem → [USER EXITS] Museu → Praça dos Trabalhadores
   ```

4. **User's Journey**:
   ```
   Portagem → Museu
   ```

5. **Bus continues to final destination**:
   ```
   Terminal Matola Sede → Godinho → Portagem → Museu → Praça dos Trabalhadores
   ```

---

## 🔧 API Implementation

### **Updated Endpoint**: `/api/buses`

#### Parameters:
- `paragemId` (required) - User's pickup stop ID
- `viaId` (required) - Route ID
- `destinationId` (optional) - User's destination stop ID

#### Response Structure:

```typescript
{
  buses: [
    {
      id: "bus-123",
      matricula: "ABC-1234",
      via: "Rota Matola-Baixa",
      
      // USER'S JOURNEY (what user sees)
      direcao: "Portagem → Museu",
      
      // FULL BUS ROUTE (for reference)
      fullRoute: "Terminal Matola Sede → Praça dos Trabalhadores",
      
      // USER JOURNEY DETAILS
      userJourney: {
        from: "Portagem",
        to: "Museu",
        fromId: "paragem-123",
        toId: "paragem-456"
      },
      
      // ALL STOPS ON THE ROUTE (with markers)
      stops: [
        {
          id: "paragem-100",
          nome: "Terminal Matola Sede",
          isTerminal: true,
          isPickup: false,
          isDestination: false
        },
        {
          id: "paragem-101",
          nome: "Godinho",
          isTerminal: false,
          isPickup: false,
          isDestination: false
        },
        {
          id: "paragem-123",
          nome: "Portagem",
          isTerminal: false,
          isPickup: true,      // ← USER BOARDS HERE
          isDestination: false
        },
        {
          id: "paragem-456",
          nome: "Museu",
          isTerminal: false,
          isPickup: false,
          isDestination: true  // ← USER EXITS HERE
        },
        {
          id: "paragem-789",
          nome: "Praça dos Trabalhadores",
          isTerminal: true,
          isPickup: false,
          isDestination: false
        }
      ],
      
      distancia: 5000,        // Distance from bus to pickup stop
      tempoEstimado: 10,      // Time until bus arrives at pickup
      velocidade: 45,
      latitude: -25.9392,
      longitude: 32.5147,
      status: "Em Circulação",
      routeCoords: [...]      // Full route path coordinates
    }
  ]
}
```

---

## 🎨 UI Display Options

### Option 1: Show User Journey (Recommended)
```
🚌 Autocarro ABC-1234
📍 Portagem → Museu
⏱️  Chega em 10 minutos
💰 20 MT
```

### Option 2: Show Full Route with Highlight
```
🚌 Autocarro ABC-1234
📍 Terminal Matola Sede → Praça dos Trabalhadores
👤 Sua viagem: Portagem → Museu
⏱️  Chega em 10 minutos
💰 20 MT
```

### Option 3: Show Both
```
🚌 Autocarro ABC-1234
🛣️  Rota completa: Terminal Matola Sede → Praça dos Trabalhadores
👤 Sua viagem: Portagem → Museu
⏱️  Chega em 10 minutos
💰 20 MT
```

---

## 📱 Frontend Usage

### **Without Destination** (Show full route):
```typescript
const response = await fetch(`/api/buses?paragemId=${pickupId}&viaId=${routeId}`);
// direcao: "Terminal Matola Sede → Praça dos Trabalhadores"
```

### **With Destination** (Show user journey):
```typescript
const response = await fetch(
  `/api/buses?paragemId=${pickupId}&viaId=${routeId}&destinationId=${destId}`
);
// direcao: "Portagem → Museu"
// fullRoute: "Terminal Matola Sede → Praça dos Trabalhadores"
// userJourney: { from: "Portagem", to: "Museu" }
```

---

## 🗺️ Map Visualization

### Full Route Path:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Terminal Matola → Godinho → Portagem → Museu → Praça
```

### User Journey Highlighted:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Terminal Matola → Godinho → ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ → Praça
                            Portagem → Museu
                            (User Journey)
```

### Stop Markers:
- 🔵 Regular stop
- 🟢 User pickup stop (isPickup: true)
- 🔴 User destination stop (isDestination: true)
- 🏁 Terminal stop (isTerminal: true)

---

## 💡 Key Points

1. **Bus always travels the full route** - from terminal to terminal
2. **User only rides a segment** - from pickup to destination
3. **API returns both**:
   - `direcao` - User's journey (if destination provided)
   - `fullRoute` - Complete bus route
   - `stops` - All stops with markers (isPickup, isDestination)
4. **Frontend can choose** what to display based on context
5. **Route path coordinates** include the entire route, not just user segment

---

## 🔄 Fare Calculation

The fare should be calculated based on the **user's journey distance**, not the full route:

```typescript
// Distance from Portagem to Museu (user journey)
const userDistance = calculateDistance(pickupStop, destinationStop);

// NOT the full route distance
// const fullDistance = calculateDistance(terminalPartida, terminalChegada);
```

---

## ✅ Benefits

1. **Accurate Information**: User sees their specific journey
2. **Full Context**: User can see the complete bus route if needed
3. **Better UX**: Clear pickup and destination markers
4. **Flexible Display**: Frontend can choose what to show
5. **Correct Fare**: Based on actual journey distance

---

## 📝 Example Use Cases

### Use Case 1: Search Page
User searches for buses from Portagem to Museu:
- **Display**: "Portagem → Museu" (user journey)
- **Show**: Estimated arrival time at Portagem
- **Calculate**: Fare from Portagem to Museu

### Use Case 2: Route Details
User wants to see full route information:
- **Display**: "Terminal Matola Sede → Praça dos Trabalhadores" (full route)
- **Highlight**: Portagem (pickup) and Museu (destination)
- **Show**: All stops with markers

### Use Case 3: Live Tracking
User is tracking their bus:
- **Display**: "Sua viagem: Portagem → Museu"
- **Show**: Bus current location on full route
- **Highlight**: Upcoming stops until destination

---

## 🚀 Next Steps

1. ✅ API updated to accept `destinationId` parameter
2. ✅ API returns `direcao`, `fullRoute`, and `userJourney`
3. ✅ Stops marked with `isPickup` and `isDestination`
4. ⏳ Update frontend to pass `destinationId` when available
5. ⏳ Update UI to display user journey vs full route
6. ⏳ Update map to highlight user journey segment
7. ⏳ Update fare calculation to use journey distance

---

**Last Updated**: Bus Route Journey Implementation  
**Status**: ✅ API Ready, Frontend Update Pending
