'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.import('./user')
  const Contact = sequelize.define('Contact', {
    nickname: DataTypes.STRING,
  }, {
    freezeTableName: true,
    tableName: 'contacts',
    hooks: {
      beforeCreate: async function(contact, options){
        const nickname = contact.dataValues.nickname
        if(!nickname){
          contact.nickname = await User.findOne({where: {id: contact.dataValues.contactedId}}).then(user => {
            return user.name
          })
        }
      },
      beforeUpdate: async function(contact, options){
        const nickname = contact.dataValues.nickname
        if(!nickname){
          contact.nickname = await User.findOne({where: {id: contact.dataValues.contactedId}}).then(user => {
            return user.name
          })
        }
      }
    },
    validate: {
      cantBeSameUser: function() {
        if(this.contactedId == this.contactingId){
          throw new Error("Both contacted and contacting must not have same value")
        }
      },
      cantHaveDuplicated: async function() {
        const contact = await Contact.findOne({where: {contactedId: this.contactedId, contactingId: this.contactingId}})
        if(contact){
          throw new Error("This contact already exist")
        }
      }
    }
  });
  Contact.associate = function(models) {
    Contact.belongsTo(models.User, {
      foreignKey: 'contactingId',
      as: 'contacting',
      onDelete: 'CASCADE',
    })
    Contact.belongsTo(models.User, {
      foreignKey: 'contactedId',
      as: 'contacted',
      onDelete: 'CASCADE',
    })
  };
  return Contact;
};