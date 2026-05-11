# 🚀 Setup Rápido - PostgreSQL + Vercel

## 1️⃣ Criar Banco de Dados no Neon (2 minutos)

1. Vá para: **https://neon.tech**
2. Clique em **"Sign Up"** e faça login com GitHub
3. Clique em **"Create Project"**
   - Nome: `transport-tracking`
   - Região: `Europe (Frankfurt)` ou mais próxima
4. Copie a **Connection String** que aparece

## 2️⃣ Configurar no Vercel (1 minuto)

1. Vá para: **https://vercel.com/dashboard**
2. Selecione seu projeto **transport-tracking-system**
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Name**: `DATABASE_URL`
   - **Value**: Cole a connection string do Neon
   - **Environments**: Marque Production, Preview e Development
5. Adicione também:
   - **Name**: `ADMIN_SECRET`
   - **Value**: `meu-secret-super-seguro-123` (mude depois!)
   - **Environments**: Marque todas
6. Clique em **Save**

## 3️⃣ Fazer Redeploy (1 minuto)

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deployment
3. Clique em **"Redeploy"**
4. Aguarde o deploy terminar (1-2 minutos)

## 4️⃣ Popular o Banco de Dados (30 segundos)

### Opção A: Via Browser (Mais Fácil)

1. Abra: `https://SEU-APP.vercel.app/api/admin/seed`
2. Você verá quantos transportes existem (provavelmente 0)
3. Use este comando no terminal:

```bash
curl -X POST https://SEU-APP.vercel.app/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"authorization":"meu-secret-super-seguro-123"}'
```

**Ou use o Postman/Insomnia:**
- Method: POST
- URL: `https://SEU-APP.vercel.app/api/admin/seed`
- Body (JSON):
```json
{
  "authorization": "meu-secret-super-seguro-123"
}
```

### Opção B: Via Terminal Local

```bash
# 1. Baixar variáveis de ambiente do Vercel
npx vercel env pull .env.local

# 2. Rodar migrations
npx prisma migrate dev --name init

# 3. Popular banco
npx prisma db seed
```

## 5️⃣ Verificar (10 segundos)

1. Abra: `https://SEU-APP.vercel.app`
2. Deve mostrar: **"25 autocarros em circulação"** 🎉

## ✅ Pronto!

Agora seu app está funcionando com PostgreSQL no Vercel!

---

## 🐛 Problemas?

### Ainda mostra 0 autocarros?

Verifique se o seed rodou:
```bash
curl https://SEU-APP.vercel.app/api/admin/seed
```

Deve retornar:
```json
{
  "status": "ok",
  "database": {
    "transportes": 25,
    "vias": 18,
    "paragens": 40
  }
}
```

### Erro de conexão?

- Verifique se a `DATABASE_URL` está correta no Vercel
- Certifique-se que tem `?sslmode=require` no final da URL
- Exemplo: `postgresql://user:pass@host/db?sslmode=require`

### Erro "Unauthorized"?

- Verifique se o `ADMIN_SECRET` está configurado no Vercel
- Use o mesmo valor no comando curl

---

## 📝 Resumo dos Comandos

```bash
# Verificar status do banco
curl https://SEU-APP.vercel.app/api/admin/seed

# Popular banco
curl -X POST https://SEU-APP.vercel.app/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"authorization":"SEU-ADMIN-SECRET"}'
```

## 🔒 Segurança

**IMPORTANTE:** Depois de popular o banco, você pode:
1. Deletar o arquivo `app/api/admin/seed/route.ts`
2. Ou mudar o `ADMIN_SECRET` para algo impossível de adivinhar
3. Ou adicionar IP whitelist

Isso previne que outras pessoas populem/limpem seu banco.
