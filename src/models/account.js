'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    number: DataTypes.UUID,
    balance: DataTypes.DECIMAL,
    limit: DataTypes.DECIMAL
  }, {});
  Account.associate = function(models) {
    // associations can be defined here
  };
  return Account;
};