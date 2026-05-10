# Fix Connection Pool Timeout ✅

## Problema
```
Timed out fetching a new connection from the connection pool
(Current connection pool timeout: 10, connection limit: 5)
```

## Causa
O simulador de ônibus estava fazendo múltiplas queries do Prisma para cada atualização de posição:
- 111 ônibus atualizando constantemente
- Cada atualização fazia 3-4 queries separadas
- Connection pool de apenas 5 conexões
- Timeout de apenas 10 segundos

## Soluções Implementadas

### 1. Usar Transações do Prisma
**Arquivo**: `transport-client/lib/busSimulator.ts`

**Antes**:
```typescript
// 3 queries separadas = 3 conexões
await prisma.transporte.update(...)
const existing = await prisma.geoLocation.findFirst(...)
await prisma.geoLocation.update(...)
```

**Depois**:
```typescript
// 1 transação = 1 conexão
await prisma.$transaction(async (tx) => {
  await tx.transporte.update(...)
  const existing = await tx.geoLocation.findFirst(...)
  await tx.geoLocation.update(...)
});
```

**Benefício**: Reduz de 3 conexões para 1 por atualização

### 2. Aumentar Connection Pool
**Arquivo**: `transport-client/.env`

**Antes**:
```
DATABASE_URL="...?sslmode=require"
# Default: connection_limit=5, pool_timeout=10
```

**Depois**:
```
DATABASE_URL="...?sslmode=require&connection_limit=10&pool_timeout=20"
# Dobrou o limite de conexões e timeout
```

**Benefício**: 
- Mais conexões disponíveis (5 → 10)
- Mais tempo para aguardar conexão (10s → 20s)

### 3. Reduzir Logging do Prisma
**Arquivo**: `transport-client/lib/prisma.ts`

**Antes**:
```typescript
log: ['query', 'error', 'warn'] // Loga todas as queries
```

**Depois**:
```typescript
log: ['error', 'warn'] // Apenas erros e avisos
```

**Benefício**: Menos overhead de logging

## Cálculo de Impacto

### Antes:
- 111 ônibus × 3 queries/atualização = 333 queries
- Intervalo de atualização: ~5 segundos
- 333 queries / 5 conexões = Sobrecarga garantida

### Depois:
- 111 ônibus × 1 transação/atualização = 111 transações
- 10 conexões disponíveis
- 111 transações / 10 conexões = Gerenciável
- Timeout de 20s dá margem para picos

## Como Aplicar

### 1. Reiniciar o Servidor
```bash
# Parar o servidor (Ctrl+C)

# Limpar cache
rm -rf .next

# Reiniciar
npm run dev
```

### 2. Verificar Logs
Após reiniciar, você deve ver:
- ✅ Menos erros de connection pool
- ✅ Atualizações de posição funcionando
- ✅ Sem timeouts

## Monitoramento

### Sinais de Sucesso:
- ✅ Nenhum erro "Timed out fetching connection"
- ✅ Ônibus se movendo no mapa
- ✅ Buscas de transporte funcionando

### Se Ainda Houver Problemas:

#### Opção 1: Aumentar Mais o Pool
```env
DATABASE_URL="...&connection_limit=15&pool_timeout=30"
```

#### Opção 2: Reduzir Frequência de Atualização
No `busSimulator.ts`, aumentar o intervalo:
```typescript
// De 5 segundos para 10 segundos
const UPDATE_INTERVAL = 10000; // 10 segundos
```

#### Opção 3: Usar Neon Pooler Direto
Trocar de `-pooler` para conexão direta (não recomendado para serverless):
```env
DATABASE_URL="postgresql://...@ep-wild-wildflower-ansvthi1.c-6.us-east-1.aws.neon.tech/..."
```

## Arquivos Modificados

1. ✅ `transport-client/lib/busSimulator.ts` - Usa transações
2. ✅ `transport-client/lib/prisma.ts` - Reduz logging
3. ✅ `transport-client/.env` - Aumenta connection pool

## Notas Importantes

### Neon Database
- Neon suspende bancos inativos após 5 minutos
- Primeira query após suspensão pode demorar ~1-2 segundos
- Isso é normal e esperado

### Connection Pooling
- Neon Pooler usa PgBouncer
- Limite de 10 conexões é razoável para desenvolvimento
- Produção pode precisar de mais

### Transações
- Transações garantem atomicidade
- Mais eficientes que queries separadas
- Reduzem uso de conexões

---

**Status**: ✅ OTIMIZADO
**Impacto**: Redução de 66% no uso de conexões
**Ação**: Reiniciar servidor para aplicar mudanças
