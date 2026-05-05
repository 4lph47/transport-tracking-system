# 🚌 Informações Completas da Viagem - Implementação

## 🎯 Informações Disponíveis

### ✅ Implementado Agora:

1. **Tempo até o autocarro chegar até mim** (`tempoEstimado`)
2. **Tempo até ao meu destino** (`journeyTime`)
3. **Tempo total da viagem** (`totalTime`)
4. **Distância entre eu e o autocarro** (`distancia`)
5. **Distância da minha viagem** (`journeyDistance`)
6. **Preço da minha viagem** (`fare`)
7. **Velocidade do autocarro** (`velocidade`)

---

## 📊 Resposta da API

### Exemplo com Destino:

```json
{
  "buses": [{
    "id": "bus-123",
    "matricula": "ABC-1234",
    "via": "Rota Matola-Baixa",
    "direcao": "Portagem → Museu",
    
    // Localização do autocarro
    "latitude": -25.9528,
    "longitude": 32.4655,
    
    // 1. Tempo até o autocarro chegar até mim
    "tempoEstimado": 7,           // 7 minutos
    
    // 2. Distância entre eu e o autocarro
    "distancia": 5200,            // 5.2 km (5,200 metros)
    
    // 3. Tempo até ao meu destino (da minha paragem ao destino)
    "journeyTime": 3,             // 3 minutos
    
    // 4. Distância da minha viagem (da minha paragem ao destino)
    "journeyDistance": 2000,      // 2.0 km (2,000 metros)
    
    // 5. Tempo total (autocarro chegar + viagem)
    "totalTime": 10,              // 7 + 3 = 10 minutos
    
    // 6. Preço da minha viagem
    "fare": 15,                   // 15 MT (baseado em 2 km)
    
    // 7. Velocidade
    "velocidade": 45,             // km/h
    
    "status": "Em Circulação"
  }]
}
```

---

## 🎨 Como Exibir no Frontend

### Opção 1: Card Detalhado

```tsx
<div className="bus-card">
  <h3>🚌 Autocarro {bus.matricula}</h3>
  <p>📍 {bus.direcao}</p>
  
  <div className="info-grid">
    {/* Tempo até o autocarro chegar */}
    <div className="info-item">
      <span className="label">⏱️ Autocarro chega em:</span>
      <span className="value">{bus.tempoEstimado} minutos</span>
    </div>
    
    {/* Distância até o autocarro */}
    <div className="info-item">
      <span className="label">📏 Distância do autocarro:</span>
      <span className="value">{(bus.distancia / 1000).toFixed(1)} km</span>
    </div>
    
    {/* Tempo da viagem */}
    {bus.journeyTime > 0 && (
      <div className="info-item">
        <span className="label">🚶 Tempo da viagem:</span>
        <span className="value">{bus.journeyTime} minutos</span>
      </div>
    )}
    
    {/* Distância da viagem */}
    {bus.journeyDistance > 0 && (
      <div className="info-item">
        <span className="label">📍 Distância da viagem:</span>
        <span className="value">{(bus.journeyDistance / 1000).toFixed(1)} km</span>
      </div>
    )}
    
    {/* Tempo total */}
    {bus.totalTime > bus.tempoEstimado && (
      <div className="info-item highlight">
        <span className="label">⏰ Tempo total:</span>
        <span className="value">{bus.totalTime} minutos</span>
      </div>
    )}
    
    {/* Preço */}
    {bus.fare > 0 && (
      <div className="info-item highlight">
        <span className="label">💰 Preço:</span>
        <span className="value">{bus.fare} MT</span>
      </div>
    )}
    
    {/* Velocidade */}
    <div className="info-item">
      <span className="label">🚀 Velocidade:</span>
      <span className="value">{bus.velocidade} km/h</span>
    </div>
  </div>
</div>
```

### Opção 2: Layout Compacto

