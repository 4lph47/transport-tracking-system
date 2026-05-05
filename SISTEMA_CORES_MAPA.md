# 🎨 Sistema de Cores e Marcadores do Mapa - Implementado

## 🗺️ Cores das Rotas

### ✅ Sistema de Cores Implementado:

1. **🔶 Laranja** (`#f59e0b`) - **Rota do Autocarro até Você**
   - Mostra o caminho que o autocarro precisa percorrer para chegar até sua paragem
   - Espessura: 5px
   - Opacidade: 0.8

2. **🔵 Azul** (`#3b82f6`) - **Sua Travessia/Viagem**
   - Destaca o segmento da rota que você vai percorrer (da sua paragem ao destino)
   - Espessura: 6px (mais espessa para destacar)
   - Opacidade: 0.9

3. **⚪ Cinza** (`#9ca3af`) - **Rota Completa do Autocarro**
   - Mostra toda a rota do autocarro (fundo)
   - Espessura: 8px (mais larga, fica por baixo)
   - Opacidade: 0.4

---

## 📍 Marcadores e Pontos

### ✅ Tipos de Marcadores:

#### 1. **🚌 Autocarro** (Amarelo/Azul)
- **Cor**: Azul com faróis amarelos
- **Função**: Mostra a localização atual do autocarro
- **Animação**: Move-se ao longo da rota
- **Popup**: "Transporte [Matrícula] - Em movimento"

#### 2. **🟢 Paragem de Embarque** (Verde)
- **Cor**: Verde (`#10b981`)
- **Ícone**: "P" (Pickup)
- **Função**: Onde você vai embarcar
- **Animação**: Pulso verde
- **Popup**: "📍 [Nome] - Embarque aqui"

#### 3. **🔴 Destino** (Vermelho)
- **Cor**: Vermelho (`#ef4444`)
- **Ícone**: "D" (Destination)
- **Função**: Onde você vai desembarcar
- **Animação**: Pulso vermelho
- **Popup**: "🎯 [Nome] - Desembarque aqui"

#### 4. **🏁 Terminais** (Preto)
- **Cor**: Preto (`#1f2937`)
- **Ícone**: 🏁
- **Função**: Início e fim da rota do autocarro
- **Tamanho**: 18px
- **Popup**: "🏁 [Nome] - Terminal"

#### 5. **⚪ Paragens Normais** (Cinza)
- **Cor**: Cinza (`#6b7280`)
- **Função**: Outras paragens na rota
- **Tamanho**: 14px
- **Popup**: "[Nome]"

---

## 🎨 Visualização Completa

### Exemplo de Rota: Terminal Matola → Godinho → Portagem → Museu → Praça

```
🏁 Terminal Matola Sede (Preto - Origem da rota do autocarro)
    │
    │ 🔶 LARANJA (Rota do autocarro até você)
    │
🚌 Autocarro (Azul - Localização atual)
    │
    │ 🔶 LARANJA (Continua até sua paragem)
    │
🟢 Portagem (Verde - Sua paragem de embarque)
    │
    │ 🔵 AZUL (Sua viagem/travessia)
    │
🔴 Museu (Vermelho - Seu destino)
    │
    │ ⚪ CINZA (Resto da rota do autocarro)
    │
🏁 Praça dos Trabalhadores (Preto - Fim da rota do autocarro)
```

---

## 📊 Código das Cores

### Cores Hexadecimais:
```css
/* Rotas */
--route-bus-to-pickup: #f59e0b;    /* Laranja - Autocarro → Você */
--route-user-journey: #3b82f6;     /* Azul - Você → Destino */
--route-full-background: #9ca3af;  /* Cinza - Rota completa */

/* Marcadores */
--pickup-marker: #10b981;          /* Verde - Embarque */
--destination-marker: #ef4444;     /* Vermelho - Destino */
--terminal-marker: #1f2937;        /* Preto - Terminais */
--regular-stop: #6b7280;           /* Cinza - Paragens normais */
--bus-marker: #3b82f6;             /* Azul - Autocarro */
```

### Tamanhos dos Marcadores:
```css
--pickup-size: 20px;        /* Paragem de embarque */
--destination-size: 20px;   /* Destino */
--terminal-size: 18px;      /* Terminais */
--regular-size: 14px;       /* Paragens normais */
--bus-size: 48x56px;        /* Autocarro (SVG) */
```

---

## 🔧 Como Usar no Frontend

### Passar Dados para o Mapa:

```tsx
<TransportMap
  // Localização do autocarro
  transportLat={bus.latitude}
  transportLng={bus.longitude}
  transportMatricula={bus.matricula}
  
  // Sua paragem de embarque
  paragemLat={pickupStop.latitude}
  paragemLng={pickupStop.longitude}
  paragemNome={pickupStop.nome}
  
  // Seu destino
  destinationLat={destinationStop.latitude}
  destinationLng={destinationStop.longitude}
  destinationNome={destinationStop.nome}
  
  // Informações da viagem
  userJourney={{
    from: pickupStop.nome,
    to: destinationStop.nome,
    fromId: pickupStop.id,
    toId: destinationStop.id
  }}
  
  // Rota e paragens
  routeCoords={bus.routeCoords}
  stops={bus.stops} // Deve incluir isPickup e isDestination
/>
```

