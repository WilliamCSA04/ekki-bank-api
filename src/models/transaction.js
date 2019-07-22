'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    value: DataTypes.DECIMAL,
    toUserId: DataTypes.INTEGER,
    fromUserId: DataTypes.INTEGER,
  }, {
    freezeTableName: true,
    tableName: 'transactions'
  });
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

  Transaction.isDuplicated = async function(sourceUserId, targetUserId, amount){
    const lastTransactionsBetweenUsers = await Transaction.getLastTransactionBetweenUsers(sourceUserId, targetUserId, amount)
    const isFirstTransaction = !lastTransactionsBetweenUsers

    if(isFirstTransaction){
      return false;
    }
    const minutesBetweenTransactions = lastTransactionsBetweenUsers.timeDifference();
    const lessThanTwoMinutes = minutesBetweenTransactions < 2
    if(lessThanTwoMinutes){
      return lastTransactionsBetweenUsers.replaceTransaction().then(transaction => true);
    }else{
      return false;
    }
  }

  Transaction.prototype.replaceTransaction = function(){
    const { value, fromUserId, toUserId } = this;
    this.destroy();
    return Transaction.create({ value, fromUserId, toUserId });
  }

  Transaction.getLastTransactionBetweenUsers = function(sourceUserId, targetUserId, amount){
    const queryObject = { 
      where: {fromUserId: sourceUserId, toUserId: targetUserId, value: amount}, 
      order: [['createdAt', 'DESC']]
    }
    return Transaction.findAll(queryObject).then(transactions => transactions[0])
  }

  Transaction.prototype.timeDifference = function(){
    const present = Date.now();
    const creationDate = this.dataValues.createdAt.getTime();
    const diff = ((present - creationDate)/1000)/60;
    const roundedDiff = Math.floor(diff);
    const diffInMinutes = Math.abs(roundedDiff);
    return diffInMinutes;

  }

  return Transaction;
};