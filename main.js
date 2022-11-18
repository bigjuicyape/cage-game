const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight - 5;

const up = document.getElementById("up");
const down = document.getElementById("down");
const left = document.getElementById("left");
const right = document.getElementById("right");
const bg = document.getElementById("bg");
const imgkey = document.getElementById("imgkey");
const slideImg = document.getElementById("slide");
const shop = document.getElementById("bg3");
const bg4 = document.getElementById("bg4");
const life = document.getElementById("alivelife");
const lifeDead = document.getElementById("deadlife");
const hole1 = document.getElementById("hole1");
const hole2 = document.getElementById("hole2");
const imggun = document.getElementById("glock");
const imgshoes = document.getElementById("shoe");
const imghut = document.getElementById("hut");
const deadplayer = document.getElementById("deadplayer");
const imgcage = document.getElementById("cage");
const spritesheet = document.getElementById("spritesheetboss");
const imgbullet = document.getElementById("bulletsprite");
const spritesheet2 = document.getElementById("spritesheetboss2");
const imgcoins = document.getElementById("coins");
const imgcoin = document.getElementById("coin");
const deadboy = document.getElementById("deadenemy");
const imgtikitrophy = document.getElementById("tiki");
let fireballImg = document.getElementById("fireball");
const creak = new Audio("creak.mp3");
const cash = new Audio("cash.mp3");
const getscoin = new Audio("gets coins.mp3");
const getshurt2 = new Audio("gets hurt 2.mp3");
const getshurt = new Audio("gets hurt.mp3");
const nextlevelsound = new Audio("goes to next level.mp3");
const punchsound = new Audio("punches.mp3");
const tikisound = new Audio("tikitotem spawn in.mp3");

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
c.addEventListener("mousedown", mousedownHandler);
c.addEventListener("mouseup", mouseupHandler);
c.addEventListener("mousemove", mousemoveHandler);

function keydownHandler(event) {
  input[event.key] = true;
}

function keyupHandler(event) {
  input[event.key] = false;
}

function mousedownHandler(event) {
  mouse.down = true;
}

function mouseupHandler(event) {
  mouse.down = false;
}

function mousemoveHandler(event) {
  let rect = c.getBoundingClientRect();

  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
}

let timer = 1;
let sizemultiplier = 1;
let money = 100;
let goblinspeed = 1.4;
let level = 1;
let background = bg;
let collisionObjects = [];
let drawObjects = [];
let mouse = {};
let frameCount = 0;
let input = {};
let enemies = [];

let player = {
  x: 100,
  y: c.height / 2 - 100 / 2 + 50,
  w: 90,
  h: 70,
  i: down,
  speed: 3,
  alpha: 1,
  vx: 0,
  vy: 0,
  cooldown: 0,
  invincibility: 0,
  hp: 3,
  type: "player",
  area: "start",
  center: {},
  projectileSpeed: 3,

  draw: function () {
    this.x += this.vx;
    this.y += this.vy;
    this.invincibility--;
    this.cooldown--;

    this.blink();
    this.changeVelocity();
    checkBoundaries(this);
    checkCollision(this);
    this.shoot();

    this.center = { x: this.x + this.w / 2, y: this.y + this.h / 2 };

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.i, this.x - this.w * 0.15, this.y - this.h * 0.15, this.w * 1.3, this.h * 1.3);
    ctx.globalAlpha = 1;
  },

  changeVelocity: function () {
    if (input.a) {
      this.vx = -player.speed;
      this.i = left;
    } else if (input.d) {
      this.vx = player.speed;
      this.i = right;
    } else {
      this.vx = 0;
    }

    if (input.w) {
      this.vy = -player.speed;
      this.i = up;
    } else if (input.s) {
      this.vy = player.speed;
      this.i = down;
    } else {
      this.vy = 0;
    }

    if ((input.a || input.d) && (input.w || input.s)) {
      const speed = Math.sqrt(this.speed ** 2 / 2);

      this.vx = Math.sign(this.vx) * speed;
      this.vy = Math.sign(this.vy) * speed;
    }
  },

  blink: function () {
    if (this.invincibility == 0) {
      return (this.alpha = 1);
    } else if (this.invincibility > 0) {
      this.alpha = Math.abs(Math.sin(1.01 ** (340 - this.invincibility) / 1.01));
    }
  },

  shoot: function () {
    if (player.cooldown <= 0 && mouse.down) {
      player.cooldown = 250;
      new Projectile();
    }
  },
};

