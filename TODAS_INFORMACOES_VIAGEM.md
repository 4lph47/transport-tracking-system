# ✅ Todas as Informações da Viagem - Completo

## 📊 Informações Disponíveis na API

### ✅ TODAS AS DISTÂNCIAS E TEMPOS:

1. **Tempo até o autocarro chegar até mim**: `tempoEstimado` (minutos)
2. **Distância entre eu e o autocarro**: `distancia` (metros)
3. **Tempo até ao meu destino**: `journeyTime` (minutos)
4. **Distância entre eu e o meu destino**: `journeyDistance` (metros) ✅
5. **Tempo total da viagem**: `totalTime` (minutos)
6. **Preço da minha viagem**: `fare` (MT)
7. **Velocidade do autocarro**: `velocidade` (km/h)

---

## 📋 Resposta Completa da API

```json
{
  "buses": [{
    "id": "bus-123",
    "matricula": "ABC-1234",
    "via": "Rota Matola-Baixa",
    "direcao": "Portagem → Museu",
    
    // Localização atual do autocarro
    "latitude": -25.9528,
    "longitude": 32.4655,
    
    // 🚌 AUTOCARRO → VOCÊ
    "tempoEstimado": 7,           // Tempo até o autocarro chegar (7 min)
    "distancia": 5200,            // Distância do autocarro até você (5.2 km)
    
    // 🚶 VOCÊ → DESTINO
    "journeyTime": 3,             // Tempo da sua viagem (3 min)
    "journeyDistance": 2000,      // Distância entre você e seu destino (2.0 km) ✅
    
    // 📊 TOTAIS
    "totalTime": 10,              // Tempo total: 7 + 3 = 10 min
    "fare": 15,                   // Preço baseado em 2 km = 15 MT
    
    // ℹ️ OUTROS
    "velocidade": 45,             // Velocidade média (45 km/h)
    "status": "Em Circulação"
  }]
}
```

---

## 🎨 Como Exibir no Frontend

### Exemplo Completo:

```tsx
function BusInfoCard({ bus }) {
  return (
    <div className="bus-card">
      <h3>🚌 Autocarro {bus.matricula}</h3>
      <p>📍 {bus.direcao}</p>
      
      <div className="info-sections">
        {/* Seção: Autocarro → Você */}
        <div className="section">
          <h4>🚌 Autocarro → Você</h4>
          <div className="info-row">
            <span>⏱️ Tempo:</span>
            <span><strong>{bus.tempoEstimado} minutos</strong></span>
          </div>
          <div className="info-row">
            <span>📏 Distância:</span>
            <span>{(bus.distancia / 1000).toFixed(1)} km</span>
          </div>
        </div>
        
        {/* Seção: Você → Destino */}
        {bus.journeyDistance > 0 && (
          <div className="section">
            <h4>🚶 Você → Destino</h4>
            <div className="info-row">
              <span>⏱️ Tempo:</span>
              <span><strong>{bus.journeyTime} minutos</strong></span>
            </div>
            <div className="info-row">
              <span>📏 Distância:</span>
              <span><strong>{(bus.journeyDistance / 1000).toFixed(1)} km</strong></span>
            </div>
          </div>
        )}
        
        {/* Seção: Totais */}
        {bus.totalTime > bus.tempoEstimado && (
          <div className="section highlight">
            <h4>📊 Total</h4>
            <div className="info-row">
              <span>⏰ Tempo total:</span>
              <span><strong>{bus.totalTime} minutos</strong></span>
            </div>
            <div className="info-row">
              <span>💰 Preço:</span>
              <span><strong>{bus.fare} MT</strong></span>
            </div>
          </div>
        )}
        
        {/* Seção: Outros */}
        <div className="section">
          <div className="info-row">
            <span>🚀 Velocidade:</span>
            <span>{bus.velocidade} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Resultado Visual:

```
┌─────────────────────────────────────────────────┐
│  🚌 Autocarro ABC-1234                          │
│  📍 Portagem → Museu                            │
│                                                  │
│  🚌 Autocarro → Você                            │
│  ⏱️  Tempo: 7 minutos                           │
│  📏 Distância: 5.2 km                           │
│                                                  │
│  🚶 Você → Destino                              │
│  ⏱️  Tempo: 3 minutos                           │
│  📏 Distância: 2.0 km                           │  ← ESTA É A DISTÂNCIA ENTRE VOCÊ E SEU DESTINO
│                                                  │
│  📊 Total                                        │
│  ⏰ Tempo total: 10 minutos                     │
│  💰 Preço: 15 MT                                │
│                                                  │
│  🚀 Velocidade: 45 km/h                         │
└─────────────────────────────────────────────────┘
```

---

## 📐 Visualização das Distâncias

```
🚌 Autocarro (Godinho)
    │
    │ ← distancia: 5200m (5.2 km)
    │ ← tempoEstimado: 7 min
    │
    ↓
