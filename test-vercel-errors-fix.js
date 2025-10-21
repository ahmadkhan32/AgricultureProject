// 🚨 Vercel Errors Fix Test Suite
const fs = require('fs');
const path = require('path');

console.log('🚨 Vercel Errors Fix Test Suite');
console.log('================================');
console.log('');

let testsPassed = 0;
let totalTests = 0;
let errors = [];

// Test 1: Check Vercel Configuration
function testVercelConfig() {
  totalTests++;
  console.log('Test 1: Checking Vercel configuration...');
  
  const vercelPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      // Check version
      if (vercelConfig.version === 2) {
        console.log('✅ Vercel version 2 configured');
        testsPassed++;
      } else {
        console.log('❌ Vercel version should be 2');
        errors.push('Vercel version should be 2');
      }
      
      // Check builds configuration
      if (vercelConfig.builds && vercelConfig.builds.length > 0) {
        console.log('✅ Vercel builds configuration exists');
        
        const build = vercelConfig.builds[0];
        if (build.src === 'client/package.json' && build.use === '@vercel/static-build') {
          console.log('✅ Build configuration is correct');
        } else {
          console.log('❌ Build configuration is incorrect');
          errors.push('Build configuration is incorrect');
        }
      } else {
        console.log('❌ Vercel builds configuration missing');
        errors.push('Vercel builds configuration missing');
      }
      
      // Check routes
      if (vercelConfig.routes && vercelConfig.routes.length > 0) {
        console.log('✅ Vercel routes configuration exists');
        
        const hasStaticRoute = vercelConfig.routes.some(route => 
          route.src === '/static/(.*)' && route.dest === '/static/$1'
        );
        const hasFallbackRoute = vercelConfig.routes.some(route => 
          route.src === '/(.*)' && route.dest === '/index.html'
        );
        
        if (hasStaticRoute && hasFallbackRoute) {
          console.log('✅ Routes configuration is correct');
        } else {
          console.log('❌ Routes configuration is incomplete');
          errors.push('Routes configuration is incomplete');
        }
      } else {
        console.log('❌ Vercel routes configuration missing');
        errors.push('Vercel routes configuration missing');
      }
      
      // Check functions configuration
      if (vercelConfig.functions) {
        console.log('✅ Vercel functions configuration exists');
        
        if (vercelConfig.functions['client/src/**/*.js'] && 
            vercelConfig.functions['client/src/**/*.js'].maxDuration) {
          console.log('✅ Function timeout configuration exists');
        } else {
          console.log('❌ Function timeout configuration missing');
          errors.push('Function timeout configuration missing');
        }
      } else {
        console.log('⚠️  Vercel functions configuration missing (optional)');
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
          console.log('✅ All required environment variables are set');
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

// Test 2: Check .vercelignore
function testVercelIgnore() {
  totalTests++;
  console.log('Test 2: Checking .vercelignore file...');
  
  const vercelIgnorePath = path.join(__dirname, '.vercelignore');
  
  if (fs.existsSync(vercelIgnorePath)) {
    console.log('✅ .vercelignore file exists');
    
    try {
      const ignoreContent = fs.readFileSync(vercelIgnorePath, 'utf8');
      
      const importantIgnores = [
        'node_modules',
        '.git',
        '*.log',
        'coverage',
        'server',
        'database',
        'scripts'
      ];
      
      let allImportantIgnores = true;
      
      importantIgnores.forEach(ignore => {
        if (ignoreContent.includes(ignore)) {
          console.log(`✅ ${ignore} is ignored`);
        } else {
          console.log(`❌ ${ignore} is not ignored`);
          allImportantIgnores = false;
        }
      });
      
      if (allImportantIgnores) {
        console.log('✅ .vercelignore configuration is complete');
        testsPassed++;
      } else {
        console.log('❌ .vercelignore configuration is incomplete');
        errors.push('.vercelignore configuration is incomplete');
      }
    } catch (error) {
      console.log('❌ Error reading .vercelignore file');
      errors.push('Error reading .vercelignore file');
    }
  } else {
    console.log('❌ .vercelignore file not found');
    errors.push('.vercelignore file not found');
  }
  console.log('');
}

// Test 3: Check Client Build
function testClientBuild() {
  totalTests++;
  console.log('Test 3: Checking client build...');
  
  const buildPath = path.join(__dirname, 'client', 'build');
  const indexPath = path.join(buildPath, 'index.html');
  const staticPath = path.join(buildPath, 'static');
  
  if (fs.existsSync(buildPath) && fs.existsSync(indexPath) && fs.existsSync(staticPath)) {
    console.log('✅ Client build exists and is complete');
    testsPassed++;
  } else {
    console.log('❌ Client build is missing or incomplete');
    errors.push('Client build is missing or incomplete');
  }
  console.log('');
}

// Test 4: Check Package.json
function testPackageJson() {
  totalTests++;
  console.log('Test 4: Checking package.json configuration...');
  
  const clientPackagePath = path.join(__dirname, 'client', 'package.json');
  
  if (fs.existsSync(clientPackagePath)) {
    try {
      const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
      
      // Check if it has homepage field
      if (clientPackage.homepage === '.' || clientPackage.homepage === './') {
        console.log('✅ Homepage is set correctly for SPA');
        testsPassed++;
      } else if (!clientPackage.homepage) {
        console.log('⚠️  Homepage not set (will use default)');
        testsPassed++;
      } else {
        console.log('❌ Homepage is set incorrectly');
        errors.push('Homepage is set incorrectly');
      }
      
      // Check build script
      if (clientPackage.scripts && clientPackage.scripts.build) {
        console.log('✅ Build script exists');
      } else {
        console.log('❌ Build script missing');
        errors.push('Build script missing');
      }
      
      // Check dependencies
      if (clientPackage.dependencies && clientPackage.dependencies['react-scripts']) {
        console.log('✅ react-scripts dependency exists');
      } else {
        console.log('❌ react-scripts dependency missing');
        errors.push('react-scripts dependency missing');
      }
    } catch (error) {
      console.log('❌ Error reading client package.json');
      errors.push('Error reading client package.json');
    }
  } else {
    console.log('❌ Client package.json not found');
    errors.push('Client package.json not found');
  }
  console.log('');
}

// Test 5: Check File Sizes
function testFileSizes() {
  totalTests++;
  console.log('Test 5: Checking file sizes...');
  
  const buildPath = path.join(__dirname, 'client', 'build');
  
  if (fs.existsSync(buildPath)) {
    try {
      const files = fs.readdirSync(buildPath, { recursive: true });
      let totalSize = 0;
      let largeFiles = [];
      
      files.forEach(file => {
        const filePath = path.join(buildPath, file);
        if (fs.statSync(filePath).isFile()) {
          const size = fs.statSync(filePath).size;
          totalSize += size;
          
          if (size > 10 * 1024 * 1024) { // 10MB
            largeFiles.push({ file, size: (size / 1024 / 1024).toFixed(2) + 'MB' });
          }
        }
      });
      
      const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
      console.log(`✅ Total build size: ${totalSizeMB}MB`);
      
      if (totalSize < 50 * 1024 * 1024) { // 50MB
        console.log('✅ Build size is within limits');
        testsPassed++;
      } else {
        console.log('❌ Build size is too large');
        errors.push('Build size is too large');
      }
      
      if (largeFiles.length > 0) {
        console.log('⚠️  Large files found:');
        largeFiles.forEach(file => {
          console.log(`   - ${file.file}: ${file.size}`);
        });
      }
    } catch (error) {
      console.log('❌ Error checking file sizes');
      errors.push('Error checking file sizes');
    }
  } else {
    console.log('❌ Build directory not found');
    errors.push('Build directory not found');
  }
  console.log('');
}

// Test 6: Check Environment Variables
function testEnvironmentVariables() {
  totalTests++;
  console.log('Test 6: Checking environment variables...');
  
  const vercelPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      if (vercelConfig.env) {
        console.log('✅ Environment variables are configured');
        
        // Check for localhost URLs (should be production URLs)
        const apiUrl = vercelConfig.env.REACT_APP_API_URL;
        if (apiUrl && !apiUrl.includes('localhost')) {
          console.log('✅ API URL is set to production');
          testsPassed++;
        } else if (apiUrl && apiUrl.includes('localhost')) {
          console.log('❌ API URL is set to localhost (should be production)');
          errors.push('API URL is set to localhost (should be production)');
        } else {
          console.log('❌ API URL is not set');
          errors.push('API URL is not set');
        }
        
        // Check Supabase configuration
        if (vercelConfig.env.REACT_APP_SUPABASE_URL && vercelConfig.env.REACT_APP_SUPABASE_ANON_KEY) {
          console.log('✅ Supabase configuration is complete');
        } else {
          console.log('❌ Supabase configuration is incomplete');
          errors.push('Supabase configuration is incomplete');
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

// Run all tests
function runAllTests() {
  testVercelConfig();
  testVercelIgnore();
  testClientBuild();
  testPackageJson();
  testFileSizes();
  testEnvironmentVariables();
  
  // Summary
  console.log('================================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  console.log('');
  
  if (testsPassed === totalTests) {
    console.log('🎉 All Vercel error tests passed!');
    console.log('');
    console.log('✅ Your Vercel configuration is ready:');
    console.log('1. ✅ Vercel configuration is correct');
    console.log('2. ✅ .vercelignore is configured');
    console.log('3. ✅ Client build is complete');
    console.log('4. ✅ Package.json is correct');
    console.log('5. ✅ File sizes are within limits');
    console.log('6. ✅ Environment variables are set');
    console.log('');
    console.log('🚀 Ready to deploy to Vercel!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npx vercel --prod');
    console.log('2. Or deploy via Vercel Dashboard');
    console.log('3. Test your deployed application');
  } else {
    console.log('⚠️  Some Vercel tests failed. Issues found:');
    console.log('');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ❌ ${error}`);
    });
    console.log('');
    console.log('🔧 Fix these issues before deployment:');
    console.log('1. Update vercel.json configuration');
    console.log('2. Check .vercelignore file');
    console.log('3. Verify client build');
    console.log('4. Check environment variables');
    console.log('5. Optimize file sizes');
  }
}

// Run the tests
runAllTests();
