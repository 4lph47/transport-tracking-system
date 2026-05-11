# Mapa 3D - Melhorias Implementadas

## ✨ Novas Funcionalidades

### 1. **Seleção Exclusiva de Rotas** 🎯

Quando você seleciona uma via, **apenas essa via é mostrada** no mapa.

#### Comportamento:

**Antes:**
```
Mapa mostra todas as rotas:
🔵 Rota 11 ─────────
🟢 Rota 17 ─────────
🟣 Rota 20 ─────────  ← Selecionada (mais grossa)
🟠 Rota 21 ─────────
```

**Depois:**
```
Mapa mostra apenas a rota selecionada:

🟣 Rota 20 ═════════  ← Única visível
```

#### Como Funciona:

1. **Clique numa via** na lista à esquerda
2. **Todas as outras rotas desaparecem**
3. **Rota selecionada** fica destacada (linha mais grossa)
4. **Zoom automático** para a rota
5. **Clique novamente** para mostrar todas as rotas

#### Código:
```typescript
if (selectedVia) {
  viasData.forEach((via) => {
    if (via.id === selectedVia) {
      // Mostrar e destacar rota selecionada
      map.setLayoutProperty(`route-${via.id}`, 'visibility', 'visible');
      map.setPaintProperty(`route-${via.id}`, 'line-width', 6);
      map.setPaintProperty(`route-${via.id}`, 'line-opacity', 1);
    } else {
      // Esconder outras rotas
      map.setLayoutProperty(`route-${via.id}`, 'visibility', 'none');
    }
  });
} else {
  // Mostrar todas as rotas
  viasData.forEach((via) => {
    map.setLayoutProperty(`route-${via.id}`, 'visibility', 'visible');
    map.setPaintProperty(`route-${via.id}`, 'line-width', 4);
    map.setPaintProperty(`route-${via.id}`, 'line-opacity', 0.7);
  });
}
```

---

### 2. **Mapa Inclinado (3D View)** 🏢

O mapa agora tem **inclinação de 45°** para ver os prédios em 3D.

#### Configuração:

```typescript
map = new maplibregl.Map({
  container: mapContainer.current,
  center: [32.5892, -25.9655],
  zoom: 11,
  pitch: 45,  // ← Inclinação de 45°
  bearing: 0
});
```

#### Visual:

**Antes (Vista de Cima):**
```
┌─────────────────┐
│                 │
│   🏢 🏢 🏢     │  ← Prédios vistos de cima
│                 │
│   ═══════       │  ← Rota
└─────────────────┘
```

**Depois (Vista Inclinada):**
```
     ╱─────────────╲
    ╱               ╲
   │   🏢           │  ← Prédios com altura visível
   │  ╱│╲          │
   │ ╱ │ ╲         │
   │   ═══════     │  ← Rota em perspectiva
   └───────────────┘
```

---

### 3. **Prédios 3D com Altura Real** 🏗️

Adicionada camada de prédios 3D usando dados do OpenFreeMap.

#### Características:

- ✅ **Altura real** dos prédios (quando disponível)
- ✅ **Extrusão 3D** - prédios têm volume
- ✅ **Cor cinza** (#d1d5db) para não distrair das rotas
- ✅ **Opacidade 80%** para suavidade
- ✅ **Visível a partir do zoom 15**

#### Código:
```typescript
map.addLayer({
  'id': '3d-buildings',
  'source': 'openmaptiles',
  'source-layer': 'building',
  'type': 'fill-extrusion',
  'minzoom': 15,
  'paint': {
    'fill-extrusion-color': '#d1d5db',
    'fill-extrusion-height': [
      'case',
      ['has', 'render_height'],
      ['get', 'render_height'],
      5  // Altura padrão: 5 metros
    ],
    'fill-extrusion-base': [
      'case',
      ['has', 'render_min_height'],
      ['get', 'render_min_height'],
      0
    ],
    'fill-extrusion-opacity': 0.8
  }
});
```

---

## 🎮 Como Usar

### Visualizar Prédios 3D:

1. **Zoom in** no mapa (zoom 15+)
2. **Prédios aparecem** com altura
3. **Inclinação de 45°** permite ver a altura
4. **Navegue** com mouse/touch

### Selecionar Rota:

1. **Clique numa via** na lista à esquerda
2. **Outras rotas desaparecem**
3. **Rota selecionada** fica em destaque
4. **Zoom automático** para a rota
5. **Clique novamente** para voltar ao normal

### Controles do Mapa:

- **Zoom**: Scroll do mouse ou botões +/-
- **Pan**: Arrastar com mouse
- **Rotação**: Ctrl + arrastar
- **Inclinação**: Shift + arrastar (ajustar pitch)

---

## 📊 Comparação Visual

### Estado Normal (Todas as Rotas):
```
┌─────────────────────────────────────┐
│  Mapa Inclinado 45°                 │
│                                     │
│  🏢 🏢                              │
│  ╱│╲╱│╲                             │
│                                     │
│  🔵 ═══════  Rota 11                │
│  🟢 ═══════  Rota 17                │
│  🟣 ═══════  Rota 20                │
│  🟠 ═══════  Rota 21                │
│                                     │
│  [Zoom +/-] [Rotação]               │
└─────────────────────────────────────┘
```

### Estado Selecionado (Uma Rota):
```
┌─────────────────────────────────────┐
│  Mapa Inclinado 45° (Zoom In)       │
│                                     │
│     🏢 🏢 🏢                        │
│    ╱│╲╱│╲╱│╲                        │
│                                     │
│  🟣 ═══════════════  Rota 20        │
│     (Única visível)                 │
│                                     │
│  [Zoom +/-] [Rotação]               │
└─────────────────────────────────────┘
```

---

## 🎨 Detalhes Técnicos

### Pitch (Inclinação):
- **Valor**: 45° (0° = vista de cima, 60° = máximo)
- **Mantido durante zoom**: Sim
- **Ajustável**: Sim (Shift + arrastar)

### Prédios 3D:
- **Fonte**: OpenFreeMap (openmaptiles)
- **Layer**: 'building'
- **Tipo**: fill-extrusion
- **Zoom mínimo**: 15
- **Cor**: #d1d5db (cinza claro)
- **Opacidade**: 80%

### Visibilidade de Rotas:
- **Propriedade**: `visibility`
- **Valores**: 'visible' | 'none'
- **Transição**: Instantânea

### Estilo de Rotas:
- **Normal**: 4px largura, 70% opacidade
- **Selecionada**: 6px largura, 100% opacidade
- **Escondida**: visibility = 'none'

---

## ✅ Benefícios

### Seleção Exclusiva:
- ✅ **Foco total** na rota selecionada
- ✅ **Sem distrações** de outras rotas
- ✅ **Visualização clara** do trajeto
- ✅ **Zoom automático** otimizado

### Mapa 3D:
- ✅ **Contexto urbano** - veja onde estão os prédios
- ✅ **Altura real** - entenda a topografia
- ✅ **Perspectiva realista** - como ver de um drone
- ✅ **Profissional** - tecnologia moderna

---

## 🚀 Resultado Final

Um mapa **interativo**, **3D** e **focado** que:
- ✅ Mostra apenas a rota selecionada
- ✅ Tem inclinação de 45° para ver prédios
- ✅ Exibe prédios 3D com altura real
- ✅ Usa OSRM para rotas realistas
- ✅ Zoom automático inteligente
- ✅ Controles completos de navegação

**O mapa agora é uma ferramenta profissional de visualização geográfica!** 🗺️
