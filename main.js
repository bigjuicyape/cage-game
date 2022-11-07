const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
let up = document.getElementById("up");
let down = document.getElementById("down");
let left = document.getElementById("left");
let right = document.getElementById("right");
let bg = document.getElementById("bg");
let bg7 = document.getElementById("bg7");
let bg3 = document.getElementById("bg3");
let bg4 = document.getElementById("bg4");
let cage = document.getElementById("cage");
let hut = document.getElementById("hut");
let cage2 = document.getElementById("cageunlocked");
let key = document.getElementById("key");
let gun = document.getElementById("glock");
let crocs = document.getElementById("crocs");
let cageend = document.getElementById("cagetrap");
let levelel = document.getElementById("p2");
let goldimg = document.getElementById("coins");
let bosswalk1 = document.getElementById("bosswalk1");
let bosswalk2 = document.getElementById("bosswalk2");
let bosspunch1 = document.getElementById("bossattack1");
let bosspunch2 = document.getElementById("bossattack2");
let itemhidden = 200;
let bulletspeed = 3;
let bossspawn = 0
let fire = document.getElementById("fireball");
let projectile = {
  i: fire,
  w: 80,
  h: 50,
};
let bossx = -400
let bossy = c.height / 2 - 400 / 2
let goblinalive = 1
let iscrocs = 0
let isitemcollected = 0;
let background = bg;
let level = 1;
let locked = 1;
let gold = 0;
let vx = 0;
let vy = 0;
let xkey = 200 + 500 * Math.random();
let ykey = 600 + 300 * Math.random();
let xcage = 800 * Math.random();
let ycage = 300 * Math.random();
let xhut = 700 * Math.random() + 200;
let yhut = 300 * Math.random();
let image = down;
let bullets = [];
let keydown = {
  w: false,
  a: false,
  s: false,
  d: false,
};
let mouse = {};
let projectileSound = new Audio("12-Gauge-Pump-Action-Shotgun.mp3");
let creak = new Audio("creak.mp3");
let cash = new Audio("cash.mp3");
let approaching = new Audio("approaching boss.mp3");
let approaching2 = new Audio("approaching boss 2.mp3");
let bosssteps = new Audio("boss steps.mp3");
let bossbattle = new Audio("boss battle.mp3");

c.width = 970;
c.height = 970;

let player = {
  x: c.width / 2 - 150 / 2,
  y: c.height / 2 - 100 / 2,
  w: 150,
  h: 100,
  speed: 7,
};

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
c.addEventListener("click", clickHandler);

function keydownHandler(event) {
  keydown[event.key] = true;
}

function keyupHandler(event) {
  keydown[event.key] = false;
}

function clickHandler(event) {
  let rect = c.getBoundingClientRect();

  mouse = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };

  new Bullet();
}
class Bullet {
  constructor() {
    this.x = player.x + (player.w - projectile.w) / 2;
    this.y = player.y + (player.h - projectile.h) / 2;
    this.speed = bulletspeed;

    this.getVelocity();

    bullets.push(this);

    projectileSound.play();
  }

  getVelocity() {
    let dx = mouse.x - this.x - projectile.w / 2;
    let dy = mouse.y - this.y - projectile.h / 2;

    let length = Math.sqrt(dx ** 2 + dy ** 2);

    dx /= length;
    dy /= length;

    const atan2 = (Math.atan2(dy, dx) * 180) / Math.PI;
    this.angle = (atan2 + 360) % 360;

    this.vx = dx * this.speed;
    this.vy = dy * this.speed;
  }

  draw() {
    this.x += this.vx;
    this.y += this.vy;

    ctx.save();
    ctx.translate(this.x + projectile.w / 2, this.y + projectile.h / 2);
    ctx.rotate(this.angle * (Math.PI / 180));
    ctx.drawImage(
      projectile.i,
      -projectile.w / 2,
      -projectile.h / 2,
      projectile.w,
      projectile.h
    );
    ctx.restore();

    if (
      this.x > c.width ||
      this.x + projectile.w < 0 ||
      this.y > c.height ||
      this.y + projectile.h < 0
    ) {
      bullets.splice(bullets.indexOf(this), 1);
    }
  }
}

