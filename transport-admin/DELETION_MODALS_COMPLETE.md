# Deletion Modals Implementation - Complete ✅

## Overview
Implemented beautiful confirmation modals with dynamic association handling for proprietário and motorista deletion, replacing the old `confirm()` dialogs.

## Implementation Pattern

### Modal Behavior
1. **First click "Eliminar"** → Opens modal, attempts DELETE
2. **If no associations** → Simple confirmation modal with "Eliminar" button
3. **If has associations** → Modal changes dynamically:
   - Title changes to "Remover Associações"
   - Icon changes to red gradient background
   - Shows error message with association details
   - Button changes to "Remover e Eliminar" (red background)
   - Clicking calls DELETE with `?force=true` to remove associations and delete

### Frontend Implementation

#### States Required
```typescript
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleting, setDeleting] = useState(false);
const [deleteError, setDeleteError] = useState<string | null>(null);
const [hasAssociations, setHasAssociations] = useState(false);
```

#### Functions Required
```typescript
async function handleDelete() {
  setDeleting(true);
  setDeleteError(null);
  setHasAssociations(false);
  
  try {
    const response = await fetch(`/api/[entity]/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      showNotification('Eliminado com sucesso!', 'success');
      setTimeout(() => router.push('/[entities]'), 1500);
    } else {
      const error = await response.json();
      
      // Check if error is about associations
      if (error.error && error.error.includes('[association keyword]')) {
        setDeleteError(error.details || error.error);
        setHasAssociations(true);
      } else {
        showNotification(error.error || 'Erro ao eliminar', 'error');
        setShowDeleteModal(false);
      }
    }
  } catch (error) {
    showNotification('Erro ao eliminar', 'error');
    setShowDeleteModal(false);
  } finally {
    setDeleting(false);
  }
}

async function handleRemoveAssociationsAndDelete() {
  setDeleting(true);
  
  try {
    const response = await fetch(`/api/[entity]/${id}?force=true`, {
      method: 'DELETE',
    });

    if (response.ok) {
      showNotification('Eliminado com sucesso!', 'success');
      setTimeout(() => router.push('/[entities]'), 1500);
    } else {
      const error = await response.json();
      showNotification(error.error || 'Erro ao eliminar', 'error');
    }
  } catch (error) {
    showNotification('Erro ao eliminar', 'error');
  } finally {
    setDeleting(false);
    setShowDeleteModal(false);
  }
}
```

#### Button
```tsx
<button 
  onClick={() => setShowDeleteModal(true)}
  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center space-x-2"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
  <span>Eliminar</span>
</button>
```

### Backend Implementation

#### DELETE Endpoint Pattern
```typescript
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';
    
    // Check if entity exists and has associations
    const entity = await prisma.[entity].findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            [associations]: true,
          },
        },
      },
    });

    if (!entity) {
      return NextResponse.json(
        { error: 'Entidade não encontrada' },
        { status: 404 }
      );
    }

    // Check associations
    if (entity._count.[associations] > 0 && !force) {
      const text = entity._count.[associations] === 1 ? 'singular' : 'plural';
      return NextResponse.json(
        { 
          error: `Esta entidade tem ${entity._count.[associations]} ${text} associados.`,
          details: `Esta entidade tem ${entity._count.[associations]} ${text} associados.`
        },
        { status: 400 }
      );
    }

    // If force=true, remove associations first
    if (force && entity._count.[associations] > 0) {
      // Remove associations (set FK to null or delete join table records)
      await prisma.[associationTable].deleteMany({
        where: { [entityId]: params.id },
      });
    }

    // Delete entity
    await prisma.[entity].delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao eliminar:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao eliminar',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
```

## Completed Implementations

### ✅ Proprietário
- **File**: `transport-admin/app/proprietarios/[id]/page.tsx`
- **API**: `transport-admin/app/api/proprietarios/[id]/route.ts`
- **Associations**: Transportes (many-to-many via `TransporteProprietario`)
- **Force delete**: Removes all `TransporteProprietario` records

### ✅ Motorista
- **File**: `transport-admin/app/motoristas/[id]/page.tsx`
- **API**: `transport-admin/app/api/motoristas/[id]/route.ts`
- **Associations**: Transporte (one-to-one via `transporteId`)
- **Force delete**: Sets `transporteId = null` before deletion

### ✅ Município
- **File**: `transport-admin/app/municipios/[id]/page.tsx`
- **API**: `transport-admin/app/api/municipios/[id]/route.ts`
- **Associations**: Vias (one-to-many via `municipioId`)
- **Force delete**: Sets `municipioId = null` on all vias

### ✅ Província
- **File**: `transport-admin/app/provincias/[id]/page.tsx`
- **API**: `transport-admin/app/api/provincias/[id]/route.ts`
- **Associations**: Municípios (one-to-many via `provinciaId`)
- **Force delete**: Sets `provinciaId = null` on all municípios

### ✅ Transporte
- **File**: `transport-admin/app/transportes/[id]/page.tsx`
- **API**: Already implemented in previous task
- **Associations**: Motorista + Proprietários
- **Force delete**: Sets `motoristaId = null` and removes all `TransporteProprietario` records

### ✅ Paragem
- **File**: `transport-admin/app/paragens/[id]/page.tsx`
- **API**: Already implemented in previous task
- **Associations**: None (can be deleted directly)

## Modal Design

### Normal Mode (No Associations)
- **Icon**: Red circle with warning icon
- **Title**: "Eliminar [Entity]"
- **Message**: "Tem certeza que deseja eliminar [entity name]? Esta ação não pode ser desfeita."
- **Buttons**: 
  - "Cancelar" (gray border)
  - "Eliminar" (red background)

### Association Mode (Has Associations)
- **Icon**: Red gradient background (from-red-50 to-red-100/30)
- **Title**: "Remover Associações"
- **Message**: Error details from backend
- **Warning**: "Clique em 'Remover e Eliminar' para remover as associações e eliminar [entity]."
- **Buttons**:
  - "Cancelar" (gray border)
  - "Remover e Eliminar" (red background)

## Grammar Rules
- Use singular/plural correctly:
  - 1 transporte / 2 transportes
  - 1 município / 2 municípios
  - 1 via / 2 vias
  - 1 proprietário / 2 proprietários

## Color Scheme
- **Black/Gray**: Primary UI elements
- **Red**: Delete actions and warnings
- **White**: Backgrounds and text on dark elements

## Testing Checklist
- [ ] Click "Eliminar" without associations → Shows simple confirmation
- [ ] Click "Eliminar" with associations → Shows association error
- [ ] Modal changes to "Remover Associações" mode
- [ ] Click "Remover e Eliminar" → Removes associations and deletes
- [ ] Loading states work correctly
- [ ] Error messages display properly
- [ ] Success notification shows
- [ ] Redirects to list page after deletion
- [ ] Grammar is correct (singular/plural)

## Notes
- All modals use the same pattern for consistency
- Backend always checks for `?force=true` parameter
- Associations are removed (FK set to null or join table records deleted) before entity deletion
- No `confirm()` dialogs anywhere - all use beautiful modals
- Modal prevents closing during deletion (deleting state)
