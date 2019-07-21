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