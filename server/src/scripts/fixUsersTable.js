const mysql = require('mysql2/promise');
require('dotenv').config();

const fixTable = async () => {
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

    // Check current columns
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME || 'ucaep_db']
    );
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Current columns:', columnNames);

    // If table has camelCase columns, rename them or create snake_case version
    if (columnNames.includes('firstName') && !columnNames.includes('first_name')) {
      console.log('Converting camelCase to snake_case...');
      
      // Rename columns
      try {
        await connection.execute('ALTER TABLE users CHANGE COLUMN firstName first_name VARCHAR(100)');
        await connection.execute('ALTER TABLE users CHANGE COLUMN lastName last_name VARCHAR(100)');
        await connection.execute('ALTER TABLE users CHANGE COLUMN createdAt created_at TIMESTAMP');
        await connection.execute('ALTER TABLE users CHANGE COLUMN updatedAt updated_at TIMESTAMP');
        await connection.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500)');
        
        // Remove old columns if they still exist
        if (columnNames.includes('isActive')) {
          await connection.execute('ALTER TABLE users DROP COLUMN IF EXISTS isActive');
        }
        if (columnNames.includes('lastLogin')) {
          await connection.execute('ALTER TABLE users DROP COLUMN IF EXISTS lastLogin');
        }
        
        console.log('✅ Table structure fixed!');
      } catch (err) {
        console.log('Note:', err.message);
      }
    } else if (!columnNames.includes('first_name')) {
      // Table doesn't have snake_case columns, add them
      console.log('Adding missing columns...');
      try {
        await connection.execute('ALTER TABLE users ADD COLUMN first_name VARCHAR(100)');
        await connection.execute('ALTER TABLE users ADD COLUMN last_name VARCHAR(100)');
        await connection.execute('ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
        await connection.execute('ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
        await connection.execute('ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500)');
        
        // Copy data from camelCase to snake_case if camelCase exists
        if (columnNames.includes('firstName')) {
          await connection.execute('UPDATE users SET first_name = firstName WHERE first_name IS NULL');
          await connection.execute('UPDATE users SET last_name = lastName WHERE last_name IS NULL');
        }
        
        console.log('✅ Columns added!');
      } catch (err) {
        console.log('Note:', err.message);
      }
    } else {
      console.log('✅ Table structure is correct!');
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

fixTable();

