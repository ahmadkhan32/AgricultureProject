// Test login functionality
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');

const testLogin = async () => {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ucaep_db'
    });

    console.log('✅ Connected to MySQL database');
    console.log('');

    const email = 'admin@ucaep.com';
    const password = 'admin123';

    // Check user exists
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ User not found with email:', email);
      console.log('💡 Run: node src/scripts/createAdminDirect.js');
      process.exit(1);
    }

    const user = users[0];
    console.log('✅ User found in database');
    console.log('📝 User details:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   First Name:', user.first_name || user.firstName);
    console.log('   Last Name:', user.last_name || user.lastName);
    console.log('');

    // Get password (could be in different columns)
    const storedPassword = user.password || user.PASSWORD;
    
    if (!storedPassword) {
      console.log('❌ No password found in database!');
      console.log('💡 Run: node src/scripts/createAdminDirect.js');
      process.exit(1);
    }

    console.log('📝 Password hash found:');
    console.log('   Length:', storedPassword.length);
    console.log('   Starts with $2:', storedPassword.startsWith('$2'));
    console.log('');

    // Test password comparison
    console.log('🔍 Testing password comparison...');
    const isPasswordValid = bcrypt.compareSync(password, storedPassword);
    
    if (isPasswordValid) {
      console.log('✅ Password is VALID! Login should work.');
      console.log('');
      console.log('💡 If login still fails, check:');
      console.log('   1. Server logs for detailed error messages');
      console.log('   2. Email format (case-sensitive)');
      console.log('   3. Password has no extra spaces');
    } else {
      console.log('❌ Password is INVALID!');
      console.log('');
      console.log('💡 Fixing password hash...');
      
      // Re-hash password
      const newHash = bcrypt.hashSync(password, 10);
      await connection.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [newHash, email]
      );
      
      console.log('✅ Password hash updated!');
      console.log('💡 Try logging in again now.');
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
};

testLogin();
