# Como Criar Serviço USSD no Telerivet - Guia Completo

## 🎯 Baseado na Documentação Oficial

Depois de investigar a documentação do Telerivet, aqui está o guia completo:

---

## 📱 PASSO 1: Acessar a Página de Adicionar Serviço

### Opção A: Via Dashboard
```
1. Login: https://telerivet.com/login
2. Selecionar seu projeto
3. Ir para: Services
4. Clicar: "Create New Service"
```

### Opção B: Link Direto
```
https://telerivet.com/p/265ab4ae/add_service
(Requer login primeiro)
```

---

## 🔧 PASSO 2: Escolher Tipo de Serviço

Você verá várias opções. **Escolha:**

### **"Webhook API"** ✅

**Por quê?**
- Permite conectar ao seu servidor
- Você controla toda a lógica
- Mais flexível
- Seu código atual pode ser adaptado

**Outras opções (NÃO escolher agora):**
- ❌ Auto-Reply (muito simples)
- ❌ Subscription (para grupos)
- ❌ Poll (para enquetes)
- ❌ Custom Actions (visual, mas limitado)
- ❌ Cloud Script (JavaScript no Telerivet, não no seu servidor)

---

## ⚙️ PASSO 3: Configurar o Serviço Webhook

Depois de clicar em "Webhook API", você verá um formulário:

### A. Nome do Serviço
```
Service Name: Transport USSD System
```

### B. Webhook URL (MAIS IMPORTANTE!)
```
Desenvolvimento (ngrok):
https://abc123.ngrok-free.app/api/ussd-telerivet

Produção (Vercel):
https://transport-app.vercel.app/api/ussd-telerivet

Produção (Domínio):
https://transport.mz/api/ussd-telerivet
```

**⚠️ IMPORTANTE:**
- URL deve começar com `https://` (não `http://`)
- Deve terminar com `/api/ussd-telerivet`
- Servidor deve estar rodando e acessível

### C. Secret (Segurança)
```
Secret: gerar_senha_forte_aqui_123456

Exemplo: TransportUSSD2024!SecureKey
```

**Para que serve:**
- Telerivet envia este secret em cada requisição
- Seu código verifica se o secret está correto
- Previne requisições falsas

**Como gerar:**
```
Opção 1: Usar gerador online
Opção 2: Criar manualmente (mínimo 20 caracteres)
Opção 3: Deixar Telerivet gerar automaticamente
```

### D. Configurações Adicionais

#### Message Filters (Filtros)
```
✅ Ativar: "Handle all incoming messages"

OU

Adicionar filtro customizado:
- Type: "Message starts with"
- Value: "*"
- Isso captura todas as mensagens USSD
```

#### Response Timeout
```
Timeout: 30 segundos (padrão)
```

#### Retry Policy
```
Max retries: 3
Retry delay: 5 segundos
```

---

## 📋 PASSO 4: Configurações Avançadas (Opcional)

### A. Enable Logging
```
✅ Log all messages
✅ Log webhook requests
✅ Log webhook responses

Retention: 30 dias
```

### B. Notification Settings
```
Email para alertas: seu_email@exemplo.com

Alertas:
✅ Webhook failing
✅ Service errors
✅ Phone disconnected
```

### C. Active Hours (Opcional)
```
Se quiser limitar horário de funcionamento:
- Start: 06:00
- End: 22:00
- Days: Segunda a Domingo

OU

Deixar 24/7 (recomendado)
```

---

## 💾 PASSO 5: Salvar e Ativar

### A. Salvar Configurações
```
Clicar: "Save" ou "Create Service"
```

### B. Ativar Serviço
```
Toggle no topo: "Active" → ON (verde) ✅
```

### C. Verificar Status
```
Status deve mostrar: "Active" ✅
```

---

## 🧪 PASSO 6: Testar o Serviço

### Teste 1: Test Message (No Dashboard)
```
1. Na página do serviço, clicar: "Test Service"
2. Preencher:
   - From Number: +258840000001
   - Content: (deixar vazio para menu principal)
3. Clicar: "Send Test"
4. Verificar resposta
```

### Teste 2: Verificar Logs
```
1. Services → Seu serviço → "View logs"
2. Verificar:
   - Requisição enviada ✅
   - Resposta recebida ✅
   - Status: 200 ✅
   - Tempo de resposta: <2s ✅
```

### Teste 3: USSD Real
```
1. Do telefone gateway, discar: *seu-codigo#
2. Verificar menu aparece
3. Testar navegação
4. Verificar logs no dashboard
```

---

## 📊 FORMATO DAS REQUISIÇÕES

### O Que Telerivet Envia (POST)
```
Content-Type: application/x-www-form-urlencoded

Parâmetros:
- event: "incoming_message"
- id: "SM123456"
- message_type: "ussd"
- content: "1*2*3" (navegação do usuário)
- from_number: "+258840000001"
- to_number: "*123#" (código USSD)
- phone_id: "PN789"
- service_id: "SV456"
- project_id: "PJ123"
- secret: "seu_secret_aqui"
- time_created: 1234567890
- contact[name]: "João Silva"
- contact[id]: "CX123"
```

