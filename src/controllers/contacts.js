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