'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    value: DataTypes.DECIMAL
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User, {
      foreignKey: 'fromUserId',
      as: 'fromUser',
    })
    Transaction.belongsTo(models.User, {
      foreignKey: 'toUserId',
      as: 'toUser',
    })
  };
  return Transaction;
};