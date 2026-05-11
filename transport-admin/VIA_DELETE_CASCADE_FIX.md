# Via Delete - Desassociação Automática de Transportes

**Requisito**: Ao eliminar uma via, os transportes devem ser desassociados automaticamente (viaId = null)  
**Status**: ✅ IMPLEMENTADO  
**Requer Migração**: ⚠️ SIM - Executar comando Prisma

---

## 🔄 Mudanças Implementadas

### 1. Schema do Prisma - viaId Agora é Opcional

**Antes**:
```prisma
model Transporte {
  via           Via      @relation(fields: [viaId], references: [id])
  viaId         String   // Obrigatório ❌
}
```

**Depois**:
```prisma
model Transporte {
  via           Via?     @relation(fields: [viaId], references: [id])
  viaId         String?  // Opcional ✅
}
```

**Arquivos Modificados**:
- ✅ `transport-admin/prisma/schema.prisma`
- ✅ `transport-client/prisma/schema.prisma`
- ✅ `prisma/schema.prisma`

---

### 2. Endpoint DELETE da Via - Desassociação Automática

**Antes** (Bloqueava a eliminação):
```typescript
if (via._count.transportes > 0) {
  return NextResponse.json(
    { 
      error: 'Não é possível eliminar via com transportes atribuídos',
      details: `Esta via tem ${via._count.transportes} transportes atribuídos.`
    },
    { status: 400 }
  );
}
```

**Depois** (Desassocia automaticamente):
```typescript
// Desassociar todos os transportes desta via (set viaId to null)
if (via._count.transportes > 0) {
  await prisma.transporte.updateMany({
    where: { viaId: params.id },
    data: { viaId: null },
  });
}

// Delete via (paragens will be deleted automatically due to onDelete: Cascade)
await prisma.via.delete({
  where: { id: params.id },
});
```

**Arquivo Modificado**:
- ✅ `transport-admin/app/api/vias/[id]/route.ts`

---

## 🚀 Como Aplicar as Mudanças

### Passo 1: Gerar a Migração do Prisma

Execute o seguinte comando no diretório `transport-admin`:

```bash
cd transport-admin
npx prisma migrate dev --name make-via-optional-in-transporte
```

Este comando irá:
1. Criar uma nova migração SQL
2. Modificar a coluna `viaId` para permitir valores NULL
3. Atualizar o Prisma Client

---

### Passo 2: Aplicar a Migração em Produção

Quando estiver pronto para deploy em produção:

```bash
cd transport-admin
npx prisma migrate deploy
```

---

### Passo 3: Regenerar o Prisma Client (se necessário)

Se o Prisma Client não for regenerado automaticamente:

```bash
cd transport-admin
npx prisma generate
```

---

## 📊 Comportamento Após as Mudanças

### Cenário 1: Eliminar Via com Transportes

**Ação**: Usuário clica em "Eliminar" numa via que tem 5 transportes

**Processo**:
1. ✅ Sistema verifica se a via existe
2. ✅ Sistema encontra 5 transportes com `viaId = via.id`
3. ✅ Sistema executa `updateMany` para definir `viaId = null` nos 5 transportes
4. ✅ Sistema elimina a via
5. ✅ Sistema elimina as associações ViaParagem (cascade automático)
6. ✅ Retorna sucesso

**Resultado**:
- Via eliminada ✅
- 5 transportes agora têm `viaId = null` (sem via atribuída) ✅
- Paragens da via desassociadas ✅

---

### Cenário 2: Eliminar Via sem Transportes

**Ação**: Usuário clica em "Eliminar" numa via sem transportes

**Processo**:
1. ✅ Sistema verifica se a via existe
2. ✅ Sistema não encontra transportes (`_count.transportes = 0`)
3. ✅ Sistema pula o passo de desassociação
4. ✅ Sistema elimina a via
5. ✅ Sistema elimina as associações ViaParagem (cascade automático)
6. ✅ Retorna sucesso

**Resultado**:
- Via eliminada ✅
- Nenhum transporte afetado ✅

---

### Cenário 3: Transportes Sem Via

Após a mudança, transportes podem existir sem via atribuída:

