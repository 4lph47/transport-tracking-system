# 📤 Guia: Push para GitHub

**Status:** ✅ Commit feito localmente  
**Próximo passo:** Criar repositório no GitHub e fazer push

---

## 🚀 Passo a Passo

### 1. Criar Repositório no GitHub

**Opção A: Via Web (Recomendado)**

1. Ir para https://github.com/new
2. Preencher:
   - **Repository name:** `transport-mozambique`
   - **Description:** `Sistema de rastreamento de transportes públicos em tempo real para Moçambique`
   - **Visibility:** Private (recomendado) ou Public
   - **NÃO marcar:** "Initialize this repository with a README"
3. Clicar em **"Create repository"**

**Opção B: Via CLI (GitHub CLI)**

```bash
# Instalar GitHub CLI (se não tiver)
# https://cli.github.com/

# Login
gh auth login

# Criar repositório
gh repo create transport-mozambique --private --source=. --remote=origin --push
```

---

### 2. Adicionar Remote e Push

Após criar o repositório no GitHub, você verá instruções. Use estas:

```bash
# Adicionar remote (substituir SEU-USERNAME pelo seu username do GitHub)
git remote add origin https://github.com/SEU-USERNAME/transport-mozambique.git

# Verificar remote
git remote -v

# Push para GitHub
git push -u origin master
```

**Exemplo completo:**
```bash
# Se seu username for "joaosilva"
git remote add origin https://github.com/joaosilva/transport-mozambique.git
git push -u origin master
```

---

### 3. Verificar Push

Após o push, ir para:
```
https://github.com/SEU-USERNAME/transport-mozambique
```

Você deve ver:
- ✅ 94 arquivos
- ✅ Commit: "Sistema de rastreamento em tempo real completo..."
- ✅ Todas as pastas: transport-client, transport-admin, transport-driver
- ✅ Documentação completa

---

## 🔐 Autenticação

### Se pedir senha:

**GitHub não aceita mais senha!** Use Personal Access Token:

1. Ir para https://github.com/settings/tokens
2. Clicar em **"Generate new token"** > **"Generate new token (classic)"**
3. Preencher:
   - **Note:** `Transport Mozambique Deploy`
   - **Expiration:** 90 days (ou No expiration)
   - **Scopes:** Marcar `repo` (todos os sub-items)
4. Clicar em **"Generate token"**
5. **COPIAR O TOKEN** (só aparece uma vez!)
6. Usar o token como senha ao fazer push

**Exemplo:**
```bash
git push -u origin master

Username: seu-username
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (seu token)
```

---

## 🎯 Comandos Completos

```bash
# 1. Verificar status
git status

# 2. Adicionar remote (substituir URL)
git remote add origin https://github.com/SEU-USERNAME/transport-mozambique.git

# 3. Verificar remote
git remote -v

# 4. Push
git push -u origin master

# 5. Verificar no GitHub
# Abrir: https://github.com/SEU-USERNAME/transport-mozambique
```

---

## ⚠️ Troubleshooting

### Erro: "remote origin already exists"

```bash
# Remover remote existente
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/SEU-USERNAME/transport-mozambique.git
```

### Erro: "Authentication failed"

**Solução:** Usar Personal Access Token (ver seção acima)

### Erro: "Permission denied"

**Solução:** Verificar se você é o dono do repositório ou tem permissão de escrita

---

## 📋 Checklist

- [ ] Repositório criado no GitHub
- [ ] Remote adicionado localmente
- [ ] Push bem-sucedido
- [ ] Código visível no GitHub
- [ ] Pronto para conectar ao Vercel

---

## 🚀 Próximo Passo: Deploy no Vercel

Após o push para GitHub, seguir: **`DEPLOY_CHECKLIST.md`**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
cd transport-client
vercel --prod
```

---

**Última atualização:** 4 de Maio de 2026  
**Status:** ✅ Commit feito, aguardando push
