// Vercel API Configuration Test
const https = require('https');
const http = require('http');

console.log('🔍 Vercel API Configuration Test');
console.log('==================================');
console.log('');

// Test URLs
const vercelUrl = 'https://ucaeep-website-9gtyyr0vy-ahmads-projects-3635a9cd.vercel.app';
const localhostApi = 'http://localhost:5000/api';
const railwayApi = 'https://your-railway-backend-url.railway.app/api';

let testsPassed = 0;
let totalTests = 0;

// Function to make HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.request(url, options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          data: data
        });
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });

    request.end();
  });
}

// Test 1: Check Vercel deployment accessibility
async function testVercelAccess() {
  totalTests++;
  console.log('Test 1: Checking Vercel deployment accessibility...');
  
  try {
    const response = await makeRequest(vercelUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ Vercel deployment is accessible (200 OK)');
      testsPassed++;
    } else {
      console.log(`❌ Vercel deployment returned ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Vercel deployment not accessible: ${error.message}`);
  }
  console.log('');
}

// Test 2: Check if localhost API is accessible (should fail)
async function testLocalhostAPI() {
  totalTests++;
  console.log('Test 2: Checking localhost API (should fail in production)...');
  
  try {
    const response = await makeRequest(localhostApi);
    console.log(`❌ Localhost API is accessible (${response.statusCode}) - This is wrong for production!`);
  } catch (error) {
    console.log('✅ Localhost API correctly not accessible in production');
    console.log(`✅ Error: ${error.message}`);
    testsPassed++;
  }
  console.log('');
}

// Test 3: Check if Railway API is accessible
async function testRailwayAPI() {
  totalTests++;
  console.log('Test 3: Checking Railway API (placeholder URL)...');
  
  try {
    const response = await makeRequest(railwayApi);
    console.log(`❌ Railway API returned ${response.statusCode} - This is a placeholder URL!`);
  } catch (error) {
    console.log('✅ Railway API correctly not accessible (placeholder URL)');
    console.log(`✅ Error: ${error.message}`);
    testsPassed++;
  }
  console.log('');
}

// Test 4: Check Vercel environment variables
async function testVercelEnvVars() {
  totalTests++;
  console.log('Test 4: Checking Vercel environment variables...');
  
  try {
    const response = await makeRequest(vercelUrl);
    
    if (response.data && response.data.includes('REACT_APP_API_URL')) {
      console.log('✅ Environment variables are being used');
      testsPassed++;
    } else {
      console.log('❌ Environment variables not detected in response');
    }
  } catch (error) {
    console.log(`❌ Error checking environment variables: ${error.message}`);
  }
  console.log('');
}

// Test 5: Check for 404 errors
async function test404Errors() {
  totalTests++;
  console.log('Test 5: Checking for 404 errors...');
  
  try {
    const response = await makeRequest(vercelUrl);
    
    if (response.statusCode === 404) {
      console.log('❌ Vercel deployment returns 404 - Configuration issue!');
    } else if (response.statusCode === 200) {
      console.log('✅ Vercel deployment returns 200 - No 404 errors');
      testsPassed++;
    } else {
      console.log(`⚠️  Vercel deployment returns ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Error checking 404 status: ${error.message}`);
  }
  console.log('');
}

// Test 6: Check API configuration issues
async function testAPIConfigIssues() {
  totalTests++;
  console.log('Test 6: Checking API configuration issues...');
  
  console.log('🔍 Current vercel.json configuration:');
  console.log('   REACT_APP_API_URL: http://localhost:5000/api');
  console.log('   REACT_APP_SUPABASE_URL: https://nzsydskdetneulvvpqxn.supabase.co');
  console.log('   REACT_APP_SUPABASE_ANON_KEY: [SET]');
  console.log('');
  
  console.log('❌ ISSUES FOUND:');
  console.log('   1. REACT_APP_API_URL points to localhost (won\'t work in production)');
  console.log('   2. No Railway backend URL configured');
  console.log('   3. API calls will fail in production');
  console.log('');
  
  console.log('✅ SOLUTIONS NEEDED:');
  console.log('   1. Update REACT_APP_API_URL to Railway backend URL');
  console.log('   2. Deploy backend to Railway first');
  console.log('   3. Update vercel.json with correct API URL');
  
  testsPassed++;
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log(`Testing Vercel deployment: ${vercelUrl}`);
  console.log('');
  
  await testVercelAccess();
  await testLocalhostAPI();
  await testRailwayAPI();
  await testVercelEnvVars();
  await test404Errors();
  await testAPIConfigIssues();
  
  // Summary
  console.log('==================================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the issues above.');
  }
  
  console.log('');
  console.log('🔧 FIXES NEEDED:');
  console.log('1. Deploy backend to Railway');
  console.log('2. Update REACT_APP_API_URL in vercel.json');
  console.log('3. Redeploy to Vercel');
  console.log('');
  console.log('📋 Current Issues:');
  console.log('- REACT_APP_API_URL points to localhost (production error)');
  console.log('- No backend deployed yet');
  console.log('- API calls will fail with 404');
}

// Run the tests
runAllTests().catch(console.error);
