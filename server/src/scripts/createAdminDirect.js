const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
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

    // Check if table exists and what columns it has
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME || 'ucaep_db']
    );

    if (tables.length > 0) {
      // Table exists, check columns
      const [columns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
        [process.env.DB_NAME || 'ucaep_db']
      );
      
      const columnNames = columns.map(col => col.COLUMN_NAME);
      console.log('Existing columns:', columnNames);
      
      // If first_name doesn't exist, add it
      if (!columnNames.includes('first_name')) {
        console.log('⚠️ Table exists but missing columns. Adding columns...');
        try {
          await connection.execute('ALTER TABLE users ADD COLUMN first_name VARCHAR(100)');
          await connection.execute('ALTER TABLE users ADD COLUMN last_name VARCHAR(100)');
          await connection.execute('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
          await connection.execute('ALTER TABLE users ADD COLUMN role ENUM(\'admin\', \'producer\') DEFAULT \'producer\'');
          await connection.execute('ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500)');
          console.log('✅ Columns added to existing table');
        } catch (err) {
          console.log('Note:', err.message);
        }
      }
    } else {
      // Create table from scratch
      await connection.execute(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          role ENUM('admin', 'producer') DEFAULT 'producer' NOT NULL,
          avatar_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_role (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Users table created');
    }

    // Check table structure and use correct column names
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME || 'ucaep_db']
    );
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    const useCamelCase = columnNames.includes('firstName');
    
    // Hash password
    const hashedPassword = bcrypt.hashSync('admin123', 10);

    // Check if admin exists
    const emailColumn = useCamelCase ? 'email' : 'email';
    const [existing] = await connection.execute(
      `SELECT * FROM users WHERE ${emailColumn} = ?`,
      ['admin@ucaep.com']
    );

    if (existing.length > 0) {
      // Update existing admin
      if (useCamelCase) {
        await connection.execute(
          'UPDATE users SET password = ?, firstName = ?, lastName = ?, role = ? WHERE email = ?',
          [hashedPassword, 'Admin', 'User', 'admin', 'admin@ucaep.com']
        );
      } else {
        await connection.execute(
          'UPDATE users SET password = ?, first_name = ?, last_name = ?, role = ? WHERE email = ?',
          [hashedPassword, 'Admin', 'User', 'admin', 'admin@ucaep.com']
        );
      }
      console.log('✅ Admin user password updated successfully!');
    } else {
      // Create new admin
      if (useCamelCase) {
        await connection.execute(
          'INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
          ['admin@ucaep.com', hashedPassword, 'Admin', 'User', 'admin']
        );
      } else {
        await connection.execute(
          'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
          ['admin@ucaep.com', hashedPassword, 'Admin', 'User', 'admin']
        );
      }
      console.log('✅ Admin user created successfully!');
    }

    console.log('');
    console.log('========================================');
    console.log('ADMIN CREDENTIALS:');
    console.log('========================================');
    console.log('Email: admin@ucaep.com');
    console.log('Password: admin123');
    console.log('========================================');

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

createAdmin();

