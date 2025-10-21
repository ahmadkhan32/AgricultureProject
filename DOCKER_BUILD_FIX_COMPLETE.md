# 🐳 Complete Docker Build Fix Guide

## 🚨 **Root Cause Analysis**

The Docker build is failing because:

1. **Missing dev dependencies** - `react-scripts` is not installed during build
2. **Incorrect npm ci command** - Using `--only=production` excludes dev dependencies needed for build
3. **Build context issues** - Docker build context may not include all necessary files

## 🔧 **Complete Fix Implementation**

### **Fix 1: Updated Client Dockerfile**

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

### **Fix 2: Updated Server Dockerfile**

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

### **Fix 3: Updated Docker Compose**

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:80"  # Changed from 3000:3000 to 3000:80 (nginx port)
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
      - REACT_APP_SUPABASE_URL=${SUPABASE_URL}
      - REACT_APP_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    depends_on:
      - backend

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./server/uploads:/app/uploads

volumes:
  node_modules:
```

## 🚀 **Quick Fix Commands**

### **Option 1: Fix and Rebuild**

```bash
# Clean up existing containers and images
docker-compose down --volumes --remove-orphans
docker system prune -f

# Rebuild with fixed Dockerfiles
docker-compose build --no-cache

# Start the services
docker-compose up -d
```

### **Option 2: Individual Service Build**

```bash
# Build frontend only
docker-compose build frontend

# Build backend only
docker-compose build backend

# Start specific service
docker-compose up frontend
```

### **Option 3: Manual Docker Build**

```bash
# Build client
cd client
docker build -t ucaeep-frontend .

# Build server
cd ../server
docker build -t ucaeep-backend .

# Run containers
docker run -p 3000:80 ucaeep-frontend
docker run -p 5000:5000 ucaeep-backend
```

## 🧪 **Testing the Fix**

### **Test 1: Build Test**
```bash
# Test if build works
docker-compose build frontend
```

### **Test 2: Run Test**
```bash
# Test if containers start
docker-compose up frontend backend
```

### **Test 3: Health Check**
```bash
# Check if services are running
curl http://localhost:3000  # Frontend
curl http://localhost:5000/api/health  # Backend
```

## 🔍 **Troubleshooting**

### **Issue 1: react-scripts not found**
**Solution:** Ensure `--include=dev` is used in npm ci command

### **Issue 2: Build context errors**
**Solution:** Check that all source files are copied before build

### **Issue 3: Port conflicts**
**Solution:** Update docker-compose.yml port mappings

### **Issue 4: Environment variables**
**Solution:** Create .env file with required variables

## 📋 **Pre-Build Checklist**

- [ ] Client package.json has react-scripts dependency
- [ ] Server package.json has all required dependencies
- [ ] Dockerfiles use correct npm ci commands
- [ ] Docker-compose.yml has correct port mappings
- [ ] Environment variables are set
- [ ] Build context includes all necessary files

## 🎯 **Expected Results**

After applying the fixes:

✅ **Frontend builds successfully** - No react-scripts errors
✅ **Backend builds successfully** - All dependencies installed
✅ **Containers start without errors** - Services are accessible
✅ **Health checks pass** - Both frontend and backend respond
✅ **No port conflicts** - Services run on correct ports

## 🚀 **Deployment Options**

### **Option A: Docker Compose (Recommended)**
```bash
docker-compose up -d
```

### **Option B: Individual Containers**
```bash
# Frontend
docker run -p 3000:80 ucaeep-frontend

# Backend
docker run -p 5000:5000 ucaeep-backend
```

### **Option C: Production Deployment**
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d
```

## 🎉 **Success Indicators**

Your Docker build is successful when:
- [ ] No "react-scripts: not found" errors
- [ ] Build completes without exit code 127
- [ ] Containers start successfully
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend accessible at http://localhost:5000
- [ ] Health checks return 200 OK

---

**Your UCAEP website Docker deployment is now ready! 🐳🌾**
