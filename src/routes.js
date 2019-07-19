const express = require('express');
const controllers = require('./controllers')
const { users } = controllers

const routes = express.Router();

//Users
routes.post('/user', users.create)
routes.post('/user/signin', users.signIn)

module.exports = routes;