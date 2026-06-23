import './style.css';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const W = 480;
const H = 700;
canvas.width = W;
canvas.height = H;

// ---- 游戏状态 ----
const keys = {};
let score = 0;
let gameOver = false;

// ---- 玩家 ----
const player = {
  x: W / 2,
  y: H - 80,
  w: 40,
  h: 48,
  speed: 5,
};

// ---- 子弹 ----
const bullets = [];
const bulletSpeed = 8;
const bulletW = 4;
const bulletH = 14;
let bulletCooldown = 0;
const BULLET_DELAY = 12; // 帧间隔

// ---- 敌机 ----
const enemies = [];
const enemySpeed = 2.5;
const enemyW = 36;
const enemyH = 36;
let enemyCooldown = 0;
const ENEMY_DELAY = 50;

// ---- 粒子（爆炸效果） ----
const particles = [];

// ========== 输入处理 ==========
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space') e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ========== 绘制函数 ==========

function drawPlayer() {
  const { x, y, w, h } = player;
  ctx.save();
  ctx.translate(x, y);

  // 引擎尾焰
  ctx.fillStyle = '#ff6600';
  ctx.beginPath();
  ctx.moveTo(-8, h / 2 - 6);
  ctx.lineTo(0, h / 2 + 8 + Math.random() * 8);
  ctx.lineTo(8, h / 2 - 6);
  ctx.fill();

  // 机身
  ctx.fillStyle = '#4fc3f7';
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);           // 机头
  ctx.lineTo(-w / 2, h / 2);       // 左下
  ctx.lineTo(-w / 6, h / 3);       // 左内
  ctx.lineTo(0, h / 2 - 4);        // 尾中
  ctx.lineTo(w / 6, h / 3);        // 右内
  ctx.lineTo(w / 2, h / 2);        // 右下
  ctx.closePath();
  ctx.fill();

  // 驾驶舱
  ctx.fillStyle = '#b3e5fc';
  ctx.beginPath();
  ctx.ellipse(0, -4, 6, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBullet(b) {
  ctx.fillStyle = '#ffeb3b';
  ctx.shadowColor = '#ffeb3b';
  ctx.shadowBlur = 6;
  ctx.fillRect(b.x - bulletW / 2, b.y, bulletW, bulletH);
  ctx.shadowBlur = 0;
}

function drawEnemy(e) {
  ctx.save();
  ctx.translate(e.x, e.y);

  ctx.fillStyle = '#ef5350';
  ctx.beginPath();
  ctx.moveTo(0, e.h / 2);          // 机头（朝下）
  ctx.lineTo(-e.w / 2, -e.h / 2);  // 左上
  ctx.lineTo(-e.w / 6, -e.h / 4);
  ctx.lineTo(0, -e.h / 2 + 4);
  ctx.lineTo(e.w / 6, -e.h / 4);
  ctx.lineTo(e.w / 2, -e.h / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffcdd2';
  ctx.beginPath();
  ctx.ellipse(0, 4, 5, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawParticle(p) {
  ctx.fillStyle = `rgba(255, ${p.g}, 0, ${p.life / p.maxLife})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
}

// ========== 碰撞检测（矩形） ==========
function rectCollide(a, b) {
  return (
    Math.abs(a.x - b.x) < (a.w + b.w) / 2 &&
    Math.abs(a.y - b.y) < (a.h + b.h) / 2
  );
}

// ========== 生成对象 ==========

function spawnBullet() {
  bullets.push({ x: player.x, y: player.y - player.h / 2 - 6, w: bulletW, h: bulletH });
}

function spawnEnemy() {
  enemies.push({
    x: enemyW / 2 + Math.random() * (W - enemyW),
    y: -enemyH,
    w: enemyW,
    h: enemyH,
  });
}

function spawnExplosion(x, y) {
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.5;
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 2 + Math.random() * 3,
      g: 100 + Math.floor(Math.random() * 155),
      life: 20 + Math.random() * 15,
      maxLife: 35,
    });
  }
}

// ========== 更新逻辑 ==========

function update() {
  if (gameOver) return;

  // 玩家移动
  if (keys['ArrowLeft'] || keys['KeyA'])
    player.x = Math.max(player.w / 2, player.x - player.speed);
  if (keys['ArrowRight'] || keys['KeyD'])
    player.x = Math.min(W - player.w / 2, player.x + player.speed);
  if (keys['ArrowUp'] || keys['KeyW'])
    player.y = Math.max(player.h / 2, player.y - player.speed);
  if (keys['ArrowDown'] || keys['KeyS'])
    player.y = Math.min(H - player.h / 2, player.y + player.speed);

  // 发射子弹
  if (bulletCooldown > 0) bulletCooldown--;
  if (keys['Space'] && bulletCooldown <= 0) {
    spawnBullet();
    bulletCooldown = BULLET_DELAY;
  }

  // 子弹移动 + 边界移除
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bulletSpeed;
    if (bullets[i].y < -bulletH) bullets.splice(i, 1);
  }

  // 敌机生成 + 移动
  if (enemyCooldown > 0) enemyCooldown--;
  if (enemyCooldown <= 0) {
    spawnEnemy();
    enemyCooldown = ENEMY_DELAY + Math.floor(Math.random() * 30);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemySpeed;
    if (enemies[i].y > H + enemyH) {
      enemies.splice(i, 1);
    }
  }

  // 子弹 vs 敌机 碰撞
  for (let bi = bullets.length - 1; bi >= 0; bi--) {
    let hit = false;
    for (let ei = enemies.length - 1; ei >= 0; ei--) {
      if (rectCollide(bullets[bi], enemies[ei])) {
        spawnExplosion(enemies[ei].x, enemies[ei].y);
        enemies.splice(ei, 1);
        hit = true;
        score += 100;
        break;
      }
    }
    if (hit) bullets.splice(bi, 1);
  }

  // 玩家 vs 敌机 碰撞
  for (let ei = enemies.length - 1; ei >= 0; ei--) {
    if (rectCollide(player, enemies[ei])) {
      spawnExplosion(enemies[ei].x, enemies[ei].y);
      enemies.splice(ei, 1);
      gameOver = true;
      break;
    }
  }

  // 粒子更新
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ========== 渲染 ==========

function drawStarfield() {
  // 静态星空作为背景
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, W, H);

  // 用伪随机固定种子画星星（画布大小固定，直接硬编码几个点）
  const stars = [
    [30,50],[120,80],[200,30],[320,100],[400,60],[80,150],
    [150,200],[280,130],[350,180],[440,140],[60,280],[180,250],
    [300,300],[420,260],[100,350],[220,380],[340,340],[40,420],
    [160,460],[260,430],[380,480],[460,400],[70,530],[200,550],
    [310,520],[430,560],[110,620],[250,650],[370,610],[440,640],
  ];
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (const [sx, sy] of stars) {
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`得分: ${score}`, 10, 24);
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', W / 2, H / 2 - 20);

  ctx.font = '18px sans-serif';
  ctx.fillText(`最终得分: ${score}`, W / 2, H / 2 + 30);
  ctx.fillText('按 R 键重新开始', W / 2, H / 2 + 60);
}

function draw() {
  drawStarfield();

  for (const b of bullets) drawBullet(b);
  for (const e of enemies) drawEnemy(e);
  for (const p of particles) drawParticle(p);
  drawPlayer();
  drawHUD();

  if (gameOver) drawGameOver();
}

// ========== 游戏循环 ==========

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// ========== 重新开始 ==========
window.addEventListener('keydown', e => {
  if (e.code === 'KeyR' && gameOver) {
    resetGame();
  }
});

function resetGame() {
  player.x = W / 2;
  player.y = H - 80;
  bullets.length = 0;
  enemies.length = 0;
  particles.length = 0;
  score = 0;
  bulletCooldown = 0;
  enemyCooldown = 0;
  gameOver = false;
}

// ========== 启动 ==========
loop();
