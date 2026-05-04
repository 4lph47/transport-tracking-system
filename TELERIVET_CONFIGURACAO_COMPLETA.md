# Configuração Completa do Telerivet - Guia Passo a Passo

## 📱 PARTE 1: Preparação (Antes de Começar)

### O Que Você Precisa:
- [ ] Telefone Android (Android 4.0+)
- [ ] SIM card (Vodacom, Mcel ou Movitel)
- [ ] Crédito no SIM (para USSD e dados)
- [ ] WiFi ou dados móveis
- [ ] Carregador para deixar telefone ligado
- [ ] Email para criar conta

---

## 🌐 PARTE 2: Criar Conta no Telerivet

### Passo 1: Registrar-se
```
1. Ir para: https://telerivet.com/
2. Clicar: "Sign Up" (canto superior direito)
3. Preencher:
   - Email: seu_email@exemplo.com
   - Password: (senha forte)
   - Nome da organização: "Transport System" (ou seu nome)
4. Clicar: "Create Account"
5. Verificar email e confirmar conta
```

### Passo 2: Fazer Login
```
1. Ir para: https://telerivet.com/login
2. Entrar com email e senha
3. Você verá o Dashboard
```

### Passo 3: Iniciar Trial Gratuito
```
1. No dashboard, clicar: "Start Free Trial"
2. Escolher plano: "Basic" ($19/mês - 14 dias grátis)
3. Não precisa cartão de crédito para trial
4. Confirmar
```

---

## 📱 PARTE 3: Configurar Telefone Android

### Passo 1: Preparar o Telefone
```
1. Inserir SIM card no telefone
2. Ligar o telefone
3. Conectar à WiFi (ou ativar dados móveis)
4. Verificar que tem crédito no SIM
5. Testar que USSD funciona:
   - Discar: *100# (ou outro código da operadora)
   - Se aparecer menu, USSD está ativo ✅
```

### Passo 2: Instalar App Telerivet
```
1. Abrir Google Play Store no Android
2. Procurar: "Telerivet"
3. Instalar: "Telerivet Android Gateway"
4. Abrir o app
```

### Passo 3: Conectar App à Conta
```
1. No app Telerivet, clicar: "Sign In"
2. Entrar com mesmo email/senha da conta web
3. App vai pedir permissões:
   - SMS: Permitir ✅
   - Telefone: Permitir ✅
   - Localização: Permitir ✅ (opcional)
4. App vai sincronizar automaticamente
5. Você verá: "Connected" ✅
```

### Passo 4: Verificar Conexão
```
1. No dashboard web (https://telerivet.com/dashboard)
2. Ir para: "Phones"
3. Você deve ver seu telefone listado
4. Status deve ser: "Connected" (verde) ✅
```

---

## ⚙️ PARTE 4: Configurar Serviço USSD

### Passo 1: Criar Projeto
```
1. Dashboard → Projects
2. Clicar: "Create New Project"
3. Nome: "Transport System"
4. Clicar: "Create"
```

### Passo 2: Adicionar Telefone ao Projeto
```
1. No projeto, ir para: "Phones"
2. Clicar: "Add Phone"
3. Selecionar seu telefone Android
4. Clicar: "Add to Project"
```

### Passo 3: Configurar USSD Service

#### 3.1 Criar Serviço
```
1. No projeto, ir para: "Services"
2. Clicar: "Create New Service"
3. Tipo: Selecionar "Incoming Message"
4. Nome: "Transport USSD"
5. Clicar: "Create"
```

#### 3.2 Configurar Webhook
```
1. No serviço criado, ir para: "Settings"
2. Encontrar: "Webhook URL"
3. Configurar:
   
   URL: https://seu-servidor.com/api/ussd-telerivet
   
   (Se usando ngrok):
   URL: https://abc123.ngrok-free.app/api/ussd-telerivet
   
4. Method: POST
5. Format: JSON
6. Clicar: "Save"
```

#### 3.3 Configurar Filtros (Importante!)
```
1. Ainda em Settings
2. Encontrar: "Message Filters"
3. Adicionar filtro:
   - Type: "Message starts with"
   - Value: "*" (asterisco)
   - Isso captura todas as mensagens USSD
4. Clicar: "Save"
```

#### 3.4 Ativar Serviço
```
1. No topo da página do serviço
2. Toggle: "Active" → ON (verde) ✅
3. Clicar: "Save Changes"
```

---

## 🔧 PARTE 5: Configurações Avançadas

### Configuração 1: Timeout de Sessão
```
1. Services → Seu serviço → Settings
2. Encontrar: "Session Timeout"
3. Configurar: 30 segundos (padrão)
4. Isso define quanto tempo espera resposta do usuário
5. Salvar
```

