# UCAEP Website Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Steps
1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the React app

2. **Environment Variables**
   The following environment variables are already configured in `vercel.json`:
   ```json
   {
     "REACT_APP_API_URL": "https://your-railway-backend-url.railway.app/api",
     "REACT_APP_SUPABASE_URL": "https://nzsydskdetneulvvpqxn.supabase.co",
     "REACT_APP_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project-name.vercel.app`

## Backend Deployment (Railway)

### Prerequisites
- Railway account
- GitHub repository

### Steps
1. **Connect Repository to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Environment Variables**
   In Railway dashboard, add these environment variables:
   ```
   SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   NODE_ENV=production
   PORT=5000
   ```

3. **Deploy**
   - Railway will automatically detect the Node.js app
   - The backend will be available at `https://your-project-name.railway.app`

4. **Update Frontend API URL**
   - After Railway deployment, update the `REACT_APP_API_URL` in Vercel
   - Go to Vercel dashboard → Project Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your Railway backend URL

## Testing the Deployment

### 1. Health Check
- Backend: `https://your-railway-url.railway.app/api/health`
- Should return: `{"status": "OK", "message": "UCAEP Server is running"}`

### 2. Frontend Test
- Visit your Vercel URL
- Check if the app loads without errors
- Test navigation between pages
- Test authentication (if implemented)

### 3. API Integration Test
- Open browser developer tools
- Check Network tab for API calls
- Verify CORS is working (no CORS errors)
- Test form submissions

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your Vercel domain is added to CORS origins in server
   - Check `server/index.js` CORS configuration

2. **Environment Variables**
   - Verify all environment variables are set correctly
   - Check for typos in variable names

3. **Build Failures**
   - Check build logs in Vercel/Railway dashboard
   - Ensure all dependencies are in package.json

4. **API Connection Issues**
   - Verify the API URL is correct
   - Check if backend is running
   - Test API endpoints directly

### Support
- Vercel Documentation: https://vercel.com/docs
- Railway Documentation: https://docs.railway.app
- Supabase Documentation: https://supabase.com/docs
