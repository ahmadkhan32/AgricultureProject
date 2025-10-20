# UCAEP Website - Complete Setup Guide

## 🚀 Everything You Need to Deploy

This guide will walk you through setting up and deploying the complete UCAEP website from scratch.

## 📋 Prerequisites

Before you start, make sure you have:

- [ ] Node.js (v16 or higher) installed
- [ ] Git installed
- [ ] A Supabase account (free tier works)
- [ ] A GitHub account
- [ ] Deployment platform accounts (choose one):
  - [ ] Vercel (for frontend)
  - [ ] Netlify (for frontend)
  - [ ] Railway (for backend)
  - [ ] Heroku (for backend)

## 🛠️ Step 1: Environment Setup

### 1.1 Clone and Install

```bash
# Clone the repository
git clone <your-repository-url>
cd ucaeep-website

# Install all dependencies (this will install for root, server, and client)
npm run install-all
```

### 1.2 Set Up Supabase

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "ucaeep-website"
   - Set a strong database password
   - Choose region closest to your users
   - Click "Create new project"

2. **Get Supabase Credentials:**
   - Go to Settings → API
   - Copy the following:
     - Project URL
     - Anon public key
     - Service role key (keep this secret!)

3. **Set Up Database:**
   - Go to SQL Editor in your Supabase dashboard
   - Click "New Query"
   - Copy and paste the entire content from `database/schema.sql`
   - Click "Run" to execute the schema

### 1.3 Configure Environment Variables

**Create server/.env:**
```bash
cp server/env.example server/.env
```

Edit `server/.env` with your Supabase credentials:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Create client/.env:**
```bash
cp client/env.example client/.env
```

Edit `client/.env`:
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Step 2: Start Development

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Backend server at: http://localhost:5000
- Frontend app at: http://localhost:3000

### Test Your Setup

1. **Open your browser** and go to http://localhost:3000
2. **Register a new account** (this will create a user in Supabase)
3. **Check the admin dashboard** at http://localhost:3000/admin (you'll need to manually set a user as admin in Supabase)
4. **Test the API** at http://localhost:5000/api/health

## 🌐 Step 3: Production Deployment

Choose one of these deployment options:

### Option A: Vercel + Railway (Recommended)

#### Deploy Frontend to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Configure:
     - Framework Preset: Create React App
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Click "Deploy"

3. **Set Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
     REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
     ```

#### Deploy Backend to Railway

1. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `server`

2. **Set Environment Variables in Railway:**
   - Go to Project → Variables
   - Add:
     ```
     NODE_ENV=production
     PORT=5000
     SUPABASE_URL=https://your-project-id.supabase.co
     SUPABASE_ANON_KEY=your_anon_key_here
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     JWT_SECRET=your_super_secret_jwt_key_here
     ```

### Option B: Netlify + Heroku

#### Deploy Frontend to Netlify

1. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Connect your repository
   - Configure:
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `client/build`

2. **Set Environment Variables in Netlify:**
   - Go to Site Settings → Environment Variables
   - Add the same variables as Vercel

#### Deploy Backend to Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create and Deploy:**
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set SUPABASE_URL=https://your-project-id.supabase.co
   heroku config:set SUPABASE_ANON_KEY=your_anon_key_here
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   heroku config:set JWT_SECRET=your_super_secret_jwt_key_here
   git push heroku main
   ```

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Update CORS Settings

In your deployed backend, update the CORS configuration to allow your frontend domain:

```javascript
// In server/index.js, update the CORS origin
app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://your-frontend-domain.vercel.app', // Production
    'https://your-frontend-domain.netlify.app' // Production
  ],
  credentials: true
}));
```

### 4.2 Configure Supabase for Production

1. **Update Site URL:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your production frontend URL to "Site URL"
   - Add your production frontend URL to "Redirect URLs"

2. **Create Admin User:**
   - Go to Supabase Dashboard → Authentication → Users
   - Find your user and note the ID
   - Go to SQL Editor and run:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = 'your-user-id-here';
   ```

### 4.3 Test Production Deployment

1. **Visit your live website**
2. **Test user registration and login**
3. **Test admin dashboard** (login with your admin account)
4. **Test all major features:**
   - News management
   - Producer registration
   - Services
   - Resources
   - Contact forms

## 🎉 You're Done!

Your UCAEP website is now live and ready to serve the agricultural community of the Comoros!

### Your Live URLs:
- **Frontend**: https://your-frontend-domain.com
- **Backend API**: https://your-backend-domain.com/api
- **Admin Dashboard**: https://your-frontend-domain.com/admin

### Quick Admin Setup:
1. Register a new account on your live site
2. Go to Supabase Dashboard → Authentication → Users
3. Copy the user ID
4. Run this SQL in Supabase SQL Editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
   ```
5. Login to your admin dashboard

### Next Steps:
1. **Customize content** - Add your organization's information
2. **Upload resources** - Add documents, forms, and guides
3. **Create news articles** - Start publishing content
4. **Set up partnerships** - Add partner organizations
5. **Train users** - Show your team how to use the admin dashboard

## 🆘 Need Help?

If you run into any issues:

1. **Check the logs** in your deployment platform
2. **Verify environment variables** are set correctly
3. **Test the API endpoints** manually
4. **Check Supabase dashboard** for database issues
5. **Refer to the main README.md** for detailed documentation

## 📞 Support

For technical support or questions about the implementation, refer to the comprehensive documentation in the main README.md file.

---

**Congratulations! Your UCAEP website is now live and ready to make a difference in the agricultural community of the Comoros! 🌱**
