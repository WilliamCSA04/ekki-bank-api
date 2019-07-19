import express from 'express';
import { users } from './controllers'

const routes = express.Router();

//Users
routes.get('/user/:userId/contacts', users.contacts)
routes.post('/user', users.create)
routes.post('/user/signin', users.signIn)

module.exports = routes;