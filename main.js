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
const imgmerchant = document.getElementById("merchant");
const spritesheet = document.getElementById("spritesheetboss");
const imgbullet = document.getElementById("bulletsprite");
const spritesheet2 = document.getElementById("spritesheetboss2");
const imgcoins = document.getElementById("coins");
const imgcoin = document.getElementById("coin");
const deadboy = document.getElementById("deadenemy");
const imgtikitrophy = document.getElementById("tiki");
const dart = document.getElementById("dart");
const barb = document.getElementById("barb");

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
let goblinspeed = 2.4;
let level = 1;
let background = bg;
let collisionObjects = [];
let drawObjects = [];
let mouse = {};
let frameCount = 0;
let input = {};
let enemies = [];
let boxes = [];
let areas = {};
let frameRate;

let animLoop = { maxFps: 80 };

let player = {
  x: 100,
  y: c.height / 2 - 100 / 2 + 50,
  w: 90,
  h: 70,
  i: down,
  speed: 4,
  alpha: 1,
  vx: 0,
  vy: 0,
  cooldown: 0,
  invincibility: 0,
  hp: 3,
  type: "player",
  area: "start",
  center: {},
  projectileSpeed: 5,
  reload: 150,
  vScale: 1,
  draw: function () {
    this.invincibility--;
    this.cooldown--;

    this.blink();
    this.shoot();

    this.center = { x: this.x + this.w / 2, y: this.y + this.h / 2 };

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.i, this.x, this.y, 0, this.h);
    ctx.globalAlpha = 1;

    // ctx.rotate(atan2);
    Math.abs(atan2) > Math.PI / 2 ? (this.vScale = -1) : (this.vScale = 1);
    ctx.scale(1, 1);
    ctx.drawImage(imggun, player.x, player.y, player.weaponFlip * 32, 11);
  },

  move: function () {
    if (input.a) {
      ctx.drawImage(dart, getAnimX(8, 5, 129), 1974, 125, 125, this.x - 14, this.y, this.w, this.h);
      this.vx = -player.speed;
      this.i = left;
    } else if (input.d) {
      ctx.drawImage(dart, getAnimX(8, 5, 129), 564, 125, 125, this.x + 9, this.y, this.w, this.h);
      this.vx = player.speed;
      this.i = right;
    } else {
      this.vx = 0;
      ctx.drawImage(dart, 0, 0, 125, 125, this.x + 3, this.y, this.w, this.h);
    }

    if (input.w) {
      this.vy = -player.speed;
      this.i = up;
      ctx.drawImage(dart, getAnimX(8, 5, 129), 1128, 125, 125, this.x + 1, this.y, this.w, this.h);
    } else if (input.s) {
      this.vy = player.speed;
      this.i = down;
      ctx.drawImage(dart, getAnimX(8, 5, 129), 0, 125, 125, this.x + 4, this.y + 9, this.w, this.h);
    } else {
      this.vy = 0;
      ctx.drawImage(dart, 0, 0, 125, 125, this.x + 3, this.y, this.w, this.h);
    }

    if ((input.a || input.d) && (input.w || input.s)) {
      const speed = Math.sqrt(this.speed ** 2 / 2);

      this.vx = Math.sign(this.vx) * speed;
      this.vy = Math.sign(this.vy) * speed;
    }

    this.x += this.vx;
    this.y += this.vy;
  },

  blink: function () {
    if (this.invincibility == 0) {
      return (this.alpha = 1);
    } else if (this.invincibility > 0) {
      this.alpha = Math.abs(Math.sin(1.01 ** (340 - this.invincibility) / 1.01));
    }
  },

  shoot: function () {
    if (this.cooldown <= 0 && mouse.down) {
      this.cooldown = this.reload;
      new Projectile();
    }
  },
};

let xDist = mouse.x - player.y;
let yDist = mouse.y - player.y;
let atan2 = Math.atan2(yDist, xDist);

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

let merchant = {
  x: c.width / 2 - 200,
  y: c.height / 15,
  w: 400,
  h: 200,
  i: imgmerchant,
  type: "hut",
  draw: function () {
    ctx.drawImage(this.i, getAnimX(2, 16, 200, 99), 0, 16, 16, this.x, this.y, this.w, this.h);
  },
};

