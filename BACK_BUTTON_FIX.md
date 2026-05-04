# Correção do Botão Voltar

## Problema Identificado

Quando o usuário clicava em "Acompanhar" um ônibus e depois clicava em "Voltar", a página de busca mostrava:
```
0 transportes em circulação
Nenhum transporte disponível
```

## Causa Raiz

O botão "Voltar" estava fazendo:
```typescript
router.push("/search")
```

Isso navegava para `/search` **sem os parâmetros da URL**, resultando em:
- URL: `/search` (sem parâmetros)
- API não recebia `paragemId` e `viaId`
- Nenhum ônibus era retornado

## Fluxo do Problema

### Antes da Correção:

1. **Página Inicial** → Usuário seleciona: Maputo, Zimpeto-Baixa, Paragem Albazine
2. **Navegação** → `/search?municipio=xxx&via=yyy&paragem=zzz`
3. **API Call** → `/api/buses?paragemId=zzz&viaId=yyy` ✅ Funciona
4. **Clica "Acompanhar"** → `/track/bus-id`
5. **Clica "Voltar"** → `router.push("/search")` 
6. **Nova URL** → `/search` ❌ Sem parâmetros!
7. **API Call** → Não acontece (faltam parâmetros)
8. **Resultado** → "0 transportes em circulação"

## Solução Implementada

Mudei o botão "Voltar" para usar o histórico do navegador:

```typescript
// Antes
router.push("/search")

// Depois
router.back()
```

### Como Funciona:

`router.back()` usa o histórico do navegador, que mantém:
- ✅ URL completa com todos os parâmetros
- ✅ Estado da página anterior
- ✅ Scroll position
- ✅ Dados já carregados (em alguns casos)

## Fluxo Corrigido

### Depois da Correção:

1. **Página Inicial** → Usuário seleciona: Maputo, Zimpeto-Baixa, Paragem Albazine
2. **Navegação** → `/search?municipio=xxx&via=yyy&paragem=zzz`
3. **API Call** → `/api/buses?paragemId=zzz&viaId=yyy` ✅ Funciona
4. **Clica "Acompanhar"** → `/track/bus-id`
5. **Clica "Voltar"** → `router.back()`
6. **Volta para** → `/search?municipio=xxx&via=yyy&paragem=zzz` ✅ Com parâmetros!
7. **API Call** → `/api/buses?paragemId=zzz&viaId=yyy` ✅ Funciona
8. **Resultado** → Lista de ônibus aparece corretamente

## Benefícios

### 1. Preserva Contexto
- Usuário volta exatamente para onde estava
- Não perde a seleção de município, via e paragem
- Experiência mais fluida

### 2. Performance
- Navegador pode usar cache
- Não precisa recarregar dados desnecessariamente
- Mais rápido que fazer nova busca

### 3. UX Melhor
- Comportamento esperado do botão "Voltar"
- Consistente com outros aplicativos
- Menos confusão para o usuário

## Alternativas Consideradas

### Opção 1: Salvar Parâmetros no State
```typescript
// Salvar ao navegar
const searchParams = { municipio, via, paragem };
router.push(`/track/${id}`, { state: searchParams });

// Restaurar ao voltar
router.push(`/search?${new URLSearchParams(searchParams)}`);
```
**Problema**: Mais complexo, requer gerenciamento de estado

### Opção 2: LocalStorage
```typescript
// Salvar
localStorage.setItem('lastSearch', JSON.stringify(params));

// Restaurar
const params = JSON.parse(localStorage.getItem('lastSearch'));
```
**Problema**: Persiste entre sessões (pode não ser desejado)

### Opção 3: router.back() ✅ Escolhida
```typescript
router.back()
```
**Vantagens**: 
- Simples
- Nativo do navegador
- Funciona perfeitamente
- Sem código extra

## Testando

### 1. Teste Básico
1. Selecione: Maputo → Zimpeto-Baixa → Paragem Albazine
2. Clique "Pesquisar Transportes"
3. Veja a lista de ônibus (deve mostrar 2)
4. Clique "Acompanhar" em qualquer ônibus
5. Clique "Voltar"
6. **Resultado Esperado**: Lista de ônibus aparece novamente

### 2. Teste de Navegação Múltipla
1. Faça uma busca
2. Acompanhe um ônibus
3. Volte
4. Acompanhe outro ônibus
5. Volte novamente
6. **Resultado Esperado**: Sempre volta para a lista correta

### 3. Teste de Histórico
1. Faça uma busca (Busca A)
2. Acompanhe um ônibus
3. Volte
4. Faça outra busca (Busca B)
5. Acompanhe um ônibus
6. Volte
7. **Resultado Esperado**: Volta para Busca B
8. Volte novamente
9. **Resultado Esperado**: Volta para Busca A

## Casos Especiais

### Usuário Acessa Diretamente /track/id
Se o usuário acessar diretamente a URL `/track/bus-id`:
- `router.back()` volta para a página anterior (pode ser externa)
- Comportamento correto: volta para onde veio

### Primeira Página da Sessão
Se `/track/id` for a primeira página:
- `router.back()` pode não ter onde voltar
- Navegador geralmente vai para página inicial ou não faz nada
- Considerar adicionar fallback no futuro

## Melhorias Futuras

### 1. Fallback Inteligente
```typescript
onClick={() => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}}
```

### 2. Breadcrumbs
Adicionar navegação breadcrumb:
```
Início > Busca > Acompanhar Ônibus
```

### 3. Tabs/Modal
Em vez de navegar para nova página, abrir modal:
- Mantém contexto da busca
- Mais rápido
- Melhor para mobile

## Conclusão

A correção é simples mas essencial para uma boa experiência do usuário. Usar `router.back()` é a solução mais natural e eficiente para este caso! ✅

## Arquivos Modificados

- `transport-client/app/track/[id]/page.tsx` - Linha ~167
  - Mudou de `router.push("/search")` para `router.back()`
