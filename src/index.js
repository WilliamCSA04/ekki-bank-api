const express = require('express')
const app = express()
const cors = require('cors');

const io = require('socket.io')(server);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.use(cors());
app.use(express.json())
app.use(require('./routes'))


 
app.listen(3001)