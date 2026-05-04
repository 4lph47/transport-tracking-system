# Atualização: GeoLocations e Missions Completas ✅

## Problema Identificado

Anteriormente, o seed criava:
- ❌ Apenas **3 GeoLocations** (para 25 transportes)
- ❌ **0 Missions** (nenhuma missão de rastreamento)

## Solução Implementada

Agora o seed cria:
- ✅ **25 GeoLocations** (uma para cada transporte)
- ✅ **6 Missions** (pedidos de rastreamento de usuários)

## O Que Foi Alterado

### 1. GeoLocations (Histórico de Posição)

#### Antes
```typescript
// Apenas 3 GeoLocations hardcoded
await prisma.geoLocation.createMany({
  data: [
    { transporteId: transporte1.id, ... },
    { transporteId: transporte2.id, ... },
    { transporteId: transporte3.id, ... },
  ]
});
```

#### Depois
```typescript
// GeoLocation para TODOS os 25 transportes
const allTransportes = [
  transporte1, transporte2, ..., transporte25
];

const geoLocationsData = allTransportes.map((transporte, index) => {
  // Usar a localização atual do transporte
  const [lat, lng] = transporte.currGeoLocation!.split(',').map(Number);
  
  // Criar histórico de 3 posições anteriores (simulando movimento)
  return {
    geoLocationTransporte: transporte.currGeoLocation!,
    geoDirection: 'Em circulação',
    codigoTransporte: transporte.codigo,
    transporteId: transporte.id,
    geoLocationHist1: `${hist1Lat},${hist1Lng}`,
    geoLocationHist2: `${hist2Lat},${hist2Lng}`,
    geoLocationHist3: `${hist3Lat},${hist3Lng}`,
    geoDateTime1: new Date(Date.now() - (15 + index) * 60000),
    geoDateTime2: new Date(Date.now() - (10 + index) * 60000),
    geoDateTime3: new Date(Date.now() - (5 + index) * 60000),
  };
});

await prisma.geoLocation.createMany({ data: geoLocationsData });
```

### 2. Missions (Pedidos de Rastreamento)

#### Antes
```typescript
// Nenhuma mission criada
```

#### Depois
```typescript
// 6 Missions de exemplo (2 por usuário)
await prisma.mISSION.createMany({
  data: [
    {
      mISSIONUtente: 'USER-001',
      codigoParagem: 'PAR-BAIXA',
      geoLocationUtente: '-25.9732,32.5632',
      geoLocationParagem: '-25.9734,32.5694',
      utenteId: utente1.id,
      paragemId: paragemBaixa.id,
    },
    // ... mais 5 missions
  ]
});
```

## Estrutura dos Dados

### GeoLocation (Histórico de Posição)

Cada transporte agora tem:
- **Posição atual:** `geoLocationTransporte`
- **Direção:** `geoDirection`
- **Histórico de 3 posições anteriores:**
  - `geoLocationHist1` (15 minutos atrás)
  - `geoLocationHist2` (10 minutos atrás)
  - `geoLocationHist3` (5 minutos atrás)
- **Timestamps:** `geoDateTime1`, `geoDateTime2`, `geoDateTime3`

### Mission (Pedido de Rastreamento)

Cada mission representa um usuário querendo rastrear autocarros em uma paragem:
- **Usuário:** `utenteId` e `mISSIONUtente`
- **Paragem:** `paragemId` e `codigoParagem`
- **Localização do usuário:** `geoLocationUtente`
- **Localização da paragem:** `geoLocationParagem`
- **Timestamps:** `createdAt`, `updatedAt`

## Dados Criados

### 25 GeoLocations
```
Transporte 1 (AAA-1234-MP) → GeoLocation com histórico
Transporte 2 (BBB-5678-MP) → GeoLocation com histórico
...
Transporte 25 (YYY-5050-MP) → GeoLocation com histórico
```

### 6 Missions
```
Utente 1 (João Pedro Silva):
  - Mission 1: Rastrear autocarros na Praça dos Trabalhadores
  - Mission 2: Rastrear autocarros no Terminal Museu

Utente 2 (Maria Santos Costa):
  - Mission 3: Rastrear autocarros no Terminal Zimpeto
  - Mission 4: Rastrear autocarros na Costa do Sol

Utente 3 (Carlos Nhaca):
  - Mission 5: Rastrear autocarros na Matola Sede
  - Mission 6: Rastrear autocarros na Portagem
```

## Benefícios

### ✅ Dados Completos
- Todos os transportes têm histórico de posição
- Usuários têm missions de rastreamento
- Sistema mais realista

### ✅ Testes Completos
- Pode testar histórico de movimento
- Pode testar pedidos de rastreamento
- Pode testar notificações de chegada

### ✅ APIs Funcionais
- `/api/buses` retorna transportes com GeoLocations
- `/api/user/missions` retorna missions dos usuários
- USSD pode criar e consultar missions

## Como Usar

### Consultar GeoLocation de um Transporte
```typescript
const transporte = await prisma.transporte.findUnique({
  where: { id: transporteId },
  include: {
    geoLocations: {
      orderBy: { createdAt: 'desc' },
      take: 1, // Última posição
    }
  }
});

const ultimaPosicao = transporte.geoLocations[0];
console.log(`Posição atual: ${ultimaPosicao.geoLocationTransporte}`);
console.log(`Histórico 1: ${ultimaPosicao.geoLocationHist1}`);
console.log(`Histórico 2: ${ultimaPosicao.geoLocationHist2}`);
console.log(`Histórico 3: ${ultimaPosicao.geoLocationHist3}`);
```

