# Sistema de Rastreamento em Tempo Real - Implementação Completa ✅

## Visão Geral

Sistema completo de rastreamento de autocarros com:
1. **Simulação de movimento** - Autocarros seguem suas rotas automaticamente
2. **Atualização em tempo real** - Backend atualiza GeoLocation continuamente
3. **Notificações USSD/SMS** - Usuários recebem avisos quando autocarro está próximo
4. **Visualização ao vivo** - Web app mostra autocarros se movendo no mapa

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Bus Simulator                            │
│  - Move autocarros ao longo das rotas                      │
│  - Atualiza GeoLocation a cada 30 segundos                 │
│  - Verifica missions ativas                                │
│  - Envia notificações quando autocarro está próximo        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (Neon)                          │
│  - Transporte.currGeoLocation (atualizado)                 │
│  - GeoLocation (histórico)                                 │
│  - MISSION (pedidos de rastreamento)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐     ┌───────▼────────┐
        │   Web App      │     │   USSD/SMS     │
        │                │     │                │
        │  - Mapa ao vivo│     │  - Criar       │
        │  - Autocarros  │     │    mission     │
        │    se movendo  │     │  - Receber     │
        │  - Tempo real  │     │    notificação │
        └────────────────┘     └────────────────┘
```

## Componentes Implementados

### 1. Bus Simulator (`lib/busSimulator.ts`)

Responsável por:
- ✅ Mover autocarros ao longo de suas rotas
- ✅ Atualizar `Transporte.currGeoLocation`
- ✅ Atualizar `GeoLocation` com histórico
- ✅ Verificar missions ativas
- ✅ Calcular distância entre autocarro e paragem
- ✅ Enviar notificações quando autocarro está próximo

**Funções principais:**
```typescript
// Inicializar posições dos autocarros
await initializeBusPositions();

// Iniciar simulação (atualiza a cada 30 segundos)
startBusSimulation(30000);

// Parar simulação
stopBusSimulation();

// Ver status
getSimulationStatus();
```

### 2. Notifications (`lib/notifications.ts`)

Responsável por:
- ✅ Enviar SMS via Africa's Talking
- ✅ Notificar usuário quando autocarro está chegando
- ✅ Confirmar criação de mission

**Funções principais:**
```typescript
// Enviar SMS genérico
await sendSMS(phoneNumber, message);

// Notificar chegada de autocarro
await notifyBusArrival(phoneNumber, busMatricula, paragemNome, tempoEstimado);

// Confirmar mission criada
await notifyMissionCreated(phoneNumber, paragemNome);
```

### 3. Simulation API (`/api/simulation`)

Controlar a simulação via API:

**GET /api/simulation** - Ver status
```bash
curl http://localhost:3000/api/simulation
```

Resposta:
```json
{
  "success": true,
  "status": {
    "running": true,
    "busCount": 25
  }
}
```

**POST /api/simulation** - Iniciar/Parar
```bash
# Iniciar (atualiza a cada 30 segundos)
curl -X POST http://localhost:3000/api/simulation \
  -H "Content-Type: application/json" \
  -d '{"action": "start", "interval": 30000}'

# Parar
curl -X POST http://localhost:3000/api/simulation \
  -H "Content-Type: application/json" \
  -d '{"action": "stop"}'
```

## Como Funciona

### 1. Movimento dos Autocarros

```typescript
// Cada autocarro tem uma rota (array de coordenadas)
routePath = [
  [32.5694, -25.9734],  // Ponto 1
  [32.5714, -25.9688],  // Ponto 2
  [32.6186, -25.8643],  // Ponto 3
  // ...
];

// A cada 30 segundos:
// 1. Mover para próximo ponto da rota
// 2. Atualizar Transporte.currGeoLocation
// 3. Atualizar GeoLocation com histórico
// 4. Quando chegar ao fim, inverter direção
```

### 2. Detecção de Proximidade

```typescript
// Para cada mission ativa:
// 1. Buscar autocarros que passam por aquela paragem
// 2. Calcular distância entre autocarro e paragem
// 3. Se distância < 1km:
//    - Calcular tempo estimado
//    - Enviar notificação SMS
```

### 3. Notificação ao Usuário

```typescript
// Quando autocarro está a menos de 1km:
const tempoEstimado = Math.ceil(distance / 1000 / 45 * 60); // 45 km/h

