# Telerivet - Setup Rápido (10 Minutos)

## 🎯 Configurações Principais

### 1️⃣ CRIAR CONTA (2 min)
```
🌐 https://telerivet.com/
→ Sign Up
→ Email + Senha
→ Confirmar email
→ Start Free Trial (14 dias grátis)
```

---

### 2️⃣ PREPARAR TELEFONE (3 min)
```
📱 Telefone Android:
→ Inserir SIM card
→ Conectar WiFi
→ Verificar crédito
→ Testar USSD: discar *100#
```

---

### 3️⃣ INSTALAR APP (2 min)
```
📲 No Android:
→ Play Store
→ Procurar: "Telerivet"
→ Instalar: "Telerivet Android Gateway"
→ Abrir app
→ Login (mesmo email/senha)
→ Permitir todas as permissões
→ Aguardar: "Connected" ✅
```

---

### 4️⃣ CONFIGURAR DASHBOARD (3 min)

#### A. Criar Projeto
```
🌐 Dashboard → Projects
→ Create New Project
→ Nome: "Transport System"
→ Create
```

#### B. Adicionar Telefone
```
→ Phones → Add Phone
→ Selecionar seu Android
→ Add to Project
```

#### C. Criar Serviço USSD
```
→ Services → Create New Service
→ Type: "Incoming Message"
→ Nome: "Transport USSD"
→ Create
```

#### D. Configurar Webhook (IMPORTANTE!)
```
→ Service Settings
→ Webhook URL: https://seu-servidor.com/api/ussd-telerivet
   
   (Se usando ngrok):
   https://abc123.ngrok-free.app/api/ussd-telerivet

→ Method: POST
→ Format: JSON
→ Save
```

#### E. Configurar Filtro
```
→ Message Filters
→ Add Filter:
   Type: "Message starts with"
   Value: "*"
→ Save
```

#### F. Ativar Serviço
```
→ Toggle "Active": ON ✅
→ Save Changes
```

---

## ⚙️ Configurações Detalhadas

### WEBHOOK URL
```
Desenvolvimento (ngrok):
https://abc123.ngrok-free.app/api/ussd-telerivet

Produção (Vercel):
https://transport-app.vercel.app/api/ussd-telerivet

Produção (Domínio próprio):
https://transport.mz/api/ussd-telerivet
```

### FORMATO DA REQUISIÇÃO
Telerivet envia JSON assim:
```json
{
  "id": "SM123456",
  "phone_id": "PN789",
  "from_number": "+258840000001",
  "content": "1*2*3",
  "event": "ussd_session",
  "session_id": "SESSION_ABC123"
}
```

### FORMATO DA RESPOSTA
Seu servidor deve responder JSON assim:
```json
{
  "messages": [{
    "content": "Bem-vindo ao Sistema de Transportes\n1. Encontrar Transporte\n2. Rotas",
    "status": "queued"
  }],
  "continue_session": true
}
```

---

## 🔧 Configurações Opcionais (Recomendadas)

### 1. Session Timeout
```
Services → Settings
→ Session Timeout: 30 segundos
→ Save
```

### 2. Webhook Retry
```
Services → Settings → Advanced
→ Max retries: 3
→ Retry delay: 5 segundos
→ Save
```

### 3. Logging
```
Services → Settings → Logging
→ Log all messages: ON ✅
→ Log webhook requests: ON ✅
→ Save
```

### 4. Notificações
```
Settings → Notifications
→ Email: seu_email@exemplo.com
→ Alertas:
   ✅ Phone disconnected
   ✅ Webhook failing
   ✅ Low credit
→ Save
```

### 5. Segurança (Opcional)
```
Services → Settings → Security
→ Webhook Authentication: ON
→ Generate Secret Key
→ Copiar chave (usar no código)
→ Require HTTPS: ON
→ Save
```

---

## 📱 Configurações do Android

### No Telefone Gateway:

