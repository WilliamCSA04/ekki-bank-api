import { Contact } from '../models'

function create(req, res){
  const { body } = req;
  const contact = Contact.create(body).then(contact => {
    const responseJson = { contact, message: 'Contato salvo com sucesso' }
    res.status(200).json(responseJson);
  }).catch(err => {
    const responseJson = { message: 'Não foi possivel salvar seu contato' }
    res.status(400).json(responseJson);
  });
  return contact;
}

function update(req, res){
  const { nickname, contactId } = req.body;
  const contact = Contact.findByPk(contactId)
  const updatedContact = contact.update({nickname: nickname}).then(contact => {
    const responseJson = { contact, message: 'Contato atualizado com sucesso' }
    res.status(200).json(responseJson);
  }).catch(err => {
    const responseJson = { message: 'Não foi possivel atualizar seu contato' }
    res.status(400).json(responseJson);
  });
  return updatedContact;
}

function destroy(req, res){
  const { contactId } = req.body;
  const contact = Contact.findByPk(contactId)
  const destroyedContact = contact.destroy().then(contact => {
    const responseJson = { message: 'Contato deletado com sucesso' }
    res.status(200).json(responseJson);
  }).catch(err => {
    const responseJson = { message: 'Não foi possivel deletado seu contato' }
    res.status(400).json(responseJson);
  });
  return destroyedContact;
}