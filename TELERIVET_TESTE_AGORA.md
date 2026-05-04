# Testar Telerivet AGORA - Guia Rápido

## ✅ Código Criado!

O endpoint `/api/ussd-telerivet` foi criado com sucesso!

---

## 🚀 PASSO 1: Reiniciar Servidor

### Terminal 1: Parar e Reiniciar
```bash
# Parar servidor (Ctrl+C)
# Depois reiniciar:
cd transport-client
npm run dev
```

**Aguardar ver:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

---

## 🌐 PASSO 2: Iniciar/Reiniciar ngrok

### Terminal 2: Reiniciar ngrok
```bash
# Parar ngrok (Ctrl+C) se estiver rodando
# Depois reiniciar:
ngrok http 3000
```

**Copiar a URL HTTPS:**
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            Copiar esta parte
```

---

## ⚙️ PASSO 3: Configurar no Telerivet

### A. Webhook URL
```
No campo "Forward message to Webhook URL:" colocar:

https://abc123.ngrok-free.app/api/ussd-telerivet
       ^^^^^^^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^^^^
       Seu código ngrok       Endpoint fixo
```

### B. Secret
```
No campo "Secret:" colocar:

TransportUSSD2024SecureKey
```

**⚠️ IMPORTANTE:** Este secret deve ser EXATAMENTE igual ao que está no `.env`!

### C. Salvar
```
Clicar: "Save" ou "Create Service"
```

### D. Ativar
```
Toggle "Active": ON (verde) ✅
```

---

## 🧪 PASSO 4: Testar

### Teste 1: Test Service (No Dashboard)
```
1. Na página do serviço, clicar: "Test Service"
2. From Number: +258840000001
3. Content: (deixar vazio)
4. Clicar: "Send Test"
```

**Resultado esperado:**
```
✅ Status: 200
✅ Response time: <2s
✅ Message: "Bem-vindo ao Sistema de Transportes..."
```

### Teste 2: Verificar Logs do Servidor
```
No terminal onde está rodando npm run dev, você deve ver:

📱 Telerivet USSD Request: {
  event: 'incoming_message',
  sessionId: 'SM123...',
  phoneNumber: '+258840000001',
  text: '',
  ...
}
📤 Telerivet USSD Response: {
  message: 'Bem-vindo ao Sistema de Transportes...',
  shouldContinue: true
}
```

### Teste 3: Testar Navegação
```
1. Test Service novamente
2. Content: "1" (Encontrar Transporte)
3. Send Test
4. Verificar resposta: "Onde você está agora?"

5. Test Service novamente
6. Content: "1*1" (Matola Sede)
7. Send Test
8. Verificar resposta: "Para onde quer ir?"
```

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### Checklist:
- [ ] Servidor rodando (npm run dev)
- [ ] ngrok rodando
- [ ] URL configurada no Telerivet
- [ ] Secret configurado no Telerivet
- [ ] Secret no .env igual ao Telerivet
- [ ] Serviço ativado (toggle ON)
- [ ] Test enviado com sucesso
- [ ] Logs aparecem no terminal
- [ ] Resposta correta recebida

---

## 🚨 Se Der Erro

### Erro: "HTTP 404"
**Problema:** Servidor não está rodando ou URL errada

**Solução:**
```bash
# Verificar servidor está rodando
# Terminal deve mostrar: ✓ Ready

# Verificar URL está correta:
https://abc123.ngrok-free.app/api/ussd-telerivet
                              ^^^^^^^^^^^^^^^^^^^^
                              Não esquecer esta parte!
```

### Erro: "HTTP 403 Forbidden"
**Problema:** Secret incorreto

**Solução:**
```
1. Verificar secret no Telerivet
2. Verificar secret no .env
3. Devem ser EXATAMENTE iguais
4. Reiniciar servidor após mudar .env
```

### Erro: "Connection refused"
**Problema:** ngrok não está rodando

**Solução:**
```bash
# Iniciar ngrok
ngrok http 3000

# Copiar nova URL
# Atualizar no Telerivet
```

### Erro: "Timeout"
**Problema:** Servidor muito lento

**Solução:**
```
1. Verificar banco de dados está acessível
2. Verificar internet está boa
3. Otimizar queries (se necessário)
```

---

## 📊 FORMATO CORRETO

### Telerivet Envia (Form Data):
```
event=incoming_message
content=1*2*3
from_number=+258840000001
secret=TransportUSSD2024SecureKey
```

### Seu Servidor Responde (JSON):
```json
{
  "messages": [{
    "content": "Bem-vindo ao Sistema de Transportes\n1. Encontrar Transporte\n2. Rotas...",
    "status": "queued"
  }],
  "continue_session": true
}
```

---

## ✅ SUCESSO!

Se o teste funcionar, você verá:

**No Telerivet Dashboard:**
```
✅ Status: 200 OK
✅ Response received
✅ Message queued
```

**No Terminal (servidor):**
```
📱 Telerivet USSD Request: {...}
📤 Telerivet USSD Response: {...}
```

**No Test Response:**
```
Bem-vindo ao Sistema de Transportes
1. Encontrar Transporte Agora
2. Procurar Rotas
3. Paragens Proximas
4. Calcular Tarifa
5. Ajuda
```

---

## 🎯 PRÓXIMOS PASSOS

Depois que funcionar no teste:

1. **Testar com telefone real:**
   - Discar código USSD do telefone gateway
   - Verificar menu aparece
   - Testar navegação completa

2. **Configurar código USSD:**
   - Contactar operadora
   - Solicitar código (ex: *384*123#)
   - Configurar no telefone gateway

3. **Monitorar:**
   - Ver logs no Telerivet
   - Ver logs no servidor
   - Verificar performance

---

## 📞 CONFIGURAÇÃO ATUAL

### Webhook URL:
```
https://SEU-NGROK-URL/api/ussd-telerivet
```

### Secret:
```
TransportUSSD2024SecureKey
```

### Arquivo .env:
```env
TELERIVET_SECRET="TransportUSSD2024SecureKey"
```

---

**Agora teste e me diga o resultado!** 🚀
