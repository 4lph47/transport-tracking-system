# Fix: Vias da Matola Agora Visíveis no Admin ✅

## Problema
As vias da Matola não apareciam no painel de administração porque a página estava usando dados estáticos (hardcoded) em vez de buscar da base de dados.

## Solução Implementada

### 1. Criada API para Buscar Vias
**Arquivo**: `transport-admin/app/api/vias/route.ts`

- Endpoint GET que busca todas as vias da base de dados
- Inclui informações do município
- Conta o número de paragens e transportes por via
- Ordena as vias por nome

### 2. Criado Prisma Client Compartilhado
**Arquivo**: `transport-admin/lib/prisma.ts`

- Instância única do Prisma Client
- Evita múltiplas conexões à base de dados
- Configurado com logs para debug

### 3. Atualizada Página de Vias
**Arquivo**: `transport-admin/app/vias/page.tsx`

**Mudanças:**
- ❌ Removidos dados estáticos hardcoded
- ✅ Adicionado `useEffect` para buscar vias da API
- ✅ Adicionado estado de loading
- ✅ Adicionada filtragem por nome, código ou município
- ✅ Exibe informações reais da base de dados:
  - Código da via
  - Nome completo
  - Município
  - Rota (Terminal Partida → Terminal Chegada)
  - Cor (com preview visual)
  - Número de paragens
  - Número de transportes

## Resultado

### Antes
- Apenas 4 vias estáticas
- Dados falsos
- Não mostrava vias da Matola

### Depois
- **18 vias reais** da base de dados
- **12 vias de Maputo** (Rotas EMTPM 2025)
- **6 vias da Matola** (Rotas Matola-Maputo)
- Dados reais e atualizados
- Pesquisa funcional

## Vias da Matola Agora Visíveis

1. **VIA-MAT-MUS**: Matola Sede → Museu (via N4)
2. **VIA-MAT-BAI**: Matola Sede → Baixa (via N4/Portagem)
3. **VIA-TCH-BAI**: Tchumene → Baixa (via N4)
4. **VIA-MAL-MUS**: Malhampsene → Museu (via N4)
5. **VIA-MGARE-BAI**: Matola Gare → Baixa
6. **VIA-MACH-MUS**: Machava Sede → Museu

## Como Verificar

1. Acesse o painel admin: http://localhost:3001
2. Navegue para "Vias" no menu lateral
3. Verá todas as 18 vias incluindo as 6 da Matola
4. Use a barra de pesquisa para filtrar por "Matola"

## Informações Exibidas

Para cada via, o sistema mostra:
- **Código**: Identificador único (ex: VIA-MAT-MUS)
- **Nome**: Nome completo da rota
- **Município**: Maputo ou Matola
- **Rota**: Terminal de partida → Terminal de chegada
- **Cor**: Cor da linha com preview visual
- **Paragens**: Número de paragens na rota
- **Transportes**: Número de autocarros atribuídos

## Arquivos Modificados

1. ✅ `transport-admin/app/api/vias/route.ts` (NOVO)
2. ✅ `transport-admin/lib/prisma.ts` (NOVO)
3. ✅ `transport-admin/app/vias/page.tsx` (ATUALIZADO)

## Status
✅ **COMPLETO** - As vias da Matola agora são visíveis e selecionáveis no painel de administração.
