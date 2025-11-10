const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Partnership = sequelize.define('Partnership', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  partnerType: {
    type: DataTypes.ENUM('local', 'international', 'government', 'ngo', 'private'),
    allowNull: false,
    field: 'partner_type'
  },
  logoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'logo_url'
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  contactInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'contact_info'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'active',
    allowNull: false
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
  tableName: 'partnerships',
  timestamps: true
});

module.exports = Partnership;

