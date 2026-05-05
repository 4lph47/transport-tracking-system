# 📊 Display Completo das Informações da Viagem

## ✅ Todas as Informações Disponíveis

### **Informações Atuais** (já existem):
- ✅ `tempoEstimado` - Tempo Estimado
- ✅ `distancia` - Distância 
- ✅ `velocidade` - Velocidade

### **Informações Adicionais** (implementadas):
- ✅ `tempoEstimado` - **Tempo até o autocarro chegar até mim**
- ✅ `journeyTime` - **Tempo até ao meu destino**
- ✅ `distancia` - **Distância entre eu e o autocarro**
- ✅ `fare` - **Preço da minha viagem**

---

## 🎨 Exemplo de Display Completo

### **Opção 1: Card Detalhado**

```tsx
function BusInfoCard({ bus }) {
  return (
    <div className="bus-info-card">
      {/* Header */}
      <div className="card-header">
        <h3>🚌 Autocarro {bus.matricula}</h3>
        <p className="route">{bus.direcao}</p>
      </div>

      {/* Informações Principais */}
      <div className="main-info">
        <div className="info-grid">
          {/* Informações Existentes */}
          <div className="info-section">
            <h4>📊 Informações Básicas</h4>
            <div className="info-row">
              <span className="label">Tempo Estimado:</span>
              <span className="value">{bus.tempoEstimado} minutos</span>
            </div>
            <div className="info-row">
              <span className="label">Distância:</span>
              <span className="value">{(bus.distancia / 1000).toFixed(1)} km</span>
            </div>
            <div className="info-row">
              <span className="label">Velocidade:</span>
              <span className="value">{bus.velocidade} km/h</span>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="info-section">
            <h4>🎯 Detalhes da Viagem</h4>
            <div className="info-row highlight">
              <span className="label">⏱️ Tempo até o autocarro chegar:</span>
              <span className="value primary">{bus.tempoEstimado} minutos</span>
            </div>
            <div className="info-row highlight">
              <span className="label">🚶 Tempo até ao meu destino:</span>
              <span className="value primary">{bus.journeyTime} minutos</span>
            </div>
            <div className="info-row highlight">
              <span className="label">📏 Distância entre mim e o autocarro:</span>
              <span className="value primary">{(bus.distancia / 1000).toFixed(1)} km</span>
            </div>
            <div className="info-row highlight">
              <span className="label">💰 Preço da minha viagem:</span>
              <span className="value price">{bus.fare} MT</span>
            </div>
          </div>

          {/* Resumo Total */}
          {bus.totalTime && (
            <div className="info-section total">
              <h4>📈 Resumo Total</h4>
              <div className="info-row">
                <span className="label">⏰ Tempo total da viagem:</span>
                <span className="value total">{bus.totalTime} minutos</span>
              </div>
              <div className="info-row">
                <span className="label">📍 Distância da minha viagem:</span>
                <span className="value">{(bus.journeyDistance / 1000).toFixed(1)} km</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### **Resultado Visual:**

```
┌─────────────────────────────────────────────────┐
│  🚌 Autocarro ABC-1234                          │
│  📍 Portagem → Museu                            │
│                                                  │
│  📊 Informações Básicas                         │
│  Tempo Estimado: 7 minutos                      │
│  Distância: 5.2 km                              │
│  Velocidade: 45 km/h                            │
│                                                  │
│  🎯 Detalhes da Viagem                          │
│  ⏱️  Tempo até o autocarro chegar: 7 minutos    │
│  🚶 Tempo até ao meu destino: 3 minutos         │
│  📏 Distância entre mim e o autocarro: 5.2 km   │
│  💰 Preço da minha viagem: 15 MT                │
│                                                  │
│  📈 Resumo Total                                │
│  ⏰ Tempo total da viagem: 10 minutos           │
│  📍 Distância da minha viagem: 2.0 km           │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Opção 2: Layout Horizontal

