const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.set('port', (process.env.PORT || 3001));

app.use(cors());
app.use(bodyParser.json());
app.use(require('./routes'))
app.use(bodyParser.urlencoded({ extended: false }));

server.listen(app.get('port'), () => {
  console.log(`Ekki API is running on port ${app.get('port')}`);
});