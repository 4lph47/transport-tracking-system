# Testing the API

The error "Unexpected token '<', "<!DOCTYPE "..." means the API is returning HTML (an error page) instead of JSON.

## Quick Test

1. Open your browser and go directly to:
   ```
   http://localhost:3000/api/bus/[any-bus-id]?paragem=[any-paragem-id]&destination=[any-destination-id]
   ```

2. Replace with actual IDs from your database, for example:
   ```
   http://localhost:3000/api/bus/cmosipiiv0015a0085vovidzo?paragem=cmorrds4c00ahr6yhxpxntavt&destination=cmorrd61i007rr6yhwc0j2k9w
   ```

3. You should see JSON response. If you see HTML with an error, that's the problem.

## Check Server Logs

Look at your terminal where `npm run dev` is running. You should see error messages there that will tell us what's wrong.

Common issues:
- Database connection error
- Prisma client not generated
- Missing environment variables
- Syntax error in the code

## If You See Database Errors

Try running:
```bash
npx prisma generate
npm run dev
```

## Share the Error

Please share:
1. What you see when you visit the API URL directly in the browser
2. The error messages in the terminal where `npm run dev` is running
