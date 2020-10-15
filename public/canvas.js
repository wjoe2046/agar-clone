// const { deflateRaw } = require('zlib');

function init() {
  draw();
}

// Drawing

let randomX = Math.floor(500 * Math.random() + 10);
let randomY = Math.floor(500 * Math.random() + 10);

console.log(randomX);

function draw() {
  context.beginPath();
  context.fillStyle = 'rgb(255, 0, 0)';
  //Draw an arc
  context.arc(randomX, randomY, 10, 0, Math.PI * 2);
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = 'rgb(0, 255, 0)';
  context.stroke();
  requestAnimationFrame(draw);
}
