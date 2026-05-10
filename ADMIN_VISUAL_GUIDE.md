# Admin Panel - Visual Navigation Guide

## 🎯 Quick Access Map

```
Landing Page (/)
    │
    ├─→ [Admin Button] → Admin Login (/admin/login)
    │                         │
    │                         └─→ Admin Dashboard (/admin)
    │                                   │
    │                                   ├─→ 🚌 Gerir Autocarros (/admin/buses) ✅ FULL CRUD + MAP
    │                                   ├─→ 🛣️ Gerir Vias (/admin/routes) 🚧 Placeholder
    │                                   ├─→ 📍 Gerir Paragens (/admin/stops) ✅ FULL CRUD + MAP
    │                                   ├─→ 🏙️ Gerir Municípios (/admin/municipalities) 🚧 Placeholder
    │                                   ├─→ 👥 Utilizadores (/admin/users) 🚧 Placeholder
    │                                   └─→ 📊 Relatórios (/admin/reports) 🚧 Placeholder
    │
    └─→ [Entrar Button] → Auth Page (/auth)
```

## 📱 Page Layouts

### 1. Landing Page
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Transportes Moçambique    [Admin Button] 🔧 │
│                                                      │
│                                                      │
│              🗺️ FULL SCREEN MAP                     │
│           (Shows buses in real-time)                │
│                                                      │
│                                                      │
│                  [Entrar Button]                    │
└─────────────────────────────────────────────────────┘
```

### 2. Admin Dashboard
```
┌─────────────────────────────────────────────────────┐
│ [← Voltar] Painel de Administração    [Ver Site] [Sair] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Bem-vindo ao Painel de Administração               │
│  Selecione uma opção abaixo para gerir o sistema    │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 🚌       │  │ 🛣️       │  │ 📍       │         │
│  │ Gerir    │  │ Gerir    │  │ Gerir    │         │
│  │Autocarros│  │  Vias    │  │ Paragens │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 🏙️       │  │ 👥       │  │ 📊       │         │
│  │ Gerir    │  │Utilizador│  │Relatórios│         │
│  │Municípios│  │   es     │  │          │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ Total   │ │ Total   │ │ Total   │ │Utilizad.│ │
│  │Autocarr.│ │  Vias   │ │ Paragens│ │         │ │
│  │   --    │ │   --    │ │   --    │ │   --    │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
└─────────────────────────────────────────────────────┘
```

### 3. Buses Management (CRUD + Map)
```
┌─────────────────────────────────────────────────────┐
│ [← Voltar] Gerir Autocarros    [+ Novo Autocarro]  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │                  │  │                  │       │
│  │   🗺️ MAP        │  │  📋 FORM/LIST   │       │
│  │                  │  │                  │       │
│  │  Shows all buses │  │  • Create new   │       │
│  │  Click to edit   │  │  • Edit existing│       │
│  │  Click map to    │  │  • Delete       │       │
│  │  set location    │  │  • View list    │       │
│  │                  │  │                  │       │
│  │  🚌 🚌 🚌       │  │  Fields:        │       │
│  │                  │  │  - Matrícula    │       │
│  │                  │  │  - Via          │       │
│  │                  │  │  - Lat/Long     │       │
│  │                  │  │  - Status       │       │
│  │                  │  │  - Capacidade   │       │
│  │                  │  │                  │       │
│  └──────────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### 4. Stops Management (CRUD + Map)
```
┌─────────────────────────────────────────────────────┐
│ [← Voltar] Gerir Paragens      [+ Nova Paragem]    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │                  │  │                  │       │
│  │   🗺️ MAP        │  │  📋 FORM/LIST   │       │
│  │                  │  │                  │       │
│  │  Shows all stops │  │  • Create new   │       │
│  │  Click to edit   │  │  • Edit existing│       │
│  │  Click map to    │  │  • Delete       │       │
│  │  set location    │  │  • View list    │       │
│  │                  │  │                  │       │
│  │  📍 📍 📍       │  │  Fields:        │       │
│  │  ⚫ = Terminal   │  │  - Nome         │       │
│  │  ⚪ = Stop       │  │  - Código       │       │
│  │                  │  │  - Lat/Long     │       │
│  │                  │  │  - Is Terminal? │       │
│  │                  │  │  - Vias (multi) │       │
│  │                  │  │                  │       │
│  └──────────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────┘
```

## 🎨 Color Scheme

