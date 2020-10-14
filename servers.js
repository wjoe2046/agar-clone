const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8080);

const io = socketio(expressServer);

console.log('express and socketio are listening on port 8080');
