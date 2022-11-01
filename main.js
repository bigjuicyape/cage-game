const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
let up = document.getElementById("up");
let down = document.getElementById("down");
let left = document.getElementById("left");
let right = document.getElementById("right");
let bg = document.getElementById("bg");
let cage = document.getElementById("cage");
let fireball = {
  i: document.getElementById("fireball"),
  w: 80,
  h: 50,
};
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
let fireballSound = new Audio("12-Gauge-Pump-Action-Shotgun (2).mp3");

c.width = 600;
c.height = 600;

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

function reset() {
  xcage = 450 * Math.random();
  ycage = 450 * Math.random();
}

function checkCollision() {
  if (player.x < -20) {
    player.x = -20;
  } else if (player.x > c.width - 130) {
    player.x = c.width - 130;
  }

  if (player.y < 0) {
    player.y = 0;
  } else if (player.y > c.height - 90) {
    player.y = c.width - 90;
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

function loop() {
  ctx.drawImage(bg, 0, 0, c.width, c.height);

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

// 119 = w
// 97 = a
// 100 = d
// 115 = s
