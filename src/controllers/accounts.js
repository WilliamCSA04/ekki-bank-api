import { Account } from '../models'

function transfer(req, res){
  const transfer = Account.transfer(req.body).then(account => {
    const responseJson = { account, message: 'Transferencia executada com sucesso' }
    res.status(200).json(responseJson);
  }).catch(error => {
    const responseJson = { message: 'Houve um erro enquanto tentavamos processar sua transação' }
    res.status(400).json(responseJson)
  })
  return transfer;
}
