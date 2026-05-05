# Origin-Destination Filtering - COMPLETE ✅

## Problema Resolvido

O sistema estava mostrando autocarros baseado apenas na paragem do utilizador, sem considerar para onde ele quer ir. Agora o sistema funciona corretamente:

### Conceito Chave

**A viagem do utilizador é um SUBCONJUNTO da rota do autocarro**

Exemplo:
- **Rota do autocarro**: Matola → Godinho → Portagem → Museu → Baixa
- **Viagem do utilizador**: Portagem → Museu

O sistema agora mostra apenas autocarros que:
1. ✅ Passam pela **origem** do utilizador (Portagem)
2. ✅ **Depois** passam pelo **destino** do utilizador (Museu)
3. ✅ A ordem é importante: origem ANTES do destino

## Mudanças Implementadas

### 1. Frontend - Formulário de Pesquisa

**Antes**: 3 passos
1. Município
2. Via
3. Paragem

**Depois**: 4 passos
1. Município
2. Via
3. **Sua Paragem (Origem)** - "Onde você está?"
4. **Destino** - "Para onde você vai?"

### 2. API de Buses - Nova Lógica de Filtragem

**Arquivo**: `transport-client/app/api/buses/route.ts`

#### Filtragem:
```typescript
// Encontra índice da origem e destino na rota do autocarro
const origemIndex = transporte.via.paragens.findIndex((vp) => vp.paragem.id === paragemId);
const destinoIndex = transporte.via.paragens.findIndex((vp) => vp.paragem.id === destinoId);

// Verifica se ambas as paragens estão na rota
if (origemIndex === -1 || destinoIndex === -1) {
  return null; // Autocarro não passa por ambas
}

// Verifica se origem vem ANTES do destino
if (origemIndex >= destinoIndex) {
  return null; // Direção errada
}
```

#### Cálculos Corretos:

1. **Tempo de Chegada** (`tempoEstimado`)
   - Tempo para o autocarro chegar na **origem do utilizador**
   - Calculado da posição atual do autocarro até a origem
   - Velocidade: 45 km/h

2. **Distância da Viagem** (`distancia`)
   - Distância da **origem até o destino do utilizador**
   - NÃO é a distância do autocarro até o utilizador
   - Soma das distâncias entre paragens: origem → destino

3. **Tempo de Viagem** (`tempoViagem`)
   - Tempo que o utilizador vai passar no autocarro
   - Da origem até o destino
   - Velocidade: 30 km/h (velocidade urbana)

4. **Preço** (`fare`)
   - Baseado na distância da viagem do utilizador
   - Fórmula: `Math.max(10, Math.ceil(distanciaKm * 10))`
   - 10 MT por quilómetro, mínimo 10 MT

### 3. Exemplo Prático

#### Cenário:
- **Autocarro AAA-1234**: Rota Matola → Godinho → Portagem → Museu → Baixa
- **Posição atual do autocarro**: Godinho
- **Utilizador**: Quer ir de Portagem → Museu

#### Cálculos:
```
Tempo de Chegada: 
  - Godinho → Portagem = 5 km
  - 5 km ÷ 45 km/h = 7 minutos

Distância da Viagem:
  - Portagem → Museu = 8 km

Tempo de Viagem:
  - 8 km ÷ 30 km/h = 16 minutos

Preço:
  - 8 km × 10 MT/km = 80 MT
```

#### Display:
```
AAA-1234
Rota Matola-Baixa
Matola → Baixa

Tempo Estimado: 7 min      (chegada na origem)
Distância: 8 km            (viagem do utilizador)
Velocidade: 45 km/h
Preço: 80 MT               (baseado na viagem)
```

## Paragens Mantêm Coordenadas Fixas

**Importante**: As paragens (stops) mantêm sempre as mesmas coordenadas, independentemente da via.

- ✅ A paragem "Portagem" tem sempre as mesmas coordenadas
- ✅ Aparece no mesmo local no mapa para todos os autocarros
- ✅ O que varia entre vias são as **ruas/caminhos** entre as paragens (geoLocationPath)

## Ficheiros Modificados

### Frontend:
- `transport-client/app/search/page.tsx`
  - Adicionado campo de destino
  - Atualizado para 4 passos
  - Atualizado handleSearch para incluir destino
  - Filtro para não mostrar origem como destino

### Backend:
- `transport-client/app/api/buses/route.ts` (reescrito)
  - Nova lógica de filtragem origem → destino
  - Cálculos corretos baseados na viagem do utilizador
  - Logs detalhados para debugging

### Backup:
- `transport-client/app/api/buses/route.ts.old` (backup do código antigo)

## Como Testar

1. Acesse a página de pesquisa
2. Selecione:
   - Município: Maputo
   - Via: Qualquer via
   - Origem: Portagem
   - Destino: Museu
3. Clique em "Pesquisar Transportes"
4. Deve mostrar apenas autocarros que:
   - Passam por Portagem
   - Depois passam por Museu
   - Com cálculos baseados na viagem Portagem → Museu

## Logs de Debug

A API agora mostra logs detalhados:

```
🔍 Searching buses:
   Origem (user): clxyz123
   Destino (user): clxyz456
   Via filter: all

✅ Origem: Portagem
✅ Destino: Museu

📊 Found 76 total transportes

✅ AAA-1234: Passes through origem (3) → destino (4)
   ⏱️  Tempo chegada: 7 min
   📏 Distância viagem: 8.0 km
   🕐 Tempo viagem: 16 min
   💰 Preço: 80 MT

❌ AAA-5678: Wrong direction (destino before origem)

📊 Final result: 12 valid buses
```

## Status

✅ **COMPLETO** - O sistema agora filtra corretamente por origem e destino do utilizador.

## Próximos Passos

1. ✅ Testar com diferentes combinações origem-destino
2. Criar vias únicas para todos os 70+ autocarros (script já criado)
3. Atualizar página de tracking para mostrar informações da viagem do utilizador

---

**Data**: 5 de Maio de 2026
**Status**: ✅ Completo e Testado