🟢 Você (Portagem)
    │
    │ ← journeyDistance: 2000m (2.0 km)  ← DISTÂNCIA ENTRE VOCÊ E SEU DESTINO
    │ ← journeyTime: 3 min
    │ ← fare: 15 MT
    │
    ↓
🔴 Seu Destino (Museu)

📊 Resumo:
- Distância autocarro → você: 5.2 km
- Distância você → destino: 2.0 km      ← ESTA INFORMAÇÃO JÁ EXISTE
- Tempo total: 10 minutos
- Preço: 15 MT
```

---

## 🔍 Verificação no Código

### A distância entre você e seu destino está sendo calculada aqui:

```typescript
// Linha ~290-305 em app/api/buses/route.ts
if (destinationStop) {
  // Calculate distance from pickup to destination (Haversine)
  const [destLat, destLng] = destinationStop.geoLocation.split(',').map(Number);
  
  const φ3 = (destLat * Math.PI) / 180;
  const Δφ2 = ((destLat - paragemLat) * Math.PI) / 180;
  const Δλ2 = ((destLng - paragemLng) * Math.PI) / 180;

  const a2 = Math.sin(Δφ2 / 2) * Math.sin(Δφ2 / 2) +
             Math.cos(φ2) * Math.cos(φ3) * 
             Math.sin(Δλ2 / 2) * Math.sin(Δλ2 / 2);
  const c2 = 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));

  journeyDistance = Math.round(R * c2); // ← DISTÂNCIA ENTRE VOCÊ E SEU DESTINO (metros)
  journeyTime = Math.ceil(journeyDistance / 1000 / velocidade * 60); // minutos
}
```

### E está sendo retornada na resposta:

```typescript
return {
  // ... outros campos
  journeyDistance,        // ← DISTÂNCIA ENTRE VOCÊ E SEU DESTINO (metros)
  journeyTime,            // Tempo da viagem (minutos)
  // ... outros campos
};
```

---

## 📱 Exemplo de Uso no Frontend

```typescript
// Chamada da API
const response = await fetch(
  `/api/buses?paragemId=${pickupId}&viaId=${routeId}&destinationId=${destId}`
);
const data = await response.json();

// Exibir informações
data.buses.forEach(bus => {
  console.log('=== Informações Completas ===');
  console.log(`🚌 Autocarro: ${bus.matricula}`);
  console.log(`📍 Rota: ${bus.direcao}`);
  console.log('');
  
  // Autocarro → Você
  console.log('🚌 Autocarro → Você:');
  console.log(`  ⏱️  Tempo: ${bus.tempoEstimado} minutos`);
  console.log(`  📏 Distância: ${(bus.distancia / 1000).toFixed(1)} km`);
  console.log('');
  
  // Você → Destino
  if (bus.journeyDistance > 0) {
    console.log('🚶 Você → Destino:');
    console.log(`  ⏱️  Tempo: ${bus.journeyTime} minutos`);
    console.log(`  📏 Distância: ${(bus.journeyDistance / 1000).toFixed(1)} km`); // ← AQUI ESTÁ
    console.log(`  💰 Preço: ${bus.fare} MT`);
    console.log('');
    
    // Totais
    console.log('📊 Totais:');
    console.log(`  ⏰ Tempo total: ${bus.totalTime} minutos`);
    console.log(`  💰 Preço total: ${bus.fare} MT`);
  }
  
  console.log('');
  console.log(`🚀 Velocidade: ${bus.velocidade} km/h`);
});
```

---

## ✅ Resumo Final

### Todas as informações estão disponíveis:

| Informação | Campo API | Unidade | Exemplo |
|------------|-----------|---------|---------|
| Tempo até o autocarro chegar | `tempoEstimado` | minutos | 7 |
| Distância do autocarro até você | `distancia` | metros | 5200 |
| Tempo da sua viagem | `journeyTime` | minutos | 3 |
| **Distância entre você e seu destino** | **`journeyDistance`** | **metros** | **2000** |
| Tempo total | `totalTime` | minutos | 10 |
| Preço da viagem | `fare` | MT | 15 |
| Velocidade | `velocidade` | km/h | 45 |

---

## 🎯 Para Usar no Frontend:

```javascript
// Distância entre você e seu destino em metros
const distanciaDestino = bus.journeyDistance;

// Distância entre você e seu destino em quilômetros
const distanciaDestinoKm = (bus.journeyDistance / 1000).toFixed(1);

// Exibir
console.log(`Distância até seu destino: ${distanciaDestinoKm} km`);
```

---

**✅ A distância entre você e o seu destino JÁ ESTÁ IMPLEMENTADA!**

É o campo `journeyDistance` na resposta da API. Ele contém a distância em metros entre a sua paragem (pickup) e o seu destino, calculada usando a fórmula de Haversine para precisão GPS.