# Database Connection Fix Guide

## Problem
Database operations (create, update, delete) are failing across all entities:
- Transportes
- Vias
- Paragens
- Proprietários
- Motoristas
- Províncias
- Municípios

## Immediate Testing

### 1. Test Database Connection
Navigate to:
```
http://localhost:3001/api/test-db
```

This will test:
- ✓ Connection
- ✓ Read operations
- ✓ Write operations
- ✓ Update operations
- ✓ Delete operations

### 2. Check Server Logs
Look for these messages in the terminal:
```
Testing database connection...
✓ Connection successful
✓ Read successful - X vias found
✓ Write successful - created via xxx
✓ Update successful
✓ Delete successful
```

## Common Issues and Solutions

### Issue 1: "Failed to connect to database"

**Cause**: Database URL is incorrect or database is unreachable

**Solutions**:

1. **Verify DATABASE_URL in .env**
   ```bash
   cd transport-admin
   cat .env | grep DATABASE_URL
   ```

2. **Test connection with Prisma CLI**
   ```bash
   cd transport-admin
   npx prisma db pull
   ```

3. **Check if database is online**
   - Log into Neon dashboard
   - Verify database is active
   - Check for any maintenance windows

### Issue 2: "Table does not exist"

**Cause**: Database schema is not up to date

**Solutions**:

1. **Run migrations**
   ```bash
   cd transport-admin
   npx prisma migrate deploy
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Reset database (CAUTION: Deletes all data)**
   ```bash
   npx prisma migrate reset
   ```

### Issue 3: "Connection timeout"

**Cause**: Network issues or connection pooling problems

**Solutions**:

1. **Update DATABASE_URL with connection pooling**
   ```
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&connection_limit=5&pool_timeout=10"
   ```

2. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check firewall/VPN**
   - Disable VPN temporarily
   - Check if firewall is blocking port 5432

### Issue 4: "SSL/TLS connection error"

**Cause**: SSL configuration mismatch

**Solutions**:

1. **Update DATABASE_URL**
   ```
   DATABASE_URL="postgresql://...?sslmode=require"
   ```

2. **Or disable SSL for local testing**
   ```
   DATABASE_URL="postgresql://...?sslmode=disable"
   ```

### Issue 5: "Too many connections"

**Cause**: Connection pool exhausted

**Solutions**:

1. **Restart dev server** to clear connections

2. **Update Prisma Client configuration**
   Already done in `lib/prisma.ts`

3. **Check Neon dashboard** for active connections

## Files Modified

### 1. `transport-admin/lib/prisma.ts`
- Added explicit datasource configuration
- Added connection error handling
- Added $connect() call with error catching

### 2. `transport-admin/app/api/vias/route.ts`
- Added extensive logging
- Added connection testing before operations
- Added detailed error messages
- Added proper cleanup in finally block

### 3. `transport-admin/app/api/test-db/route.ts` (NEW)
- Comprehensive database testing endpoint
- Tests all CRUD operations
- Provides detailed diagnostics

## Verification Steps

### Step 1: Test Database Connection
```bash
# Open in browser
http://localhost:3001/api/test-db
```

Expected response:
```json
{
  "success": true,
  "message": "All database operations working correctly",
  "tests": {
    "connection": true,
    "read": true,
    "write": true,
    "update": true,
    "delete": true
  }
}
```

### Step 2: Check Prisma Client
```bash
cd transport-admin
npx prisma --version
npx prisma validate
```

### Step 3: Test Via Creation
1. Go to Nova Via page
2. Fill in all fields
3. Draw route on map
4. Click "Criar Via"
5. Check server logs for detailed error messages

### Step 4: Check Database Directly
```bash
cd transport-admin
npx prisma studio
```

This opens a GUI to view/edit database records.

## Environment Variables

Ensure these are set in `transport-admin/.env`:

```env
DATABASE_URL="postgresql://neondb_owner:npg_b8gofTZ0OESJ@ep-snowy-field-aqt46m6u-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

## Neon-Specific Issues

### Connection Pooling
Neon uses connection pooling by default. The URL should include `-pooler`:
```
@ep-snowy-field-aqt46m6u-pooler.c-8.us-east-1.aws.neon.tech
```

### SSL Requirements
Neon requires SSL. Ensure URL includes:
```
?sslmode=require&channel_binding=require
```

### Region
Database is in `us-east-1`. High latency from other regions is normal.

## Debugging Commands

### Check if Prisma can connect
```bash
cd transport-admin
npx prisma db pull
```

### View current schema
```bash
npx prisma db pull --print
```

### Generate Prisma Client
```bash
npx prisma generate
```

### View migrations
```bash
npx prisma migrate status
```

## Next Steps

1. **Run the test endpoint**: `/api/test-db`
2. **Check server logs** for specific error messages
3. **Verify DATABASE_URL** is correct
4. **Run `npx prisma generate`** to ensure client is up to date
5. **Restart dev server** to clear any stale connections
6. **Try creating a via again** and check logs

## If Still Failing

Share these details:
1. Output from `/api/test-db`
2. Server console logs when creating via
3. Browser console errors
4. Output from `npx prisma validate`
5. Output from `npx prisma db pull`

## Production Considerations

For production deployment:
1. Use connection pooling (already in URL)
2. Set appropriate connection limits
3. Monitor connection usage in Neon dashboard
4. Consider using Prisma Data Proxy for serverless
5. Implement retry logic for transient failures