### O Que Seu Servidor Deve Responder (JSON)
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "messages": [{
    "content": "Bem-vindo ao Sistema de Transportes\n1. Encontrar Transporte\n2. Rotas\n3. Paragens\n4. Tarifa\n5. Ajuda",
    "status": "queued"
  }],
  "continue_session": true
}
```

**Para terminar sessão:**
```json
{
  "messages": [{
    "content": "Obrigado por usar nosso serviço!",
    "status": "queued"
  }],
  "continue_session": false
}
```

---

## 🔐 SEGURANÇA: Verificar Secret

### No Seu Código (Importante!)
```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const secret = formData.get('secret') as string;
  
  // Verificar secret
  const WEBHOOK_SECRET = process.env.TELERIVET_SECRET;
  
  if (secret !== WEBHOOK_SECRET) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Processar requisição...
}
```

### No .env
```env
TELERIVET_SECRET="TransportUSSD2024!SecureKey"
```

---

## 📱 CONFIGURAR CÓDIGO USSD

### Opção A: Código Compartilhado (Mais Fácil)
```
Formato: *XXX*YYY#
Exemplo: *384*123#

Como conseguir:
1. Contactar operadora (Vodacom/Mcel/Movitel)
2. Solicitar código USSD compartilhado
3. Informar: "Para serviço de informação de transportes"
4. Aguardar aprovação (geralmente rápido)
5. Configurar no telefone gateway
```

### Opção B: Código Dedicado (Mais Caro)
```
Formato: *XXX#
Exemplo: *123#

Processo:
1. Contactar operadora
2. Preencher formulário
3. Pagar taxa de registro
4. Aguardar aprovação (pode demorar)
5. Pagar taxa mensal
```

### Opção C: Usar Código Existente (Teste)
```
Alguns códigos podem estar disponíveis:
*384*456#
*384*789#
*555*123#

Testar no telefone gateway para ver se funcionam
```

---

## 🔄 ORDEM DOS SERVIÇOS (Importante!)

Se tiver múltiplos serviços ativos:

### Ordem Correta:
```
1. Webhook API (seu serviço) ← PRIMEIRO
2. Auto-Reply (se tiver)
3. Outros serviços
```

### Como Ordenar:
```
1. Services page
2. Arrastar serviços para reordenar
3. Webhook deve estar no topo
4. Salvar
```

**Por quê?**
- Telerivet processa serviços em ordem
- Se Webhook não responder, passa para próximo
- Webhook deve ser primeiro para capturar tudo

---

## 📊 MONITORAMENTO

### Dashboard Overview
```
Services → Seu serviço → Overview

Ver:
- Mensagens recebidas hoje
- Mensagens enviadas
- Taxa de sucesso
- Erros recentes
```

### Message Logs
```
Services → Messages

Filtrar por:
- Data
- Número de telefone
- Status (sucesso/erro)
- Conteúdo
```

### Webhook Logs
```
Services → Webhook Logs

Ver:
- URL chamada
- Parâmetros enviados
- Resposta recebida
- Tempo de resposta
- Código HTTP
- Erros
```

### Alertas por Email
```
Settings → Notifications

Configurar:
✅ Webhook failing (3+ falhas)
✅ Service errors
✅ Phone disconnected
✅ Low credit
```

---

## 🚨 TROUBLESHOOTING

### Erro: "Webhook returned 403"
```
Problema: Secret incorreto
Solução:
1. Verificar secret no dashboard
2. Verificar secret no .env
3. Garantir que são iguais
4. Reiniciar servidor
```

### Erro: "Webhook timed out"
```
Problema: Servidor demorou >10 segundos
Solução:
1. Otimizar queries do banco
2. Adicionar cache
3. Processar assincronamente
4. Verificar latência da internet
```

### Erro: "Could not connect to webhook"
```
Problema: URL não acessível
Solução:
1. Verificar servidor está rodando
2. Testar URL no browser
3. Verificar firewall
4. Verificar ngrok está ativo
5. Verificar HTTPS (não HTTP)
```

### Erro: "Webhook returned 500"
```
Problema: Erro no código do servidor
Solução:
1. Verificar logs do servidor
2. Verificar erro específico
3. Corrigir código
4. Testar localmente
5. Deploy novamente
```

---

## ✅ CHECKLIST FINAL

### Configuração Completa:
- [ ] Serviço Webhook criado
- [ ] Nome definido
- [ ] Webhook URL configurada
- [ ] Secret definido e salvo no .env
- [ ] Filtros configurados ("*")
- [ ] Logging ativado
- [ ] Notificações configuradas
- [ ] Serviço ativado (toggle ON)
- [ ] Ordem correta (Webhook primeiro)
- [ ] Teste enviado
- [ ] Logs verificados
- [ ] USSD testado
- [ ] Código USSD definido

### Pronto para Produção:
- [ ] Webhook responde <2s
- [ ] Secret verificado
- [ ] HTTPS ativo
- [ ] Todos os menus funcionam
- [ ] Logs sem erros
- [ ] Monitoramento ativo
- [ ] Alertas configurados

---

## 🎯 RESUMO RÁPIDO

### Configuração Essencial (5 min):
```
1. Services → Create New Service
2. Escolher: "Webhook API"
3. Nome: "Transport USSD"
4. URL: https://seu-servidor.com/api/ussd-telerivet
5. Secret: gerar senha forte
6. Filtro: "*"
7. Ativar: ON
8. Testar
```

### Próximo Passo:
**Adaptar seu código para receber requisições do Telerivet!**

---

**Quer que eu crie o código adaptado agora?** 🚀

Posso criar o arquivo `/api/ussd-telerivet/route.ts` que vai:
- Receber requisições do Telerivet
- Verificar o secret
- Processar com sua lógica existente
- Responder no formato correto
