const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: canvas.width / 2 - 15, y: canvas.height - 60, width: 30, height: 30 };
let hearts = [];
let enemies = [];
let bullets = [];
let powerups = [];
let score = 0;
let comboCount = 0;
let lastHeartTime = 0;
let bossActive = false;
let boss = null;

function drawHeart(x, y) {
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
  ctx.fillStyle = "red";
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

function drawPowerups() {
  powerups.forEach(p => {
    if (p.type === "big") {
      ctx.fillStyle = "pink";
    } else if (p.type === "gold") {
      ctx.fillStyle = "gold";
    }
    drawHeart(p.x, p.y);
    p.y += 2;
  });
}

function drawBoss() {
  if (bossActive && boss) {
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function showCombo() {
  let comboText = document.getElementById("comboText");
  comboText.style.display = "block";
  setTimeout(() => {
    comboText.style.display = "none";
  }, 1000);
}

function detectCollisions() {
  bullets.forEach((b, bi) => {
    hearts.forEach((h, hi) => {
      if (Math.abs(b.x - h.x) < 20 && Math.abs(b.y - h.y) < 20) {
        hearts.splice(hi, 1);
        bullets.splice(bi, 1);
        score++;
        document.getElementById("score").textContent = score + " ❤️";

        let now = Date.now();
        if (now - lastHeartTime <= 10000) {
          comboCount++;
          if (comboCount >= 3) {
            showCombo();
            score += 2;
            document.getElementById("score").textContent = score + " ❤️";
            comboCount = 0;
          }
        } else {
          comboCount = 1;
        }
        lastHeartTime = now;
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

    if (bossActive && boss) {
      if (Math.abs(b.x - boss.x) < boss.radius && Math.abs(b.y - boss.y) < boss.radius) {
        bullets.splice(bi, 1);
        boss.hit++;
        if (boss.hit >= 3) {
          bossActive = false;
          score += 5;
          document.getElementById("score").textContent = score + " ❤️";
        }
      }
    }
  });

  powerups.forEach((p, pi) => {
    if (Math.abs(player.x + player.width / 2 - p.x) < 20 && Math.abs(player.y - p.y) < 20) {
      if (p.type === "big") {
        score += 3;
      } else if (p.type === "gold") {
        enemies = [];
        score += 1;
      }
      document.getElementById("score").textContent = score + " ❤️";
      powerups.splice(pi, 1);
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawHearts();
  drawEnemies();
  drawPowerups();
  drawBoss();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

function spawnHeart() {
  hearts.push({ x: Math.random() * (canvas.width - 30), y: -20 });

  let chance = Math.random();
  if (chance < 0.1) {
    powerups.push({ x: Math.random() * (canvas.width - 30), y: -20, type: "big" });
  } else if (chance < 0.15) {
    powerups.push({ x: Math.random() * (canvas.width - 30), y: -20, type: "gold" });
  }
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

setTimeout(() => {
  bossActive = true;
  boss = { x: canvas.width / 2, y: 50, radius: 30, hit: 0 };
}, 60000);

gameLoop();
