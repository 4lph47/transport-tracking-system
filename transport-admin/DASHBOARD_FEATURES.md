# Dashboard Analítico Profissional - TransportMZ Admin

## 🎨 Visão Geral

O dashboard foi completamente redesenhado com gráficos profissionais e visualizações interactivas para fornecer insights detalhados sobre o sistema de transportes.

## 📊 Funcionalidades Principais

### 1. **Cartões de Estatísticas (KPI Cards)**
- **Total de Transportes** - Com tendência de crescimento
- **Proprietários** - Número de proprietários registados
- **Vias Activas** - Rotas em operação
- **Paragens** - Pontos de paragem registados

Cada cartão inclui:
- Ícone colorido com animação hover
- Valor actual
- Percentagem de mudança vs. período anterior
- Indicador visual de tendência (↑ ou ↓)

### 2. **Gráfico de Desempenho Mensal (Area Chart)**
- Visualização de transportes e viagens nos últimos 6 meses
- Gráfico de área com gradiente
- Comparação entre múltiplas métricas
- Tooltip interactivo com detalhes

**Dados exibidos:**
- Número de transportes por mês
- Número de viagens realizadas
- Tendências de crescimento

### 3. **Distribuição de Tipos de Transporte (Pie Chart)**
- Gráfico circular mostrando categorias
- Percentagens por tipo:
  - Autocarros (45%)
  - Minibus (35%)
  - Táxis (15%)
  - Outros (5%)
- Legenda com cores distintas
- Labels directos no gráfico

### 4. **Viagens Semanais (Bar Chart)**
- Gráfico de barras por dia da semana
- Identifica dias de maior movimento
- Barras com cantos arredondados
- Cores consistentes com o tema

**Insights:**
- Sábado é o dia com mais viagens (320)
- Domingo tem menos movimento (150)
- Dias úteis mantêm média de 200-240 viagens

### 5. **Transportes por Província**
- Cards individuais por província
- Barra de progresso visual
- Número absoluto e percentagem
- Hover effects para melhor UX
- Layout responsivo em grid

### 6. **Actividade Recente**
- Feed em tempo real de eventos
- Indicadores coloridos por tipo:
  - 🟢 Verde: Sucesso
  - 🔵 Azul: Informação
  - 🟠 Laranja: Aviso
  - 🔴 Vermelho: Erro
- Timestamp relativo (há X minutos)
- Detalhes de cada actividade

### 7. **Cards de Estatísticas Rápidas**
Três cards com gradientes coloridos:

**Motoristas Activos**
- Fundo azul gradiente
- Total de motoristas registados
- Ícone de utilizador

**Taxa de Ocupação**
- Fundo verde gradiente
- Percentagem média: 78%
- Ícone de gráfico de barras

**Viagens Hoje**
- Fundo roxo gradiente
- Contador em tempo real: 1,247
- Ícone de tendência crescente

## 🎯 Controlos e Filtros

### Barra Superior
- **Selector de Período**: 7 dias, 30 dias, 3 meses, Este ano
- **Botão Exportar**: Download de relatórios
- **Botão Actualizar**: Refresh manual dos dados

## 🎨 Design e UX

### Paleta de Cores
- **Azul** (#3B82F6): Transportes, principal
- **Verde** (#10B981): Sucesso, ocupação
- **Roxo** (#8B5CF6): Viagens, secundário
- **Laranja** (#F59E0B): Avisos, táxis
- **Cinza** (#64748B): Texto, bordas

### Animações e Transições
- Hover effects em todos os cards
- Transições suaves (300ms)
- Scale effects nos ícones
- Smooth scrolling

### Responsividade
- **Mobile**: 1 coluna
- **Tablet**: 2 colunas
- **Desktop**: 3-4 colunas
- Grid adaptativo para todos os componentes

## 📈 Biblioteca de Gráficos

**Recharts** - Biblioteca React para gráficos
- Area Chart (Gráfico de Área)
- Bar Chart (Gráfico de Barras)
- Pie Chart (Gráfico Circular)
- Line Chart (Gráfico de Linhas)

### Características dos Gráficos
- Totalmente responsivos
- Tooltips interactivos
- Legendas customizadas
- Gradientes e cores personalizadas
- Animações suaves

## 🔄 Actualização de Dados

### API Endpoint
`GET /api/dashboard/stats`

**Resposta:**
```json
{
  "stats": {
    "transportes": 67,
    "proprietarios": 45,
    "vias": 23,
    "paragens": 156,
    "motoristas": 89
  },
  "provinceData": [
    {
      "name": "Maputo",
      "count": 45,
      "percentage": 67
    }
  ]
}
```

### Loading State
- Spinner animado durante carregamento
- Mensagem "A carregar dashboard..."
- Transição suave quando dados carregam

## 🚀 Melhorias Futuras

### Próximas Funcionalidades
1. **Filtros Avançados**
   - Por província
   - Por tipo de transporte
   - Por período customizado

2. **Gráficos Adicionais**
   - Mapa de calor geográfico
   - Gráfico de linha temporal
   - Comparação ano a ano

3. **Exportação**
   - PDF com relatórios
   - Excel com dados brutos
   - Imagens dos gráficos

4. **Notificações em Tempo Real**
   - WebSocket para updates live
   - Alertas de eventos importantes
   - Dashboard em tempo real

5. **Personalização**
   - Temas claro/escuro
   - Widgets arrastáveis
   - Dashboards customizados por utilizador

## 📱 Compatibilidade

- ✅ Chrome/Edge (últimas versões)
- ✅ Firefox (últimas versões)
- ✅ Safari (últimas versões)
- ✅ Mobile browsers
- ✅ Tablets

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Gráficos e visualizações
- **Prisma** - ORM para base de dados
- **React Hooks** - State management

## 📝 Notas de Desenvolvimento

### Instalação de Dependências
```bash
npm install recharts
```

### Estrutura de Ficheiros
```
transport-admin/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # Dashboard principal
│   │   └── layout.tsx        # Layout do dashboard
│   ├── api/
│   │   └── dashboard/
│   │       └── stats/
│   │           └── route.ts  # API endpoint
│   └── components/
│       ├── Sidebar.tsx       # Menu lateral
│       └── Header.tsx        # Cabeçalho
```

### Performance
- Lazy loading de componentes
- Memoização de cálculos pesados
- Optimização de re-renders
- Cache de dados da API

---

**Versão:** 2.0.0  
**Última Actualização:** 2026-05-05  
**Desenvolvido por:** TransportMZ Team