let cage = {
  x: c.width / 2 + 450 * Math.random(),
  y: 450 * Math.random(),
  w: 100,
  h: 100,
  i: imgcage,
  type: "cage",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

let tikitrophy = {
  x: c.width / 2 - 150,
  y: 290,
  w: 100,
  h: 100,
  i: imgtikitrophy,
  type: "tikitrophy",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};
let gunItem = {
  x: c.width / 2,
  y: 290,
  w: 100,
  h: 100,
  i: imggun,
  type: "gun",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};
let shoes = {
  x: c.width / 2 + 150,
  y: 290,
  w: 100,
  h: 100,
  i: imgshoes,
  type: "shoes",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

// let key = {
//   x: c.width / 2 - 150,
//   y: 290,
//   w: 100,
//   h: 100,
//   i: imgkey,
//   type: "key",
//   draw: function () {
//     ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
//   },
// };

let hut = {
  x: 700,
  y: 300,
  w: 200,
  h: 225,
  i: imghut,
  type: "hut",
  draw: function () {
    ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
  },
};

class Projectile {
  constructor() {
    this.w = 80 * sizemultiplier;
    this.h = 50 * sizemultiplier;
    this.x = player.x + (player.w - this.w) / 2;
    this.y = player.y + (player.h - this.h) / 2;
    this.speed = player.projectileSpeed;
    this.type = "projectile";

    this.getVelocity();

    drawObjects.push(this);

    new Audio("12-Gauge-Pump-Action-Shotgun.mp3").play();
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
    ctx.drawImage(fireballImg, getAnimX(3, 15, 250), 0, 250, 164, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();

    if (this.x > c.width || this.x + this.w < 0 || this.y > c.height || this.y + this.h < 0) {
      removeFromArray(this, drawObjects);
    }
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 60;
    this.dead = false;
    this.speed = goblinspeed;
    this.type = "enemy";
    this.area = "start";
    this.target = player;

    collisionObjects.push(this);
    drawObjects.push(this);
    enemies.push(this);
  }

  move() {
    const target = this.target.center || this.target;

    let run = target.x - this.w / 2 - this.x;
    let rise = target.y - this.h / 2 - this.y;
    let angle = Math.atan2(rise, run);

    if (rise) this.y += this.speed * Math.sin(angle);
    if (run) this.x += this.speed * Math.cos(angle);
  }

  draw() {
    if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);

    if (this.y >= player.y + 50) {
      ctx.drawImage(spritesheet, getAnimX(8, 80, 164), 164, 164, 164, this.x, this.y, this.w, this.h);
    } else if (this.y <= player.y - 50) {
      ctx.drawImage(spritesheet, getAnimX(8, 80, 164), 0, 164, 164, this.x, this.y, this.w, this.h);
    } else {
      if (this.x >= player.x) {
        ctx.drawImage(spritesheet, getAnimX(8, 80, 164), 492, 164, 164, this.x, this.y, this.w, this.h);
      } else {
        ctx.drawImage(spritesheet, getAnimX(8, 80, 164), 328, 164, 164, this.x, this.y, this.w, this.h);
      }
    }
  }
}

function checkBoundaries(thisObject) {
  if (thisObject.area == "start" && (thisObject.type == "player" || player.area == "hut")) {
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

    const hutBoundary = { x: hut.x + 100, y: hut.y + hut.h, h: 1, w: hut.w - 200 };
    if (checkIfInside(thisObject, hutBoundary)) {
      enterHut(thisObject);
    }
  }
  if (thisObject.area == "hut" && (thisObject.type == "player" || player.area == "start")) {
    if (thisObject.x < c.width / 3.8) {
      thisObject.x = c.width / 3.8;
    }
    if (thisObject.x > c.width / 1.44) {
      thisObject.x = c.width / 1.44;
    }
    if (thisObject.y < c.height / 2.8) {
      thisObject.y = c.height / 2.8;
    }
    if (thisObject.y > c.height - thisObject.h - 30 && (thisObject.x > c.width / 1.9 || thisObject.x < c.width / 2.4)) {
      thisObject.y = c.height - thisObject.h - 30;
    } else if (thisObject.y > c.height - thisObject.h) {
      leaveHut(thisObject);
    }
  }
}

function checkCollision(thisObject) {
  for (let i = 0; i < collisionObjects.length; i++) {
    const colObj = collisionObjects[i];

    if (colObj == thisObject || (thisObject.type == "enemy" && colObj.type == "slide")) continue;

    if (checkIfInside(thisObject, colObj)) {
      if (colObj.type == "enemy" && thisObject.type == "player") {
        if (colObj.area == player.area) {
          if (player.invincibility <= 0) {
            punchsound.play();
            player.hp--;
            player.invincibility = 100;
          }
          continue;
        } else {
          continue;
        }
      }

      if (thisObject.type == "projectile") {
        if (colObj.type == "enemy") {
          colObj.dead = true;
          removeFromArray(colObj, collisionObjects);

          const sounds = [new Audio("gets hurt.mp3"), new Audio("gets hurt 2.mp3")];
          const randomSound = sounds[getRandInt(0, 1)];
          money += 1;
          randomSound.play();
        }

        if (colObj.type == "tikitrophy" && money >= 100) {
          colObj.dead = true;
          money -= 100;
          tikisound.play();
          player.hp = 3;
        }
        if (colObj.type == "shoes" && money >= 100) {
          colObj.dead = true;
          removeFromArray(colObj, collisionObjects);
          money -= 100;
          getscoin.play();
          player.speed++;
          shoes.w = 0;
        }
        if (colObj.type == "gun" && money >= 100) {
          colObj.dead = true;
          removeFromArray(colObj, collisionObjects);
          money -= 100;
          getscoin.play();
          fireballImg = imgbullet;
          player.projectileSpeed += 20;
          gunItem.w = 0;
        }
        console.log(colObj.type);

        removeFromArray(thisObject, drawObjects);
        return;
      }

      goToClosest(thisObject, colObj);
    }
  }
}

function checkIfInside(thisObject, colObj) {
  const greaterThanLeft = thisObject.x + thisObject.w > colObj.x ? true : false;
  const lessThanRight = thisObject.x < colObj.x + colObj.w ? true : false;
  const greaterThanTop = thisObject.y + thisObject.h > colObj.y ? true : false;
  const lessThanBottom = thisObject.y < colObj.y + colObj.h ? true : false;

  return greaterThanLeft && lessThanRight && greaterThanTop && lessThanBottom;
}

function goToClosest(thisObject, colObj) {
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

function enterHut(thisObject) {
  thisObject.y = c.height - thisObject.h;
  thisObject.x = c.width / 2 - thisObject.w / 2;
  thisObject.y = thisObject.y - thisObject.h;
  thisObject.speed = thisObject.speed * 2;
  thisObject.w = thisObject.w + thisObject.w;
  thisObject.h = thisObject.h + thisObject.h;
  thisObject.area = "hut";

  if (thisObject.type == "player") {
    drawObjects = [player, gunItem, tikitrophy, shoes, ...enemies.filter((e) => e.area == player.area)];
    collisionObjects = [shoes, gunItem, tikitrophy, ...enemies.filter((e) => e.area == player.area)];
    player.projectileSpeed = player.projectileSpeed * 2;
    background = shop;
    sizemultiplier = 2;
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].target = getNewTarget(enemies[i].area);
    }
  } else if (thisObject.area == player.area) {
    thisObject.target = getNewTarget(thisObject.area);
    drawObjects.push(thisObject);
    collisionObjects.push(thisObject);
  }
}

function leaveHut(thisObject) {
  thisObject.y = hut.y + hut.h;
  thisObject.x = hut.x + hut.w / 2 - thisObject.w / 4;
  thisObject.area = "start";

  thisObject.speed = thisObject.speed / 2;
  thisObject.w = thisObject.w / 2;
  thisObject.h = thisObject.h / 2;

  if (thisObject.type == "player") {
    drawObjects = [hut, cage, ...enemies.filter((e) => e.area == player.area), player];
    collisionObjects = [hut, cage, ...enemies.filter((e) => e.area == player.area && !e.dead)];
    background = bg;
    sizemultiplier = 1;
    player.projectileSpeed = player.projectileSpeed / 2;
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].target = getNewTarget(enemies[i].area);
    }
  } else if (thisObject.area == player.area) {
    thisObject.target = getNewTarget(thisObject.area);
    drawObjects.push(thisObject);
    collisionObjects.push(thisObject);
  }
}

