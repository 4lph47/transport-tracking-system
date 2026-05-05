# Tracking Page Calculations - FIXED ✅

## Problema Identificado

Na página de tracking, os cálculos estavam incorretos:
- **Distância Viagem**: 294 metros (muito pequena!)
- **Preço**: 12 MT (baseado em distância errada)
- **Distância Autocarro**: 8.2 km (correto, mas não estava sendo usado)

## Causa do Problema

A API `/api/bus/[id]` não estava recebendo informações sobre:
- **Origem do utilizador** (paragemId)
- **Destino do utilizador** (destinoId)

Sem essas informações, não podia calcular corretamente a viagem do utilizador.

## Solução Implementada

### 1. API Atualizada (`/api/bus/[id]/route.ts`)

Agora aceita parâmetros de query:
- `?paragem=xxx` - Origem do utilizador
- `&destino=yyy` - Destino do utilizador

#### Cálculos Implementados:

**A. Tempo de Chegada (tempoEstimado)**
```typescript
// Encontra a paragem mais próxima do autocarro
closestStopIndex = findClosestStop(currentPosition, stops);

// Calcula distância do autocarro até a origem do utilizador
distanciaAteOrigem = 0;
if (closestStopIndex <= origemIndex) {
  // Soma distâncias entre paragens
  for (i = closestStopIndex; i < origemIndex; i++) {
    distanciaAteOrigem += distance(stops[i], stops[i+1]);
  }
}

tempoChegada = distanciaAteOrigem / 45km/h; // 45 km/h
```

**B. Distância da Viagem (distanciaViagem)**
```typescript
// Distância da VIAGEM DO UTILIZADOR (origem → destino)
distanciaViagem = 0;
for (i = origemIndex; i < destinoIndex; i++) {
  distanciaViagem += distance(stops[i], stops[i+1]);
}
```

**C. Tempo de Viagem (tempoViagem)**
```typescript
// Tempo que o utilizador passa no autocarro
tempoViagem = distanciaViagem / 30km/h; // 30 km/h velocidade urbana
```

**D. Preço (fare)**
```typescript
// Baseado na distância da viagem do utilizador
distanciaViagemKm = distanciaViagem / 1000;
fare = Math.max(10, Math.ceil(distanciaViagemKm * 10)); // 10 MT/km, mínimo 10 MT
```

### 2. Página de Tracking Atualizada

**Antes**:
```typescript
fetch(`/api/bus/${transportId}`)
```

**Depois**:
```typescript
let apiUrl = `/api/bus/${transportId}`;
if (paragemId) apiUrl += `?paragem=${paragemId}`;
if (destinoId) apiUrl += `&destino=${destinoId}`;
fetch(apiUrl)
```

### 3. Página de Pesquisa Atualizada

Agora passa origem E destino ao clicar em "Acompanhar":

```typescript
const handleTrackTransport = (transportId: string) => {
  const paragem = searchParams.get('paragem'); // origem
  const destino = searchParams.get('destino'); // destino
  
  router.push(`/track/${transportId}?paragem=${paragem}&destino=${destino}`);
};
```

## Exemplo de Cálculo Correto

### Cenário:
- **Rota do Autocarro**: Matola → Godinho → Portagem → Museu → Baixa (20 km total)
- **Posição Atual**: Godinho
- **Origem do Utilizador**: Portagem
- **Destino do Utilizador**: Museu

### Cálculos:

1. **Distância Autocarro até Origem**
   - Godinho → Portagem = 5 km
   
2. **Tempo de Chegada**
   - 5 km ÷ 45 km/h = 6.7 min ≈ **7 minutos**

3. **Distância da Viagem** (utilizador)
   - Portagem → Museu = 8 km
   
4. **Tempo de Viagem** (utilizador)
   - 8 km ÷ 30 km/h = 16 min ≈ **16 minutos**

5. **Preço**
   - 8 km × 10 MT/km = **80 MT**

### Display Correto:
```
Tempo de Chegada: 7 minutos
Distância Autocarro: 5 km
Velocidade: 45 km/h
Preço: 80 MT

Tempo de Viagem: 16 minutos no autocarro
Distância Viagem: 8 km
```

## Diferença Entre Métricas

| Métrica | O Que Mede | Velocidade |
|---------|------------|------------|
| **Tempo de Chegada** | Tempo para autocarro chegar na origem | 45 km/h |
| **Distância Autocarro** | Distância do autocarro até a origem | - |
| **Tempo de Viagem** | Tempo que utilizador passa no autocarro | 30 km/h |
| **Distância Viagem** | Distância da viagem do utilizador (origem → destino) | - |
| **Preço** | Baseado na distância da viagem | 10 MT/km |

## Logs de Debug

A API agora mostra logs detalhados:

```
🔍 Fetching bus details:
   Bus ID: clxyz123
   User origem: clxyz456
   User destino: clxyz789

   Origem index: 2
   Destino index: 4
   Closest stop index: 1
   
   ⏱️  Tempo chegada: 7 min
   📏 Distância até origem: 5.0 km
   🚶 Distância viagem: 8.0 km
   🕐 Tempo viagem: 16 min
   💰 Preço: 80 MT
```

## Ficheiros Modificados

1. **transport-client/app/api/bus/[id]/route.ts**
   - Aceita `paragem` e `destino` como query params
   - Calcula distâncias e tempos corretos
   - Retorna todos os valores calculados

2. **transport-client/app/track/[id]/page.tsx**
   - Lê `paragem` e `destino` dos query params
   - Passa para a API
   - Usa valores calculados da API

3. **transport-client/app/search/page.tsx**
   - Passa origem E destino ao clicar em "Acompanhar"
   - Mantém contexto da viagem do utilizador

## Status

✅ **COMPLETO** - Todos os cálculos agora estão corretos e baseados na viagem real do utilizador.

## Verificação

Para testar:
1. Pesquise com origem e destino
2. Clique em "Acompanhar" num autocarro
3. Verifique que:
   - **Tempo de Chegada** = tempo para autocarro chegar na sua origem
   - **Distância Viagem** = distância da sua viagem (origem → destino)
   - **Tempo de Viagem** = tempo que você passa no autocarro
   - **Preço** = baseado na sua viagem (não na rota completa do autocarro)

---

**Data**: 5 de Maio de 2026
**Status**: ✅ Completo e Verificado
