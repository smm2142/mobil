
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: canvas.width / 2 - 15, y: canvas.height - 60, width: 30, height: 30 };
let hearts = [];
let enemies = [];
let bullets = [];
let score = 0;

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
  ctx.arc(player.x + player.width/2, player.y + player.height/2, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets.forEach(b => {
    drawHeart(b.x, b.y);
    b.y -= 5;
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

function detectCollisions() {
  bullets.forEach((b, bi) => {
    hearts.forEach((h, hi) => {
      if (Math.abs(b.x - h.x) < 20 && Math.abs(b.y - h.y) < 20) {
        hearts.splice(hi, 1);
        bullets.splice(bi, 1);
        score++;
        document.getElementById("score").textContent = score + " ❤️";
      }
    });

    enemies.forEach((e, ei) => {
      if (Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score = Math.max(score - 1, 0);
        document.getElementById("score").textContent = score + " ❤️";
      }
    });
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawHearts();
  drawEnemies();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

function spawnHeart() {
  hearts.push({ x: Math.random() * (canvas.width - 30), y: -20 });
}

function spawnEnemy() {
  enemies.push({ x: Math.random() * (canvas.width - 30), y: -20 });
}

canvas.addEventListener("touchstart", (e) => {
  let touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  player.x = touchX - player.width / 2;
  bullets.push({ x: player.x + player.width / 2, y: player.y });
});

setInterval(spawnHeart, 2000);
setInterval(spawnEnemy, 3000);

gameLoop();
