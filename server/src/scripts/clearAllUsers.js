const mysql = require('mysql2/promise');
require('dotenv').config();

const clearAllUsers = async () => {
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

    // Count users before deletion
    const [countBefore] = await connection.execute(
      'SELECT COUNT(*) as count FROM users'
    );
    console.log(`📊 Current user count: ${countBefore[0].count}`);
    console.log('');

    if (countBefore[0].count === 0) {
      console.log('ℹ️ Database is already empty');
      await connection.end();
      process.exit(0);
    }

    // Delete all users except admin
    const [result] = await connection.execute(
      "DELETE FROM users WHERE email != 'admin@ucaep.com'"
    );

    console.log(`🗑️ Deleted ${result.affectedRows} user(s) (admin preserved)`);
    console.log('');

    // Count users after deletion
    const [countAfter] = await connection.execute(
      'SELECT COUNT(*) as count FROM users'
    );
    console.log(`📊 Remaining user count: ${countAfter[0].count}`);
    console.log('');

    // List remaining users
    const [users] = await connection.execute(
      'SELECT id, email, first_name, last_name, role FROM users ORDER BY id'
    );
    
    if (users.length > 0) {
      console.log('👥 Remaining users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.first_name} ${user.last_name}) - ${user.role}`);
      });
    }

    console.log('');
    console.log('✅ Database cleared successfully');
    console.log('💡 Run "node src/scripts/listUsers.js" to verify');

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

clearAllUsers();

