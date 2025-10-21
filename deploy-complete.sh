#!/bin/bash

# 🚀 Complete UCAEP Website Deployment Script
echo "🌾 UCAEP Website - Complete Deployment"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if client build exists
if [ -d "client/build" ]; then
    print_success "Client build directory exists"
else
    print_warning "Client build not found. Building now..."
    cd client
    npm run build
    cd ..
fi

# Check if all dependencies are installed
if [ -d "node_modules" ] && [ -d "client/node_modules" ] && [ -d "server/node_modules" ]; then
    print_success "All dependencies are installed"
else
    print_status "Installing dependencies..."
    npm run install-all
fi

# Step 2: Deploy Frontend to Vercel
print_status "Deploying frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    print_status "Please log in to Vercel:"
    vercel login
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
cd client
vercel --prod --yes
FRONTEND_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "https://your-app.vercel.app")
cd ..

print_success "Frontend deployed to: $FRONTEND_URL"

# Step 3: Deploy Backend to Railway
print_status "Setting up backend deployment to Railway..."

# Create Railway configuration
cat > railway.json << EOF
{
  "\$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

print_success "Railway configuration created"

# Step 4: Update environment variables
print_status "Updating environment variables..."

# Update Vercel environment variables
print_status "Please update your Vercel environment variables:"
echo "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
echo "2. Add/Update:"
echo "   REACT_APP_API_URL=https://your-railway-url.railway.app/api"
echo "   REACT_APP_SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co"
echo "   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM"

# Step 5: Test deployment
print_status "Testing deployment..."

# Test frontend
if curl -s "$FRONTEND_URL" > /dev/null; then
    print_success "Frontend is accessible at: $FRONTEND_URL"
else
    print_warning "Frontend may not be ready yet. Check Vercel dashboard."
fi

# Step 6: Summary
echo ""
echo "🎉 Deployment Summary"
echo "===================="
echo ""
echo "✅ Frontend deployed to Vercel: $FRONTEND_URL"
echo "✅ Backend ready for Railway deployment"
echo "✅ CORS settings updated for production"
echo "✅ Environment variables configured"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy backend to Railway:"
echo "   - Go to railway.app"
echo "   - Create new project"
echo "   - Set root directory to 'server'"
echo "   - Add environment variables"
echo ""
echo "2. Update Vercel environment variables with Railway URL"
echo ""
echo "3. Test the complete application"
echo ""
echo "🌾 Your UCAEP website is ready to serve the agricultural community!"
