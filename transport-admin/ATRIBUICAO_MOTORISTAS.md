# Sistema de Atribuição de Motoristas

## 🎯 Problema Identificado

**106 transportes estão sem motorista atribuído**

Cada transporte deve ter um motorista único para operar. O sistema agora fornece uma interface dedicada para resolver este problema de forma eficiente.

---

## ✨ Solução Implementada

### 1. **Nova Página de Atribuição**
**URL**: `/motoristas/atribuir`

Uma interface dedicada que permite:
- Ver todos os transportes sem motorista
- Ver todos os motoristas disponíveis (ativos e sem transporte)
- Atribuir motoristas aos transportes de forma visual e intuitiva

### 2. **API de Atribuição**
**Endpoint**: `/api/motoristas/atribuir`

#### GET - Buscar Dados
Retorna:
- Lista de transportes sem motorista (com informações da via)
- Lista de motoristas disponíveis (ativos e sem transporte)
- Estatísticas completas

#### POST - Atribuir Motorista
Parâmetros:
```json
{
  "motoristaId": "string",
  "transporteId": "string"
}
```

Validações:
- ✅ Motorista existe e está ativo
- ✅ Motorista não está atribuído a outro transporte
- ✅ Transporte existe e não tem motorista
- ✅ Atribuição é única (1 motorista = 1 transporte)

#### DELETE - Remover Atribuição
Parâmetros:
```json
{
  "motoristaId": "string"
}
```

Remove a atribuição do motorista, libertando-o para outro transporte.

---

## 📊 Interface da Página

### Header
```
┌─────────────────────────────────────────────────────┐
│ Atribuir Motoristas              [← Voltar ao Dashboard] │
│ Atribua motoristas disponíveis aos transportes...   │
└─────────────────────────────────────────────────────┘
```

### Estatísticas (5 cards)
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  Total   │  Ativos  │   Com    │Disponíveis│   Sem    │
│Motoristas│          │Transporte│           │ Motorista│
│    XX    │    XX    │    XX    │    XX     │    XX    │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

### Duas Colunas Principais

#### Coluna Esquerda: Transportes sem Motorista
```
┌─────────────────────────────────────────┐
│ Transportes sem Motorista (106)         │
│ [Pesquisar...]                          │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ AAA-1234-MP              #1001      │ │
│ │ Toyota Hiace                        │ │
│ │ 🔵 Via Maputo-Matola               │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ BBB-5678-MP              #1002      │ │
│ │ Mercedes Sprinter                   │ │
│ │ 🟢 Via Circular Maputo             │ │
│ └─────────────────────────────────────┘ │
│ ...                                     │
└─────────────────────────────────────────┘
```

#### Coluna Direita: Motoristas Disponíveis
```
┌─────────────────────────────────────────┐
│ Motoristas Disponíveis (45)             │
│ [Pesquisar...]                          │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [JS] João Silva                     │ │
│ │      BI: 110203456789A              │ │
│ │      Carta: CC-2023-001234          │ │
│ │      Tel: +258 84 123 4567          │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [MC] Maria Costa                    │ │
│ │      BI: 110204567890B              │ │
│ │      Carta: CC-2023-002345          │ │
│ │      Tel: +258 85 234 5678          │ │
│ └─────────────────────────────────────┘ │
│ ...                                     │
└─────────────────────────────────────────┘
```

### Botão de Ação
```
┌─────────────────────────────────────────────────────┐
│ Selecione um transporte e um motorista              │
│ Selecione ambos para continuar                      │
│                                  [Atribuir Motorista]│
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Funcionalidades

### 1. **Seleção Visual**
- Clique em um transporte para selecioná-lo (borda azul)
- Clique em um motorista para selecioná-lo (borda verde)
- Feedback visual claro do que está selecionado

### 2. **Pesquisa em Tempo Real**
**Transportes**: Pesquise por:
- Matrícula
- Modelo
- Marca
- Código
- Nome da via

**Motoristas**: Pesquise por:
- Nome
- BI
- Carta de condução
- Telefone

### 3. **Validações Automáticas**
- ✅ Botão desabilitado até selecionar ambos
- ✅ Verifica se motorista está disponível
- ✅ Verifica se transporte está sem motorista
- ✅ Previne atribuições duplicadas
- ✅ Apenas motoristas ativos são listados

### 4. **Feedback Imediato**
- Loading state durante atribuição
- Mensagem de sucesso
- Mensagem de erro se algo falhar
- Atualização automática da lista após atribuição

### 5. **Alertas Inteligentes**
Se não houver motoristas disponíveis:
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Não há motoristas disponíveis para atribuição   │
│                                                      │
│ Todos os motoristas ativos já estão atribuídos.     │
│ Registe novos motoristas ou liberte existentes.     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Atribuição

```
1. Aceder à página /motoristas/atribuir
   ↓
