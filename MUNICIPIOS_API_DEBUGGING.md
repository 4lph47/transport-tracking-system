# Municipios API Debugging Guide

## Current Status
The `/api/municipios` endpoint has been created but is returning errors when called from the Nova Via page.

## Debugging Steps

### 1. Check Server Logs
Look at the Next.js dev server terminal for these logs:
```
Municipios API called
Query params: { page: 1, limit: 1000, search: '', countOnly: false }
Fetching municipios with skip: 0 limit: 1000
Municipios fetched: X Total: X
```

If you see errors instead, they will show the exact problem.

### 2. Check Browser Console
The browser console will show:
```
Fetching municipios from /api/municipios
Response status: 200 OK
Municipios result: { data: [...], pagination: {...} }
```

Or if there's an error:
```
Response status: 500 Internal Server Error
Response error text: ...
```

### 3. Common Issues and Solutions

#### Issue: "Cannot find module '@/lib/prisma'"
**Solution**: Restart the Next.js dev server
```bash
cd transport-admin
npm run dev
```

#### Issue: "Table 'Municipio' does not exist"
**Solution**: Run Prisma migrations
```bash
cd transport-admin
npx prisma migrate dev
npx prisma generate
```

#### Issue: "404 Not Found"
**Solution**: The API route file might not be in the correct location
- Verify file exists at: `transport-admin/app/api/municipios/route.ts`
- Restart dev server

#### Issue: Empty response or no data
**Solution**: Check if database has municipios
```bash
cd transport-admin
npx prisma studio
# Check Municipio table
```

### 4. Test the API Directly

Open browser and navigate to:
```
http://localhost:3001/api/municipios?limit=10
```

(Replace 3001 with your transport-admin port)

You should see:
```json
{
  "data": [
    {
      "id": "...",
      "nome": "Maputo",
      "codigo": "MPT-001",
      "provinciaId": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 61,
    "totalPages": 7
  }
}
```

### 5. Verify Prisma Client

Check if Prisma client is generated:
```bash
cd transport-admin
ls node_modules/.prisma/client
```

If not found, run:
```bash
npx prisma generate
```

### 6. Check Database Connection

Test if Prisma can connect to the database:
```bash
cd transport-admin
npx prisma db pull
```

This should show your database schema.

## Files Modified

1. **transport-admin/app/api/municipios/route.ts**
   - Created new API endpoint
   - Added extensive logging
   - Returns paginated municipios data

2. **transport-admin/app/vias/novo/page.tsx**
   - Updated to fetch from `/api/municipios`
   - Added detailed error logging
   - Shows error notifications

## Expected Behavior

When working correctly:
1. Nova Via page loads
2. Fetches municipios from API
3. Populates dropdown with all municipios
4. User can select a municipio
5. User can draw route and create via

## Next Steps

1. **Check the logs** in both browser console and server terminal
2. **Share the error messages** if the issue persists
3. **Verify database** has municipios data
4. **Restart dev server** if needed
5. **Run prisma generate** if Prisma client is outdated

## Alternative Solution

If the API continues to fail, we can temporarily use hardcoded municipios data in the frontend while we debug the database connection issue.
