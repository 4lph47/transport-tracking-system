# 🚀 DEPLOY AGORA - Guia Rápido

**Status Atual:** ✅ Código commitado localmente  
**Próximos Passos:** GitHub → Vercel → Africa's Talking

---

## 📋 Resumo do Que Temos

✅ **Sistema completo implementado:**
- Rastreamento em tempo real (25 autocarros)
- USSD com menus dinâmicos (sem opções vazias)
- Notificações SMS automáticas
- Web app com mapa 3D
- Documentação completa (20,000+ palavras)

✅ **Commit feito:**
- 94 arquivos
- 24,954 linhas de código
- Mensagem: "Sistema de rastreamento em tempo real completo - USSD com menus dinâmicos"

---

## 🎯 3 Passos para Deploy

### PASSO 1: GitHub (5 minutos)

```bash
# 1. Criar repositório no GitHub
# Ir para: https://github.com/new
# Nome: transport-mozambique
# Visibilidade: Private
# NÃO marcar "Initialize with README"
# Clicar "Create repository"

# 2. Adicionar remote (substituir SEU-USERNAME)
git remote add origin https://github.com/SEU-USERNAME/transport-mozambique.git

# 3. Push
git push -u origin master

# Se pedir senha, usar Personal Access Token:
# https://github.com/settings/tokens
```

**Resultado esperado:**
```
✅ Código no GitHub
✅ 94 arquivos visíveis
✅ Pronto para Vercel
```

---

### PASSO 2: Vercel (10 minutos)

```bash
# 1. Instalar Vercel CLI (se não tiver)
npm i -g vercel

# 2. Login
vercel login

# 3. Ir para pasta do cliente
cd transport-client

# 4. Deploy
vercel --prod

# Responder perguntas:
# - Set up and deploy? Yes
# - Which scope? [Sua conta]
# - Link to existing project? No
# - Project name? transport-mozambique
# - Directory? ./
# - Override settings? No
```

**Configurar variáveis de ambiente:**

```bash
# Via CLI:
vercel env add DATABASE_URL production
# Colar: postgresql://neondb_owner:npg_V8x6hNkPHLEI@ep-wild-wildflower-ansvthi1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

vercel env add AFRICASTALKING_USERNAME production
# Digitar: Overlord

vercel env add AFRICASTALKING_API_KEY production
# Colar: atsk_efab8c78d30d66aca71223167c9887c7b362b9e4037b365f8d8dca2c9965a5046400e070

# Redeploy
vercel --prod
```

**Ou via Web:**
1. Ir para https://vercel.com/seu-projeto/settings/environment-variables
2. Adicionar as 3 variáveis acima
3. Fazer redeploy

**Resultado esperado:**
```
✅ Deploy bem-sucedido
✅ URL: https://transport-mozambique.vercel.app
✅ Web app funcionando
```

---

### PASSO 3: Africa's Talking (5 minutos)

```bash
# 1. Login no Africa's Talking
# https://account.africastalking.com

# 2. Ir para USSD > Create Channel
# Nome: Transportes Moçambique
# Código: *384*123# (ou disponível)
# Callback URL: https://transport-mozambique.vercel.app/api/ussd

# 3. Salvar

# 4. Testar do celular
# Discar: *384*123#
```

**Resultado esperado:**
```
✅ USSD responde
✅ Menus dinâmicos funcionam
✅ Sem opções vazias
✅ SMS de confirmação enviado
```

---

## 🧪 Testes Rápidos

### Teste 1: Web App
```bash
# Abrir no navegador
https://transport-mozambique.vercel.app

# Verificar:
✅ Mapa carrega
✅ 25 autocarros aparecem
✅ Autocarros se movem (aguardar 10s)
```

### Teste 2: API
```bash
# Substituir URL pela sua
curl https://transport-mozambique.vercel.app/api/buses
curl https://transport-mozambique.vercel.app/api/simulation
```

### Teste 3: USSD
```bash
# Do celular
Discar: *384*123#

# Fluxo:
1. Escolher "1. Encontrar Transporte Agora"
2. Escolher localização (ex: Matola Sede)
3. Escolher destino (ex: Baixa)
4. Ver informações do transporte
5. Aguardar SMS de confirmação
```

---

## 📊 Checklist Final

### GitHub:
- [ ] Repositório criado
- [ ] Remote adicionado
- [ ] Push bem-sucedido
- [ ] Código visível no GitHub

### Vercel:
- [ ] Deploy bem-sucedido
- [ ] Variáveis de ambiente configuradas
- [ ] URL obtida
- [ ] Web app funcionando

### Africa's Talking:
- [ ] Canal USSD criado
- [ ] Callback URL configurada
- [ ] Código USSD atribuído
- [ ] Testado do celular

### Funcionalidades:
- [ ] Mapa mostra 25 autocarros
- [ ] Autocarros se movem em tempo real
- [ ] USSD responde
- [ ] Menus dinâmicos (sem opções vazias)
- [ ] SMS de confirmação funciona

---

## 🎉 Sucesso!

Se todos os itens acima estão marcados:

✅ **Sistema deployado**  
✅ **USSD funcionando**  
✅ **Pronto para produção**

---

## 📞 URLs Importantes

### Desenvolvimento:
- **Código:** https://github.com/SEU-USERNAME/transport-mozambique
- **Documentação:** Ver arquivos `.md` no repositório

### Produção:
- **Web App:** https://transport-mozambique.vercel.app
- **API USSD:** https://transport-mozambique.vercel.app/api/ussd
- **Painel Vercel:** https://vercel.com/seu-projeto
- **Painel Africa's Talking:** https://account.africastalking.com

### Código USSD:
- **Discar:** *384*123# (ou o código atribuído)

---

## 📚 Documentação de Referência

- **Deploy completo:** `DEPLOY_CHECKLIST.md`
- **Push GitHub:** `GITHUB_PUSH_GUIDE.md`
- **Sistema completo:** `REAL_TIME_SYSTEM_COMPLETE.md`
- **Menus dinâmicos:** `USSD_DYNAMIC_MENUS_FIX.md`
- **Início rápido:** `QUICK_START.md`

---

## ⚠️ Notas Importantes

### Simulação no Vercel:
⚠️ **A simulação não funciona em serverless (Vercel)**

**Soluções:**
1. **Opção A:** Usar Vercel Cron Jobs (ver `DEPLOYMENT_GUIDE.md`)
2. **Opção B:** Migrar para Railway (servidor dedicado)
3. **Opção C:** Usar GPS real (sem simulação)

Para MVP/demonstração, a simulação pode rodar localmente enquanto o resto está no Vercel.

### Credenciais:
- **Sandbox:** Já configurado (para testes)
- **Produção:** Usar credenciais "Overlord" (já no guia)

---

## 🚀 Comandos Rápidos

```bash
# GitHub
git remote add origin https://github.com/SEU-USERNAME/transport-mozambique.git
git push -u origin master

# Vercel
cd transport-client
vercel --prod

# Testar
curl https://sua-url.vercel.app/api/buses
```

---

**Data:** 4 de Maio de 2026  
**Status:** ✅ Pronto para deploy  
**Tempo estimado:** 20 minutos total  
**Próximo passo:** Criar repositório no GitHub
