# USSD System - Quick Reference Card

## 🚀 Quick Start

### Start the Server
```bash
cd transport-client
npm run dev
```

### Start ngrok (in another terminal)
```bash
ngrok http 3000
```

### Test USSD
Dial: `*384*123#` on Africa's Talking simulator

---

## 📱 Menu Structure

```
Main Menu
├── 1. Encontrar Transporte Agora
│   ├── Select current location (1-8 or custom)
│   └── Select destination (1-6 or custom)
│       └── View transport info (END)
│
├── 2. Procurar Rotas
│   ├── Select origin (1-8 or custom)
│   └── Select route (1-9)
│       └── View route details (END)
│
├── 3. Paragens Próximas
│   ├── Select area (1-8 or custom)
│   └── Select stop (1-9)
│       └── View stop details (END)
│
├── 4. Calcular Tarifa
│   ├── Select origin (1-7 or custom)
│   └── Select destination (1-7 or custom)
│       └── View fare calculation (END)
│
└── 5. Ajuda
    └── View help info (END)
```

---

## 🎯 Key Features

### Option 1: Find Transport Now
**Shows:**
- Bus ID (brand, model, plate)
- Current bus location
- Time until bus arrives (min)
- Travel time (min)
- Total time (min)
- Arrival time (HH:MM)
- Distance (km)
- Fare (MT)

### Option 2: Search Routes
**Shows:**
- Route name
- Origin terminal
- Destination terminal
- Operating hours
- Fare range

### Option 3: Nearest Stops
**Shows:**
- Stop name
- Available routes

### Option 4: Calculate Fare
**Shows:**
- Distance (km)
- Fare (MT)
- Estimated time
- Number of routes

---

## 💰 Fare Structure

| Distance | Fare |
|----------|------|
| 0-5 km   | 15 MT |
| 5-10 km  | 20 MT |
| 10-15 km | 25 MT |
| 15-20 km | 30 MT |
| 20+ km   | 35 MT |

---

## 🗺️ Available Routes

### Maputo (12 routes)
- Baixa ↔ Chamissava, Michafutene, Zimpeto, Matendene
- Baixa ↔ Tchumene, Boane, Mafuiane, Boquisso
- Museu ↔ Albasine, Zimpeto

### Matola (6 routes)
- Matola Sede ↔ Museu, Baixa
- Tchumene ↔ Baixa
- Malhampsene ↔ Museu
- Matola Gare ↔ Baixa
- Machava Sede ↔ Museu

---

## 🔧 Configuration

### Database
```
Location: transport-admin/prisma/dev.db
Routes: 18
Stops: 32
Buses: 25
```

### ngrok URL
```
https://pushily-unbenefited-byron.ngrok-free.dev/api/ussd
```

### Africa's Talking
```
Service Code: *384*123#
Method: POST
Format: Form data
```

---

## ✅ Checklist

### Before Testing
- [ ] Server running (`npm run dev`)
- [ ] ngrok running and URL updated
- [ ] Database populated (`npx prisma db seed`)
- [ ] Africa's Talking configured

### During Testing
- [ ] Main menu loads
- [ ] All 5 options work
- [ ] Number navigation works
- [ ] Back button (0) works
- [ ] No emojis in responses
- [ ] Transport info shows correctly
- [ ] Calculations are accurate

### After Testing
- [ ] Check server logs for errors
- [ ] Verify all features work
- [ ] Document any issues
- [ ] Plan next steps

---

## 🐛 Quick Troubleshooting

### "Cannot reach endpoint"
→ Check ngrok is running
→ Verify URL in Africa's Talking

### "No transport found"
→ Check route exists in database
→ Verify location names match

### "Invalid option"
→ Check input is 0-9
→ Verify menu level is correct

### "Database error"
→ Check DATABASE_URL in .env
→ Verify database file exists
→ Run `npx prisma generate`

---

## 📞 Test Numbers

### Quick Test Flow
1. Dial: `*384*123#`
2. Press: `1` (Find Transport)
3. Press: `1` (Matola Sede)
4. Press: `1` (Baixa)
5. See: Transport info with NO emojis ✅

---

## 📊 Expected Output Format

```
INFORMACAO DE TRANSPORTE

AUTOCARRO: Toyota Hiace - PPP-5555-MP
LOCALIZACAO ATUAL: Shoprite Matola

TEMPO ATE CHEGAR A SI: 8 min
TEMPO DE VIAGEM: 24 min
TEMPO TOTAL: 32 min

HORA DE CHEGADA: 14:45

DISTANCIA: 12.0 km
TARIFA: 25 MT

DE: Terminal Matola Sede
PARA: Praça dos Trabalhadores
```

**Key Points:**
- ✅ NO emojis
- ✅ Only numbers and letters
- ✅ Clear and summarized
- ✅ All required information

---

## 🎉 Status

**IMPLEMENTATION:** ✅ COMPLETE
**TESTING:** 🔄 READY
**DEPLOYMENT:** ⏳ PENDING

---

## 📚 Documentation

- `USSD_IMPLEMENTATION_SUMMARY.md` - Full implementation details
- `USSD_TESTING_GUIDE.md` - Detailed test scenarios
- `USSD_EMOJI_REMOVAL_COMPLETE.md` - Emoji removal documentation
- `QUICK_REFERENCE_USSD.md` - This file

---

## 🚀 Next Steps

1. **Test** with Africa's Talking simulator
2. **Verify** all features work correctly
3. **Deploy** to production if tests pass
4. **Monitor** usage and errors
5. **Plan** real GPS integration

---

**Last Updated:** Context Transfer Session
**Version:** 1.0 - Emoji-Free Edition
**Status:** ✅ Ready for Testing
