'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    value: DataTypes.DECIMAL
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};