const { Account } = require('../models')

function transfer(req, res){
  const { accountId, targetUserId, amount } = req.body;
  const transfer = Account.findByPk(accountId).then(account => {
    account.transfer(targetUserId, amount, req.io).then(account => {
      res.status(200).json(account);
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
  const { accountId } = req.params
  const statement = Account.findOne({where: {id: accountId}}).then(account => {
      account.statement().then(transactionHistory => {

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
