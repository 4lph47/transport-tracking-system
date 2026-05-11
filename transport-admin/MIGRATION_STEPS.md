# 🚀 Passos para Aplicar a Migração - viaId Opcional

**Erro Atual**: `Unknown argument 'viaId'. Did you mean 'id'?`  
**Causa**: Prisma Client não foi regenerado após mudança no schema  
**Solução**: Executar migração do Prisma

---

## ⚠️ IMPORTANTE: Leia Antes de Executar

Esta migração irá:
1. ✅ Tornar o campo `viaId` opcional na tabela `Transporte`
2. ✅ Permitir que transportes existam sem via atribuída
3. ✅ Permitir eliminar vias sem remover transportes

**Impacto**: Baixo - Apenas adiciona suporte para valores NULL

---

## 📋 Passo a Passo

### Passo 1: Parar o Servidor de Desenvolvimento

**Windows (PowerShell)**:
```powershell
# Pressione Ctrl+C no terminal onde o servidor está rodando
```

---

### Passo 2: Navegar para o Diretório Correto

```powershell
cd transport-admin
```

---

### Passo 3: Executar a Migração

```powershell
npx prisma migrate dev --name make-via-optional-in-transporte
```

**O que este comando faz**:
1. Cria uma nova migração SQL
2. Aplica a migração no banco de dados
3. Regenera o Prisma Client automaticamente

**Saída Esperada**:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "transport_db"

Applying migration `20260509_make_via_optional_in_transporte`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260509_make_via_optional_in_transporte/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.x.x) to .\node_modules\@prisma\client
```

---

### Passo 4: Verificar a Migração

```powershell
# Ver o SQL gerado
cat prisma/migrations/*_make_via_optional_in_transporte/migration.sql
```

**SQL Esperado**:
```sql
-- AlterTable
ALTER TABLE "Transporte" ALTER COLUMN "viaId" DROP NOT NULL;
```

---

### Passo 5: Reiniciar o Servidor

```powershell
npm run dev
```

---

## 🔧 Se Encontrar Problemas

### Problema 1: "Migration failed to apply"

**Causa**: Pode haver dados inconsistentes no banco

**Solução**:
```powershell
# Ver status das migrações
npx prisma migrate status

# Se necessário, resetar o banco (⚠️ APAGA TODOS OS DADOS)
npx prisma migrate reset

# Depois executar novamente
npx prisma migrate dev --name make-via-optional-in-transporte
```

---

### Problema 2: "Prisma Client is not generated"

**Solução**:
```powershell
# Regenerar manualmente
npx prisma generate
```

---

### Problema 3: "Database connection error"

**Solução**:
```powershell
# Verificar se o banco de dados está rodando
# Verificar as credenciais no arquivo .env

# Testar conexão
npx prisma db pull
```

---

## ✅ Como Verificar se Funcionou

### Teste 1: Verificar Prisma Client
```powershell
# Abrir Node REPL
node

# No REPL:
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

# Verificar se viaId é opcional
# Deve mostrar viaId como opcional (String?)
```

### Teste 2: Testar Eliminação de Via
1. Abrir a aplicação
2. Ir para uma via com transportes
3. Clicar em "Eliminar"
4. Deve eliminar com sucesso
5. Verificar que transportes agora têm `via = null`

---

## 📊 Antes e Depois da Migração

### Antes (Schema)
```prisma
model Transporte {
  viaId  String  // ❌ Obrigatório
  via    Via     @relation(fields: [viaId], references: [id])
}
```

### Depois (Schema)
```prisma
model Transporte {
  viaId  String?  // ✅ Opcional
  via    Via?     @relation(fields: [viaId], references: [id])
}
```

### Antes (Banco de Dados)
```sql
CREATE TABLE "Transporte" (
  "viaId" TEXT NOT NULL  -- ❌ NOT NULL
);
```

### Depois (Banco de Dados)
```sql
CREATE TABLE "Transporte" (
  "viaId" TEXT  -- ✅ Permite NULL
);
```

---

## 🎯 Comandos Rápidos (Copiar e Colar)

### Opção 1: Migração Normal
```powershell
cd transport-admin
npx prisma migrate dev --name make-via-optional-in-transporte
npm run dev
```

### Opção 2: Com Reset (⚠️ Apaga Dados)
```powershell
cd transport-admin
npx prisma migrate reset
npx prisma migrate dev --name make-via-optional-in-transporte
npm run dev
```

### Opção 3: Apenas Regenerar Client
```powershell
cd transport-admin
npx prisma generate
npm run dev
```

---

## 📝 Notas Importantes

### Dados Existentes
- ✅ Transportes existentes mantêm suas vias atribuídas
- ✅ Nenhum dado será perdido
- ✅ Apenas permite novos transportes sem via

### Rollback
Se precisar reverter:
```powershell
# Ver histórico de migrações
npx prisma migrate status

# Reverter última migração
npx prisma migrate resolve --rolled-back make-via-optional-in-transporte

# Reverter schema
git checkout prisma/schema.prisma

# Criar nova migração
npx prisma migrate dev --name revert-via-optional
```

---

## 🚨 Troubleshooting

### Erro: "P3009: migrate found failed migrations"
```powershell
# Marcar migração como aplicada
npx prisma migrate resolve --applied make-via-optional-in-transporte
```

### Erro: "P1001: Can't reach database server"
```powershell
# Verificar se PostgreSQL está rodando
# Verificar DATABASE_URL no .env
```

### Erro: "P3005: Database schema is not empty"
```powershell
# Usar --create-only para criar sem aplicar
npx prisma migrate dev --create-only --name make-via-optional-in-transporte

# Depois aplicar manualmente
npx prisma migrate deploy
```

---

## ✅ Checklist Final

Após executar a migração, verificar:

- [ ] Servidor reiniciado sem erros
- [ ] Prisma Client regenerado
- [ ] Pode eliminar via com transportes
- [ ] Transportes ficam com `via = null`
- [ ] Pode reatribuir transportes a outras vias
- [ ] Listagem de transportes mostra "Sem via atribuída"

---

## 🎉 Sucesso!

Se tudo funcionou:
1. ✅ Via pode ser eliminada mesmo com transportes
2. ✅ Transportes são desassociados automaticamente
3. ✅ Nenhum erro no console
4. ✅ Aplicação funciona normalmente

---

**Próximo Passo**: Execute os comandos do Passo 1-5 acima!

**Precisa de Ajuda?**: Se encontrar algum erro, copie a mensagem completa e eu ajudo a resolver.
