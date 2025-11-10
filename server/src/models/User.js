const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set(value) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    }
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name' // Maps to first_name in database
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name' // Maps to last_name in database
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'producer'),
    defaultValue: 'producer',
    allowNull: false
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'avatar_url'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] }
  }
});

// Instance method to check password
User.prototype.comparePassword = function(password) {
  try {
    const storedPassword = this.getDataValue('password');
    if (!storedPassword) {
      console.error('No password found in user object');
      return false;
    }
    return bcrypt.compareSync(password, storedPassword);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Instance method to get full name
User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = User;