2. Ver lista de transportes sem motorista (106)
   ↓
3. Ver lista de motoristas disponíveis
   ↓
4. Pesquisar/filtrar (opcional)
   ↓
5. Selecionar um transporte (clique)
   ↓
6. Selecionar um motorista (clique)
   ↓
7. Clicar em "Atribuir Motorista"
   ↓
8. Sistema valida e atribui
   ↓
9. Listas atualizam automaticamente
   ↓
10. Repetir até todos terem motorista
```

---

## 📱 Acesso Rápido

### Do Dashboard
Quando há transportes sem motorista, aparece um alerta com botão:

```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Atenção: 106 transportes estão sem motorista    │
│ Cada transporte deve ter um motorista único.        │
│                            [Atribuir Motoristas] →  │
└─────────────────────────────────────────────────────┘
```

Clique no botão para ir direto à página de atribuição.

---

## 🎯 Benefícios

### 1. **Eficiência**
- Interface visual intuitiva
- Pesquisa rápida
- Atribuição em poucos cliques
- Sem necessidade de digitar IDs

### 2. **Segurança**
- Validações automáticas
- Previne erros
- Garante relação 1:1
- Apenas motoristas ativos

### 3. **Visibilidade**
- Estatísticas em tempo real
- Ver todos os transportes sem motorista
- Ver todos os motoristas disponíveis
- Feedback claro

### 4. **Usabilidade**
- Design limpo e profissional
- Responsivo (mobile, tablet, desktop)
- Loading states
- Mensagens claras

---

## 🔧 Estrutura Técnica

### Ficheiros Criados

1. **`app/api/motoristas/atribuir/route.ts`**
   - GET: Buscar dados
   - POST: Atribuir motorista
   - DELETE: Remover atribuição

2. **`app/motoristas/atribuir/page.tsx`**
   - Interface de atribuição
   - Seleção visual
   - Pesquisa e filtros

3. **`app/dashboard/page.tsx`** (atualizado)
   - Botão "Atribuir Motoristas" no alerta

### Queries do Banco de Dados

```typescript
// Transportes sem motorista
prisma.transporte.findMany({
  where: { motorista: null },
  include: { via: { select: { nome: true, cor: true } } }
})

// Motoristas disponíveis
prisma.motorista.findMany({
  where: { 
    status: 'ativo',
    transporteId: null 
  }
})

// Atribuir motorista
prisma.motorista.update({
  where: { id: motoristaId },
  data: { transporteId: transporteId }
})
```

---

## 📊 Estatísticas Rastreadas

- **Total Motoristas**: Todos os motoristas no sistema
- **Motoristas Ativos**: Com status "ativo"
- **Com Transporte**: Motoristas já atribuídos
- **Disponíveis**: Ativos e sem transporte
- **Sem Motorista**: Transportes sem motorista atribuído

---

## 🚀 Como Usar

### Passo 1: Aceder à Página
```
http://localhost:3000/motoristas/atribuir
```

Ou clique no botão "Atribuir Motoristas" no alerta do dashboard.

### Passo 2: Selecionar Transporte
- Navegue pela lista ou use a pesquisa
- Clique no transporte desejado
- Borda azul indica seleção

### Passo 3: Selecionar Motorista
- Navegue pela lista ou use a pesquisa
- Clique no motorista desejado
- Borda verde indica seleção

### Passo 4: Confirmar Atribuição
- Clique no botão "Atribuir Motorista"
- Aguarde confirmação
- Listas atualizam automaticamente

### Passo 5: Repetir
- Continue até todos os transportes terem motorista
- Acompanhe o progresso nas estatísticas

---

## ✅ Resultado Esperado

Após usar esta ferramenta:
- ✅ Todos os 106 transportes terão motorista atribuído
- ✅ Cada motorista estará em apenas 1 transporte
- ✅ Sistema operacional e completo
- ✅ Dashboard sem alertas de atenção

---

## 📝 Notas Importantes

1. **Relação 1:1**: O schema garante que cada motorista só pode estar em 1 transporte
2. **Apenas Ativos**: Só motoristas com status "ativo" aparecem
3. **Validação Dupla**: Sistema valida no frontend e backend
4. **Atualização Automática**: Listas atualizam após cada atribuição
5. **Reversível**: Atribuições podem ser removidas se necessário

---

## 🎉 Conclusão

O sistema de atribuição de motoristas fornece uma solução completa e profissional para resolver o problema dos 106 transportes sem motorista. Com interface intuitiva, validações robustas e feedback claro, o processo de atribuição é rápido, seguro e eficiente.

**Próximo passo**: Acesse `/motoristas/atribuir` e comece a atribuir motoristas! 🚀
