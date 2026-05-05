# 🔍 Debug Instructions - Frontend Issues

## 🚨 WHAT YOU SHOULD SEE NOW

### **1. Red Debug Banner**
At the top of search results, you should see:
```
🚨 DEBUG: Se você vê esta mensagem vermelha, as mudanças estão funcionando! 🚨
```

### **2. Enhanced Transport Cards**
Each transport should show:

#### **Basic Info (top):**
```
🚌 ABC-1234
Via: Portagem → Terminal
Direção: Terminal → Terminal
```

#### **Metrics Grid:**
```
⏱️ Tempo Estimado: 5 min
📏 Distância: 1000 metros  
⚡ Velocidade: 45 km/h
💰 Preço: [only if destination selected]
```

#### **🎯 Detalhes da Viagem Section (bright blue background):**
```
🎯 Detalhes da Viagem

⏱️ Autocarro chega em: 5 min
📏 Distância autocarro: 1000 m
🚶 Tempo de viagem: Selecione destino
💰 Preço viagem: Selecione destino

🔍 DEBUG: Esta seção deve sempre aparecer! 
Nenhum destino selecionado - selecione um destino para ver mais detalhes
Transport ID: [bus-id] | Matrícula: [bus-number]
```

---

## 🔧 TROUBLESHOOTING STEPS

### **Step 1: Check if Changes Applied**
1. Open browser to `http://localhost:3001`
2. Navigate to search page
3. **Look for the RED banner** at the top
4. If you DON'T see the red banner → Changes not applied

### **Step 2: Hard Refresh Browser**
1. Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Or open Developer Tools (F12) → Right-click refresh → "Empty Cache and Hard Reload"

### **Step 3: Check Browser Console**
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for debug messages starting with "🔍 DEBUG:"
4. Check for any red error messages

### **Step 4: Verify URL**
Make sure you're accessing the search results page:
- Go to search form first
- Select: Município → Via → Paragem
- Click "Pesquisar Transportes"
- Should redirect to `/search?municipio=X&via=Y&paragem=Z`

### **Step 5: Check Network Tab**
1. In Developer Tools, go to "Network" tab
2. Refresh the page
3. Look for API calls to `/api/buses?paragemId=...`
4. Check if the API returns bus data

---

## 🎯 EXPECTED BEHAVIOR

### **Without Destination:**
- Basic metrics show
- Blue "Detalhes da Viagem" section shows
- Two fields always visible: "Autocarro chega em" + "Distância autocarro"
- Two fields show "Selecione destino": "Tempo de viagem" + "Preço viagem"
- Yellow debug box with transport details

### **With Destination Selected:**
- All above PLUS:
- "Tempo de viagem" shows actual minutes
- "Preço viagem" shows actual price (10 MT per km)
- Additional sections for journey distance and route details

---

## 🚨 IF STILL NOT WORKING

### **Possible Issues:**

1. **Browser Cache**: Try incognito/private browsing mode
2. **Different Port**: Check if app is running on different port
3. **API Issues**: Check if `/api/buses` endpoint is working
4. **JavaScript Errors**: Check browser console for errors
5. **Wrong Page**: Make sure you're on search results, not search form

### **Quick Test:**
1. Open `http://localhost:3001` directly
2. You should see the main page
3. Navigate to search
4. Fill form and submit
5. Look for RED banner on results page

### **If Red Banner Appears:**
✅ Changes are working - look for blue "Detalhes da Viagem" section

### **If Red Banner Missing:**
❌ Changes not applied - check server logs, try restarting server

---

## 📞 NEXT STEPS

**Please tell me:**
1. ✅ Do you see the RED debug banner?
2. ✅ Do you see the blue "Detalhes da Viagem" section?
3. ✅ What exactly do you see on the search results page?
4. ✅ Any errors in browser console (F12)?
5. ✅ What URL are you accessing?

This will help me identify the exact issue! 🚌✨