```tsx
<div className="bus-card-compact">
  <div className="header">
    <h3>🚌 {bus.matricula}</h3>
    <span className="route">{bus.direcao}</span>
  </div>
  
  <div className="timeline">
    {/* Autocarro → Você */}
    <div className="segment">
      <div className="icon">🚌</div>
      <div className="details">
        <span className="time">{bus.tempoEstimado} min</span>
        <span className="distance">{(bus.distancia / 1000).toFixed(1)} km</span>
      </div>
      <div className="arrow">→</div>
    </div>
    
    {/* Você → Destino */}
    {bus.journeyTime > 0 && (
      <div className="segment">
        <div className="icon">🟢</div>
        <div className="details">
          <span className="time">{bus.journeyTime} min</span>
          <span className="distance">{(bus.journeyDistance / 1000).toFixed(1)} km</span>
        </div>
        <div className="arrow">→</div>
      </div>
    )}
    
    {/* Destino */}
    <div className="segment">
      <div className="icon">🔴</div>
    </div>
  </div>
  
  <div className="footer">
    <span className="total-time">⏰ Total: {bus.totalTime} min</span>
    <span className="fare">💰 {bus.fare} MT</span>
  </div>
</div>
```

### Opção 3: Tabela de Informações

```tsx
<table className="bus-info-table">
  <tbody>
    <tr>
      <td>🚌 Autocarro</td>
      <td>{bus.matricula}</td>
    </tr>
    <tr>
      <td>📍 Rota</td>
      <td>{bus.direcao}</td>
    </tr>
    <tr className="divider">
      <td colSpan={2}></td>
    </tr>
    <tr>
      <td>⏱️ Tempo até o autocarro</td>
      <td><strong>{bus.tempoEstimado} minutos</strong></td>
    </tr>
    <tr>
      <td>📏 Distância do autocarro</td>
      <td>{(bus.distancia / 1000).toFixed(1)} km</td>
    </tr>
    {bus.journeyTime > 0 && (
      <>
        <tr className="divider">
          <td colSpan={2}></td>
        </tr>
        <tr>
          <td>🚶 Tempo da viagem</td>
          <td><strong>{bus.journeyTime} minutos</strong></td>
        </tr>
        <tr>
          <td>📍 Distância da viagem</td>
          <td>{(bus.journeyDistance / 1000).toFixed(1)} km</td>
        </tr>
        <tr className="divider">
          <td colSpan={2}></td>
        </tr>
        <tr className="highlight">
          <td>⏰ Tempo total</td>
          <td><strong>{bus.totalTime} minutos</strong></td>
        </tr>
        <tr className="highlight">
          <td>💰 Preço</td>
          <td><strong>{bus.fare} MT</strong></td>
        </tr>
      </>
    )}
    <tr className="divider">
      <td colSpan={2}></td>
    </tr>
    <tr>
      <td>🚀 Velocidade</td>
      <td>{bus.velocidade} km/h</td>
    </tr>
  </tbody>
</table>
```

---

## 📐 Cálculo do Preço

### Tabela de Preços (baseada na distância da viagem):

| Distância | Preço |
|-----------|-------|
| 0 - 2 km  | 10 MT |
| 2 - 5 km  | 15 MT |
| 5 - 10 km | 20 MT |
| 10 - 15 km| 25 MT |
| 15 - 20 km| 30 MT |
| 20 - 30 km| 35 MT |
| > 30 km   | 40 MT |

### Código:
```typescript
const distanceKm = journeyDistance / 1000;
if (distanceKm <= 2) fare = 10;
else if (distanceKm <= 5) fare = 15;
else if (distanceKm <= 10) fare = 20;
else if (distanceKm <= 15) fare = 25;
else if (distanceKm <= 20) fare = 30;
else if (distanceKm <= 30) fare = 35;
else fare = 40;
```

---

## 🎯 Exemplo Completo

### Cenário:
- **Autocarro**: ABC-1234 em Godinho
- **Você**: Portagem
- **Destino**: Museu

### Cálculos:

#### 1. Autocarro → Você (Portagem)
```
Distância: 5.2 km
Tempo: 5.2 / 45 × 60 = 7 minutos
```

#### 2. Você (Portagem) → Destino (Museu)
```
Distância: 2.0 km
Tempo: 2.0 / 45 × 60 = 3 minutos
Preço: 15 MT (2-5 km)
```

#### 3. Total
```
Tempo total: 7 + 3 = 10 minutos
```

