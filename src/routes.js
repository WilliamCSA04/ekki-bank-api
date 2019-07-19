import express from 'express';
import { users, contacts } from './controllers'

const routes = express.Router();

//Users
routes.get('/user/:userId/contacts', users.contacts)
routes.post('/user', users.create)
routes.post('/user/signin', users.signIn)

//Contacts
routes.post('/contact', contacts.create)
routes.put('/contact', contacts.update)
routes.delete('/contact', contacts.destroy)

module.exports = routes;