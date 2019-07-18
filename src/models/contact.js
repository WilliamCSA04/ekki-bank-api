'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    nickname: DataTypes.STRING
  }, {});
  Contact.associate = function(models) {
    Contact.belongsTo(models.User, {
      foreignKey: 'contactingId',
      as: 'contacting',
    })
    Contact.belongsTo(models.User, {
      foreignKey: 'contactId',
      as: 'contact',
    })
  };
  return Contact;
};