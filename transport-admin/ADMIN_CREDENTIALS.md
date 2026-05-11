# Admin Login Credentials

## 🔐 Credentials

Once the database is accessible and you run `node create-admin.js`, use these credentials:

**Email:** `admin@transportmz.com`  
**Password:** `Admin@2026`  
**Name:** Super Administrador  
**Role:** admin (will be super_admin after migration)

## 📝 How to Create Admin

1. Ensure database is running and accessible
2. Run the creation script:
   ```bash
   cd transport-admin
   node create-admin.js
   ```

3. The script will output the credentials
4. Access the login page at: `http://localhost:3000/login`

## ⚠️ Important Notes

- The password is hashed with bcrypt (10 rounds) before storing
- Keep these credentials secure
- Change the password after first login (once password change feature is implemented)
- The script checks if admin already exists to prevent duplicates

## 🔄 After Database Migration

After running `npx prisma migrate dev`, the admin will have:
- `role`: "admin" (or "super_admin" if you modify the script)
- `ativo`: true (active status)

These fields provide role-based access control and the ability to deactivate admins without deleting them.
