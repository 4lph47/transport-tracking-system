# 🚀 Quick Start - Sistema de Transportes

**Tempo estimado:** 5 minutos  
**Pré-requisitos:** Node.js 18+, npm

---

## ⚡ Início Rápido

### 1. Instalar Dependências

```bash
cd transport-client
npm install
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado com:
- ✅ Banco de dados Neon
- ✅ Credenciais Africa's Talking (sandbox)
- ✅ Telerivet secret

**Nenhuma ação necessária!** 🎉

### 3. Aplicar Migrations (se necessário)

```bash
npx prisma migrate deploy
```

### 4. Seed do Banco de Dados (se necessário)

```bash
npx prisma db seed
```

Isso criará:
- 25 autocarros
- 18 rotas
- 32 paragens
- 25 motoristas
- 25 GeoLocations
- 6 missions de exemplo
- 3 usuários de teste

### 5. Iniciar o Servidor

```bash
npm run dev
```

### 6. Abrir o App

```
http://localhost:3000
```

**Pronto!** 🎉

Você verá:
- ✅ Mapa com 25 autocarros
- ✅ Autocarros se movendo automaticamente
- ✅ Atualização a cada 10 segundos
- ✅ Simulação rodando em background

---

## 🧪 Testar Funcionalidades

### 1. Ver Autocarros no Mapa

```
1. Abrir http://localhost:3000
2. Ver 25 autocarros no mapa
3. Aguardar 10 segundos
4. Ver autocarros se movendo
5. Clicar em autocarro para ver rota
```

### 2. Testar USSD API

```bash
# Menu principal
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123" \
  -d "serviceCode=*123#" \
  -d "phoneNumber=+258840000001" \
  -d "text="

# Encontrar transporte (1 → 1 → 1)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123" \
  -d "serviceCode=*123#" \
  -d "phoneNumber=+258840000001" \
  -d "text=1*1*1"
```

### 3. Ver Status da Simulação

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

### 4. Ver Autocarros via API

```bash
curl http://localhost:3000/api/buses
```

### 5. Controlar Simulação

```bash
# Parar
curl -X POST http://localhost:3000/api/simulation \
  -H "Content-Type: application/json" \
  -d '{"action": "stop"}'

# Iniciar
curl -X POST http://localhost:3000/api/simulation \
  -H "Content-Type: application/json" \
  -d '{"action": "start", "interval": 30000}'
```

---

## 🎯 Funcionalidades Principais

### 1. Rastreamento em Tempo Real ✅
- Autocarros se movem automaticamente
- Atualização a cada 30 segundos
- Visualização no mapa a cada 10 segundos

### 2. Notificações SMS ✅
- Usuário cria mission via USSD
- Sistema detecta quando autocarro está próximo
- Envia SMS automaticamente

### 3. Interface USSD ✅
- Menu interativo
- Busca de transportes
- Informações em tempo real
- Criação de missions

### 4. Web App ✅
- Mapa 3D interativo
- 25 autocarros em tempo real
- Visualização de rotas
- Localização do usuário

---

## 📱 Testar com Celular

### 1. Expor Servidor Localmente

```bash
# Opção A: ngrok
ngrok http 3000

# Opção B: localtunnel
npx localtunnel --port 3000
```

### 2. Configurar USSD

```
1. Copiar URL pública (ex: https://abc123.ngrok.io)
2. Ir para Africa's Talking dashboard
3. Configurar callback URL: https://abc123.ngrok.io/api/ussd
4. Discar código USSD do celular
```

---

## 🔍 Verificar Logs

### Console do Servidor

```
🚌 Inicializando posições dos autocarros...
✅ 25 autocarros inicializados
🚀 Iniciando simulação de autocarros (intervalo: 30000ms)
🔄 Atualizando posições de 25 autocarros...
✅ Posições atualizadas
```

### Browser Console

```
Simulation initialized: { success: true, status: { running: true, busCount: 25 } }
Fetched buses: { buses: [...] }
Bus AAA-1234-MP: lat=-25.9734, lng=32.5694
```

---

## 🗄️ Acessar Banco de Dados

### Prisma Studio

```bash
npx prisma studio
```

Abre interface visual em `http://localhost:5555`

### Ver Tabelas

```
- Transporte (25 autocarros)
- Via (18 rotas)
- Paragem (32 paragens)
- Motorista (25 motoristas)
- GeoLocation (25 posições)
- MISSION (missions ativas)
- Utente (usuários)
```

---

## 🎨 Painel Admin

### Acessar

```
http://localhost:3000/admin
```

**Credenciais de teste:**
```
Email: admin@transporte.mz
Senha: admin123
```

### Funcionalidades

- ✅ Ver todos os autocarros
- ✅ Adicionar/editar autocarros
- ✅ Gerenciar rotas
- ✅ Gerenciar motoristas
- ✅ Ver missions ativas
- ✅ Controlar simulação

---

## 🚨 Troubleshooting

### Erro: "Port 3000 already in use"

```bash
# Matar processo na porta 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta:
PORT=3001 npm run dev
```

### Erro: "Database connection failed"

```bash
# Verificar .env
cat .env | grep DATABASE_URL

# Testar conexão
npx prisma db pull
```

### Erro: "Simulation not starting"

```bash
# Ver logs no console
# Verificar endpoint:
curl http://localhost:3000/api/startup

# Reiniciar servidor:
# Ctrl+C e npm run dev novamente
```

### Autocarros não aparecem no mapa

```bash
# Verificar se há autocarros no banco:
npx prisma studio
# Abrir tabela Transporte

# Se vazio, rodar seed:
npx prisma db seed

# Verificar API:
curl http://localhost:3000/api/buses
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

1. **Sistema Completo:** `REAL_TIME_SYSTEM_COMPLETE.md`
2. **Deploy:** `DEPLOYMENT_GUIDE.md`
3. **Status:** `PROJECT_STATUS_SUMMARY.md`
4. **Implementação:** `REAL_TIME_TRACKING_IMPLEMENTATION.md`

---

## ✅ Checklist de Verificação

Após iniciar, verificar:

- [ ] Servidor rodando em http://localhost:3000
- [ ] Mapa carrega corretamente
- [ ] 25 autocarros aparecem no mapa
- [ ] Console mostra "Simulation initialized"
- [ ] Após 10s, autocarros se movem
- [ ] API `/api/buses` retorna dados
- [ ] API `/api/simulation` mostra status
- [ ] Prisma Studio abre (porta 5555)
- [ ] Banco de dados tem 25 autocarros

---

## 🎉 Pronto!

Seu sistema está rodando! 🚀

**Próximos passos:**
1. Explorar o mapa
2. Testar USSD API
3. Ver painel admin
4. Fazer deploy (ver `DEPLOYMENT_GUIDE.md`)

---

**Tempo total:** ~5 minutos  
**Dificuldade:** ⭐ Fácil  
**Status:** ✅ Pronto para usar
