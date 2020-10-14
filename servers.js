//Server.js is only for the making of the socketio server and the express server

const express = require('express');
const socketio = require('socket.io');
const helmet = require('helmet');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(helmet());

const expressServer = app.listen(8080);

const io = socketio(expressServer);

console.log('express and socketio are listening on port 8080');

//App Organization

module.exports = {
  app,
  io,
};