class Box {
  constructor(owner, cx, cy, cw, ch) {
    this.owner = owner;
    this.cx = cx;
    this.cy = cy;
    this.cw = cw;
    this.ch = ch;

    boxes.push(this);
  }

  getPos() {
    return {
      x: this.owner.x + this.owner.w * this.cx,
      y: this.owner.y + this.owner.h * this.cy,
      w: this.owner.w * this.cw,
      h: this.owner.h * this.ch,
    };
  }

  draw() {
    const pos = this.getPos();

    ctx.strokeRect(pos.x, pos.y, pos.w, pos.h);
  }
}

player.colBox = new Box(player, 0.17, 0.15, 0.6, 0.7);
cage.colBox = new Box(cage, 0, 0, 1, 1);
hut.colBox = new Box(hut, 0.1, 0.1, 0.8, 0.8);

class Projectile {
  constructor() {
    this.w = 100 * sizemultiplier;
    this.h = 50 * sizemultiplier;
    this.x = player.x + (player.w - this.w) / 2;
    this.y = player.y + (player.h - this.h) / 2;
    this.speed = player.projectileSpeed;
    this.type = "projectile";
    this.hitBox = new Box(this, 0.35, 0.25, 0.3, 0.6);

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

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.rotate(this.angle * (Math.PI / 180));
    ctx.drawImage(fireballImg, getAnimX(3, 15, 250), 0, 238, 118, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();

    if (this.x > c.width || this.x + this.w < 0 || this.y > c.height || this.y + this.h < 0) {
      this.destroy();
    }
  }

  destroy() {
    removeFromArray(this, drawObjects);
    removeFromArray(this.hitBox, boxes);
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 90;
    this.h = 90;
    this.vx = 0;
    this.vy = 0;
    this.dead = false;
    this.speed = goblinspeed;
    this.type = "enemy";
    this.area = "start";
    this.target = player;
    this.colBox = new Box(this, 0.17, 0.15, 0.6, 0.7);

    collisionObjects.push(this);
    drawObjects.push(this);
    enemies.push(this);
  }

  move() {
    const target = this.target.center || this.target;

    let run = target.x - this.w / 2 - this.x;
    let rise = target.y - this.h / 2 - this.y;
    this.angle = Math.atan2(rise, run);

    if (run) this.vx = this.speed * Math.cos(this.angle);
    if (rise) this.vy = this.speed * Math.sin(this.angle);

    // this.x += this.vx;
    // this.y += this.vy;
  }

  draw() {
    if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);

    let x1 = this.x + this.w / 2;
    let y1 = this.y + this.h / 2;
    let r = 400;
    let sections = 18;
    for (let theta = Math.PI / sections; theta < 2 * Math.PI; theta += (2 * Math.PI) / sections) {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + r * Math.cos(theta), y1 + r * Math.sin(theta));
      // if (frameCount == 0) console.log(Math.floor((theta * 9) / Math.PI));
    }
    ctx.stroke();

    const animY = Math.floor((this.angle * 9) / Math.PI + 9 + Math.PI / 18);

    ctx.drawImage(barb, getAnimX(10, 8, 193), animY * 209, 164, 164, this.x - 6, this.y - 15, this.w, this.h);
  }
}
function checkBoundaries(thisObject) {
  // if (thisObject.type == "enemy" && background == bg) {
  //   if (thisObject.x <= cage.x && thisObject.y < cage.h / 2.4 + cage.y && thisObject.x < cage.x + cage.w / 2.4 && thisObject.y > cage.y) {
  //     thisObject.x = cage.x;
  //   }
  //   if (thisObject.y > cage.h / 2.4 + cage.y) {
  //     thisObject.y = cage.y + cage.h / 2.4;
  //   }
  //   if (thisObject.x > cage.x + cage.w / 2.4) {
  //     thisObject.x = cage.x + cage.w / 2.4;
  //   }
  //   if (thisObject.y < cage.y) {
  //     thisObject.y = cage.y;
  //   }
  // }
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
    if (thisObject.x > c.width / 1.6) {
      thisObject.x = c.width / 1.6;
    }
    if (thisObject.y < c.height / 2.8) {
      thisObject.y = c.height / 2.8;
    }
    if (thisObject.y > c.height - thisObject.h - 30 && (thisObject.x > c.width / 1.9 || thisObject.x < c.width / 2.4)) {
      thisObject.y = c.height - thisObject.h - 30;
    } else if (thisObject.y > c.height - thisObject.h + 80) {
      leaveHut(thisObject);
    }
  }
}

