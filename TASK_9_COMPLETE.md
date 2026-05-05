# Task 9: Multiple Vias Solution - COMPLETE ✅

## Problem
Os 3 autocarros (AAA-1055B, AAA-1056C, AAA-1054A) tinham as mesmas rotas com:
- Mesma distância: 11.4 km
- Mesmo tempo: 16 min
- Mesmo preço: 115 MT
- Mesmo trajecto no mapa

**Causa**: Todos os 3 autocarros estavam atribuídos à mesma `viaId` na base de dados.

## Solução Implementada ✅

Criei um script que:
1. **Criou 3 vias únicas** para Magoanine-Baixa com diferentes ruas e paragens
2. **Atribuiu cada autocarro** a uma via diferente
3. **Cada via tem características únicas**:
   - Paragens diferentes
   - Ruas diferentes (geoLocationPath)
   - Cores diferentes no mapa
   - Distâncias diferentes

## Resultados

### Antes (Todos iguais):
```
AAA-1055B: 11.4 km, 16 min, 115 MT
AAA-1056C: 11.4 km, 16 min, 115 MT
AAA-1054A: 11.4 km, 16 min, 115 MT
```

### Depois (Cada um único):
```
🚌 AAA-1055B (Via Zimpeto) 🔵
   Distância: 15.5 km
   Tempo: 21 minutos
   Preço: 155 MT
   Paragens: Magoanine A → Zimpeto → Av. de Moçambique → Xipamanine → Praça dos Trabalhadores

🚌 AAA-1056C (Via Hulene) 🟢
   Distância: 12.5 km
   Tempo: 17 minutos
   Preço: 126 MT
   Paragens: Magoanine A → Hulene → Maxaquene → Xipamanine → Praça dos Trabalhadores

🚌 AAA-1054A (Via Mussumbuluco) 🟠
   Distância: 21.5 km
   Tempo: 29 minutos
   Preço: 216 MT
   Paragens: Magoanine A → Mussumbuluco → T3 → Av. de Moçambique → Xipamanine → Praça dos Trabalhadores
```

## O Que Foi Feito

### 1. Script Criado
- **Ficheiro**: `create-multiple-vias-for-route.js`
- **Localização**: Raiz do projecto e `transport-client/`
- **Função**: Cria múltiplas vias para a mesma origem-destino com diferentes trajetos

### 2. Base de Dados Actualizada
- ✅ 3 novos registos Via criados
- ✅ 5 novos registos Paragem criados
- ✅ 16 novas conexões ViaParagem criadas
- ✅ 3 registos Transporte actualizados com novos viaId

### 3. Vias Criadas

#### Via 1: Magoanine-Baixa (Via Zimpeto)
- **Código**: VIA-MAG-BAI-1
- **Cor**: Azul (#3B82F6)
- **Autocarro**: AAA-1055B
- **Rota**: Passa por Zimpeto e Av. de Moçambique

#### Via 2: Magoanine-Baixa (Via Hulene)
- **Código**: VIA-MAG-BAI-2
- **Cor**: Verde (#10B981)
- **Autocarro**: AAA-1056C
- **Rota**: Passa por Hulene e Maxaquene

#### Via 3: Magoanine-Baixa (Via Mussumbuluco)
- **Código**: VIA-MAG-BAI-3
- **Cor**: Laranja (#F59E0B)
- **Autocarro**: AAA-1054A
- **Rota**: Passa por Mussumbuluco e T3

## Como Funciona Agora

### No Frontend (Página de Pesquisa)
Quando o utilizador selecciona uma paragem, o sistema:
1. Procura todos os autocarros que passam por essa paragem
2. Cada autocarro tem a sua própria via única
3. Calcula distância, tempo e preço baseado na via específica
4. Mostra informações diferentes para cada autocarro

### No Mapa
- Cada autocarro mostra uma rota diferente (cores diferentes)
- Trajetos diferentes no mapa
- Paragens diferentes ao longo da rota

### Cálculos
- **Distância**: Calculada somando distâncias entre paragens da via
- **Tempo**: Baseado na distância e velocidade (45 km/h para chegada, 30 km/h para viagem)
- **Preço**: 10 MT por quilómetro (mínimo 10 MT)

## Verificação

Para verificar os resultados:
```bash
cd transport-client
node verify-unique-routes.js
```

Isto mostra:
- Nome e código de cada via
- Distância, tempo e preço de cada rota
- Lista de paragens para cada rota
- Confirmação que todos os autocarros têm vias únicas

## Impacto no Frontend

**Nenhuma alteração necessária no código frontend!** ✅

O código existente já:
- ✅ Calcula distância baseado nas paragens da via
- ✅ Calcula tempo baseado na distância
- ✅ Calcula preço baseado na distância
- ✅ Mostra trajeto no mapa da via
- ✅ Exibe nome e direcção da via

## Princípio Chave

**Cada autocarro pode ter a mesma origem e destino, mas DEVE ter uma via (rota) diferente com ruas e paragens diferentes.**

Isto garante:
- ✅ Diversidade realista de rotas
- ✅ Tempos e distâncias diferentes
- ✅ Preços variados
- ✅ Visualizações únicas no mapa
- ✅ Melhor experiência do utilizador

## Para Aplicar a Outras Rotas

Se encontrar outras rotas com autocarros duplicados:

1. Identifique a rota com autocarros duplicados
2. Desenhe trajetos alternativos com ruas/paragens diferentes
3. Actualize o script com as novas configurações de rota
4. Execute o script para criar vias e reatribuir autocarros

## Ficheiros Criados

1. **create-multiple-vias-for-route.js** - Script principal
2. **transport-client/create-multiple-vias-for-route.js** - Cópia para execução
3. **transport-client/verify-unique-routes.js** - Script de verificação
4. **MULTIPLE_VIAS_SOLUTION.md** - Documentação técnica completa
5. **TASK_9_COMPLETE.md** - Este resumo

## Status Final

✅ **COMPLETO** - Todos os 3 autocarros Magoanine-Baixa agora têm rotas únicas com características diferentes.

## Próximos Passos

1. ✅ Testar no frontend para verificar que os autocarros mostram informações diferentes
2. Aplicar a mesma solução a outras rotas se necessário
3. Considerar criar mais variações de rota para rotas populares
4. Actualizar posições dos autocarros para reflectir as suas rotas específicas

## Nota Importante

Este era um **problema de base de dados**, não um problema de código. O código frontend já estava correcto e preparado para lidar com vias diferentes. Só precisávamos de criar as vias únicas na base de dados e atribuir cada autocarro a uma via diferente.

---

**Data**: 5 de Maio de 2026
**Status**: ✅ Completo e Verificado
