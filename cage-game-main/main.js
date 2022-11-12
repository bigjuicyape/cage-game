const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
let up = document.getElementById("up");
let down = document.getElementById("down");
let left = document.getElementById("left");
let right = document.getElementById("right");
let bg = document.getElementById("bg");
let bg3 = document.getElementById("bg3");
let bg4 = document.getElementById("bg4");
let imgcage = document.getElementById("cage");
let spritesheet = document.getElementById("spritesheetboss");
let spritesheet2 = document.getElementById("spritesheetboss2");

c.width = 970;
c.height = 970;

let creak = new Audio("creak.mp3");
let cash = new Audio("cash.mp3");
let timer = 1;
let background = bg;
let collisionObjects = [];
let drawObjects = [];
let mouse = {};
let frameCount = 0;

let keydown = {
  w: false,
  a: false,
  s: false,
  d: false,
};

let player = {
  x: c.width / 2 - 150 / 2,
  y: c.height / 2 - 100 / 2,
  w: 90,
  h: 70,
  i: down,
  vx: 0,
  vy: 0,
  type: "player",
  draw: function () {
    this.changeVelocity();
    this.x += this.vx;
    this.y += this.vy;

    checkCollision(this);

    ctx.drawImage(this.i, this.x - this.w * 0.15, this.y - this.h * 0.15, this.w * 1.3, this.h * 1.3);
  },
  changeVelocity: function () {
    if (keydown.a) {
      this.vx = -4;
      this.i = left;
    } else if (keydown.d) {
      this.vx = 4;
      this.i = right;
    } else {
      this.vx = 0;
    }

    if (keydown.w) {
      this.vy = -4;
      this.i = up;
    } else if (keydown.s) {
      this.vy = 4;
      this.i = down;
    } else {
      this.vy = 0;
    }

    if ((keydown.a || keydown.d) && (keydown.w || keydown.s)) {
      this.vx += -Math.sign(this.vx) * Math.sqrt(2);
      this.vy += -Math.sign(this.vy) * Math.sqrt(2);
    }
  },
};

let cage = {
  x: 450 * Math.random(),
  y: 450 * Math.random(),
  w: 100,
  h: 100,
  i: imgcage,
  type: "cage",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

let fireball = {
  i: document.getElementById("fireball"),
  sound: new Audio("12-Gauge-Pump-Action-Shotgun.mp3"),
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

  new Fireball();
}

class Fireball {
  constructor() {
    this.w = 80;
    this.h = 50;
    this.x = player.x + (player.w - this.w) / 2;
    this.y = player.y + (player.h - this.h) / 2;
    this.speed = 5;
    this.type = "fireball";

    this.getVelocity();

    drawObjects.push(this);

    fireball.sound.play();
  }

  getVelocity() {
    let dx = mouse.x - this.x - this.w / 2;
    let dy = mouse.y - this.y - this.h / 2;

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

    checkCollision(this);

    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.rotate(this.angle * (Math.PI / 180));
    ctx.drawImage(fireball.i, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();

    if (this.x > c.width || this.x + this.w < 0 || this.y > c.height || this.y + this.h < 0) {
      drawObjects.splice(drawObjects.indexOf(this), 1);
    }
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 60;
    this.speed = 1.5;
    this.type = "enemy";

    collisionObjects.push(this);
    drawObjects.push(this);
  }

  move() {
    let run = player.x + player.w / 2 - this.w / 2 - this.x;
    let rise = player.y + player.h / 2 - this.h / 2 - this.y;
    let angle = Math.atan2(rise, run);

    if (rise) this.y += this.speed * Math.sin(angle);
    if (run) this.x += this.speed * Math.cos(angle);
  }

  draw() {
    checkCollision(this);

    this.move();
    if (this.y >= player.y + 50) {
      ctx.drawImage(spritesheet, Math.floor(((8 / 80) * frameCount) % 8) * 164, 164, 164, 164, this.x, this.y, this.w, this.h);
    } else if (this.y <= player.y - 50) {
      ctx.drawImage(spritesheet, Math.floor(((8 / 80) * frameCount) % 8) * 164, 0, 164, 164, this.x, this.y, this.w, this.h);
    } else {
      if (this.x >= player.x) {
        ctx.drawImage(spritesheet, Math.floor(((8 / 80) * frameCount) % 8) * 164, 492, 164, 164, this.x, this.y, this.w, this.h);
      } else {
        ctx.drawImage(spritesheet, Math.floor(((8 / 80) * frameCount) % 8) * 164, 328, 164, 164, this.x, this.y, this.w, this.h);
      }
    }
  }
}

function checkCollision(thisObject) {
  if (thisObject.type != "fireball") {
    if (thisObject.x < 0) {
      thisObject.x = 0;
    }
    if (thisObject.x > c.width - thisObject.w) {
      thisObject.x = c.width - thisObject.w;
    }
    if (thisObject.y < 0) {
      thisObject.y = 0;
    }
    if (thisObject.y > c.height - thisObject.h) {
      thisObject.y = c.height - thisObject.h;
    }
  }

  for (let i = 0; i < collisionObjects.length; i++) {
    const colObj = collisionObjects[i];

    if (colObj == thisObject) continue;

    if (
      thisObject.x + thisObject.w > colObj.x &&
      thisObject.x < colObj.x + colObj.w &&
      thisObject.y + thisObject.h > colObj.y &&
      thisObject.y < colObj.y + colObj.h
    ) {
      if (colObj.type == "enemy" && thisObject.type == "player") continue;
      if (thisObject.type == "fireball") {
        drawObjects.splice(drawObjects.indexOf(thisObject), 1);
      }

      let side1 = Math.abs(thisObject.x + thisObject.w - colObj.x);
      let side2 = Math.abs(thisObject.x - (colObj.x + colObj.w));
      let side3 = Math.abs(thisObject.y + thisObject.h - colObj.y);
      let side4 = Math.abs(thisObject.y - (colObj.y + colObj.h));

      let closest = Math.min(side1, side2, side3, side4);
      if (side1 == closest) {
        thisObject.x = colObj.x - thisObject.w;
      } else if (side2 == closest) {
        thisObject.x = colObj.x + colObj.w;
      } else if (side3 == closest) {
        thisObject.y = colObj.y - thisObject.h;
      } else if (side4 == closest) {
        thisObject.y = colObj.y + colObj.h;
      }
    }
  }
}

for (let i = 0; i < 3; i++) {
  new Enemy(0, Math.random() * c.height);
}

drawObjects.push(player);
collisionObjects.push(cage);
drawObjects.push(cage);

function loop() {
  ctx.drawImage(background, 0, 0, c.width, c.height);
  frameCount++;

  drawObjects.forEach((object) => {
    object.draw();
  });

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
