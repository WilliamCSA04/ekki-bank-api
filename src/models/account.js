'use strict';

import Transaction from './transaction';

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

  Account.prototype.transfer = function(targetUserId, amount){
    const resolve = account => {
      return Account.findOne({where: {ownerId: targetUserId}}).then(receiverAccount => {
        return receiverAccount.deposit(amount).then(depositedAccount => this)
        .catch(error => {
          account.deposit(amount)
          return error
        })
      })
    }

    const newBalance = this.balance - amount;
    const doesNotHaveEnoughBalance = newBalance < 0;
    const isTransactionDuplicated = Transaction.isDuplicated(this.ownerId, targetUserId)
    if(doesNotHaveEnoughBalance){
      const extractFromLimit = Math.abs(newBalance);
      const newLimit = this.limit - extractFromLimit;
      const doesNotHaveEnoughLimit = this.limit < 0;
      if(doesNotHaveEnoughLimit){
        return;
      }else{
        if(isTransactionDuplicated){
          return; //TODO: Return a friendly message
        }
      }
      Transaction.create({ amount, sourceUserId, targetUserId })
      return this.withdraw(0, newLimit).then(resolve)
    }else{
      if(isTransactionDuplicated){
        return; //TODO: Return a friendly message
      }
      Transaction.create({ amount, sourceUserId, targetUserId })
      return this.withdraw(newBalance, this.limit).then(resolve)
    }
  }

  Account.prototype.withdraw = function(newBalance, newLimit){
    const parametersToUpdate = {balance: newBalance, limit: newLimit}
    return this.update(parametersToUpdate)
  }

  Account.prototype.deposit = function(amount){
    const totalAmount = amount + this.balance;
    const limitTax = (500 - this.limit);
    const partialAmount = totalAmount - limitTax;
    if(partialAmount < 0){
      this.balance = 0
      this.limit = partialAmount;
    }else{
      this.balance = partialAmount
      this.limit = limitTax
    }
    return this.save()
  }

  return Account;
};