# 📱 USSD User Flow - Complete Guide

## How Users Navigate Your System

---

## 🎯 Main Menu

```
┌─────────────────────────────────┐
│ Dial: *384*12345#               │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ Bem-vindo ao Sistema de         │
│ Transportes 🚌                  │
│                                 │
│ 1. Procurar Rotas               │
│ 2. Paragens Próximas            │
│ 3. Minhas Rotas Salvas          │
│ 4. Ajuda                        │
└─────────────────────────────────┘
```

**User presses**: 1, 2, 3, or 4

---

## 🔍 Option 1: Search Routes

### Step 1: Enter Origin
```
┌─────────────────────────────────┐
│ User presses: 1                 │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ Procurar Rotas de Autocarro     │
│                                 │
│ Digite a origem (ex: Matola):   │
└─────────────────────────────────┘
```

**User types**: Matola (or any location)

---

### Step 2: Select Route
```
┌─────────────────────────────────┐
│ User types: Matola              │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ Rotas de Matola:                │
│                                 │
│ 1. Maputo Centro                │
│ 2. Baixa                        │
│ 3. Costa do Sol                 │
│ 4. Sommerschield                │
│ 5. Polana                       │
│ 6. Aeroporto                    │
│ 7. Universidade                 │
│ 8. Hospital Central             │
│ 9. Mercado Central              │
│                                 │
│ 0. Voltar ao menu               │
└─────────────────────────────────┘
```

**User presses**: 
- `1-9` to see route details
- `0` to go back to main menu

---

### Step 3A: View Route Details
```
┌─────────────────────────────────┐
│ User presses: 1                 │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ 🚌 Matola → Maputo Centro       │
│                                 │
│ 📍 De: Matola                   │
│ 📍 Para: Maputo Centro          │
│                                 │
│ ⏰ Horário: 05:00 - 22:00       │
│ 💰 Tarifa: ~20-30 MT            │
│                                 │
│ Obrigado por usar nosso         │
│ serviço!                        │
└─────────────────────────────────┘
```

**Session ends** - User can dial again

---

### Step 3B: Go Back
```
┌─────────────────────────────────┐
│ User presses: 0                 │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ Bem-vindo ao Sistema de         │
│ Transportes 🚌                  │
│                                 │
│ 1. Procurar Rotas               │
│ 2. Paragens Próximas            │
│ 3. Minhas Rotas Salvas          │
│ 4. Ajuda                        │
└─────────────────────────────────┘
```

**Back to main menu** - User can choose again

---

## 🚏 Option 2: Search Stops

### Step 1: Enter Area
```
┌─────────────────────────────────┐
│ User presses: 2                 │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ Paragens Próximas               │
│                                 │
│ Digite o nome da área:          │
└─────────────────────────────────┘
```

**User types**: Centro (or any area)

---

### Step 2: Select Stop
```
┌─────────────────────────────────┐
│ User types: Centro              │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ Paragens em Centro:             │
│                                 │
│ 1. Praça dos Trabalhadores      │
│ 2. Mercado Central              │
│ 3. Baixa                        │
│ 4. Avenida Julius Nyerere       │
│ 5. Rua da Mesquita              │
│ 6. Praça 25 de Junho            │
│ 7. Estação CFM                  │
│ 8. Tribunal                     │
│ 9. Banco de Moçambique          │
│                                 │
│ 0. Voltar ao menu               │
└─────────────────────────────────┘
```

**User presses**: 
- `1-9` to see stop details
- `0` to go back to main menu

---

### Step 3A: View Stop Details
```
┌─────────────────────────────────┐
│ User presses: 1                 │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ 🚏 Praça dos Trabalhadores      │
│                                 │
│ Rotas: Via 1, Via 3, Via 7      │
│                                 │
│ Obrigado por usar nosso         │
│ serviço!                        │
└─────────────────────────────────┘
```

**Session ends** - User can dial again

---

### Step 3B: Go Back
```
┌─────────────────────────────────┐
│ User presses: 0                 │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ Bem-vindo ao Sistema de         │
│ Transportes 🚌                  │
│                                 │
│ 1. Procurar Rotas               │
│ 2. Paragens Próximas            │
│ 3. Minhas Rotas Salvas          │
│ 4. Ajuda                        │
└─────────────────────────────────┘
```

**Back to main menu** - User can choose again

---

## 💾 Option 3: Saved Routes

```
┌─────────────────────────────────┐
│ User presses: 3                 │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ Você ainda não tem rotas        │
│ salvas.                         │
│                                 │
│ Use a opção 1 para procurar     │
│ rotas.                          │
└─────────────────────────────────┘
```

**Session ends** - Feature coming soon

---

## ℹ️ Option 4: Help

```
┌─────────────────────────────────┐
│ User presses: 4                 │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ 📱 Sistema de Transportes       │
│    - Ajuda                      │
│                                 │
│ Marque *384*12345# para:        │
│ • Procurar rotas de autocarro   │
│ • Encontrar paragens próximas   │
│ • Salvar rotas favoritas        │
│                                 │
│ Suporte: info@transporte.mz     │
└─────────────────────────────────┘
```

**Session ends** - User can dial again

---

## 🔄 Complete Navigation Map

```
                    *384*12345#
                         │
                    Main Menu
                    (1,2,3,4)
                         │
        ┌────────────────┼────────────────┬──────────┐
        │                │                │          │
    1. Routes        2. Stops        3. Saved    4. Help
        │                │                │          │
   Enter origin    Enter area      Placeholder   Info
        │                │                │          │
   Route list      Stop list           END        END
   (1-9, 0)        (1-9, 0)
        │                │
    ┌───┴───┐        ┌───┴───┐
    │       │        │       │
  1-9      0       1-9      0
    │       │        │       │
 Details  Back   Details  Back
    │       │        │       │
   END   Main      END    Main
         Menu              Menu
```

---

## 💡 User Tips

### For Best Experience:

1. **Use numbers only** - Faster and easier
2. **Press 0 to go back** - Don't hang up
3. **Type location names clearly** - Better search results
4. **Note your favorite routes** - For quick access later

---

## 🎯 Key Features

- ✅ **Number-based navigation** - Easy to use
- ✅ **Back button (0)** - Navigate freely
- ✅ **Up to 9 results** - More choices
- ✅ **Clear instructions** - Know what to do
- ✅ **Route details** - Complete information
- ✅ **Stop information** - Find your stop

---

**Your USSD system is now user-friendly and easy to navigate!** 🚀📱
