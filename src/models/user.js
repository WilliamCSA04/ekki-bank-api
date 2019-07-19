'use strict';
import Account from './account'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    cpf: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    hooks: {
      afterCreate: function(user, options){
        Account.create({userId: user.id});
      }
    }
  });
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

  User.getContacts = function(){
    const contactsPromise = new Promise((resolve, reject) => {
      this.getContacting().then(contactedUsers => {
        const contacts = contactedUsers.map(contactedUser => {
          return {
            nickname: contactedUser.contact.nickname,
          }
        });
        resolve(contacts);
      }).catch(err => {
        reject(err);
      })
    })
    return contactsPromise
  }

  return User;
};