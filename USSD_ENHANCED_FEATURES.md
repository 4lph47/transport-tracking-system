# ✅ USSD Enhanced with Location-Based Features!

## 🎉 New Features Added

Your USSD system now includes:
1. ✅ **Find Transport Now** - Location-based transport finder
2. ✅ **Calculate Fare** - Distance-based fare calculator
3. ✅ **Estimated Time** - Arrival time estimates
4. ✅ **Next Bus Info** - Shows available buses

---

## 📱 New Main Menu

```
Bem-vindo ao Sistema de Transportes 🚌
1. Encontrar Transporte Agora  ← NEW!
2. Procurar Rotas
3. Paragens Próximas
4. Calcular Tarifa              ← NEW!
5. Ajuda
```

---

## 🚀 Feature 1: Find Transport Now

### How It Works:

**Step 1: Select Your Location**
```
Onde você está agora?
1. Matola Sede
2. Baixa (Centro)
3. Museu
4. Zimpeto
5. Costa do Sol
6. Portagem
7. Machava
8. Outro local
0. Voltar
```

**Step 2: System Finds Nearest Stop**
```
Você está perto de:
Terminal Matola Sede

Para onde quer ir?
1. Baixa
2. Museu
3. Matola
4. Zimpeto
5. Costa do Sol
6. Outro destino
0. Voltar
```

**Step 3: Get Complete Transport Info**
```
🚌 Transporte Disponível

📍 De: Terminal Matola Sede
📍 Para: Praça dos Trabalhadores

⏰ Tempo estimado: 20 minutos
💰 Tarifa: 20 MT
🚏 Paragem: Terminal Matola Sede

Próximo autocarro:
Toyota Hiace (SSS-8888-MP)

Boa viagem!
```

### What You Get:
- ✅ Nearest stop to your location
- ✅ Estimated arrival time
- ✅ Exact fare amount
- ✅ Next available bus
- ✅ Route information

---

## 💰 Feature 2: Calculate Fare

### How It Works:

**Step 1: Select Origin**
```
Calcular Tarifa
Escolha sua origem:
1. Matola
2. Baixa
3. Museu
4. Zimpeto
5. Costa do Sol
6. Portagem
7. Machava
8. Outro
0. Voltar
```

**Step 2: Select Destination**
```
De: Matola

Para onde?
1. Baixa
2. Museu
3. Matola
4. Zimpeto
5. Costa do Sol
6. Portagem
7. Machava
8. Outro
0. Voltar
```

**Step 3: Get Fare Calculation**
```
💰 Cálculo de Tarifa

📍 De: Matola
📍 Para: Baixa

Distância: ~12.0 km
Tarifa: 25 MT

Tempo estimado: 24 min

Rotas disponíveis: 2
```

### What You Get:
- ✅ Distance between locations
- ✅ Exact fare amount
- ✅ Estimated travel time
- ✅ Number of available routes

---

## 📊 Fare Structure

The system uses distance-based pricing:

| Distance | Fare |
|----------|------|
| 0-5 km   | 15 MT |
| 5-10 km  | 20 MT |
| 10-15 km | 25 MT |
| 15-20 km | 30 MT |
| 20+ km   | 35 MT |

---

## ⏰ Time Estimation

### How It's Calculated:

- **Average Speed**: 30 km/h (city traffic)
- **Formula**: Time = Distance ÷ Speed
- **Example**: 12 km ÷ 30 km/h = 24 minutes

### Common Routes:

| Route | Distance | Time | Fare |
|-------|----------|------|------|
| Matola → Baixa | 12 km | 24 min | 25 MT |
| Matola → Museu | 10 km | 20 min | 20 MT |
| Baixa → Zimpeto | 15 km | 30 min | 25 MT |
| Baixa → Costa do Sol | 8 km | 16 min | 20 MT |
| Portagem → Baixa | 8 km | 16 min | 20 MT |
| Machava → Museu | 9 km | 18 min | 20 MT |

---

## 🚌 Next Bus Information

The system shows:
- **Bus Model**: Toyota Hiace, Mercedes Sprinter, etc.
- **License Plate**: For identification
- **Availability**: Based on database

---

## 🎯 Complete User Flows

### Flow 1: Find Transport from Current Location

```
Dial: *384*12345#
→ Main menu

Press: 1 (Find Transport Now)
→ Location selection

Press: 1 (Matola Sede)
→ Nearest stop found

Press: 1 (Go to Baixa)
→ Complete transport info
   - Time: 20 min
   - Fare: 20 MT
   - Next bus: Toyota Hiace
```

### Flow 2: Calculate Fare Before Traveling

```
Dial: *384*12345#
→ Main menu

Press: 4 (Calculate Fare)
→ Origin selection

Press: 1 (Matola)
→ Destination selection

Press: 2 (Baixa)
→ Fare calculation
   - Distance: 12 km
   - Fare: 25 MT
   - Time: 24 min
   - Routes: 2
```

