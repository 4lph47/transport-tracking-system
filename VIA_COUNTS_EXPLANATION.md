# Via Counts Showing Zero - Explanation

## The Issue

When viewing vias in the admin panel, many show:
- **Paragens: 0**
- **Transportes: 0**

## Root Cause

This is **NOT a display bug**. The counts are correct - these vias genuinely have no data assigned to them.

### Database Analysis

Out of **221 total vias**:
- ✅ **110 vias have data** (paragens and transportes assigned)
- ❌ **111 vias have NO data** (0 paragens, 0 transportes)

### Vias WITH Data (Examples)
- VIA-001 to VIA-110: All have paragens (ranging from 4 to 103) and transportes (1-2 each)
- Examples:
  - VIA-075: 89 paragens, 1 transporte
  - VIA-072: 103 paragens, 1 transporte
  - VIA-001: 40 paragens, 2 transportes

### Vias WITHOUT Data
- The remaining 111 vias (likely VIA-111 onwards or test vias)
- These were created but never had:
  - ViaParagem entries (junction table linking vias to stops)
  - Transporte records with viaId set

## Why This Happened

These empty vias were likely created as:
1. **Test data** during development
2. **Placeholder routes** that were never completed
3. **Duplicate entries** that should be removed

## Solutions

### Option 1: Delete Empty Vias (Recommended)
Remove vias that have no paragens or transportes:

```javascript
// Delete vias with no data
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteEmptyVias() {
  const vias = await prisma.via.findMany({
    include: {
      _count: {
        select: {
          paragens: true,
          transportes: true,
        },
      },
    },
  });

  const emptyVias = vias.filter(v => v._count.paragens === 0 && v._count.transportes === 0);
  
  console.log(`Found ${emptyVias.length} empty vias to delete`);
  
  for (const via of emptyVias) {
    await prisma.via.delete({
      where: { id: via.id },
    });
    console.log(`Deleted: ${via.codigo} - ${via.nome}`);
  }
  
  console.log('Done!');
  await prisma.$disconnect();
}

deleteEmptyVias();
```

### Option 2: Assign Data to Empty Vias
If these vias are legitimate routes that need data:
1. Create ViaParagem entries to link stops to the via
2. Create or update Transporte records with the correct viaId

### Option 3: Hide Empty Vias in UI
Filter out vias with no data in the frontend:

```typescript
const viasWithData = vias.filter(via => 
  via._count && (via._count.paragens > 0 || via._count.transportes > 0)
);
```

## Current Display Code

The display code is working correctly:

```typescript
{via._count && (
  <div className="flex gap-4 mt-2">
    <span className="text-xs text-blue-600 font-semibold">
      Paragens: {via._count.paragens}
    </span>
    <span className="text-xs text-green-600 font-semibold">
      Transportes: {via._count.transportes}
    </span>
  </div>
)}
```

It correctly displays the actual counts from the database.

## Recommendation

**Delete the empty vias** to clean up the database and improve the user experience. Users won't see confusing "0" counts anymore.

Run the deletion script above or manually review and delete empty vias through the admin panel once a delete function is implemented.
