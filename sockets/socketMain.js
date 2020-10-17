//where all our main sockets stuff will go
const io = require('../servers').io;

// ==== CLASSES
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');

const Orb = require('./classes/Orb');
let orbs = [];

let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  //as a player gets bigger, the zoom needs to go out
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
};

initGame();

io.sockets.on('connect', (socket) => {
  //A player has connected
  //Make a PlayerConfig object
  let playerConfig = new PlayerConfig(settings);
  //make a playerData object
  let playerData = new PlayerData(null, settings);
  //make a master player object to hold both
  let player = new Player(socket.id, playerConfig, playerData);
  socket.emit('init', { orbs });
});

//populate the game canvas with orbs
function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
