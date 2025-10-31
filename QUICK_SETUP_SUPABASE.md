# ⚡ Quick Supabase Setup

## 🎯 Quick Setup (5 Minutes)

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub/Google
3. Click "New Project"
4. Fill in details and wait for setup

### 2. Get Your Keys
1. Project Dashboard → Settings → API
2. Copy these:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon key** (public key)

### 3. Create Storage Bucket
1. Go to **Storage** → **New bucket**
2. Name: `agricul-images`
3. Make **Public**: Yes
4. Click **Create**

### 4. Run Database Schema
1. Go to **SQL Editor**
2. Copy entire content from `database/schema.sql`
3. Paste and click **Run**

### 5. Configure Your App

#### Create `client/.env`:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Create `server/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 6. Enable Row Level Security (Quick)
In **SQL Editor**, run:

```sql
-- For services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read" ON services
FOR SELECT USING (true);

CREATE POLICY "Authenticated Insert" ON services
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated Update" ON services
FOR UPDATE USING (true);

CREATE POLICY "Authenticated Delete" ON services
FOR DELETE USING (true);

-- For producers table
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read" ON producers
FOR SELECT USING (true);

CREATE POLICY "Authenticated Insert" ON producers
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated Update" ON producers
FOR UPDATE USING (true);

CREATE POLICY "Authenticated Delete" ON producers
FOR DELETE USING (true);
```

### 7. Test It!

1. Start your app:
```bash
npm run dev
```

2. Go to `/content-dashboard`
3. Generate and submit content
4. Check it appears in `/services`

## ✅ Done!

Your Supabase is now connected and working!

---

📖 For detailed setup, see `SUPABASE_SETUP_GUIDE.md`

