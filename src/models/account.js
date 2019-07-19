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
    const newBalance = this.balance - value;
    const doesNotHaveEnoughBalance = newBalance < 0;
    if(doesNotHaveEnoughBalance){
      const extractFromLimit = Math.abs(newBalance);
      const newLimit = this.limit - extractFromLimit;
      const doesNotHaveEnoughLimit = this.limit < 0;
      if(doesNotHaveEnoughLimit){
        //TODO: Return when account can't execute a transfer
      }
      this.executeTranference(0, newLimit, amount)
    }else{
      this.executeTranference(newBalance, this.limit, amount)
    }
  }

  Account.prototype.executeTranference = function(newBalance, newLimit, amount){
    //TODO: Logic to move money to new account
  }

  return Account;
};