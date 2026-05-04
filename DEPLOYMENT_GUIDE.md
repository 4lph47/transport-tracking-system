# Guia de Deploy - Sistema de Transportes

## 🚀 Deploy Rápido para Vercel

### Pré-requisitos
- ✅ Conta no Vercel
- ✅ Conta no GitHub
- ✅ Banco de dados Neon configurado
- ✅ Credenciais Africa's Talking

---

## 📋 Passo a Passo

### 1. Preparar o Repositório

```bash
# Verificar se está tudo commitado
git status

# Se houver mudanças, commitar
git add .
git commit -m "Sistema de rastreamento completo - pronto para deploy"

# Push para GitHub
git push origin main
```

### 2. Conectar ao Vercel

```bash
# Opção A: Via CLI
npm i -g vercel
vercel login
vercel

# Opção B: Via Web
# 1. Ir para https://vercel.com
# 2. Clicar em "New Project"
# 3. Importar repositório do GitHub
# 4. Selecionar "transport-client" como root directory
```

### 3. Configurar Variáveis de Ambiente

No painel do Vercel, adicionar:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Africa's Talking - Production
AFRICASTALKING_USERNAME=Overlord
AFRICASTALKING_API_KEY=atsk_efab8c78d30d66aca71223167c9887c7b362b9e4037b365f8d8dca2c9965a5046400e070

# Telerivet
TELERIVET_SECRET=TransportUSSD2024SecureKey
```

### 4. Configurar Build Settings

```json
// vercel.json (criar na raiz de transport-client)
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 5. Deploy

```bash
# Deploy para produção
vercel --prod

# Ou via web: clicar em "Deploy"
```

---

## ⚠️ Limitações do Vercel (Serverless)

### Problema: Simulação Não Funciona em Serverless

O Vercel usa **serverless functions** que:
- ❌ Não mantêm estado entre requisições
- ❌ Não suportam `setInterval` de longa duração
- ❌ Timeout após 10 segundos (hobby) ou 60 segundos (pro)

**Resultado:** A simulação de autocarros não funcionará no Vercel.

---

## 🔧 Soluções para Produção

### Opção 1: Vercel Cron Jobs (Recomendado para MVP)

Usar Vercel Cron para atualizar posições periodicamente.

#### 1.1. Criar Endpoint de Cron

```typescript
// transport-client/app/api/cron/update-buses/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  // Verificar autorização (Vercel envia header especial)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Atualizar posição de todos os autocarros
    const transportes = await prisma.transporte.findMany({
      include: { via: true }
    });

    for (const transporte of transportes) {
      // Lógica de movimento (simplificada)
      const newPosition = calculateNextPosition(transporte);
      
      await prisma.transporte.update({
        where: { id: transporte.id },
        data: { currGeoLocation: newPosition }
      });
    }

    // Verificar missions e enviar notificações
    await checkAndNotifyUsers();

    return NextResponse.json({
      success: true,
      updated: transportes.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

function calculateNextPosition(transporte: any): string {
  // Implementar lógica de movimento
  // Similar ao busSimulator.ts
  return transporte.currGeoLocation;
}

async function checkAndNotifyUsers() {
  // Implementar verificação de missions
  // Similar ao busSimulator.ts
}
```

#### 1.2. Configurar Cron no Vercel

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/update-buses",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

**Frequências disponíveis:**
- `*/1 * * * *` - A cada 1 minuto
- `*/5 * * * *` - A cada 5 minutos
- `*/15 * * * *` - A cada 15 minutos

#### 1.3. Adicionar Variável de Ambiente

```env
CRON_SECRET=seu-secret-aleatorio-aqui
```

### Opção 2: Railway (Servidor Dedicado)

Railway suporta processos de longa duração.

#### 2.1. Criar Conta no Railway

```bash
# 1. Ir para https://railway.app
# 2. Conectar com GitHub
# 3. Criar novo projeto
# 4. Selecionar repositório
```

#### 2.2. Configurar Variáveis

Adicionar as mesmas variáveis do Vercel.

#### 2.3. Deploy

```bash
# Railway faz deploy automático
# Simulação funcionará normalmente
```

**Vantagens:**
- ✅ Suporta `setInterval`
- ✅ Processo contínuo
- ✅ Simulação funciona perfeitamente

**Desvantagens:**
- ❌ Mais caro que Vercel
- ❌ Requer plano pago para produção

### Opção 3: GPS Real (Produção Final)

Substituir simulação por dados GPS reais dos autocarros.

#### 3.1. Criar Endpoint de Atualização

