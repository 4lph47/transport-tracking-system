# Text Color Fix - All Fields Black

## Summary
Updated all input fields, select dropdowns, and textareas across the admin panel to ensure text is black (`text-gray-900` or `text-black`) instead of grey.

## Files Modified

### ✅ transport-admin/app/vias/novo/page.tsx
Fixed 4 input fields that were missing text color:
- Nome da Via input - added `text-gray-900`
- Código input - added `text-gray-900`
- Terminal de Partida input - added `text-gray-900`
- Terminal de Chegada input - added `text-gray-900`

### ✅ transport-admin/app/motoristas/atribuir/page.tsx
Fixed 2 search input fields:
- Transportes search input - added `text-gray-900`
- Motoristas search input - added `text-gray-900`

## Already Correct (No Changes Needed)

The following pages already had black text in all input/select/textarea fields:

### ✅ transport-admin/app/vias/[id]/page.tsx
- All inputs use `text-black`

### ✅ transport-admin/app/vias/page.tsx
- Search input uses `text-black`
- Items per page selector uses `text-gray-900`

### ✅ transport-admin/app/transportes/novo/page.tsx
- All inputs use `text-black`

### ✅ transport-admin/app/transportes/[id]/editar/page.tsx
- All inputs and selects use `text-black`

### ✅ transport-admin/app/transportes/page.tsx
- Search input uses `text-gray-900`
- Items per page selector uses `text-gray-900`

### ✅ transport-admin/app/paragens/novo/page.tsx
- All inputs use `text-gray-900`

### ✅ transport-admin/app/paragens/page.tsx
- Search input uses `text-gray-900`
- Items per page selector uses `text-gray-900`

### ✅ transport-admin/app/motoristas/novo/page.tsx
- All inputs and selects use `text-black`

### ✅ transport-admin/app/motoristas/[id]/editar/page.tsx
- All inputs and selects use `text-black`

### ✅ transport-admin/app/motoristas/page.tsx
- Search input uses `text-gray-900`
- Filter select uses `text-gray-900`
- Items per page selector uses `text-gray-900`

### ✅ transport-admin/app/proprietarios/page.tsx
- Search input uses `text-gray-900`

### ✅ transport-admin/app/provincias/page.tsx
- Search input uses `text-gray-900`

### ✅ transport-admin/app/municipios/page.tsx
- Search input uses `text-gray-900`

### ✅ transport-admin/app/relatorios/page.tsx
- Search input uses `text-gray-900`
- Date inputs use `text-gray-900`

## Text Color Standards

All user input fields now follow these standards:

### Input Fields
- **Text Color**: `text-gray-900` or `text-black`
- **Border**: `border-gray-300` or `border-slate-300`
- **Focus Ring**: `focus:ring-gray-900` or `focus:ring-slate-900`

### Select Dropdowns
- **Text Color**: `text-gray-900` or `text-black`
- **Background**: `bg-white` (explicit for selects)
- **Border**: `border-gray-300` or `border-slate-300`

### Textareas
- **Text Color**: `text-gray-900` or `text-black`
- **Border**: `border-gray-300` or `border-slate-300`

### Items Per Page Selector
- **Label**: `text-gray-900 font-medium`
- **Select**: `text-gray-900`

## Verification

All input fields, select dropdowns, and textareas across the admin panel now display text in black color, ensuring:
- ✅ Better readability
- ✅ Consistent user experience
- ✅ Professional appearance
- ✅ Accessibility compliance

## Testing Checklist

- [x] Vias novo page - all inputs black
- [x] Vias edit page - all inputs black
- [x] Transportes novo page - all inputs black
- [x] Transportes edit page - all inputs black
- [x] Paragens novo page - all inputs black
- [x] Motoristas novo page - all inputs black
- [x] Motoristas edit page - all inputs black
- [x] Motoristas atribuir page - all inputs black
- [x] All list pages search inputs - black
- [x] All items per page selectors - black
- [x] All filter selects - black
