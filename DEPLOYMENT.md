# UCAEP Website Deployment Guide

This guide provides step-by-step instructions for deploying the UCAEP website to various platforms.

## 🚀 Quick Start

### 1. Environment Setup

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Supabase account
- Deployment platform accounts (Vercel, Netlify, Heroku, Railway)

#### Local Development Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd ucaeep-website

# Install all dependencies
npm run install-all

# Set up environment variables
cp server/env.example server/.env
cp client/env.example client/.env
```

#### Environment Variables

**Server (.env):**
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Client (.env):**
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

#### Database Setup

1. Create a new Supabase project
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL schema from `database/schema.sql`
4. Enable Row Level Security (RLS) policies as defined in the schema

### 2. Start Development

```bash
# Start both server and client
npm run dev

# Or start individually:
npm run server  # Backend only (http://localhost:5000)
npm run client  # Frontend only (http://localhost:3000)
```

## 🌐 Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend Deployment to Vercel

1. **Prepare for deployment:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Set build settings:
     - Framework Preset: Create React App
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `build`

3. **Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

#### Backend Deployment to Railway

1. **Prepare for deployment:**
   ```bash
   cd server
   npm install
   ```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `server`

3. **Environment Variables in Railway:**
   - Go to Project → Variables
   - Add:
     ```
     NODE_ENV=production
     PORT=5000
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     JWT_SECRET=your_jwt_secret
     ```

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Frontend Deployment to Netlify

1. **Prepare for deployment:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Connect your repository
   - Set build settings:
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `client/build`

3. **Environment Variables in Netlify:**
   - Go to Site Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

#### Backend Deployment to Heroku

1. **Prepare for deployment:**
   ```bash
   # Install Heroku CLI
   npm install -g heroku

   # Login to Heroku
   heroku login

   # Create Heroku app
   heroku create your-app-name
   ```

2. **Deploy to Heroku:**
   ```bash
   # Add environment variables
   heroku config:set NODE_ENV=production
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_ANON_KEY=your_supabase_anon_key
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   heroku config:set JWT_SECRET=your_jwt_secret

   # Deploy
   git push heroku main
   ```

### Option 3: Docker Deployment

#### Using Docker Compose

1. **Set up environment:**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Deploy with Docker:**
   ```bash
   # Build and start containers
   docker-compose up -d

   # View logs
   docker-compose logs -f

   # Stop containers
   docker-compose down
   ```

#### Individual Docker Containers

1. **Build frontend:**
   ```bash
   cd client
   docker build -t ucaeep-frontend .
   docker run -p 3000:80 ucaeep-frontend
   ```

2. **Build backend:**
   ```bash
   cd server
   docker build -t ucaeep-backend .
   docker run -p 5000:5000 ucaeep-backend
   ```

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

Update your backend CORS configuration to allow your frontend domain:

```javascript
// In server/index.js
app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://your-frontend-domain.vercel.app', // Production
    'https://your-frontend-domain.netlify.app' // Production
  ],
  credentials: true
}));
```

### 2. Configure Supabase

1. **Update Site URL:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your production frontend URL to "Site URL"
   - Add your production frontend URL to "Redirect URLs"

2. **Update RLS Policies:**
   - Ensure all Row Level Security policies are properly configured
   - Test authentication flows in production

### 3. Set up Custom Domain (Optional)

#### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

#### Netlify Custom Domain
1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Configure DNS records as instructed

## 📊 Monitoring and Maintenance

### 1. Health Checks

The application includes health check endpoints:
- Frontend: `https://your-domain.com/`
- Backend: `https://your-backend-domain.com/api/health`

### 2. Logs and Monitoring

#### Vercel
- View logs in Vercel Dashboard → Functions → View Function Logs

#### Netlify
- View logs in Netlify Dashboard → Functions → View Logs

#### Railway
- View logs in Railway Dashboard → Deployments → View Logs

#### Heroku
```bash
# View logs
heroku logs --tail

# View specific app logs
heroku logs --tail --app your-app-name
```

### 3. Database Monitoring

Monitor your Supabase database:
- Go to Supabase Dashboard → Database → Logs
- Set up alerts for performance issues
- Monitor API usage and limits

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check CORS configuration in backend
   - Ensure frontend URL is in allowed origins

2. **Environment Variables:**
   - Verify all environment variables are set correctly
   - Check variable names match exactly

3. **Database Connection:**
   - Verify Supabase URL and keys
   - Check RLS policies are properly configured

4. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Getting Help

1. Check application logs
2. Verify environment variables
3. Test API endpoints manually
4. Check Supabase dashboard for database issues

## 🔄 Updates and Maintenance

### Updating the Application

1. **Code Updates:**
   ```bash
   git pull origin main
   npm run install-all
   npm run build
   ```

2. **Database Migrations:**
   - Update schema in Supabase SQL Editor
   - Test changes in development first

3. **Environment Variables:**
   - Update production environment variables as needed
   - Restart services after changes

### Backup Strategy

1. **Database Backups:**
   - Supabase provides automatic backups
   - Export data regularly for additional safety

2. **Code Backups:**
   - Use Git for version control
   - Tag releases for easy rollback

## 📈 Performance Optimization

### Frontend Optimization

1. **Build Optimization:**
   - Enable gzip compression
   - Optimize images
   - Use CDN for static assets

2. **Caching:**
   - Set appropriate cache headers
   - Use service workers for offline support

### Backend Optimization

1. **Database Optimization:**
   - Add database indexes
   - Optimize queries
   - Use connection pooling

2. **API Optimization:**
   - Implement rate limiting
   - Add response caching
   - Optimize file uploads

---

## 🎉 Deployment Complete!

Your UCAEP website is now live and ready to serve the agricultural community of the Comoros!

### Quick Links:
- **Frontend**: https://your-frontend-domain.com
- **Backend API**: https://your-backend-domain.com/api
- **Admin Dashboard**: https://your-frontend-domain.com/admin
- **Supabase Dashboard**: https://supabase.com/dashboard

### Next Steps:
1. Test all functionality in production
2. Set up monitoring and alerts
3. Configure custom domain (if needed)
4. Train admin users on the dashboard
5. Launch and promote the website

For support or questions, refer to the main README.md file or contact the development team.
