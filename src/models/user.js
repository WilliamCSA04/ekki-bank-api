'use strict';
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
  };
  return User;
};