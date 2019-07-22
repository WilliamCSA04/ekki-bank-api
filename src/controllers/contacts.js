const { Contact, User } = require('../models')

async function create(req, res){
  const { body } = req;
  const user = await User.findOne({where: {cpf: body.cpf}})
  const createParams = {contactedId: user.id, nickname: body.nickname, contactingId: body.contactingId}
  const contact = Contact.create(createParams).then(contact => {
    const responseJson = { contact, message: 'Contato salvo com sucesso' }
    res.status(200).json(responseJson);
  }).catch(err => {
    const responseJson = { err, message: 'Não foi possivel salvar seu contato' }
    res.status(400).json(responseJson);
  });
  return contact;
}

async function update(req, res){
  const { contactedId, contactingId, nickname } = req.body;
  const contact = await Contact.findOne({where: {contactedId: contactedId, contactingId: contactingId}})
  const updatedContact = contact.update({nickname: nickname}).then(contact => {
    const responseJson = { contact, message: 'Contato atualizado com sucesso' }
    res.status(200).json(responseJson);
  }).catch(err => {
    const responseJson = { message: 'Não foi possivel atualizar seu contato' }
    res.status(400).json(responseJson);
  });
  return updatedContact;
}

async function destroy(req, res){
  const { contactedId, contactingId } = req.params;
  const contact = await Contact.findOne({where: {contactedId: contactedId, contactingId: contactingId}})
  const destroyedContact = contact.destroy().then(contact => {
    const responseJson = { message: 'Contato deletado com sucesso' }
    res.status(200).json(responseJson);
  }).catch(err => {
    const responseJson = { message: 'Não foi possivel deletado seu contato' }
    res.status(400).json(responseJson);
  });
  return destroyedContact;
}

module.exports = {
  create,
  update,
  destroy
}