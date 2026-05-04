# ✅ Checklist de Deploy - Vercel + Africa's Talking

**Data:** 4 de Maio de 2026  
**Objetivo:** Deploy no Vercel e configurar USSD no Africa's Talking

---

## 📋 Pré-Deploy Checklist

### 1. Verificar Arquivos Essenciais

- [x] `.env` configurado com DATABASE_URL
- [x] `.env` com credenciais Africa's Talking
- [x] `package.json` com todas as dependências
- [x] `prisma/schema.prisma` atualizado
- [x] Migrations aplicadas localmente
- [x] Seed executado com sucesso

### 2. Testar Localmente

```bash
# Iniciar servidor
cd transport-client
npm run dev

# Testar endpoints principais
curl http://localhost:3000/api/buses
curl http://localhost:3000/api/simulation
curl -X POST http://localhost:3000/api/ussd -d "text="
```

### 3. Verificar .gitignore

```bash
# Verificar se .env está no .gitignore
cat .gitignore | grep .env
```

✅ **Resultado esperado:** `.env` deve estar listado

---

## 🚀 Passo 2: Deploy no Vercel

### Opção A: Via CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI (se não tiver)
npm i -g vercel

# 2. Login no Vercel
vercel login

# 3. Deploy (primeira vez)
cd transport-client
vercel

# Responder perguntas:
# - Set up and deploy? Yes
# - Which scope? [Sua conta]
# - Link to existing project? No
# - Project name? transport-mozambique
# - Directory? ./
# - Override settings? No

# 4. Deploy para produção
vercel --prod
```

### Opção B: Via Web (Alternativa)

1. Ir para https://vercel.com
2. Clicar em "New Project"
3. Importar repositório do GitHub
4. Selecionar `transport-client` como root directory
5. Clicar em "Deploy"

---

## 🔧 Passo 3: Configurar Variáveis de Ambiente no Vercel

### Via CLI:

```bash
# Database
vercel env add DATABASE_URL production
# Colar: postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Africa's Talking - Production
vercel env add AFRICASTALKING_USERNAME production
# Digitar: Overlord

vercel env add AFRICASTALKING_API_KEY production
# Colar: atsk_efab8c78d30d66aca71223167c9887c7b362b9e4037b365f8d8dca2c9965a5046400e070

# Telerivet
vercel env add TELERIVET_SECRET production
# Digitar: TransportUSSD2024SecureKey
```

### Via Web:

1. Ir para https://vercel.com/seu-projeto/settings/environment-variables
2. Adicionar cada variável:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_V8x6hNkPHLEI@...` | Production |
| `AFRICASTALKING_USERNAME` | `Overlord` | Production |
| `AFRICASTALKING_API_KEY` | `atsk_efab8c78d30d66aca71223167c9887c7...` | Production |
| `TELERIVET_SECRET` | `TransportUSSD2024SecureKey` | Production |

3. Clicar em "Save"
4. Fazer redeploy: `vercel --prod`

---

## 🌐 Passo 4: Obter URL do Vercel

Após o deploy, você receberá uma URL como:

```
✅ Production: https://transport-mozambique.vercel.app
```

**Copiar esta URL!** Você vai precisar dela para o Africa's Talking.

---

## 📱 Passo 5: Configurar Africa's Talking

### 5.1. Login no Africa's Talking

1. Ir para https://account.africastalking.com
2. Fazer login com suas credenciais
3. Selecionar "Overlord" (seu username de produção)

### 5.2. Criar Canal USSD

1. No menu lateral, clicar em **"USSD"**
2. Clicar em **"Create Channel"**
3. Preencher formulário:

```
Channel Name: Transportes Moçambique
USSD Code: *384*123# (ou código disponível)
Callback URL: https://transport-mozambique.vercel.app/api/ussd
```

4. Clicar em **"Create"**

### 5.3. Configurar Callback URL

Se já tiver um canal criado:

1. Ir para **USSD** > **Channels**
2. Clicar no canal "Transportes Moçambique"
3. Atualizar **Callback URL**:
   ```
   https://transport-mozambique.vercel.app/api/ussd
   ```
4. Clicar em **"Save"**

### 5.4. Testar USSD

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

## 🧪 Passo 6: Testes de Produção

### 6.1. Testar API Endpoints

