# 🏗️ Arquitetura do Sistema - Transportes Moçambique

**Versão:** 1.0  
**Data:** 4 de Maio de 2026  
**Status:** ✅ Implementado e Funcional

---

## 📐 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAMADA DE APRESENTAÇÃO                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │   Web App        │  │   USSD Interface │  │   Admin Panel    │ │
│  │   (Next.js)      │  │   (*123#)        │  │   (Next.js)      │ │
│  │                  │  │                  │  │                  │ │
│  │  - Mapa 3D       │  │  - Menu          │  │  - Gestão        │ │
│  │  - Tempo Real    │  │  - Consultas     │  │  - Controle      │ │
│  │  - Rotas         │  │  - Notificações  │  │  - Analytics     │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│           │                     │                      │            │
└───────────┼─────────────────────┼──────────────────────┼────────────┘
            │                     │                      │
            ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CAMADA DE APLICAÇÃO                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      API Routes (Next.js)                    │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  /api/startup        │  Auto-inicialização do sistema       │  │
│  │  /api/simulation     │  Controle da simulação               │  │
│  │  /api/buses          │  Listar autocarros                   │  │
│  │  /api/routes         │  Listar rotas                        │  │
│  │  /api/stops          │  Listar paragens                     │  │
│  │  /api/ussd           │  Interface USSD                      │  │
│  │  /api/gps/update     │  Atualizar posição GPS (futuro)      │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│           │                     │                      │            │
└───────────┼─────────────────────┼──────────────────────┼────────────┘
            │                     │                      │
            ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CAMADA DE NEGÓCIO                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Bus Simulator   │  │  Notifications   │  │  Mission Manager │ │
│  │  (lib/)          │  │  (lib/)          │  │  (lib/)          │ │
│  │                  │  │                  │  │                  │ │
│  │  - Movimento     │  │  - SMS           │  │  - Criar         │ │
│  │  - Rotas         │  │  - Africa's      │  │  - Verificar     │ │
│  │  - Histórico     │  │    Talking       │  │  - Notificar     │ │
│  │  - Detecção      │  │  - Templates     │  │  - Gerenciar     │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│           │                     │                      │            │
└───────────┼─────────────────────┼──────────────────────┼────────────┘
            │                     │                      │
            ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CAMADA DE DADOS                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Prisma ORM Client                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Neon PostgreSQL Database                        │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  Tabelas:                                                    │  │
│  │  - Utente (usuários)                                         │  │
│  │  - Transporte (autocarros)                                   │  │
│  │  - Via (rotas)                                               │  │
│  │  - Paragem (paragens)                                        │  │
│  │  - Motorista (motoristas)                                    │  │
│  │  - GeoLocation (posições GPS)                                │  │
│  │  - MISSION (rastreamento)                                    │  │
│  │  - ViaParagem (relação via-paragem)                          │  │
│  │  - Notificacao (notificações)                                │  │
│  │  - Pagamento (pagamentos)                                    │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVIÇOS EXTERNOS                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Africa's        │  │  OpenFreeMap     │  │  OSRM Routing    │ │
│  │  Talking         │  │  (Tiles)         │  │  (Rotas)         │ │
│  │                  │  │                  │  │                  │ │
│  │  - USSD          │  │  - Mapa base     │  │  - Cálculo de    │ │
│  │  - SMS           │  │  - Sem API key   │  │    rotas         │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados - Rastreamento em Tempo Real

```
┌─────────────────────────────────────────────────────────────────────┐
│                    1. INICIALIZAÇÃO DO SISTEMA                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Web App Carrega │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ GET /api/startup │
                    └──────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  initializeBusPositions()               │
        │  - Buscar 25 autocarros do banco       │
        │  - Parsear rotas (routePath)            │
        │  - Inicializar posições                 │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  startBusSimulation(30000)              │
        │  - Iniciar loop de atualização          │
        │  - Intervalo: 30 segundos               │
        └─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    2. LOOP DE SIMULAÇÃO (30s)                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Para cada autocarro (25 total):        │
        │                                         │
        │  1. Calcular próxima posição            │
        │     - Mover para próximo ponto da rota  │
        │     - Inverter direção se necessário    │
        │                                         │
        │  2. Atualizar Transporte                │
        │     - currGeoLocation = nova posição    │
        │                                         │
        │  3. Atualizar GeoLocation               │
        │     - geoLocationTransporte             │
        │     - geoLocationHist1, 2, 3            │
        │     - geoDateTime1, 2, 3                │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  checkAndNotifyUsers()                  │
        │                                         │
        │  1. Buscar missions ativas (24h)        │
        │  2. Para cada mission:                  │
        │     - Buscar autocarros da rota         │
        │     - Calcular distância                │
        │     - Se < 1km: enviar SMS              │
        └─────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Aguardar 30s    │
                    └──────────────────┘
                              │
                              ▼
                    (Repetir loop)

┌─────────────────────────────────────────────────────────────────────┐
│                    3. ATUALIZAÇÃO WEB APP (10s)                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  setInterval     │
                    │  (10 segundos)   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ GET /api/buses   │
                    └──────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Buscar autocarros do banco:            │
        │  - Transporte.currGeoLocation           │
        │  - Via.nome                             │
        │  - Motorista.nome                       │
        │  - Via.geoLocationPath (rota completa)  │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  updateBusMarkers(buses)                │
        │  - Para cada autocarro:                 │
        │    - Buscar marker existente            │
        │    - Atualizar posição (setLngLat)      │
        │    - Atualizar popup                    │
        └─────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Aguardar 10s    │
                    └──────────────────┘
                              │
                              ▼
                    (Repetir polling)

┌─────────────────────────────────────────────────────────────────────┐
│                    4. CRIAÇÃO DE MISSION (USSD)                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Usuário: *123#  │
                    │  1 → 1 → 1       │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ POST /api/ussd   │
                    └──────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  findTransportInfo(from, to)            │
        │  - Buscar rotas disponíveis             │
        │  - Calcular tempo estimado              │
        │  - Calcular tarifa                      │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  createMissionForUser(phone, from, to)  │
        │                                         │
        │  1. Encontrar ou criar usuário          │
        │  2. Encontrar paragem de destino        │
        │  3. Criar MISSION no banco              │
        │  4. Enviar SMS de confirmação           │
        └─────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Retornar info   │
                    │  + "Voce sera    │
                    │  notificado!"    │
                    └──────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    5. NOTIFICAÇÃO AUTOMÁTICA                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  checkAndNotifyUsers()                  │
        │  (executado a cada 30s)                 │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Para cada mission ativa:               │
        │                                         │
        │  1. Buscar autocarros da rota           │
        │  2. Calcular distância                  │
        │     distance = calculateDistance(       │
        │       bus.currGeoLocation,              │
        │       mission.geoLocationParagem        │
        │     )                                   │
        └─────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  distance < 1km? │
                    └──────────────────┘
                         │         │
                    Não  │         │  Sim
                         │         │
                         ▼         ▼
                    (Ignorar)  ┌──────────────────┐
                               │  Calcular tempo  │
                               │  estimado        │
                               └──────────────────┘
                                       │
                                       ▼
                               ┌──────────────────┐
                               │  notifyBusArrival│
                               │  (SMS)           │
                               └──────────────────┘
                                       │
                                       ▼
                               ┌──────────────────┐
                               │  Africa's Talking│
                               │  envia SMS       │
                               └──────────────────┘
                                       │
                                       ▼
                               ┌──────────────────┐
                               │  Usuário recebe: │
                               │  "🚌 Autocarro   │
                               │  AAA-1234 está a │
                               │  5 minutos!"     │
                               └──────────────────┘
```

---

## 🗄️ Modelo de Dados

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MODELO DE DADOS                             │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Utente     │         │  Transporte  │         │     Via      │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id           │◄───┐    │ id           │    ┌───►│ id           │
│ nome         │    │    │ matricula    │    │    │ nome         │
│ telefone     │    │    │ marca        │    │    │ terminal     │
│ email        │    │    │ modelo       │    │    │   Partida    │
│ senha        │    │    │ capacidade   │    │    │ terminal     │
│ createdAt    │    │    │ currGeo      │    │    │   Chegada    │
└──────────────┘    │    │   Location   │    │    │ geoLocation  │
                    │    │ routePath    │    │    │   Path       │
                    │    │ viaId        │────┘    │ createdAt    │
                    │    │ createdAt    │         └──────────────┘
                    │    └──────────────┘                │
                    │            │                       │
                    │            │                       │
                    │            ▼                       ▼
                    │    ┌──────────────┐       ┌──────────────┐
                    │    │  Motorista   │       │  ViaParagem  │
                    │    ├──────────────┤       ├──────────────┤
                    │    │ id           │       │ id           │
                    │    │ nome         │       │ viaId        │───┐
                    │    │ telefone     │       │ paragemId    │───┤
                    │    │ licenca      │       │ ordem        │   │
                    │    │ transporteId │       │ createdAt    │   │
                    │    │ createdAt    │       └──────────────┘   │
                    │    └──────────────┘                          │
                    │            │                                 │
                    │            │                                 │
                    │            ▼                                 ▼
                    │    ┌──────────────┐               ┌──────────────┐
                    │    │ GeoLocation  │               │   Paragem    │
                    │    ├──────────────┤               ├──────────────┤
                    │    │ id           │               │ id           │
                    │    │ geoLocation  │               │ nome         │
                    │    │   Transporte │               │ geoLocation  │
                    │    │ geoDirection │               │ isTerminal   │
                    │    │ geoLocation  │               │ createdAt    │
                    │    │   Hist1,2,3  │               └──────────────┘
                    │    │ geoDateTime  │                       │
                    │    │   1,2,3      │                       │
                    │    │ transporteId │                       │
                    │    │ createdAt    │                       │
                    │    └──────────────┘                       │
                    │                                           │
                    │                                           │
                    └───────────────────┐                       │
                                        │                       │
                                        ▼                       ▼
                                ┌──────────────┐       ┌──────────────┐
                                │   MISSION    │       │ Notificacao  │
                                ├──────────────┤       ├──────────────┤
                                │ id           │       │ id           │
                                │ mISSIONUtente│       │ mensagem     │
                                │ codigoParagem│       │ tipo         │
                                │ geoLocation  │       │ lida         │
                                │   Utente     │       │ utenteId     │
                                │ geoLocation  │       │ createdAt    │
                                │   Paragem    │       └──────────────┘
                                │ utenteId     │
                                │ paragemId    │
                                │ createdAt    │
                                └──────────────┘

Relacionamentos:
- Utente 1:N MISSION
- Utente 1:N Notificacao
- Transporte N:1 Via
- Transporte 1:1 Motorista
- Transporte 1:N GeoLocation
- Via N:M Paragem (através de ViaParagem)
- Paragem 1:N MISSION
```

---

## 🔐 Segurança e Autenticação

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAMADA DE SEGURANÇA                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Requisição HTTP │
└──────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│  Middleware de Autenticação                                      │
│  - Verificar token JWT                                           │
│  - Validar sessão                                                │
│  - Verificar permissões                                          │
└──────────────────────────────────────────────────────────────────┘
         │
         ├─── Público ────────────────────────────────────────┐
         │    - /api/buses (GET)                              │
         │    - /api/routes (GET)                             │
         │    - /api/stops (GET)                              │
         │    - /api/ussd (POST)                              │
         │                                                     │
         ├─── Autenticado ────────────────────────────────────┤
         │    - /dashboard/*                                  │
         │    - /api/missions (POST)                          │
         │    - /api/notifications (GET)                      │
         │                                                     │
         └─── Admin ─────────────────────────────────────────┤
              - /admin/*                                      │
              - /api/simulation (POST)                        │
              - /api/admin/*                                  │
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │  Processar       │
                                                    │  Requisição      │
                                                    └──────────────────┘
```

---

## 📊 Escalabilidade

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ESTRATÉGIA DE ESCALABILIDADE                     │
└─────────────────────────────────────────────────────────────────────┘

Fase 1: MVP (Atual)
┌──────────────────────────────────────────────────────────────────┐
│  - Vercel (Serverless)                                           │
│  - Neon PostgreSQL (Serverless)                                  │
│  - Simulação local ou Cron                                       │
│  - Capacidade: ~100 usuários simultâneos                         │
└──────────────────────────────────────────────────────────────────┘

Fase 2: Crescimento
┌──────────────────────────────────────────────────────────────────┐
│  - Railway (Servidor dedicado)                                   │
│  - Neon PostgreSQL (Escalável)                                   │
│  - Simulação em servidor                                         │
│  - Redis para cache                                              │
│  - Capacidade: ~1,000 usuários simultâneos                       │
└──────────────────────────────────────────────────────────────────┘

Fase 3: Produção
┌──────────────────────────────────────────────────────────────────┐
│  - Kubernetes cluster                                            │
│  - PostgreSQL cluster (HA)                                       │
│  - GPS real (sem simulação)                                      │
│  - Redis cluster                                                 │
│  - Load balancer                                                 │
│  - CDN para assets                                               │
│  - Capacidade: ~10,000+ usuários simultâneos                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Vida de uma Requisição

```
┌─────────────────────────────────────────────────────────────────────┐
│              EXEMPLO: Usuário consulta transporte via USSD          │
└─────────────────────────────────────────────────────────────────────┘

1. Usuário disca *123#
         │
         ▼
2. Africa's Talking recebe
         │
         ▼
3. POST https://app.vercel.app/api/ussd
   Body: {
     sessionId: "abc123",
     phoneNumber: "+258840000001",
     text: "1*1*1"
   }
         │
         ▼
4. Next.js API Route (/api/ussd/route.ts)
   - Parsear input
   - Determinar nível do menu
   - Processar escolha
         │
         ▼
5. Buscar dados do banco (Prisma)
   - Buscar rotas disponíveis
   - Buscar autocarros
   - Calcular tempo estimado
         │
         ▼
6. Criar mission (createMissionForUser)
   - Encontrar/criar usuário
   - Criar registro MISSION
   - Preparar notificação
         │
         ▼
7. Enviar SMS de confirmação
   - notifyMissionCreated()
   - Africa's Talking SMS API
         │
         ▼
8. Retornar resposta USSD
   Response: "END INFORMACAO DE TRANSPORTE
              ...
              Voce sera notificado via SMS!"
         │
         ▼
9. Africa's Talking mostra no celular
         │
         ▼
10. Usuário recebe SMS de confirmação
         │
         ▼
11. Simulação detecta autocarro próximo (30s loop)
         │
         ▼
12. Usuário recebe SMS de chegada
    "🚌 Autocarro AAA-1234 está a 5 minutos!"

Tempo total: ~2-3 segundos (passos 1-10)
Notificação: ~5-15 minutos (dependendo da posição do autocarro)
```

---

## 📈 Monitoramento e Observabilidade

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STACK DE MONITORAMENTO                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Aplicação       │
└──────────────────┘
         │
         ├─── Logs ──────────────────────────────────────────┐
         │    - console.log()                                │
         │    - Vercel Logs                                  │
         │    - Estruturados (JSON)                          │
         │                                                   │
         ├─── Métricas ──────────────────────────────────────┤
         │    - Tempo de resposta                            │
         │    - Taxa de erro                                 │
         │    - Uso de recursos                              │
         │    - Vercel Analytics                             │
         │                                                   │
         ├─── Traces ────────────────────────────────────────┤
         │    - Requisições end-to-end                       │
         │    - Queries do banco                             │
         │    - Chamadas externas                            │
         │                                                   │
         └─── Alertas ──────────────────────────────────────┤
              - Erros críticos                               │
              - Performance degradada                        │
              - Sentry (erro tracking)                       │
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │  Dashboard       │
                                                    │  - Grafana       │
                                                    │  - Vercel UI     │
                                                    └──────────────────┘
```

---

## 🎯 Conclusão

Esta arquitetura fornece:

✅ **Escalabilidade** - Pode crescer de 100 para 10,000+ usuários  
✅ **Manutenibilidade** - Código organizado e documentado  
✅ **Performance** - Otimizado para tempo real  
✅ **Segurança** - Autenticação e autorização  
✅ **Observabilidade** - Logs, métricas e alertas  
✅ **Flexibilidade** - Fácil adicionar novas funcionalidades  

---

**Versão:** 1.0  
**Última atualização:** 4 de Maio de 2026  
**Status:** ✅ Implementado e Funcional