function checkCollision() {
  const checkArr = areas[player.area].colCheck.map((x) => x.colBox);
  const obstacleArr = areas[player.area].obstacles.map((x) => x.colBox);

  for (const check of checkArr) {
    if (check) {
      for (const obstacle of obstacleArr) {
        const inside = checkIfInside(check, obstacle);
        if (inside) {
          check.owner.x -= check.owner.vx;
          check.owner.y -= check.owner.vy;
        }
      }
    }
  }

  // for (let i = 0; i < collisionObjects.length; i++) {
  //   const colObj = collisionObjects[i];
  //   if (colObj == thisObject || (thisObject.type == "enemy" && colObj.type == "cage")) continue;
  //   if (checkIfInside(thisObject, colObj)) {
  //     if (colObj.type == "enemy" && thisObject.type == "player") {
  //       if (colObj.area == player.area) {
  //         if (player.invincibility <= 0) {
  //           punchsound.play();
  //           player.hp--;
  //           player.invincibility = 100;
  //         }
  //         continue;
  //       } else {
  //         continue;
  //       }
  //     }
  //     if (thisObject.type == "projectile") {
  //       if (colObj.type == "enemy") {
  //         colObj.dead = true;
  //         removeFromArray(colObj, collisionObjects);
  //         const sounds = [new Audio("gets hurt.mp3"), new Audio("gets hurt 2.mp3")];
  //         const randomSound = sounds[getRandInt(0, 1)];
  //         money += 1;
  //         randomSound.play();
  //       }
  //       if (colObj.type == "tikitrophy" && money >= 100) {
  //         colObj.dead = true;
  //         money -= 100;
  //         tikisound.play();
  //         player.hp = 3;
  //       }
  //       if (colObj.type == "shoes" && money >= 100) {
  //         colObj.dead = true;
  //         removeFromArray(colObj, collisionObjects);
  //         money -= 100;
  //         getscoin.play();
  //         player.speed += 3;
  //         shoes.w = 0;
  //       }
  //       if (colObj.type == "gun" && money >= 100) {
  //         colObj.dead = true;
  //         removeFromArray(colObj, collisionObjects);
  //         money -= 100;
  //         getscoin.play();
  //         fireballImg = imgbullet;
  //         player.projectileSpeed += 70;
  //         gunItem.w = 0;
  //         player.reload -= 60;
  //       }
  //       thisObject.destroy();
  //       return;
  //     }
  //     goToClosest(thisObject, colObj);
  //   }
  // }
}

function checkIfInside(box1, box2) {
  const pos1 = box1.getPos();
  const pos2 = box2.getPos();

  const greaterThanLeft = pos1.x + pos1.w > pos2.x ? true : false;
  const lessThanRight = pos1.x < pos2.x + pos2.w ? true : false;
  const greaterThanTop = pos1.y + pos1.h > pos2.y ? true : false;
  const lessThanBottom = pos1.y < pos2.y + pos2.h ? true : false;

  return greaterThanLeft && lessThanRight && greaterThanTop && lessThanBottom;
}

function goToClosest(box1, box2) {
  let side1 = Math.abs(box1.x + box1.w - box2.x);
  let side2 = Math.abs(box1.x - (box2.x + box2.w));
  let side3 = Math.abs(box1.y + box1.h - box2.y);
  let side4 = Math.abs(box1.y - (box2.y + box2.h));

  let closest = Math.min(side1, side2, side3, side4);
  if (side1 == closest) {
    box1.x = box2.x - box1.w;
  } else if (side2 == closest) {
    box1.x = box2.x + box2.w;
  } else if (side3 == closest) {
    box1.y = box2.y - box1.h;
  } else if (side4 == closest) {
    box1.y = box2.y + box2.h;
  }
}

