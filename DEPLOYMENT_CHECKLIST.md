# 🚀 Deployment Checklist - Success Recipe Finder

## ✅ Pre-Deployment Checklist

### 1. Local Build Verification
- [x] Production build completes successfully (`npm run build`)
- [x] TypeScript type checking passes
- [x] No build warnings (except ADMIN_PASSWORD length)
- [x] Application runs in production mode (`npm start`)

### 2. Environment Variables
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Set strong ADMIN_PASSWORD (12+ characters)
- [ ] Prepare DATABASE_URL for production

### 3. Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Run type checking: `npm run type-check`
- [ ] Review security headers in `next.config.ts`

### 4. Database
- [ ] Prisma schema is finalized
- [ ] Test database migrations locally

## 📦 GitHub Repository Setup

### Create and Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Success Recipe Finder web system"

# Create GitHub repository (via GitHub CLI or web interface)
gh repo create success-recipe-finder --public --source=. --remote=origin

# Or manually add remote
git remote add origin https://github.com/YOUR_USERNAME/success-recipe-finder.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Vercel Deployment (Recommended)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your `success-recipe-finder` repository
3. Framework Preset: **Next.js** (auto-detected)

### Step 3: Configure Environment Variables

**CRITICAL**: Set these in Vercel Dashboard → Settings → Environment Variables

```env
# JWT Secret (REQUIRED)
# Generate with: openssl rand -base64 32
JWT_SECRET=YOUR_GENERATED_SECRET_HERE_MIN_32_CHARS

# Admin Password (REQUIRED)
# Must be 12+ characters with uppercase, lowercase, numbers, symbols
ADMIN_PASSWORD=Your$ecureP@ssw0rd2025!

# Database URL (REQUIRED)
# Option 1: Use Vercel Postgres (recommended)
DATABASE_URL=postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb

# Option 2: Use external service (Supabase, Neon, PlanetScale)
# DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Node Environment (AUTO-SET by Vercel)
NODE_ENV=production
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Deployment URL will be: `https://success-recipe-finder.vercel.app`

### Step 5: Database Setup (Vercel Postgres)

#### Option A: Vercel Postgres (Easiest)
1. Go to Vercel Dashboard → Storage tab
2. Click "Create Database" → "Postgres"
3. Name: `success-recipe-db`
4. Click "Create"
5. Copy `DATABASE_URL` from "Connect" tab
6. Add to Environment Variables in your project
7. Redeploy the project

#### Option B: External Database (Supabase/Neon)
1. Sign up at [supabase.com](https://supabase.com) or [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string (starts with `postgresql://`)
4. Add to Vercel Environment Variables as `DATABASE_URL`
5. Redeploy

### Step 6: Run Database Migration

After setting DATABASE_URL, you need to initialize the database:

```bash
# Pull production environment variables locally
vercel env pull .env.production

# Run Prisma migration
npx prisma migrate deploy

# Or run directly with production DATABASE_URL
DATABASE_URL="your_production_url" npx prisma migrate deploy
```

### Step 7: Initial Setup
1. Visit `https://your-app.vercel.app/admin`
2. Login with your `ADMIN_PASSWORD`
3. Upload CSV file to import articles
4. Verify articles appear at `/articles`

## 🔐 Security Post-Deployment

### Verify Security Headers
```bash
# Test your deployed site
curl -I https://your-app.vercel.app

# Should see these headers:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: max-age=63072000
# Content-Security-Policy: ...
```

### JWT Secret Generation
```bash
# Generate cryptographically secure JWT secret
openssl rand -base64 32

# Or use online tool (HTTPS only):
# https://generate-secret.vercel.app/32
```

### Password Requirements
- Minimum 12 characters
- Include: uppercase, lowercase, numbers, symbols
- Example: `Secure$RecipeF1nd3r!2025`

## 📊 Post-Deployment Monitoring

### Vercel Dashboard
- **Analytics**: Track page views and users
- **Speed Insights**: Monitor performance metrics
- **Logs**: Check for runtime errors
- **Deployment History**: Rollback if needed

### Custom Domain (Optional)
1. Vercel Dashboard → Settings → Domains
2. Add your domain: `success-recipe.yourdomain.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: success-recipe
   Value: cname.vercel-dns.com
   ```

## 🔄 Continuous Deployment

### Automatic Deployments
Every push to `main` branch triggers automatic deployment:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically deploys
```

### Preview Deployments
Every Pull Request gets a preview URL:
- Create branch: `git checkout -b feature/new-feature`
- Push changes: `git push origin feature/new-feature`
- Create PR on GitHub
- Get preview URL from Vercel bot comment

## ⚠️ Troubleshooting

### Build Fails
**Error**: `Cannot find module '@prisma/client'`
```bash
# Solution: Ensure postinstall script runs
# Check package.json has: "postinstall": "prisma generate"
```

### Database Connection Error
**Error**: `P1001: Can't reach database server`
```bash
# Solutions:
1. Verify DATABASE_URL is set in Vercel Environment Variables
2. Check database server is running
3. Verify IP whitelist (if using external DB)
4. Test connection locally first
```

### Admin Login Fails
**Error**: "Invalid password"
```bash
# Solutions:
1. Verify ADMIN_PASSWORD matches in .env and Vercel
2. Password must be 12+ characters
3. Check for extra spaces in environment variable
4. Redeploy after changing environment variables
```

### Articles Don't Load
**Error**: Empty articles page
```bash
# Solutions:
1. Run database migration: npx prisma migrate deploy
2. Import articles via /admin panel
3. Check Vercel logs for API errors
```

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [GitHub Issues](https://github.com/YOUR_USERNAME/success-recipe-finder/issues)

## ✨ Success Indicators

You know deployment succeeded when:
- ✅ Build completes in ~2-3 minutes
- ✅ Deployment URL is accessible
- ✅ Homepage loads with header image
- ✅ `/admin` login works with your password
- ✅ Articles can be imported via CSV
- ✅ `/articles` page shows imported articles
- ✅ Search and filters work correctly
- ✅ Mobile responsive design works
- ✅ No console errors in browser DevTools

---

**Last Updated**: 2025-11-24
**Version**: 1.0.0
**Status**: Production Ready ✅