// Enviar SMS
await sendSMS(
  userPhone,
  `🚌 Autocarro ${matricula} está a ${tempoEstimado} minutos da ${paragem}!`
);
```

## Fluxo Completo

### Cenário: João quer pegar autocarro na Baixa

#### 1. João cria uma Mission via USSD

```
João: *123#
Sistema: Bem-vindo! Escolha:
         1. Rastrear Autocarro
         2. Ver Rotas

João: 1

Sistema: Escolha a paragem:
         1. Praça dos Trabalhadores
         2. Terminal Museu
         3. Terminal Zimpeto

João: 1

Sistema: ✅ Missão criada!
         Você será notificado quando um 
         autocarro estiver chegando.
```

**Backend:**
```typescript
// Criar mission no banco de dados
const mission = await prisma.mISSION.create({
  data: {
    mISSIONUtente: 'USER-001',
    codigoParagem: 'PAR-BAIXA',
    geoLocationUtente: '-25.9732,32.5632',
    geoLocationParagem: '-25.9734,32.5694',
    utenteId: userId,
    paragemId: paragemId,
  }
});

// Enviar SMS de confirmação
await notifyMissionCreated(phoneNumber, 'Praça dos Trabalhadores');
```

#### 2. Simulador Move os Autocarros

```typescript
// A cada 30 segundos:
setInterval(async () => {
  // Atualizar posição de todos os 25 autocarros
  for (const bus of buses) {
    // Mover para próximo ponto da rota
    const newPosition = getNextPosition(bus);
    
    // Atualizar no banco de dados
    await prisma.transporte.update({
      where: { id: bus.id },
      data: { currGeoLocation: newPosition }
    });
  }
}, 30000);
```

#### 3. Sistema Detecta Autocarro Próximo

```typescript
// Verificar missions ativas
const missions = await prisma.mISSION.findMany({
  where: { paragemId: 'PAR-BAIXA' }
});

// Para cada autocarro
for (const bus of buses) {
  const distance = calculateDistance(
    bus.currGeoLocation,
    mission.geoLocationParagem
  );
  
  // Se está a menos de 1km
  if (distance < 1000) {
    const tempoEstimado = Math.ceil(distance / 1000 / 45 * 60);
    
    // Enviar notificação
    await notifyBusArrival(
      mission.utente.telefone,
      bus.matricula,
      'Praça dos Trabalhadores',
      tempoEstimado
    );
  }
}
```

#### 4. João Recebe SMS

```
SMS: 🚌 Autocarro AAA-1234-MP está a 
     5 minutos da Praça dos Trabalhadores!
```

#### 5. João Abre o App Web

```typescript
// Web app busca autocarros em tempo real
const response = await fetch('/api/buses');
const { buses } = await response.json();

// Mostrar no mapa
buses.forEach(bus => {
  // Criar marcador no mapa
  new maplibregl.Marker()
    .setLngLat([bus.longitude, bus.latitude])
    .addTo(map);
});

// Atualizar a cada 10 segundos
setInterval(async () => {
  const response = await fetch('/api/buses');
  const { buses } = await response.json();
  // Atualizar posições dos marcadores
}, 10000);
```

## Como Usar

### 1. Iniciar a Simulação

**Opção A: Via API**
```bash
curl -X POST http://localhost:3000/api/simulation \
  -H "Content-Type: application/json" \
  -d '{"action": "start", "interval": 30000}'
```

**Opção B: Programaticamente**
```typescript
import { initializeBusPositions, startBusSimulation } from '@/lib/busSimulator';

// Inicializar
await initializeBusPositions();

// Iniciar (atualiza a cada 30 segundos)
startBusSimulation(30000);
```

**Opção C: Automático no Startup**
Adicionar em `app/layout.tsx` ou criar um endpoint `/api/startup`:
```typescript
// app/api/startup/route.ts
import { initializeBusPositions, startBusSimulation } from '@/lib/busSimulator';

export async function GET() {
  await initializeBusPositions();
  startBusSimulation(30000);
  
  return Response.json({ success: true });
}
```

### 2. Criar Mission via USSD

```
Usuário: *123#
Sistema: Menu principal
Usuário: 1 (Rastrear Autocarro)
Sistema: Escolha paragem
Usuário: 1 (Praça dos Trabalhadores)
Sistema: ✅ Missão criada!
```

### 3. Ver Autocarros no Mapa

```
1. Abrir http://localhost:3000
2. Ver 25 autocarros no mapa
3. Posições atualizadas automaticamente
4. Clicar em autocarro para ver rota
```

### 4. Receber Notificação

```
Quando autocarro está a menos de 1km:
SMS: 🚌 Autocarro AAA-1234-MP está a 5 minutos!
```

## Configuração

### 1. Variáveis de Ambiente

```env
# Africa's Talking (para SMS)
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="your-api-key"
AFRICASTALKING_SHORTCODE="your-shortcode" # Opcional

