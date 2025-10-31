# 🚀 Deploy to Vercel & GitHub - Complete Guide

## 📋 Overview
This guide walks you through deploying the UCAEP website to both **GitHub** (source control) and **Vercel** (hosting platform).

## 🎯 Prerequisites

- Git installed on your system
- GitHub account
- Vercel account (can sign up with GitHub)
- Supabase project configured
- Node.js and npm installed

---

## 📦 Part 1: Push to GitHub

### Step 1: Initialize Git Repository (if not already done)

```bash
# Navigate to project directory
cd "C:\Users\asadk\Downloads\Agricul website"

# Initialize git (if not already done)
git init

# Check current status
git status
```

### Step 2: Create .gitignore File

Create/update `.gitignore` in the project root:

```gitignore
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/client/build
/server/node_modules

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Debug files
debug.log
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
Thumbs.db
```

### Step 3: Stage and Commit Files

```bash
# Add all files (except those in .gitignore)
git add .

# Check what will be committed
git status

# Commit with a message
git commit -m "Initial commit: UCAEP Website with CRUD functionality"
```

### Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Repository details:
   - **Name**: `ucaep-website` (or your preferred name)
   - **Description**: "UCAEP Agricultural Website - React + Node.js + Supabase"
   - **Visibility**: Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
4. Click **"Create repository"**

### Step 5: Push to GitHub

```bash
# Add GitHub as remote (replace with your username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/ucaep-website.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 6: Verify GitHub Repository

1. Go to your GitHub repository
2. Verify all files are present
3. Check that sensitive files (.env) are NOT uploaded

---

## 🌐 Part 2: Deploy to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your repository (`ucaep-website`)
3. Click **"Import"**

### Step 3: Configure Project Settings

Configure the following settings:

#### Project Settings:
- **Framework Preset**: Create React App
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

#### Environment Variables:
Click **"Environment Variables"** and add:

```
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
REACT_APP_API_URL=https://your-api-url.com/api
```

**Where to find your keys:**
1. Go to your Supabase dashboard
2. Settings → API
3. Copy **Project URL** and **anon public** key

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. You'll see a deployment URL (e.g., `https://ucaep-website.vercel.app`)

### Step 5: Update Vercel Configuration

Update `vercel.json` in your project:

```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/build",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 6: Redeploy (if configuration was updated)

```bash
# Commit and push the updated configuration
git add vercel.json
git commit -m "Update Vercel configuration"
git push

# Vercel will automatically redeploy
```

---

## 🔧 Part 3: Deploy Backend (Railway or Vercel Functions)

### Option A: Deploy to Railway (Recommended for Node.js Backend)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

6. Add Environment Variables:
```
NODE_ENV=production
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Option B: Deploy as Vercel Serverless Functions

Create `api` folder in `client` directory and convert your backend to serverless functions.

---

## ✅ Part 4: Final Configuration

### 1. Update CORS in Backend

Update `server/index.js`:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://your-vercel-app.vercel.app',
  'https://www.your-domain.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### 2. Update Frontend API URL

Update `.env` or environment variables in Vercel:

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### 3. Configure Supabase CORS

In Supabase Dashboard → Settings → API → Add your Vercel URL to allowed origins.

---

## 🧪 Part 5: Testing Deployment

### Test Frontend (Vercel):
1. Visit your Vercel URL
2. Check homepage loads
3. Test navigation
4. Verify forms work
5. Test CRUD operations

### Test Backend (Railway):
```bash
# Test health endpoint
curl https://your-backend.railway.app/api/health

# Test API endpoints
curl https://your-backend.railway.app/api/services
```

### Test Integration:
1. Submit content from ContentDashboard
2. Verify it appears in Services page
3. Test image upload
4. Verify database connection

---

## 📱 Part 6: Custom Domain (Optional)

### Add Custom Domain in Vercel:

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~24 hours)

---

## 🔄 Part 7: Continuous Deployment

### Automatic Deployments:

Every time you push to GitHub:
1. Vercel detects changes
2. Automatically builds and deploys
3. You get a preview URL for PRs
4. Production deployment for main branch

### Manual Deployment:

If you need to manually trigger a deployment:
```bash
# Push to GitHub
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails in Vercel**
   - Check build logs
   - Verify environment variables
   - Check Node version in `package.json`

2. **404 Errors on Routes**
   - Ensure `vercel.json` has rewrite rules
   - Check routing configuration

3. **Environment Variables Not Working**
   - Verify variables are set in Vercel dashboard
   - Redeploy after adding variables
   - Check variable names are correct

4. **Database Connection Issues**
   - Verify Supabase credentials (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`)
   - Check CORS settings in Supabase

5. **CORS Errors**
   - Update backend CORS settings
   - Add Vercel URL to allowed origins

---

## 📊 Deployment Checklist

### Pre-Deployment:
- [ ] All code is committed to GitHub
- [ ] .gitignore is configured correctly
- [ ] Environment variables documented
- [ ] Supabase is configured
- [ ] Build works locally

### During Deployment:
- [ ] Project imported in Vercel
- [ ] Environment variables added
- [ ] Build completes successfully
- [ ] Site is accessible

### Post-Deployment:
- [ ] Frontend loads correctly
- [ ] Backend API is accessible
- [ ] CRUD operations work
- [ ] Images upload successfully
- [ ] Navigation works
- [ ] Mobile responsive

---

## 🎉 Success!

Your website is now:
- ✅ Hosted on Vercel (frontend)
- ✅ Backend on Railway (or Vercel Functions)
- ✅ Database on Supabase
- ✅ Code on GitHub
- ✅ Automatic deployments enabled

### Your URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/ucaep-website`

---

**Your website is now live and ready for production! 🚀**

