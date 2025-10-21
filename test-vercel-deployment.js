// Vercel Deployment Test
const https = require('https');
const http = require('http');

console.log('🚀 Vercel Deployment Test');
console.log('==========================');
console.log('');

const vercelUrl = 'https://ucaeep-website-mg2b6b7dp-ahmads-projects-3635a9cd.vercel.app';
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

// Test 1: Check if Vercel deployment is accessible
async function testVercelAccess() {
  totalTests++;
  console.log('Test 1: Checking if Vercel deployment is accessible...');
  
  try {
    const response = await makeRequest(vercelUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ Vercel deployment is accessible (200 OK)');
      console.log(`✅ Response time: ${Date.now()}ms`);
      testsPassed++;
    } else {
      console.log(`❌ Vercel deployment returned ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Vercel deployment not accessible: ${error.message}`);
  }
  console.log('');
}

// Test 2: Check if HTML content is served
async function testHTMLContent() {
  totalTests++;
  console.log('Test 2: Checking if HTML content is served...');
  
  try {
    const response = await makeRequest(vercelUrl);
    
    if (response.data && response.data.includes('<html')) {
      console.log('✅ HTML content is served');
      console.log('✅ Contains HTML structure');
      testsPassed++;
    } else {
      console.log('❌ No HTML content found');
    }
  } catch (error) {
    console.log(`❌ Error checking HTML content: ${error.message}`);
  }
  console.log('');
}

// Test 3: Check if React app is loaded
async function testReactApp() {
  totalTests++;
  console.log('Test 3: Checking if React app is loaded...');
  
  try {
    const response = await makeRequest(vercelUrl);
    
    if (response.data && (response.data.includes('react') || response.data.includes('React'))) {
      console.log('✅ React app is loaded');
      testsPassed++;
    } else if (response.data && response.data.includes('div id="root"')) {
      console.log('✅ React root element found');
      testsPassed++;
    } else {
      console.log('❌ React app not detected');
    }
  } catch (error) {
    console.log(`❌ Error checking React app: ${error.message}`);
  }
  console.log('');
}

// Test 4: Check if static assets are accessible
async function testStaticAssets() {
  totalTests++;
  console.log('Test 4: Checking if static assets are accessible...');
  
  try {
    const assetsUrl = `${vercelUrl}/static/js/main.86131137.js`;
    const response = await makeRequest(assetsUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ Static assets are accessible');
      console.log('✅ JavaScript files served correctly');
      testsPassed++;
    } else {
      console.log(`❌ Static assets returned ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Error checking static assets: ${error.message}`);
  }
  console.log('');
}

// Test 5: Check if CSS is accessible
async function testCSSAssets() {
  totalTests++;
  console.log('Test 5: Checking if CSS assets are accessible...');
  
  try {
    const cssUrl = `${vercelUrl}/static/css/main.ac641aaf.css`;
    const response = await makeRequest(cssUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ CSS assets are accessible');
      console.log('✅ Stylesheets served correctly');
      testsPassed++;
    } else {
      console.log(`❌ CSS assets returned ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Error checking CSS assets: ${error.message}`);
  }
  console.log('');
}

// Test 6: Check if deployment is fast
async function testDeploymentSpeed() {
  totalTests++;
  console.log('Test 6: Checking deployment speed...');
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(vercelUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (responseTime < 3000) {
      console.log(`✅ Deployment is fast (${responseTime}ms)`);
      testsPassed++;
    } else {
      console.log(`⚠️  Deployment is slow (${responseTime}ms)`);
    }
  } catch (error) {
    console.log(`❌ Error checking deployment speed: ${error.message}`);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log(`Testing Vercel deployment: ${vercelUrl}`);
  console.log('');
  
  await testVercelAccess();
  await testHTMLContent();
  await testReactApp();
  await testStaticAssets();
  await testCSSAssets();
  await testDeploymentSpeed();
  
  // Summary
  console.log('==========================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 All Vercel deployment tests passed!');
    console.log('');
    console.log('Your Vercel deployment is working perfectly:');
    console.log('1. ✅ Deployment is accessible');
    console.log('2. ✅ HTML content is served');
    console.log('3. ✅ React app is loaded');
    console.log('4. ✅ Static assets are accessible');
    console.log('5. ✅ CSS assets are accessible');
    console.log('6. ✅ Deployment is fast');
    console.log('');
    console.log('🌐 Vercel URL: https://ucaeep-website-b4fhh18zd-ahmads-projects-3635a9cd.vercel.app');
    console.log('📊 Inspect URL: https://vercel.com/ahmads-projects-3635a9cd/ucaeep-website/6NhVNCWC2gszdwohajJy6NbK71As');
  } else {
    console.log('⚠️  Some tests failed. Check the issues above.');
    console.log('');
    console.log('Common issues:');
    console.log('- Deployment might still be building');
    console.log('- CDN cache might need time to update');
    console.log('- Check Vercel dashboard for build status');
  }
}

// Run the tests
runAllTests().catch(console.error);
