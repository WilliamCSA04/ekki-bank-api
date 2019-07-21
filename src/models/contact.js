'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    nickname: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'contacts',
    hooks: {
      beforeCreate: function(contact, options){
        if(!nickname){
          contact.nickname = contact.contacted.name
        }
      }
    }
  });
  Contact.associate = function(models) {
    Contact.belongsTo(models.User, {
      foreignKey: 'contactingId',
      as: 'contacting',
    })
    Contact.belongsTo(models.User, {
      foreignKey: 'contactId',
      as: 'contacted',
    })
  };
  return Contact;
};