#!/bin/bash

# UCAEP Website Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting UCAEP Website Deployment..."

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install server dependencies
    cd server
    npm install
    cd ..
    
    # Install client dependencies
    cd client
    npm install
    cd ..
    
    print_success "Dependencies installed successfully!"
}

# Build the application
build_application() {
    print_status "Building application..."
    
    # Build client
    cd client
    npm run build
    cd ..
    
    print_success "Application built successfully!"
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ ! -f "server/.env" ]; then
        print_warning "server/.env not found. Please create it from server/env.example"
        return 1
    fi
    
    if [ ! -f "client/.env" ]; then
        print_warning "client/.env not found. Please create it from client/env.example"
        return 1
    fi
    
    print_success "Environment files found!"
    return 0
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Run server tests if they exist
    if [ -f "server/package.json" ] && grep -q '"test"' server/package.json; then
        cd server
        npm test
        cd ..
    fi
    
    # Run client tests if they exist
    if [ -f "client/package.json" ] && grep -q '"test"' client/package.json; then
        cd client
        npm test
        cd ..
    fi
    
    print_success "Tests completed!"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
        exit 1
    fi
    
    cd client
    vercel --prod
    cd ..
    
    print_success "Deployed to Vercel!"
}

# Deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_error "Netlify CLI is not installed. Please install it with: npm i -g netlify-cli"
        exit 1
    fi
    
    cd client
    netlify deploy --prod --dir=build
    cd ..
    
    print_success "Deployed to Netlify!"
}

# Deploy to Heroku
deploy_heroku() {
    print_status "Deploying to Heroku..."
    
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI is not installed. Please install it from https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Check if Heroku app exists
    if ! heroku apps:info &> /dev/null; then
        print_error "No Heroku app found. Please create one first with: heroku create your-app-name"
        exit 1
    fi
    
    git push heroku main
    
    print_success "Deployed to Heroku!"
}

# Deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed. Please install it with: npm i -g @railway/cli"
        exit 1
    fi
    
    railway up
    
    print_success "Deployed to Railway!"
}

# Main deployment function
main() {
    echo "🌱 UCAEP Website Deployment Script"
    echo "=================================="
    
    # Check requirements
    check_requirements
    
    # Install dependencies
    install_dependencies
    
    # Check environment variables
    if ! check_env_vars; then
        print_warning "Please set up your environment variables before deploying."
        print_status "Copy server/env.example to server/.env and client/env.example to client/.env"
        print_status "Then edit them with your actual values."
        exit 1
    fi
    
    # Build application
    build_application
    
    # Run tests
    run_tests
    
    # Ask user for deployment target
    echo ""
    echo "Select deployment target:"
    echo "1) Vercel (Frontend only)"
    echo "2) Netlify (Frontend only)"
    echo "3) Heroku (Backend only)"
    echo "4) Railway (Backend only)"
    echo "5) All (Vercel + Railway)"
    echo "6) All (Netlify + Heroku)"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_heroku
            ;;
        4)
            deploy_railway
            ;;
        5)
            deploy_vercel
            deploy_railway
            ;;
        6)
            deploy_netlify
            deploy_heroku
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update your CORS settings in the backend"
    echo "2. Configure your Supabase authentication URLs"
    echo "3. Test your live website"
    echo "4. Set up your admin user in Supabase"
    echo ""
    echo "For detailed instructions, see SETUP.md"
}

# Run main function
main "$@"