function changelevel() {
  document.getElementById("p2").innerHTML = `level ${level}`
  // going to the next level
  if (player.x > c.width - 130 && level == 1) {
    player.x = 0;
    level = 2;
  }
  if (player.x >= c.width - 130 && level == 2) {
    player.x = 0;
    background = bg4;
    level = 4
  }
  if (player.x >= c.width - 130 && level == 4 || 
    player.x >= c.width - 130 && level == 5){
    level = level + 1
    player.x = 0;
    background = bg4;
  }
  if (player.y >= 800 && level == 3) {
    player.y = yhut + 101;
    player.x = xhut;
    level = 2;
    background = bg;
    player.w = 150;
    player.h = 100;
    player.speed = player.speed/2;
  }
  if (player.x >= c.width - 130 && level == 6) {
    player.x = 0;
    background = bg7;
    level = 7;
  }
  // going back
  if (level == 2 && player.x <= -19){
    player.x = c.width - 130;
    background = bg
    level = 1
  }
  if (level == 4 && player.x <= -19){
    player.x = c.width - 130;
    background = bg;
    level = 2
  }
  if (level == 5 && player.x <= -19){
    player.x = c.width - 130;
    background = bg4;
    level = 4;
  }
  if (level == 6 && player.x <= -19){
    player.x = c.width - 130;
    background = bg4;
    level = 5;
  }
  if (level == 7 && player.x <= -19){
    player.x = c.width - 130;
    background = bg4;
    level = 6;
  }
}



function checkCollision() {
  if (player.x < -20) {
    player.x = -20;
  } if (player.x > c.width - 130) {
    player.x = c.width - 130;
  }  if (player.y <= 0) {
    player.y = 0;
  } if (player.y >= 870) {
    player.y = 870;
  } 
  if (
    player.x + 110 > xcage &&
    player.x < xcage + 150 &&
    player.y + 60 > ycage &&
    player.y < ycage + 185
  ) {
    let side1 = Math.abs(player.x + 110 - xcage);
    let side2 = Math.abs(player.x - (xcage + 150));
    let side3 = Math.abs(player.y + 60 - ycage);
    let side4 = Math.abs(player.y - (ycage + 185));

    let closest = Math.min(side1, side2, side3, side4);

    if (side1 == closest && level == 1) {
      player.x = xcage - 110;
      money();
    } else if (side2 == closest && level == 1) {
      player.x = xcage + 150;
      money();
    } else if (side3 == closest && level == 1) {
      player.y = ycage - 60;
      money();
    } else if (side4 == closest && level == 1) {
      player.y = ycage + 185;
      money();
    }
  }
}

function checkCollisionHut() {
  if (
    level == 2 &&
    player.x >= xhut - 100 &&
    player.x <= xhut + 100 &&
    player.y >= yhut - 100 &&
    player.y <= yhut + 100
  ) {
    player.x = c.width / 2 - 100
    player.y = 799 
    player.w = 300;
    player.h = 200;
    background = bg3;
    level = 3;
    player.speed = player.speed + player.speed
  }

}
let odds = Math.random();
let goldodds = Math.random();
let price = 0;

function shopitemgenerator() {
  if (odds < 0.5) {
    shopitem = gun;
  } else if (odds >= 0.5) {
    shopitem = goldimg;
  }
  if (goldodds > 0.5) {
    price = 8;
  } else {
    price = 6;
  }
}
let stop = 0;
function checkCollisionitem() {
  if (
    player.x >= 200 - 100 &&
    player.x <= 200 + 100 &&
    player.y >= 200 - 100 &&
    player.y <= 200 + 100 &&
    isitemcollected == 0 &&
    gold >= price
  ) {
    isitemcollected = 1;
    itemhidden = 0;
  }
  if (isitemcollected == 1 && shopitem == goldimg && level == 3 && stop == 0) {
    gold = gold + price;
    cash.play();
    document.getElementById("p").innerHTML = `${gold}$`;
    stop = 1;
  } else if (
    isitemcollected == 1 &&
    shopitem == gun &&
    level == 3 &&
    stop == 0
  ) {
    gold = gold - price;
    projectile.i = document.getElementById("glock");
    bulletspeed = 6
    cash.play();
    document.getElementById("p").innerHTML = `${gold}$`;
    stop = 1;
  }
}

function checkCollisionkey() {
  if (
    player.x >= xkey - 50 &&
    player.x <= xkey + 50 &&
    player.y >= ykey - 50 &&
    player.y <= ykey + 50 &&
    locked == 1 &&
    level == 1
  ) {
    document.getElementById("cage").src = "img/cage.png";
    locked = 0;
    creak.play();
  }
}
looted = 0
function money() {
  if (locked == 0 && looted == 0) {
    document.getElementById("cage").src = "img/cageplundered.png";
    gold = 10;
    cash.play();
    document.getElementById("p").innerHTML = `${gold}$`;
    looted = 1
  }
}

