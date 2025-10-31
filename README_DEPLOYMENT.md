# 🚀 Deployment Instructions

## Quick Start

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial deployment setup"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### 2. Deploy to Vercel

#### Via Dashboard:
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `client`
   - **Framework**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_API_URL` (if using backend)
6. Click **Deploy**

#### Via CLI:
```bash
cd client
npx vercel --prod
```

### 3. Setup Database

1. Go to [supabase.com](https://supabase.com)
2. Open your project → SQL Editor
3. Copy and run `database/schema.sql`
4. Verify tables are created

---

## Environment Variables

### Required for Vercel:
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anon key
- `REACT_APP_API_URL` - Your backend API URL (optional)

### How to Get Supabase Keys:
1. Go to Supabase Dashboard
2. Settings → API
3. Copy:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** key → `REACT_APP_SUPABASE_ANON_KEY`

---

## Project Structure

```
project-root/
├── client/              # Frontend (deploy this to Vercel)
│   ├── src/
│   ├── public/
│   └── package.json
├── server/             # Backend (deploy to Railway/Heroku)
├── database/
│   └── schema.sql     # Run this in Supabase
└── vercel.json        # Vercel configuration
```

---

## Verification

After deployment, check:
- [ ] Frontend loads at `https://your-app.vercel.app`
- [ ] No console errors
- [ ] Navigation works
- [ ] CRUD operations work
- [ ] Database connection works

---

## Troubleshooting

### Build Errors:
- Check Node version (16+)
- Verify all dependencies in `package.json`
- Check build logs in Vercel

### Database Errors:
- Verify Supabase credentials
- Check RLS policies are enabled
- Run schema.sql again

### CORS Errors:
- Add Vercel URL to Supabase allowed origins
- Check CORS settings in backend

---

**For detailed instructions, see:**
- `DEPLOY_TO_VERCEL_AND_GITHUB.md`
- `QUICK_DEPLOY.md`

