'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    nickname: DataTypes.STRING,
  }, {
    freezeTableName: true,
    tableName: 'contacts',
    hooks: {
      beforeCreate: function(contact, options){
        const nickname = contact.dataValues.nickname
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