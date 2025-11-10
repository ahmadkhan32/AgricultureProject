const { sequelize } = require('../config/db');
const User = require('./User');
const Producer = require('./Producer');
const News = require('./News');
const Project = require('./Project');
const Partnership = require('./Partnership');
const Resource = require('./Resource');
const Service = require('./Service');
const Message = require('./Message');

// Define associations
Producer.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Producer, {
  foreignKey: 'userId',
  as: 'producers'
});

News.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});

User.hasMany(News, {
  foreignKey: 'authorId',
  as: 'news'
});

Project.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

User.hasMany(Project, {
  foreignKey: 'createdBy',
  as: 'projects'
});

Resource.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

User.hasMany(Resource, {
  foreignKey: 'createdBy',
  as: 'resources'
});

Service.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

User.hasMany(Service, {
  foreignKey: 'createdBy',
  as: 'services'
});

module.exports = {
  sequelize,
  User,
  Producer,
  News,
  Project,
  Partnership,
  Resource,
  Service,
  Message
};

