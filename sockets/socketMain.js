//where all our main sockets stuff will go
const io = require('../servers').io;
const checkForOrbCollisions = require('./checkCollisions')
  .checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions')
  .checkForPlayerCollisions;

// ==== CLASSES
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');

const Orb = require('./classes/Orb');

let orbs = [];
let players = [];

let settings = {
  defaultOrbs: 50,
  defaultSpeed: 6,
  defaultSize: 6,
  //as a player gets bigger, the zoom needs to go out
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
};

initGame();

setInterval(() => {
  if (players.length > 0) {
    io.to('game').emit('tock', {
      players,
    });
  }
}, 33);

//issue a message to every connected socket 30 fps

io.sockets.on('connect', (socket) => {
  //A player has connected
  console.log('a player has connected');
  let player = {};

  socket.on('init', (data) => {
    //Add the player to the game namespace
    console.log('joined');
    socket.join('game');
    //Make a PlayerConfig object
    let playerConfig = new PlayerConfig(settings);
    //make a playerData object
    let playerData = new PlayerData(data.playerName, settings);
    //make a master player object to hold both
    player = new Player(socket.id, playerConfig, playerData);

    setInterval(() => {
      socket.emit('tickTock', {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33);

    socket.emit('initReturn', { orbs });
    players.push(playerData);
  });

  //client sent over the tick
  socket.on('tick', (data) => {
    speed = player.playerConfig.speed;
    //update the player config object with a new direction in data
    //create the same local variable for player config for readability
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > settings.worldWidth && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > settings.worldHeight && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }

    let capturedOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );
    capturedOrb
      .then((data) => {
        //resolve when the collisions happen
        const orbData = {
          orbIndex: data,
          newOrb: orbs[data],
        };
        // console.log(orbData);
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
        io.sockets.emit('orbSwitch', orbData);
      })
      .catch(() => {});

    //player collision

    let playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    );
    playerDeath
      .then((data) => {
        console.log('Player collision!!!');
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
        //a player was absorbed. Let everyone know!
        io.sockets.emit('playerDeath', data);
      })
      .catch(() => {});
  });
  socket.on('disconnect', (data) => {
    //find out who just left ... which player in players
    //make sure the player exists
    if (player.playerData) {
      players.forEach((currPlayer, i) => {
        //if they match
        if (currPlayer.uid == player.playerData.uid) {
          players.splice(i, 1);
          io.sockets.emit('updateLeaderBoard', getLeaderBoard());
        }
      });
      // const updateStats =
    }
  });
});

function getLeaderBoard() {
  //sort players in descending order
  players.sort((a, b) => {
    return b.score - a.score;
  });
  let leaderBoard = players.map((curPlayer) => {
    return {
      name: curPlayer.name,
      score: curPlayer.score,
    };
  });
  return leaderBoard;
}

//populate the game canvas with orbs
function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