### Configuração 2: Retry Policy
```
1. Services → Settings → Advanced
2. Webhook Retry:
   - Max retries: 3
   - Retry delay: 5 segundos
3. Isso tenta novamente se webhook falhar
4. Salvar
```

### Configuração 3: Logging
```
1. Services → Settings → Logging
2. Ativar: "Log all messages" ✅
3. Ativar: "Log webhook requests" ✅
4. Isso ajuda no debug
5. Salvar
```

### Configuração 4: Phone Settings
```
1. Phones → Seu telefone → Settings
2. Configurar:
   - Auto-start on boot: ON ✅
   - Keep screen on: ON ✅ (opcional)
   - Battery optimization: OFF ✅
3. Salvar
```

---

## 🌐 PARTE 6: Configurar Código USSD

### Opção A: Usar Código Existente da Operadora

**Vodacom/Mcel/Movitel geralmente permitem:**
```
*123*456# (exemplo)
*384*123# (exemplo)
```

**Como descobrir códigos disponíveis:**
```
1. Contactar operadora
2. Perguntar: "Quais códigos USSD estão disponíveis?"
3. Ou testar códigos diferentes
```

### Opção B: Usar Código Curto (Requer Aprovação)

**Formato:** `*123#`

**Processo:**
```
1. Contactar operadora (Vodacom/Mcel/Movitel)
2. Solicitar código USSD dedicado
3. Preencher formulário
4. Aguardar aprovação (pode demorar)
5. Pagar taxa (se aplicável)
```

### Opção C: Usar Código Compartilhado (Mais Fácil)

**Formato:** `*123*456#`

**Vantagens:**
- ✅ Mais fácil de conseguir
- ✅ Mais barato
- ✅ Aprovação mais rápida

---

## 🧪 PARTE 7: Testar Configuração

### Teste 1: Verificar Conexão do Telefone
```
1. Dashboard → Phones
2. Verificar status: "Connected" (verde)
3. Se vermelho:
   - Verificar internet no telefone
   - Reabrir app Telerivet
   - Verificar crédito no SIM
```

### Teste 2: Testar Webhook
```
1. Services → Seu serviço → Test
2. Clicar: "Send Test Message"
3. Verificar logs do seu servidor
4. Deve receber requisição JSON
```

### Teste 3: Testar USSD Real
```
1. De outro telefone, discar: *seu-codigo#
2. Verificar se recebe menu
3. Testar navegação
4. Verificar logs no Telerivet dashboard
```

### Teste 4: Verificar Logs
```
1. Services → Seu serviço → Messages
2. Ver todas as mensagens recebidas
3. Verificar webhooks enviados
4. Checar erros (se houver)
```

---

## 📊 PARTE 8: Monitoramento

### Dashboard Principal
```
1. Ir para: Dashboard → Overview
2. Você verá:
   - Mensagens recebidas hoje
   - Status do telefone
   - Erros recentes
   - Uso de créditos
```

### Logs de Mensagens
```
1. Services → Messages
2. Ver todas as interações USSD
3. Filtrar por:
   - Data
   - Número de telefone
   - Status (sucesso/erro)
```

### Logs de Webhook
```
1. Services → Webhook Logs
2. Ver todas as requisições enviadas
3. Verificar:
   - URL chamada
   - Resposta recebida
   - Tempo de resposta
   - Erros
```

### Alertas
```
1. Settings → Notifications
2. Configurar alertas por email:
   - Telefone desconectado
   - Webhook falhando
   - Crédito baixo
3. Adicionar seu email
4. Salvar
```

---

## 🔐 PARTE 9: Segurança

### Configuração 1: Webhook Authentication
```
1. Services → Settings → Security
2. Ativar: "Webhook Authentication"
3. Gerar: Secret Key
4. Copiar chave
5. Adicionar no seu código:
   - Verificar header: X-Telerivet-Signature
   - Validar requisição
```

### Configuração 2: IP Whitelist (Opcional)
```
1. Services → Settings → Security
2. Adicionar IPs permitidos
3. Apenas esses IPs podem enviar webhooks
4. Salvar
```

### Configuração 3: HTTPS Obrigatório
```
1. Services → Settings → Security
2. Ativar: "Require HTTPS"
3. Webhook URL deve começar com https://
4. Salvar
```

---

## 💰 PARTE 10: Billing e Créditos

### Verificar Uso
```
1. Dashboard → Billing
2. Ver:
   - Mensagens enviadas/recebidas
   - Custo atual
   - Próxima cobrança
```

### Adicionar Método de Pagamento
```
1. Billing → Payment Methods
2. Adicionar cartão de crédito
3. Ou configurar PayPal
4. Salvar
```

### Configurar Limites
```
1. Billing → Spending Limits
2. Definir limite mensal
3. Receber alerta ao atingir limite
4. Salvar
```

---

## 📱 PARTE 11: Manutenção do Telefone

