'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    number: DataTypes.UUID,
    balance: DataTypes.DECIMAL,
    limit: DataTypes.DECIMAL
  }, {});
  Account.associate = function(models) {
    Account.belongsTo(models.User, {
      onDelete: 'CASCADE'
    });
  };
  return Account;
};