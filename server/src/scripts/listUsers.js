const mysql = require('mysql2/promise');
require('dotenv').config();

const listUsers = async () => {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ucaep_db'
    });

    console.log('✅ Connected to MySQL database');
    console.log('');

    // List all users
    const [users] = await connection.execute(
      'SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY id'
    );

    if (users.length === 0) {
      console.log('📭 No users found in database');
    } else {
      console.log(`👥 Found ${users.length} user(s):`);
      console.log('');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });
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

listUsers();

