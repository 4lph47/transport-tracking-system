# Client Side Issue Diagnosis

## Problem
- Only 1 via showing in Maputo
- No stops (paragens) showing in client side

## Root Cause

### Issue 1: All Maputo vias have the same route name
All 21 vias in Maputo have:
- **Terminal Partida**: "Terminal A"
- **Terminal Chegada**: "Terminal B"

The client groups vias by route (terminalPartida → terminalChegada), so all 21 vias appear as ONE route: "Terminal A → Terminal B"

### Issue 2: Maputo vias have NO paragens
- **Maputo**: 21 vias, 0 paragens assigned
- **Matola**: 90 vias, 70 have paragens, 20 don't

The API `/api/available-routes` only returns vias that have:
1. Buses assigned ✅ (all 111 vias have buses)
2. Paragens assigned ❌ (41 vias don't have paragens)

When a via has no paragens, it doesn't show in the client because users can't select origin/destination stops.

## Diagnostic Results

```
📊 Total vias: 111

✅ Vias com transportes: 111
❌ Vias sem transportes: 0
✅ Vias com paragens: 70
❌ Vias sem paragens: 41
```

### Maputo Vias (All without paragens):
- Rota 71 (VIA-071) - Terminal A → Terminal B - 0 paragens
- Rota 73 (VIA-073) - Terminal A → Terminal B - 0 paragens
- Rota 75 (VIA-075) - Terminal A → Terminal B - 0 paragens
- ... (18 more with same pattern)

### Matola Vias (Examples with paragens):
- Rua Dos Bons Amigos - Antena (V086) - 57 paragens ✅
- Moamba - Avenida 4 de Outubro (V047) - 84 paragens ✅
- Rua Principal - Rua Do Circulo de Tsalala - Rua 15 (V044) - 30 paragens ✅

## Solutions

### Solution 1: Assign Paragens to Maputo Vias
You need to assign paragens (stops) to the Maputo vias in the admin panel:

1. Go to admin panel → Vias
2. Select a Maputo via (e.g., Rota 71)
3. Click "Editar"
4. Assign paragens to the via
5. Repeat for all 21 Maputo vias

### Solution 2: Fix Terminal Names
The Maputo vias all have generic names "Terminal A → Terminal B". You should:

1. Update `terminalPartida` and `terminalChegada` with real terminal names
2. This will make routes distinguishable in the client
3. Example: "Praça dos Trabalhadores → Aeroporto"

### Solution 3: Bulk Assignment Script
Create a script to bulk-assign paragens to vias based on their geographic path.

## Why This Happens

The client search flow:
1. User selects Município → Shows vias with buses AND paragens
2. User selects Via → Shows paragens for that via
3. User selects Origem → Shows destinos after origem
4. User searches → Shows buses

If a via has no paragens, it can't show in step 1, so users can't search for buses on that route.

## Admin Credentials

✅ **Admin created successfully!**

```
📧 Email: admin@transportmz.com
🔑 Senha: Admin@2026
👤 Nome: Super Administrador
🆔 ID: cmozto78b0000oz0f3td8ynzm
```

Access: http://localhost:3000/login

## Next Steps

1. ✅ Login to admin panel with credentials above
2. ❌ Assign paragens to Maputo vias (21 vias need paragens)
3. ❌ Update terminal names for Maputo vias (currently all "Terminal A → Terminal B")
4. ❌ Verify vias show correctly in client after paragens are assigned

## Scripts Created

- `check-vias-buses.js` - Diagnostic script to check vias, buses, and paragens
- `reset-bus-locations.js` - Reset all bus locations to start of via (pending DB connection)
- `create-admin.js` - Create admin user (✅ completed)

## Files Modified

### User Info Page:
- `transport-client/app/user-info/page.tsx` - Complete rewrite with sidebar
- `transport-client/app/api/user/[id]/route.ts` - Added PUT method
- `transport-client/app/api/user/[id]/change-password/route.ts` - New endpoint
- `transport-client/app/api/user/missions/route.ts` - New endpoint

### Admin Authentication:
- `transport-admin/app/login/page.tsx` - Login page
- `transport-admin/app/api/auth/admin/login/route.ts` - Login API
- `transport-admin/app/contexts/AuthContext.tsx` - Auth context
- `transport-admin/app/layout.tsx` - Added AuthProvider
- `transport-admin/app/page.tsx` - Added redirect logic
- `transport-admin/app/components/Header.tsx` - Admin dropdown
- `transport-admin/app/components/Sidebar.tsx` - Administradores menu

## Summary

The client is working correctly - it's just that Maputo vias don't have paragens assigned yet. Once you assign paragens to the Maputo vias in the admin panel, they will show up in the client search.

The Matola vias work fine because they have paragens assigned (70 out of 90 vias have paragens).
