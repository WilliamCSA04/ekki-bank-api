'use strict';

const Transaction = require('./transaction');
const Contact = require('./contact');
const { Op } = require('sequelize');
const faker = require('faker')

module.exports = (sequelize, DataTypes) => {
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
      as: 'owner'
    });
  };

  Account.prototype.transfer = function(targetUserId, amount){
    const resolve = account => {
      return Account.findOne({where: {ownerId: targetUserId}}).then(receiverAccount => {
        Transaction.create({ amount, sourceUserId, targetUserId })
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
    const ownerId = this.ownerId
    let queryObject = {
      where: {[Op.or]:[{fromUserId: ownerId}, {toUserId: ownerId}]},
      order: [['createdAt', 'DESC']]
    }
    return Transaction.findAll(queryObject).then(transactions => {
      const listOfUsersId = transactions.map(transaction => {
        const toUserId = transaction.toUserId;
        return ownerId == toUserId ? transaction.fromUserId : toUserId;
      });
      queryObject = {
        where: {
          [Op.and]: {
            [Op.or]: [{contactingId: ownerId}, {contactedId: ownerId}],
            [Op.or]: [{contactingId: listOfUsersId}, {contactedId: listOfUsersId}]
          }
        }
      } 
      return Contact.findAll(queryObject).then(contacts => {
        const listOfUsers = contacts.map(contact => {
          const contactedId = contact.contactedId;
          const contactId = contactedId == ownerId ? contact.contactingId : contactedId
          return {id: contactId, nickname: contact.nickname}
        })
        return transactions.map(transaction => {
          const received = ownerId == transaction.toUserId; 
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