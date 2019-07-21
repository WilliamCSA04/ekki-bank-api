const express = require('express')
const users = require('./controllers/users')
const contacts = require('./controllers/contacts')
const accounts = require('./controllers/accounts')

const routes = express.Router();

//Users
routes.get('/user/:userId/contacts', users.contacts)
routes.post('/user', users.create)
routes.post('/user/signin', users.signIn)

//Contacts
routes.post('/contact', contacts.create)
routes.put('/contact', contacts.update)
routes.delete('/contact', contacts.destroy)

//Account
routes.get('/account/:accountId/statement', accounts.statement);
routes.post('/account/transference', accounts.transfer)

module.exports = routes;