# Deploy no Vercel - Transport Tracking System

## 🚀 Passos para Deploy

### 1. Preparar o Banco de Dados

O Vercel não suporta SQLite em produção. Você precisa usar um banco de dados PostgreSQL.

**Opções recomendadas:**
- **Vercel Postgres** (integrado)
- **Supabase** (gratuito)
- **Neon** (gratuito)
- **Railway** (gratuito)

### 2. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, adicione estas variáveis:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### 3. Atualizar o Schema do Prisma

Edite `prisma/schema.prisma` e mude de SQLite para PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"  // Mudou de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. Fazer Deploy

```bash
# Commit as mudanças
git add .
git commit -m "Configure for Vercel deployment with PostgreSQL"
git push

# O Vercel vai fazer deploy automaticamente
```

### 5. Rodar Migrations no Vercel

Após o deploy, você precisa rodar as migrations:

**Opção A: Via Vercel CLI**
```bash
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

**Opção B: Via Script de Build**

Adicione ao `package.json`:
```json
"scripts": {
  "vercel-build": "prisma generate && prisma migrate deploy && prisma db seed && next build"
}
```

### 6. Popular o Banco de Dados

Se o seed não rodar automaticamente, você pode:

1. **Localmente** (conectando ao banco remoto):
```bash
# Baixar variáveis de ambiente do Vercel
vercel env pull .env.local

# Rodar migrations
npx prisma migrate deploy

# Popular banco
npx prisma db seed
```

2. **Via Vercel Functions** (criar endpoint temporário):

Crie `app/api/admin/seed/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const { authorization } = await request.json();
  
  // Proteção básica
  if (authorization !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await execAsync('npx prisma db seed');
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Depois chame:
```bash
curl -X POST https://seu-app.vercel.app/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"authorization":"SEU_ADMIN_SECRET"}'
```

## 🔧 Configuração Completa

### package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Variáveis de Ambiente Necessárias

```env
# Banco de Dados
DATABASE_URL="postgresql://..."

# Opcional: Para proteger endpoint de seed
ADMIN_SECRET="seu-secret-aqui"
```

## 📝 Checklist de Deploy

- [ ] Banco de dados PostgreSQL configurado
- [ ] `DATABASE_URL` adicionada no Vercel
- [ ] Schema do Prisma atualizado para PostgreSQL
- [ ] Código commitado e pushed
- [ ] Deploy feito no Vercel
- [ ] Migrations rodadas
- [ ] Banco de dados populado (seed)
- [ ] Testado: `/` mostra 25 autocarros
- [ ] Testado: `/search` funciona
- [ ] Testado: `/auth` funciona

## 🐛 Troubleshooting

### "0 autocarros em circulação"
- ✅ Verifique se o seed rodou: `vercel logs`
- ✅ Conecte ao banco e verifique: `SELECT COUNT(*) FROM "Transporte";`
- ✅ Rode o seed manualmente

### "Prisma Client not generated"
- ✅ Verifique se `postinstall` está no package.json
- ✅ Force rebuild: `vercel --force`

### "Database connection error"
- ✅ Verifique `DATABASE_URL` no Vercel
- ✅ Teste conexão localmente com a mesma URL
- ✅ Verifique se o IP do Vercel está permitido no firewall do banco

## 🎯 Alternativa Rápida: Usar Vercel Postgres

1. No painel do Vercel, vá em "Storage"
2. Clique em "Create Database"
3. Escolha "Postgres"
4. Conecte ao seu projeto
5. A `DATABASE_URL` será adicionada automaticamente
6. Rode migrations e seed conforme instruções acima

## 📚 Recursos

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma com Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js no Vercel](https://nextjs.org/docs/deployment)
