#!/bin/bash

# UCAEP Website Vercel Deployment Script
echo "🚀 Starting UCAEP Website Deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the client
echo "🔨 Building the client..."
cd client
npm run build
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your website is now live on Vercel!"
echo "📋 Next steps:"
echo "   1. Set up your backend API (Railway/Heroku)"
echo "   2. Update CORS settings in your backend"
echo "   3. Configure environment variables in Vercel dashboard"
echo "   4. Test your deployed application"
