# 🚀 Deploy no Vercel - AGORA

**Status:** ✅ Código no GitHub  
**URL GitHub:** https://github.com/4lph47/transport-tracking-system  
**Próximo:** Deploy no Vercel

---

## ✅ GitHub - COMPLETO

```
✅ Push bem-sucedido
✅ 97 objetos enviados
✅ Branch master criado
✅ Código visível em: https://github.com/4lph47/transport-tracking-system
```

---

## 🚀 PASSO 1: Deploy no Vercel

### Opção A: Via Web (Mais Fácil)

1. **Ir para Vercel:**
   ```
   https://vercel.com/new
   ```

2. **Importar Repositório:**
   - Clicar em "Import Git Repository"
   - Selecionar: `4lph47/transport-tracking-system`
   - Clicar em "Import"

3. **Configurar Projeto:**
   ```
   Project Name: transport-mozambique
   Framework Preset: Next.js
   Root Directory: transport-client
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Adicionar Variáveis de Ambiente:**
   
   Clicar em "Environment Variables" e adicionar:

   | Nome | Valor |
   |------|-------|
   | `DATABASE_URL` | `postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
   | `AFRICASTALKING_USERNAME` | `Overlord` |
   | `AFRICASTALKING_API_KEY` | `atsk_efab8c78d30d66aca71223167c9887c7b362b9e4037b365f8d8dca2c9965a5046400e070` |
   | `TELERIVET_SECRET` | `TransportUSSD2024SecureKey` |

5. **Deploy:**
   - Clicar em "Deploy"
   - Aguardar build (2-3 minutos)

### Opção B: Via CLI (Alternativa)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Ir para pasta do cliente
cd transport-client

# 4. Deploy
vercel

# Responder:
# - Set up and deploy? Yes
# - Which scope? [Sua conta]
# - Link to existing project? No
# - Project name? transport-mozambique
# - Directory? ./
# - Override settings? No

# 5. Adicionar variáveis de ambiente
vercel env add DATABASE_URL production
# Colar: postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

vercel env add AFRICASTALKING_USERNAME production
# Digitar: Overlord

vercel env add AFRICASTALKING_API_KEY production
# Colar: atsk_efab8c78d30d66aca71223167c9887c7b362b9e4037b365f8d8dca2c9965a5046400e070

vercel env add TELERIVET_SECRET production
# Digitar: TransportUSSD2024SecureKey

# 6. Deploy para produção
vercel --prod
```

---

## 📋 Variáveis de Ambiente (Copiar/Colar)

### DATABASE_URL
```
postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### AFRICASTALKING_USERNAME
```
Overlord
```

### AFRICASTALKING_API_KEY
```
atsk_efab8c78d30d66aca71223167c9887c7b362b9e4037b365f8d8dca2c9965a5046400e070
```

### TELERIVET_SECRET
```
TransportUSSD2024SecureKey
```

---

## 🌐 PASSO 2: Obter URL do Vercel

Após o deploy, você receberá uma URL como:

```
✅ Production: https://transport-mozambique.vercel.app
```

**OU**

```
✅ Production: https://transport-tracking-system.vercel.app
```

**COPIAR ESTA URL!** Você vai precisar para o Africa's Talking.

---

## 🧪 PASSO 3: Testar Deploy

### Teste 1: Web App
```bash
# Abrir no navegador (substituir pela sua URL)
https://transport-mozambique.vercel.app

# Verificar:
✅ Mapa carrega
✅ 25 autocarros aparecem
✅ Autocarros se movem (aguardar 10s)
```

### Teste 2: API Endpoints
```bash
# Substituir URL pela sua
export VERCEL_URL="https://transport-mozambique.vercel.app"

# Testar autocarros
curl $VERCEL_URL/api/buses

# Testar simulação
curl $VERCEL_URL/api/simulation

# Testar startup
curl $VERCEL_URL/api/startup

# Testar USSD
curl -X POST $VERCEL_URL/api/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123" \
  -d "serviceCode=*384*123#" \
  -d "phoneNumber=+258840000001" \
  -d "text="
```

**Resultado esperado:**
```json
{
  "buses": [...],
  "count": 25
}
```

---

## 📱 PASSO 4: Configurar Africa's Talking

### 4.1. Login
```
https://account.africastalking.com
```

### 4.2. Criar Canal USSD

1. Menu lateral: **"USSD"**
2. Clicar em **"Create Channel"**
3. Preencher:
   ```
   Channel Name: Transportes Moçambique
   USSD Code: *384*123# (ou código disponível)
   Callback URL: https://SUA-URL.vercel.app/api/ussd
   ```
4. Clicar em **"Create"**

### 4.3. Testar USSD

**Do celular:**
```
Discar: *384*123#
```

**Resultado esperado:**
```
Bem-vindo ao Sistema de Transportes
1. Encontrar Transporte Agora
2. Procurar Rotas
3. Paragens Próximas
4. Calcular Tarifa
5. Ajuda
```

---

## ✅ Checklist de Deploy

### Vercel:
- [ ] Deploy bem-sucedido
- [ ] Variáveis de ambiente configuradas
- [ ] URL obtida
- [ ] Web app carrega
- [ ] API endpoints funcionam

### Africa's Talking:
- [ ] Canal USSD criado
- [ ] Callback URL configurada
- [ ] Código USSD atribuído
- [ ] Testado do celular

### Funcionalidades:
- [ ] Mapa mostra 25 autocarros
- [ ] Autocarros se movem
- [ ] USSD responde
- [ ] Menus dinâmicos (sem opções vazias)
- [ ] SMS de confirmação funciona

---

## 🎯 URLs Finais

### Produção:
- **Web App:** https://SUA-URL.vercel.app
- **API USSD:** https://SUA-URL.vercel.app/api/ussd
- **GitHub:** https://github.com/4lph47/transport-tracking-system

### Painéis:
- **Vercel:** https://vercel.com/seu-projeto
- **Africa's Talking:** https://account.africastalking.com
- **Neon Database:** https://console.neon.tech

---

## ⚠️ Nota Importante: Simulação

A simulação de autocarros **NÃO funciona em serverless (Vercel)**.

**Soluções:**

1. **Para MVP/Demo:** Rodar simulação localmente
   ```bash
   cd transport-client
   npm run dev
   # Manter rodando em segundo plano
   ```

2. **Para Produção:** Usar uma das opções:
   - Vercel Cron Jobs (ver `DEPLOYMENT_GUIDE.md`)
   - Migrar para Railway (servidor dedicado)
   - Usar GPS real (sem simulação)

---

## 🚀 Comandos Rápidos

```bash
# Deploy via CLI
cd transport-client
vercel --prod

# Testar
curl https://sua-url.vercel.app/api/buses

# Ver logs
vercel logs
```

---

## 🎉 Próximo Passo

**AGORA:** Ir para https://vercel.com/new e fazer o deploy!

Após o deploy, voltar aqui e atualizar o Africa's Talking com a URL do Vercel.

---

**Data:** 4 de Maio de 2026  
**GitHub:** ✅ Completo  
**Vercel:** ⏳ Aguardando deploy  
**Africa's Talking:** ⏳ Aguardando URL do Vercel
