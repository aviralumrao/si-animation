const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const shuttleImg = new Image();
shuttleImg.src = "assets/spaceShuttle.png";

const shuttle = {
  x: 220,
  y: 340,
  width: 60,
  height: 60,
  speed: 6
};

function drawShuttle() {
  ctx.drawImage(shuttleImg, shuttle.x, shuttle.y, shuttle.width, shuttle.height);
}




//restart game
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShuttle();
  requestAnimationFrame(gameLoop);
}