```bash
# Substituir URL pela sua URL do Vercel
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

### 6.2. Testar Web App

```bash
# Abrir no navegador
open https://transport-mozambique.vercel.app
```

**Verificar:**
- ✅ Mapa carrega
- ✅ 25 autocarros aparecem
- ✅ Autocarros se movem (aguardar 10s)
- ✅ Clicar em autocarro mostra rota

### 6.3. Testar USSD do Celular

```
1. Discar *384*123#
2. Escolher "1. Encontrar Transporte Agora"
3. Escolher localização
4. Escolher destino
5. Ver informações do transporte
6. Aguardar SMS de confirmação
```

---

## 🔍 Passo 7: Monitoramento

### 7.1. Ver Logs no Vercel

```bash
# Via CLI
vercel logs

# Ou via web
# https://vercel.com/seu-projeto/logs
```

### 7.2. Ver Logs do Africa's Talking

1. Ir para https://account.africastalking.com
2. Menu **"USSD"** > **"Logs"**
3. Ver requisições e respostas

### 7.3. Verificar Banco de Dados

```bash
# Conectar ao Prisma Studio
cd transport-client
npx prisma studio

# Verificar tabelas:
# - Transporte (25 autocarros)
# - Via (18 rotas)
# - Paragem (32 paragens)
# - MISSION (missions criadas via USSD)
```

---

## ⚠️ Troubleshooting

### Problema 1: Deploy falha

**Erro:** `Build failed`

**Solução:**
```bash
# Verificar se build funciona localmente
npm run build

# Se funcionar, fazer deploy novamente
vercel --prod
```

### Problema 2: USSD não responde

**Erro:** Nenhuma resposta ao discar código

**Verificar:**
1. Callback URL está correto no Africa's Talking
2. URL termina com `/api/ussd` (sem barra final)
3. Endpoint está acessível:
   ```bash
   curl -X POST https://sua-url.vercel.app/api/ussd -d "text="
   ```

### Problema 3: Erro de banco de dados

**Erro:** `Can't reach database server`

**Solução:**
1. Verificar `DATABASE_URL` no Vercel
2. Testar conexão:
   ```bash
   curl https://sua-url.vercel.app/api/buses
   ```
3. Se falhar, verificar variável de ambiente

### Problema 4: SMS não chegam

**Erro:** Notificações não são enviadas

**Verificar:**
1. Credenciais Africa's Talking corretas
2. Saldo da conta Africa's Talking
3. Logs do Vercel para erros de SMS

### Problema 5: Simulação não funciona

**Nota:** Simulação não funciona em serverless (Vercel)

**Soluções:**
1. **Opção A:** Usar Vercel Cron (ver `DEPLOYMENT_GUIDE.md`)
2. **Opção B:** Migrar para Railway
3. **Opção C:** Usar GPS real (sem simulação)

---

## 📊 Checklist Final

### Deploy:
- [ ] Código no GitHub
- [ ] Deploy no Vercel bem-sucedido
- [ ] Variáveis de ambiente configuradas
- [ ] URL do Vercel obtida

### Africa's Talking:
- [ ] Canal USSD criado
- [ ] Callback URL configurada
- [ ] Código USSD atribuído
- [ ] Testado do celular

### Testes:
- [ ] API endpoints funcionando
- [ ] Web app carrega
- [ ] Autocarros aparecem no mapa
- [ ] USSD responde
- [ ] Menus dinâmicos funcionam
- [ ] Sem opções vazias

### Monitoramento:
- [ ] Logs do Vercel acessíveis
- [ ] Logs do Africa's Talking acessíveis
- [ ] Banco de dados acessível

---

## 🎉 Sucesso!

Se todos os itens acima estão marcados, seu sistema está:

✅ **Deployado no Vercel**  
✅ **Conectado ao Africa's Talking**  
✅ **USSD funcionando**  
✅ **Menus dinâmicos ativos**  
✅ **Pronto para uso em produção**

---

## 📞 Informações Importantes

### URLs:
- **Web App:** https://transport-mozambique.vercel.app
- **API USSD:** https://transport-mozambique.vercel.app/api/ussd
- **Painel Vercel:** https://vercel.com/seu-projeto
- **Painel Africa's Talking:** https://account.africastalking.com

### Credenciais:
- **Vercel:** [Sua conta]
- **Africa's Talking:** Username: Overlord
- **Neon Database:** [Já configurado]

### Código USSD:
- **Código:** *384*123# (ou o que foi atribuído)

---

**Data:** 4 de Maio de 2026  
**Status:** ✅ Pronto para deploy  
**Próximo passo:** Executar comandos de deploy