### Admin Dashboard Cards
- **Buses**: Blue gradient (`from-blue-500 to-blue-600`)
- **Routes**: Green gradient (`from-green-500 to-green-600`)
- **Stops**: Purple gradient (`from-purple-500 to-purple-600`)
- **Municipalities**: Orange gradient (`from-orange-500 to-orange-600`)
- **Users**: Pink gradient (`from-pink-500 to-pink-600`)
- **Reports**: Indigo gradient (`from-indigo-500 to-indigo-600`)

### Map Markers
- **Buses**: Blue circle with 🚌 emoji
- **Selected Bus**: Red circle with 🚌 emoji
- **Regular Stop**: Gray circle (small)
- **Terminal**: Dark gray circle (larger)
- **Selected Stop**: Red circle

### Status Colors
- **Active/Ativo**: Green (`text-green-600`)
- **Inactive/Inativo**: Red (`text-red-600`)
- **Maintenance/Manutenção**: Yellow (`text-yellow-600`)

## 🔄 User Flow Examples

### Example 1: Adding a New Bus
```
1. Click "Admin" on landing page
2. Login with admin/admin123
3. Click "Gerir Autocarros" card
4. Click "Novo Autocarro" button
5. Fill in form:
   - Matrícula: "AAA-123-MZ"
   - Via: Select from dropdown
   - Click on map to set location
   - Status: "ativo"
   - Capacidade: 50
6. Click "Criar"
7. ✅ Bus appears on map and in list
```

### Example 2: Editing a Stop
```
1. Navigate to Admin Dashboard
2. Click "Gerir Paragens" card
3. Click on a stop marker on the map (or in list)
4. Form opens with current data
5. Modify fields:
   - Change name
   - Click new location on map
   - Toggle "É um terminal?"
   - Select/deselect vias
6. Click "Atualizar"
7. ✅ Stop updates on map
```

### Example 3: Deleting an Item
```
1. Navigate to management page (Buses or Stops)
2. Click on item to edit
3. Form opens
4. Click "Eliminar" button
5. Confirm deletion in popup
6. ✅ Item removed from map and list
```

## 📊 Dashboard Statistics

The dashboard shows real-time counts:
- **Total Autocarros**: Number of buses in system
- **Total Vias**: Number of routes
- **Total Paragens**: Number of stops
- **Utilizadores**: Number of registered users

## 🔐 Authentication Flow

```
Landing Page
    ↓
Click "Admin"
    ↓
Login Page (/admin/login)
    ↓
Enter: admin / admin123
    ↓
✅ Stored in localStorage
    ↓
Redirect to Dashboard
    ↓
All admin pages check localStorage
    ↓
If not found → Redirect to login
```

## 💡 Tips for Users

### Map Interaction
- **Zoom**: Use mouse wheel or +/- buttons
- **Pan**: Click and drag
- **Set Location**: Click anywhere when form is open
- **Edit Item**: Click on marker
- **Center on Item**: Click item in list

### Form Tips
- **Required Fields**: Marked with *
- **Coordinates**: Auto-filled from map clicks
- **Multiple Selection**: For vias in stops, check multiple boxes
- **Cancel**: Closes form without saving
- **Delete**: Only available when editing

### Navigation
- **Back Button**: Returns to previous page
- **Logo/Title**: Click to return to dashboard
- **Breadcrumbs**: Shows current location

## 🎯 Quick Reference

| Action | Shortcut |
|--------|----------|
| Access Admin | Click "Admin" button on landing page |
| Login | admin / admin123 |
| Create New | Click "+ Novo" button |
| Edit Item | Click on marker or list item |
| Delete Item | Open edit form → Click "Eliminar" |
| Cancel Edit | Click "Cancelar" |
| Set Location | Click on map when form is open |
| Return to Dashboard | Click "← Voltar ao Painel" |
| Logout | Click "Sair" |

## 📱 Responsive Design

All admin pages are responsive:
- **Desktop**: Side-by-side map and form
- **Tablet**: Stacked layout
- **Mobile**: Full-width stacked layout

## ✅ Checklist for Testing

- [ ] Can access admin panel from landing page
- [ ] Can login with demo credentials
- [ ] Dashboard cards redirect correctly
- [ ] Can create new bus
- [ ] Can edit existing bus
- [ ] Can delete bus
- [ ] Can create new stop
- [ ] Can edit existing stop
- [ ] Can delete stop
- [ ] Map markers appear correctly
- [ ] Map click sets coordinates
- [ ] Form validation works
- [ ] Can logout successfully
