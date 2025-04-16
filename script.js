
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let unit = canvas.width / 10;

let playerImg = new Image(); playerImg.src = "shaks_clean.png";
let enemyImg = new Image(); enemyImg.src = "clean_enemy.png";
let bulletImg = new Image(); bulletImg.src = "fried_drumstick_clean.png";
let leftArrow = new Image(); leftArrow.src = "left.png";
let rightArrow = new Image(); rightArrow.src = "right.png";
let shootIcon = new Image(); shootIcon.src = "shoot.png";

let player = {
  x: canvas.width / 2 - unit,
  y: canvas.height - unit * 3,
  width: unit * 2,
  height: unit * 2,
};

let bullets = [], enemies = [];
let score = 0;
let leftPressed = false, rightPressed = false;
let isGameOver = false;

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  bullets = [];
  enemies = [];
  score = 0;
  isGameOver = false;
  player.x = canvas.width / 2 - unit;
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === " ") shoot();
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.key === "ArrowRight") rightPressed = false;
});

function shoot() {
  bullets.push({
    x: player.x + player.width / 3,
    y: player.y,
    width: unit,
    height: unit,
  });
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawBullets() {
  bullets = bullets.filter((b) => b.y > -unit);
  bullets.forEach((b) => {
    b.y -= unit * 0.4;
    ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height);
  });
}

function drawEnemies() {
  if (Math.random() < 0.02) {
    enemies.push({
      x: Math.random() * (canvas.width - unit * 1.5),
      y: 0,
      width: unit * 1.5,
      height: unit * 1.5
    });
  }

  enemies = enemies.filter((e) => e.y < canvas.height + unit);
  enemies.forEach((e) => {
    e.y += unit * 0.05;
    ctx.drawImage(enemyImg, e.x, e.y, e.width, e.height);

    bullets.forEach((b) => {
      if (
        b.x < e.x + e.width && b.x + b.width > e.x &&
        b.y < e.y + e.height && b.y + b.height > e.y
      ) {
        e.hit = true;
        b.hit = true;
        score += 10;
      }
    });

    if (
      e.x < player.x + player.width &&
      e.x + e.width > player.x &&
      e.y < player.y + player.height &&
      e.y + e.height > player.y
    ) {
      endGame();
    }
  });

  enemies = enemies.filter(e => !e.hit);
  bullets = bullets.filter(b => !b.hit);
}

function drawScore() {
  ctx.fillStyle = "#FFD700";
  ctx.font = `${unit}px monospace`;
  ctx.fillText("النقاط: " + score, unit * 0.5, unit * 1.5);
}

function drawControls() {
  const y = canvas.height - unit * 1.8;
  ctx.drawImage(leftArrow, unit * 0.5, y, unit * 1.8, unit * 1.8);
  ctx.drawImage(rightArrow, unit * 2.5, y, unit * 1.8, unit * 1.8);
  ctx.drawImage(shootIcon, canvas.width - unit * 2.3, y, unit * 1.8, unit * 1.8);
}

function update() {
  const moveSpeed = unit * 0.4;
  if (leftPressed) player.x = Math.max(0, player.x - moveSpeed);
  if (rightPressed) player.x = Math.min(canvas.width - player.width, player.x + moveSpeed);
}

function endGame() {
  isGameOver = true;
  document.getElementById("gameOverScreen").style.display = "flex";
  document.getElementById("finalScore").innerText = "النقاط: " + score;
}

function gameLoop() {
  if (isGameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();
  drawControls();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const yBtn = canvas.height - unit * 1.8;

  if (x >= unit * 0.5 && x <= unit * 2.3 && y >= yBtn) {
    player.x = Math.max(0, player.x - unit * 1.5);
  } else if (x >= unit * 2.5 && x <= unit * 4.3 && y >= yBtn) {
    player.x = Math.min(canvas.width - player.width, player.x + unit * 1.5);
  } else if (x >= canvas.width - unit * 2.3 && x <= canvas.width - unit * 0.5 && y >= yBtn) {
    shoot();
  }
});
