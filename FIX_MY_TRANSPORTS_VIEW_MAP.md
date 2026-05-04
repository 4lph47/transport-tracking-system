# Fix: Botão "Ver no Mapa" em Meus Transportes

## Problema
Ao clicar em "Ver no Mapa" na página "Meus Transportes", aparecia o erro:
```
Transporte não encontrado
Error: "Bus not found"
```

## Causa Raiz
O botão estava usando `missao.id` (ID da missão) em vez do ID do transporte:
```typescript
router.push(`/track/${missao.id}`); // ❌ ERRADO - ID da missão
```

A página `/track/[id]` espera receber o ID de um transporte, não de uma missão.

## Problema Adicional
A tabela `MISSION` não tem um campo `transporteId` direto. Ela apenas armazena:
- `utenteId` - ID do usuário
- `paragemId` - ID da paragem
- Não armazena qual transporte específico

## Solução Implementada

### 1. Modificar API de Missões
**Arquivo**: `transport-client/app/api/user/missions/route.ts`

Agora a API:
1. Busca as missões do utente
2. Para cada missão, busca as vias que passam pela paragem
3. Para cada via, busca o primeiro transporte disponível
4. Retorna o `transporteId` junto com os dados da missão

```typescript
const missoesFormatted = missoes.map((missao) => {
  // Get first transport from first via that has transports
  let transporteId = null;
  for (const viaParagem of missao.paragem.vias) {
    if (viaParagem.via.transportes.length > 0) {
      transporteId = viaParagem.via.transportes[0].id;
      break;
    }
  }

  return {
    ...missao,
    transporteId: transporteId, // ✅ Adiciona ID do transporte
  };
});
```

### 2. Atualizar Interface Mission
**Arquivo**: `transport-client/app/my-transports/page.tsx`

Adicionado campo `transporteId`:
```typescript
interface Mission {
  id: string;
  // ... outros campos
  transporteId: string | null; // ✅ Novo campo
}
```

### 3. Corrigir Botão "Ver no Mapa"
**Arquivo**: `transport-client/app/my-transports/page.tsx`

**Antes:**
```typescript
onClick={() => {
  router.push(`/track/${missao.id}`); // ❌ ID da missão
}}
```

**Depois:**
```typescript
onClick={() => {
  if (missao.transporteId) {
    router.push(`/track/${missao.transporteId}?paragem=${missao.paragem.geoLocation}`);
  } else {
    alert('Nenhum transporte disponível para esta paragem');
  }
}}
disabled={!missao.transporteId}
```

## Melhorias Implementadas

✅ **Usa ID correto**: Agora usa `transporteId` em vez de `missao.id`
✅ **Passa paragem**: Inclui `?paragem=` na URL para mostrar a paragem correta
✅ **Validação**: Verifica se há transporte disponível antes de redirecionar
✅ **Feedback**: Mostra alerta se não houver transporte
✅ **UI**: Botão fica desabilitado se não houver transporte

## Fluxo Corrigido

1. **Usuário salva transporte** → Cria missão com `paragemId`
2. **Usuário acessa "Meus Transportes"** → API busca missões
3. **API processa missões** → Para cada missão, encontra um transporte que passa pela paragem
4. **Frontend recebe dados** → Cada missão tem `transporteId`
5. **Usuário clica "Ver no Mapa"** → Redireciona para `/track/[transporteId]?paragem=...`
6. **Página de rastreamento** → Busca transporte por ID correto ✅

## Lógica de Seleção de Transporte

Quando há múltiplos transportes passando pela mesma paragem:
- API retorna o **primeiro transporte** da **primeira via** que tem transportes
- Isso garante que sempre há um transporte válido para mostrar
- No futuro, pode-se melhorar para mostrar o transporte mais próximo

## Casos de Uso

### Caso 1: Paragem com Transportes
- Missão tem paragem "Costa do Sol"
- Rota 17 passa por "Costa do Sol" e tem 3 transportes
- API retorna ID do primeiro transporte da Rota 17
- Botão "Ver no Mapa" está habilitado
- Clique redireciona para rastreamento do transporte

### Caso 2: Paragem sem Transportes
- Missão tem paragem sem transportes circulando
- API retorna `transporteId: null`
- Botão "Ver no Mapa" está desabilitado (cinza)
- Clique mostra alerta: "Nenhum transporte disponível"

## Teste

1. ✅ Salve um transporte em "Meus Transportes"
2. ✅ Acesse "Meus Transportes"
3. ✅ Clique em "Ver no Mapa"
4. ✅ Deve abrir página de rastreamento com transporte correto
5. ✅ Mapa deve mostrar rota e paragem selecionada

## Arquivos Modificados

1. ✅ `transport-client/app/api/user/missions/route.ts` - Adiciona `transporteId` na resposta
2. ✅ `transport-client/app/my-transports/page.tsx` - Usa `transporteId` correto no botão
