# How to Restart and Fix the 500 Error

## The Issue
The API is returning a 500 error because:
1. The Prisma client needs to be regenerated after .env changes
2. The dev server needs to be restarted to pick up the new DATABASE_URL

## Steps to Fix

### 1. Stop the Dev Server
Press `Ctrl+C` in the terminal where `npm run dev` is running.

### 2. Update the .env File (Already Done ✅)
The `.env` file has been updated to use an absolute path:
```env
DATABASE_URL="file:C:/Projectos externos/Transports Aplication/transport-admin/prisma/dev.db"
```

### 3. Regenerate Prisma Client
```bash
cd transport-client
npx prisma generate
```

If you get a "file locked" error, make sure the dev server is completely stopped, then try again.

### 4. Restart the Dev Server
```bash
npm run dev
```

### 5. Test the App
Open `http://localhost:3000` and you should see the dropdowns populated with data.

## Check the Logs

When you restart the server, you should see console logs like:
```
Fetching locations from database...
Municipios fetched: 2
Vias fetched: 2
Paragens fetched: 6
Returning response with 2 municipios
```

If you see errors instead, they will now show detailed information about what went wrong.

## Alternative: Test the Database Connection

Visit `http://localhost:3000/api/test` to test if the database connection works.

You should see:
```json
{
  "success": true,
  "message": "Database connection successful",
  "municipioCount": 2
}
```

## Common Issues

### "Cannot find module '@prisma/client'"
**Solution:** Run `npm install` in the transport-client folder

### "EPERM: operation not permitted"
**Solution:** 
1. Stop the dev server completely
2. Close any other processes that might be using the files
3. Try running `npx prisma generate` again

### "Database file not found"
**Solution:**
1. Verify the database exists: Check if `transport-admin/prisma/dev.db` exists
2. If not, run the seed: `cd transport-admin && npx tsx prisma/seed.ts`

### Still getting 500 errors
**Solution:**
1. Check the terminal logs for detailed error messages
2. Check the browser console for the error response
3. Visit `/api/test` to see the specific error

## What Changed

### Before
```env
DATABASE_URL="file:../transport-admin/prisma/dev.db"
```
Relative paths can be problematic in Next.js API routes.

### After
```env
DATABASE_URL="file:C:/Projectos externos/Transports Aplication/transport-admin/prisma/dev.db"
```
Absolute path ensures the database is always found correctly.

## Next Steps After Fix

Once the app loads successfully:

1. **Select Location:**
   - Município: Maputo
   - Via: Zimpeto - Baixa
   - Paragem: Paragem Albazine

2. **Search for Buses:**
   - Click "Pesquisar Transportes"
   - You should see 2 buses

3. **Track a Bus:**
   - Click "Acompanhar" on any bus
   - Watch it move on the map

## Need Help?

If you're still having issues after following these steps:

1. Check the terminal output for error messages
2. Check the browser console (F12) for errors
3. Verify the database file exists and has data
4. Make sure you're in the correct directory when running commands

The detailed error logging will now show exactly what's going wrong!
