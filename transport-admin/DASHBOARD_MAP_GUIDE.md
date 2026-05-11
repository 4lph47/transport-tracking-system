# Dashboard Map - User Guide

## Accessing the Dashboard

1. **Start the development server**:
   ```bash
   cd transport-admin
   npm run dev
   ```

2. **Open browser**:
   ```
   http://localhost:3000/dashboard
   ```

3. **Login** (if not already logged in):
   ```
   Email: admin@transportmz.com
   Password: Admin@2026
   ```

## What You Should See

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ALERT: X transportes sem motorista                    [Ver]│
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Transport │ │Motoristas│ │  Vias    │ │ Paragens │      │
│  │   111    │ │    XX    │ │   111    │ │  1,078   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────┐ ┌──────────────────┐   │
│  │                                │ │ Vias (111)       │   │
│  │                                │ │ ┌──────────────┐ │   │
│  │         MAP WITH 111           │ │ │ Via 1        │ │   │
│  │         COLORED ROUTES         │ │ │ Via 2        │ │   │
│  │                                │ │ │ Via 3        │ │   │
│  │    (3D Buildings Visible)      │ │ │ ...          │ │   │
│  │                                │ │ │ Via 111      │ │   │
│  │                                │ │ └──────────────┘ │   │
│  └────────────────────────────────┘ └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Map Features

#### 1. **Base Map**
- OpenStreetMap tiles
- Shows Maputo and Matola regions
- Streets, buildings, landmarks visible

#### 2. **3D Buildings**
- Visible when zoomed in (zoom level 15+)
- Gray colored buildings with height
- Adds depth to visualization
- Map tilted at 45° angle

#### 3. **Via Routes (111 total)**
- **Color-coded lines** representing bus routes
- **37 unique colors** for visual distinction
- **Line width**: 4px (normal), 6px (selected)
- **Opacity**: 0.7 (normal), 1.0 (selected)
- **Routes follow actual roads** (not straight lines)

#### 4. **Navigation Controls**
- **Zoom**: +/- buttons (top right)
- **Compass**: Reset bearing (top right)
- **Mouse wheel**: Zoom in/out
- **Click + drag**: Pan map
- **Right-click + drag**: Rotate map
- **Ctrl + drag**: Tilt map

### Via List Sidebar

#### Layout
```
┌──────────────────────┐
│ Vias (111)           │
├──────────────────────┤
│ ● Via Name       [5] │  ← Color dot, name, transporte count
│ ● Via Name       [0] │
│ ● Via Name       [2] │
│ ● Via Name       [0] │
│ ● Via Name       [1] │
│ ...                  │
│ (scroll for more)    │
└──────────────────────┘
```

#### Features
- **Color dot**: Shows via color (matches map)
- **Via name**: Format "Start → End"
- **Count**: Number of transportes on via (currently 0 for all)
- **Scrollable**: All 111 vias accessible
- **Clickable**: Click to highlight on map

### Interactive Features

#### 1. **Select Via**
**Action**: Click via in sidebar

**Result**:
- Selected via highlighted on map (thicker line, full opacity)
- All other vias hidden
- Map zooms to fit selected via
- Via card in sidebar turns black with white text

**Example**:
```
Before: All 111 vias visible
Click: "Baixa → Zimpeto"
After: Only "Baixa → Zimpeto" visible, zoomed in
```

#### 2. **Show All Vias**
**Action**: Click "Mostrar Todas" button (appears when via selected)

**Result**:
- All 111 vias visible again
- Map zooms out to show full region
- All vias return to normal styling

#### 3. **View Via Details**
**Hover over via in sidebar**:
- Background changes to light gray
- Cursor changes to pointer

**Click via**:
- Via highlighted on map
- Start and end terminals shown
- Transporte count displayed

## Expected Behavior

### On Page Load
1. ✅ Dashboard loads with stats
2. ✅ Map initializes centered on Maputo
3. ✅ All 111 vias load and render
4. ✅ Via list populates with 111 items
5. ✅ 3D buildings appear when zoomed in

