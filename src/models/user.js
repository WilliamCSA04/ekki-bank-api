'use strict';

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.import('./account')
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmptyName: function(value){
          const nameIsEmptyOrNull = !value
          if(nameIsEmptyOrNull){
            throw new Error("The user has to have a name")
          }
        }
      }
    },
    cpf: {
      type: DataTypes.STRING,
      validate: {
        is: /^\d{3}\d{3}\d{3}\d{2}$/
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: /^[(]{0,1}[0-9]{1,2}[)]{0,1}[0-9]*$/
      }
    },
  }, {
    freezeTableName: true,
    tableName: 'users',
    validate: true,
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