//use uuid module to create a massive random string to id this player
const { v4: uuidv4 } = require('uuid');

//Player data where every socket needs to know
class PlayerData {
  constructor(playerName, settings) {
    this.uid = uuidv4(); //this will generate a crazy string
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 100);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 100);
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
    this.orbsAbsorbed = 0;
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 200 + 50);
    const g = Math.floor(Math.random() * 200 + 50);
    const b = Math.floor(Math.random() * 200 + 50);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

module.exports = PlayerData;