```typescript
{
  id: "abc123",
  matricula: "ABC-1234",
  modelo: "Mercedes",
  marca: "Benz",
  viaId: null,  // ✅ Agora é permitido
  via: null     // ✅ Relação opcional
}
```

---

## 🔍 Impacto em Outras Partes do Sistema

### 1. Listagem de Transportes
**Antes**: Todos os transportes tinham via  
**Depois**: Alguns transportes podem ter `via = null`

**Código Afetado**:
```typescript
// Precisa verificar se via existe
{transporte.via ? transporte.via.nome : 'Sem via atribuída'}
```

### 2. Filtros de Transportes
**Antes**: Filtrar por via sempre retornava resultados  
**Depois**: Pode haver transportes sem via

**Código Afetado**:
```typescript
// Adicionar filtro para transportes sem via
const transportesSemVia = transportes.filter(t => !t.viaId);
```

### 3. Estatísticas
**Antes**: Total de transportes = soma de transportes por via  
**Depois**: Pode haver transportes não contabilizados

**Código Afetado**:
```typescript
// Contar transportes sem via
const transportesSemVia = await prisma.transporte.count({
  where: { viaId: null }
});
```

---

## ⚠️ Considerações Importantes

### 1. Dados Existentes
- Transportes existentes continuam com suas vias atribuídas
- Apenas quando uma via for eliminada, os transportes serão desassociados

### 2. Validação de Formulários
- Formulários de criação/edição de transportes devem permitir `viaId = null`
- Campo "Via" pode ser opcional

### 3. Relatórios e Dashboards
- Atualizar queries para considerar transportes sem via
- Adicionar categoria "Sem Via Atribuída" em relatórios

---

## 🧪 Como Testar

### Teste 1: Eliminar Via com Transportes
```bash
1. Criar uma via de teste
2. Atribuir 2-3 transportes à via
3. Tentar eliminar a via
4. Verificar que:
   - Via foi eliminada ✅
   - Transportes agora têm viaId = null ✅
   - Nenhum erro foi gerado ✅
```

### Teste 2: Verificar Transportes Desassociados
```bash
1. Após eliminar a via, ir para página de Transportes
2. Verificar que os transportes aparecem com "Sem via atribuída"
3. Verificar que podem ser reatribuídos a outra via
```

### Teste 3: Eliminar Via sem Transportes
```bash
1. Criar uma via sem transportes
2. Eliminar a via
3. Verificar que foi eliminada sem problemas
```

---

## 📝 SQL da Migração

A migração irá executar algo similar a:

```sql
-- AlterTable
ALTER TABLE "Transporte" 
ALTER COLUMN "viaId" DROP NOT NULL;
```

Isso permite que a coluna `viaId` aceite valores NULL.

---

## 🔄 Rollback (Se Necessário)

Se precisar reverter as mudanças:

```bash
cd transport-admin
npx prisma migrate resolve --rolled-back make-via-optional-in-transporte
```

Depois, reverter as mudanças no schema e criar nova migração:

```bash
npx prisma migrate dev --name revert-via-optional
```

---

## ✅ Checklist de Implementação

- [x] Modificar schema do Prisma (viaId opcional)
- [x] Atualizar endpoint DELETE da via
- [x] Documentar mudanças
- [ ] Executar migração do Prisma
- [ ] Testar eliminação de via com transportes
- [ ] Testar eliminação de via sem transportes
- [ ] Verificar listagem de transportes
- [ ] Atualizar UI para mostrar "Sem via atribuída"
- [ ] Atualizar relatórios/dashboards
- [ ] Deploy em produção

---

## 🎯 Resultado Final

**Antes**:
- ❌ Não era possível eliminar via com transportes
- ❌ Usuário tinha que desassociar manualmente
- ❌ Processo demorado e confuso

**Depois**:
- ✅ Via pode ser eliminada mesmo com transportes
- ✅ Transportes são desassociados automaticamente
- ✅ Processo rápido e intuitivo
- ✅ Transportes podem ser reatribuídos depois

---

**Implementado Por**: Kiro AI  
**Data**: May 9, 2026  
**Status**: ✅ Código Pronto - Aguardando Migração do Prisma
