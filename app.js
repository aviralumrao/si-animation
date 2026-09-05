const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const startGameButton = document.getElementById("startGame");
const shuttleImg = new Image();
shuttleImg.src = "assets/spaceShuttle.png";

startGameButton.addEventListener("click", gameLoop);

const ufoImg1 = new Image();
ufoImg1.src = "assets/ufo1.png";

const ufoImg2 = new Image();
ufoImg2.src = "assets/ufo2.png";

const shuttle = {
  x: 220,
  y: 340,
  width: 60,
  height: 60,
  speed: 6
};


function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShuttle();
  updateAliens();
  drawAliens();
  requestAnimationFrame(gameLoop);
}

function drawShuttle() {
  ctx.drawImage(shuttleImg, shuttle.x, shuttle.y, shuttle.width, shuttle.height);
}

function drawAliens() {
  aliens.forEach(function (alien) {
    ctx.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);
  });
}

const aliens = [
  {
    x: Math.random() * (canvas.width - 60),
    y: Math.random() * 200,
    width: 60,
    height: 60,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    img: ufoImg1
  },
  {
    x: Math.random() * (canvas.width - 60),
    y: Math.random() * 400,
    width: 60,
    height: 60,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    img: ufoImg2
  }
];


function updateAliens() {
  aliens.forEach(function (alien) {
    alien.x += alien.vx;
    alien.y += alien.vy;

    if (alien.x <= 0 || alien.x + alien.width >= canvas.width) {
      alien.vx *= -1;
    }

    if (alien.y <= 0 || alien.y + alien.height >= canvas.height) {
      alien.vy *= -1;
    }
  });
}

canvas.addEventListener('mousemove', function (e) {
  shuttle.x = e.offsetX - shuttle.width / 2;
  shuttle.y = e.offsetY - shuttle.height / 2;
}); 


