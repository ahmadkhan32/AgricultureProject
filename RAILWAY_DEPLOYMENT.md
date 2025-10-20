# Railway Backend Deployment Guide

## Prerequisites
- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository with your code
- Supabase project credentials

## Step-by-Step Deployment

### 1. Connect to Railway

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `Agricul website`

### 2. Configure the Service

1. **Select Service Type**
   - Railway will auto-detect Node.js
   - Make sure it's pointing to the `server` directory

2. **Set Environment Variables**
   In the Railway dashboard, go to your service → Variables tab and add:

   ```
   SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   NODE_ENV=production
   PORT=5000
   ```

3. **Configure Build Settings**
   - Railway will use the `railway.json` configuration
   - Build command: `cd server && npm install && npm start`
   - Start command: `npm start`

### 3. Deploy

1. **Trigger Deployment**
   - Railway will automatically start building
   - Monitor the build logs for any errors

2. **Get Your Backend URL**
   - Once deployed, Railway will provide a URL like: `https://your-project-name.railway.app`
   - Copy this URL - you'll need it for the frontend

### 4. Test the Deployment

1. **Health Check**
   - Visit: `https://your-railway-url.railway.app/api/health`
   - Should return: `{"status": "OK", "message": "UCAEP Server is running"}`

2. **Test API Endpoints**
   - Try: `https://your-railway-url.railway.app/api/news`
   - Should return news data or empty array

### 5. Update Frontend Configuration

1. **Update Vercel Environment Variables**
   - Go to your Vercel dashboard
   - Project Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your Railway backend URL:
     ```
     REACT_APP_API_URL=https://your-railway-url.railway.app/api
     ```

2. **Redeploy Frontend**
   - Trigger a new deployment in Vercel
   - This will pick up the new API URL

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Railway build logs
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables**
   - Double-check all environment variables are set
   - Ensure no typos in variable names
   - Check that Supabase credentials are correct

3. **CORS Errors**
   - Verify your Vercel domain is in the CORS origins
   - Check `server/index.js` CORS configuration

4. **Database Connection**
   - Ensure Supabase credentials are correct
   - Check if your Supabase project is active

### Monitoring

1. **Railway Dashboard**
   - Monitor CPU and memory usage
   - Check deployment logs
   - View environment variables

2. **Health Monitoring**
   - Set up health checks
   - Monitor API response times
   - Check error rates

## Production Checklist

- [ ] Environment variables configured
- [ ] Health check endpoint working
- [ ] CORS properly configured
- [ ] Database connection established
- [ ] API endpoints responding
- [ ] Frontend updated with backend URL
- [ ] Monitoring set up
- [ ] Error handling in place

## Support Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord Community](https://discord.gg/railway)
- [Supabase Documentation](https://supabase.com/docs)
