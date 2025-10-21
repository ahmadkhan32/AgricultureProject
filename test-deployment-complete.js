// 🧪 Complete Deployment Test Suite
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('🚀 UCAEP Deployment Test Suite');
console.log('================================');
console.log('');

let testsPassed = 0;
let totalTests = 0;
let errors = [];

// Test 1: Check Build Output
function testBuildOutput() {
  totalTests++;
  console.log('Test 1: Checking build output...');
  
  const buildPath = path.join(__dirname, 'client', 'build');
  const indexPath = path.join(buildPath, 'index.html');
  const staticPath = path.join(buildPath, 'static');
  
  if (fs.existsSync(buildPath) && fs.existsSync(indexPath) && fs.existsSync(staticPath)) {
    console.log('✅ Build output is complete');
    testsPassed++;
  } else {
    console.log('❌ Build output is incomplete');
    errors.push('Build output missing or incomplete');
  }
  console.log('');
}

// Test 2: Check Vercel Configuration
function testVercelConfig() {
  totalTests++;
  console.log('Test 2: Checking Vercel configuration...');
  
  const vercelPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      // Check builds configuration
      if (vercelConfig.builds && vercelConfig.builds.length > 0) {
        console.log('✅ Vercel builds configuration exists');
        
        const build = vercelConfig.builds[0];
        if (build.src === 'client/package.json' && build.config.distDir === 'build') {
          console.log('✅ Build configuration is correct');
          testsPassed++;
        } else {
          console.log('❌ Build configuration is incorrect');
          errors.push('Vercel build configuration incorrect');
        }
      } else {
        console.log('❌ Vercel builds configuration missing');
        errors.push('Vercel builds configuration missing');
      }
      
      // Check routes
      if (vercelConfig.routes && vercelConfig.routes.length > 0) {
        console.log('✅ Vercel routes configuration exists');
      } else {
        console.log('❌ Vercel routes configuration missing');
        errors.push('Vercel routes configuration missing');
      }
      
      // Check environment variables
      if (vercelConfig.env) {
        console.log('✅ Environment variables configured');
        const requiredVars = ['REACT_APP_API_URL', 'REACT_APP_SUPABASE_URL', 'REACT_APP_SUPABASE_ANON_KEY'];
        let allVarsPresent = true;
        
        requiredVars.forEach(varName => {
          if (vercelConfig.env[varName]) {
            console.log(`✅ ${varName} is set`);
          } else {
            console.log(`❌ ${varName} is missing`);
            allVarsPresent = false;
          }
        });
        
        if (allVarsPresent) {
          testsPassed++;
        } else {
          errors.push('Missing required environment variables');
        }
      } else {
        console.log('❌ No environment variables configured');
        errors.push('No environment variables configured');
      }
    } catch (error) {
      console.log('❌ Vercel configuration is invalid JSON');
      errors.push('Vercel configuration is invalid JSON');
    }
  } else {
    console.log('❌ vercel.json file not found');
    errors.push('vercel.json file not found');
  }
  console.log('');
}

// Test 3: Check Server Configuration
function testServerConfig() {
  totalTests++;
  console.log('Test 3: Checking server configuration...');
  
  const serverIndexPath = path.join(__dirname, 'server', 'index.js');
  const serverPackagePath = path.join(__dirname, 'server', 'package.json');
  
  if (fs.existsSync(serverIndexPath)) {
    try {
      const serverContent = fs.readFileSync(serverIndexPath, 'utf8');
      
      // Check CORS configuration
      if (serverContent.includes('cors')) {
        console.log('✅ CORS middleware is configured');
        
        if (serverContent.includes('vercel.app') || serverContent.includes('railway.app')) {
          console.log('✅ CORS includes production domains');
          testsPassed++;
        } else {
          console.log('❌ CORS may not include production domains');
          errors.push('CORS configuration may not include production domains');
        }
      } else {
        console.log('❌ CORS middleware not found');
        errors.push('CORS middleware not found');
      }
      
      // Check health endpoint
      if (serverContent.includes('/api/health')) {
        console.log('✅ Health check endpoint configured');
      } else {
        console.log('❌ Health check endpoint missing');
        errors.push('Health check endpoint missing');
      }
      
      // Check error handling
      if (serverContent.includes('app.use((err, req, res, next)')) {
        console.log('✅ Error handling middleware configured');
      } else {
        console.log('❌ Error handling middleware missing');
        errors.push('Error handling middleware missing');
      }
    } catch (error) {
      console.log('❌ Error reading server configuration');
      errors.push('Error reading server configuration');
    }
  } else {
    console.log('❌ Server index.js not found');
    errors.push('Server index.js not found');
  }
  
  if (fs.existsSync(serverPackagePath)) {
    try {
      const serverPackage = JSON.parse(fs.readFileSync(serverPackagePath, 'utf8'));
      if (serverPackage.scripts && serverPackage.scripts.start) {
        console.log('✅ Server start script configured');
      } else {
        console.log('❌ Server start script missing');
        errors.push('Server start script missing');
      }
    } catch (error) {
      console.log('❌ Server package.json is invalid');
      errors.push('Server package.json is invalid');
    }
  } else {
    console.log('❌ Server package.json not found');
    errors.push('Server package.json not found');
  }
  console.log('');
}

