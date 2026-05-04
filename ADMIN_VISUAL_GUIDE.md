# Admin Panel - Visual Guide

## 🎨 Design Overview

The admin panel features a modern, professional design with a dark sidebar and clean white content area.

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR (Dark Slate-900)    │  HEADER (White)                  │
│  ┌──────────────────────┐    │  ┌────────────────────────────┐ │
│  │ 🔷 TransportMZ       │    │  │ 🔍 Search | 🔔 (2) | 👤 A  │ │
│  │    Admin Panel       │    │  └────────────────────────────┘ │
│  ├──────────────────────┤    │                                  │
│  │ 🏠 Dashboard    ✓    │    │  CONTENT AREA (Slate-50)        │
│  │ 🚐 Transportes       │    │  ┌────────────────────────────┐ │
│  │ 🛣️  Vias             │    │  │  Dashboard                  │ │
│  │ 📍 Paragens          │    │  │  Visão geral do sistema     │ │
│  │ 👥 Proprietários     │    │  ├────────────────────────────┤ │
│  │ 👤 Motoristas        │    │  │  [Stats Cards]              │ │
│  │ 🌍 Províncias        │    │  │  [Charts]                   │ │
│  │ 🏛️  Municípios       │    │  │  [Activity Feed]            │ │
│  │ 📊 Relatórios        │    │  └────────────────────────────┘ │
│  ├──────────────────────┤    │                                  │
│  │ 🟢 Sistema Online    │    │                                  │
│  │    Versão 1.0.0      │    │                                  │
│  └──────────────────────┘    │                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Dashboard Page

### Stats Cards (4 cards in a row)
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 🚐 Blue         │  │ 👥 Green        │  │ 🛣️  Purple      │  │ 📍 Orange       │
│ Total de        │  │ Proprietários   │  │ Vias Activas    │  │ Paragens        │
│ Transportes     │  │                 │  │                 │  │                 │
│ 245        +12% │  │ 87         +5%  │  │ 32         +8%  │  │ 156        +3%  │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Province Distribution Chart
```
┌──────────────────────────────────────────────────────────┐
│ Transportes por Província                    Ver todos → │
├──────────────────────────────────────────────────────────┤
│ Maputo                                98 transportes (40%)│
│ ████████████████████████████████████████                 │
│                                                           │
│ Nampula                               56 transportes (23%)│
│ ███████████████████████                                  │
│                                                           │
│ Sofala                                45 transportes (18%)│
│ ██████████████████                                       │
│                                                           │
│ Gaza                                  46 transportes (19%)│
│ ███████████████████                                      │
└──────────────────────────────────────────────────────────┘
```

### Quick Action Cards
```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 🔵 Blue Gradient    │  │ 🟢 Green Gradient   │  │ 🟣 Purple Gradient  │
│ Motoristas Activos  │  │ Taxa de Ocupação    │  │ Viagens Hoje        │
│ 87                  │  │ 78%                 │  │ 1,247               │
│ Motoristas no       │  │ Média de ocupação   │  │ Viagens realizadas  │
│ sistema             │  │ dos transportes     │  │ hoje                │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 🚐 Transportes Page

### Mini Stats
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 🚐 Total     │  │ ✅ Em Circ.  │  │ ⚠️  Parados   │  │ 🔧 Manutenção│
│ 245          │  │ 171          │  │ 49           │  │ 25           │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Table
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Pesquisar por matrícula, modelo ou via...                    🔽 Filtros     │
├────────────┬──────────────┬────────────┬──────────────┬─────────┬────────┬────┤
│ Matrícula  │ Modelo/Marca │ Motorista  │ Proprietário │ Via     │ Lotação│ ⚙️  │
├────────────┼──────────────┼────────────┼──────────────┼─────────┼────────┼────┤
│ 🚐 AAA-123 │ Toyota       │ Pedro      │ João Silva   │ Costa   │ 45     │ 👁️  │
│ Código: 1  │ Hiace        │ Cossa      │              │ do Sol  │ lugares│ ✏️  │
│            │              │            │              │         │        │ 🗑️  │
├────────────┼──────────────┼────────────┼──────────────┼─────────┼────────┼────┤
│ 🚐 BBB-456 │ Mercedes     │ Manuel     │ Maria Santos │ Av.     │ 50     │ 👁️  │
│ Código: 2  │ Sprinter     │ Sitoe      │              │ Julius  │ lugares│ ✏️  │
│            │              │            │              │         │        │ 🗑️  │
└────────────┴──────────────┴────────────┴──────────────┴─────────┴────────┴────┘
│ Mostrando 245 de 245 transportes                          ◀ 1 2 3 ▶           │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📍 Paragens Page

### Stats
```
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ 📍 Total de Paragens │  │ 🏛️  Terminais        │  │ ✅ Paragens Regulares│
│ 156                  │  │ 32                   │  │ 124                  │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

