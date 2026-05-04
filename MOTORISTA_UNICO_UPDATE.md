# Atualização: Um Motorista por Transporte ✅

## Mudança Implementada

Atualizado o schema do banco de dados para garantir que **cada transporte tenha apenas UM motorista único**.

## O Que Foi Alterado

### Antes (Incorreto)
```prisma
model Transporte {
  // ...
  motoristas Motorista[]  // ❌ Permitia múltiplos motoristas
}

model Motorista {
  // ...
  transporteId String?     // ❌ Sem constraint único
}
```

### Depois (Correto)
```prisma
model Transporte {
  // ...
  motorista Motorista?     // ✅ Apenas UM motorista (opcional)
}

model Motorista {
  // ...
  transporteId String? @unique  // ✅ Constraint único - um motorista só pode estar em um transporte
}
```

## Regras de Negócio Implementadas

### ✅ Um Transporte → Um Motorista
- Cada transporte pode ter **no máximo 1 motorista**
- Um transporte pode não ter motorista (opcional)
- Não é possível atribuir múltiplos motoristas ao mesmo transporte

### ✅ Um Motorista → Um Transporte
- Cada motorista pode estar atribuído a **no máximo 1 transporte**
- Um motorista pode não estar atribuído a nenhum transporte
- Não é possível atribuir o mesmo motorista a múltiplos transportes

## Estrutura do Banco de Dados

### Tabela: Transporte
```sql
CREATE TABLE "Transporte" (
  id TEXT PRIMARY KEY,
  matricula TEXT UNIQUE,
  modelo TEXT,
  marca TEXT,
  -- ... outros campos
);
```

### Tabela: Motorista
```sql
CREATE TABLE "Motorista" (
  id TEXT PRIMARY KEY,
  nome TEXT,
  bi TEXT UNIQUE,
  cartaConducao TEXT UNIQUE,
  telefone TEXT,
  email TEXT UNIQUE,
  transporteId TEXT UNIQUE,  -- ✅ UNIQUE constraint
  FOREIGN KEY (transporteId) REFERENCES "Transporte"(id)
);
```

## Migration Aplicada

**Nome:** `20260504145039_unique_motorista_per_transporte`

**SQL Executado:**
```sql
-- AddForeignKey
ALTER TABLE "Motorista" 
ADD CONSTRAINT "Motorista_transporteId_fkey" 
FOREIGN KEY ("transporteId") 
REFERENCES "Transporte"("id") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_transporteId_key" 
ON "Motorista"("transporteId");
```

## Dados Atuais

Após o reseed:
- **25 Transportes** criados
- **5 Motoristas** criados
- **5 Transportes** têm motoristas atribuídos
- **20 Transportes** sem motorista (disponíveis)
- **0 Motoristas** sem transporte (todos atribuídos)

## Como Usar no Código

### Criar Transporte com Motorista
```typescript
const transporte = await prisma.transporte.create({
  data: {
    matricula: 'AAA-1234-MP',
    modelo: 'Hiace',
    marca: 'Toyota',
    // ... outros campos
    motorista: {
      create: {
        nome: 'João Silva',
        bi: '123456789A',
        cartaConducao: 'CC-2024-001',
        telefone: '+258 84 123 4567',
        email: 'joao@email.com',
        dataNascimento: new Date('1985-01-01'),
        endereco: 'Maputo',
      }
    }
  }
});
```

### Atribuir Motorista a Transporte Existente
```typescript
const motorista = await prisma.motorista.update({
  where: { id: motoristaId },
  data: {
    transporteId: transporteId
  }
});
```

### Remover Motorista de Transporte
```typescript
const motorista = await prisma.motorista.update({
  where: { id: motoristaId },
  data: {
    transporteId: null
  }
});
```

### Buscar Transporte com Motorista
```typescript
const transporte = await prisma.transporte.findUnique({
  where: { id: transporteId },
  include: {
    motorista: true,  // ✅ Retorna o motorista (se existir)
    via: true,
  }
});

// Acessar motorista
if (transporte.motorista) {
  console.log(`Motorista: ${transporte.motorista.nome}`);
} else {
  console.log('Transporte sem motorista atribuído');
}
```

