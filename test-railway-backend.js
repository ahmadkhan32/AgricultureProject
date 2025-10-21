// Railway Backend Test
const https = require('https');

console.log('🚀 Railway Backend Test');
console.log('=======================');
console.log('');

const railwayUrl = 'https://web-production-dcbca.up.railway.app';
const apiUrl = `${railwayUrl}/api`;
const healthUrl = `${railwayUrl}/api/health`;

let testsPassed = 0;
let totalTests = 0;

// Function to make HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, options, (response) => {
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

// Test 1: Check Railway backend health
async function testRailwayHealth() {
  totalTests++;
  console.log('Test 1: Checking Railway backend health...');
  
  try {
    const response = await makeRequest(healthUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ Railway backend is healthy (200 OK)');
      console.log(`✅ Response: ${response.data}`);
      testsPassed++;
    } else {
      console.log(`❌ Railway backend returned ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Railway backend not accessible: ${error.message}`);
  }
  console.log('');
}

// Test 2: Check Railway backend API
async function testRailwayAPI() {
  totalTests++;
  console.log('Test 2: Checking Railway backend API...');
  
  try {
    const response = await makeRequest(apiUrl);
    
    if (response.statusCode === 200 || response.statusCode === 404) {
      console.log(`✅ Railway backend API is accessible (${response.statusCode})`);
      console.log('✅ API endpoint is responding');
      testsPassed++;
    } else {
      console.log(`❌ Railway backend API returned ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Railway backend API not accessible: ${error.message}`);
  }
  console.log('');
}

// Test 3: Check Railway backend response time
async function testRailwaySpeed() {
  totalTests++;
  console.log('Test 3: Checking Railway backend response time...');
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(healthUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (responseTime < 5000) {
      console.log(`✅ Railway backend is fast (${responseTime}ms)`);
      testsPassed++;
    } else {
      console.log(`⚠️  Railway backend is slow (${responseTime}ms)`);
    }
  } catch (error) {
    console.log(`❌ Error checking Railway backend speed: ${error.message}`);
  }
  console.log('');
}

// Test 4: Check Railway backend CORS
async function testRailwayCORS() {
  totalTests++;
  console.log('Test 4: Checking Railway backend CORS...');
  
  try {
    const response = await makeRequest(healthUrl, {
      headers: {
        'Origin': 'https://ucaeep-website-9gtyyr0vy-ahmads-projects-3635a9cd.vercel.app'
      }
    });
    
    if (response.headers['access-control-allow-origin']) {
      console.log('✅ Railway backend CORS is configured');
      console.log(`✅ CORS Origin: ${response.headers['access-control-allow-origin']}`);
      testsPassed++;
    } else {
      console.log('⚠️  Railway backend CORS not configured');
    }
  } catch (error) {
    console.log(`❌ Error checking Railway backend CORS: ${error.message}`);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log(`Testing Railway backend: ${railwayUrl}`);
  console.log('');
  
  await testRailwayHealth();
  await testRailwayAPI();
  await testRailwaySpeed();
  await testRailwayCORS();
  
  // Summary
  console.log('=======================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 All Railway backend tests passed!');
    console.log('');
    console.log('✅ Railway backend is working perfectly:');
    console.log('1. ✅ Backend is healthy');
    console.log('2. ✅ API endpoint is accessible');
    console.log('3. ✅ Response time is good');
    console.log('4. ✅ CORS is configured');
    console.log('');
    console.log('🌐 Railway Backend URL: https://web-production-dcbca.up.railway.app');
    console.log('🔗 API Endpoint: https://web-production-dcbca.up.railway.app/api');
    console.log('💚 Health Check: https://web-production-dcbca.up.railway.app/api/health');
  } else {
    console.log('⚠️  Some Railway backend tests failed. Check the issues above.');
    console.log('');
    console.log('Common issues:');
    console.log('- Backend might still be deploying');
    console.log('- Environment variables not set');
    console.log('- CORS not configured');
  }
}

// Run the tests
runAllTests().catch(console.error);
