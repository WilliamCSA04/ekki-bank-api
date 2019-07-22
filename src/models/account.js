'use strict';

const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
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

  Account.prototype.transfer = async function(targetUserId, amount, io){
    const account = this;
    let successMessage = 'Transferencia executada com sucesso';
    const resolve = function(){
      return Account.findOne({where: {userId: targetUserId}}).then(receiverAccount => {
        return receiverAccount.deposit(amount).then(depositedAccount => {
          const sourceUserId = account.userId
          Transaction.create({ value: amount, fromUserId: sourceUserId, toUserId: targetUserId })
          io.emit(`account-${account.id}`, account)
          return{ account, message: successMessage};
        })
        .catch(error => {
          account.deposit(amount)
          return error
        })
      })
    }
    const newBalance = this.balance - amount;
    const doesNotHaveEnoughBalance = newBalance < 0;
    const isTransactionDuplicated = await Transaction.isDuplicated(this.userId, targetUserId, amount)
    if(doesNotHaveEnoughBalance){
      const extractFromLimit = Math.abs(newBalance);
      const newLimit = this.limit - extractFromLimit;
      const doesNotHaveEnoughLimit = newLimit < 0;
      if(doesNotHaveEnoughLimit){
        return {account, message: 'Você não possui saldo nem limite para realizar esta transferencia'};
      }else{
        if(isTransactionDuplicated){
          return {account, message: 'Transferencia repetida em menos de dois minutos, não à realizamos'};
        }
        successMessage += ", uma parte de seu limite foi usado para concluir a transação"
      }
      return this.withdraw(0, newLimit).then(resolve)
    }else{
      if(isTransactionDuplicated){
        return {account, message: 'Transferencia repetida em menos de dois minutos, não à realizamos'};
      }
      return this.withdraw(newBalance, this.limit).then(resolve)
    }
  }

  Account.prototype.withdraw = function(newBalance, newLimit){
    const parametersToUpdate = {balance: newBalance, limit: newLimit}
    return this.update(parametersToUpdate)

  }

  Account.prototype.deposit = function(amount){
    const totalAmount = parseFloat(this.balance) + parseFloat(amount);
    const limitTax = (500 - parseFloat(this.limit));
    const partialAmount = totalAmount - limitTax;
    if(partialAmount < 0){
      this.balance = 0
      this.limit += Math.abs(partialAmount);
    }else{
      this.balance = partialAmount
    }

    return this.save()
  }

  Account.prototype.statement = function(){
    const {userId} = this
    let queryObject = {
      where: {[Op.or]:[{fromUserId: userId}, {toUserId: userId}]},
      order: [['createdAt', 'DESC']]
    }
    return Transaction.findAll(queryObject).then(transactions => {
      queryObject = {
        where: {
          [Op.or]: [{contactingId: userId}],
        },
        attributes: ['nickname', 'contactingId', 'contactedId']
      } 
      const Contact = sequelize.import('./contact')
      return Contact.findAll(queryObject).then(async contacts => {
        const listOfUsers = contacts;
        const results = transactions.map(transaction => {
          const receiver = userId == transaction.toUserId
          const searchId = receiver ? userId : transaction.fromUserId
          const user = listOfUsers.find(u=>{
            return u.dataValues.contactingId == searchId
          })
          let name = "";
          if(user){
            name = user.nickname
          }
          let message = ""
          let status = 0
          if(receiver){
            message = "Transação recebida";
            status = 2
          }else{
            message = "Transação enviada";
            status = 1
          }
          const resultId = receiver ? transaction.fromUserId : userId
          return {
            id: resultId,
            name: name,
            amount: transaction.value,
            message: message,
            status: status
          }      
        })
        const notFoundUsers = results.filter(result  => {
          return result.name == ''
        })
        const missingUsersIds = notFoundUsers.map(notFoundUser => {
          return notFoundUser.id
        })
        const User = sequelize.import('./user')
        const history = await User.findAll({where: {id: missingUsersIds}}).then(users => {
          results.forEach(result => {
            users.forEach(user => {
              if(result.id == user.id){
                result.name = user.dataValues.name
              }
            })
          })
          return results
        })
        return history;
      })
    });
  }

  return Account;
};