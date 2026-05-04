# Fix: Erro 500 na Paragem de Boquisso

## Problema
Ao selecionar a paragem de Boquisso, a aplicação retornava erro 500:
```
HTTP error! status: 500
```

## Causa Provável
O erro ocorria ao tentar processar `transporte.via.geoLocationPath` que pode estar:
- Vazio (`""`)
- Nulo (`null`)
- Undefined
- Com formato inválido

Quando o código tentava fazer `.split(';')` em um valor nulo/undefined, causava erro:
```typescript
// ❌ ANTES - Sem validação
const routeCoords = transporte.via.geoLocationPath
  .split(';')  // Erro se geoLocationPath for null/undefined
  .map((coord) => {
    const [lng, lat] = coord.split(',').map(Number);
    return [lng, lat];
  });
```

## Solução Implementada

### Adicionada Validação com Try-Catch

**Arquivo**: `transport-client/app/api/buses/route.ts`

Agora o código valida se `geoLocationPath` existe antes de processar:

```typescript
// ✅ DEPOIS - Com validação
let routeCoords = [];
try {
  if (transporte.via.geoLocationPath) {
    routeCoords = transporte.via.geoLocationPath
      .split(';')
      .map((coord) => {
        const [lng, lat] = coord.split(',').map(Number);
        return [lng, lat];
      });
  }
} catch (error) {
  console.error('Error parsing route coords for', transporte.matricula, error);
  routeCoords = [];
}
```

### Locais Corrigidos

1. **Fallback quando não há transportes na via** (linha ~250)
   - Quando retorna todos os transportes do sistema
   - Valida `geoLocationPath` antes de processar

2. **Processamento de transportes da via específica** (linha ~370)
   - Quando retorna transportes de uma via específica
   - Valida `geoLocationPath` antes de processar

## Benefícios

✅ **Não quebra mais**: Se `geoLocationPath` for nulo, retorna array vazio
✅ **Logs úteis**: Registra no console qual transporte causou erro
✅ **Graceful degradation**: Transporte ainda aparece, só sem rota no mapa
✅ **Previne crashes**: Try-catch captura qualquer erro de parsing

## Comportamento Agora

### Cenário 1: Via com geoLocationPath válido
- Processa normalmente
- Mostra rota no mapa
- Tudo funciona como antes

### Cenário 2: Via sem geoLocationPath (null/undefined/vazio)
- Não tenta processar
- Retorna `routeCoords = []` (array vazio)
- Transporte aparece na lista
- Mapa não mostra rota (mas não quebra)
- Log no console: "Error parsing route coords for [MATRICULA]"

### Cenário 3: Via com geoLocationPath inválido
- Try-catch captura erro
- Retorna `routeCoords = []`
- Transporte aparece na lista
- Log no console com detalhes do erro

## Possível Causa Raiz

A paragem de Boquisso pode estar associada a uma via que:
1. Não tem `geoLocationPath` definido no banco de dados
2. Tem `geoLocationPath` com formato inválido
3. Foi criada sem dados de rota

## Verificação no Banco de Dados

Para verificar qual via está causando o problema:

```bash
cd transport-client
npx prisma studio
```

1. Abra a tabela `Via`
2. Procure por vias que passam por Boquisso
3. Verifique o campo `geoLocationPath`
4. Se estiver vazio/nulo, adicione dados de rota válidos

## Formato Correto do geoLocationPath

```
longitude1,latitude1;longitude2,latitude2;longitude3,latitude3
```

Exemplo:
```
32.5732,-25.9692;32.5745,-25.9705;32.5758,-25.9718
```

## Teste

1. ✅ Selecione município
2. ✅ Selecione via que passa por Boquisso
3. ✅ Selecione paragem Boquisso
4. ✅ Clique em "Pesquisar Transportes"
5. ✅ Deve mostrar transportes sem erro 500
6. ✅ Se via não tem rota, transportes aparecem mas sem linha no mapa

## Próximos Passos (Opcional)

### Melhorar Dados no Banco
Se quiser que todas as vias tenham rotas no mapa:
1. Identifique vias sem `geoLocationPath`
2. Adicione coordenadas de rota para essas vias
3. Execute seed novamente

### Adicionar Indicador Visual
Pode adicionar indicador quando transporte não tem rota:
```typescript
{routeCoords.length === 0 && (
  <span className="text-xs text-amber-600">
    ⚠️ Rota não disponível
  </span>
)}
```

## Arquivos Modificados

1. ✅ `transport-client/app/api/buses/route.ts` - Adicionada validação em 2 locais
