// Backend API Testing Script
const https = require('https');
const http = require('http');

// Configuration - Update these URLs with your actual deployment URLs
const BACKEND_URL = 'https://your-railway-url.railway.app'; // Replace with your Railway URL
const FRONTEND_URL = 'https://your-vercel-url.vercel.app'; // Replace with your Vercel URL

// Test configuration
const tests = [
  {
    name: 'Health Check',
    path: '/api/health',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'News API',
    path: '/api/news',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Producers API',
    path: '/api/producers',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Services API',
    path: '/api/services',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'CORS Preflight',
    path: '/api/health',
    method: 'OPTIONS',
    expectedStatus: 200,
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
  console.log('🚀 UCAEP Backend API Testing');
  console.log('================================');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log('');

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      
      const url = `${BACKEND_URL}${test.path}`;
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          ...test.headers
        }
      };

      const startTime = Date.now();
      const response = await makeRequest(url, options);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.statusCode === test.expectedStatus) {
        console.log(`✅ ${test.name}: PASSED (${response.statusCode}) - ${responseTime}ms`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: FAILED (${response.statusCode}) - Expected ${test.expectedStatus}`);
      }

      // Log response data for health check
      if (test.name === 'Health Check' && response.data) {
        try {
          const data = JSON.parse(response.data);
          console.log(`   Response: ${JSON.stringify(data)}`);
        } catch (e) {
          console.log(`   Response: ${response.data}`);
        }
      }

      // Log CORS headers for CORS test
      if (test.name === 'CORS Preflight') {
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
  console.log('================================');
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your backend is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check your backend configuration.');
  }
  
  console.log('');
  console.log('Next steps:');
  console.log('1. Update your frontend with the correct backend URL');
  console.log('2. Test the frontend in your browser');
  console.log('3. Check browser console for any errors');
  console.log('4. Test all pages and functionality');
}

// Run the tests
runTests().catch(console.error);
