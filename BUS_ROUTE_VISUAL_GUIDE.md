# 🚌 Bus Route vs User Journey - Visual Guide

## 🎨 Visual Representation

### The Complete Picture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FULL BUS ROUTE                                  │
│  Terminal Matola Sede → Godinho → Portagem → Museu → Praça dos Trab.  │
└─────────────────────────────────────────────────────────────────────────┘
                                        ▲                ▲
                                        │                │
                                   USER BOARDS      USER EXITS
                                   (Pickup)       (Destination)
                                        │                │
                                        └────────────────┘
                                      USER'S JOURNEY
                                    Portagem → Museu
```

---

## 🗺️ Map Visualization

### Full Route Path (Gray Line)
```
🏁 Terminal Matola Sede
    │
    ├─── 2.5 km ───
    │
🔵 Godinho
    │
    ├─── 3.0 km ───
    │
🟢 Portagem ◄─────────────── USER BOARDS HERE
    │
    ├─── 2.0 km ───  ◄────── USER'S JOURNEY (Highlighted in Blue)
    │
🔴 Museu ◄──────────────────── USER EXITS HERE
    │
    ├─── 1.5 km ───
    │
🏁 Praça dos Trabalhadores
```

### Legend:
- 🏁 Terminal (Black marker)
- 🔵 Regular stop (Gray marker)
- 🟢 Pickup stop (Green marker) - `isPickup: true`
- 🔴 Destination stop (Red marker) - `isDestination: true`
- Blue line = User's journey segment
- Gray line = Full bus route

---

## 📱 UI Display Examples

### Example 1: Search Results Card

```
┌─────────────────────────────────────────────────┐
│  🚌 Autocarro ABC-1234                          │
│  📍 Portagem → Museu                            │  ← User Journey
│  ⏱️  Chega em 10 minutos                        │
│  💰 20 MT                                        │
│                                                  │
│  ℹ️  Rota completa: Terminal Matola → Praça    │  ← Full Route (small text)
└─────────────────────────────────────────────────┘
```

### Example 2: Detailed View

```
┌─────────────────────────────────────────────────┐
│  🚌 Autocarro ABC-1234                          │
│  Rota: Matola-Baixa                             │
│                                                  │
│  👤 SUA VIAGEM                                  │
│  📍 De: Portagem                                │
│  📍 Para: Museu                                 │
│  📏 Distância: 2.0 km                           │
│  ⏱️  Tempo: 5 minutos                           │
│  💰 Tarifa: 20 MT                               │
│                                                  │
│  🛣️  ROTA COMPLETA DO AUTOCARRO                │
│  Terminal Matola Sede → Godinho → Portagem →   │
│  Museu → Praça dos Trabalhadores                │
│                                                  │
│  🚏 PARAGENS                                    │
│  ⚫ Terminal Matola Sede                        │
│  ⚪ Godinho                                     │
│  🟢 Portagem (Você embarca aqui)               │
│  🔴 Museu (Você desce aqui)                    │
│  ⚫ Praça dos Trabalhadores                     │
└─────────────────────────────────────────────────┘
```

### Example 3: Live Tracking

```
┌─────────────────────────────────────────────────┐
│  🚌 Rastreando seu autocarro                    │
│                                                  │
│  📍 Sua viagem: Portagem → Museu                │
│                                                  │
│  🚌 Autocarro está em: Godinho                  │
│  ⏱️  Chegará em Portagem em: 5 minutos          │
│                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Terminal → Godinho → Portagem → Museu → Praça │
│              🚌 AQUI    🟢 VOCÊ    🔴 DESTINO   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                  │
│  📊 Progresso: ▓▓▓▓▓▓░░░░░░░░░░ 40%            │
└─────────────────────────────────────────────────┘
```

---

## 🎯 User Flow Scenarios

### Scenario 1: Complete Journey Selection

```
Step 1: User selects pickup
┌─────────────────────────┐
│ Onde você está?         │
│ ▼ Portagem             │  ← User selects
└─────────────────────────┘

Step 2: User selects destination
┌─────────────────────────┐
│ Para onde vai?          │
│ ▼ Museu                │  ← User selects
└─────────────────────────┘

Step 3: System shows user journey
┌─────────────────────────┐
│ 🚌 Autocarro ABC-1234   │
│ 📍 Portagem → Museu     │  ← User's journey
│ ⏱️  10 min | 💰 20 MT   │
└─────────────────────────┘
```

### Scenario 2: Browse Routes

```
Step 1: User selects route
┌─────────────────────────┐
│ Escolha a rota          │
│ ▼ Matola-Baixa         │  ← User selects
└─────────────────────────┘