#### 1. Economia de Bateria
```
Settings → Battery → Telerivet
→ Battery optimization: OFF
→ Background activity: ON
```

#### 2. Auto-Start
```
Settings → Apps → Telerivet
→ Auto-start: ON
→ Run in background: ON
```

#### 3. Dados Móveis
```
Settings → Network
→ Mobile data: ON
→ Data saver: OFF (para Telerivet)
```

#### 4. Manter Ligado
```
Settings → Display
→ Screen timeout: Never (ou máximo)
→ Stay awake when charging: ON
```

---

## 🧪 TESTAR CONFIGURAÇÃO

### Teste 1: Verificar Conexão
```
Dashboard → Phones
→ Status deve ser: "Connected" (verde) ✅
```

### Teste 2: Enviar Teste
```
Services → Test
→ Send Test Message
→ Verificar logs do servidor
```

### Teste 3: USSD Real
```
De outro telefone:
→ Discar: *seu-codigo#
→ Deve aparecer menu
→ Testar navegação
```

### Teste 4: Ver Logs
```
Services → Messages
→ Ver todas as mensagens
→ Verificar webhooks
→ Checar erros
```

---

## 🎯 CONFIGURAÇÃO MÍNIMA (Essencial)

Se tiver pouco tempo, configure APENAS isso:

```
✅ 1. Criar conta Telerivet
✅ 2. Instalar app no Android
✅ 3. Conectar telefone
✅ 4. Criar serviço
✅ 5. Configurar webhook URL
✅ 6. Ativar serviço
✅ 7. Testar
```

**Tempo total: ~10 minutos**

---

## 📊 VALORES RECOMENDADOS

### Webhook Settings
```
URL: https://seu-servidor.com/api/ussd-telerivet
Method: POST
Format: JSON
Timeout: 30 segundos
Retries: 3
```

### Session Settings
```
Session Timeout: 30 segundos
Max Concurrent: 100
```

### Phone Settings
```
Auto-start: ON
Keep connected: ON
Battery optimization: OFF
```

### Logging
```
Log messages: ON
Log webhooks: ON
Retention: 30 dias
```

---

## 🚨 PROBLEMAS COMUNS

### ❌ Telefone Desconectado
```
Solução:
1. Verificar internet
2. Reabrir app Telerivet
3. Reiniciar telefone
```

### ❌ Webhook Não Funciona
```
Solução:
1. Verificar URL está correta
2. Testar URL no browser
3. Verificar servidor rodando
4. Checar logs Telerivet
```

### ❌ USSD Não Responde
```
Solução:
1. Verificar filtro configurado: "*"
2. Verificar serviço ativo
3. Testar USSD no telefone gateway
4. Verificar crédito no SIM
```

---

## ✅ CHECKLIST RÁPIDO

Antes de testar, verificar:

**Conta:**
- [ ] Conta criada
- [ ] Trial ativado

**Telefone:**
- [ ] SIM inserido
- [ ] Crédito OK
- [ ] Internet OK
- [ ] App instalado
- [ ] Status: Connected

**Dashboard:**
- [ ] Projeto criado
- [ ] Telefone adicionado
- [ ] Serviço criado
- [ ] Webhook configurado
- [ ] Filtro: "*"
- [ ] Serviço ativo

**Teste:**
- [ ] Teste enviado
- [ ] Logs verificados
- [ ] USSD testado

---

## 🎯 PRÓXIMO PASSO

Agora você precisa **adaptar seu código** para receber requisições do Telerivet!

**Quer que eu crie o código adaptado?** 🚀

---

## 📞 LINKS ÚTEIS

- **Dashboard:** https://telerivet.com/dashboard
- **Documentação:** https://telerivet.com/help
- **API Docs:** https://telerivet.com/api
- **Support:** support@telerivet.com

---

**Tempo total de configuração: ~10-15 minutos** ⏱️
