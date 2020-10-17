//Player data where every socket needs to know
class PlayerData {
  constructor(playerName, settings) {
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 100);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 100);
    this.radius = settings.defaultSize;
  }
}
