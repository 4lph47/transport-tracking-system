# CRUD Audit and Standardization Plan

## Goal
Ensure all entities have consistent, professional CRUD operations matching the vias page standard.

## Entities to Audit
1. ✅ Vias (Reference/Standard)
2. ⚠️ Transportes (Partially fixed)
3. ❓ Paragens
4. ❓ Proprietários
5. ⚠️ Motoristas (Partially fixed)
6. ❓ Províncias
7. ❓ Municípios

## Standards from Vias Page

### UI/UX Standards
- ✅ No browser alerts - custom modals only
- ✅ Toast notifications for success/error
- ✅ Backdrop blur for modals
- ✅ Loading states for async operations
- ✅ Professional black/white/grey theme
- ✅ Debounced search (500ms)
- ✅ Pagination with configurable items per page
- ✅ Delete confirmation modal
- ✅ Edit mode with save/cancel
- ✅ Proper error handling

### Data Fetching Standards
- ✅ Handle paginated API responses
- ✅ Request high limit (1000) for full data
- ✅ Extract `result.data` from paginated format
- ✅ Fallback to array format if needed
- ✅ Error handling with empty array fallback

### CRUD Operations Standards
- ✅ **Create**: Form validation, loading state, success notification, redirect
- ✅ **Read**: List view, detail view, search, filter, pagination
- ✅ **Update**: Edit mode, form validation, loading state, success notification
- ✅ **Delete**: Confirmation modal, loading state, success notification, refresh list

### Modal Standards
- ✅ Backdrop blur effect
- ✅ Professional design with icons
- ✅ Clear action buttons (Cancel/Confirm)
- ✅ Loading states during operations
- ✅ Escape key to close
- ✅ Click outside to close

### Button Standards
- ✅ No "+" prefix on buttons
- ✅ Icon + text for clarity
- ✅ Hover states
- ✅ Disabled states during loading
- ✅ Consistent styling (bg-gray-900, hover:bg-black)

## Audit Checklist per Entity

### For Each Entity Check:
- [ ] List page exists
- [ ] Create page exists
- [ ] Edit page exists
- [ ] Detail page exists (if applicable)
- [ ] API endpoints (GET, POST, PATCH, DELETE)
- [ ] Data fetching handles pagination
- [ ] Search functionality with debounce
- [ ] Filter functionality
- [ ] Pagination
- [ ] Delete confirmation modal (no alerts)
- [ ] Toast notifications (no alerts)
- [ ] Loading states
- [ ] Error handling
- [ ] Form validation
- [ ] Relationships displayed correctly
- [ ] Maps integration (if applicable)

## Execution Plan

### Phase 1: Audit (Document current state)
1. Check each entity's pages
2. Check each entity's API endpoints
3. Document missing features
4. Document inconsistencies

### Phase 2: Fix Critical Issues
1. Replace all `alert()` with modals/toasts
2. Fix data fetching for paginated responses
3. Add missing CRUD operations

### Phase 3: Standardize UI/UX
1. Consistent modal designs
2. Consistent button styles
3. Consistent loading states
4. Consistent error handling

### Phase 4: Test & Verify
1. Test all CRUD operations
2. Test all relationships
3. Test edge cases
4. Verify database connections

## Priority Order
1. **High Priority**: Transportes, Motoristas (user-facing, frequently used)
2. **Medium Priority**: Paragens, Proprietários (important but less frequent)
3. **Low Priority**: Províncias, Municípios (rarely modified)