```tsx
function BusInfoHorizontal({ bus }) {
  return (
    <div className="bus-info-horizontal">
      <div className="bus-header">
        <h3>🚌 {bus.matricula}</h3>
        <span className="route">{bus.direcao}</span>
      </div>
      
      <div className="info-columns">
        {/* Coluna 1: Informações Atuais */}
        <div className="column">
          <h4>📊 Básicas</h4>
          <div className="metric">
            <span className="value">{bus.tempoEstimado}</span>
            <span className="unit">min</span>
            <span className="label">Tempo Estimado</span>
          </div>
          <div className="metric">
            <span className="value">{(bus.distancia / 1000).toFixed(1)}</span>
            <span className="unit">km</span>
            <span className="label">Distância</span>
          </div>
          <div className="metric">
            <span className="value">{bus.velocidade}</span>
            <span className="unit">km/h</span>
            <span className="label">Velocidade</span>
          </div>
        </div>

        {/* Coluna 2: Informações Adicionais */}
        <div className="column highlight">
          <h4>🎯 Viagem</h4>
          <div className="metric primary">
            <span className="value">{bus.tempoEstimado}</span>
            <span className="unit">min</span>
            <span className="label">Até o autocarro</span>
          </div>
          <div className="metric primary">
            <span className="value">{bus.journeyTime}</span>
            <span className="unit">min</span>
            <span className="label">Até o destino</span>
          </div>
          <div className="metric primary">
            <span className="value">{(bus.distancia / 1000).toFixed(1)}</span>
            <span className="unit">km</span>
            <span className="label">Distância autocarro</span>
          </div>
          <div className="metric price">
            <span className="value">{bus.fare}</span>
            <span className="unit">MT</span>
            <span className="label">Preço viagem</span>
          </div>
        </div>

        {/* Coluna 3: Totais */}
        <div className="column total">
          <h4>📈 Total</h4>
          <div className="metric total">
            <span className="value">{bus.totalTime}</span>
            <span className="unit">min</span>
            <span className="label">Tempo total</span>
          </div>
          <div className="metric">
            <span className="value">{(bus.journeyDistance / 1000).toFixed(1)}</span>
            <span className="unit">km</span>
            <span className="label">Distância viagem</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### **Resultado Visual:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🚌 ABC-1234  |  📍 Portagem → Museu                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  📊 Básicas     │  🎯 Viagem              │  📈 Total                   │
│                 │                         │                             │
│    7 min        │    7 min               │    10 min                   │
│  Tempo Estimado │  Até o autocarro       │  Tempo total                │
│                 │                         │                             │
│   5.2 km        │    3 min               │   2.0 km                    │
│  Distância      │  Até o destino         │  Distância viagem           │
│                 │                         │                             │
│   45 km/h       │   5.2 km               │                             │
│  Velocidade     │  Distância autocarro   │                             │
│                 │                         │                             │
│                 │   15 MT                │                             │
│                 │  Preço viagem          │                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Opção 3: Timeline Visual

```tsx
function BusInfoTimeline({ bus }) {
  return (
    <div className="bus-info-timeline">
      <div className="header">
        <h3>🚌 {bus.matricula} - {bus.direcao}</h3>
      </div>
      
      <div className="timeline">
        {/* Passo 1: Autocarro até você */}
        <div className="timeline-step">
          <div className="step-icon bus">🚌</div>
          <div className="step-content">
            <h4>Autocarro chega até você</h4>
            <div className="metrics">
              <span className="time">{bus.tempoEstimado} min</span>
              <span className="distance">{(bus.distancia / 1000).toFixed(1)} km</span>
              <span className="speed">{bus.velocidade} km/h</span>
            </div>
          </div>
          <div className="step-arrow">→</div>
        </div>

        {/* Passo 2: Sua viagem */}
        <div className="timeline-step">
          <div className="step-icon pickup">🟢</div>
          <div className="step-content">
            <h4>Sua viagem</h4>
            <div className="metrics">
              <span className="time">{bus.journeyTime} min</span>
              <span className="distance">{(bus.journeyDistance / 1000).toFixed(1)} km</span>
              <span className="price">{bus.fare} MT</span>
            </div>
          </div>
          <div className="step-arrow">→</div>
        </div>

        {/* Passo 3: Chegada */}
        <div className="timeline-step">
          <div className="step-icon destination">🔴</div>
          <div className="step-content">
            <h4>Chegada ao destino</h4>
            <div className="metrics">
              <span className="total-time">Total: {bus.totalTime} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="summary">
        <div className="summary-item">
          <span className="label">Tempo até o autocarro:</span>
          <span className="value">{bus.tempoEstimado} min</span>
        </div>
        <div className="summary-item">
          <span className="label">Tempo até o destino:</span>
          <span className="value">{bus.journeyTime} min</span>
        </div>
        <div className="summary-item">
          <span className="label">Distância do autocarro:</span>
          <span className="value">{(bus.distancia / 1000).toFixed(1)} km</span>
        </div>
        <div className="summary-item highlight">
          <span className="label">Preço da viagem:</span>
          <span className="value">{bus.fare} MT</span>
        </div>
      </div>
    </div>
  );
}
```

### **Resultado Visual:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🚌 ABC-1234 - Portagem → Museu                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🚌 ──────────→ 🟢 ──────────→ 🔴                                      │
│  Autocarro      Você           Destino                                  │
│  chega até      viagem                                                   │
│  você                                                                    │
│                                                                         │
│  7 min          3 min          Total: 10 min                           │
│  5.2 km         2.0 km                                                  │
│  45 km/h        15 MT                                                   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  📊 Resumo:                                                             │
│  • Tempo até o autocarro: 7 min                                        │
│  • Tempo até o destino: 3 min                                          │
│  • Distância do autocarro: 5.2 km                                      │
│  • Preço da viagem: 15 MT                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Código de Implementação

### **Exemplo Completo:**

```tsx
import React from 'react';

