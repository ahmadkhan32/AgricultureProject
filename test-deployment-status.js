// Deployment Status Checker
const https = require('https');
const http = require('http');

// Configuration - Update these URLs with your actual deployment URLs
const BACKEND_URL = 'https://your-railway-url.railway.app'; // Replace with your Railway URL
const FRONTEND_URL = 'https://your-vercel-url.vercel.app'; // Replace with your Vercel URL

// Test configuration
const tests = [
  {
    name: 'Backend Health Check',
    url: `${BACKEND_URL}/api/health`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Tests if backend is running'
  },
  {
    name: 'Backend News API',
    url: `${BACKEND_URL}/api/news`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Tests news API endpoint'
  },
  {
    name: 'Backend Producers API',
    url: `${BACKEND_URL}/api/producers`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Tests producers API endpoint'
  },
  {
    name: 'Backend Services API',
    url: `${BACKEND_URL}/api/services`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Tests services API endpoint'
  },
  {
    name: 'CORS Preflight Test',
    url: `${BACKEND_URL}/api/health`,
    method: 'OPTIONS',
    expectedStatus: 200,
    description: 'Tests CORS configuration',
    headers: {
      'Origin': FRONTEND_URL,
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  }
];

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

// Run tests
async function runTests() {
  console.log('🔍 UCAEP Deployment Status Checker');
  console.log('====================================');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log('');

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Description: ${test.description}`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          ...test.headers
        }
      };

      const startTime = Date.now();
      const response = await makeRequest(test.url, options);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.statusCode === test.expectedStatus) {
        console.log(`✅ ${test.name}: PASSED (${response.statusCode}) - ${responseTime}ms`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: FAILED (${response.statusCode}) - Expected ${test.expectedStatus}`);
      }

      // Log response data for health check
      if (test.name === 'Backend Health Check' && response.data) {
        try {
          const data = JSON.parse(response.data);
          console.log(`   Response: ${JSON.stringify(data)}`);
        } catch (e) {
          console.log(`   Response: ${response.data}`);
        }
      }

      // Log CORS headers for CORS test
      if (test.name === 'CORS Preflight Test') {
        const corsHeaders = {
          'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
          'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
          'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
        };
        console.log(`   CORS Headers: ${JSON.stringify(corsHeaders)}`);
      }

    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
    console.log('');
  }

  // Summary
  console.log('====================================');
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your deployment is working correctly.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Test your frontend in browser');
    console.log('2. Check browser console for any errors');
    console.log('3. Test all pages and functionality');
  } else {
    console.log('⚠️  Some tests failed. Check your deployment configuration.');
    console.log('');
    console.log('Common issues:');
    console.log('1. Backend not deployed or not running');
    console.log('2. Environment variables not set correctly');
    console.log('3. CORS configuration issues');
    console.log('4. API endpoints not working');
    console.log('');
    console.log('Solutions:');
    console.log('1. Check Railway dashboard for backend status');
    console.log('2. Check Vercel dashboard for frontend status');
    console.log('3. Verify environment variables are set');
    console.log('4. Check build logs for errors');
  }
  
  console.log('');
  console.log('For detailed troubleshooting, check:');
  console.log('- DEPLOYMENT_STATUS_CHECKER.md');
  console.log('- Railway dashboard: https://railway.app');
  console.log('- Vercel dashboard: https://vercel.com');
}

// Run the tests
runTests().catch(console.error);
