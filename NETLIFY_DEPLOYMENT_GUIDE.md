# Netlify Deployment Guide for UCAEP Frontend

## Prerequisites
- A Netlify account (free at [netlify.com](https://netlify.com))
- Your project code in a Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deployment Steps

### Method 1: Drag & Drop (Fastest)
1. **Build your project locally:**
   ```bash
   cd client
   npm ci
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com) and log in
   - Drag and drop the `client/build` folder directly onto the Netlify dashboard
   - Your site will be deployed instantly with a random URL

### Method 2: Git Integration (Recommended)
1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and log in
   - Click "New site from Git"
   - Choose your Git provider and repository
   - Configure build settings:
     - **Base directory:** `client`
     - **Build command:** `npm ci && npm run build`
     - **Publish directory:** `client/build`
   - Click "Deploy site"

### Method 3: Netlify CLI (Advanced)
1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd client
   npm run build
   netlify deploy --prod --dir=build
   ```

## Configuration Details

### Build Settings
- **Base directory:** `client`
- **Build command:** `npm ci && npm run build`
- **Publish directory:** `client/build`

### Environment Variables
Set these in Netlify dashboard under Site settings > Environment variables:

```
REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Custom Domain (Optional)
1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify

## Troubleshooting

### Common Issues:

1. **Build fails with "npm ci" error:**
   - Change build command to: `npm install && npm run build`

2. **404 errors on page refresh:**
   - The `netlify.toml` file already includes redirects for React Router
   - Ensure the redirects section is properly configured

3. **Environment variables not working:**
   - Make sure variables start with `REACT_APP_`
   - Redeploy after adding new environment variables

4. **Assets not loading:**
   - Check that the build directory is correctly set to `client/build`
   - Verify all static assets are in the build folder

### Build Optimization:
- The build is already optimized with gzip compression
- Static assets are cached for 1 year
- Security headers are configured

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] All pages are accessible
- [ ] Images and assets load correctly
- [ ] Environment variables are set
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active (automatic with Netlify)

## Support

If you encounter issues:
1. Check the Netlify build logs in the dashboard
2. Verify your `netlify.toml` configuration
3. Ensure all dependencies are in `package.json`
4. Test the build locally before deploying

Your site will be available at: `https://your-site-name.netlify.app`