### Flow 3: Search Routes (Existing Feature)

```
Dial: *384*12345#
→ Main menu

Press: 2 (Search Routes)
→ Origin selection

Press: 1 (Matola)
→ Route list

Press: 1 (First route)
→ Route details
```

---

## 🔍 Supported Locations

### Predefined Locations:

**For "Find Transport Now":**
1. Matola Sede
2. Baixa (Centro)
3. Museu
4. Zimpeto
5. Costa do Sol
6. Portagem
7. Machava

**For "Calculate Fare":**
1. Matola
2. Baixa
3. Museu
4. Zimpeto
5. Costa do Sol
6. Portagem
7. Machava

**Custom Locations:**
- Option 8: Type any location name

---

## 📈 How Data is Used

### Database Queries:

1. **Find Nearest Stop**
   - Searches `Paragem` table
   - Matches location name
   - Returns closest stop

2. **Find Routes**
   - Searches `Via` table
   - Matches origin AND destination
   - Returns available routes

3. **Get Bus Info**
   - Queries `Transporte` table
   - Finds buses on selected route
   - Shows next available bus

4. **Calculate Distance**
   - Uses predefined distance matrix
   - Common routes have exact distances
   - Unknown routes default to 10km

5. **Calculate Fare**
   - Based on distance
   - Uses fare structure table
   - Returns exact amount

---

## ⚠️ Limitations (USSD Constraints)

### What USSD Cannot Do:

❌ **Real-time GPS tracking** - Cannot get your exact GPS coordinates
❌ **Live bus positions** - Cannot show moving buses on map
❌ **Dynamic updates** - Cannot refresh automatically
❌ **Maps** - Text-only interface
❌ **Real-time ETAs** - Estimates based on schedule, not traffic

### What We Provide Instead:

✅ **Location selection** - Choose from predefined locations
✅ **Nearest stop** - Find closest stop to your area
✅ **Estimated times** - Based on average speeds
✅ **Fixed fares** - Distance-based pricing
✅ **Next bus info** - From database, not live tracking

---

## 🎯 Best Practices for Users

### For Accurate Results:

1. **Select Closest Location**
   - Choose the predefined location nearest to you
   - Use "Other" option for custom locations

2. **Check Fare Before Traveling**
   - Use "Calculate Fare" feature
   - Know exact cost in advance

3. **Note the Bus Info**
   - Remember the license plate
   - Look for the specific bus at the stop

4. **Plan Ahead**
   - Times are estimates
   - Add 5-10 minutes buffer for traffic

---

## 🔧 Technical Implementation

### Distance Calculation:
```typescript
function calculateDistance(from: string, to: string): number {
  const distances = {
    'Matola-Baixa': 12,
    'Baixa-Zimpeto': 15,
    // ... more routes
  };
  return distances[`${from}-${to}`] || 10;
}
```

### Fare Calculation:
```typescript
function calculateFareAmount(distance: number): number {
  if (distance <= 5) return 15;
  if (distance <= 10) return 20;
  if (distance <= 15) return 25;
  if (distance <= 20) return 30;
  return 35;
}
```

### Time Estimation:
```typescript
const eta = Math.ceil(distance / 30 * 60); // 30km/h average
```

---

## 📱 Test Examples

### Test 1: Find Transport
```bash
# Main menu
text=""

# Find transport now
text="1"

# From Matola Sede
text="1*1"

# To Baixa
text="1*1*1"

Result:
- Time: 20 min
- Fare: 20 MT
- Bus: Toyota Hiace
```

### Test 2: Calculate Fare
```bash
# Main menu
text=""

# Calculate fare
text="4"

# From Matola
text="4*1"

# To Museu
text="4*1*2"

Result:
- Distance: 10 km
- Fare: 20 MT
- Time: 20 min
```

---

## ✅ Current Status

- ✅ **Find Transport Now** - Working
- ✅ **Calculate Fare** - Working
- ✅ **Time Estimation** - Working
- ✅ **Next Bus Info** - Working
- ✅ **Distance Calculation** - Working
- ✅ **Fare Structure** - Implemented
- ✅ **Database Integration** - Connected

---

## 🚀 Ready to Use!

Your enhanced USSD system is live at:
```
https://pushily-unbenefited-byron.ngrok-free.dev/api/ussd
```

**Test from your phone:**
1. Dial your USSD code
2. Press 1 (Find Transport Now)
3. Select your location
4. Select destination
5. Get complete transport info!

---

## 🎉 Summary

You now have a **location-based transport finder** via USSD that provides:
- ✅ Nearest stop finding
- ✅ Fare calculation
- ✅ Time estimation
- ✅ Next bus information
- ✅ Distance calculation
- ✅ Route availability

**All accessible from any phone via USSD!** 📱🚌
