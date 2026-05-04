# Fix: Sempre Mostrar Transportes Disponíveis

## Problema
Quando o usuário selecionava uma via que não tinha transportes circulando, aparecia a mensagem:
```
Nenhum transporte disponível
Não há transportes circulando nesta via no momento.
```

## Solução Implementada
Modificada a API `/api/buses` para que, quando não houver transportes na via selecionada, retorne TODOS os transportes disponíveis no sistema.

## Lógica Implementada

### Antes:
1. Usuário seleciona município, via e paragem
2. API busca transportes apenas naquela via específica
3. Se não houver transportes na via → retorna lista vazia
4. Frontend mostra "Nenhum transporte disponível"

### Depois:
1. Usuário seleciona município, via e paragem
2. API busca transportes naquela via específica
3. **Se não houver transportes na via → busca TODOS os transportes do sistema**
4. Calcula distância e tempo de cada transporte até a paragem selecionada
5. Ordena por tempo estimado (mais próximo primeiro)
6. Frontend sempre mostra transportes disponíveis

## Código Modificado

### Arquivo: `transport-client/app/api/buses/route.ts`

**Adicionado após buscar transportes da via:**
```typescript
// If no transportes found on this via, return all transportes
if (transportes.length === 0) {
  console.log('No buses found on this via, returning all buses');
  
  // Busca todos os transportes do sistema
  const allTransportes = await prisma.transporte.findMany({...});
  
  // Calcula distância e tempo para cada transporte até a paragem selecionada
  const allBuses = allTransportes.map((transporte) => {
    // ... cálculos de distância e tempo ...
  });
  
  // Ordena por tempo estimado
  allBuses.sort((a, b) => a.tempoEstimado - b.tempoEstimado);
  
  return NextResponse.json({ buses: allBuses, paragem: {...} });
}
```

## Benefícios

✅ **Sempre mostra transportes**: Usuário nunca vê tela vazia
✅ **Informação útil**: Mesmo que não haja transporte na via selecionada, mostra alternativas
✅ **Melhor UX**: Usuário pode ver todos os transportes e escolher o mais próximo
✅ **Cálculo preciso**: Distância e tempo são calculados até a paragem selecionada
✅ **Ordenação inteligente**: Transportes mais próximos aparecem primeiro

## Comportamento

### Cenário 1: Via tem transportes
- Mostra apenas os transportes daquela via
- Ordenados por tempo estimado

### Cenário 2: Via não tem transportes
- Mostra TODOS os transportes do sistema
- Calcula distância até a paragem selecionada
- Ordenados por tempo estimado
- Usuário vê todas as opções disponíveis

## Exemplo Prático

**Usuário seleciona:**
- Município: Matola
- Via: Rota 11
- Paragem: Costa do Sol

**Se Rota 11 não tem transportes circulando:**
- Sistema busca todos os 25 transportes
- Calcula distância de cada um até "Costa do Sol"
- Mostra lista ordenada por proximidade
- Usuário pode escolher o transporte mais próximo, mesmo que seja de outra via

## Arquivos Modificados

1. ✅ `transport-client/app/api/buses/route.ts` - Adicionada lógica de fallback para mostrar todos os transportes

## Teste

1. Acesse `/search`
2. Selecione qualquer município, via e paragem
3. Clique em "Pesquisar Transportes"
4. **Resultado**: Sempre verá transportes disponíveis, nunca tela vazia
5. Transportes são ordenados por tempo estimado de chegada
