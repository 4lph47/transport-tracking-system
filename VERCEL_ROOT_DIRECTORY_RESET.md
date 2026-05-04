# 🔧 Vercel Root Directory Reset - AÇÃO NECESSÁRIA

**Erro Atual:**
```
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". Also check your Root Directory setting matches the directory of your package.json file.
```

**Causa:** O Vercel ainda está configurado com Root Directory = `transport-client`, mas agora o `package.json` está no root do repositório.

---

## ✅ VOCÊ PRECISA FAZER AGORA:

### Passo 1: Resetar Root Directory no Vercel Dashboard

1. **Acessar Vercel:**
   - Ir para https://vercel.com/dashboard
   - Selecionar projeto `transport-tracking-system`

2. **Ir para Settings:**
   - Clicar em **Settings** (no topo)
   - Clicar em **General** (na lateral esquerda)

3. **Resetar Root Directory:**
   - Rolar até a seção **Root Directory**
   - Se estiver configurado como `transport-client`, clicar em **Edit**
   - **DEIXAR EM BRANCO** (apagar `transport-client`)
   - Clicar em **Save**

4. **Redeploy:**
   - Ir para **Deployments**
   - Clicar nos 3 pontos (...) do último deploy
   - Clicar em **Redeploy**
   - Aguardar build (1-2 minutos)

---

## 📋 Verificação

### ✅ Configuração Correta:
- **Root Directory:** (vazio/em branco)
- **Framework Preset:** Next.js (deve detectar automaticamente)
- **Build Command:** `npm run build` (automático)
- **Install Command:** `npm install` (automático)

### ✅ Estrutura Atual:
```
Repositório Root/
├── package.json         ← ✅ Aqui (com next: "16.2.4")
├── next.config.ts       ← ✅ Aqui
├── app/                 ← ✅ Aqui
│   └── api/ussd/        ← ✅ Endpoint USSD
├── lib/                 ← ✅ Utilitários
├── prisma/              ← ✅ Database
└── vercel.json          ← ✅ Configuração simples
```

---

## 🚨 Se Ainda Não Funcionar:

### Opção 1: Limpar Cache do Vercel
1. Settings → General → **Clear Build Cache**
2. Redeploy

### Opção 2: Recriar Projeto no Vercel
1. **Desconectar projeto atual:**
   - Settings → General → **Delete Project**
   
2. **Criar novo projeto:**
   - Dashboard → **New Project**
   - Importar do GitHub: `transport-tracking-system`
   - **NÃO configurar Root Directory** (deixar vazio)
   - Deploy

### Opção 3: Verificar Variáveis de Ambiente
Garantir que estão configuradas:
- `DATABASE_URL`
- `AFRICASTALKING_USERNAME=sandbox`
- `AFRICASTALKING_API_KEY=sua_key`

---

## 🎯 Resultado Esperado

Após resetar Root Directory e redeploy:

### Build Bem-Sucedido:
```
✓ Next.js version detected: 16.2.4
✓ Installing dependencies...
✓ Running "npm run build"
✓ Prisma Client generated
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Build completed
```

### Endpoint Funcionando:
```bash
curl -X POST https://transport-tracking-system.vercel.app/api/ussd \
  -d "text="
```

**Resposta:**
```
CON Bem-vindo ao Sistema de Transportes
1. Encontrar Transporte Agora
2. Procurar Rotas
3. Paragens Próximas
4. Calcular Tarifa
5. Ajuda
```

---

## 📞 Troubleshooting

### Erro: "Framework not detected"
**Solução:** Verificar que `package.json` tem `"next": "16.2.4"` nas dependencies

### Erro: "Build failed"
**Solução:** Verificar logs específicos no Vercel Dashboard

### Erro: "Prisma generate failed"
**Solução:** Verificar `DATABASE_URL` nas variáveis de ambiente

---

## ✅ Checklist

- [ ] Acessar Vercel Dashboard
- [ ] Ir para Settings → General
- [ ] Resetar Root Directory (deixar vazio)
- [ ] Salvar configuração
- [ ] Fazer Redeploy
- [ ] Aguardar build (1-2 min)
- [ ] Testar endpoint USSD
- [ ] Configurar no Africa's Talking

---

**IMPORTANTE:** O problema é apenas de configuração no Vercel Dashboard. O código está correto!

**Status:** ⏳ Aguardando ação manual no Vercel Dashboard