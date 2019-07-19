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

  Transaction.register = function(sourceUserId, targetUserId){
    const lastTransactionsBetweenUsers = Transaction.getLastTransactionBetweenUsers(sourceUserId, targetUserId)
    const minutesBetweenTransactions = lastTransactionsBetweenUsers.timeDifference();
    const lessThanTwoMinutes = minutesBetweenTransactions < 2
    if(lessThanTwoMinutes){
      return lastTransactionsBetweenUsers.replaceTransaction();
    }else{
      return Transaction.create({ value, sourceUserId, targetUserId });
    }
  }

  Transaction.prototype.replaceTransaction = function(){
    const { value, fromUserId, toUserId } = lastTransactionsBetweenUsers;
    lastTransactionsBetweenUsers.destroy();
    return Transaction.create({ value, fromUserId, toUserId });
  }

  Transaction.getLastTransactionBetweenUsers = function(sourceUserId, targetUserId){
    const queryObject = { 
      where: {fromUserId: sourceUserId, toUserId: targetUserId}, 
      order: [['createdAt', 'DESC']]
    }
    return Transaction.findAll(queryObject)[0]
  }

  Transaction.prototype.timeDifference = function(){
    const present = Date.now().getTime();
    const creationDate = this.createdAt.getTime();
    const diff = ((present - creationDate)/1000)/60;
    const roundedDiff = Math.floor(diff);
    const diffInMinutes = Math.abs(roundedDiff);
    return diffInMinutes;
  }

  return Transaction;
};