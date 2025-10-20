# UCAEP Website - End-to-End Testing Guide

## Prerequisites
- Frontend deployed on Vercel
- Backend deployed on Railway
- Both services running and accessible

## Testing Checklist

### 1. Backend Health Check
**URL:** `https://your-railway-url.railway.app/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "UCAEP Server is running"
}
```

**Test Command:**
```bash
curl https://your-railway-url.railway.app/api/health
```

### 2. Backend API Endpoints

#### News API
- **URL:** `https://your-railway-url.railway.app/api/news`
- **Method:** GET
- **Expected:** Array of news items or empty array

#### Producers API
- **URL:** `https://your-railway-url.railway.app/api/producers`
- **Method:** GET
- **Expected:** Array of producers or empty array

#### Services API
- **URL:** `https://your-railway-url.railway.app/api/services`
- **Method:** GET
- **Expected:** Array of services or empty array

### 3. Frontend Testing

#### Basic Functionality
- [ ] Homepage loads without errors
- [ ] Navigation works between pages
- [ ] Language switcher functions
- [ ] Responsive design works on mobile/desktop

#### Page-Specific Tests
- [ ] **Home Page:** Hero section, stats, news preview
- [ ] **News Page:** News list loads, individual news items
- [ ] **Producers Page:** Producer list, search/filter
- [ ] **Services Page:** Services list and details
- [ ] **About Page:** Content displays properly
- [ ] **Contact Page:** Contact form functionality

#### Authentication Tests
- [ ] Login functionality
- [ ] Registration process
- [ ] Protected routes (if implemented)
- [ ] Admin dashboard access

### 4. API Integration Tests

#### CORS Testing
- [ ] No CORS errors in browser console
- [ ] API calls work from frontend
- [ ] Preflight requests handled correctly

#### Data Flow Testing
- [ ] Frontend can fetch data from backend
- [ ] Forms can submit data to backend
- [ ] Error handling works properly
- [ ] Loading states display correctly

### 5. Performance Testing

#### Load Times
- [ ] Initial page load < 3 seconds
- [ ] API responses < 2 seconds
- [ ] Images load properly
- [ ] No memory leaks in browser

#### Network Testing
- [ ] Check Network tab in DevTools
- [ ] Verify API calls are successful
- [ ] Check for failed requests
- [ ] Monitor response times

### 6. Error Handling Tests

#### Backend Errors
- [ ] 404 errors handled gracefully
- [ ] 500 errors return proper error messages
- [ ] Invalid API calls return appropriate errors

#### Frontend Errors
- [ ] Network errors handled
- [ ] Loading states for slow requests
- [ ] Error messages display to users
- [ ] Fallback content for missing data

### 7. Security Tests

#### CORS Security
- [ ] Only allowed origins can access API
- [ ] Preflight requests work correctly
- [ ] No CORS errors in production

#### Authentication Security
- [ ] JWT tokens work properly
- [ ] Protected routes require authentication
- [ ] Session management works

### 8. Browser Compatibility

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Responsive design works

## Automated Testing Script

### Test Backend Health
```bash
# Test health endpoint
curl -X GET "https://your-railway-url.railway.app/api/health" \
  -H "Content-Type: application/json"

# Test news endpoint
curl -X GET "https://your-railway-url.railway.app/api/news" \
  -H "Content-Type: application/json"

# Test producers endpoint
curl -X GET "https://your-railway-url.railway.app/api/producers" \
  -H "Content-Type: application/json"
```

### Test CORS
```bash
# Test CORS preflight
curl -X OPTIONS "https://your-railway-url.railway.app/api/health" \
  -H "Origin: https://your-vercel-url.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"
```

## Common Issues and Solutions

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

### Online Tools
- **GTmetrix:** Performance testing
- **WebPageTest:** Detailed performance analysis
- **Lighthouse:** Google's performance audit tool

## Success Criteria

### ✅ Deployment Successful If:
- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without console errors
- [ ] API calls work from frontend
- [ ] No CORS errors
- [ ] All pages load correctly
- [ ] Forms can submit data
- [ ] Authentication works (if implemented)
- [ ] Mobile responsive design works
- [ ] Performance is acceptable (< 3s load time)

### ❌ Issues to Fix:
- [ ] Any 500 errors from backend
- [ ] CORS errors in browser console
- [ ] Frontend JavaScript errors
- [ ] API calls failing
- [ ] Pages not loading
- [ ] Forms not submitting
- [ ] Authentication not working
- [ ] Mobile layout broken
- [ ] Performance issues