### Estrutura dos Stops:

```typescript
const stops = [
  {
    id: "terminal-1",
    nome: "Terminal Matola Sede",
    latitude: -25.9794,
    longitude: 32.4589,
    isTerminal: true,
    isPickup: false,
    isDestination: false
  },
  {
    id: "pickup-stop",
    nome: "Portagem",
    latitude: -25.9392,
    longitude: 32.5147,
    isTerminal: false,
    isPickup: true,        // ← Marcador verde
    isDestination: false
  },
  {
    id: "destination-stop",
    nome: "Museu",
    latitude: -25.9723,
    longitude: 32.5836,
    isTerminal: false,
    isPickup: false,
    isDestination: true    // ← Marcador vermelho
  }
];
```

---

## 🎯 Lógica de Cores

### Como o Sistema Decide as Cores:

1. **Encontra índices na rota**:
   ```typescript
   let pickupIndex = -1;      // Posição da paragem de embarque
   let destinationIndex = -1; // Posição do destino
   ```

2. **Divide a rota em segmentos**:
   ```typescript
   // Segmento 1: Início → Embarque (Laranja)
   const busToPickupCoords = coordinates.slice(0, pickupIndex + 1);
   
   // Segmento 2: Embarque → Destino (Azul)
   const userJourneyCoords = coordinates.slice(pickupIndex, destinationIndex + 1);
   
   // Segmento 3: Rota completa (Cinza - fundo)
   const fullRouteCoords = coordinates;
   ```

3. **Aplica cores por camadas**:
   ```typescript
   // Camada 1: Fundo cinza (rota completa)
   "line-color": "#9ca3af", "line-width": 8, "line-opacity": 0.4
   
   // Camada 2: Laranja (autocarro → você)
   "line-color": "#f59e0b", "line-width": 5, "line-opacity": 0.8
   
   // Camada 3: Azul (você → destino)
   "line-color": "#3b82f6", "line-width": 6, "line-opacity": 0.9
   ```

---

## 📱 Resultado Visual

### No Mapa:
```
┌─────────────────────────────────────────────────┐
│                    MAPA                          │
│                                                  │
│  🏁 ──────🔶🔶🔶🔶🚌🔶🔶🔶🔶🟢──🔵🔵🔵🔵🔴──⚪⚪⚪⚪🏁  │
│     Terminal    Autocarro    Você    Destino   Terminal │
│     (Preto)     (Azul)      (Verde)  (Vermelho) (Preto) │
│                                                  │
│  Legenda:                                        │
│  🔶 Laranja = Rota do autocarro até você        │
│  🔵 Azul = Sua viagem                           │
│  ⚪ Cinza = Resto da rota (fundo)               │
└─────────────────────────────────────────────────┘
```

### Popups:
- **🚌 Autocarro**: "Transporte ABC-1234 - Em movimento"
- **🟢 Embarque**: "📍 Portagem - Embarque aqui"
- **🔴 Destino**: "🎯 Museu - Desembarque aqui"
- **🏁 Terminal**: "🏁 Terminal Matola Sede - Terminal"

---

## ✅ Funcionalidades Implementadas

### ✅ Cores das Rotas:
- [x] Laranja: Rota do autocarro até você
- [x] Azul: Sua travessia/viagem
- [x] Cinza: Rota completa (fundo)

### ✅ Marcadores:
- [x] Verde: Paragem de embarque (com "P")
- [x] Vermelho: Destino (com "D")
- [x] Preto: Terminais (com 🏁)
- [x] Cinza: Paragens normais
- [x] Azul: Autocarro (3D animado)

### ✅ Animações:
- [x] Pulso verde na paragem de embarque
- [x] Pulso vermelho no destino
- [x] Autocarro move-se ao longo da rota
- [x] Rotação do autocarro baseada na direção

### ✅ Popups Informativos:
- [x] Identificação clara de cada ponto
- [x] Instruções (embarque/desembarque)
- [x] Ícones descritivos

---

## 🎯 Resumo

**O mapa agora mostra claramente:**

1. **🔶 Onde o autocarro precisa ir** (laranja)
2. **🔵 Onde você vai viajar** (azul)
3. **🟢 Onde você embarca** (verde com pulso)
4. **🔴 Onde você desembarca** (vermelho com pulso)
5. **🏁 Início e fim da rota do autocarro** (preto)

**Resultado**: Um mapa visualmente claro que distingue perfeitamente entre a rota do autocarro, sua viagem, e todos os pontos importantes! 🎉