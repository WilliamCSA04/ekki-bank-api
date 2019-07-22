const { User } = require('../models')

function create(req, res){
  const newUser = User.create(req.body).then(user => {
    const responseJson = { user, message: 'Usuário criado com sucesso' }
    res.status(200).json(responseJson);
  }).catch(error => {
    const responseJson = { error, message: 'Houve um erro enquanto tentavamos criar seu usuário' }
    res.status(400).json(responseJson)
  })
  return newUser
}

function signIn(req, res){
  const { cpf } = req.body
  const user = User.findOne({where: {cpf: cpf}, include: ['account']}).then(user => {
    if(user){
      res.status(200).json(user);
    }else{
      const responseJson = { message: "Não foi possivel encontrar um usuário cadastrado com o CPF informado" }
      res.status(401).json(responseJson)
    }
  }).catch(error => {
    const responseJson = { error, message: "Houve um erro ao tentar logar, por favor, tentar mais tarde" }
    res.status(400).json(responseJson)
  })
  return user;
}

async function contacts(req, res){
  const { userId } = req.params;
  const user = User.findByPk(userId).then(async user => {
    const contacts = await user.getContacts();
    res.status(200).json(contacts);
  }).catch(err => {
    const responseJson = { message: "Houve um erro ao tentar obter sua lista de contatos" }
    res.status(400).json(responseJson)
  })
  return user;
}

module.exports = {
  create,
  signIn,
  contacts
}