'use strict';
const Account = require('./account')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    cpf: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasOne(models.Account)
    User.belongsToMany(User, {
      foreignKey: 'contectingId',
      as: 'contacting',
      through: 'Contact',
    })
    User.belongsToMany(User, {
      foreignKey: 'contectId',
      as: 'contact',
      through: 'Contact',
    })
    User.belongsToMany(User, {
      foreignKey: 'fromUserId',
      as: 'fromUser',
      through: 'Transaction',
    })
    User.belongsToMany(User, {
      foreignKey: 'toUserId',
      as: 'toUser',
      through: 'Transaction',
    })
  };
  User.addHook('afterCreate', 'createAccount', (user, options) => {
    Account.create({userId: user.id});
  })
  return User;
};