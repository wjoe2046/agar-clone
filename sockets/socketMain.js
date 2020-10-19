//where all our main sockets stuff will go
const io = require('../servers').io;

// ==== CLASSES
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');

const Orb = require('./classes/Orb');
let orbs = [];
let players = [];

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

//issue a message to every connected socket 30 fps
setInterval(() => {
  io.to('game').emit('tock', {
    players,
  });
}, 33);

io.sockets.on('connect', (socket) => {
  //A player has connected
  socket.on('init', (data) => {
    //Add the player to the game namespace
    socket.join('game');
    //Make a PlayerConfig object
    let playerConfig = new PlayerConfig(settings);
    //make a playerData object
    let playerData = new PlayerData(data.playerName, settings);
    //make a master player object to hold both
    let player = new Player(socket.id, playerConfig, playerData);
    socket.emit('initReturn', { orbs });
    players.push(playerData);
  });

  //server sent over the tick
  socket.on('tick', (data) => {
    speed = player.playerConfig.speed;
    //update the player config object with a new direction in data
    //create the same local variable for player config for readability
    xV = data.playerConfig.xVector = data.xVector;
    yV = data.playerConfig.yVector = data.yVector;

    if (
      (player.locX < 5 && player.xVector < 0) ||
      (player.locX > 500 && xV > 0)
    ) {
      player.locY -= speed * yV;
    } else if ((player.locY < 5 && yV > 0) || (player.locY > 500 && yV < 0)) {
      player.locX += speed * xV;
    } else {
      player.locX += speed * xV;
      player.locY -= speed * yV;
    }
  });
});

//populate the game canvas with orbs
function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
