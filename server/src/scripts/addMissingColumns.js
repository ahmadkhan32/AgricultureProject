const mysql = require('mysql2/promise');
require('dotenv').config();

const addColumns = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ucaep_db'
    });

    console.log('✅ Connected to MySQL');

    // Check existing columns
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME || 'ucaep_db']
    );
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Current columns:', columnNames);

    // Add missing columns
    const columnsToAdd = [
      { name: 'first_name', type: 'VARCHAR(100)', default: '' },
      { name: 'last_name', type: 'VARCHAR(100)', default: '' },
      { name: 'avatar_url', type: 'VARCHAR(500)', default: null },
      { name: 'created_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ];

    for (const col of columnsToAdd) {
      if (!columnNames.includes(col.name)) {
        try {
          let sql = `ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`;
          if (col.default === 'CURRENT_TIMESTAMP') {
            sql += ' DEFAULT CURRENT_TIMESTAMP';
          } else if (col.default === 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') {
            sql += ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';
          } else if (col.default === null) {
            sql += ' NULL';
          }
          
          await connection.execute(sql);
          console.log(`✅ Added column: ${col.name}`);
        } catch (err) {
          if (err.code !== 'ER_DUP_FIELD_NAME') {
            console.log(`⚠️ Could not add ${col.name}:`, err.message);
          }
        }
      } else {
        console.log(`✅ Column ${col.name} already exists`);
      }
    }

    // Copy data from camelCase to snake_case if needed
    if (columnNames.includes('firstName') && !columnNames.includes('first_name')) {
      // Already handled, but if first_name exists and has no data, copy from firstName
      await connection.execute(`
        UPDATE users 
        SET first_name = COALESCE(first_name, firstName),
            last_name = COALESCE(last_name, lastName)
        WHERE first_name IS NULL OR last_name IS NULL
      `);
      console.log('✅ Copied data from camelCase to snake_case');
    }

    // Ensure admin user has all required fields
    const [admin] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@ucaep.com']
    );

    if (admin.length > 0) {
      const hashedPassword = require('bcryptjs').hashSync('admin123', 10);
      await connection.execute(
        'UPDATE users SET first_name = COALESCE(first_name, ?), last_name = COALESCE(last_name, ?), role = ? WHERE email = ?',
        ['Admin', 'User', 'admin', 'admin@ucaep.com']
      );
      console.log('✅ Admin user data updated');
    }

    await connection.end();
    console.log('');
    console.log('✅ Table structure fixed!');
    console.log('');
    console.log('Admin credentials:');
    console.log('Email: admin@ucaep.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
};

addColumns();