### Consultar Missions de um Usuário
```typescript
const missions = await prisma.mISSION.findMany({
  where: { utenteId: userId },
  include: {
    paragem: true,
  },
  orderBy: { createdAt: 'desc' }
});

missions.forEach(mission => {
  console.log(`Mission: ${mission.mISSIONUtente}`);
  console.log(`Paragem: ${mission.paragem.nome}`);
  console.log(`Criada em: ${mission.createdAt}`);
});
```

### Criar Nova Mission (via USSD ou Web)
```typescript
const mission = await prisma.mISSION.create({
  data: {
    mISSIONUtente: 'USER-004',
    codigoParagem: 'PAR-BAIXA',
    geoLocationUtente: userLocation,
    geoLocationParagem: paragemLocation,
    utenteId: userId,
    paragemId: paragemId,
  }
});
```

### Atualizar GeoLocation de um Transporte
```typescript
// Criar nova entrada de GeoLocation
const newGeoLocation = await prisma.geoLocation.create({
  data: {
    geoLocationTransporte: newPosition,
    geoDirection: 'Terminal Zimpeto',
    codigoTransporte: transporte.codigo,
    transporteId: transporte.id,
    geoLocationHist1: previousPosition1,
    geoLocationHist2: previousPosition2,
    geoLocationHist3: previousPosition3,
    geoDateTime1: new Date(Date.now() - 15 * 60000),
    geoDateTime2: new Date(Date.now() - 10 * 60000),
    geoDateTime3: new Date(Date.now() - 5 * 60000),
  }
});

// Atualizar posição atual do transporte
await prisma.transporte.update({
  where: { id: transporte.id },
  data: { currGeoLocation: newPosition }
});
```

## Impacto nas APIs

### `/api/buses`
Agora retorna transportes com GeoLocations completas:
```json
{
  "buses": [
    {
      "id": "abc123",
      "matricula": "AAA-1234-MP",
      "latitude": -25.9734,
      "longitude": 32.5694,
      "geoLocations": [
        {
          "geoLocationTransporte": "-25.9734,32.5694",
          "geoLocationHist1": "-25.9723,32.5836",
          "geoLocationHist2": "-25.9200,32.6000",
          "geoLocationHist3": "-25.8800,32.6100"
        }
      ]
    }
  ]
}
```

### `/api/user/missions`
Retorna missions do usuário:
```json
{
  "missions": [
    {
      "id": "def456",
      "mISSIONUtente": "USER-001",
      "paragem": {
        "nome": "Praça dos Trabalhadores",
        "geoLocation": "-25.9734,32.5694"
      },
      "createdAt": "2026-05-04T14:50:00Z"
    }
  ]
}
```

### USSD Integration
Usuários podem:
1. **Criar Mission:** Pedir para rastrear autocarros em uma paragem
2. **Consultar Mission:** Ver status da mission
3. **Receber Notificações:** Quando autocarro se aproxima

## Próximos Passos

### 1. Implementar Atualização em Tempo Real
```typescript
// Atualizar posição do transporte a cada X minutos
setInterval(async () => {
  // Simular movimento do autocarro
  const newPosition = calculateNewPosition(currentPosition, route);
  
  // Atualizar GeoLocation
  await updateTransportGeoLocation(transporteId, newPosition);
}, 60000); // A cada 1 minuto
```

### 2. Implementar Notificações
```typescript
// Verificar se autocarro está próximo da paragem da mission
const missions = await prisma.mISSION.findMany({
  where: { paragemId: paragemId }
});

missions.forEach(async (mission) => {
  const distance = calculateDistance(
    busLocation,
    mission.geoLocationParagem
  );
  
  if (distance < 500) { // 500 metros
    // Enviar notificação via SMS/USSD
    await sendNotification(mission.utente.telefone, 
      `Autocarro ${bus.matricula} está chegando!`
    );
  }
});
```

### 3. Dashboard de Monitoramento
- Visualizar todos os transportes no mapa
- Ver histórico de movimento
- Monitorar missions ativas
- Estatísticas de uso

## Verificação

### Verificar GeoLocations
```bash
npx prisma studio
```
1. Abrir tabela `GeoLocation`
2. Verificar que existem 25 registros
3. Cada registro tem `transporteId` único
4. Cada registro tem histórico (hist1, hist2, hist3)

### Verificar Missions
```bash
npx prisma studio
```
1. Abrir tabela `MISSION`
2. Verificar que existem 6 registros
3. Cada mission tem `utenteId` e `paragemId`
4. Cada mission tem localizações

### Testar via API
```bash
# Buscar transportes com GeoLocations
curl http://localhost:3000/api/buses

# Buscar missions de um usuário
curl http://localhost:3000/api/user/missions?utenteId=USER_ID
```

## Resumo

### Antes
- ❌ 3 GeoLocations (incompleto)
- ❌ 0 Missions (nenhuma)
- ❌ Dados insuficientes para testes

### Depois
- ✅ 25 GeoLocations (completo)
- ✅ 6 Missions (exemplos)
- ✅ Dados completos para testes
- ✅ Sistema funcional

---

**Status:** ✅ Completo
**Data:** 4 de Maio de 2026
**Dados:** 25 GeoLocations + 6 Missions criadas
**Próximo:** Deploy para produção
