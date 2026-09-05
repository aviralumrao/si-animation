const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const startGameButton = document.getElementById("startGame");

let gameRunning = false;

const shuttleImg = new Image();
shuttleImg.src = "assets/spaceShuttle.png";

const ufoImg1 = new Image();
ufoImg1.src = "assets/ufo1.png";

const ufoImg2 = new Image();
ufoImg2.src = "assets/ufo2.png";

const shuttle = {
  x: 570,
  y: 480,
  width: 60,
  height: 60
};

const bullets = [];

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
    y: Math.random() * 200,
    width: 60,
    height: 60,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    img: ufoImg2
  }
];

function drawShuttle() {
  ctx.drawImage(shuttleImg, shuttle.x, shuttle.y, shuttle.width, shuttle.height);
}

function drawAliens() {
  aliens.forEach(function (alien) {
    ctx.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);
  });
}

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

function drawBullets() {
  ctx.fillStyle = "#ffff00";
  bullets.forEach(function (bullet) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y -= bullet.speed;

    if (bullet.y + bullet.height < 0) {
      bullets.splice(i, 1);
    }
  }
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBullets();
  drawBullets();
  drawStars();

  drawShuttle();
  updateAliens();
  drawAliens();

  requestAnimationFrame(gameLoop);
}

startGameButton.addEventListener("click", function () {
  if (!gameRunning) {
    gameRunning = true;
    startGameButton.textContent = "Restart Game";
    gameLoop();
  }
});

canvas.addEventListener("mousemove", function (e) {
  const bounds = canvas.getBoundingClientRect();
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;
  const canvasX = (e.clientX - bounds.left) * scaleX;
  const canvasY = (e.clientY - bounds.top) * scaleY;

  shuttle.x = Math.max(0, Math.min(canvas.width - shuttle.width, canvasX - shuttle.width / 2));
  shuttle.y = Math.max(0, Math.min(canvas.height - shuttle.height, canvasY - shuttle.height / 2));
});

canvas.addEventListener("click", function () {
  if (!gameRunning) return;

  bullets.push({
    x: shuttle.x + shuttle.width / 2,
    y: shuttle.y,
    width: 4,
    height: 14,
    speed: 10
  });
});


//backgroud stars
const stars = [];

for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 ,
    baseAlpha: Math.random() * 0.5 + 0.5
  });
}

function drawStars() {
  stars.forEach(function (star) {
    const dx = (shuttle.x + shuttle.width / 2) - star.x;
    const dy = (shuttle.y + shuttle.height / 2) - star.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let alpha = star.baseAlpha;
    let radius = star.radius;

    if (dist < 100) {
      const boost = (100 - dist) / 100;
      alpha = Math.min(1, star.baseAlpha + boost * 0.6);
      radius = star.radius + boost * 2;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });
}