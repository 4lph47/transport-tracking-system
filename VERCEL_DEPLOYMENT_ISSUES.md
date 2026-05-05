# Vercel Deployment Issues - Diagnosis & Solutions

## Date: 2026-05-05
## Issue: App not presented well on Vercel but works on localhost

---

## Common Causes & Solutions

### 1. **Build Cache Issues** ⚠️ MOST COMMON

**Problem:** Vercel caches builds, and your recent UI changes might not be reflected.

**Solution:**
```bash
# In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Deployments"
3. Click on the latest deployment
4. Click "Redeploy" button
5. Check "Clear Build Cache" option
6. Click "Redeploy"
```

**Alternative - Force rebuild via Git:**
```bash
git commit --allow-empty -m "Force Vercel rebuild"
git push origin main
```

---

### 2. **CSS/Tailwind Not Loading Properly**

**Problem:** Tailwind CSS classes might not be generated correctly in production.

**Current Status:** ✅ Using Tailwind v4 with PostCSS

**Verification Needed:**
- Check if `tailwind.config.ts` or `tailwind.config.js` exists
- Verify `postcss.config.mjs` is properly configured
- Ensure all CSS files are imported in `app/globals.css`

**Solution - Check Tailwind Configuration:**

Create/verify `transport-client/tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

---

### 3. **Environment Variables Not Set**

**Problem:** Environment variables in `.env.local` are not available on Vercel.

**Current Variables:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `DATABASE_URL`
- `AFRICASTALKING_USERNAME`
- `AFRICASTALKING_API_KEY`
- `TELERIVET_SECRET`

**Solution:**
```bash
# In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add ALL variables from .env and .env.local
4. Make sure to add them for all environments (Production, Preview, Development)
5. Redeploy after adding variables
```

**Important:** Variables starting with `NEXT_PUBLIC_` must be set at build time!

---

### 4. **Static Generation vs Server-Side Rendering**

**Problem:** Pages might be statically generated at build time with old data.

**Current Setup:**
- All pages use `"use client"` directive ✅
- Dynamic imports with `ssr: false` for maps ✅
- API routes for data fetching ✅

**Potential Issue:** If pages are being statically generated, they won't show updated UI.

**Solution - Force Dynamic Rendering:**

Add to affected pages (e.g., `app/search/page.tsx`, `app/track/[id]/page.tsx`):

```typescript
// At the top of the file, after imports
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

---

### 5. **Next.js Configuration Issues**

**Current Config:** Very minimal configuration in `transport-client/next.config.ts`

**Problem:** Missing optimization settings that might affect rendering.

**Solution - Enhanced Next.js Config:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper rendering
  reactStrictMode: true,
  
  // Optimize for production
  swcMinify: true,
  compress: true,
  
  // Ensure proper CSS handling
  experimental: {
    optimizeCss: true,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  
  // Ensure proper file tracing
  outputFileTracing: true,
};

export default nextConfig;
```

---

### 6. **Prisma Client Generation**

**Problem:** Prisma client might not be generated correctly during Vercel build.

**Current Build Script:** ✅ `"build": "prisma generate && next build"`

**Verification:**
- Check Vercel build logs for Prisma generation errors
- Ensure `@prisma/client` is in `dependencies` (not `devDependencies`) ✅

**Solution if needed:**
```json
// In package.json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

### 7. **Monorepo Structure Issues**

**Problem:** Vercel might be building from the wrong directory.

**Current Structure:**
```
Transports Application/
├── transport-client/     ← Your app
├── transport-admin/
└── transport-driver/
```

**Solution - Vercel Project Settings:**

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to "General"
3. Set "Root Directory" to: `transport-client`
4. Set "Framework Preset" to: `Next.js`
5. Set "Build Command" to: `npm run build`
6. Set "Output Directory" to: `.next`
7. Set "Install Command" to: `npm install`

---

### 8. **CSS Specificity & Hydration Issues**

**Problem:** CSS might load differently on server vs client, causing layout shifts.

**Check for:**
- Inline styles that depend on client-side state
- CSS-in-JS that might not be SSR-compatible
- Tailwind classes that aren't being purged correctly

**Solution:**
- Ensure all dynamic styles are in `"use client"` components ✅
- Use Tailwind classes consistently
- Avoid mixing inline styles with Tailwind

---

### 9. **Browser Console Errors**

**Problem:** JavaScript errors on Vercel that don't appear locally.

**How to Check:**
1. Open your Vercel deployment URL
2. Open browser DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for failed requests

**Common Errors:**
- `Hydration failed` - Server HTML doesn't match client
- `Failed to fetch` - API routes not working
- `Module not found` - Missing dependencies
- CSS not loading - Tailwind configuration issue

---