```typescript
// transport-client/app/api/gps/update/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { transporteId, latitude, longitude, timestamp } = await request.json();

    // Validar dados
    if (!transporteId || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Atualizar posição
    await prisma.transporte.update({
      where: { id: transporteId },
      data: {
        currGeoLocation: `${latitude},${longitude}`
      }
    });

    // Atualizar GeoLocation
    await prisma.geoLocation.updateMany({
      where: { transporteId },
      data: {
        geoLocationTransporte: `${latitude},${longitude}`,
        geoDateTime1: new Date(timestamp)
      }
    });

    // Verificar missions e notificar
    await checkMissionsForBus(transporteId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### 3.2. Dispositivos GPS Enviam Dados

```bash
# Dispositivo GPS no autocarro envia:
POST https://seu-app.vercel.app/api/gps/update
Content-Type: application/json

{
  "transporteId": "abc123",
  "latitude": -25.9734,
  "longitude": 32.5694,
  "timestamp": "2026-05-04T15:30:00Z"
}
```

---

## 🎯 Recomendação para Cada Fase

### Fase 1: MVP / Demonstração
**Usar:** Vercel + Simulação Local

```bash
# Deploy web app no Vercel
vercel --prod

# Rodar simulação localmente
npm run dev
# Manter rodando em servidor local ou VPS
```

**Vantagens:**
- ✅ Grátis
- ✅ Rápido para testar
- ✅ Web app funciona perfeitamente

**Desvantagens:**
- ❌ Simulação precisa rodar localmente

### Fase 2: Testes com Usuários
**Usar:** Vercel + Cron Jobs

```bash
# Deploy com cron
vercel --prod

# Cron atualiza a cada 1-5 minutos
```

**Vantagens:**
- ✅ Totalmente na nuvem
- ✅ Grátis (Vercel hobby plan)
- ✅ Funciona 24/7

**Desvantagens:**
- ❌ Atualização menos frequente (1-5 min)
- ❌ Menos "tempo real"

### Fase 3: Produção com GPS Real
**Usar:** Vercel + GPS Devices

```bash
# Deploy web app
vercel --prod

# Dispositivos GPS enviam dados
# Endpoint /api/gps/update recebe
```

**Vantagens:**
- ✅ Dados reais
- ✅ Tempo real verdadeiro
- ✅ Escalável

**Desvantagens:**
- ❌ Requer hardware GPS
- ❌ Custo de dispositivos

---

## 📱 Configurar USSD em Produção

### Africa's Talking

#### 1. Criar Conta de Produção

```bash
# 1. Ir para https://account.africastalking.com
# 2. Criar conta
# 3. Adicionar créditos
# 4. Obter API Key de produção
```

#### 2. Configurar USSD Code

```bash
# 1. No painel Africa's Talking
# 2. Ir para "USSD" > "Create Channel"
# 3. Escolher código (ex: *384*123#)
# 4. Configurar callback URL:
#    https://seu-app.vercel.app/api/ussd
```

#### 3. Testar USSD

```bash
# Discar do celular:
*384*123#

# Deve aparecer o menu do sistema
```

---

## 🔍 Monitoramento em Produção

### 1. Vercel Analytics

```bash
# Adicionar ao projeto
npm install @vercel/analytics

# Em app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Logs

```bash
# Ver logs no Vercel
vercel logs

# Ou no painel web:
# https://vercel.com/seu-projeto/logs
```

### 3. Sentry (Erro Tracking)

```bash
# Instalar Sentry
npm install @sentry/nextjs

# Configurar
npx @sentry/wizard -i nextjs

# Adicionar DSN no Vercel
SENTRY_DSN=https://...
```

---

## ✅ Checklist de Deploy

### Antes do Deploy:
- [ ] Código commitado no GitHub
- [ ] Variáveis de ambiente preparadas
- [ ] Banco de dados Neon funcionando
- [ ] Migrations aplicadas
- [ ] Seed executado
- [ ] Testes locais passando

### Durante o Deploy:
- [ ] Projeto conectado ao Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem-sucedido
- [ ] Deploy completo

### Após o Deploy:
- [ ] Web app acessível
- [ ] API endpoints funcionando
- [ ] Banco de dados conectado
- [ ] USSD configurado (se aplicável)
- [ ] SMS funcionando (se aplicável)
- [ ] Monitoramento ativo

---

## 🆘 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verificar DATABASE_URL no Vercel
# Testar conexão:
curl https://seu-app.vercel.app/api/buses
```

### Erro: "USSD not responding"

```bash
# Verificar callback URL no Africa's Talking
# Testar endpoint:
curl -X POST https://seu-app.vercel.app/api/ussd \
  -d "sessionId=test" \
  -d "phoneNumber=+258840000001" \
  -d "text="
```

### Erro: "SMS not sending"

```bash
# Verificar credenciais Africa's Talking
# Verificar saldo da conta
# Testar manualmente:
curl -X POST https://seu-app.vercel.app/api/test-sms \
  -d "phone=+258840000001" \
  -d "message=Teste"
```

---

## 📞 Suporte

- **Vercel:** https://vercel.com/support
- **Africa's Talking:** https://help.africastalking.com
- **Neon:** https://neon.tech/docs

---

**Última atualização:** 4 de Maio de 2026  
**Status:** ✅ Pronto para deploy
