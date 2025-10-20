# Manual Testing Checklist for UCAEP Website

## Prerequisites
- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Railway
- ✅ Both services accessible via HTTPS

## Step 1: Get Your Deployment URLs

### Frontend URL (Vercel)
1. Go to your Vercel dashboard
2. Find your project
3. Copy the deployment URL (e.g., `https://your-app.vercel.app`)

### Backend URL (Railway)
1. Go to your Railway dashboard
2. Find your project
3. Copy the deployment URL (e.g., `https://your-app.railway.app`)

## Step 2: Test Backend API

### Health Check
**URL:** `https://your-railway-url.railway.app/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "UCAEP Server is running"
}
```

**How to Test:**
1. Open browser
2. Go to the health check URL
3. Verify you see the JSON response above

### API Endpoints Test
Test these URLs in your browser:

1. **News API:** `https://your-railway-url.railway.app/api/news`
   - Should return JSON array (empty or with news items)

2. **Producers API:** `https://your-railway-url.railway.app/api/producers`
   - Should return JSON array (empty or with producers)

3. **Services API:** `https://your-railway-url.railway.app/api/services`
   - Should return JSON array (empty or with services)

## Step 3: Test Frontend

### Basic Functionality
1. **Open Frontend URL** in browser
2. **Check Console** (F12 → Console tab)
   - ✅ No JavaScript errors
   - ✅ No CORS errors
   - ✅ No network errors

3. **Test Navigation**
   - ✅ Home page loads
   - ✅ News page loads
   - ✅ Producers page loads
   - ✅ Services page loads
   - ✅ About page loads
   - ✅ Contact page loads

### API Integration Test
1. **Open Network Tab** (F12 → Network tab)
2. **Navigate to News page**
   - ✅ Check if API calls are made to backend
   - ✅ Verify API calls return 200 status
   - ✅ Check if data loads on the page

3. **Test Form Submissions**
   - ✅ Go to Contact page
   - ✅ Fill out contact form
   - ✅ Submit form
   - ✅ Check if submission works

### Responsive Design Test
1. **Desktop View**
   - ✅ Layout looks good
   - ✅ All elements visible
   - ✅ Navigation works

2. **Mobile View**
   - ✅ Resize browser to mobile size
   - ✅ Check if layout adapts
   - ✅ Test mobile navigation
   - ✅ Test on actual mobile device

## Step 4: Performance Test

### Load Time Test
1. **Open Lighthouse** (Chrome DevTools → Lighthouse tab)
2. **Run Performance Audit**
   - ✅ Performance score > 70
   - ✅ First Contentful Paint < 3s
   - ✅ Largest Contentful Paint < 4s

### Network Test
1. **Open Network Tab** (F12 → Network tab)
2. **Reload page**
   - ✅ All resources load successfully
   - ✅ No failed requests
   - ✅ API calls complete quickly

## Step 5: Security Test

### HTTPS Test
- ✅ Frontend URL starts with `https://`
- ✅ Backend URL starts with `https://`
- ✅ No mixed content warnings

### CORS Test
1. **Open Console** (F12 → Console tab)
2. **Navigate between pages**
   - ✅ No CORS errors
   - ✅ API calls work from frontend

## Step 6: Error Handling Test

### Backend Errors
1. **Test Invalid Endpoint**
   - Go to: `https://your-railway-url.railway.app/api/invalid`
   - Should return 404 error page

2. **Test Health Check**
   - Go to: `https://your-railway-url.railway.app/api/health`
   - Should return success message

### Frontend Errors
1. **Test with Slow Network**
   - Open DevTools → Network tab
   - Set throttling to "Slow 3G"
   - Test if loading states work

2. **Test Offline**
   - Disconnect internet
   - Check if error handling works
   - Reconnect and test if app recovers

## Step 7: Browser Compatibility Test

### Desktop Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile Browsers
- ✅ Chrome Mobile
- ✅ Safari Mobile
- ✅ Responsive design works

## Step 8: Final Verification

### ✅ Success Criteria
- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without console errors
- [ ] API calls work from frontend
- [ ] No CORS errors
- [ ] All pages load correctly
- [ ] Forms can submit data
- [ ] Mobile responsive design works
- [ ] Performance is acceptable (< 3s load time)

### ❌ Issues to Fix
- [ ] Any 500 errors from backend
- [ ] CORS errors in browser console
- [ ] Frontend JavaScript errors
- [ ] API calls failing
- [ ] Pages not loading
- [ ] Forms not submitting
- [ ] Mobile layout broken
- [ ] Performance issues

## Troubleshooting Common Issues

### 1. CORS Errors
**Symptoms:** Browser console shows CORS errors
**Solution:** 
- Check CORS configuration in server
- Verify frontend domain is in allowed origins
- Check preflight request handling

### 2. API Connection Issues
**Symptoms:** Frontend can't connect to backend
**Solution:**
- Verify backend URL is correct
- Check if backend is running
- Test API endpoints directly

### 3. Environment Variable Issues
**Symptoms:** Wrong data or missing configuration
**Solution:**
- Check environment variables in both services
- Verify API URL is correct
- Check Supabase credentials

### 4. Build Issues
**Symptoms:** Deployment fails or app doesn't load
**Solution:**
- Check build logs in deployment platform
- Verify all dependencies are installed
- Check for TypeScript/JavaScript errors

## Testing Tools

### Browser DevTools
- **Console:** Check for JavaScript errors
- **Network:** Monitor API calls and responses
- **Application:** Check local storage and session storage
- **Performance:** Monitor load times and performance
- **Lighthouse:** Performance and accessibility audit

### Online Tools
- **GTmetrix:** Performance testing
- **WebPageTest:** Detailed performance analysis
- **Lighthouse:** Google's performance audit tool

## Next Steps After Testing

1. **If All Tests Pass:**
   - ✅ Your deployment is successful!
   - ✅ Share your application with users
   - ✅ Monitor performance and errors

2. **If Tests Fail:**
   - ❌ Check deployment logs
   - ❌ Verify environment variables
   - ❌ Test individual components
   - ❌ Check network connectivity
   - ❌ Review configuration files