// Test 4: Check Client Configuration
function testClientConfig() {
  totalTests++;
  console.log('Test 4: Checking client configuration...');
  
  const clientPackagePath = path.join(__dirname, 'client', 'package.json');
  const clientIndexPath = path.join(__dirname, 'client', 'src', 'index.js');
  
  if (fs.existsSync(clientPackagePath)) {
    try {
      const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
      
      if (clientPackage.scripts && clientPackage.scripts.build) {
        console.log('✅ Client build script configured');
        testsPassed++;
      } else {
        console.log('❌ Client build script missing');
        errors.push('Client build script missing');
      }
      
      // Check dependencies
      const requiredDeps = ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'];
      let allDepsPresent = true;
      
      requiredDeps.forEach(dep => {
        if (clientPackage.dependencies && clientPackage.dependencies[dep]) {
          console.log(`✅ ${dep} dependency present`);
        } else {
          console.log(`❌ ${dep} dependency missing`);
          allDepsPresent = false;
        }
      });
      
      if (!allDepsPresent) {
        errors.push('Missing required client dependencies');
      }
    } catch (error) {
      console.log('❌ Client package.json is invalid');
      errors.push('Client package.json is invalid');
    }
  } else {
    console.log('❌ Client package.json not found');
    errors.push('Client package.json not found');
  }
  
  if (fs.existsSync(clientIndexPath)) {
    console.log('✅ Client entry point exists');
  } else {
    console.log('❌ Client entry point missing');
    errors.push('Client entry point missing');
  }
  console.log('');
}

// Test 5: Check Environment Variables
function testEnvironmentVariables() {
  totalTests++;
  console.log('Test 5: Checking environment variables...');
  
  const vercelPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      if (vercelConfig.env) {
        console.log('✅ Environment variables configured in vercel.json');
        
        // Check for localhost API URL (should be updated for production)
        if (vercelConfig.env.REACT_APP_API_URL && vercelConfig.env.REACT_APP_API_URL.includes('localhost')) {
          console.log('⚠️  API URL is set to localhost - should be updated for production');
          errors.push('API URL is set to localhost - needs production URL');
        } else if (vercelConfig.env.REACT_APP_API_URL) {
          console.log('✅ API URL is configured');
        }
        
        // Check Supabase configuration
        if (vercelConfig.env.REACT_APP_SUPABASE_URL && vercelConfig.env.REACT_APP_SUPABASE_ANON_KEY) {
          console.log('✅ Supabase configuration is complete');
          testsPassed++;
        } else {
          console.log('❌ Supabase configuration is incomplete');
          errors.push('Supabase configuration incomplete');
        }
      } else {
        console.log('❌ No environment variables configured');
        errors.push('No environment variables configured');
      }
    } catch (error) {
      console.log('❌ Error reading environment variables');
      errors.push('Error reading environment variables');
    }
  } else {
    console.log('❌ vercel.json not found');
    errors.push('vercel.json not found');
  }
  console.log('');
}

// Test 6: Check Build Process
function testBuildProcess() {
  totalTests++;
  console.log('Test 6: Testing build process...');
  
  const buildPath = path.join(__dirname, 'client', 'build');
  
  if (fs.existsSync(buildPath)) {
    console.log('✅ Build directory exists');
    
    // Check for required build files
    const requiredFiles = ['index.html', 'static'];
    let allFilesPresent = true;
    
    requiredFiles.forEach(file => {
      const filePath = path.join(buildPath, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} exists in build`);
      } else {
        console.log(`❌ ${file} missing from build`);
        allFilesPresent = false;
      }
    });
    
    if (allFilesPresent) {
      console.log('✅ Build output is complete');
      testsPassed++;
    } else {
      console.log('❌ Build output is incomplete');
      errors.push('Build output is incomplete');
    }
  } else {
    console.log('❌ Build directory not found');
    errors.push('Build directory not found');
  }
  console.log('');
}

// Test 7: Check Deployment Files
function testDeploymentFiles() {
  totalTests++;
  console.log('Test 7: Checking deployment files...');
  
  const deploymentFiles = [
    'vercel.json',
    'railway.json',
    'deploy-complete.bat',
    'deploy-complete.sh',
    'VERCEL_DEPLOYMENT_GUIDE.md'
  ];
  
  let allFilesPresent = true;
  
  deploymentFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      allFilesPresent = false;
    }
  });
  
  if (allFilesPresent) {
    console.log('✅ All deployment files present');
    testsPassed++;
  } else {
    console.log('❌ Some deployment files missing');
    errors.push('Some deployment files missing');
  }
  console.log('');
}

// Run all tests
function runAllTests() {
  testBuildOutput();
  testVercelConfig();
  testServerConfig();
  testClientConfig();
  testEnvironmentVariables();
  testBuildProcess();
  testDeploymentFiles();
  
  // Summary
  console.log('================================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  console.log('');
  
  if (testsPassed === totalTests) {
    console.log('🎉 All deployment tests passed!');
    console.log('');
    console.log('✅ Your project is ready for deployment:');
    console.log('1. ✅ Build output is complete');
    console.log('2. ✅ Vercel configuration is correct');
    console.log('3. ✅ Server configuration is ready');
    console.log('4. ✅ Client configuration is correct');
    console.log('5. ✅ Environment variables are set');
    console.log('6. ✅ Build process works');
    console.log('7. ✅ Deployment files are ready');
    console.log('');
    console.log('🚀 Ready to deploy!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Deploy frontend to Vercel');
    console.log('2. Deploy backend to Railway');
    console.log('3. Update environment variables with production URLs');
    console.log('4. Test the complete application');
  } else {
    console.log('⚠️  Some tests failed. Issues found:');
    console.log('');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ❌ ${error}`);
    });
    console.log('');
    console.log('🔧 Fix these issues before deployment:');
    console.log('1. Check build output');
    console.log('2. Verify configuration files');
    console.log('3. Update environment variables');
    console.log('4. Test build process');
  }
}

// Run the tests
runAllTests();