### Resposta da API:
```json
{
  "tempoEstimado": 7,        // Autocarro chega em 7 min
  "distancia": 5200,         // 5.2 km até você
  "journeyTime": 3,          // 3 min de viagem
  "journeyDistance": 2000,   // 2.0 km de viagem
  "totalTime": 10,           // 10 min total
  "fare": 15,                // 15 MT
  "velocidade": 45           // 45 km/h
}
```

### Display no Frontend:
```
┌─────────────────────────────────────────────────┐
│  🚌 Autocarro ABC-1234                          │
│  📍 Portagem → Museu                            │
│                                                  │
│  ⏱️  Autocarro chega em: 7 minutos              │
│  📏 Distância do autocarro: 5.2 km              │
│                                                  │
│  🚶 Tempo da viagem: 3 minutos                  │
│  📍 Distância da viagem: 2.0 km                 │
│                                                  │
│  ⏰ TEMPO TOTAL: 10 minutos                     │
│  💰 PREÇO: 15 MT                                │
│                                                  │
│  🚀 Velocidade: 45 km/h                         │
└─────────────────────────────────────────────────┘
```

---

## 🗺️ Visualização no Mapa

```
🚌 Autocarro (Godinho)
    │
    │ 5.2 km
    │ 7 min
    │ (Autocarro → Você)
    ↓
🟢 Você (Portagem)
    │
    │ 2.0 km
    │ 3 min
    │ 15 MT
    │ (Sua Viagem)
    ↓
🔴 Destino (Museu)

⏰ Tempo Total: 10 minutos
💰 Preço Total: 15 MT
```

---

## 📱 Código Frontend Exemplo

```typescript
// Fetch buses with destination
const response = await fetch(
  `/api/buses?paragemId=${pickupId}&viaId=${routeId}&destinationId=${destId}`
);
const data = await response.json();

// Display information
data.buses.forEach(bus => {
  console.log('=== Informações da Viagem ===');
  console.log(`Autocarro: ${bus.matricula}`);
  console.log(`Rota: ${bus.direcao}`);
  console.log('');
  
  console.log('📍 Autocarro → Você:');
  console.log(`  Tempo: ${bus.tempoEstimado} minutos`);
  console.log(`  Distância: ${(bus.distancia / 1000).toFixed(1)} km`);
  console.log('');
  
  if (bus.journeyTime > 0) {
    console.log('🚶 Você → Destino:');
    console.log(`  Tempo: ${bus.journeyTime} minutos`);
    console.log(`  Distância: ${(bus.journeyDistance / 1000).toFixed(1)} km`);
    console.log(`  Preço: ${bus.fare} MT`);
    console.log('');
    
    console.log('📊 Total:');
    console.log(`  Tempo total: ${bus.totalTime} minutos`);
    console.log(`  Preço total: ${bus.fare} MT`);
  }
  
  console.log('');
  console.log(`🚀 Velocidade: ${bus.velocidade} km/h`);
});
```

---

## ✅ Resumo das Informações

| Campo | Descrição | Unidade | Exemplo |
|-------|-----------|---------|---------|
| `tempoEstimado` | Tempo até o autocarro chegar até você | minutos | 7 |
| `distancia` | Distância entre você e o autocarro | metros | 5200 |
| `journeyTime` | Tempo da sua viagem (pickup → destino) | minutos | 3 |
| `journeyDistance` | Distância da sua viagem | metros | 2000 |
| `totalTime` | Tempo total (autocarro + viagem) | minutos | 10 |
| `fare` | Preço da sua viagem | MT | 15 |
| `velocidade` | Velocidade média do autocarro | km/h | 45 |

---

## 🎯 Quando Cada Campo Está Disponível

### Sempre Disponível:
- ✅ `tempoEstimado` - Tempo até o autocarro
- ✅ `distancia` - Distância do autocarro
- ✅ `velocidade` - Velocidade

### Disponível Quando Destino é Fornecido:
- ✅ `journeyTime` - Tempo da viagem
- ✅ `journeyDistance` - Distância da viagem
- ✅ `totalTime` - Tempo total
- ✅ `fare` - Preço

---

**Status**: ✅ Implementado e Pronto para Uso!

Agora a API retorna todas as informações necessárias para mostrar ao usuário:
1. Tempo até o autocarro chegar
2. Tempo até ao destino
3. Distância entre o usuário e o autocarro
4. Preço da viagem
5. Tempo total
6. Distância da viagem
7. Velocidade