### Configurações Recomendadas no Android

#### 1. Economia de Bateria
```
Settings → Battery → Telerivet app
- Desativar: "Battery optimization"
- Permitir: "Background activity"
```

#### 2. Dados Móveis
```
Settings → Network → Mobile Data
- Ativar: "Mobile data"
- Desativar: "Data saver" (para Telerivet)
```

#### 3. Auto-Start
```
Settings → Apps → Telerivet
- Ativar: "Auto-start"
- Ativar: "Run in background"
```

#### 4. Notificações
```
Settings → Notifications → Telerivet
- Ativar todas as notificações
- Isso ajuda a ver status
```

### Manutenção Regular

**Diariamente:**
- [ ] Verificar telefone está conectado
- [ ] Verificar tem internet
- [ ] Verificar tem crédito

**Semanalmente:**
- [ ] Reiniciar telefone
- [ ] Limpar cache do app
- [ ] Verificar atualizações

**Mensalmente:**
- [ ] Recarregar crédito
- [ ] Verificar uso de dados
- [ ] Backup de configurações

---

## 🚨 PARTE 12: Troubleshooting

### Problema 1: Telefone Desconectado
**Sintomas:** Status vermelho no dashboard

**Soluções:**
```
1. Verificar internet no telefone
2. Reabrir app Telerivet
3. Fazer logout/login no app
4. Reiniciar telefone
5. Verificar crédito no SIM
6. Reinstalar app (último recurso)
```

### Problema 2: USSD Não Funciona
**Sintomas:** Usuário disca código mas nada acontece

**Soluções:**
```
1. Verificar código USSD está correto
2. Testar USSD manualmente no telefone gateway
3. Verificar SIM tem USSD ativo
4. Contactar operadora
5. Verificar filtros no serviço Telerivet
```

### Problema 3: Webhook Não Recebe Dados
**Sintomas:** Logs mostram mensagens mas webhook não é chamado

**Soluções:**
```
1. Verificar URL do webhook está correta
2. Testar URL no browser
3. Verificar servidor está rodando
4. Verificar firewall não bloqueia
5. Checar logs de webhook no Telerivet
6. Testar com "Send Test Message"
```

### Problema 4: Respostas Lentas
**Sintomas:** Demora muito para responder

**Soluções:**
```
1. Verificar latência da internet
2. Otimizar código do servidor
3. Usar WiFi em vez de dados móveis
4. Verificar servidor não está sobrecarregado
5. Adicionar mais telefones (escalar)
```

### Problema 5: Crédito Acaba Rápido
**Sintomas:** SIM fica sem crédito frequentemente

**Soluções:**
```
1. Verificar plano de dados
2. Mudar para plano ilimitado
3. Usar WiFi em vez de dados
4. Configurar recarga automática
5. Monitorar uso no dashboard
```

---

## ✅ CHECKLIST FINAL

### Configuração Completa
- [ ] Conta Telerivet criada
- [ ] Trial ativado (14 dias grátis)
- [ ] Telefone Android preparado
- [ ] SIM card inserido e com crédito
- [ ] App Telerivet instalado
- [ ] Telefone conectado ao dashboard
- [ ] Projeto criado
- [ ] Serviço USSD configurado
- [ ] Webhook URL configurada
- [ ] Filtros de mensagem configurados
- [ ] Serviço ativado
- [ ] Código USSD definido
- [ ] Testes realizados
- [ ] Logs verificados
- [ ] Alertas configurados
- [ ] Telefone em local seguro
- [ ] Carregador conectado

### Pronto para Produção
- [ ] Webhook responde corretamente
- [ ] Todos os menus funcionam
- [ ] Latência aceitável (<2 segundos)
- [ ] Logs sem erros
- [ ] Telefone estável
- [ ] Backup configurado (telefone reserva)
- [ ] Monitoramento ativo
- [ ] Método de pagamento adicionado

---

## 📞 Suporte

### Telerivet Support
- **Email:** support@telerivet.com
- **Docs:** https://telerivet.com/help
- **API Docs:** https://telerivet.com/api

### Operadoras Moçambique
- **Vodacom:** 123 ou 84 300 0000
- **Mcel:** 145 ou 82 000 0000
- **Movitel:** 155 ou 86 000 0000

---

## 🎯 Resumo Rápido

### Configurações Essenciais:
1. ✅ Criar conta em telerivet.com
2. ✅ Instalar app no Android
3. ✅ Conectar telefone
4. ✅ Criar serviço USSD
5. ✅ Configurar webhook: `https://seu-servidor.com/api/ussd-telerivet`
6. ✅ Ativar serviço
7. ✅ Testar!

### Próximo Passo:
**Adaptar seu código para receber requisições do Telerivet!**

---

**Quer que eu crie o código adaptado agora?** 🚀
