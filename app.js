const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const startGameButton = document.getElementById("start");

const backgroundMusic = new Audio("assets/xtremefreddy-game-music-loop-3-144252.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.25;

const shotSound = new Audio("assets/game-shot.mp3");
const alienKillSound = new Audio("assets/alien-kill.mp3");
const lifeLoseSound = new Audio("assets/life-lose.mp3");
const gameOverSound = new Audio("assets/game-over.mp3");

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

let gameRunning = false;

const shuttleImg = new Image();
shuttleImg.src = "assets/spaceShuttle.png";

const ufoImg1 = new Image();
ufoImg1.src = "assets/ufo1.png";

const ufoImg2 = new Image();
ufoImg2.src = "assets/ufo2.png";

let lives = 3;
let score = 0;
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

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

function gameLoop() {
  if (!gameRunning) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 110, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  updateBullets();
  AlienKill();
  drawBullets();

  updateAlienBullets();
  PlayerKill();
  drawAlienBullets();

  drawShuttle();
  updateAliens();
  drawAliens();

  updateExplosions();
  drawExplosions();

  requestAnimationFrame(gameLoop);
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

    if (Math.random() < 0.01) {
      const direction = Math.random() < 0.5 ? -1 : 1;
      alienBullets.push({
        x: alien.x + alien.width / 2,
        y: alien.y + alien.height / 2,
        width: 10,
        height: 4,
        speed: 5,
        direction: direction
      });
    }
  });
}

function drawBullets() {
  ctx.fillStyle = "white";
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


startGameButton.addEventListener("click", function () {
  const wasRunning = gameRunning;
  gameRunning = true;
  lives = 3;
  score = 0;
  alienSpeed = 1;
  bullets.length = 0;
  alienBullets.length = 0;
  sparks.length = 0;
  aliens.length = 0;
  spawnAlien();
  spawnAlien();
  shuttle.x = 570;
  shuttle.y = 480;
  scoreDisplay.textContent = "Score: 0";
  livesDisplay.textContent = "Lives: 3";
  startGameButton.textContent = "Restart Game";

  backgroundMusic.play();

  if (!wasRunning) {
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
  playSound(shotSound);
});


//backgroud stars
const stars = [];

for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2,
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

//UFO bullets

const alienBullets = [];

function drawAlienBullets() {
  ctx.fillStyle = "yellow";
  alienBullets.forEach(function (bullet) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function updateAlienBullets() {
  for (let i = alienBullets.length - 1; i >= 0; i--) {
    const bullet = alienBullets[i];
    bullet.x += bullet.speed * bullet.direction;

    if (bullet.x < 0 || bullet.x > canvas.width) {
      alienBullets.splice(i, 1);
    }
  }
}

//gaming

function AlienKill() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    for (let j = aliens.length - 1; j >= 0; j--) {
      const alien = aliens[j];

      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {
        createExplosion(alien.x + alien.width / 2, alien.y + alien.height / 2);
        bullets.splice(i, 1);
        aliens.splice(j, 1);

        score += 1;
        scoreDisplay.textContent = "Score: " + score;
        playSound(alienKillSound);

        alienSpeed += 0.2;
        spawnAlien();
        break;
      }
    }
  }
}

let alienSpeed = 1;

function spawnAlien() {
  const chosenImg = Math.random() < 0.5 ? ufoImg1 : ufoImg2;
  const angle = Math.random() * Math.PI * 2;

  aliens.push({
    x: Math.random() * (canvas.width - 60),
    y: Math.random() * 300,
    width: 60,
    height: 60,
    vx: Math.cos(angle) * alienSpeed,
    vy: Math.sin(angle) * alienSpeed,
    img: chosenImg
  });
}

function PlayerKill() {
  for (let i = alienBullets.length - 1; i >= 0; i--) {
    const bullet = alienBullets[i];

    if (
      bullet.x < shuttle.x + shuttle.width &&
      bullet.x + bullet.width > shuttle.x &&
      bullet.y < shuttle.y + shuttle.height &&
      bullet.y + bullet.height > shuttle.y
    ) {
      createExplosion(shuttle.x + shuttle.width / 2, shuttle.y + shuttle.height / 2);
      alienBullets.splice(i, 1);
      lives--;
      playSound(lifeLoseSound);
      livesDisplay.textContent = "Lives: " + lives;


      if (lives <= 0) {
        gameRunning = false;
        startGameButton.textContent = "Start Game";
        stopMusic();
        playSound(gameOverSound);
      }
    }
  }
}


//Explosion
const sparks = [];

function createExplosion(x, y) {
  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 5;

    sparks.push({
      x: x,
      y: y,
      pX: x,
      pY: y,
      vX: Math.cos(angle) * speed,
      vY: Math.sin(angle) * speed,
      life: 1,
      width: Math.random() * 2
    });
  }
}

function updateExplosions() {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i];
    spark.pX = spark.x;
    spark.pY = spark.y;
    spark.x += spark.vX;
    spark.y += spark.vY;
    spark.vX *= 0.9;
    spark.vY *= 0.9;
    spark.life -= 0.04;

    if (spark.life <= 0) {
      sparks.splice(i, 1);
    }
  }
}

function drawExplosions() {
  sparks.forEach(function (spark) {
    ctx.beginPath();
    ctx.moveTo(spark.pX, spark.pY);
    ctx.lineTo(spark.x, spark.y);
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, spark.life)})`;
    ctx.lineWidth = spark.width;
    ctx.stroke();
  });
}

