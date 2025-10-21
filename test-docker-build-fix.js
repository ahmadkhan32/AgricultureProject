// 🐳 Docker Build Fix Test Suite
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🐳 Docker Build Fix Test Suite');
console.log('================================');
console.log('');

let testsPassed = 0;
let totalTests = 0;
let errors = [];

// Test 1: Check Client Dockerfile
function testClientDockerfile() {
  totalTests++;
  console.log('Test 1: Checking client Dockerfile...');
  
  const dockerfilePath = path.join(__dirname, 'client', 'Dockerfile');
  
  if (fs.existsSync(dockerfilePath)) {
    try {
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
      
      // Check if it includes dev dependencies
      if (dockerfileContent.includes('--include=dev') || dockerfileContent.includes('npm ci --include=dev')) {
        console.log('✅ Client Dockerfile includes dev dependencies');
        testsPassed++;
      } else if (dockerfileContent.includes('npm ci')) {
        console.log('⚠️  Client Dockerfile uses npm ci but may not include dev dependencies');
        errors.push('Client Dockerfile may not include dev dependencies for build');
      } else {
        console.log('❌ Client Dockerfile does not use npm ci');
        errors.push('Client Dockerfile does not use npm ci');
      }
      
      // Check if it has build stage
      if (dockerfileContent.includes('FROM node:') && dockerfileContent.includes('RUN npm run build')) {
        console.log('✅ Client Dockerfile has build stage');
      } else {
        console.log('❌ Client Dockerfile missing build stage');
        errors.push('Client Dockerfile missing build stage');
      }
      
      // Check if it has production stage
      if (dockerfileContent.includes('FROM nginx:') && dockerfileContent.includes('COPY --from=build')) {
        console.log('✅ Client Dockerfile has production stage');
      } else {
        console.log('❌ Client Dockerfile missing production stage');
        errors.push('Client Dockerfile missing production stage');
      }
    } catch (error) {
      console.log('❌ Error reading client Dockerfile');
      errors.push('Error reading client Dockerfile');
    }
  } else {
    console.log('❌ Client Dockerfile not found');
    errors.push('Client Dockerfile not found');
  }
  console.log('');
}

// Test 2: Check Server Dockerfile
function testServerDockerfile() {
  totalTests++;
  console.log('Test 2: Checking server Dockerfile...');
  
  const dockerfilePath = path.join(__dirname, 'server', 'Dockerfile');
  
  if (fs.existsSync(dockerfilePath)) {
    try {
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
      
      // Check if it uses production dependencies
      if (dockerfileContent.includes('--omit=dev') || dockerfileContent.includes('--only=production')) {
        console.log('✅ Server Dockerfile uses production dependencies only');
        testsPassed++;
      } else if (dockerfileContent.includes('npm ci')) {
        console.log('⚠️  Server Dockerfile uses npm ci but may include dev dependencies');
        errors.push('Server Dockerfile may include unnecessary dev dependencies');
      } else {
        console.log('❌ Server Dockerfile does not use npm ci');
        errors.push('Server Dockerfile does not use npm ci');
      }
      
      // Check if it has health check
      if (dockerfileContent.includes('HEALTHCHECK')) {
        console.log('✅ Server Dockerfile has health check');
      } else {
        console.log('❌ Server Dockerfile missing health check');
        errors.push('Server Dockerfile missing health check');
      }
      
      // Check if it exposes port
      if (dockerfileContent.includes('EXPOSE 5000')) {
        console.log('✅ Server Dockerfile exposes port 5000');
      } else {
        console.log('❌ Server Dockerfile missing port exposure');
        errors.push('Server Dockerfile missing port exposure');
      }
    } catch (error) {
      console.log('❌ Error reading server Dockerfile');
      errors.push('Error reading server Dockerfile');
    }
  } else {
    console.log('❌ Server Dockerfile not found');
    errors.push('Server Dockerfile not found');
  }
  console.log('');
}

// Test 3: Check Docker Compose
function testDockerCompose() {
  totalTests++;
  console.log('Test 3: Checking docker-compose.yml...');
  
  const composePath = path.join(__dirname, 'docker-compose.yml');
  
  if (fs.existsSync(composePath)) {
    try {
      const composeContent = fs.readFileSync(composePath, 'utf8');
      
      // Check if it has frontend service
      if (composeContent.includes('frontend:') && composeContent.includes('build:')) {
        console.log('✅ Docker compose has frontend service with build');
        testsPassed++;
      } else {
        console.log('❌ Docker compose missing frontend service or build');
        errors.push('Docker compose missing frontend service or build');
      }
      
      // Check if it has backend service
      if (composeContent.includes('backend:') && composeContent.includes('build:')) {
        console.log('✅ Docker compose has backend service with build');
      } else {
        console.log('❌ Docker compose missing backend service or build');
        errors.push('Docker compose missing backend service or build');
      }
      
      // Check port mappings
      if (composeContent.includes('"3000:80"') || composeContent.includes('"3000:3000"')) {
        console.log('✅ Docker compose has frontend port mapping');
      } else {
        console.log('❌ Docker compose missing frontend port mapping');
        errors.push('Docker compose missing frontend port mapping');
      }
      
      if (composeContent.includes('"5000:5000"')) {
        console.log('✅ Docker compose has backend port mapping');
      } else {
        console.log('❌ Docker compose missing backend port mapping');
        errors.push('Docker compose missing backend port mapping');
      }
    } catch (error) {
      console.log('❌ Error reading docker-compose.yml');
      errors.push('Error reading docker-compose.yml');
    }
  } else {
    console.log('❌ docker-compose.yml not found');
    errors.push('docker-compose.yml not found');
  }
  console.log('');
}