function CompleteBusInfo({ bus }) {
  return (
    <div className="complete-bus-info">
      {/* Header */}
      <div className="header">
        <h2>🚌 {bus.matricula}</h2>
        <p className="route">{bus.direcao}</p>
      </div>

      {/* Informações em Grid */}
      <div className="info-grid">
        {/* Seção 1: Informações Atuais (já existem) */}
        <div className="info-section current">
          <h3>📊 Informações Atuais</h3>
          <div className="info-item">
            <span className="label">Tempo Estimado:</span>
            <span className="value">{bus.tempoEstimado} minutos</span>
          </div>
          <div className="info-item">
            <span className="label">Distância:</span>
            <span className="value">{(bus.distancia / 1000).toFixed(1)} km</span>
          </div>
          <div className="info-item">
            <span className="label">Velocidade:</span>
            <span className="value">{bus.velocidade} km/h</span>
          </div>
        </div>

        {/* Seção 2: Informações Adicionais (solicitadas) */}
        <div className="info-section additional">
          <h3>🎯 Informações Adicionais</h3>
          <div className="info-item highlight">
            <span className="label">⏱️ Tempo até o autocarro chegar até mim:</span>
            <span className="value primary">{bus.tempoEstimado} minutos</span>
          </div>
          <div className="info-item highlight">
            <span className="label">🚶 Tempo até ao meu destino:</span>
            <span className="value primary">{bus.journeyTime} minutos</span>
          </div>
          <div className="info-item highlight">
            <span className="label">📏 Distância entre eu e o autocarro:</span>
            <span className="value primary">{(bus.distancia / 1000).toFixed(1)} km</span>
          </div>
          <div className="info-item highlight">
            <span className="label">💰 Preço da minha viagem:</span>
            <span className="value price">{bus.fare} MT</span>
          </div>
        </div>

        {/* Seção 3: Totais */}
        <div className="info-section totals">
          <h3>📈 Totais</h3>
          <div className="info-item">
            <span className="label">⏰ Tempo total:</span>
            <span className="value total">{bus.totalTime} minutos</span>
          </div>
          <div className="info-item">
            <span className="label">📍 Distância da viagem:</span>
            <span className="value">{(bus.journeyDistance / 1000).toFixed(1)} km</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="status">
        <span className="status-indicator">🟢</span>
        <span className="status-text">{bus.status}</span>
      </div>
    </div>
  );
}

// Uso do componente
function BusListPage() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // Fetch buses with destination
    fetch(`/api/buses?paragemId=${pickupId}&viaId=${routeId}&destinationId=${destId}`)
      .then(res => res.json())
      .then(data => setBuses(data.buses));
  }, []);

  return (
    <div className="bus-list">
      {buses.map(bus => (
        <CompleteBusInfo key={bus.id} bus={bus} />
      ))}
    </div>
  );
}
```

---

## 📊 Mapeamento dos Dados

### **Correspondência dos Campos:**

| Informação Solicitada | Campo da API | Exemplo |
|----------------------|--------------|---------|
| Tempo Estimado (atual) | `tempoEstimado` | 7 min |
| Distância (atual) | `distancia` | 5200m |
| Velocidade (atual) | `velocidade` | 45 km/h |
| **Tempo até o autocarro chegar** | `tempoEstimado` | 7 min |
| **Tempo até ao meu destino** | `journeyTime` | 3 min |
| **Distância entre eu e o autocarro** | `distancia` | 5200m |
| **Preço da minha viagem** | `fare` | 15 MT |

### **Campos Extras Disponíveis:**

| Campo Extra | Descrição | Exemplo |
|-------------|-----------|---------|
| `totalTime` | Tempo total (autocarro + viagem) | 10 min |
| `journeyDistance` | Distância da viagem | 2000m |
| `fullRoute` | Rota completa do autocarro | "Terminal → Praça" |
| `userJourney` | Detalhes da viagem do usuário | {from: "Portagem", to: "Museu"} |

---

## ✅ Resumo

**Todas as informações solicitadas já estão disponíveis na API:**

1. ✅ **Tempo até o autocarro chegar até mim**: `bus.tempoEstimado`
2. ✅ **Tempo até ao meu destino**: `bus.journeyTime`
3. ✅ **Distância entre eu e o autocarro**: `bus.distancia`
4. ✅ **Preço da minha viagem**: `bus.fare`

**Além das informações atuais:**
- ✅ Tempo Estimado: `bus.tempoEstimado`
- ✅ Distância: `bus.distancia`
- ✅ Velocidade: `bus.velocidade`

**Agora é só implementar o display no frontend usando os exemplos acima!** 🎉