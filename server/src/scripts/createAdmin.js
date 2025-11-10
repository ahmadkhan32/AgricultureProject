const { sequelize } = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check if admin already exists
    const existingAdmin = await User.scope(null).findOne({
      where: { email: 'admin@ucaep.com' }
    });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      
      // Update password to make sure it's correct
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await existingAdmin.update({
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      });
      
      console.log('✅ Admin password updated successfully');
      console.log('Email: admin@ucaep.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create new admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const admin = await User.create({
      email: 'admin@ucaep.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@ucaep.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

