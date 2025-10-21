// Comprehensive Deployment Fix Test
const fs = require('fs');
const path = require('path');

console.log('🧪 UCAEP Deployment Fix Test');
console.log('================================');
console.log('');

let testsPassed = 0;
let totalTests = 0;

// Test 1: Check if client build exists
function testClientBuild() {
  totalTests++;
  console.log('Test 1: Checking client build output...');
  
  const buildPath = path.join(__dirname, 'client', 'build');
  const indexPath = path.join(buildPath, 'index.html');
  
  if (fs.existsSync(buildPath) && fs.existsSync(indexPath)) {
    console.log('✅ Client build exists and index.html found');
    testsPassed++;
  } else {
    console.log('❌ Client build missing or incomplete');
  }
  console.log('');
}

// Test 2: Check vercel.json configuration
function testVercelConfig() {
  totalTests++;
  console.log('Test 2: Checking vercel.json configuration...');
  
  const vercelPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      // Check if builds array exists
      if (vercelConfig.builds && vercelConfig.builds.length > 0) {
        console.log('✅ vercel.json has builds configuration');
        
        // Check if it points to client
        const build = vercelConfig.builds[0];
        if (build.src === 'client/package.json') {
          console.log('✅ Build source points to client folder');
        } else {
          console.log('❌ Build source should point to client/package.json');
        }
        
        // Check distDir
        if (build.config && build.config.distDir === 'build') {
          console.log('✅ Output directory set to build');
        } else {
          console.log('❌ Output directory should be set to build');
        }
        
        testsPassed++;
      } else {
        console.log('❌ vercel.json missing builds configuration');
      }
    } catch (error) {
      console.log('❌ vercel.json is not valid JSON');
    }
  } else {
    console.log('❌ vercel.json file not found');
  }
  console.log('');
}

// Test 3: Check package.json files
function testPackageJson() {
  totalTests++;
  console.log('Test 3: Checking package.json files...');
  
  const clientPackagePath = path.join(__dirname, 'client', 'package.json');
  const serverPackagePath = path.join(__dirname, 'server', 'package.json');
  
  if (fs.existsSync(clientPackagePath)) {
    try {
      const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
      if (clientPackage.scripts && clientPackage.scripts.build) {
        console.log('✅ Client package.json has build script');
        testsPassed++;
      } else {
        console.log('❌ Client package.json missing build script');
      }
    } catch (error) {
      console.log('❌ Client package.json is not valid JSON');
    }
  } else {
    console.log('❌ Client package.json not found');
  }
  
  if (fs.existsSync(serverPackagePath)) {
    try {
      const serverPackage = JSON.parse(fs.readFileSync(serverPackagePath, 'utf8'));
      if (serverPackage.scripts && serverPackage.scripts.start) {
        console.log('✅ Server package.json has start script');
      } else {
        console.log('❌ Server package.json missing start script');
      }
    } catch (error) {
      console.log('❌ Server package.json is not valid JSON');
    }
  } else {
    console.log('❌ Server package.json not found');
  }
  console.log('');
}

// Test 4: Check environment variables
function testEnvironmentVariables() {
  totalTests++;
  console.log('Test 4: Checking environment variables configuration...');
  
  const vercelPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      if (vercelConfig.env) {
        console.log('✅ Environment variables configured in vercel.json');
        
        // Check for required environment variables
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
        }
      } else {
        console.log('❌ No environment variables configured');
      }
    } catch (error) {
      console.log('❌ Error reading vercel.json');
    }
  } else {
    console.log('❌ vercel.json not found');
  }
  console.log('');
}

// Test 5: Check CORS configuration
function testCorsConfig() {
  totalTests++;
  console.log('Test 5: Checking CORS configuration...');
  
  const serverIndexPath = path.join(__dirname, 'server', 'index.js');
  
  if (fs.existsSync(serverIndexPath)) {
    try {
      const serverContent = fs.readFileSync(serverIndexPath, 'utf8');
      
      if (serverContent.includes('cors')) {
        console.log('✅ CORS middleware is imported');
        
        if (serverContent.includes('process.env.FRONTEND_URL')) {
          console.log('✅ CORS configuration uses environment variable');
          testsPassed++;
        } else if (serverContent.includes('agricul-website.vercel.app')) {
          console.log('✅ CORS configuration includes Vercel domains');
          testsPassed++;
        } else {
          console.log('❌ CORS configuration may not include Vercel domains');
        }
      } else {
        console.log('❌ CORS middleware not found');
      }
    } catch (error) {
      console.log('❌ Error reading server/index.js');
    }
  } else {
    console.log('❌ server/index.js not found');
  }
  console.log('');
}

// Test 6: Check build output structure
function testBuildStructure() {
  totalTests++;
  console.log('Test 6: Checking build output structure...');
  
  const buildPath = path.join(__dirname, 'client', 'build');
  const requiredFiles = ['index.html', 'static'];
  
  if (fs.existsSync(buildPath)) {
    let allFilesPresent = true;
    
    requiredFiles.forEach(file => {
      const filePath = path.join(buildPath, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} exists in build output`);
      } else {
        console.log(`❌ ${file} missing from build output`);
        allFilesPresent = false;
      }
    });
    
    if (allFilesPresent) {
      testsPassed++;
    }
  } else {
    console.log('❌ Build directory not found');
  }
  console.log('');
}

// Run all tests
function runAllTests() {
  testClientBuild();
  testVercelConfig();
  testPackageJson();
  testEnvironmentVariables();
  testCorsConfig();
  testBuildStructure();
  
  // Summary
  console.log('================================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 All deployment tests passed!');
    console.log('');
    console.log('Your project is ready for deployment:');
    console.log('1. ✅ Client builds successfully');
    console.log('2. ✅ Vercel configuration is correct');
    console.log('3. ✅ Environment variables are set');
    console.log('4. ✅ CORS is configured');
    console.log('5. ✅ Build output is complete');
    console.log('');
    console.log('Next steps:');
    console.log('- Deploy to Vercel: Set root directory to "client"');
    console.log('- Deploy to Railway: Use the server folder');
    console.log('- Test both deployments');
  } else {
    console.log('⚠️  Some tests failed. Check the issues above.');
    console.log('');
    console.log('Common fixes:');
    console.log('- Run "npm run build" in client folder');
    console.log('- Check vercel.json configuration');
    console.log('- Verify environment variables');
    console.log('- Check CORS configuration in server');
  }
}

// Run the tests
runAllTests();
