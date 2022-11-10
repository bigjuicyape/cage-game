const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
let up = document.getElementById("up");
let down = document.getElementById("down");
let left = document.getElementById("left");
let right = document.getElementById("right");
let bg = document.getElementById("bg");
let bg3 = document.getElementById("bg3");
let bg4 = document.getElementById("bg4");
let cage = document.getElementById("cage");
let spritesheet = document.getElementById("spritesheetboss");
var ex = 200
var ey = 500
var timer = 1
var walker = 300;
let fireball = {
  i: document.getElementById("fireball"),
  w: 80,
  h: 50,
};
let background = bg;
let vx = 0;
let vy = 0;
let xcage = 450 * Math.random();
let ycage = 450 * Math.random();
let image = down;
let bullets = [];
let keydown = {
  w: false,
  a: false,
  s: false,
  d: false,
};
let mouse = {};
let fireballSound = new Audio("12-Gauge-Pump-Action-Shotgun.mp3");
let creak = new Audio("creak.mp3");
let cash = new Audio("cash.mp3");

c.width = 970;
c.height = 970;

let player = {
  x: c.width / 2 - 150 / 2,
  y: c.height / 2 - 100 / 2,
  w: 150,
  h: 100,
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
    this.x = player.x + (player.w - fireball.w) / 2;
    this.y = player.y + (player.h - fireball.h) / 2;
    this.speed = 5;

    this.getVelocity();

    bullets.push(this);

    fireballSound.play();
  }

  getVelocity() {
    let dx = mouse.x - this.x - fireball.w / 2;
    let dy = mouse.y - this.y - fireball.h / 2;

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
    ctx.translate(this.x + fireball.w / 2, this.y + fireball.h / 2);
    ctx.rotate(this.angle * (Math.PI / 180));
    ctx.drawImage(
      fireball.i,
      -fireball.w / 2,
      -fireball.h / 2,
      fireball.w,
      fireball.h
    );
    ctx.restore();

    if (
      this.x > c.width ||
      this.x + fireball.w < 0 ||
      this.y > c.height ||
      this.y + fireball.h < 0
    ) {
      bullets.splice(bullets.indexOf(this), 1);
    }
  }
}


function checkCollision() {
  if (player.x < -20) {
    player.x = -20;
  } 
  if (player.x > c.width - 130) {
    player.x = c.width - 130;
  }
  if (player.y <= 0) {
    player.y = 0;
  }
  if (player.y >= 870) {
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

    if (side1 == closest) {
      player.x = xcage - 110;
    } else if (side2 == closest) {
      player.x = xcage + 150;
    } else if (side3 == closest) {
      player.y = ycage - 60;
    } else if (side4 == closest) {
      player.y = ycage + 185;
    }
  }
  // let enemyside1 = Math.abs(player.x + 110 - ex);
  // let enemyside2 = Math.abs(player.x - (ex + 150));
  // let enemyside3 = Math.abs(player.y + 60 - ey);
  // let enemyside4 = Math.abs(player.y - (ey + 185));

  // let closest = Math.min(enemyside1, enemyside2, enemyside3, enemyside4);

  // if (enemyside1 == closest) {
  //   player.x = ex - 110;
  // } else if (enemyside2 == closest) {
  //   player.x = ex + 150;
  // } else if (enemyside3 == closest) {
  //   player.y = ey - 60;
  // } else if (enemyside4 == closest) {
  //   player.y = ey + 110;
  // }
}

function checkCollisionHut() {
  if (level == 2 &&
    player.x >= xhut - 100 &&
    player.x <= xhut + 100 &&
    player.y >= yhut - 100 &&
    player.y <= yhut + 100 ) {      
    player.x = c.width / 2 - 150 / 2,
    player.y = 700
    player.w = 200
    player.h = 133
    background = bg3
    level = 3
  }}



function checkCollisionkey() {
  if (
    player.x >= xkey - 50 &&
    player.x <= xkey + 50 &&
    player.y >= ykey - 50 &&
    player.y <= ykey + 50 &&
    locked == 1
  ) {
    document.getElementById("cage").src = "img/cage.png";
    locked = 0;
    creak.play();
  }
}
function money() {
  if (locked == 0) {
    document.getElementById("cage").src = "img/cageplundered.png";
    gold = 10;
    cash.play();
  }
}

function changeSpeed() {
  if (keydown.a) {
    vx = -4;
    image = left;
  } else if (keydown.d) {
    vx = 4;
    image = right;
  } else {
    vx = 0;
  }

  if (keydown.w) {
    vy = -4;
    image = up;
  } else if (keydown.s) {
    vy = 4;
    image = down;
  } else {
    vy = 0;
  }

  if ((keydown.a || keydown.d) && (keydown.w || keydown.s)) {
    vx += -Math.sign(vx) * Math.sqrt(2);
    vy += -Math.sign(vy) * Math.sqrt(2);
  }
}


  ctx.drawImage(spritesheet, 0, 0, 60, 95, (ex), 0, 60, 145);

let framecount = 0;
let direction = 1;

function collisionenemy(){
  if (ex <= 6) {
  ex = 10
  }
  if (ex >= c.width - 63){
    ex = c.width - 63
  }
  if (ey <= 6) {
    ey = 6
    }
    if (ey >= c.height - 90){
      ey = c.height - 90
    }
    let playerside1 = Math.abs(ex + 60 - player.x);
    let playerside2 = Math.abs(ex - (player.x + 120));
    let playerside3 = Math.abs(ey + 50 - player.y);
    let playerside4 = Math.abs(ey - (player.y + 80));

    let closest = Math.min(playerside1, playerside2, playerside3, playerside4);

    if (playerside1 == closest) {
      ex = player.x - 60;
    } else if (playerside2 == closest) {
      ex = player.x + 120;
    } else if (playerside3 == closest) {
      ey = player.y - 50;
    } else if (playerside4 == closest) {
      ey = player.y + 80;
    }
  }


function loop() {
  ctx.drawImage(background, 0, 0, c.width, c.height)
  collisionenemy()
  framecount++;
  if ((player.x >= ex || player.x <= ex) && (player.y >= ey || player.y <= ey)) {
    ex += -Math.sign(ex) * Math.sqrt(2);
    ey += -Math.sign(ey) * Math.sqrt(2);
  } else if (player.x <= ex){
    ex = ex + 1;
  }
  if (player.x >= ex){
    ex = ex - 1;
  }
  if (player.y <= ey){
    ey = ey + 1;
  }
  if (player.y >= ey){
    ey = ey - 1;
  }
  
  if ((player.x <= ex || player.x >= ex) && (player.y <= ey || player.y >= ey)) {
    ex += -Math.sign(ex) * Math.sqrt(2);
    ey += -Math.sign(ey) * Math.sqrt(2);
  }

  ctx.drawImage(spritesheet, Math.floor(2/16 * framecount % 2) * 63, 0, 62, 90, ex, ey, 62, 64);
  changeSpeed();
  player.x += vx;
  player.y += vy;
  checkCollision();

  ctx.drawImage(image, player.x, player.y, player.w, player.h);
    ctx.drawImage(cage, xcage, ycage, 200, 200);
  bullets.forEach((bullet) => {
    bullet.draw();
  });

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);