function getNewTarget(area) {
  if (area == player.area) {
    return player;
  } else if (area == "hut" && player.area == "start") {
    return { x: c.width / 2, y: c.height + 1 };
  } else if (area == "start" && player.area == "hut") {
    return { x: hut.x + hut.w / 2, y: hut.y + hut.h };
  }
}

function getAnimX(rowNum, frameSpeed, frameSize) {
  return Math.floor(((rowNum / frameSpeed) * frameCount) % rowNum) * frameSize;
}

function removeFromArray(element, array) {
  array.splice(array.indexOf(element), 1);
}

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function adadaLife() {
  ctx.drawImage(imgcoin, 300, 0, 100, 100);
  if (player.hp == 3) {
    ctx.drawImage(life, 0, 0, 100, 100);
    ctx.drawImage(life, 100, 0, 100, 100);
    ctx.drawImage(life, 200, 0, 100, 100);
  } else if (player.hp == 2) {
    ctx.drawImage(life, 0, 0, 100, 100);
    ctx.drawImage(life, 100, 0, 100, 100);
    ctx.drawImage(lifeDead, 200, 0, 100, 100);
  } else if (player.hp == 1) {
    ctx.drawImage(life, 0, 0, 100, 100);
    ctx.drawImage(lifeDead, 100, 0, 100, 100);
    ctx.drawImage(lifeDead, 200, 0, 100, 100);
  } else if (player.hp == 0) {
    ctx.drawImage(lifeDead, 0, 0, 100, 100);
    ctx.drawImage(lifeDead, 100, 0, 100, 100);
    ctx.drawImage(lifeDead, 200, 0, 100, 100);

    const fatality = [hole1, hole2, deadplayer];
    const randomDeath = fatality[getRandInt(0, 2)];

    const w = 260;
    const h = 260;
    let deadPlayer = {
      x: player.x - w / 2,
      y: player.y - h / 2,
      w: w,
      h: h,
      i: randomDeath,
      draw: function () {
        ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
      },
    };

    drawObjects.push(deadPlayer);
    removeFromArray(player, drawObjects);
    removeFromArray(player, collisionObjects);

    player.hp--;
  }
}

