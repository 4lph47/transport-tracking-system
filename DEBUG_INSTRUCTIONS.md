# Instruções de Debug - "Nenhum transporte disponível"

## O que foi feito

Adicionei logs de debug temporários na API de buses para identificar por que está mostrando "Nenhum transporte disponível".

## Como testar

### 1. Certifique-se que o servidor está rodando
```bash
cd transport-client
npm run dev
```

### 2. Abra o navegador e faça uma busca
- Selecione: Município → Rota → Origem → Destino
- Clique em "Pesquisar Transportes"

### 3. Verifique os logs no terminal do servidor

Os logs vão mostrar:

```
🔍 === BUSES API CALLED ===
   paragemId (origem): [ID da origem]
   destinoId: [ID do destino]
   viaIds: [IDs das vias]

📊 Found X transportes in database
   Sample: [Matrícula] on via [Nome da via]

🚌 Checking [Matrícula]:
   Via: [Nome]
   Origem index: [número] (looking for [ID])
   Destino index: [número] (looking for [ID])
   ✅ VALID: Passes through origem (X) → destino (Y)
   OU
   ❌ REJECTED: [motivo]

📊 FINAL RESULT: X valid buses
```

## O que procurar nos logs

### Cenário 1: Nenhum transporte encontrado no banco
```
📊 Found 0 transportes in database
```
**Problema**: As vias não têm transportes atribuídos
**Solução**: Verificar se os IDs das vias estão corretos

### Cenário 2: Transportes encontrados mas rejeitados
```
📊 Found 1 transportes in database
🚌 Checking BUS-XXX:
   ❌ REJECTED: Bus doesn't pass through both stops
```
**Problema**: O transporte não passa pelas paragens selecionadas
**Solução**: Verificar se as paragens pertencem à via

### Cenário 3: Direção errada
```
🚌 Checking BUS-XXX:
   ❌ REJECTED: Wrong direction (origem=5, destino=2)
```
**Problema**: Usuário selecionou destino antes da origem
**Solução**: Usuário deve selecionar na ordem correta da rota

### Cenário 4: IDs não encontrados
```
🚌 Checking BUS-XXX:
   Origem index: -1 (looking for [ID])
   Destino index: 3 (looking for [ID])
   ❌ REJECTED: Bus doesn't pass through both stops
```
**Problema**: A paragem de origem não existe na via do transporte
**Solução**: Verificar mapeamento de paragens nas vias

## Próximos passos

1. **Faça o teste** e copie os logs do terminal
2. **Cole os logs** aqui para análise
3. Vou identificar o problema exato e corrigir

## Informações úteis para coletar

Quando aparecer "Nenhum transporte disponível", anote:
- Município selecionado
- Rota selecionada (Terminal A → Terminal B)
- Origem selecionada
- Destino selecionado
- Logs completos do terminal do servidor

---

**Nota**: Estes logs são temporários para debug. Após identificar o problema, vou removê-los.
