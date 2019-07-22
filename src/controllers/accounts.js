const { Account } = require('../models')

function transfer(req, res){
  const { accountId, targetUserId, amount } = req.body;
  const transfer = Account.findByPk(accountId).then(account => {
    account.transfer(targetUserId, amount).then(accountAfterTransaction => {
      const responseJson = { accountAfterTransaction, message: 'Transferencia executada com sucesso' }
      res.status(200).json(responseJson);
    }).catch(error => {
      const responseJson = { error, message: 'Houve um erro enquanto tentavamos processar sua transação' }
      res.status(400).json(responseJson)
    })
  }).catch(error => {
    const responseJson = { error, message: 'Não foi possivel encontrar sua conta' }
    res.status(400).json(responseJson)
  })
  
  return transfer;
}

function statement(req, res){
  const { accountId } = res.params
  const statement = Account.findOne({where: {id: accountId}}).then(account => {
      Account.statement().then(transactionHistory => {
      const responseJson = { transactionHistory }
      res.status(200).json(responseJson);
    }).catch(error => {
      const responseJson = { message: 'Houve um erro enquanto tentavamos obter seu extrato' }
      res.status(400).json(responseJson)
    })
  }).catch(error => {
    const responseJson = { message: 'Não foi possivel encontrar esta conta' }
    res.status(400).json(responseJson)
  })
  return statement;
}

module.exports = {
  transfer,
  statement
}
