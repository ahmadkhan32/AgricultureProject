/**
 * Quick Test Script for CRUD System
 * 
 * This script tests the backend API endpoints to verify CRUD operations work.
 * Run this after starting the server: node test-crud-system.js
 */

const API_BASE = 'http://localhost:5000/api';

// Test data
const testResource = {
  title: 'Test Resource - ' + Date.now(),
  description: 'This is a test resource created by the test script',
  fileUrl: 'https://example.com/test.pdf',
  fileType: 'PDF',
  category: 'document',
  tags: ['test', 'automated']
};

// You need to get an admin token first (login as admin)
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE'; // Replace with actual token

async function testCreate() {
  console.log('\n📝 Testing CREATE...');
  try {
    const response = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(testResource)
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ CREATE successful:', data.id);
      return data.id;
    } else {
      console.log('❌ CREATE failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ CREATE error:', error.message);
    return null;
  }
}

async function testReadAll() {
  console.log('\n📖 Testing READ ALL...');
  try {
    const response = await fetch(`${API_BASE}/resources`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ READ ALL successful: ${data.resources?.length || 0} resources`);
      return data.resources || [];
    } else {
      console.log('❌ READ ALL failed:', data.message);
      return [];
    }
  } catch (error) {
    console.log('❌ READ ALL error:', error.message);
    return [];
  }
}

async function testReadOne(id) {
  console.log('\n📖 Testing READ ONE...');
  try {
    const response = await fetch(`${API_BASE}/resources/${id}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ READ ONE successful:', data.title);
      return data;
    } else {
      console.log('❌ READ ONE failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ READ ONE error:', error.message);
    return null;
  }
}

async function testUpdate(id) {
  console.log('\n✏️  Testing UPDATE...');
  try {
    const updateData = {
      ...testResource,
      title: 'Updated: ' + testResource.title,
      description: 'This resource has been updated'
    };

    const response = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ UPDATE successful:', data.title);
      return true;
    } else {
      console.log('❌ UPDATE failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ UPDATE error:', error.message);
    return false;
  }
}

async function testDelete(id) {
  console.log('\n🗑️  Testing DELETE...');
  try {
    const response = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ DELETE successful:', data.message);
      return true;
    } else {
      console.log('❌ DELETE failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ DELETE error:', error.message);
    return false;
  }
}

async function testSocketConnection() {
  console.log('\n🔌 Testing Socket.io Connection...');
  console.log('Note: Socket.io connection test requires browser/client');
  console.log('Open browser console and check for:');
  console.log('  ✅ Socket.io connected: [socket-id]');
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting CRUD System Tests...\n');
  console.log('⚠️  Make sure:');
  console.log('   1. Server is running on http://localhost:5000');
  console.log('   2. You have a valid admin token');
  console.log('   3. Update ADMIN_TOKEN in this script\n');

  // Test Read All (no auth required)
  const allResources = await testReadAll();

  // Test Create (requires admin token)
  if (ADMIN_TOKEN !== 'YOUR_ADMIN_TOKEN_HERE') {
    const createdId = await testCreate();
    
    if (createdId) {
      // Test Read One
      await testReadOne(createdId);
      
      // Test Update
      await testUpdate(createdId);
      
      // Test Delete
      await testDelete(createdId);
    }
  } else {
    console.log('\n⚠️  Skipping CREATE/UPDATE/DELETE tests - no admin token');
    console.log('   To test these, login as admin and update ADMIN_TOKEN in this script');
  }

  // Socket.io info
  await testSocketConnection();

  console.log('\n✅ Tests completed!');
  console.log('\n📝 For real-time Socket.io testing:');
  console.log('   1. Open browser and navigate to /resources');
  console.log('   2. Open browser console (F12)');
  console.log('   3. Create/update/delete a resource');
  console.log('   4. Check console for Socket.io events');
}

// Run tests
runTests().catch(console.error);

