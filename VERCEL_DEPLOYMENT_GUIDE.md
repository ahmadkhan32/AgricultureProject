# 🚀 Vercel Deployment Guide - UCAEP Website

## ✅ Pre-Deployment Checklist (COMPLETED)
- [x] Client builds successfully
- [x] Vercel configuration is correct
- [x] Environment variables are set
- [x] CORS is configured
- [x] Build output is complete

## 🌐 Step 1: Deploy Frontend to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with your GitHub account**
3. **Click "New Project"**
4. **Import your repository:**
   - Repository: `ahmadkhan32/AgricultureProject` (or your repo name)
   - Framework Preset: **Create React App**
   - Root Directory: **`client`**
   - Build Command: **`npm run build`**
   - Output Directory: **`build`**

5. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM
   ```

6. **Click "Deploy"**

### Method 2: Vercel CLI (Alternative)

```bash
# Navigate to client directory
cd client

# Deploy to Vercel
npx vercel --prod
```

## 🚂 Step 2: Deploy Backend to Railway

### Railway Deployment Steps:

1. **Go to [railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Set Root Directory to `server`**
7. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

## 🔧 Step 3: Update CORS Settings

After both deployments are complete, update the CORS settings in your backend:

### Update server/index.js CORS configuration:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://your-vercel-app.vercel.app', // Production Vercel URL
    'https://your-custom-domain.com' // Custom domain (if any)
  ],
  credentials: true
}));
```

## 🧪 Step 4: Test the Deployed Application

### Frontend Testing:
1. **Visit your Vercel URL**
2. **Check if the homepage loads**
3. **Test navigation between pages**
4. **Verify environment variables are loaded**

### Backend Testing:
1. **Test API endpoints:**
   - `GET https://your-railway-url.railway.app/api/health`
   - `GET https://your-railway-url.railway.app/api/producers`
   - `GET https://your-railway-url.railway.app/api/news`

### Integration Testing:
1. **Test frontend-backend communication**
2. **Verify CORS is working**
3. **Test authentication flows**
4. **Check database connections**

## 🔄 Step 5: Update Environment Variables

After Railway deployment, update your Vercel environment variables:

1. **Go to Vercel Dashboard → Your Project → Settings → Environment Variables**
2. **Update `REACT_APP_API_URL` to your Railway URL:**
   ```
   REACT_APP_API_URL=https://your-railway-url.railway.app/api
   ```
3. **Redeploy your Vercel project**

## 📋 Deployment URLs

After successful deployment, you'll have:

- **Frontend:** `https://your-app-name.vercel.app`
- **Backend:** `https://your-app-name.railway.app`
- **Admin Dashboard:** `https://your-app-name.vercel.app/admin`

## 🚨 Troubleshooting

### Common Issues:

1. **404 Errors:**
   - Ensure root directory is set to `client` in Vercel
   - Check if build output exists

2. **CORS Errors:**
   - Update CORS configuration in server
   - Add Vercel domain to allowed origins

3. **Environment Variables Not Working:**
   - Check variable names (must start with REACT_APP_)
   - Redeploy after adding variables

4. **Build Failures:**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json

## ✅ Success Indicators

Your deployment is successful when:
- [ ] Vercel deployment shows "Ready"
- [ ] Railway deployment shows "Deployed"
- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] CORS errors are resolved
- [ ] Environment variables are loaded

## 🎉 Next Steps

1. **Set up custom domain (optional)**
2. **Configure SSL certificates**
3. **Set up monitoring and alerts**
4. **Train admin users**
5. **Launch and promote the website**

---

**Your UCAEP website is now ready to serve the agricultural community of the Comoros! 🌾**
