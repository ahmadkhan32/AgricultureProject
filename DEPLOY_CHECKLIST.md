# ✅ Quick Deployment Checklist

## 🎯 5-Minute GitHub Setup

```bash
# 1. Initialize git (if needed)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: UCAEP Website"

# 4. Create repo on GitHub.com and copy the URL, then:
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 5. Push to GitHub
git push -u origin main
```

## 🌐 5-Minute Vercel Setup

### Via Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repo
4. Configure:
   - **Root Directory**: `client`
   - **Build**: `npm run build`
   - **Output**: `build`
5. Add Environment Variables:
   ```
   REACT_APP_SUPABASE_URL=your_url
   REACT_APP_SUPABASE_ANON_KEY=your_key
   ```
6. Click **Deploy**

### Via CLI:
```bash
cd client
npx vercel
```

## 📝 Environment Variables Needed

### For Vercel (Frontend):
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_API_URL` (if using backend)

### For Railway/Backend:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NODE_ENV=production`
- `PORT=5000`

## ✅ Deployment Steps Summary

1. ✅ Push code to GitHub
2. ✅ Import to Vercel
3. ✅ Configure environment variables
4. ✅ Deploy
5. ✅ Test deployed site
6. ✅ Update CORS if needed
7. ✅ Done!

## 🎉 Your Live URL

After deployment, you'll get:
- **Frontend**: `https://your-app.vercel.app`
- **Updates**: Automatic on every `git push`

---

**See `DEPLOY_TO_VERCEL_AND_GITHUB.md` for complete guide**