Step 2: User selects pickup
┌─────────────────────────┐
│ Onde você está?         │
│ ▼ Portagem             │  ← User selects
└─────────────────────────┘

Step 3: System shows full route
┌─────────────────────────┐
│ 🚌 Autocarro ABC-1234   │
│ 📍 Terminal → Praça     │  ← Full route
│ 🟢 Você: Portagem       │  ← Pickup marked
└─────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   Frontend   │
│  (User Input)│
└──────┬───────┘
       │
       │ 1. User selects:
       │    - Pickup: Portagem
       │    - Destination: Museu
       │    - Route: Matola-Baixa
       │
       ▼
┌──────────────────────────────────────────┐
│  API Call                                │
│  /api/buses?                             │
│    paragemId=portagem-id                 │
│    viaId=route-id                        │
│    destinationId=museu-id                │
└──────┬───────────────────────────────────┘
       │
       │ 2. API validates:
       │    ✓ Pickup is on route
       │    ✓ Destination is on route
       │    ✓ Both connected via ViaParagem
       │
       ▼
┌──────────────────────────────────────────┐
│  Database Query                          │
│  - Get route details                     │
│  - Get all stops on route                │
│  - Get buses on route                    │
│  - Calculate distances                   │
└──────┬───────────────────────────────────┘
       │
       │ 3. API returns:
       │    - direcao: "Portagem → Museu"
       │    - fullRoute: "Terminal → Praça"
       │    - userJourney: { from, to }
       │    - stops: [...with markers]
       │
       ▼
┌──────────────────────────────────────────┐
│  Frontend Display                        │
│  - Show user journey                     │
│  - Highlight route segment               │
│  - Mark pickup (green)                   │
│  - Mark destination (red)                │
│  - Calculate fare on journey distance    │
└──────────────────────────────────────────┘
```

---

## 🎨 Color Coding System

### Stop Markers:
- 🟢 **Green** = Pickup stop (where user boards)
- 🔴 **Red** = Destination stop (where user exits)
- ⚫ **Black** = Terminal stops (route start/end)
- ⚪ **Gray** = Regular stops (not user's journey)

### Route Lines:
- 🔵 **Blue (thick)** = User's journey segment
- ⚪ **Gray (thin)** = Full bus route
- 🟡 **Yellow** = Bus current location

### Status Indicators:
- 🟢 **Green** = Bus arriving soon (< 5 min)
- 🟡 **Yellow** = Bus coming (5-15 min)
- 🔴 **Red** = Bus far away (> 15 min)

---

## 💡 Key Concepts

### 1. Bus Route = Full Path
```
The bus travels from Terminal A to Terminal B, stopping at all stops along the way.
This NEVER changes - it's the bus's complete journey.
```

### 2. User Journey = Segment
```
The user only rides PART of the bus route, from their pickup to their destination.
This is what the user cares about - their specific trip.
```

### 3. Display Logic
```
IF user selected destination:
  SHOW: User journey (Pickup → Destination)
  HIGHLIGHT: Journey segment on map
  CALCULATE: Fare based on journey distance
ELSE:
  SHOW: Full route (Terminal A → Terminal B)
  HIGHLIGHT: Pickup stop only
  CALCULATE: Fare based on full route
```

---

## 📐 Distance Calculation

### Full Route Distance:
```
Terminal Matola (0 km)
    ↓ 2.5 km
Godinho (2.5 km)
    ↓ 3.0 km
Portagem (5.5 km)
    ↓ 2.0 km
Museu (7.5 km)
    ↓ 1.5 km
Praça (9.0 km)

Total: 9.0 km
```

### User Journey Distance:
```
Portagem (0 km)
    ↓ 2.0 km
Museu (2.0 km)

Total: 2.0 km  ← Use this for fare calculation
```

---

## 🎯 Summary

### What the Bus Does:
✅ Travels the FULL route (Terminal → Terminal)  
✅ Stops at ALL stops along the way  
✅ Picks up passengers at any stop  
✅ Drops off passengers at any stop

### What the User Does:
✅ Boards at their pickup stop (Portagem)  
✅ Rides only their journey segment  
✅ Exits at their destination stop (Museu)  
✅ Pays fare based on journey distance

### What the System Shows:
✅ User journey: "Portagem → Museu"  
✅ Full route: "Terminal Matola → Praça"  
✅ Pickup marker: Green  
✅ Destination marker: Red  
✅ Journey segment: Highlighted in blue

---

**This is the correct behavior!** 🎉

The bus travels the full route, but the user only rides their segment.