### Table
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Pesquisar paragem por nome ou código...                                     │
├──────────────────┬────────────────────┬──────────┬──────────────────┬─────────┤
│ Paragem          │ Vias               │ Tipo     │ Coordenadas      │ ⚙️       │
├──────────────────┼────────────────────┼──────────┼──────────────────┼─────────┤
│ 🟣 Terminal      │ [Costa do Sol]     │ Terminal │ -25.9692,        │ 🗺️  ✏️  │
│ Costa do Sol     │ [Matola-Maputo]    │          │ 32.5732          │ 🗑️      │
│ Código: TCS-001  │                    │          │                  │         │
├──────────────────┼────────────────────┼──────────┼──────────────────┼─────────┤
│ 🔵 Paragem       │ [Costa do Sol]     │ Paragem  │ -25.9612,        │ 🗺️  ✏️  │
│ Sommerschield    │                    │          │ 32.5832          │ 🗑️      │
│ Código: PSM-002  │                    │          │                  │         │
└──────────────────┴────────────────────┴──────────┴──────────────────┴─────────┘
```

---

## 🛣️ Vias Page

### Table
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Pesquisar via...                                                             │
├────────┬──────────────┬──────────┬────────────────────┬─────┬─────────┬────────┤
│ Código │ Nome da Via  │ Município│ Rota               │ Cor │ Paragens│ ⚙️      │
├────────┼──────────────┼──────────┼────────────────────┼─────┼─────────┼────────┤
│ VCS-01 │ Costa do Sol │ Maputo   │ Terminal → Baixa   │ 🔵  │ 12      │ 🗺️  ✏️ │
│        │              │          │                    │     │ 25 🚐   │ 🗑️     │
├────────┼──────────────┼──────────┼────────────────────┼─────┼─────────┼────────┤
│ VMM-02 │ Matola-      │ Matola   │ Matola → Maputo    │ 🟢  │ 18      │ 🗺️  ✏️ │
│        │ Maputo       │          │                    │     │ 30 🚐   │ 🗑️     │
└────────┴──────────────┴──────────┴────────────────────┴─────┴─────────┴────────┘
```

---

## 🎨 Color Palette

### Primary Colors
- **Blue-600**: `#2563EB` - Primary actions, active states
- **Slate-900**: `#0F172A` - Sidebar background
- **Slate-50**: `#F8FAFC` - Content background
- **White**: `#FFFFFF` - Cards, header

### Status Colors
- **Green-600**: `#16A34A` - Success, active
- **Yellow-600**: `#CA8A04` - Warning, paused
- **Red-600**: `#DC2626` - Error, maintenance
- **Purple-600**: `#9333EA` - Terminals, special
- **Orange-600**: `#EA580C` - Info, stops

### Text Colors
- **Slate-900**: `#0F172A` - Headings
- **Slate-700**: `#334155` - Labels
- **Slate-600**: `#475569` - Body text
- **Slate-500**: `#64748B` - Secondary text
- **Slate-400**: `#94A3B8` - Placeholder text

---

## 🔤 Typography

### Font Sizes
- **3xl**: Dashboard titles (30px)
- **2xl**: Stat numbers (24px)
- **lg**: Section headings (18px)
- **base**: Body text (16px)
- **sm**: Labels, secondary (14px)
- **xs**: Captions, badges (12px)

### Font Weights
- **Bold**: Headings, numbers (700)
- **Semibold**: Labels, active items (600)
- **Medium**: Buttons, table headers (500)
- **Regular**: Body text (400)

---

## 🎭 Interactive States

### Buttons
```
Normal:    bg-blue-600 text-white
Hover:     bg-blue-700 shadow-lg
Active:    bg-blue-800
Disabled:  bg-slate-300 cursor-not-allowed
```

### Table Rows
```
Normal:    bg-white
Hover:     bg-slate-50
Selected:  bg-blue-50 border-l-4 border-blue-600
```

### Sidebar Items
```
Normal:    text-slate-300
Hover:     bg-slate-800 text-white
Active:    bg-blue-600 text-white shadow-lg shadow-blue-600/50
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (4 columns for stats)

---

## ✨ Animations

- **Transitions**: 200ms ease-in-out
- **Hover effects**: Scale, shadow, color
- **Loading**: Spin animation
- **Progress bars**: Width transition 500ms
- **Pulse**: System status indicator

---

## 🎯 Key Features

✅ **Professional Design** - Modern, clean, corporate look
✅ **Real Data** - Connected to Prisma database
✅ **SVG Icons** - No emojis, professional icons throughout
✅ **Responsive** - Works on all screen sizes
✅ **Interactive** - Hover effects, transitions, animations
✅ **Consistent** - Same design language across all pages
✅ **Accessible** - Proper contrast, focus states
✅ **Fast** - Optimized with Next.js and Turbopack

---

## 🚀 Access

**URL**: http://localhost:3001
**Pages**:
- Dashboard: `/dashboard`
- Transportes: `/transportes`
- Vias: `/vias`
- Paragens: `/paragens`
- Proprietários: `/proprietarios`
- Motoristas: `/motoristas`
- Províncias: `/provincias`
- Municípios: `/municipios`
- Relatórios: `/relatorios`

---

**Status**: ✅ COMPLETE AND PROFESSIONAL!
