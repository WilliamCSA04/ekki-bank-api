'use strict';

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.import('./account')
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    cpf: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'users',
    hooks: {
      afterCreate: function(user, options){
        Account.create({userId: user.dataValues.id});
      }
    }
  });
  User.associate = function(models) {
    User.hasOne(models.Account, {
      as: 'account',
      foreignKey: 'userId'
    })
    User.belongsToMany(User, {
      foreignKey: 'contactingId',
      as: 'contacting',
      through: 'Contact',
    })
    User.belongsToMany(User, {
      foreignKey: 'contactedId',
      as: 'contacted',
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

  User.prototype.getContacts = function(){
    return this.getContacting().then(userContacts => {
      return userContacts.map(contact => {
        return contact.dataValues.Contact.dataValues
      })
    });
  }

  return User;
};