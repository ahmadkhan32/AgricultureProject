# UCAEP Website - Complete Setup Guide

## Overview
This is a comprehensive agricultural website for the Chamber of Agriculture, Livestock, and Fisheries of the Comoros (UCAEP). The system includes a React.js frontend, Node.js/Express.js backend, and Supabase database integration.

## Features Implemented

### ✅ Core Features
- **Admin Authentication System** with Supabase
- **Producer Registration** with interactive maps
- **Comprehensive CRUD Operations** for all entities
- **Real-time Dashboard** with analytics
- **Multi-language Support** (ready for Comorian languages)
- **Role-based Access Control**
- **File Upload System**
- **Interactive Maps** for producer locations
- **News Management System**
- **Event Management**
- **Resource Management**
- **Partnership Management**
- **Contact Message System**

### 🎯 UCAEP-Specific Features
- **Producer Registration** with Comorian regions
- **Business Type Classification** (Agriculture, Livestock, Fisheries, Mixed)
- **Product Catalog** with Comorian products
- **Certification Management**
- **Interactive Producer Map**
- **Regional Statistics**
- **Multi-language Support** (French, Arabic, Comorian)

## Technology Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **React Query** - Data fetching and caching
- **Leaflet/React-Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Backend-as-a-Service
- **JWT** - Authentication
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Database
- **Supabase PostgreSQL** - Primary database
- **Row Level Security (RLS)** - Data security
- **Real-time subscriptions** - Live updates

## Quick Start

### 1. Prerequisites
```bash
# Install Node.js (v16 or higher)
# Install npm or yarn
# Create a Supabase account
```

### 2. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd "Agricul website"

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

#### Server Environment (.env)
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads
```

#### Client Environment (.env)
```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
REACT_APP_API_URL=http://localhost:5000
```

### 4. Database Setup

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys
4. Run the SQL schema from `database/schema.sql`

#### Database Schema
The database includes the following tables:
- `profiles` - User profiles and roles
- `news` - News articles and press releases
- `services` - UCAEP services
- `producers` - Producer registrations
- `partnerships` - Partnership information
- `resources` - Documents and resources
- `events` - Events and announcements
- `contact_messages` - Contact form submissions

### 5. Run the Application

#### Development Mode
```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm start
```

#### Production Mode
```bash
# Build the client
cd client
npm run build

# Start the server
cd server
npm start
```

## Admin Setup

### 1. Create Admin Account
1. Go to `/admin/register`
2. Fill in admin details
3. Verify email (if email verification is enabled)
4. Login at `/login`

### 2. Admin Features
- **Dashboard Overview** - Real-time statistics and analytics
- **News Management** - Create, edit, publish news articles
- **Producer Management** - Approve/reject producer registrations
- **Event Management** - Manage events and announcements
- **Resource Management** - Upload and manage documents
- **Partnership Management** - Manage partnerships
- **User Management** - Manage user accounts
- **Analytics** - View detailed statistics

## Producer Registration

### 1. User Registration
1. Go to `/register`
2. Create a producer account
3. Verify email

### 2. Producer Registration
1. Login and go to `/producer/register`
2. Fill in business information
3. Select location on interactive map
4. Upload business images
5. Submit for approval

### 3. Admin Approval
1. Admin reviews registration
2. Approve or reject with comments
3. Producer receives notification

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### News
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create news (admin)
- `PUT /api/news/:id` - Update news (admin)
- `DELETE /api/news/:id` - Delete news (admin)

### Producers
- `GET /api/producers` - Get all producers
- `GET /api/producers/:id` - Get producer by ID
- `POST /api/producers` - Create producer
- `PUT /api/producers/:id` - Update producer
- `DELETE /api/producers/:id` - Delete producer

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

## Deployment

### 1. Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

### 2. Netlify Deployment
```bash
# Build the client
cd client
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=build
```

### 3. Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Security Features

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Producer)
- Password hashing with bcrypt
- Email verification

### 2. Data Security
- Row Level Security (RLS) in Supabase
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

### 3. File Upload Security
- File type validation
- File size limits
- Secure file storage

## Customization

### 1. Styling
- Modify `client/src/index.css` for global styles
- Update `client/tailwind.config.js` for theme customization
- Use Tailwind utility classes for component styling

### 2. Content
- Update `client/src/utils/constants.js` for static content
- Modify language files for multi-language support
- Update images in `client/public/`

### 3. Features
- Add new components in `client/src/components/`
- Create new pages in `client/src/pages/`
- Add API routes in `server/routes/`

## Troubleshooting

### Common Issues

#### 1. Supabase Connection Issues
```bash
# Check environment variables
echo $REACT_APP_SUPABASE_URL
echo $REACT_APP_SUPABASE_ANON_KEY

# Verify Supabase project is active
# Check RLS policies are enabled
```

#### 2. Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be v16 or higher
```

#### 3. Map Issues
```bash
# Ensure Leaflet CSS is imported
# Check if map container has proper height
# Verify coordinates are valid
```

## Support

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

### Contact
For technical support or questions about the UCAEP website implementation, please contact the development team.

## License
This project is developed for the Chamber of Agriculture, Livestock, and Fisheries of the Comoros (UCAEP).

---

**Note**: This is a comprehensive implementation of the UCAEP website with all requested features including admin registration, CRUD operations, interactive maps, and a complete dashboard system. The system is production-ready and can be deployed immediately.