setInterval(spawnEnemy, 3000);
function spawnEnemy() {
  if (background == bg) {
    new Enemy(cage.x, cage.y + cage.h / 2);
  }
  if (money >= 100) {
    goblinspeed = 1.9;
  }
}

setInterval(moreenemy, 5000);
function moreenemy() {
  if (background == bg && money >= 10) {
    new Enemy(cage.x, cage.y + cage.h / 2);
  }
}

setInterval(moremoreenemy, 5000);
function moremoreenemy() {
  if (background == bg && money >= 40) {
    new Enemy(cage.x, cage.y + cage.h / 2);
  }
}

setInterval(enemyHorde, 17000);
function enemyHorde() {
  if (background == bg && money >= 75) {
    new Enemy(cage.x, cage.y + cage.h / 2);
    new Enemy(cage.x, cage.y + cage.h / 2);
  }
}

function setup() {
  // new Enemy(0, 100, 230);
  // new Enemy(0, c.height / 2 - 100, 230);
  // new Enemy(0, c.height - 300, 230);
  new Enemy(cage.x, cage.y + cage.h / 2);
  drawObjects.push(player);
  drawObjects.push(cage);
  drawObjects.push(hut);

  collisionObjects.push(cage);
  collisionObjects.push(slide);
  collisionObjects.push(hut);
}

function loop() {
  c.width = window.innerWidth;
  c.height = window.innerHeight - 5;

  ctx.drawImage(background, 0, 0, c.width, c.height);
  frameCount++;

  adadaLife();

  drawObjects.forEach((object) => {
    object.draw();
  });

  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].dead) continue;

    enemies[i].move();
    checkBoundaries(enemies[i]);
    checkCollision(enemies[i]);
  }

  ctx.font = "48px serif";
  ctx.fillStyle = "white";
  ctx.fillText(money, 300, 100);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

setup();
