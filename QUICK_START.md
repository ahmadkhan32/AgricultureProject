# 🚀 UCAEP Website - Quick Start Guide

Get your UCAEP website up and running in 15 minutes!

## ⚡ Super Quick Setup (5 minutes)

### 1. Prerequisites Check
- [ ] Node.js installed (v16+)
- [ ] Git installed
- [ ] Supabase account (free)

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd ucaeep-website
npm run install-all
```

### 3. Set Up Supabase (2 minutes)
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your Project URL and API keys
3. Go to SQL Editor → New Query → Paste `database/schema.sql` → Run

### 4. Configure Environment
```bash
# Copy environment files
cp server/env.example server/.env
cp client/env.example client/.env

# Edit with your Supabase credentials
# server/.env - add your SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# client/.env - add your SUPABASE_URL, SUPABASE_ANON_KEY
```

### 5. Start Development
```bash
npm run dev
```

**🎉 Done!** Visit http://localhost:3000

---

## 🌐 Quick Production Deployment (10 minutes)

### Option A: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set Root Directory: `client`
4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Deploy!

#### Backend (Railway)
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set Root Directory: `server`
3. Add Environment Variables:
   ```
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   ```
4. Deploy!

### Option B: Netlify + Heroku

#### Frontend (Netlify)
1. Go to [netlify.com](https://netlify.com) → New site from Git
2. Set Base directory: `client`
3. Set Build command: `npm run build`
4. Set Publish directory: `client/build`
5. Add same environment variables as Vercel

#### Backend (Heroku)
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your_supabase_url
heroku config:set SUPABASE_ANON_KEY=your_supabase_anon_key
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

---

## 🔧 Post-Deployment (5 minutes)

### 1. Update CORS
In your deployed backend, update `server/index.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app', // Your actual domain
  ],
  credentials: true
}));
```

### 2. Configure Supabase
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your production frontend URL to "Site URL" and "Redirect URLs"

### 3. Create Admin User
1. Register on your live site
2. Go to Supabase Dashboard → Authentication → Users → Copy your User ID
3. Go to SQL Editor and run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
   ```

### 4. Test Everything
- [ ] User registration/login works
- [ ] Admin dashboard accessible
- [ ] News management works
- [ ] Producer registration works
- [ ] All pages load correctly

---

## 🎯 What You Get

✅ **Complete Website** with all features from your requirements  
✅ **Admin Dashboard** with full CRUD operations  
✅ **Producer Registration** and management  
✅ **Interactive Map** showing producer locations  
✅ **News Management** system  
✅ **Services & Resources** portal  
✅ **Partnership** showcase  
✅ **Contact Forms** and communication  
✅ **Mobile Responsive** design  
✅ **Secure Authentication** with Supabase  

---

## 🆘 Need Help?

### Common Issues:
1. **CORS Errors** → Update CORS settings in backend
2. **Environment Variables** → Check all variables are set correctly
3. **Database Issues** → Verify Supabase schema is imported
4. **Build Failures** → Check Node.js version (v16+)

### Quick Fixes:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat server/.env
cat client/.env

# Test API
curl https://your-backend-url.com/api/health
```

### Full Documentation:
- **SETUP.md** - Complete setup guide
- **DEPLOYMENT.md** - Detailed deployment instructions
- **README.md** - Full documentation

---

## 🎉 You're Live!

Your UCAEP website is now ready to serve the agricultural community of the Comoros!

**Next Steps:**
1. Customize content for your organization
2. Add your first news articles
3. Register producer members
4. Set up partnerships
5. Train your team on the admin dashboard

**Support:** Check the main README.md for comprehensive documentation and troubleshooting guides.
