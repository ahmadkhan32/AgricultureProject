const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'file_url'
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'file_type'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'file_size'
  },
  category: {
    type: DataTypes.ENUM('reports', 'guidelines', 'forms', 'documents', 'others'),
    allowNull: false,
    defaultValue: 'documents'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'download_count'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
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
  tableName: 'resources',
  timestamps: true
});

// Associations are defined in models/index.js

module.exports = Resource;

