const express = require('express');

const routes = express.Router();

routes.get('/', function (req, res) {
  res.send('Ekki bank api')
})

module.exports = routes;