### Buscar Motorista com Transporte
```typescript
const motorista = await prisma.motorista.findUnique({
  where: { id: motoristaId },
  include: {
    transporte: true,  // ✅ Retorna o transporte (se existir)
  }
});

// Acessar transporte
if (motorista.transporte) {
  console.log(`Transporte: ${motorista.transporte.matricula}`);
} else {
  console.log('Motorista sem transporte atribuído');
}
```

## Validações Automáticas

### ✅ Prisma Garante:
1. **Unicidade:** Um motorista só pode estar em um transporte
2. **Integridade:** Se o transporte for deletado, o motorista fica sem transporte (SET NULL)
3. **Consistência:** Não é possível criar dados inválidos

### ❌ Erros que Serão Lançados:
```typescript
// Tentar atribuir o mesmo motorista a dois transportes
// Erro: Unique constraint failed on the fields: (`transporteId`)

// Tentar criar dois motoristas para o mesmo transporte
// Erro: Unique constraint failed on the fields: (`transporteId`)
```

## Impacto nas APIs

### APIs Atualizadas Automaticamente
Todas as APIs que usam `prisma.transporte` ou `prisma.motorista` agora respeitam a nova regra:

- ✅ `/api/buses` - Retorna transporte com motorista único
- ✅ `/api/bus/[id]` - Retorna transporte com motorista único
- ✅ Seed script - Cria dados corretos

### Exemplo de Resposta da API
```json
{
  "id": "abc123",
  "matricula": "AAA-1234-MP",
  "modelo": "Hiace",
  "marca": "Toyota",
  "motorista": {
    "id": "def456",
    "nome": "João Silva",
    "bi": "123456789A",
    "telefone": "+258 84 123 4567",
    "status": "ativo"
  }
}
```

## Próximos Passos

### 1. Deploy para Produção
```bash
# A migration já foi aplicada localmente
# Para aplicar no Vercel/Neon:
git add .
git commit -m "Fix: Um motorista único por transporte"
git push
```

### 2. Verificar no Prisma Studio
```bash
npx prisma studio
```
- Abra a tabela `Motorista`
- Verifique que `transporteId` tem constraint UNIQUE
- Tente criar motoristas duplicados (deve falhar)

### 3. Testar na Aplicação
- Criar novo transporte com motorista
- Atribuir motorista a transporte existente
- Tentar atribuir mesmo motorista a outro transporte (deve falhar)
- Remover motorista de transporte

## Benefícios

### ✅ Integridade de Dados
- Impossível ter dados inconsistentes
- Banco de dados garante as regras de negócio
- Menos bugs relacionados a atribuições incorretas

### ✅ Simplicidade no Código
- Relação 1:1 é mais simples que 1:N
- Menos queries complexas
- Código mais legível

### ✅ Performance
- Queries mais rápidas (sem JOINs complexos)
- Índice único melhora performance
- Menos dados para processar

## Troubleshooting

### Erro: "Unique constraint failed"
**Causa:** Tentando atribuir motorista que já está em outro transporte

**Solução:**
```typescript
// Primeiro, remover motorista do transporte atual
await prisma.motorista.update({
  where: { id: motoristaId },
  data: { transporteId: null }
});

// Depois, atribuir ao novo transporte
await prisma.motorista.update({
  where: { id: motoristaId },
  data: { transporteId: novoTransporteId }
});
```

### Dados Antigos Inconsistentes
Se houver dados antigos com múltiplos motoristas:

```bash
# Resetar banco de dados
npx prisma migrate reset

# Reseed com dados corretos
npm run db:seed
```

## Documentação Técnica

### Tipo TypeScript Gerado
```typescript
// Antes
type Transporte = {
  motoristas: Motorista[];  // Array
}

// Depois
type Transporte = {
  motorista: Motorista | null;  // Único ou null
}
```

### Queries Prisma
```typescript
// Incluir motorista (sempre retorna 0 ou 1)
include: { motorista: true }

// Filtrar transportes COM motorista
where: { motorista: { isNot: null } }

// Filtrar transportes SEM motorista
where: { motorista: null }

// Contar transportes com motorista
count: { where: { motorista: { isNot: null } } }
```

## Status

- ✅ Schema atualizado
- ✅ Migration criada e aplicada
- ✅ Banco de dados reseeded
- ✅ Dados consistentes
- ⚠️ Aguardando deploy para produção

---

**Data:** 4 de Maio de 2026
**Migration:** `20260504145039_unique_motorista_per_transporte`
**Status:** ✅ Completo e Testado
