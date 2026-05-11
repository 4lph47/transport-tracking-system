# Cards Interativos - Dashboard

## 🎯 Funcionalidade Implementada

Todos os cards de estatísticas no dashboard agora são **clicáveis** e redirecionam para as páginas de gestão correspondentes.

---

## 📊 Cards Interativos

### 1. **Card de Transportes** 🚌
- **Clique**: Redireciona para `/transportes`
- **Cor**: Azul (`#3B82F6`)
- **Hover**: 
  - Sombra aumentada
  - Borda azul
  - Ícone de seta aparece
  - Número muda para azul
  - Texto "Clique para gerir →"

### 2. **Card de Motoristas** 👤
- **Clique**: Redireciona para `/motoristas`
- **Cor**: Verde (`#10B981`)
- **Hover**:
  - Sombra aumentada
  - Borda verde
  - Ícone de seta aparece
  - Número muda para verde
  - Texto "Clique para gerir →"

### 3. **Card de Vias** 🛣️
- **Clique**: Redireciona para `/vias`
- **Cor**: Roxo (`#8B5CF6`)
- **Hover**:
  - Sombra aumentada
  - Borda roxa
  - Ícone de seta aparece
  - Número muda para roxo
  - Texto "Clique para gerir →"

### 4. **Card de Paragens** 📍
- **Clique**: Redireciona para `/paragens`
- **Cor**: Laranja (`#F59E0B`)
- **Hover**:
  - Sombra aumentada
  - Borda laranja
  - Ícone de seta aparece
  - Número muda para laranja
  - Texto "Clique para gerir →"

### 5. **Card de Proprietários** 👥
- **Clique**: Redireciona para `/proprietarios`
- **Cor**: Índigo (`#6366F1`)
- **Hover**:
  - Sombra aumentada
  - Borda índigo
  - Número muda para índigo
  - Texto "Clique para gerir →"

---

## 🎨 Efeitos Visuais

### Estado Normal
```
┌─────────────────────┐
│ 🚌                  │
│                     │
│ Transportes         │
│ 111                 │
│                     │
└─────────────────────┘
```

### Estado Hover
```
┌─────────────────────┐ ← Sombra aumentada
│ 🚌              →   │ ← Seta aparece
│                     │
│ Transportes         │
│ 111 (azul)          │ ← Número colorido
│ Clique para gerir → │ ← Texto de ação
└─────────────────────┘
  ↑ Borda colorida
```

---

## 🔧 Implementação Técnica

### Estrutura HTML
```tsx
<a
  href="/transportes"
  className="bg-white rounded-lg border border-slate-200 p-6 
             hover:shadow-lg hover:border-blue-300 
             transition-all duration-300 cursor-pointer group"
>
  {/* Conteúdo do card */}
</a>
```

### Classes CSS Utilizadas

#### Container
- `hover:shadow-lg` - Sombra aumentada no hover
- `hover:border-blue-300` - Borda colorida no hover
- `transition-all duration-300` - Transição suave (300ms)
- `cursor-pointer` - Cursor de mão
- `group` - Permite efeitos em elementos filhos

#### Ícone Principal
- `group-hover:bg-blue-100` - Fundo mais escuro no hover

#### Ícone de Seta
- `group-hover:text-blue-600` - Cor no hover
- Posicionado no canto superior direito

#### Número
- `group-hover:text-blue-600` - Muda de cor no hover

#### Texto de Ação
- `group-hover:text-blue-600` - Aparece colorido no hover
- Texto: "Clique para gerir →"

---

## 📱 Responsividade

### Desktop (> 1024px)
- 4 cards em linha (grid-cols-4)
- Hover effects completos
- Transições suaves

### Tablet (768px - 1024px)
- 2 cards por linha (grid-cols-2)
- Hover effects mantidos

### Mobile (< 768px)
- 1 card por linha (grid-cols-1)
- Tap effects (mobile touch)

---

## 🎯 Benefícios

### Usabilidade
- ✅ **Navegação intuitiva** - Clique direto no card
- ✅ **Feedback visual** - Hover mostra que é clicável
- ✅ **Ação clara** - Texto "Clique para gerir"
- ✅ **Consistente** - Todos os cards funcionam igual

### Design
- ✅ **Profissional** - Transições suaves
- ✅ **Moderno** - Efeitos de hover elegantes
- ✅ **Cores consistentes** - Cada seção tem sua cor
- ✅ **Minimalista** - Não sobrecarrega visualmente

### Performance
- ✅ **Rápido** - Transições CSS nativas
- ✅ **Leve** - Sem JavaScript adicional
- ✅ **Acessível** - Links semânticos (`<a>`)

---

## 🔗 Rotas de Navegação

| Card | Rota | Página |
|------|------|--------|
| Transportes | `/transportes` | Gestão de Transportes |
| Motoristas | `/motoristas` | Gestão de Motoristas |
| Vias | `/vias` | Gestão de Vias |
| Paragens | `/paragens` | Gestão de Paragens |
| Proprietários | `/proprietarios` | Gestão de Proprietários |

---

## 🎨 Paleta de Cores

| Elemento | Cor Normal | Cor Hover | Hex |
|----------|------------|-----------|-----|
| Transportes | Azul claro | Azul | `#3B82F6` |
| Motoristas | Verde claro | Verde | `#10B981` |
| Vias | Roxo claro | Roxo | `#8B5CF6` |
| Paragens | Laranja claro | Laranja | `#F59E0B` |
| Proprietários | Índigo claro | Índigo | `#6366F1` |

---

## 💡 Detalhes de Interação

### Transições
- **Duração**: 300ms
- **Easing**: `ease-in-out` (padrão)
- **Propriedades**: `all` (cor, sombra, borda)

### Hover States
1. **Sombra**: `shadow-sm` → `shadow-lg`
2. **Borda**: `border-slate-200` → `border-[color]-300`
3. **Ícone fundo**: `bg-[color]-50` → `bg-[color]-100`
4. **Número**: `text-slate-900` → `text-[color]-600`
5. **Seta**: `text-slate-400` → `text-[color]-600`
6. **Texto ação**: `text-slate-400` → `text-[color]-600`

### Cursor
- **Normal**: Cursor padrão
- **Hover**: Cursor de mão (`cursor-pointer`)

---

## 📊 Exemplo Visual Completo

```
ANTES (Estático):
┌──────────┬──────────┬──────────┬──────────┐
│🚌        │👤        │🛣️        │📍        │
│Transportes│Motoristas│  Vias   │ Paragens │
│   111     │   111    │   111   │   1411   │
└──────────┴──────────┴──────────┴──────────┘

DEPOIS (Interativo):
┌──────────┬──────────┬──────────┬──────────┐
│🚌      → │👤      → │🛣️      → │📍      → │
│Transportes│Motoristas│  Vias   │ Paragens │
│   111     │   111    │   111   │   1411   │
│Clique →  │Clique →  │Clique →  │Clique →  │
└──────────┴──────────┴──────────┴──────────┘
   ↑ Hover mostra seta e texto de ação
```

---

## ✅ Resultado

Cards agora são **totalmente interativos** com:
- ✅ Clique para navegar
- ✅ Hover effects elegantes
- ✅ Feedback visual claro
- ✅ Transições suaves
- ✅ Cores consistentes
- ✅ Texto de ação
- ✅ Ícone de seta
- ✅ Acessibilidade (links semânticos)

**Experiência do usuário melhorada significativamente!** 🎉
