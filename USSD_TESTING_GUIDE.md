# USSD Testing Guide

## Quick Test Scenarios

### Scenario 1: Find Transport from Matola to Baixa
1. Dial: `*384*123#`
2. Select: `1` (Encontrar Transporte Agora)
3. Select: `1` (Matola Sede - your current location)
4. Select: `1` (Baixa - your destination)

**Expected Output:**
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

### Scenario 2: Find Transport from Baixa to Zimpeto
1. Dial: `*384*123#`
2. Select: `1` (Encontrar Transporte Agora)
3. Select: `2` (Baixa - your current location)
4. Select: `4` (Zimpeto - your destination)

**Expected Output:**
```
INFORMACAO DE TRANSPORTE

AUTOCARRO: Volkswagen Quantum - CCC-9012-MP
LOCALIZACAO ATUAL: Costa do Sol

TEMPO ATE CHEGAR A SI: 12 min
TEMPO DE VIAGEM: 30 min
TEMPO TOTAL: 42 min

HORA DE CHEGADA: 15:10

DISTANCIA: 15.0 km
TARIFA: 25 MT

DE: Praça dos Trabalhadores
PARA: Terminal Zimpeto
```

### Scenario 3: Search Routes from Museu
1. Dial: `*384*123#`
2. Select: `2` (Procurar Rotas)
3. Select: `3` (Baixa as origin)
4. Select route number to see details

**Expected Output (Route List):**
```
CON Rotas de Baixa:
1. Chamissava
2. Michafutene
3. Terminal Zimpeto
4. Matendene
5. Tchumene
6. Boane
7. Mafuiane
8. Albasine
9. Boquisso

0. Voltar ao menu
```

**Expected Output (Route Details):**
```
END Rota 17: Baixa - Zimpeto

De: Praça dos Trabalhadores
Para: Terminal Zimpeto

Horario: 05:00 - 22:00
Tarifa: 20-30 MT

Obrigado por usar nosso servico!
```

### Scenario 4: Calculate Fare
1. Dial: `*384*123#`
2. Select: `4` (Calcular Tarifa)
3. Select: `1` (Matola - origin)
4. Select: `2` (Baixa - destination)

**Expected Output:**
```
END CALCULO DE TARIFA

DE: Matola
PARA: Baixa

DISTANCIA: 12.0 km
TARIFA: 25 MT
TEMPO: 24 min

ROTAS DISPONIVEIS: 2
```

### Scenario 5: View Help
1. Dial: `*384*123#`
2. Select: `5` (Ajuda)

**Expected Output:**
```
END Sistema de Transportes - Ajuda

Marque *384*123# para:
- Encontrar transporte proximo
- Ver tempo de chegada
- Calcular tarifa
- Procurar rotas

Suporte: info@transporte.mz
```

## Testing with Africa's Talking Simulator

### Step 1: Access Simulator
Go to: https://simulator.africastalking.com/

### Step 2: Configure
- **Service Code:** *384*123#
- **Callback URL:** https://pushily-unbenefited-byron.ngrok-free.dev/api/ussd
- **Phone Number:** Use any test number (e.g., +258840000001)

### Step 3: Test Flow
1. Click "Start Session"
2. Follow the menu prompts
3. Verify responses match expected format
4. Check that NO EMOJIS appear in responses
5. Verify all calculations are correct

## Verification Checklist

### ✅ Format Requirements
- [ ] No emojis in any response
- [ ] Only numbers and letters (plus basic punctuation)
- [ ] Information is clear and summarized
- [ ] All text is in Portuguese

### ✅ Transport Information Display
- [ ] Shows bus identification (brand, model, license plate)
- [ ] Shows current bus location (intermediate stop name)
- [ ] Shows time until bus arrives at user's stop
- [ ] Shows travel time from user's stop to destination
- [ ] Shows total time (arrival + travel)
- [ ] Shows arrival time in HH:MM format
- [ ] Shows distance in km
- [ ] Shows fare in MT

### ✅ Navigation
- [ ] All menus use number-based selection (1-9)
- [ ] "0. Voltar" (back button) works on all submenus
- [ ] Can navigate back to main menu from any level
- [ ] Invalid selections show error message

### ✅ Data Accuracy
- [ ] Routes match database (18 routes total)
- [ ] Stops match database (32 stops total)
- [ ] Buses match database (25 buses total)
- [ ] Fares calculated correctly based on distance
- [ ] Times calculated correctly (30 km/h average)

## Common Issues and Solutions

### Issue 1: "Nenhum transporte encontrado"
**Cause:** No route matches the origin-destination pair
**Solution:** Check that route exists in database for that pair

### Issue 2: Bus location shows "Em rota"
**Cause:** Route pair not defined in intermediateStops map
**Solution:** Add the route pair to getBusLocationName() function

### Issue 3: Incorrect fare calculation
**Cause:** Distance calculation may be off
**Solution:** Verify distance in calculateDistance() function

### Issue 4: Time shows as "NaN min"
**Cause:** Distance calculation returned invalid value
**Solution:** Check calculateDistance() returns valid number

## Database Routes Available

### Maputo Routes (EMTPM 2025)
1. Rota 1a: Baixa → Chamissava (via Katembe)
2. Rota 11: Baixa → Michafutene (via Jardim)
3. Rota 17: Baixa → Zimpeto (via Costa do Sol)
4. Rota 20: Baixa → Matendene (via Jardim)
5. Rota 21: Museu → Albasine (via Dom Alexandre)
6. Rota 37: Museu → Zimpeto (via Jardim)
7. Rota 39a: Baixa → Zimpeto (via Jardim)
8. Rota 39b: Baixa → Boquisso (via Jardim)
9. Rota 47: Baixa → Tchumene (via Portagem)
10. Rota 51a: Baixa → Boane (via Portagem)
11. Rota 51c: Baixa → Mafuiane (via Portagem)
12. Rota 53: Baixa → Albasine (via Hulene)

### Matola Routes
1. Matola Sede → Museu (via N4)
2. Matola Sede → Baixa (via N4/Portagem)
3. Tchumene → Baixa (via N4)
4. Malhampsene → Museu (via N4)
5. Matola Gare → Baixa
6. Machava Sede → Museu

## Next Steps After Testing

1. **If everything works:**
   - Deploy to production
   - Configure Africa's Talking with production credentials
   - Monitor usage and errors

2. **If issues found:**
   - Document the issue
   - Check server logs for errors
   - Test with different scenarios
   - Fix and re-test

3. **Future enhancements:**
   - Add real GPS integration
   - Implement user accounts
   - Add payment integration
   - Send SMS notifications

## Support

If you encounter any issues during testing:
1. Check the server logs in the terminal
2. Verify ngrok is still running
3. Check database connection
4. Verify Africa's Talking configuration
5. Test with curl to isolate issues

## Status
✅ System ready for testing
✅ All emojis removed
✅ Format matches requirements
✅ Database populated with real data