### Via Colors
You should see routes in various colors including:
- Red (#FF6B6B, #E63946, #EF476F)
- Blue (#45B7D1, #118AB2, #3A86FF)
- Green (#52B788, #06D6A0, #00FA9A)
- Orange (#FFA07A, #F77F00, #FF8C00)
- Purple (#BB8FCE, #8338EC, #9370DB)
- Yellow (#F7DC6F, #FFD166, #FFBE0B)
- And more...

### Via Paths
Routes should:
- ✅ Follow actual roads (not straight lines)
- ✅ Connect start and end terminals
- ✅ Have smooth curves around corners
- ✅ Avoid going through buildings
- ✅ Follow street network

## Troubleshooting

### Map Not Loading
**Symptoms**: Blank white area where map should be

**Solutions**:
1. Check browser console for errors (F12)
2. Verify internet connection (needs OpenStreetMap tiles)
3. Clear browser cache and reload
4. Check if port 3000 is accessible

### No Vias Visible
**Symptoms**: Map loads but no colored routes

**Solutions**:
1. Check browser console for errors
2. Verify API response: Open DevTools → Network → `/api/dashboard/stats`
3. Should see `viasData: [111 items]`
4. If empty, run: `node test-dashboard-api.js`

### Vias Not Following Roads
**Symptoms**: Routes are straight lines

**This should NOT happen** - all vias use OSRM routing.

**If it does**:
1. Check via `geoLocationPath` in database
2. Should have 495-1,611 coordinate points
3. Run: `node test-dashboard-api.js` to verify

### Performance Issues
**Symptoms**: Map is slow or laggy

**Solutions**:
1. Close other browser tabs
2. Reduce number of visible vias (select one via)
3. Disable 3D buildings (zoom out)
4. Use Chrome or Edge (better WebGL support)

## Verification Checklist

Run these checks to verify everything is working:

### 1. Database Check
```bash
node check-vias-distribution.js
```
**Expected**:
```
Maputo vias: 70
Matola vias: 41
Total vias: 111
Total paragens: 1078
```

### 2. API Check
```bash
node test-dashboard-api.js
```
**Expected**:
```
✅ Query returned 111 vias
🎨 Unique colors: 37/111
🗺️  Vias with valid paths: 111/111
```

### 3. Visual Check
Open dashboard and verify:
- [ ] Map loads and shows Maputo
- [ ] 111 colored routes visible
- [ ] Via list shows 111 items
- [ ] Can click via to highlight
- [ ] "Mostrar Todas" button works
- [ ] 3D buildings visible when zoomed in
- [ ] Routes follow roads (not straight)

### 4. Browser Console Check
Open DevTools (F12) → Console:
- [ ] No red errors
- [ ] Via colors logged (e.g., "Via xxx: original color=..., valid color=...")
- [ ] OSRM routes loaded successfully

## Sample Vias to Test

Try clicking these vias in the sidebar:

1. **"Aldeia → Avenida das Indústrias"**
   - Color: #073B4C (dark blue)
   - Path: 495 points
   - Should zoom to northern Maputo

2. **"Av. Metical → Kati Banana"**
   - Color: #9370DB (purple)
   - Path: 1,611 points (longest route)
   - Should show extensive route

3. **"Baixa → Zimpeto"**
   - Common route
   - Should show central to eastern Maputo

## Map Controls Reference

### Mouse Controls
| Action | Result |
|--------|--------|
| Click + Drag | Pan map |
| Scroll Wheel | Zoom in/out |
| Right-Click + Drag | Rotate map |
| Ctrl + Drag | Tilt map (3D) |
| Double-Click | Zoom in |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| + | Zoom in |
| - | Zoom out |
| Arrow Keys | Pan map |
| Shift + Arrow | Rotate map |

### Touch Controls (Mobile)
| Gesture | Result |
|---------|--------|
| Pinch | Zoom |
| Drag | Pan |
| Two-finger rotate | Rotate |
| Two-finger tilt | Tilt (3D) |

## Technical Information

### Map Configuration
```javascript
{
  center: [32.5892, -25.9655],  // Maputo
  zoom: 11,
  pitch: 45,                     // 3D tilt
  bearing: 0                     // North up
}
```

### Via Route Rendering
```javascript
{
  type: 'line',
  paint: {
    'line-color': via.color,     // Unique color
    'line-width': 4,              // 4px normal, 6px selected
    'line-opacity': 0.7           // 70% normal, 100% selected
  }
}
```

### 3D Buildings
```javascript
{
  type: 'fill-extrusion',
  minzoom: 15,                   // Only visible when zoomed in
  paint: {
    'fill-extrusion-color': '#d1d5db',
    'fill-extrusion-height': 5,  // Default 5m
    'fill-extrusion-opacity': 0.8
  }
}
```

## Support

### Common Questions

**Q: Why do some vias have 0 transportes?**
A: Transportes haven't been assigned to vias yet. This is normal and doesn't affect map visualization.

**Q: Can I add more vias?**
A: Yes, but the system is designed for exactly 111 vias (70 Maputo, 41 Matola). Adding more would require updating the requirements.

**Q: Why are there only 37 colors for 111 vias?**
A: The color palette has 40 colors, and they're randomly assigned. Some colors are used multiple times, which is fine for visual distinction.

**Q: Can I change via colors?**
A: Yes, edit the via in the database and update the `cor` field with a new hex color code.

**Q: How do I assign transportes to vias?**
A: Use the transportes management page to edit a transporte and select a via from the dropdown.

## Next Steps

After verifying the map works:

1. **Assign Transportes to Vias**
   - Go to `/transportes`
   - Edit each transporte
   - Select a via from dropdown
   - Save

2. **Test Real-Time Tracking**
   - Assign motoristas to transportes
   - Start GPS tracking
   - View live positions on map

3. **Add Via Management**
   - Create new vias
   - Edit existing vias
   - Delete unused vias

4. **Generate Reports**
   - Via usage statistics
   - Transporte distribution
   - Popular routes

## Conclusion

The dashboard map should now display:
- ✅ All 111 vias with unique colors
- ✅ Routes following actual roads
- ✅ Interactive via selection
- ✅ 3D buildings visualization
- ✅ Smooth map navigation

**Status**: Fully functional and ready to use! 🎉

For technical details, see `VIAS_SYSTEM_COMPLETE.md`
For fix summary, see `VIAS_FIX_SUMMARY.md`
