# CRUD Standardization - Implementation Summary

## Current Status

Based on the audit, here's what needs to be done:

### ✅ Already Compliant
1. **Vias** - Reference standard (100% complete)
2. **Transportes** - Fixed (100% complete)

### 🔧 Needs Fixes

#### **Proprietários** (Critical)
Issues:
- ❌ Using `alert()` for success/error messages
- ❌ No toast notification system
- ❌ No delete confirmation modal
- ⚠️ Data fetching may not handle pagination

Required Changes:
1. Add notification state and toast component
2. Add delete modal state and component
3. Replace `alert()` with `showNotification()`
4. Add `confirmDelete()` function
5. Update `handleDelete()` with loading state
6. Fix data fetching to handle pagination
7. Update delete button to call `confirmDelete()`

#### **Motoristas** (Critical)
Issues:
- ❌ Using `alert()` for success/error messages
- ❌ No toast notification system
- ❌ No delete confirmation modal
- ✅ Data fetching already fixed

Required Changes:
1. Add notification state and toast component
2. Add delete modal state and component
3. Replace `alert()` with `showNotification()`
4. Add `confirmDelete()` function
5. Update `handleDelete()` with loading state
6. Update delete button to call `confirmDelete()`

#### **Paragens** (High Priority)
Issues:
- ✅ No alerts (good!)
- ✅ Has notifications
- ❌ No delete confirmation modal

Required Changes:
1. Add delete modal state and component
2. Add `confirmDelete()` function
3. Update `handleDelete()` with modal flow
4. Update delete button to call `confirmDelete()`

#### **Municípios** (Medium Priority)
Issues:
- ✅ Has notifications
- ❌ No delete confirmation modal
- ❌ Missing `/api/municipios/[id]/route.ts`

Required Changes:
1. Create `/api/municipios/[id]/route.ts` with GET, PATCH, DELETE
2. Add delete modal state and component
3. Add `confirmDelete()` function
4. Update delete button to call `confirmDelete()`

#### **Províncias** (Medium Priority)
Issues:
- ✅ Has notifications
- ❌ No delete confirmation modal
- ❌ Missing both API routes

Required Changes:
1. Create `/api/provincias/route.ts` with GET, POST
2. Create `/api/provincias/[id]/route.ts` with GET, PATCH, DELETE
3. Add delete modal state and component
4. Add `confirmDelete()` function
5. Update delete button to call `confirmDelete()`

## Implementation Approach

Given the scope, I recommend:

### Option 1: Systematic Fix (Recommended)
Fix each entity one at a time in priority order:
1. Proprietários (30 min)
2. Motoristas (20 min)
3. Paragens (15 min)
4. Municípios (25 min - includes API)
5. Províncias (30 min - includes APIs)

**Total Time: ~2 hours**

### Option 2: Template-Based Batch Fix
Create reusable components and apply to all:
1. Create shared DeleteModal component
2. Create shared NotificationToast component
3. Create shared hooks (useNotification, useDeleteModal)
4. Apply to all entities

**Total Time: ~2.5 hours (more maintainable long-term)**

## Recommended Next Steps

1. **Immediate**: Fix Proprietários and Motoristas (critical, user-facing)
2. **Short-term**: Fix Paragens (high usage)
3. **Medium-term**: Fix Municípios and Províncias (admin-only, less frequent)

## Code Template

### Standard State Setup
```typescript
const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null);
const [deleting, setDeleting] = useState(false);
```

### Standard Helper Functions
```typescript
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  setNotification({ message, type });
  setTimeout(() => setNotification(null), 3000);
};

const confirmDelete = (id: string, name: string) => {
  setItemToDelete({ id, name });
  setShowDeleteModal(true);
};
```

### Standard Delete Handler
```typescript
async function handleDelete(id: string) {
  setDeleting(true);
  try {
    const response = await fetch(`/api/entity/${id}`, { method: 'DELETE' });
    if (response.ok) {
      showNotification('Item eliminado com sucesso!', 'success');
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchItems();
    } else {
      showNotification('Erro ao eliminar item', 'error');
    }
  } catch (error) {
    showNotification('Erro ao eliminar item', 'error');
  } finally {
    setDeleting(false);
  }
}
```

## Would you like me to:
A) Fix all entities systematically (one by one, starting with Proprietários)?
B) Create shared components first, then apply to all?
C) Focus on just the critical ones (Proprietários + Motoristas)?

Please confirm which approach you prefer, and I'll proceed with the implementation.
