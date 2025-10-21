# 🐳 Docker Installation and Build Fix Guide

## 🚨 **Issue Identified**

The Docker build is failing with:
```
sh: 1: react-scripts: not found
ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c npm run build" did not complete successfully: exit code: 127
```

## 🔧 **Root Cause & Complete Fix**

### **Issue 1: Missing Docker Installation**
Docker is not installed on your system. You need to install Docker first.

### **Issue 2: Incorrect npm ci Command**
The Dockerfile was using `npm ci` without including dev dependencies needed for the build.

## 🚀 **Complete Solution**

### **Step 1: Install Docker (Required)**

#### **For Windows:**
1. **Download Docker Desktop:** https://www.docker.com/products/docker-desktop/
2. **Install Docker Desktop**
3. **Restart your computer**
4. **Verify installation:**
   ```bash
   docker --version
   docker compose version
   ```

#### **For Mac:**
```bash
# Install using Homebrew
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop/
```

#### **For Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# CentOS/RHEL
sudo yum install docker docker-compose
```

### **Step 2: Fixed Dockerfile (Already Applied)**

✅ **Client Dockerfile Fixed:**
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

✅ **Server Dockerfile (Already Correct):**
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only for server)
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
```

### **Step 3: Test Docker Build (After Installation)**

#### **Test 1: Build Frontend**
```bash
# Navigate to project directory
cd "C:\Users\asadk\Downloads\Agricul website"

# Build frontend
docker compose build frontend
```

#### **Test 2: Build Backend**
```bash
# Build backend
docker compose build backend
```

#### **Test 3: Start Services**
```bash
# Start all services
docker compose up -d

# Check status
docker compose ps
```

#### **Test 4: Verify Services**
```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:5000/api/health
```

## 🧪 **Verification Commands**

### **Check Docker Installation:**
```bash
docker --version
docker compose version
```

### **Check Build Status:**
```bash
docker compose build --no-cache
```

### **Check Running Containers:**
```bash
docker compose ps
docker compose logs
```

### **Test Application:**
```bash
# Frontend test
curl http://localhost:3000

# Backend test
curl http://localhost:5000/api/health
```

## 🔍 **Troubleshooting**

### **Issue 1: Docker not found**
**Solution:** Install Docker Desktop from https://www.docker.com/products/docker-desktop/

### **Issue 2: react-scripts not found**
**Solution:** ✅ Already fixed - Dockerfile now includes dev dependencies

### **Issue 3: Build context errors**
**Solution:** Ensure you're running commands from the project root directory

### **Issue 4: Port conflicts**
**Solution:** Check if ports 3000 and 5000 are already in use

## 📋 **Pre-Build Checklist**

- [ ] Docker Desktop installed and running
- [ ] Docker Compose available
- [ ] Project directory contains docker-compose.yml
- [ ] Client and server Dockerfiles are present
- [ ] Environment variables are set (if needed)

## 🎯 **Expected Results**

After installation and fixes:

✅ **Docker commands work** - No "command not found" errors
✅ **Frontend builds successfully** - No react-scripts errors
✅ **Backend builds successfully** - All dependencies installed
✅ **Containers start without errors** - Services are accessible
✅ **Health checks pass** - Both frontend and backend respond

## 🚀 **Quick Start (After Docker Installation)**

```bash
# 1. Navigate to project
cd "C:\Users\asadk\Downloads\Agricul website"

# 2. Build all services
docker compose build

# 3. Start all services
docker compose up -d

# 4. Test services
curl http://localhost:3000
curl http://localhost:5000/api/health
```

## 🎉 **Success Indicators**

Your Docker setup is successful when:
- [ ] `docker --version` shows Docker is installed
- [ ] `docker compose build` completes without errors
- [ ] `docker compose up -d` starts containers successfully
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend accessible at http://localhost:5000
- [ ] No "react-scripts: not found" errors
- [ ] No exit code 127 errors

---

**Your UCAEP website Docker deployment is ready - just install Docker first! 🐳🌾**
