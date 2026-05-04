# 🔧 Atualizar Variáveis de Ambiente no Vercel

**Objetivo:** Configurar credenciais corretas do Africa's Talking

---

## 🎯 PASSO 1: Atualizar no Vercel

### Via Web (Recomendado):

1. **Ir para:**
   ```
   https://vercel.com/[seu-usuario]/transport-tracking-system/settings/environment-variables
   ```

2. **Editar estas variáveis:**

   **AFRICASTALKING_USERNAME:**
   - Clicar no ícone de editar (lápis) ✏️
   - Usar o valor do seu arquivo `.env` local
   - Salvar

   **AFRICASTALKING_API_KEY:**
   - Clicar no ícone de editar (lápis) ✏️
   - Usar o valor do seu arquivo `.env` local
   - Salvar

3. **Fazer Redeploy:**
   - Ir para aba "Deployments"
   - Clicar nos 3 pontinhos (...) do último deployment
   - Clicar em "Redeploy"
   - Aguardar 1-2 minutos

---

## 📱 PASSO 2: Configurar Africa's Talking

### 1. Login

```
https://account.africastalking.com
Username: [seu username]
```

### 2. Criar/Atualizar Canal USSD

1. Menu lateral: **USSD**
2. Clicar em **"Create Channel"**
3. Preencher:
   - **Channel Name:** `Transportes Moçambique`
   - **USSD Code:** `*384*123#` (ou código disponível)
   - **Callback URL:** `https://transport-tracking-system.vercel.app/api/ussd`
4. Salvar

---

## 🧪 PASSO 3: Testar

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

## ⚠️ Segurança

**NUNCA compartilhe:**
- ❌ API Keys
- ❌ Database URLs
- ❌ Senhas
- ❌ Tokens

**Sempre use:**
- ✅ Variáveis de ambiente
- ✅ Arquivos `.env` (no `.gitignore`)
- ✅ Secrets do Vercel

---

**Próxima ação:** Atualizar variáveis no Vercel usando valores do seu `.env` local
