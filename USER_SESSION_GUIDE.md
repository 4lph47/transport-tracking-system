# User Session Management Guide

## 📱 USSD Sessions vs User Sessions

### USSD Session (Automatic)
**Created by Africa's Talking** - You don't need to do anything!

- **Duration:** From dial to "END" response
- **Managed by:** Africa's Talking
- **Session ID:** Provided in each request
- **Lifetime:** ~30 seconds of inactivity

**Example:**
```
User dials: *384*123#
Session ID: ATUid_abc123xyz
Request 1: text=""
Request 2: text="1"
Request 3: text="1*2"
Session ends: "END" response sent
```

### User Session (Optional - For Your App)
**Created by you** - To remember user preferences across multiple USSD sessions

---

## 🔧 How USSD Sessions Work (Current Implementation)

Your current code already handles USSD sessions automatically:

```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  // Africa's Talking provides these automatically:
  const sessionId = formData.get('sessionId') as string;  // ← Session ID
  const phoneNumber = formData.get('phoneNumber') as string;
  const text = formData.get('text') as string;  // ← User's navigation path
  
  // Process the request
  const response = await handleUSSD(sessionId, phoneNumber, text);
  
  return new NextResponse(response, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}
```

**You don't need to create sessions - Africa's Talking does it for you!**

---

## 🧪 How to Test (Start a Session)

### Method 1: Africa's Talking Simulator
```
1. Go to: https://simulator.africastalking.com/
2. Select: Sandbox or Production
3. Enter service code: *384*123#
4. Click: "Start Session"
5. Test your flows
```

### Method 2: Real Phone
```
1. Dial: *384*123#
2. Session starts automatically
3. Follow menu prompts
4. Session ends when you see "END" message
```

### Method 3: curl (For Debugging)
```bash
curl -X POST https://your-server-url.com/api/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=ATUid_test123" \
  -d "serviceCode=*384*123#" \
  -d "phoneNumber=+258840000001" \
  -d "text="
```

---

## 💾 Adding User Sessions (Future Feature)

If you want to **remember user preferences** across multiple USSD sessions:

### Step 1: Add Session Table to Database

Update `transport-client/prisma/schema.prisma`:

```prisma
model UserSession {
  id              String   @id @default(cuid())
  phoneNumber     String
  lastLocation    String?
  favoriteRoutes  String?  // JSON string
  lastUsed        DateTime @default(now())
  createdAt       DateTime @default(now())
  
  @@index([phoneNumber])
}
```

### Step 2: Run Migration
```bash
cd transport-client
npx prisma migrate dev --name add_user_sessions
npx prisma generate
```

### Step 3: Create Session Helper Functions

Add to `transport-client/app/api/ussd/route.ts`:

```typescript
// Get or create user session
async function getUserSession(phoneNumber: string) {
  let session = await prisma.userSession.findFirst({
    where: { phoneNumber }
  });
  
  if (!session) {
    session = await prisma.userSession.create({
      data: { phoneNumber }
    });
  }
  
  return session;
}

// Update user session
async function updateUserSession(
  phoneNumber: string, 
  data: { lastLocation?: string; favoriteRoutes?: string }
) {
  return await prisma.userSession.update({
    where: { phoneNumber },
    data: {
      ...data,
      lastUsed: new Date()
    }
  });
}

// Get user's last location
async function getLastLocation(phoneNumber: string) {
  const session = await getUserSession(phoneNumber);
  return session.lastLocation;
}
```

### Step 4: Use Sessions in Your USSD Flow

```typescript
async function handleUSSD(sessionId: string, phoneNumber: string, text: string): Promise<string> {
  const inputs = text === '' ? [] : text.split('*');
  const level = inputs.length;

  // Get user session
  const userSession = await getUserSession(phoneNumber);

  // LEVEL 0: Main Menu
  if (level === 0) {
    // Show last location if available
    const lastLocation = userSession.lastLocation;
    const locationHint = lastLocation ? `\n(Ultima: ${lastLocation})` : '';
    
    return `CON Bem-vindo ao Sistema de Transportes${locationHint}
1. Encontrar Transporte Agora
2. Procurar Rotas
3. Paragens Próximas
4. Calcular Tarifa
5. Ajuda`;
  }

  // When user selects a location, save it
  if (level === 2 && inputs[0] === '1') {
    const locations = ['Matola Sede', 'Baixa', 'Museu', 'Zimpeto', 'Costa do Sol', 'Portagem', 'Machava'];
    const locationIndex = parseInt(inputs[1]) - 1;
    
    if (locationIndex >= 0 && locationIndex < locations.length) {
      const selectedLocation = locations[locationIndex];
      
      // Save user's location
      await updateUserSession(phoneNumber, {
        lastLocation: selectedLocation
      });
    }
  }

  // ... rest of your code
}
```

---

## 🎯 Quick Answers

### Q: How do I start a USSD session?
**A:** Just dial your USSD code: `*384*123#`
- Africa's Talking creates the session automatically
- You don't need to do anything

### Q: How do I test my USSD?
**A:** Three ways:
1. **Simulator:** https://simulator.africastalking.com/
2. **Real phone:** Dial `*384*123#`
3. **curl:** Send POST request to your endpoint

### Q: How long does a USSD session last?
**A:** ~30 seconds of inactivity, or until you send "END"

### Q: Can I remember user preferences?
**A:** Yes! Add a UserSession table to your database (see above)

### Q: Do I need to manage sessionId?
**A:** No! Africa's Talking provides it automatically in each request

---

## 🧪 Testing Your Current System

### Start a Session (Simulator)
```
1. Go to: https://simulator.africastalking.com/
2. Environment: Sandbox (or Production if you migrated)
3. Service Code: *384*123#
4. Click: "Start Session"
```

### Start a Session (Real Phone)
```
1. Dial: *384*123#
2. Wait for menu to appear
3. Select options using numbers
4. Session ends when you see final message
```

### Start a Session (curl - Debug)
```bash
# First request (main menu)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=ATUid_test123" \
  -d "serviceCode=*384*123#" \
  -d "phoneNumber=+258840000001" \
  -d "text="

# Second request (user pressed 1)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=ATUid_test123" \
  -d "serviceCode=*384*123#" \
  -d "phoneNumber=+258840000001" \
  -d "text=1"
```

---

## ✅ Summary

### USSD Sessions (Automatic)
- ✅ Created by Africa's Talking
- ✅ You don't need to do anything
- ✅ Just dial `*384*123#` to start

### User Sessions (Optional)
- 🔄 You can add this feature
- 🔄 Requires database changes
- 🔄 Useful for remembering preferences

### To Test Right Now
1. **Simulator:** https://simulator.africastalking.com/
2. **Phone:** Dial `*384*123#`
3. **curl:** Send POST to your endpoint

**Your system already handles USSD sessions correctly!** 🎉

---

**Need more help?** Let me know what specific type of session you want to create!
