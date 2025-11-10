const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Producer = sequelize.define('Producer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  businessName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'business_name'
  },
  businessType: {
    type: DataTypes.ENUM('agriculture', 'livestock', 'fisheries', 'mixed'),
    allowNull: false,
    field: 'business_type'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  products: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'contact_email',
    validate: {
      isEmail: true
    }
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'contact_phone'
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  socialMedia: {
    type: DataTypes.JSON,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved',
    allowNull: false
  },
  isAiGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_ai_generated'
  },
  createdBy: {
    type: DataTypes.STRING(100),
    defaultValue: 'system',
    field: 'created_by'
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
  tableName: 'producers',
  timestamps: true
});

// Associations are defined in models/index.js

module.exports = Producer;

