
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("gameContainer");
const endScreen = document.getElementById("endScreen");

let player = {
  x: window.innerWidth / 2 - 15,
  y: window.innerHeight - 60, // bu dəyişəcək yenə də
  width: 30,
  height: 30,
  upgrade: false
};

let hearts = [];
let enemies = [];
let fastEnemies = [];
let rockets = [];
let bullets = [];
let score = 0;
let bulletSpeed = 5;
let gameEnded = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.y = canvas.height - player.height - 30;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
function drawHeart(x, y) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x + 7, y);
  ctx.bezierCurveTo(x, y - 10, x - 15, y + 10, x + 7, y + 20);
  ctx.bezierCurveTo(x + 29, y + 10, x + 14, y - 10, x + 7, y);
  ctx.fill();
}

function drawPlayer() {
  ctx.fillStyle = "#ff9800";
  ctx.beginPath();
  ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets.forEach(b => {
    drawHeart(b.x, b.y);
    b.y -= bulletSpeed;
  });
}

function drawHearts() {
  hearts.forEach(h => {
    drawHeart(h.x, h.y);
    h.y += 2;
  });
}

function drawEnemies() {
  ctx.fillStyle = "black";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, 12, 0, Math.PI * 2);
    ctx.fill();
    e.y += 2;
  });
}

function drawFastEnemies() {
  ctx.fillStyle = "blue";
  fastEnemies.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, 10, 0, Math.PI * 2);
    ctx.fill();
    f.y += 4;
  });
}

function drawRockets() {
  ctx.fillStyle = "orange";
  rockets.forEach(r => {
    ctx.beginPath();
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x - 5, r.y + 15);
    ctx.lineTo(r.x + 5, r.y + 15);
    ctx.closePath();
    ctx.fill();
    r.y += 3;
  });
}

function detectCollisions() {
  bullets.forEach((b, bi) => {
    hearts.forEach((h, hi) => {
      if (Math.abs(b.x - h.x) < 20 && Math.abs(b.y - h.y) < 20) {
        hearts.splice(hi, 1);
        bullets.splice(bi, 1);
        score++;
        updateScore();
      }
    });

    enemies.forEach((e, ei) => {
      if (Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score = Math.max(score - 1, 0);
        updateScore();
      }
    });

    fastEnemies.forEach((f, fi) => {
      if (Math.abs(b.x - f.x) < 20 && Math.abs(b.y - f.y) < 20) {
        fastEnemies.splice(fi, 1);
        bullets.splice(bi, 1);
        score++;
        updateScore();
      }
    });

    rockets.forEach((r, ri) => {
      if (Math.abs(b.x - r.x) < 20 && Math.abs(b.y - r.y) < 20) {
        rockets.splice(ri, 1);
        bullets.splice(bi, 1);
        score += 3;
        updateScore();
      }
    });
  });
}

function updateScore() {
  scoreEl.textContent = score + " ❤️";

  if (score >= 10) player.upgrade = true;
  if (score >= 25) bulletSpeed = 8;

  if (score >= 30 && !gameEnded) {
    gameEnded = true;
    gameContainer.style.display = "none";
    endScreen.style.display = "flex";
  }
}

function gameLoop() {
  if (gameEnded) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawHearts();
  drawEnemies();
  drawFastEnemies();
  drawRockets();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

function spawnHeart() {
  hearts.push({ x: Math.random() * (canvas.width - 30), y: -20 });
}

function spawnEnemy() {
  enemies.push({ x: Math.random() * (canvas.width - 30), y: -20 });
}

function spawnFastEnemy() {
  fastEnemies.push({ x: Math.random() * (canvas.width - 30), y: -20 });
}

function spawnRocket() {
  rockets.push({ x: Math.random() * (canvas.width - 30), y: -20 });
}

canvas.addEventListener("touchstart", (e) => {
  let touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  player.x = touchX - player.width / 2;
  bullets.push({ x: player.x + player.width / 2, y: player.y });
});

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  gameLoop();
});

setInterval(spawnHeart, 2000);
setInterval(spawnEnemy, 3000);
setInterval(spawnFastEnemy, 4000);
setInterval(spawnRocket, 6000);
