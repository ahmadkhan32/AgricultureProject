// Quick database connection test
const mysql = require('mysql2/promise');
require('dotenv').config();

const testConnection = async () => {
  console.log('🔍 Testing MySQL Connection...');
  console.log('');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ucaep_db'
  };
  
  console.log('📋 Connection Config:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' : '(empty)'}`);
  console.log(`   Database: ${config.database}`);
  console.log('');
  
  try {
    // Test 1: Basic connection (without database)
    console.log('Test 1: Connecting to MySQL server...');
    const connection1 = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    });
    console.log('✅ MySQL server is accessible');
    await connection1.end();
    
    // Test 2: Check if database exists
    console.log('Test 2: Checking if database exists...');
    const connection2 = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    });
    
    const [databases] = await connection2.query('SHOW DATABASES LIKE ?', [config.database]);
    
    if (databases.length > 0) {
      console.log(`✅ Database "${config.database}" exists`);
    } else {
      console.log(`❌ Database "${config.database}" does NOT exist`);
      console.log(`💡 Create it in phpMyAdmin or run: CREATE DATABASE ${config.database};`);
    }
    
    await connection2.end();
    
    // Test 3: Connect to specific database
    console.log(`Test 3: Connecting to database "${config.database}"...`);
    const connection3 = await mysql.createConnection(config);
    console.log(`✅ Successfully connected to database "${config.database}"`);
    
    // Test 4: Check tables
    const [tables] = await connection3.query('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables in database`);
    
    await connection3.end();
    
    console.log('');
    console.log('✅ All tests passed! Database connection is working.');
    process.exit(0);
    
  } catch (error) {
    console.error('');
    console.error('❌ Connection Test Failed:');
    console.error(`   Error: ${error.message}`);
    console.error('');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 MySQL server is not running or not accessible');
      console.error('   Solution: Start MySQL in XAMPP Control Panel');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Access denied - Wrong username or password');
      console.error('   Solution: Check DB_USER and DB_PASSWORD in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`💡 Database "${config.database}" does not exist`);
      console.error(`   Solution: Create database in phpMyAdmin: CREATE DATABASE ${config.database};`);
    } else {
      console.error('💡 Check MySQL service status and configuration');
    }
    
    console.error('');
    process.exit(1);
  }
};

testConnection();

