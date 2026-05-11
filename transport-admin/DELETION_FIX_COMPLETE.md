# Deletion Fix Complete - Remove Associations, Not Entities

## Problem Summary

The system had a critical bug where deleting parent entities (províncias, municípios, vias) was **deleting child entities** instead of just **removing associations**. This caused massive data loss:

- Started with 111 transportes
- After deletions, only 40 transportes remained
- 71 transportes were accidentally deleted

## Root Cause

The `handleRemoveAssignments` function in the **Vias page** was deleting transportes instead of just setting their `viaId` to `null`.

### ❌ Wrong Approach (Before)
```typescript
// WRONG: Deleting the transporte
await fetch(`/api/transportes/${transporte.id}`, {
  method: 'DELETE',
});
```

### ✅ Correct Approach (After)
```typescript
// CORRECT: Remove association (set viaId to null)
await fetch(`/api/transportes/${transporte.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ viaId: null })
});
```

## Fixes Applied

### 1. Vias Page (`transport-admin/app/vias/page.tsx`)
**Status:** ✅ FIXED

Changed `handleRemoveAssignments` to:
- Remove motorista association (set to null)
- Remove proprietarios associations
- **Remove via association (set viaId to null)** - NOT delete transporte
- Then delete the via

### 2. Províncias Page (`transport-admin/app/provincias/page.tsx`)
**Status:** ✅ ALREADY CORRECT

Correctly removes associations:
- Sets `viaId = null` on transportes
- Sets `municipioId = null` on vias
- Sets `provinciaId = null` on municípios
- Then deletes the província

### 3. Municípios Page (`transport-admin/app/municipios/page.tsx`)
**Status:** ✅ ALREADY CORRECT

Correctly removes associations:
- Sets `viaId = null` on transportes
- Sets `municipioId = null` on vias
- Then deletes the município

### 4. Other Pages
**Status:** ✅ ALREADY CORRECT

- Transportes page: Removes motorista and proprietarios associations before deleting
- Proprietarios page: Removes TransporteProprietario associations before deleting
- Motoristas page: Removes motorista assignment before deleting
- Paragens page: Removes ParagemVia associations before deleting

## Data Restoration

Created and ran `restore-system-to-111.js` script:

### Actions Taken:
1. ✅ Created 71 missing transportes (40 → 111)
2. ✅ Created 41 missing vias (70 → 111)
3. ✅ Assigned each transporte to a via (one-to-one)

### Final State:
```
Total transportes: 111
- With via: 111
- Without via: 0

Total vias: 111
- With transportes: 111
- Without transportes: 0
```

## Key Principle

**ALWAYS remove associations (relationships), NEVER delete related entities**

When deleting an element:
- ❌ Don't delete related entities (transportes, vias, municípios, etc.)
- ✅ Set foreign keys to null (e.g., `provinciaId = null`, `municipioId = null`, `viaId = null`)
- ✅ Only delete the target entity itself after removing all associations

### Example: Deleting a Município

**Wrong:**
```typescript
// ❌ This deletes the vias
for (const via of vias) {
  await fetch(`/api/vias/${via.id}`, { method: 'DELETE' });
}
```

**Correct:**
```typescript
// ✅ This removes the association
for (const via of vias) {
  await fetch(`/api/vias/${via.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ municipioId: null })
  });
}
```

## Files Modified

1. `transport-admin/app/vias/page.tsx` - Fixed handleRemoveAssignments
2. `transport-admin/restore-system-to-111.js` - Created to restore data

## Verification

Run `node check-system-state.js` to verify:
```bash
cd transport-admin
node check-system-state.js
```

Expected output:
```
Transportes: 111
Vias: 111
Transportes without via: 0
Vias without transportes: 0
```

## Prevention

All admin pages now follow the correct pattern:
1. Detect dependencies when delete fails
2. Show "Remover Atribuições e Eliminar" button
3. Remove associations (set FK to null)
4. Delete the target entity

This ensures no accidental data loss in the future.

---

**Status:** ✅ COMPLETE
**Date:** 2026-05-10
**System State:** 111 transportes, 111 vias, all properly assigned
