// Docker Build Fix Test
const fs = require('fs');
const path = require('path');

console.log('🐳 Docker Build Fix Test');
console.log('========================');
console.log('');

let testsPassed = 0;
let totalTests = 0;

// Test 1: Check if react-scripts is in package.json
function testReactScriptsInPackage() {
  totalTests++;
  console.log('Test 1: Checking if react-scripts is in package.json...');
  
  const packagePath = path.join(__dirname, 'client', 'package.json');
  
  if (fs.existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      if (packageJson.dependencies && packageJson.dependencies['react-scripts']) {
        console.log('✅ react-scripts found in dependencies');
        testsPassed++;
      } else if (packageJson.devDependencies && packageJson.devDependencies && packageJson.devDependencies['react-scripts']) {
        console.log('✅ react-scripts found in devDependencies');
        testsPassed++;
      } else {
        console.log('❌ react-scripts not found in package.json');
      }
    } catch (error) {
      console.log('❌ Error reading package.json');
    }
  } else {
    console.log('❌ package.json not found');
  }
  console.log('');
}

// Test 2: Check Dockerfile configuration
function testDockerfileConfig() {
  totalTests++;
  console.log('Test 2: Checking Dockerfile configuration...');
  
  const dockerfilePath = path.join(__dirname, 'client', 'Dockerfile');
  
  if (fs.existsSync(dockerfilePath)) {
    try {
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
      
      if (dockerfileContent.includes('npm ci')) {
        console.log('✅ Dockerfile uses npm ci');
        
        if (!dockerfileContent.includes('--only=production')) {
          console.log('✅ Dockerfile does NOT use --only=production (GOOD)');
          testsPassed++;
        } else {
          console.log('❌ Dockerfile still uses --only=production (BAD)');
        }
      } else {
        console.log('❌ Dockerfile does not use npm ci');
      }
    } catch (error) {
      console.log('❌ Error reading Dockerfile');
    }
  } else {
    console.log('❌ Dockerfile not found');
  }
  console.log('');
}

// Test 3: Check if build output exists
function testBuildOutput() {
  totalTests++;
  console.log('Test 3: Checking if build output exists...');
  
  const buildPath = path.join(__dirname, 'client', 'build');
  const indexPath = path.join(buildPath, 'index.html');
  
  if (fs.existsSync(buildPath) && fs.existsSync(indexPath)) {
    console.log('✅ Build output exists');
    console.log('✅ index.html found');
    testsPassed++;
  } else {
    console.log('❌ Build output missing or incomplete');
  }
  console.log('');
}

// Test 4: Check build script in package.json
function testBuildScript() {
  totalTests++;
  console.log('Test 4: Checking build script in package.json...');
  
  const packagePath = path.join(__dirname, 'client', 'package.json');
  
  if (fs.existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      if (packageJson.scripts && packageJson.scripts.build) {
        console.log('✅ Build script exists');
        
        if (packageJson.scripts.build === 'react-scripts build') {
          console.log('✅ Build script uses react-scripts build');
          testsPassed++;
        } else {
          console.log('❌ Build script does not use react-scripts build');
        }
      } else {
        console.log('❌ Build script not found');
      }
    } catch (error) {
      console.log('❌ Error reading package.json');
    }
  } else {
    console.log('❌ package.json not found');
  }
  console.log('');
}

// Test 5: Check Docker multi-stage build
function testDockerMultiStage() {
  totalTests++;
  console.log('Test 5: Checking Docker multi-stage build...');
  
  const dockerfilePath = path.join(__dirname, 'client', 'Dockerfile');
  
  if (fs.existsSync(dockerfilePath)) {
    try {
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
      
      if (dockerfileContent.includes('FROM node:18-alpine as build')) {
        console.log('✅ Multi-stage build detected');
        
        if (dockerfileContent.includes('FROM nginx:alpine')) {
          console.log('✅ Production stage uses nginx');
          testsPassed++;
        } else {
          console.log('❌ Production stage not using nginx');
        }
      } else {
        console.log('❌ Multi-stage build not detected');
      }
    } catch (error) {
      console.log('❌ Error reading Dockerfile');
    }
  } else {
    console.log('❌ Dockerfile not found');
  }
  console.log('');
}

// Test 6: Check nginx configuration
function testNginxConfig() {
  totalTests++;
  console.log('Test 6: Checking nginx configuration...');
  
  const nginxPath = path.join(__dirname, 'client', 'nginx.conf');
  
  if (fs.existsSync(nginxPath)) {
    console.log('✅ nginx.conf exists');
    testsPassed++;
  } else {
    console.log('❌ nginx.conf not found');
  }
  console.log('');
}

// Run all tests
function runAllTests() {
  testReactScriptsInPackage();
  testDockerfileConfig();
  testBuildOutput();
  testBuildScript();
  testDockerMultiStage();
  testNginxConfig();
  
  // Summary
  console.log('========================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 All Docker build tests passed!');
    console.log('');
    console.log('Your Docker build should work correctly:');
    console.log('1. ✅ react-scripts is available');
    console.log('2. ✅ Dockerfile configuration is correct');
    console.log('3. ✅ Build output exists');
    console.log('4. ✅ Build script is correct');
    console.log('5. ✅ Multi-stage build configured');
    console.log('6. ✅ nginx configuration ready');
    console.log('');
    console.log('Docker build commands:');
    console.log('- docker build -t ucaeep-client .');
    console.log('- docker run -p 3000:80 ucaeep-client');
  } else {
    console.log('⚠️  Some tests failed. Check the issues above.');
    console.log('');
    console.log('Common fixes:');
    console.log('- Ensure react-scripts is in package.json');
    console.log('- Remove --only=production from Dockerfile');
    console.log('- Run npm run build locally first');
    console.log('- Check Dockerfile configuration');
  }
}

// Run the tests
runAllTests();
