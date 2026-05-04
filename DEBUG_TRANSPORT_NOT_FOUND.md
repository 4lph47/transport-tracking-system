# Debug: Transporte Não Encontrado

## Problema
Ao clicar em "Acompanhar" um transporte, aparece o erro:
```
Transporte não encontrado
O transporte que procura não está disponível.
Error: "Bus not found"
```

## Causa Provável
O ID do transporte que está sendo passado para a página `/track/[id]` não existe no banco de dados.

## Logs Adicionados para Debug

### 1. Frontend - search/page.tsx
Adicionado log na função `handleTrackTransport`:
```typescript
console.log('Tracking transport with ID:', transportId);
console.log('With paragem:', paragem);
```

### 2. Backend - /api/buses/route.ts
Adicionado log ao mapear transportes:
```typescript
console.log('Bus:', bus.matricula, 'ID:', bus.id);
```

### 3. Backend - /api/bus/[id]/route.ts
Já tem logs:
```typescript
console.log('Fetching bus with ID:', busId);
console.log('Transport found:', transporte ? 'Yes' : 'No');
```

## Como Debugar

### Passo 1: Verificar IDs Retornados pela API
1. Abra o console do navegador (F12)
2. Vá para a aba "Network"
3. Faça uma busca de transporte
4. Procure pela requisição `/api/buses?...`
5. Veja a resposta e verifique os IDs dos transportes

### Passo 2: Verificar ID ao Clicar em Acompanhar
1. Com o console aberto
2. Clique em "Acompanhar" em um transporte
3. Veja o log: `Tracking transport with ID: ...`
4. Copie esse ID

### Passo 3: Verificar se ID Existe no Banco
1. Abra o terminal no diretório `transport-client`
2. Execute:
```bash
npx prisma studio
```
3. Abra a tabela `Transporte`
4. Procure pelo ID que foi logado
5. Verifique se existe

### Passo 4: Verificar Logs do Servidor
1. Veja o terminal onde o servidor está rodando
2. Procure pelos logs:
```
Bus: [MATRICULA] ID: [ID]
Fetching bus with ID: [ID]
Transport found: Yes/No
```

## Possíveis Causas

### Causa 1: IDs Inconsistentes
- API `/api/buses` retorna IDs que não existem
- **Solução**: Verificar se o seed do banco está correto

### Causa 2: Banco de Dados Desatualizado
- Transportes foram deletados mas ainda aparecem na busca
- **Solução**: Recriar o banco de dados

### Causa 3: Problema no Prisma Client
- Prisma Client não está sincronizado com o schema
- **Solução**: Regenerar Prisma Client

## Soluções

### Solução 1: Regenerar Banco de Dados
```bash
cd transport-client
rm prisma/dev.db
npx prisma migrate reset --force
npx prisma db seed
```

### Solução 2: Regenerar Prisma Client
```bash
cd transport-client
npx prisma generate
```

### Solução 3: Verificar Seed
Abra `transport-client/prisma/seed.ts` e verifique se:
- Todos os transportes têm IDs válidos (cuid)
- Todos os transportes estão associados a vias válidas
- Não há referências quebradas

## Teste Após Correção

1. Reinicie o servidor
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Faça uma nova busca
4. Clique em "Acompanhar"
5. Verifique se a página de rastreamento carrega corretamente

## Informações Úteis

### Estrutura do ID
- IDs são gerados pelo Prisma usando `@default(cuid())`
- Formato: string aleatória (ex: `ckl1234567890abcdef`)
- Cada transporte deve ter um ID único

### Fluxo Completo
1. `/api/buses` → Retorna lista de transportes com IDs
2. Frontend → Mostra lista com botão "Acompanhar"
3. Usuário clica → Redireciona para `/track/[id]`
4. `/api/bus/[id]` → Busca transporte específico por ID
5. Se encontrado → Mostra página de rastreamento
6. Se não encontrado → Mostra erro "Transporte não encontrado"

## Próximos Passos

1. ✅ Logs adicionados para debug
2. ⏳ Verificar logs no console e terminal
3. ⏳ Identificar qual ID está causando o problema
4. ⏳ Aplicar solução apropriada
5. ⏳ Testar novamente