## Step-by-Step Debugging Process

### Step 1: Check Vercel Build Logs
```bash
# In Vercel Dashboard:
1. Go to "Deployments"
2. Click on latest deployment
3. Click "View Build Logs"
4. Look for errors or warnings
```

**What to look for:**
- ❌ Prisma generation errors
- ❌ TypeScript compilation errors
- ❌ Missing dependencies
- ❌ CSS/Tailwind build errors
- ⚠️ Warnings about large bundle sizes

### Step 2: Check Runtime Logs
```bash
# In Vercel Dashboard:
1. Go to "Deployments"
2. Click on latest deployment
3. Click "View Function Logs"
4. Look for runtime errors
```

**What to look for:**
- ❌ Database connection errors
- ❌ API route errors
- ❌ Missing environment variables
- ❌ Prisma client errors

### Step 3: Compare Environments
```bash
# Check what's different:
1. Open localhost:3000 in browser
2. Open Vercel URL in browser
3. Compare:
   - Layout/styling
   - Functionality
   - Console errors
   - Network requests
```

### Step 4: Test Production Build Locally
```bash
# In transport-client directory:
npm run build
npm run start

# Then open http://localhost:3000
# This simulates Vercel's production environment
```

---

## Quick Fixes to Try (In Order)

### Fix 1: Clear Cache & Redeploy ⭐ TRY THIS FIRST
```bash
# In Vercel Dashboard:
Deployments → Latest → Redeploy → ✓ Clear Build Cache → Redeploy
```

### Fix 2: Add Missing Environment Variables
```bash
# In Vercel Dashboard:
Settings → Environment Variables → Add all from .env.local
```

### Fix 3: Set Correct Root Directory
```bash
# In Vercel Dashboard:
Settings → General → Root Directory: transport-client
```

### Fix 4: Force Dynamic Rendering
```typescript
// Add to app/search/page.tsx and app/track/[id]/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

### Fix 5: Update Next.js Config
```typescript
// Update transport-client/next.config.ts with enhanced config
```

---

## Specific Issues Based on Symptoms

### Symptom: "Styles not loading / looks broken"
**Likely Cause:** Tailwind CSS not building correctly
**Solution:**
1. Check `postcss.config.mjs` exists
2. Verify Tailwind config has correct content paths
3. Clear Vercel build cache
4. Redeploy

### Symptom: "Data not showing / API errors"
**Likely Cause:** Environment variables or database connection
**Solution:**
1. Add all environment variables to Vercel
2. Check DATABASE_URL is correct for production
3. Verify Prisma client is generated
4. Check Function Logs for errors

### Symptom: "Layout shifts / hydration errors"
**Likely Cause:** SSR/CSR mismatch
**Solution:**
1. Ensure all client-side code is in `"use client"` components
2. Use `dynamic` imports with `ssr: false` for browser-only code
3. Add `Suspense` boundaries
4. Force dynamic rendering

### Symptom: "Works after refresh but not on first load"
**Likely Cause:** Static generation with stale data
**Solution:**
1. Add `export const dynamic = 'force-dynamic'`
2. Add `export const revalidate = 0`
3. Use ISR (Incremental Static Regeneration) if needed

---

## Vercel-Specific Configuration Files

### Create `vercel.json` in transport-client/
```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Create `.vercelignore` in transport-client/
```
node_modules
.next
.env.local
*.log
.DS_Store
```

---

## Testing Checklist

Before marking as resolved, test:

- [ ] Homepage loads correctly
- [ ] Search page displays properly
- [ ] Tracking page shows correct layout
- [ ] "Acompanhar" button is in top right corner
- [ ] Status badges are black and white
- [ ] No "Em circulação" or "Ativo" badges
- [ ] All 6 metrics display correctly
- [ ] Price shows when destination selected
- [ ] Map loads correctly
- [ ] API routes work
- [ ] No console errors
- [ ] Mobile responsive design works

---

## Contact Vercel Support

If none of these solutions work, contact Vercel support with:

1. **Project URL:** [Your Vercel URL]
2. **Deployment ID:** [From latest deployment]
3. **Issue Description:** "UI changes work on localhost but not on Vercel"
4. **Build Logs:** Copy relevant errors
5. **Runtime Logs:** Copy relevant errors
6. **Screenshots:** Localhost vs Vercel comparison

---

## Most Likely Solution

Based on your description, the **#1 most likely cause** is:

🎯 **Build Cache Issue** - Your recent UI changes are cached

**Solution:**
1. Go to Vercel Dashboard
2. Deployments → Latest Deployment
3. Click "Redeploy"
4. ✓ Check "Clear Build Cache"
5. Click "Redeploy"

This should fix it in 90% of cases!

---

**End of Document**
