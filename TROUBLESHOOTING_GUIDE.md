# UCAEP Website - Deployment Troubleshooting Guide

## 🚨 Critical Issues Found

### **Issue 1: Vercel Configuration Problem**
Your `vercel.json` still has a placeholder URL:
```json
"REACT_APP_API_URL": "https://your-railway-backend-url.railway.app/api"
```

**This needs to be updated with your actual Railway URL!**

## 🔧 Step-by-Step Fix

### **Step 1: Deploy Backend to Railway FIRST**

#### 1.1 Go to Railway Dashboard
1. Visit [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

#### 1.2 Set Environment Variables
In Railway dashboard, add these variables:
```
SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=production
PORT=5000
```

#### 1.3 Wait for Deployment
- Wait for Railway to build and deploy
- Copy your Railway URL (e.g., `https://your-project.railway.app`)

#### 1.4 Test Backend
```bash
# Test health check
curl https://your-railway-url.railway.app/api/health

# Should return: {"status": "OK", "message": "UCAEP Server is running"}
```

### **Step 2: Update Vercel Configuration**

#### 2.1 Fix vercel.json
Update your `vercel.json` with the actual Railway URL:

```json
{
  "env": {
    "REACT_APP_API_URL": "https://your-actual-railway-url.railway.app/api",
    "REACT_APP_SUPABASE_URL": "https://nzsydskdetneulvvpqxn.supabase.co",
    "REACT_APP_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2.2 Commit and Push Changes
```bash
git add vercel.json
git commit -m "Update vercel.json with actual Railway URL"
git push origin main
```

### **Step 3: Deploy Frontend to Vercel**

#### 3.1 Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Vercel will use your updated `vercel.json`

#### 3.2 Wait for Deployment
- Wait for Vercel to build and deploy
- Copy your Vercel URL (e.g., `https://your-project.vercel.app`)

### **Step 4: Test Integration**

#### 4.1 Test Backend
```bash
# Test health check
curl https://your-railway-url.railway.app/api/health

# Test API endpoints
curl https://your-railway-url.railway.app/api/news
curl https://your-railway-url.railway.app/api/producers
```

#### 4.2 Test Frontend
1. Open your Vercel URL in browser
2. Open Developer Tools (F12)
3. Check Console tab for errors
4. Check Network tab for API calls

## 🔍 Common Deployment Issues

### **Issue 1: Railway Backend Not Working**

#### Symptoms:
- Health check returns 404 or error
- API endpoints don't respond
- Build failed in Railway dashboard

#### Solutions:
1. **Check Railway build logs** for specific errors
2. **Verify environment variables** are set correctly
3. **Check if all dependencies** are in package.json
4. **Try redeploying** from Railway dashboard

#### Debug Commands:
```bash
# Check if backend is running
curl https://your-railway-url.railway.app/api/health

# Check specific API endpoints
curl https://your-railway-url.railway.app/api/news
curl https://your-railway-url.railway.app/api/producers
```

### **Issue 2: Vercel Frontend Not Working**

#### Symptoms:
- Frontend URL shows 404 or error
- Build failed in Vercel dashboard
- Pages don't load correctly

#### Solutions:
1. **Check Vercel build logs** for specific errors
2. **Verify vercel.json** configuration is correct
3. **Check if all dependencies** are in package.json
4. **Try redeploying** from Vercel dashboard

#### Debug Commands:
```bash
# Test local build
cd client
npm install
npm run build

# Check if build succeeds
ls -la build/
```

### **Issue 3: Integration Problems**

#### Symptoms:
- CORS errors in browser console
- API calls fail
- Frontend can't connect to backend

#### Solutions:
1. **Check CORS configuration** in server/index.js
2. **Verify API URL** is correct in vercel.json
3. **Check if both services** are running
4. **Test API endpoints** directly

#### Debug Commands:
```bash
# Test CORS preflight
curl -X OPTIONS "https://your-railway-url.railway.app/api/health" \
  -H "Origin: https://your-vercel-url.vercel.app"

# Test API calls from frontend
# Open browser console and check Network tab
```

## 🛠️ Quick Fix Commands

### **Fix Railway Deployment**
```bash
# Check if code is committed
git status

# Commit any changes
git add .
git commit -m "Fix Railway deployment"
git push origin main

# Check Railway dashboard for new deployment
```

### **Fix Vercel Deployment**
```bash
# Check if code is committed
git status

# Commit any changes
git add .
git commit -m "Fix Vercel deployment"
git push origin main

# Check Vercel dashboard for new deployment
```

### **Test Both Deployments**
```bash
# Test backend
curl https://your-railway-url.railway.app/api/health

# Test frontend (open in browser)
# Check browser console for errors
# Test navigation between pages
```

## 📋 Deployment Checklist

### **Railway Backend Checklist**
- [ ] Project created successfully
- [ ] Environment variables set correctly
- [ ] Deployment status is green/ready
- [ ] Health check endpoint returns 200 OK
- [ ] API endpoints respond correctly
- [ ] No errors in build logs
- [ ] CORS configuration is correct

### **Vercel Frontend Checklist**
- [ ] Project imported successfully
- [ ] Environment variables set correctly
- [ ] Deployment status is ready
- [ ] Frontend URL is accessible
- [ ] No errors in build logs
- [ ] All pages load correctly
- [ ] API calls work from frontend

### **Integration Checklist**
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser console
- [ ] Data loads from API endpoints
- [ ] Forms can submit data
- [ ] Authentication works (if implemented)
- [ ] Mobile responsive design works

## 🚨 Emergency Recovery

### **If Railway Deployment Fails**
1. **Check build logs** for specific errors
2. **Verify environment variables** are set
3. **Check if all dependencies** are in package.json
4. **Try redeploying** from Railway dashboard
5. **Contact Railway support** if needed

### **If Vercel Deployment Fails**
1. **Check build logs** for specific errors
2. **Verify vercel.json** configuration
3. **Check if all dependencies** are in package.json
4. **Try redeploying** from Vercel dashboard
5. **Contact Vercel support** if needed

### **If Both Deployments Fail**
1. **Check if code is committed** and pushed
2. **Verify all configuration files** are correct
3. **Test locally** to ensure code works
4. **Check for any syntax errors** in code
5. **Review deployment logs** for specific errors

## 🎯 Quick Status Check

### **Railway Status:**
- Go to [railway.app](https://railway.app) → Your Project → Check status
- Test: `https://your-railway-url.railway.app/api/health`

### **Vercel Status:**
- Go to [vercel.com](https://vercel.com) → Your Project → Check status
- Test: Open your Vercel URL in browser

### **Integration Status:**
- Open frontend URL
- Check browser console (F12)
- Look for CORS errors or API connection issues

## 📞 Support Resources

### **Railway Support**
- Documentation: [docs.railway.app](https://docs.railway.app)
- Discord: [discord.gg/railway](https://discord.gg/railway)
- GitHub: [github.com/railwayapp](https://github.com/railwayapp)

### **Vercel Support**
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Discord: [discord.gg/vercel](https://discord.gg/vercel)
- GitHub: [github.com/vercel](https://github.com/vercel)

### **Supabase Support**
- Documentation: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub: [github.com/supabase](https://github.com/supabase)
