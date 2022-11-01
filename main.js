const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
let up = document.getElementById("up");
let down = document.getElementById("down");
let left = document.getElementById("left");
let right = document.getElementById("right");
let bg = document.getElementById("bg");
let cage = document.getElementById("cage");
let hut = document.getElementById("hut");
let cage2 = document.getElementById("cageunlocked");
let key = document.getElementById("key");
let fireball = {
  i: document.getElementById("fireball"),
  w: 80,
  h: 50,
};
let background = 1;
let locked = 1;
let gold = 0;
let vx = 0;
let vy = 0;
let xkey = 1680 * Math.random();
let ykey = 850 * Math.random();
let xcage = 450 * Math.random();
let ycage = 450 * Math.random();
let xhut = 450 * Math.random() + 200;
let yhut = 700 * Math.random();
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

c.width = 1880;
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

function reset() {
  xkey = 1680 * Math.random();
  ykey = 850 * Math.random();
  xcage = 450 * Math.random();
  ycage = 450 * Math.random();
  xhut = 450 * Math.random();
  yhut = 450 * Math.random();
}

function checkCollision() {
  if (player.x < -20) {
    player.x = -20;
  } else if (player.x > c.width - 130 && gold > 1) {
    player.x = 0;
    background = 2;
  } else if (player.x > c.width - 130) {
    player.x = c.width - 130;
  }

  if (player.y <= 0) {
    player.y = 0;
  } else if (player.y >= 870) {
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

    if (side1 == closest && background == 1) {
      player.x = xcage - 110;
      money();
    } else if (side2 == closest && background == 1) {
      player.x = xcage + 150;
      money();
    } else if (side3 == closest && background == 1) {
      player.y = ycage - 60;
      money();
    } else if (side4 == closest && background == 1) {
      player.y = ycage + 185;
      money();
    }
  }
}

function checkCollisionHut() {
  if (background == 2) {
    if (
      player.x + 110 > xhut &&
      player.x < xhut + 150 &&
      player.y + 60 > yhutxhut &&
      player.y < yhutxhut + 185
    ) {
      let hutside1 = Math.abs(player.x + 110 - xhut);
      let hutside2 = Math.abs(player.x - (xhut + 150));
      let hutside3 = Math.abs(player.y + 60 - yhut);
      let hutside4 = Math.abs(player.y - (yhut + 185));

      let hutclosest = Math.min(side1, side2, side3, side4);

      if (hutside1 == hutclosest && background == 2) {
        player.x = xhut - 110;
      } else if (hutside2 == hutclosest && background == 2) {
        player.x = xhut + 150;
      } else if (hutside3 == hutclosest && background == 2) {
        player.y = yhut - 60;
      } else if (hutside4 == hutclosest && background == 2) {
        player.y = yhut + 185;
      }
    }
  }
}

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

function loop() {
  ctx.drawImage(bg, 0, 0, c.width, c.height);

  changeSpeed();

  player.x += vx;
  player.y += vy;
  checkCollision();
  checkCollisionkey();
  checkCollisionHut();

  ctx.drawImage(image, player.x, player.y, player.w, player.h);
  if (background == 1) {
    ctx.drawImage(cage, xcage, ycage, 200, 200);
  }
  if (background == 2) {
    ctx.drawImage(hut, xhut, yhut, 200, 200);
  }
  if (locked == 1) {
    ctx.drawImage(key, xkey, ykey, 50, 50);
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
