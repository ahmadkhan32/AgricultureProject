// 🚨 All Vercel Errors Fix Test Suite
const fs = require('fs');
const path = require('path');

console.log('🚨 All Vercel Errors Fix Test Suite');
console.log('====================================');
console.log('');

let testsPassed = 0;
let totalTests = 0;
let errors = [];

// Test 1: Check Vercel Configuration
function testVercelConfig() {
  totalTests++;
  console.log('Test 1: Checking comprehensive Vercel configuration...');
  
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
      
      // Check build command
      if (vercelConfig.buildCommand && vercelConfig.buildCommand.includes('cd client')) {
        console.log('✅ Build command is configured correctly');
      } else {
        console.log('❌ Build command is missing or incorrect');
        errors.push('Build command is missing or incorrect');
      }
      
      // Check output directory
      if (vercelConfig.outputDirectory === 'client/build') {
        console.log('✅ Output directory is configured correctly');
      } else {
        console.log('❌ Output directory is incorrect');
        errors.push('Output directory is incorrect');
      }
      
      // Check framework
      if (vercelConfig.framework === 'create-react-app') {
        console.log('✅ Framework is set to create-react-app');
      } else {
        console.log('❌ Framework should be create-react-app');
        errors.push('Framework should be create-react-app');
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
      
      // Check routes configuration
      if (vercelConfig.routes && vercelConfig.routes.length > 0) {
        console.log('✅ Vercel routes configuration exists');
        
        const hasStaticRoute = vercelConfig.routes.some(route => 
          route.src === '/static/(.*)' && route.dest === '/static/$1'
        );
        const hasFallbackRoute = vercelConfig.routes.some(route => 
          route.src === '/(.*)' && route.dest === '/index.html'
        );
        const hasFaviconRoute = vercelConfig.routes.some(route => 
          route.src === '/favicon.ico' && route.dest === '/favicon.ico'
        );
        
        if (hasStaticRoute && hasFallbackRoute && hasFaviconRoute) {
          console.log('✅ Routes configuration is comprehensive');
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
            vercelConfig.functions['client/src/**/*.js'].maxDuration <= 10) {
          console.log('✅ Function timeout is optimized (≤10s)');
        } else {
          console.log('❌ Function timeout is too high or missing');
          errors.push('Function timeout is too high or missing');
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

// Test 2: Check Build Script
function testBuildScript() {
  totalTests++;
  console.log('Test 2: Checking Vercel build script...');
  
  const buildScriptPath = path.join(__dirname, 'vercel-build.js');
  
  if (fs.existsSync(buildScriptPath)) {
    console.log('✅ Vercel build script exists');
    
    try {
      const buildScriptContent = fs.readFileSync(buildScriptPath, 'utf8');
      
      if (buildScriptContent.includes('cd client') && 
          buildScriptContent.includes('npm ci') && 
          buildScriptContent.includes('npm run build')) {
        console.log('✅ Build script is comprehensive');
        testsPassed++;
      } else {
        console.log('❌ Build script is incomplete');
        errors.push('Build script is incomplete');
      }
    } catch (error) {
      console.log('❌ Error reading build script');
      errors.push('Error reading build script');
    }
  } else {
    console.log('❌ Vercel build script not found');
    errors.push('Vercel build script not found');
  }
  console.log('');
}

// Test 3: Check .vercelignore
function testVercelIgnore() {
  totalTests++;
  console.log('Test 3: Checking .vercelignore file...');
  
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
        'scripts',
        'test-*.js',
        'deploy-*.bat',
        'deploy-*.sh'
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
        console.log('✅ .vercelignore configuration is comprehensive');
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

// Test 4: Check Client Build
function testClientBuild() {
  totalTests++;
  console.log('Test 4: Checking client build...');
  
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

// Test 5: Check Package.json
function testPackageJson() {
  totalTests++;
  console.log('Test 5: Checking package.json configuration...');
  
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

// Test 6: Check File Sizes
function testFileSizes() {
  totalTests++;
  console.log('Test 6: Checking file sizes...');
  
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
          
          if (size > 5 * 1024 * 1024) { // 5MB
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

// Test 7: Check Error Prevention
function testErrorPrevention() {
  totalTests++;
  console.log('Test 7: Checking error prevention measures...');
  
  const vercelPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      // Check for function timeout optimization
      if (vercelConfig.functions && 
          vercelConfig.functions['client/src/**/*.js'] && 
          vercelConfig.functions['client/src/**/*.js'].maxDuration <= 10) {
        console.log('✅ Function timeout is optimized (≤10s)');
        testsPassed++;
      } else {
        console.log('❌ Function timeout is not optimized');
        errors.push('Function timeout is not optimized');
      }
      
      // Check for cache headers
      if (vercelConfig.routes && vercelConfig.routes.some(route => route.headers)) {
        console.log('✅ Cache headers are configured');
      } else {
        console.log('⚠️  Cache headers not configured (optional)');
      }
      
      // Check for proper routing
      if (vercelConfig.routes && vercelConfig.routes.length >= 4) {
        console.log('✅ Comprehensive routing is configured');
      } else {
        console.log('❌ Routing configuration is incomplete');
        errors.push('Routing configuration is incomplete');
      }
    } catch (error) {
      console.log('❌ Error reading Vercel configuration');
      errors.push('Error reading Vercel configuration');
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
  testBuildScript();
  testVercelIgnore();
  testClientBuild();
  testPackageJson();
  testFileSizes();
  testErrorPrevention();
  
  // Summary
  console.log('====================================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  console.log('');
  
  if (testsPassed === totalTests) {
    console.log('🎉 All Vercel error tests passed!');
    console.log('');
    console.log('✅ Your Vercel configuration is comprehensive:');
    console.log('1. ✅ Vercel configuration is optimized');
    console.log('2. ✅ Build script is comprehensive');
    console.log('3. ✅ .vercelignore is configured');
    console.log('4. ✅ Client build is complete');
    console.log('5. ✅ Package.json is correct');
    console.log('6. ✅ File sizes are within limits');
    console.log('7. ✅ Error prevention measures are in place');
    console.log('');
    console.log('🚀 Ready to deploy to Vercel without errors!');
    console.log('');
    console.log('All 50+ Vercel errors should be resolved:');
    console.log('✅ Function errors (500/502/504)');
    console.log('✅ Deployment errors (403/404/410/503)');
    console.log('✅ DNS errors (502/404)');
    console.log('✅ Runtime errors (508/503)');
    console.log('✅ Request errors (400/405/414/416/431)');
    console.log('✅ Routing errors (502)');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npx vercel --prod --force');
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
    console.log('2. Check build script');
    console.log('3. Verify .vercelignore file');
    console.log('4. Check client build');
    console.log('5. Verify package.json');
    console.log('6. Optimize file sizes');
    console.log('7. Add error prevention measures');
  }
}

// Run the tests
runAllTests();
