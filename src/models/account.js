'use strict';


module.exports = (sequelize, DataTypes) => {
  const { Op } = sequelize;
  const Transaction = sequelize.import('./Transaction')
  const faker = require('faker')
  const Account = sequelize.define('Account', {
    number: DataTypes.UUID,
    userId: DataTypes.INTEGER,
    balance: DataTypes.DECIMAL,
    limit: DataTypes.DECIMAL
  }, {
    freezeTableName: true,
    tableName: 'accounts',
    hooks: {
      beforeCreate: function(account, options){
        account.number = faker.finance.account()
      }
    }
  });
  Account.associate = function(models) {
    Account.belongsTo(models.User, {
      onDelete: 'CASCADE',
      as: 'user'
    });
  };

  Account.prototype.transfer = async function(targetUserId, amount){
    const originalAccount = this;
    const resolve = function(){
      return Account.findOne({where: {userId: targetUserId}}).then(receiverAccount => {
        return receiverAccount.deposit(amount).then(depositedAccount => {
          const sourceUserId = originalAccount.userId
          Transaction.create({ value: amount, fromUserId: sourceUserId, toUserId: targetUserId })
          return originalAccount;
        })
        .catch(error => {
          account.deposit(amount)
          return error
        })
      })
    }
    const newBalance = this.balance - amount;
    const doesNotHaveEnoughBalance = newBalance < 0;
    const isTransactionDuplicated = await Transaction.isDuplicated(this.userId, targetUserId)
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
      return this.withdraw(0, newLimit).then(resolve)
    }else{
      if(isTransactionDuplicated){
        return; //TODO: Return a friendly message
      }
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

  Account.prototype.statement = function(){
    const userId = this.userId
    let queryObject = {
      where: {[Op.or]:[{fromUserId: userId}, {toUserId: userId}]},
      order: [['createdAt', 'DESC']]
    }
    return Transaction.findAll(queryObject).then(transactions => {
      const listOfUsersId = transactions.map(transaction => {
        const toUserId = transaction.toUserId;
        return userId == toUserId ? transaction.fromUserId : toUserId;
      });
      queryObject = {
        where: {
          [Op.and]: {
            [Op.or]: [{contactingId: userId}, {contactedId: userId}],
            [Op.or]: [{contactingId: listOfUsersId}, {contactedId: listOfUsersId}]
          }
        }
      } 
      return Contact.findAll(queryObject).then(contacts => {
        const listOfUsers = contacts.map(contact => {
          const contactedId = contact.contactedId;
          const contactId = contactedId == userId ? contact.contactingId : contactedId
          return {id: contactId, nickname: contact.nickname}
        })
        return transactions.map(transaction => {
          const received = userId == transaction.toUserId; 
          if(received){
            return {
              name: listOfUsers[transaction.toUserId],
              amount: transaction.value,
              message: "Transação Recebida"
            }
          }else{
            return {
              name: listOfUsers[transaction.fromUserId],
              amount: transaction.value,
              message: "Transação realizada"
            }
          }
        })
      })
    });
  }

  return Account;
};