function changeSpeed() {
  if (keydown.a) {
    vx = -player.speed;
    image = left;
  } else if (keydown.d) {
    vx = player.speed;
    image = right;
  } else {
    vx = 0;
  }

  if (keydown.w) {
    vy = -player.speed;
    image = up;
  } else if (keydown.s) {
    vy = player.speed;
    image = down;
  } else {
    vy = 0;
  }

  if ((keydown.a || keydown.d) && (keydown.w || keydown.s)) {
    vx += -Math.sign(vx) * Math.sqrt(2);
    vy += -Math.sign(vy) * Math.sqrt(2);
  }
}

function checkCollisionwall()
{if (player.y <= c.width / 2 -50 && level == 4 || 
player.y <= c.width / 2 -50 && level == 5 || 
player.y <= c.width / 2 -50 && level == 6) 
{
player.y = c.width / 2 - 50;
} if (player.y <= c.width / 2 -50 && level == 5 || 
player.y <= c.width / 2 -50 && level == 6) 
{
player.y = c.width / 2 - 50;
}
}

function checkCollisioncrocs() {
  if (player.x >= c.width / 2 - 100 &&
    player.x <= c.width / 2 + 100 &&
    player.y >= 700 - 100 &&
    player.y <= 700 + 100 &&
    level == 6 && iscrocs == 0){
      player.speed = player.speed + (player.speed / 2)
      crocshidden = 0
      iscrocs = 1
  }
}

crocshidden = 100

let trapped = 0
function cagetrap() {
if (level == 7) {
if (
  trapped == 0 && player.x >= 650 &&
  player.y >= c.height / 2 - 200 && 
  player.y <= c.height / 2 + 100){
trapped = 1
player.x = 750;
player.y = c.height / 2 - 50;
}
if ( trapped == 1) {
player.x = cagex + 30
player.y = cagey + 50
} 
}
}


function phase1(){
  bossspawn = 1
  bossx = bossx + 1;
  phase = 1
  bosssteps.play();
  shake = Math.random() * -40
  shake = Math.random() * 40
  player.x = player.x + shake
  player.y = player.y + shake
}

function halfphase(){
  phase = 2/4
  approaching2.play();
  bossbattle.play();
  shake = Math.random() * -20
  shake = Math.random() * 20
  player.x = player.x + shake
  player.y = player.y + shake
  setTimeout(phase1, 5000)
  }
  
function quarterphase(){
phase = 1/4
approaching.play();
shake = Math.random() * -10
shake = Math.random() * 10
player.x = player.x + shake
player.y = player.y + shake
setTimeout(halfphase, 5000)
}

let cagex = 750
let cagey = c.height / 2 - 100
let shake = 0
let phase = 0
function loop() {
  cagex = 750 + shake
  cagey = c.height / 2 - 100 + shake
  if (trapped == 1 && phase == 0){
    player.x = player.x + shake
    player.y = player.y + shake
    shake = Math.random() * -3
    shake = Math.random() * 3
    setTimeout(quarterphase, 5000)
    }
  ctx.drawImage(background, shake, shake, c.width, c.height);
  changeSpeed();
  player.x += vx + shake;
  player.y += vy + shake;
  changelevel()
  checkCollision();
  checkCollisionwall();
  checkCollisionkey();
  checkCollisionHut();
  checkCollisioncrocs();
  cagetrap();
  if (level == 3) {
    shopitemgenerator();
    ctx.drawImage(shopitem, 200, 200, itemhidden, 200);
    checkCollisionitem();
  }
  if (bossspawn == 1){
    ctx.drawImage(bosswalk1, bossx, bossy, 500, 500);
  }
  ctx.drawImage(image, player.x, player.y, player.w, player.h);
  if (level == 1) {
    ctx.drawImage(cage, xcage, ycage, 200, 200);
  }
  if (level == 2) {
    ctx.drawImage(hut, xhut, yhut, 100, 100);
  }
  if (locked == 1 && level == 1) {
    ctx.drawImage(key, xkey, ykey, 100, 100);
  } if (level == 6) {
    ctx.drawImage(crocs, c.width / 2 - 50, 700, 100, crocshidden);
  } if (level == 7) {
    ctx.drawImage(cageend, cagex, cagey, 200, 200);
  }
  bullets.forEach((bullet) => {
    bullet.draw();
  });

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// 119 = w
// 97 = a
// 100 = d
// 115 = s