# Database
DATABASE_URL="postgresql://..."
```

### 2. Intervalo de Atualização

Ajustar conforme necessário:
```typescript
// Atualizar a cada 10 segundos (mais frequente)
startBusSimulation(10000);

// Atualizar a cada 1 minuto (menos frequente)
startBusSimulation(60000);

// Atualizar a cada 30 segundos (padrão)
startBusSimulation(30000);
```

### 3. Distância de Notificação

Ajustar em `busSimulator.ts`:
```typescript
// Notificar quando autocarro está a menos de 500m
if (distance < 500) {
  await notifyBusArrival(...);
}

// Notificar quando autocarro está a menos de 2km
if (distance < 2000) {
  await notifyBusArrival(...);
}
```

## Benefícios

### Para o Usuário
- ✅ Sabe exatamente quando o autocarro vai chegar
- ✅ Não precisa esperar na paragem
- ✅ Recebe notificação automática via SMS
- ✅ Pode ver autocarro se movendo no mapa

### Para o Sistema
- ✅ Dados em tempo real
- ✅ Histórico de movimento
- ✅ Estatísticas de uso
- ✅ Melhor experiência do usuário

## Próximos Passos

### 1. Integração com GPS Real

Quando tiver dispositivos GPS nos autocarros:
```typescript
// Substituir simulação por dados reais
// POST /api/gps/update
{
  "transporteId": "abc123",
  "latitude": -25.9734,
  "longitude": 32.5694,
  "timestamp": "2026-05-04T15:30:00Z"
}
```

### 2. WebSocket para Tempo Real

Implementar WebSocket para atualização instantânea:
```typescript
// Cliente
const ws = new WebSocket('ws://localhost:3000/ws');
ws.onmessage = (event) => {
  const { buses } = JSON.parse(event.data);
  updateMapMarkers(buses);
};

// Servidor
wss.on('connection', (ws) => {
  setInterval(() => {
    ws.send(JSON.stringify({ buses: currentBuses }));
  }, 5000);
});
```

### 3. Notificações Push

Adicionar notificações push no web app:
```typescript
// Pedir permissão
const permission = await Notification.requestPermission();

// Enviar notificação
new Notification('Autocarro chegando!', {
  body: 'AAA-1234-MP está a 5 minutos',
  icon: '/bus-icon.png'
});
```

## Testes

### Testar Simulação
```bash
# Iniciar simulação
curl -X POST http://localhost:3000/api/simulation \
  -d '{"action": "start", "interval": 10000}'

# Ver status
curl http://localhost:3000/api/simulation

# Ver autocarros
curl http://localhost:3000/api/buses

# Parar simulação
curl -X POST http://localhost:3000/api/simulation \
  -d '{"action": "stop"}'
```

### Testar Notificações
```typescript
// Criar mission de teste
const mission = await prisma.mISSION.create({
  data: {
    mISSIONUtente: 'TEST-001',
    codigoParagem: 'PAR-BAIXA',
    geoLocationUtente: '-25.9732,32.5632',
    geoLocationParagem: '-25.9734,32.5694',
    utenteId: testUserId,
    paragemId: paragemId,
  }
});

// Aguardar notificação quando autocarro passar
```

## Troubleshooting

### Simulação não inicia
```bash
# Verificar logs
tail -f logs/simulation.log

# Verificar se autocarros têm rotas
npx prisma studio
# Abrir tabela Transporte
# Verificar campo routePath
```

### Notificações não chegam
```bash
# Verificar credenciais Africa's Talking
echo $AFRICASTALKING_API_KEY

# Testar envio manual
curl -X POST http://localhost:3000/api/test-sms \
  -d '{"phone": "+258840000001", "message": "Teste"}'
```

### Autocarros não aparecem no mapa
```bash
# Verificar API
curl http://localhost:3000/api/buses

# Verificar banco de dados
npx prisma studio
# Abrir tabela Transporte
# Verificar campo currGeoLocation
```

---

**Status:** ✅ Implementado e Pronto para Uso
**Data:** 4 de Maio de 2026
**Componentes:** Bus Simulator + Notifications + Simulation API
**Próximo:** Iniciar simulação e testar
