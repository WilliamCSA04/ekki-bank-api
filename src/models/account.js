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

  Account.prototype.transfer = function(targetUserId, amount){
    const newBalance = this.balance - amount;
    const doesNotHaveEnoughBalance = newBalance < 0;
    if(doesNotHaveEnoughBalance){
      const extractFromLimit = Math.abs(newBalance);
      const newLimit = this.limit - extractFromLimit;
      const doesNotHaveEnoughLimit = this.limit < 0;
      if(doesNotHaveEnoughLimit){
        //TODO: Return when account can't execute a transfer
      }
      this.withdraw(0, newLimit)
    }else{
      this.withdraw(newBalance, this.limit)
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