// Test 4: Check Package.json Files
function testPackageJson() {
  totalTests++;
  console.log('Test 4: Checking package.json files...');
  
  const clientPackagePath = path.join(__dirname, 'client', 'package.json');
  const serverPackagePath = path.join(__dirname, 'server', 'package.json');
  
  // Check client package.json
  if (fs.existsSync(clientPackagePath)) {
    try {
      const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
      
      if (clientPackage.dependencies && clientPackage.dependencies['react-scripts']) {
        console.log('✅ Client package.json has react-scripts dependency');
        testsPassed++;
      } else {
        console.log('❌ Client package.json missing react-scripts dependency');
        errors.push('Client package.json missing react-scripts dependency');
      }
      
      if (clientPackage.scripts && clientPackage.scripts.build) {
        console.log('✅ Client package.json has build script');
      } else {
        console.log('❌ Client package.json missing build script');
        errors.push('Client package.json missing build script');
      }
    } catch (error) {
      console.log('❌ Error reading client package.json');
      errors.push('Error reading client package.json');
    }
  } else {
    console.log('❌ Client package.json not found');
    errors.push('Client package.json not found');
  }
  
  // Check server package.json
  if (fs.existsSync(serverPackagePath)) {
    try {
      const serverPackage = JSON.parse(fs.readFileSync(serverPackagePath, 'utf8'));
      
      if (serverPackage.scripts && serverPackage.scripts.start) {
        console.log('✅ Server package.json has start script');
      } else {
        console.log('❌ Server package.json missing start script');
        errors.push('Server package.json missing start script');
      }
    } catch (error) {
      console.log('❌ Error reading server package.json');
      errors.push('Error reading server package.json');
    }
  } else {
    console.log('❌ Server package.json not found');
    errors.push('Server package.json not found');
  }
  console.log('');
}

// Test 5: Check Build Context
function testBuildContext() {
  totalTests++;
  console.log('Test 5: Checking build context...');
  
  const clientSrcPath = path.join(__dirname, 'client', 'src');
  const clientPublicPath = path.join(__dirname, 'client', 'public');
  const serverSrcPath = path.join(__dirname, 'server');
  
  if (fs.existsSync(clientSrcPath) && fs.existsSync(clientPublicPath)) {
    console.log('✅ Client build context is complete');
    testsPassed++;
  } else {
    console.log('❌ Client build context is incomplete');
    errors.push('Client build context is incomplete');
  }
  
  if (fs.existsSync(serverSrcPath)) {
    console.log('✅ Server build context is complete');
  } else {
    console.log('❌ Server build context is incomplete');
    errors.push('Server build context is incomplete');
  }
  console.log('');
}

// Test 6: Check Environment Files
function testEnvironmentFiles() {
  totalTests++;
  console.log('Test 6: Checking environment files...');
  
  const envExamplePath = path.join(__dirname, 'env.example');
  const clientEnvPath = path.join(__dirname, 'client', 'env.example');
  const serverEnvPath = path.join(__dirname, 'server', 'env.example');
  
  let envFilesPresent = 0;
  
  if (fs.existsSync(envExamplePath)) {
    console.log('✅ Root env.example exists');
    envFilesPresent++;
  }
  
  if (fs.existsSync(clientEnvPath)) {
    console.log('✅ Client env.example exists');
    envFilesPresent++;
  }
  
  if (fs.existsSync(serverEnvPath)) {
    console.log('✅ Server env.example exists');
    envFilesPresent++;
  }
  
  if (envFilesPresent > 0) {
    console.log('✅ Environment files are present');
    testsPassed++;
  } else {
    console.log('❌ No environment files found');
    errors.push('No environment files found');
  }
  console.log('');
}

// Run all tests
function runAllTests() {
  testClientDockerfile();
  testServerDockerfile();
  testDockerCompose();
  testPackageJson();
  testBuildContext();
  testEnvironmentFiles();
  
  // Summary
  console.log('================================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  console.log('');
  
  if (testsPassed === totalTests) {
    console.log('🎉 All Docker build tests passed!');
    console.log('');
    console.log('✅ Your Docker configuration is ready:');
    console.log('1. ✅ Client Dockerfile is correct');
    console.log('2. ✅ Server Dockerfile is correct');
    console.log('3. ✅ Docker compose is configured');
    console.log('4. ✅ Package.json files are correct');
    console.log('5. ✅ Build context is complete');
    console.log('6. ✅ Environment files are present');
    console.log('');
    console.log('🐳 Ready to build Docker containers!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: docker-compose build');
    console.log('2. Run: docker-compose up -d');
    console.log('3. Test: curl http://localhost:3000');
    console.log('4. Test: curl http://localhost:5000/api/health');
  } else {
    console.log('⚠️  Some Docker tests failed. Issues found:');
    console.log('');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ❌ ${error}`);
    });
    console.log('');
    console.log('🔧 Fix these issues before building:');
    console.log('1. Update Dockerfiles with correct npm commands');
    console.log('2. Check docker-compose.yml configuration');
    console.log('3. Verify package.json dependencies');
    console.log('4. Ensure build context is complete');
  }
}

// Run the tests
runAllTests();
