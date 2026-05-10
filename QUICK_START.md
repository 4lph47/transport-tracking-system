# 🚀 Quick Start Guide

## ✅ System is Ready!

All data has been successfully set up:
- ✅ 2 Municipalities (Maputo & Matola)
- ✅ 221 Vias (Routes)
- ✅ 1,348 Paragens (Stops)
- ✅ 111 Transportes (All with locations)

## 🎯 Start Using the System

### Step 1: Start the Server

```bash
npm run dev
```

Wait for the message:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

### Step 2: Open Your Browser

Go to: **http://localhost:3000**

You should see:
- 🗺️ 3D map of Maputo/Matola
- 🚌 111 buses on the map (blue markers)
- 📊 "111 autocarros" indicator at top
- 🔵 Real-time updates every 30 seconds

### Step 3: Test the Features

#### View Buses on Map
- **URL:** http://localhost:3000
- **Action:** Click on any bus marker to see its route
- **Result:** Route path and stops will be displayed

#### Search for Buses
- **URL:** http://localhost:3000/search
- **Action:** 
  1. Select Municipality (Maputo or Matola)
  2. Select Via (route)
  3. Select Paragem (stop)
  4. Click "Procurar"
- **Result:** List of available buses

#### Track a Bus
- **Action:** Click "Acompanhar" on any bus in search results
- **Result:** Real-time tracking of that specific bus

#### Admin Panel
- **URL:** http://localhost:3000/admin
- **Login:** admin@example.com / admin123
- **Features:** Manage buses, routes, stops, municipalities

## 🔍 Verify Everything Works

### Check 1: Municipalities
```bash
node check-municipalities.js
```

Expected output:
```
📍 Municipalities (2):
   - Maputo (MUN001)
   - Matola (MUN-MTL-001)

🛣️  Vias per Municipality:
   - Maputo: 173 vias
   - Matola: 48 vias
```

### Check 2: Transport Locations
```bash
node simple-check.js
```

Expected output:
```
✅ Sample Transportes (first 3):
   ACA-001M:
     Location: -25.8392194,32.5615639
     Via: Zimpeto - Patrice Lumumba (2)
     Municipality: Maputo
     Route Path: YES (488 points)
```

### Check 3: Startup API
```bash
node test-startup-api.js
```

Expected output:
```
✅ Startup API test complete!

📊 Summary:
   - 111 buses ready for map
   - All buses have locations and route paths
   - Buses distributed across 2 municipalities
```

## ❓ Troubleshooting

### Problem: Buses not showing on map

**Solution:**
1. Check browser console (F12) for errors
2. Verify API: http://localhost:3000/api/startup
3. Restart server: Ctrl+C, then `npm run dev`

### Problem: Matola not in municipality dropdown

**Solution:**
1. Hard refresh browser: Ctrl+Shift+R
2. Check API: http://localhost:3000/api/locations
3. Verify database: `node check-municipalities.js`

### Problem: Buses not moving

**Solution:**
1. Wait 30 seconds (update interval)
2. Check server logs for "🔄 Atualizando posições..."
3. Refresh page

## 📊 What You Should See

### Homepage (http://localhost:3000)
```
┌─────────────────────────────────────────┐
│  Transportes Moçambique                 │
│  Tempo real • 111 autocarros            │
├─────────────────────────────────────────┤
│                                         │
│         🗺️  MAP WITH BUSES              │
│                                         │
│  🚌 🚌 🚌 🚌 🚌 🚌 🚌 🚌 🚌 🚌          │
│  🚌 🚌 🚌 🚌 🚌 🚌 🚌 🚌 🚌 🚌          │
│                                         │
│         [Entrar Button]                 │
└─────────────────────────────────────────┘
```

### Search Page (http://localhost:3000/search)
```
┌─────────────────────────────────────────┐
│  Procurar Transportes                   │
├─────────────────────────────────────────┤
│  Município: [Maputo ▼]                  │
│  Via: [Maputo Centro - Matola Gare ▼]   │
│  Paragem: [Praça dos Trabalhadores ▼]   │
│  Destino: [Matola Gare ▼] (opcional)    │
│                                         │
│  [Procurar]                             │
└─────────────────────────────────────────┘
```

### Search Results
```
┌─────────────────────────────────────────┐
│  Transportes Disponíveis                │
│  3 transportes em circulação            │
├─────────────────────────────────────────┤
│  🚌 ACA-001M                            │
│  Via: Maputo Centro - Matola Gare       │
│  Tempo estimado: 5 min                  │
│  Distância: 2.3 km                      │
│  [Acompanhar]                           │
├─────────────────────────────────────────┤
│  🚌 ACA-002M                            │
│  Via: Maputo Centro - Matola Gare       │
│  Tempo estimado: 12 min                 │
│  Distância: 5.1 km                      │
│  [Acompanhar]                           │
└─────────────────────────────────────────┘
```

## 🎉 Success!

If you see:
- ✅ Buses on the map
- ✅ Both municipalities in search
- ✅ Buses moving every 30 seconds
- ✅ Routes following roads

**Your system is working perfectly!**

## 📚 More Information

- **Full Documentation:** See `SOLUTION_COMPLETE.md`
- **System Status:** See `SYSTEM_STATUS_REPORT.md`
- **Database Scripts:** See `check-*.js` files

---

**Ready to go!** 🚀
Start your server and enjoy the system!
