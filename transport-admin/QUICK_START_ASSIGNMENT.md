# Quick Start: Assign Transportes to Vias

## 🚀 Simple 3-Step Process

### Step 1: Start the Server
```bash
cd transport-admin
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

### Step 2: Open the Assignment Page
Open your browser and go to:
```
http://localhost:3000/assign-transportes.html
```

### Step 3: Click the Button
Click the big black button that says **"Assign Transportes Now"**

That's it! ✅

---

## 📊 What You'll See

### Before Assignment
- Dashboard "Top Vias" shows: 0 transportes
- Via details pages: No transportes listed
- Map: No transporte markers

### After Assignment (takes ~5-10 seconds)
- ✅ Success message appears
- 📊 Statistics displayed:
  - Total Vias: 111
  - Total Transportes: 111
  - Assigned: 111
  - Avg per Via: 1.0
- 🏆 Top 5 vias with most transportes shown
- 🎉 "View Dashboard" link appears

### On Dashboard
- "Top Vias" graph shows counts > 0
- Click any via to see assigned transportes
- Map shows transporte locations at via start points

---

## 🎯 What Happens Behind the Scenes

1. **Gets all 111 vias** from database
2. **Gets all 111 transportes** from database
3. **Distributes evenly**: Each via gets 1 transporte (cycles through)
4. **Sets locations**: Each transporte placed at via start point
5. **Updates database**: 
   - `viaId` → Assigned via ID
   - `codigoVia` → Via code
   - `currGeoLocation` → Via start coordinates (lat,lng)

---

## ✅ Verification

After assignment, check:

### Dashboard
```
http://localhost:3000/dashboard
```
- Scroll to "Top Vias" graph
- Should show counts (not all zeros)

### Via Details
```
http://localhost:3000/vias
```
- Click any via
- Should show assigned transporte(s)

### Database (Optional)
```sql
SELECT COUNT(*) FROM "Transporte" WHERE "viaId" IS NOT NULL;
-- Should return: 111
```

---

## 🔄 Run Again?

If you need to reassign (e.g., after adding more transportes):
1. Go back to: `http://localhost:3000/assign-transportes.html`
2. Click "Assign Transportes Now" again
3. It will reassign all transportes

---

## 📍 Location Format

**Via Path** (stored in database):
```
lng,lat;lng,lat;lng,lat;...
Example: 32.5892,-25.9655;32.5893,-25.9656;...
```

**Transporte Location** (after assignment):
```
lat,lng
Example: -25.9655,32.5892
```

Note: Coordinates are reversed! Via uses `lng,lat`, Transporte uses `lat,lng`

---

## 🎉 Success Indicators

✅ Button changes to "✅ Assignment Complete"
✅ Green success message appears
✅ Statistics show 111/111 assigned
✅ Top 5 vias list appears
✅ "View Dashboard" link appears
✅ Dashboard graphs show counts
✅ Via pages show transportes

---

## 🆘 Troubleshooting

### "Can't reach database server"
- Make sure dev server is running: `npm run dev`
- Check `.env` file exists with `DATABASE_URL`

### "No vias found"
- Run via creation scripts first
- Check: `node check-vias-distribution.js`

### "No transportes found"
- Verify transportes exist in database
- Check seed data was loaded

### Button stays disabled
- Refresh the page
- Check browser console (F12) for errors

---

## 📚 More Information

- **Full Documentation**: `ASSIGN_TRANSPORTES_INSTRUCTIONS.md`
- **API Endpoint**: `/api/assign-transportes` (POST)
- **Script Version**: `assign-transportes-to-vias.js`

---

## 🎊 Next Steps

After successful assignment:

1. **View Dashboard**: See updated graphs
2. **Explore Vias**: Click vias to see transportes
3. **Check Map**: See transporte locations
4. **Test Tracking**: Try real-time features
5. **Assign Motoristas**: Link drivers to transportes

Enjoy your fully connected transport system! 🚍✨
