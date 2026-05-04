# 🚀 Admin Panel - Quick Reference

## Access
**URL**: http://localhost:3001

## Start Server
```bash
cd transport-admin
npm run dev
```

## Pages

| Page | URL | Status |
|------|-----|--------|
| Dashboard | `/dashboard` | ✅ Complete |
| Transportes | `/transportes` | ✅ Complete |
| Vias | `/vias` | ✅ Complete |
| Paragens | `/paragens` | ✅ Complete |
| Proprietários | `/proprietarios` | ⏳ Pending |
| Motoristas | `/motoristas` | ⏳ Pending |
| Províncias | `/provincias` | ⏳ Pending |
| Municípios | `/municipios` | ⏳ Pending |
| Relatórios | `/relatorios` | ⏳ Pending |

## Features

### ✅ Dashboard
- Real-time stats (transportes, proprietários, vias, paragens, motoristas)
- Province distribution chart
- Recent activity feed
- Quick action cards

### ✅ Transportes
- Full list with search
- Stats cards (Total, Em Circulação, Parados, Manutenção)
- Relationships: motorista, proprietário, via
- Action buttons: Ver, Editar, Eliminar

### ✅ Vias
- Full list with search
- Route information (partida → chegada)
- Color indicators
- Paragens and transportes count

### ✅ Paragens
- Full list with search
- Stats cards (Total, Terminais, Regulares)
- Type indicators (Terminal vs Paragem)
- Associated vias with badges

## Design

### Colors
- **Primary**: Blue-600
- **Background**: Slate-50
- **Sidebar**: Slate-900
- **Success**: Green-600
- **Warning**: Yellow-600
- **Error**: Red-600

### Components
- **Sidebar**: Dark, gradient logo, active states
- **Header**: Search, notifications, profile
- **Cards**: White, rounded, shadow
- **Tables**: Professional, hover effects
- **Buttons**: Blue primary, icon-based actions

## Database

### Models
- Transporte
- Via
- Paragem
- Proprietario
- Motorista
- Provincia
- Municipio

### API Endpoints
- `/api/dashboard/stats` - Dashboard data
- `/api/transportes` - All transportes
- `/api/vias` - All vias
- `/api/paragens` - All paragens

## Tech Stack
- Next.js 16.2.4 (Turbopack)
- Prisma (SQLite)
- Tailwind CSS 4
- TypeScript
- React 19

## Status
✅ **PROFESSIONAL AND READY!**

---

**Need help?** Check:
- `ADMIN_PANEL_PROFESSIONAL.md` - Full documentation
- `ADMIN_VISUAL_GUIDE.md` - Visual design guide
- `ADMIN_COMPLETE_SUMMARY.md` - Complete summary
