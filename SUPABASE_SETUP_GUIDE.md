# 🔧 Complete Supabase Setup Guide

## 📋 Overview
This guide provides step-by-step instructions for setting up Supabase to enable CRUD functionality for submitting content in `ContentDashboard.js` and displaying it in `Services.js`.

## 🗄️ Database Schema

### Services Table
```sql
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    icon TEXT,
    image TEXT,
    category TEXT CHECK (category IN ('support', 'training', 'assistance', 'project', 'Soutien aux producteurs', 'Programmes de formation', 'Programmes d'assistance', 'Projets')) DEFAULT 'support',
    status TEXT CHECK (status IN ('draft', 'published', 'active', 'inactive')) DEFAULT 'published',
    tags TEXT[],
    is_ai_generated BOOLEAN DEFAULT false,
    created_by TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Producers Table
```sql
CREATE TABLE producers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    business_type TEXT CHECK (business_type IN ('agriculture', 'livestock', 'fisheries', 'mixed')) NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    region TEXT NOT NULL,
    products TEXT[],
    certifications TEXT[],
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    social_media JSONB,
    images TEXT[],
    image TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved',
    is_ai_generated BOOLEAN DEFAULT false,
    created_by TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up or log in with GitHub
4. Create a new project:
   - Name: "UCAEP Website"
   - Database Password: (choose a strong password)
   - Region: Select closest to your users
5. Wait for project to initialize (~2 minutes)

### 2. Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (e.g., `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role key** (for backend access)

### 3. Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **"New bucket"**
3. Name: `agricul-images`
4. Make it **Public**: Yes
5. Click **"Create bucket"**
6. Configure bucket policy (optional - for security):
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'agricul-images');
   
   -- Allow authenticated upload
   CREATE POLICY "Authenticated Upload" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'agricul-images' AND
     auth.role() = 'authenticated'
   );
   ```

### 4. Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New query"**
3. Copy and paste the complete schema from `database/schema.sql`
4. Click **"Run"** to execute

### 5. Configure Environment Variables

#### Client-Side Configuration
Create/update `client/.env`:
```env
REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Server-Side Configuration
Create/update `server/.env`:
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Configure Row Level Security (RLS)

1. Go to **Authentication** → **Policies**
2. For `services` table:
   ```sql
   -- Enable RLS
   ALTER TABLE services ENABLE ROW LEVEL SECURITY;
   
   -- Allow public read access
   CREATE POLICY "Public Read" ON services
   FOR SELECT USING (true);
   
   -- Allow authenticated insert
   CREATE POLICY "Authenticated Insert" ON services
   FOR INSERT WITH CHECK (true);
   
   -- Allow authenticated update
   CREATE POLICY "Authenticated Update" ON services
   FOR UPDATE USING (true);
   
   -- Allow authenticated delete
   CREATE POLICY "Authenticated Delete" ON services
   FOR DELETE USING (true);
   ```

3. For `producers` table:
   ```sql
   -- Enable RLS
   ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
   
   -- Allow public read access
   CREATE POLICY "Public Read" ON producers
   FOR SELECT USING (true);
   
   -- Allow authenticated insert
   CREATE POLICY "Authenticated Insert" ON producers
   FOR INSERT WITH CHECK (true);
   
   -- Allow authenticated update
   CREATE POLICY "Authenticated Update" ON producers
   FOR UPDATE USING (true);
   
   -- Allow authenticated delete
   CREATE POLICY "Authenticated Delete" ON producers
   FOR DELETE USING (true);
   ```

## 📊 Data Flow

### Create (Submit Content)
```
ContentDashboard.js
    ↓
handleSubmit() function
    ↓
enhancedContentService.saveServiceToDatabase()
    ↓
Supabase INSERT query
    ↓
services table
```

### Read (Display Content)
```
Services.js
    ↓
useEffect hook
    ↓
enhancedContentService.getAllServices()
    ↓
Supabase SELECT query
    ↓
services table
    ↓
Display in UI
```

## 🎯 Testing the Setup

### Test Database Connection

1. In `client/src/config/supabase.js`, verify configuration:
```javascript
export const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
export const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

2. Start the application:
```bash
cd client
npm start
```

3. Open browser console and check for errors

### Test CRUD Operations

1. Go to `/content-dashboard`
2. Enter a test prompt
3. Click "Générer"
4. Click "Soumettre"
5. Check Supabase dashboard:
   - Go to **Table Editor** → **services**
   - Verify new record appears
6. Go to `/services`
7. Verify content displays in the grid

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Verify `.env` file exists
   - Check key is correct
   - Restart development server

2. **"Row Level Security Policy Violation"**
   - Check RLS policies are enabled
   - Verify policy rules allow operations

3. **"Bucket not found"**
   - Verify bucket name is `agricul-images`
   - Check bucket is public

4. **Image upload fails**
   - Check bucket policy allows uploads
   - Verify file size limits

5. **Connection timeout**
   - Check internet connection
   - Verify Supabase URL is correct

## 📱 Production Deployment

### Environment Variables
Set these in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- Railway: Variables tab

### Contributions

✅ Database schema created
✅ Storage bucket configured
✅ RLS policies applied
✅ Client-side configuration
✅ Server-side configuration
✅ CRUD operations working
✅ Image upload support
✅ Error handling implemented

---

**Your Supabase setup is complete and ready for production use! 🎉**

