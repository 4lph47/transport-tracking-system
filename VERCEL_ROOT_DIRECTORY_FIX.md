# 🔧 Correção: Vercel Root Directory

**Problema:** 
```
Error: > Couldn't find any `pages` or `app` directory. 
Please create one under the project root
```

**Causa:** O Vercel está tentando fazer build no diretório raiz do repositório, mas o projeto Next.js está no submodule `transport-client`.

---

## ✅ Solução: Configurar Root Directory no Vercel

### Opção 1: Via Dashboard do Vercel (RECOMENDADO)

1. **Acessar Projeto no Vercel:**
   - Ir para https://vercel.com/dashboard
   - Selecionar projeto `transport-tracking-system`

2. **Configurar Root Directory:**
   - Ir para **Settings** → **General**
   - Encontrar seção **Root Directory**
   - Clicar em **Edit**
   - Digitar: `transport-client`
   - Clicar em **Save**

3. **Redeploy:**
   - Ir para **Deployments**
   - Clicar nos 3 pontos do último deploy
   - Clicar em **Redeploy**
   - Aguardar build

---

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Login
vercel login

# Configurar projeto
vercel

# Quando perguntar "In which directory is your code located?", responder:
# transport-client

# Deploy
vercel --prod
```

---

### Opção 3: Criar vercel.json no Root (ALTERNATIVA)

Se as opções acima não funcionarem, criar `vercel.json` no root:

```json
{
  "version": 2,
  "buildCommand": "cd transport-client && npm install && npm run build",
  "outputDirectory": "transport-client/.next",
  "installCommand": "cd transport-client && npm install"
}
```

**Nota:** Esta opção pode ter problemas com submodules.

---

## 🎯 Solução Recomendada: Mover Código para Root

Para evitar problemas com submodules no Vercel, a melhor solução é mover o código do `transport-client` para o root do repositório.

### Passos:

```bash
# 1. Copiar arquivos do transport-client para root
cp -r transport-client/* .

# 2. Remover submodule transport-client
git rm transport-client
rm -rf .git/modules/transport-client

# 3. Adicionar arquivos ao git
git add .

# 4. Commit
git commit -m "Mover transport-client para root do repositório"

# 5. Push
git push
```

**Vantagens:**
- ✅ Vercel funciona sem configuração extra
- ✅ Sem problemas com submodules
- ✅ Deploy automático funciona perfeitamente
- ✅ Mais simples de manter

**Desvantagens:**
- ⚠️ Perde estrutura de submodules
- ⚠️ Código de admin e driver ficam separados

---

## 🚀 Solução Imediata (Agora)

**Passo 1:** Configurar Root Directory no Vercel Dashboard

1. Acessar: https://vercel.com/dashboard
2. Selecionar projeto
3. Settings → General → Root Directory
4. Digitar: `transport-client`
5. Save

**Passo 2:** Redeploy

1. Deployments → Último deploy → 3 pontos → Redeploy

**Passo 3:** Aguardar build (1-2 minutos)

---

## 📝 Estrutura Atual do Repositório

```
transport-tracking-system/
├── transport-client/     ← Projeto Next.js (USSD API)
│   ├── app/
│   │   ├── api/
│   │   │   └── ussd/
│   │   │       └── route.ts
│   │   └── page.tsx
│   ├── package.json
│   └── next.config.js
├── transport-admin/      ← Painel Admin
├── transport-driver/     ← App Motorista
├── vercel.json          ← Configuração Vercel
└── README.md
```

**Vercel precisa saber:** O código está em `transport-client/`, não no root.

---

## ✅ Verificação Após Correção

Após configurar e redeploy, verificar:

1. **Build bem-sucedido:**
   ```
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages
   ```

2. **Endpoint funcionando:**
   ```bash
   curl -X POST https://transport-tracking-system.vercel.app/api/ussd \
     -d "sessionId=test123" \
     -d "serviceCode=*384*123#" \
     -d "phoneNumber=+258840000000" \
     -d "text="
   ```

   **Resposta esperada:**
   ```
   CON Bem-vindo ao Sistema de Transportes
   1. Encontrar Transporte Agora
   2. Procurar Rotas
   3. Paragens Próximas
   4. Calcular Tarifa
   5. Ajuda
   ```

---

## 🔍 Troubleshooting

### Erro: "Module not found"
**Solução:** Verificar que `package.json` está em `transport-client/`

### Erro: "DATABASE_URL not found"
**Solução:** Verificar variáveis de ambiente no Vercel

### Erro: "Build timeout"
**Solução:** Aumentar timeout em Settings → General → Build & Development Settings

---

## 📞 Suporte

**Documentação Vercel:**
- Root Directory: https://vercel.com/docs/concepts/projects/project-configuration#root-directory
- Monorepos: https://vercel.com/docs/concepts/monorepos

**Logs do Vercel:**
- Dashboard → Deployments → Último deploy → View Function Logs

---

## 🎯 Status

- [x] Problema identificado
- [x] Solução documentada
- [ ] Root Directory configurado no Vercel
- [ ] Redeploy realizado
- [ ] Build bem-sucedido
- [ ] Endpoint testado

---

**AÇÃO NECESSÁRIA:** Configurar Root Directory no Vercel Dashboard para `transport-client` e fazer redeploy!
