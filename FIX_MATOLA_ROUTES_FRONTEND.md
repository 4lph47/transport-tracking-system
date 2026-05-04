# ✅ Fix: Rotas da Matola Agora Selecionáveis no Frontend

## Problema
"Não consigo selecionar rotas de Matola no frontend"

## Causa Raiz
As 6 vias da Matola foram criadas com `municipioId` de **Maputo** em vez de **Matola**. 

Quando o usuário selecionava o município "Matola" no frontend, o filtro buscava vias com `municipioId === matolaId`, mas não encontrava nenhuma porque todas estavam associadas a Maputo.

## Código Problemático (Antes)

```typescript
// seed.ts - ANTES
const viaMatolaMuseu = await prisma.via.create({
  data: {
    nome: 'Matola Sede - Museu',
    codigo: 'VIA-MAT-MUS',
    codigoMunicipio: 'MUN-MP-01',      // ❌ Maputo
    municipioId: municipioMaputo.id,    // ❌ Maputo
    // ...
  },
});
```

## Solução Implementada

Atualizei o seed para associar as vias da Matola ao município correto:

```typescript
// seed.ts - DEPOIS
const viaMatolaMuseu = await prisma.via.create({
  data: {
    nome: 'Matola Sede - Museu',
    codigo: 'VIA-MAT-MUS',
    codigoMunicipio: 'MUN-MT-01',      // ✅ Matola
    municipioId: municipioMatola.id,    // ✅ Matola
    // ...
  },
});
```

## Vias Corrigidas

Todas as 6 vias da Matola agora têm `municipioId` correto:

1. **VIA-MAT-MUS**: Matola Sede → Museu
2. **VIA-MAT-BAI**: Matola Sede → Baixa
3. **VIA-TCH-BAI**: Tchumene → Baixa
4. **VIA-MAL-MUS**: Malhampsene → Museu
5. **VIA-MGARE-BAI**: Matola Gare → Baixa
6. **VIA-MACH-MUS**: Machava Sede → Museu

## Como o Filtro Funciona

```typescript
// transport-client/app/page.tsx
const viasFiltered = vias?.filter((via) => 
  via.municipioId === selectedMunicipio
) || [];
```

**Agora:**
- Seleciona "Maputo" → Mostra 12 vias de Maputo ✅
- Seleciona "Matola" → Mostra 6 vias da Matola ✅

## Resultado

### Antes da Correção
- Seleciona "Maputo" → 18 vias (todas)
- Seleciona "Matola" → 0 vias ❌

### Depois da Correção
- Seleciona "Maputo" → 12 vias ✅
- Seleciona "Matola" → 6 vias ✅

## Como Testar

1. Acesse o frontend: **http://localhost:3000**
2. No formulário de busca:
   - **Passo 1**: Selecione "Matola" no dropdown de Município
   - **Passo 2**: Veja as 6 vias da Matola aparecerem no dropdown de Via
   - **Passo 3**: Selecione uma via (ex: "Matola Sede - Museu")
   - **Passo 4**: Veja as paragens daquela via

## Vias Disponíveis por Município

### Município: Maputo (12 vias)
- Rota 1a: Baixa → Chamissava
- Rota 11: Baixa → Michafutene
- Rota 17: Baixa → Zimpeto (via Costa do Sol)
- Rota 20: Baixa → Matendene
- Rota 21: Museu → Albasine
- Rota 37: Museu → Zimpeto
- Rota 39a: Baixa → Zimpeto
- Rota 39b: Baixa → Boquisso
- Rota 47: Baixa → Tchumene
- Rota 51a: Baixa → Boane
- Rota 51c: Baixa → Mafuiane
- Rota 53: Baixa → Albasine

### Município: Matola (6 vias)
- Matola Sede → Museu (via N4)
- Matola Sede → Baixa (via N4/Portagem)
- Tchumene → Baixa (via N4)
- Malhampsene → Museu (via N4)
- Matola Gare → Baixa
- Machava Sede → Museu

## Arquivos Modificados

1. ✅ `transport-admin/prisma/seed.ts`
   - Mudado `municipioId` de todas as 6 vias da Matola
   - De `municipioMaputo.id` para `municipioMatola.id`
   - De `'MUN-MP-01'` para `'MUN-MT-01'`

## Base de Dados Atualizada

✅ Seed executado com sucesso
✅ 18 vias criadas (12 Maputo + 6 Matola)
✅ Associações corretas de município

## Status Final

✅ **PROBLEMA RESOLVIDO**

As rotas da Matola agora:
- ✅ Aparecem quando seleciona município "Matola"
- ✅ Têm o `municipioId` correto
- ✅ São filtradas corretamente no frontend
- ✅ Funcionam em todo o fluxo de busca

## Teste Completo

```
1. Abrir http://localhost:3000
2. Selecionar "Matola" → Ver 6 vias ✅
3. Selecionar "Matola Sede - Museu" → Ver paragens ✅
4. Selecionar uma paragem → Buscar transportes ✅
```

Tudo funcionando! 🎉