function enterHut(thisObject) {
  thisObject.y = c.height + 70 - thisObject.h;
  thisObject.y = thisObject.y - thisObject.h * 4;
  thisObject.speed = thisObject.speed * 4;
  thisObject.w = thisObject.w * 4;
  thisObject.h = thisObject.h * 4;
  thisObject.area = "hut";
  thisObject.x = c.width / 2 - thisObject.w / 2.5;

  if (thisObject.type == "player") {
    drawObjects = [player, gunItem, tikitrophy, shoes, ...enemies.filter((e) => e.area == player.area)];
    collisionObjects = [shoes, gunItem, tikitrophy, ...enemies.filter((e) => e.area == player.area && !e.dead)];

    player.projectileSpeed = player.projectileSpeed * 4;
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
  thisObject.area = "start";
  thisObject.speed = thisObject.speed / 4;
  thisObject.w = thisObject.w / 4;
  thisObject.h = thisObject.h / 4;
  thisObject.x = hut.x + hut.w / 2 - thisObject.w / 2;

  if (thisObject.type == "player") {
    drawObjects = [hut, cage, ...enemies.filter((e) => e.area == player.area), player];
    collisionObjects = [hut, cage, ...enemies.filter((e) => e.area == player.area && !e.dead)];
    background = bg;
    sizemultiplier = 1;
    player.projectileSpeed = player.projectileSpeed / 4;
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

function getAnimX(rowNum, frameSpeed, frameSize, delay) {
  const animX = Math.floor(((rowNum / (frameSpeed * rowNum)) * frameCount) % rowNum) * frameSize;

  if (delay) {
    return frameCount % (frameSpeed * rowNum + delay) > frameSpeed * rowNum ? 0 : animX;
  } else return animX;
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

// setInterval(spawnEnemy, 3000);
function spawnEnemy() {
  if (background == bg) {
    new Enemy(cage.x, cage.y + cage.h / 2);
  }
  if (money >= 100) {
    goblinspeed = 1.9;
  }
}

// setInterval(moreenemy, 5000);
function moreenemy() {
  if (background == bg && money >= 10) {
    new Enemy(cage.x, cage.y + cage.h / 2);
  }
}

// setInterval(moremoreenemy, 5000);
function moremoreenemy() {
  if (background == bg && money >= 40) {
    new Enemy(cage.x, cage.y + cage.h / 2);
  }
}

// setInterval(enemyHorde, 17000);
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
  new Enemy(cage.x + cage.w / 2, cage.y + 400);

  drawObjects = [player, hut, merchant, ...enemies, cage];

  collisionObjects = [cage, slide, hut, ...enemies];

  areas = {
    start: { colCheck: [player, ...enemies], obstacles: [hut, cage], hit: [], hurt: [] },
    hut: { colCheck: [], obstacles: [], hit: [], hurt: [] },
  };

  startAnimating();
}

function startAnimating() {
  animLoop.maxFpsInterval = 1000 / animLoop.maxFps;
  animLoop.then = window.performance.now();
  animLoop.startTime = animLoop.then;

  loop();
}

function skipFrame() {
  animLoop.now = window.performance.now();
  animLoop.elapsed = animLoop.now - animLoop.then;

  if (animLoop.elapsed > animLoop.maxFpsInterval) {
    frameRate = Math.round(1000 / animLoop.elapsed);
    animLoop.then = animLoop.now - (animLoop.elapsed % animLoop.maxFpsInterval);
    return false;
  } else return true;
}

function loop() {
  requestAnimationFrame(loop);

  if (skipFrame()) return;

  ctx.drawImage(background, 0, 0, c.width, c.height);

  adadaLife();

  for (const area in areas) {
    for (const check of areas[area].colCheck) {
      check.move();
    }
  }

  checkCollision();

  const playerArea = areas[player.area];
  for (let i = 0; i < playerArea.colCheck.length; i++) {
    playerArea.colCheck[i].draw();
  }
  for (let i = 0; i < playerArea.obstacles.length; i++) {
    playerArea.obstacles[i].draw();
  }

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].draw();
  }

  ctx.font = "48px serif";
  ctx.fillStyle = "white";
  ctx.fillText(money, 300, 100);

  frameCount++;
}

setup();
