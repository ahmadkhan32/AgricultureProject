# Deployment Status Checker & Troubleshooting Guide

## 🔍 How to Check Deployment Status

### **Step 1: Check Railway Backend Status**

#### 1.1 Access Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Sign in with your GitHub account
3. Find your project in the dashboard

#### 1.2 Check Deployment Status
**Look for these indicators:**
- ✅ **Green status** = Deployment successful
- ❌ **Red status** = Deployment failed
- 🟡 **Yellow status** = Deployment in progress
- ⚪ **Gray status** = Deployment not started

#### 1.3 Check Build Logs
1. **Click on your project**
2. **Go to "Deployments" tab**
3. **Click on the latest deployment**
4. **Check build logs for errors**

#### 1.4 Test Backend Endpoints
```bash
# Test health check
curl https://your-railway-url.railway.app/api/health

# Test API endpoints
curl https://your-railway-url.railway.app/api/news
curl https://your-railway-url.railway.app/api/producers
```

**Expected Responses:**
- Health check: `{"status": "OK", "message": "UCAEP Server is running"}`
- API endpoints: JSON arrays (may be empty)

### **Step 2: Check Vercel Frontend Status**

#### 2.1 Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Find your project in the dashboard

#### 2.2 Check Deployment Status
**Look for these indicators:**
- ✅ **Ready** = Deployment successful
- ❌ **Failed** = Deployment failed
- 🟡 **Building** = Deployment in progress
- ⚪ **Queued** = Deployment waiting to start

#### 2.3 Check Build Logs
1. **Click on your project**
2. **Go to "Deployments" tab**
3. **Click on the latest deployment**
4. **Check build logs for errors**

#### 2.4 Test Frontend
1. **Click on your deployment URL**
2. **Open browser developer tools (F12)**
3. **Check Console tab for errors**
4. **Check Network tab for failed requests**

### **Step 3: Common Deployment Issues**

#### Issue 1: Railway Backend Issues

##### Problem: Build Fails
**Symptoms:**
- Red status in Railway dashboard
- Build logs show errors
- No health check endpoint available

**Solutions:**
1. **Check build logs** for specific errors
2. **Verify environment variables** are set correctly
3. **Check package.json** has all required dependencies
4. **Ensure Node.js version** is compatible

##### Problem: Environment Variables Missing
**Symptoms:**
- Backend starts but API calls fail
- Database connection errors
- Authentication issues

**Solutions:**
1. **Check Railway environment variables:**
   ```
   SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   NODE_ENV=production
   PORT=5000
   ```

2. **Verify Supabase credentials** are correct
3. **Check JWT secret** is set and secure

##### Problem: CORS Issues
**Symptoms:**
- Frontend can't connect to backend
- CORS errors in browser console
- API calls fail

**Solutions:**
1. **Check CORS configuration** in `server/index.js`
2. **Verify frontend domain** is in allowed origins
3. **Test CORS preflight** requests

#### Issue 2: Vercel Frontend Issues

##### Problem: Build Fails
**Symptoms:**
- Red status in Vercel dashboard
- Build logs show errors
- No frontend URL available

**Solutions:**
1. **Check build logs** for specific errors
2. **Verify vercel.json** configuration
3. **Check package.json** has all required dependencies
4. **Ensure React build** completes successfully

##### Problem: Environment Variables Missing
**Symptoms:**
- Frontend loads but API calls fail
- Wrong API URL in network requests
- CORS errors

**Solutions:**
1. **Check Vercel environment variables:**
   ```
   REACT_APP_API_URL=https://your-railway-url.railway.app/api
   REACT_APP_SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Verify API URL** points to your Railway backend
3. **Check Supabase credentials** are correct

##### Problem: Routing Issues
**Symptoms:**
- 404 errors on page refresh
- SPA routing not working
- Pages not loading

**Solutions:**
1. **Check vercel.json** routing configuration
2. **Verify build output** directory is correct
3. **Test SPA routing** configuration

### **Step 4: Troubleshooting Commands**

#### Check Local Build
```bash
# Test backend locally
cd server
npm install
npm start

# Test frontend locally
cd client
npm install
npm run build
npm start
```

#### Check Git Status
```bash
# Check if changes are committed
git status

# Check if changes are pushed
git log --oneline -5

# Check remote repository
git remote -v
```

#### Test API Endpoints
```bash
# Test health check
curl -X GET "https://your-railway-url.railway.app/api/health"

# Test news API
curl -X GET "https://your-railway-url.railway.app/api/news"

# Test CORS
curl -X OPTIONS "https://your-railway-url.railway.app/api/health" \
  -H "Origin: https://your-vercel-url.vercel.app"
```

### **Step 5: Deployment Verification Checklist**

#### ✅ Railway Backend Verification
- [ ] Project created successfully
- [ ] Environment variables set correctly
- [ ] Deployment status is green/ready
- [ ] Health check endpoint returns 200 OK
- [ ] API endpoints respond correctly
- [ ] No errors in build logs
- [ ] CORS configuration is correct

#### ✅ Vercel Frontend Verification
- [ ] Project imported successfully
- [ ] Environment variables set correctly
- [ ] Deployment status is ready
- [ ] Frontend URL is accessible
- [ ] No errors in build logs
- [ ] All pages load correctly
- [ ] API calls work from frontend

#### ✅ Integration Verification
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser console
- [ ] Data loads from API endpoints
- [ ] Forms can submit data
- [ ] Authentication works (if implemented)
- [ ] Mobile responsive design works

### **Step 6: Common Error Messages and Solutions**

#### Error: "Module not found"
**Solution:**
- Check if all dependencies are in package.json
- Run `npm install` locally to verify
- Check if build process installs dependencies

#### Error: "Environment variable not found"
**Solution:**
- Check environment variables in deployment platform
- Verify variable names are correct
- Check if variables are set in the right environment

#### Error: "CORS policy blocked"
**Solution:**
- Check CORS configuration in server
- Verify frontend domain is in allowed origins
- Test CORS preflight requests

#### Error: "Build failed"
**Solution:**
- Check build logs for specific errors
- Verify all dependencies are available
- Check for TypeScript/JavaScript errors
- Ensure build commands are correct

#### Error: "404 Not Found"
**Solution:**
- Check if deployment was successful
- Verify URLs are correct
- Check routing configuration
- Test endpoints directly

### **Step 7: Quick Fix Commands**

#### Fix Railway Deployment
```bash
# Check if code is committed
git status

# Commit any changes
git add .
git commit -m "Fix Railway deployment"
git push origin main

# Check Railway dashboard for new deployment
```

#### Fix Vercel Deployment
```bash
# Check if code is committed
git status

# Commit any changes
git add .
git commit -m "Fix Vercel deployment"
git push origin main

# Check Vercel dashboard for new deployment
```

#### Test Both Deployments
```bash
# Test backend
curl https://your-railway-url.railway.app/api/health

# Test frontend (open in browser)
# Check browser console for errors
# Test navigation between pages
```

### **Step 8: Emergency Recovery**

#### If Railway Deployment Fails
1. **Check build logs** for specific errors
2. **Verify environment variables** are set
3. **Check if all dependencies** are in package.json
4. **Try redeploying** from Railway dashboard
5. **Contact Railway support** if needed

#### If Vercel Deployment Fails
1. **Check build logs** for specific errors
2. **Verify vercel.json** configuration
3. **Check if all dependencies** are in package.json
4. **Try redeploying** from Vercel dashboard
5. **Contact Vercel support** if needed

#### If Both Deployments Fail
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
