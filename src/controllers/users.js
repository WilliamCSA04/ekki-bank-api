const { User } = require('../models')

function create(req, res) {
  const newUser = User.create(req.body).then(user => {
    const responseJson = { user, message: 'Usuário criado com sucesso' }
    res.status(200).json(responseJson);
  }).catch(error => {
    const responseJson = { message: 'Houve um erro enquanto tentavamos criar seu usuário' }
    res.status(400).json(responseJson)
  })
}

module.exports({
  create
})