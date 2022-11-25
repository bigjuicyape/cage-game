const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight - 3.5;

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
const imggunshoot = document.getElementById("glock shoot");
const imgshoes = document.getElementById("shoe");
const imghut = document.getElementById("hut");
const imggrenade = document.getElementById("grenade");
const imgpoison = document.getElementById("poison");
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
const atk = document.getElementById("atk");
const atkwave = document.getElementById("wave");

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
  input[event.key.toLowerCase()] = true;
}

function keyupHandler(event) {
  input[event.key.toLowerCase()] = false;
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
let mouse = {};
let frameCount = 0;
let input = {};
let enemies = [];
let boxes = [];
let areas = {};
let frameRate;

let animLoop = { maxFps: 80 };

let player = {
  x: 750,
  y: c.height * 0.7,
  w: 90,
  h: 70,
  i: dart,
  animY: 0,
  animX: 0,
  gunI: imggun,
  speed: 4,
  alpha: 1,
  vx: 0,
  vy: 0,
  bCooldown: 0,
  gCooldown: 0,
  invincibility: 0,
  hp: Infinity,
  name: "player",
  area: "start",
  bSpeed: 5,
  gSpeed: 5,
  bReload: 100,
  gReload: 500,
  draw: function () {
    this.invincibility--;
    this.bCooldown--;
    this.gCooldown--;

    this.blink();
    this.shoot();
    this.throw();

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(dart, this.animX, this.animY, 125, 125, this.x, this.y, this.w, this.h);
    ctx.globalAlpha = 1;

    ctx.save();
    const center = getCenter(this);
    ctx.translate(center.x, center.y);
    ctx.rotate(this.facing);

    ctx.drawImage(this.gunI, -140 / 2, -32 / 2, 140, 32);
    ctx.restore();
  },

  move: function () {
    if (input.a) {
      this.vx = -player.speed;
      this.animX = getAnimX(8, 5, 129);
    } else if (input.d) {
      this.vx = player.speed;
      this.animX = getAnimX(8, 5, 129);
    } else {
      this.vx = 0;
    }
    if (input.shift) {
      this.vx = this.vx * 4;
      this.vy = this.vy * 4;
      this.animX = getAnimX(16, 5, 129);
    }
    if (input.w) {
      this.vy = -player.speed;
      this.animX = getAnimX(8, 5, 129);
    } else if (input.s) {
      this.vy = player.speed;
      this.animX = getAnimX(8, 5, 129);
    } else {
      this.vy = 0;
    }

    this.facing = angleTo(this, mouse).angle;
    this.animY = (Math.round((this.facing * 9) / Math.PI + 9) % 18) * 141;

    if (!input.a && !input.d && !input.w && !input.s) {
      this.vy = 0;
      this.animX = 0;
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
    if (this.bCooldown <= 0 && mouse.down) {
      this.bCooldown = this.bReload;
      new Projectile(this, this.x + 90 * Math.cos(this.facing), this.y + 90 * Math.sin(this.facing), "bullet", this.bSpeed);
      this.gunI = imggunshoot;
    } else if (this.bCooldown == this.bReload - 15) player.gunI = imggun;
  },

  throw: function () {
    if (this.gCooldown <= 0 && input.e) {
      this.gCooldown = this.gReload;
      new Projectile(this, this.x + 90 * Math.cos(this.facing), this.y + 90 * Math.sin(this.facing), "grenade", this.gSpeed);
    }
  },

  hurtCallback() {
    const owner = this.owner;

    if (owner.invincibility <= 0) {
      new Audio("hurt.mp3").play();
      owner.hp--;
      owner.invincibility = 150;
    }
  },

  moveAreas(newArea) {
    const thisArea = areas[this.area];

    removeFromArray(this, thisArea.col);
    removeFromArray(this, thisArea.hurt);

    areas[newArea].col.push(this);
    areas[newArea].hurt.push(this);

    this.area = newArea;
  },
};

let cage = {
  x: c.width / 1.31,
  y: c.height / 2.3,
  w: 100,
  h: 100,
  i: imgcage,
  name: "cage",
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
  name: "tikitrophy",
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
  name: "gun",
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
  name: "shoes",
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
//   name: "key",
//   draw: function () {
//     ctx.drawImage(this.i, this.x, this.y, this.w, this.h);
//   },
// };

let hut = {
  w: 250,
  h: 275,
  x: c.width / 2 - 120,
  y: c.height / 7,
  i: imghut,
  name: "hut",
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
  name: "hut",
  draw: function () {
    ctx.drawImage(this.i, getAnimX(2, 16, 200, 99), 0, 16, 16, this.x, this.y, this.w, this.h);
  },
};

class Box {
  constructor(owner, cx, cy, cw, ch, callback, inverse) {
    this.owner = owner;
    this.cx = cx;
    this.cy = cy;
    this.cw = cw;
    this.ch = ch;
    this.callback = callback;
    this.inverse = inverse;

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

class Projectile {
  constructor(attacker, x, y, type, speed) {
    this.x = x;
    this.y = y;
    this.angle = attacker.facing;
    this.speed = speed;
    this.name = "projectile";
    this.type = type;
    this.area = attacker.area;
    this.hitbox = new Box(this, 0.35, 0.25, 0.3, 0.6, this.callback);
    this.colbox = new Box(this, 0.35, 0.25, 0.3, 0.6, this.callback);
    this.attacker = attacker;
    new Audio("shoot.mp3").play();
    if (this.type == "bullet") {
      this.i = fireballImg;
      this.rowNum = 3;
      this.frameSpeed = 15;
      this.frameW = 250;
      this.frameH = 118;

      this.w = 100 * sizemultiplier;
      this.h = 50 * sizemultiplier;
      new Audio("shot.mp3").play();
    }

    if (this.type == "grenade") {
      this.i = imggrenade;
      this.rowNum = 11;
      this.frameSpeed = 5.5;
      this.frameW = 122;
      this.frameH = 116;

      this.w = 70 * sizemultiplier;
      this.h = 70 * sizemultiplier;
    }

    areas[this.area].col.push(this);
    areas[this.area].hit.push(this);

    this.getVelocity();
  }

  getVelocity() {
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.rotate(this.angle);

    ctx.drawImage(
      this.i,
      getAnimX(this.rowNum, this.frameSpeed, this.frameW),
      0,
      this.frameW,
      this.frameH,
      -this.w / 2,
      -this.h / 2,
      this.w / 2,
      this.h / 2
    );

    ctx.restore();
  }

  callback(col, obst) {
    removeFromArray(col.owner, areas[col.owner.area].col);
    removeFromArray(col.owner, areas[col.owner.area].hit);
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 80;
    this.vx = 0;
    this.vy = 0;
    this.dead = false;
    this.speed = goblinspeed;
    this.name = "enemy";
    this.area = "start";
    this.target = player;
    this.colbox = new Box(this, 0.3, 0.2, 0.4, 0.5);
    this.hitbox = new Box(this, 0.3, 0.2, 0.4, 0.5);
    this.hurtbox = new Box(this, 0.3, 0.2, 0.4, 0.5, this.hurtCallback);

    areas[this.area].col.push(this);
    areas[this.area].hit.push(this);
    areas[this.area].hurt.push(this);

    enemies.push(this);
  }

  move() {
    const targetC = getCenter(this.target);
    const thisC = getCenter(this);

    let run = targetC.x - thisC.x;
    let rise = targetC.y - thisC.y;
    this.angle = Math.atan2(rise, run);

    if (run) this.vx = this.speed * Math.cos(this.angle);
    if (rise) this.vy = this.speed * Math.sin(this.angle);

    this.x += this.vx;
    this.y += this.vy;
  }
  golemsplit() {
    new Enemy(this.x + 100, this.y);
    new Enemy(this.x - 100, this.y);
  }
  draw() {
    if (this.dead) return ctx.drawImage(deadboy, this.x, this.y, this.w, this.h);
    // dogshit knockback
    // if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) < 170) {
    //   if (player.x >= this.x) {
    //     player.x += 10;
    //   } else {
    //     player.x -= 10;
    //   }
    //   if (Math.abs(this.y - player.y) + Math.abs(this.x - player.x) < 170) {
    //     if (player.y >= this.y) {
    //       player.y += 10;
    //     } else {
    //       player.y -= 10;
    //     }
    //   }
    // }

    const animY = Math.round((this.angle * 9) / Math.PI + 9) % 18;
    if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) < 150) {
      ctx.drawImage(atk, getAnimX(4, 4, 122), animY * 124, 122, 124, this.x, this.y, this.w, this.h);
      // ctx.save();
      // ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
      // ctx.rotate(50 * this.angle * (Math.PI / 180));
      // ctx.drawImage(atkwave, getAnimX(4, 4, 128), 0, 130, 128, 100 - this.w / 2, -300 / 2, this.w, 300);
      // ctx.restore();
    } else {
      ctx.drawImage(barb, getAnimX(8, 10, 122), animY * 124, 122, 124, this.x, this.y, this.w, this.h);
    }
  }

  hurtCallback() {
    const thisArea = areas[this.owner.area];

    removeFromArray(this.owner, thisArea.col);
    removeFromArray(this.owner, thisArea.hit);
    removeFromArray(this.owner, thisArea.hurt);
  }

  moveAreas(newArea) {
    const thisArea = areas[this.area];

    removeFromArray(this, thisArea.col);
    removeFromArray(this, thisArea.hit);
    removeFromArray(this, thisArea.hurt);

    areas[newArea].col.push(this);
    areas[newArea].hit.push(this);
    areas[newArea].hurt.push(this);

    this.area = newArea;
  }
}

function checkCollision() {
  for (const area in areas) {
    const colArr = areas[area].col.map((x) => x.colbox || x);
    const obstArr = areas[area].obst.map((x) => x.colbox || x);
    const hitArr = areas[area].hit.map((x) => x.hitbox || x);
    const hurtArr = areas[area].hurt.map((x) => x.hurtbox || x);

    if (colArr.length && obstArr.length) {
      colAgainstObst();
    }

    if (hitArr.length && hurtArr.length) {
      hitAgainstHurt();
    }

    function colAgainstObst() {
      for (const col of colArr) {
        for (const obst of obstArr) {
          const inside = checkIfInside(col, obst);
          if (!inside) continue;

          if (col.callback) {
            col.callback(col, obst);
          } else if (obst.callback) {
            obst.callback(col, obst);
          } else {
            goToClosest(col, obst);
          }
        }
      }
    }

    function hitAgainstHurt() {
      for (const hit of hitArr) {
        for (const hurt of hurtArr) {
          const inside = checkIfInside(hit, hurt);
          const hitOwner = hit.owner.attacker || hit.owner;
          if (inside && hitOwner.name != hurt.owner.name) {
              if (inside && hitOwner.name != hurt.owner.name && hurt.owner.name == "enemy"){
                Enemy.golemsplit();
              }
              hurt.callback(hit, hurt);
            if (hit.callback) hit.callback(hit, hurt);
          }
        }
      }
    }
  }
}

// function golemsplit() {  
//   if (inside && hitOwner.name != hurt.owner.name && hurt.owner.name == "enemy"){
//     new Enemy(100, 100);
//     new Enemy(100, 100);
//     }
//   }

function checkIfInside(box1, box2) {
  const pos1 = box1.getPos();
  const pos2 = box2.getPos();

  if (box2.inverse) {
    let lessThanLeft;
    let greaterThanRight;
    let lessThanTop;
    let greaterThanBottom;

    if (box1.owner.name == "projectile") {
      lessThanLeft = pos1.x + pos1.w < pos2.x ? true : false;
      greaterThanRight = pos1.x > pos2.x + pos2.w ? true : false;
      lessThanTop = pos1.y + pos1.h < pos2.y ? true : false;
      greaterThanBottom = pos1.y > pos2.y + pos2.h ? true : false;
    } else {
      lessThanLeft = pos1.x < pos2.x ? true : false;
      greaterThanRight = pos1.x + pos1.w > pos2.x + pos2.w ? true : false;
      lessThanTop = pos1.y < pos2.y ? true : false;
      greaterThanBottom = pos1.y + pos1.h > pos2.y + pos2.h ? true : false;
    }

    return lessThanLeft || greaterThanRight || lessThanTop || greaterThanBottom;
  }

  const greaterThanLeft = pos1.x + pos1.w > pos2.x ? true : false;
  const lessThanRight = pos1.x < pos2.x + pos2.w ? true : false;
  const greaterThanTop = pos1.y + pos1.h > pos2.y ? true : false;
  const lessThanBottom = pos1.y < pos2.y + pos2.h ? true : false;

  return greaterThanLeft && lessThanRight && greaterThanTop && lessThanBottom;
}

function goToClosest(box1, box2) {
  const pos1 = box1.getPos();
  const pos2 = box2.getPos();

  let side1 = Math.abs(pos1.x + pos1.w - pos2.x);
  let side2 = Math.abs(pos1.x - (pos2.x + pos2.w));
  let side3 = Math.abs(pos1.y + pos1.h - pos2.y);
  let side4 = Math.abs(pos1.y - (pos2.y + pos2.h));

  let closest = Math.min(side1, side2, side3, side4);

  const dx = box1.owner.x - pos1.x;
  const dy = box1.owner.y - pos1.y;

  if (box2.inverse) {
    if (side1 == closest) {
      box1.owner.x = pos2.x + dx;
    } else if (side2 == closest) {
      box1.owner.x = pos2.x + pos2.w - pos1.w + dx;
    } else if (side3 == closest) {
      box1.owner.y = pos2.y + dy;
    } else if (side4 == closest) {
      box1.owner.y = pos2.y + pos2.h - pos1.h + dy;
    }

    console.log(side1, side2, side3, side4);

    return;
  }

  if (side1 == closest) {
    box1.owner.x = pos2.x - pos1.w + dx;
  } else if (side2 == closest) {
    box1.owner.x = pos2.x + pos2.w + dx;
  } else if (side3 == closest) {
    box1.owner.y = pos2.y - pos1.h + dy;
  } else if (side4 == closest) {
    box1.owner.y = pos2.y + pos2.h + dy;
  }
}

function enterHut(col, obst) {
  const trigger = col.owner;

  trigger.moveAreas("hut");

  trigger.speed = trigger.speed * 4;
  trigger.w = trigger.w * 4;
  trigger.h = trigger.h * 4;
  trigger.x = c.width / 2 - trigger.w / 2.5;
  trigger.y = c.height - trigger.h + 15;

  if (trigger.name == "player") {
    background = shop;
    sizemultiplier = 2;
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].target = getNewTarget(enemies[i].area);
    }
  } else if (trigger.area == player.area) {
    trigger.target = getNewTarget(trigger.area);
  }
}

function exitHut(col, obst) {
  const trigger = col.owner;

  trigger.moveAreas("start");

  trigger.speed = trigger.speed / 4;
  trigger.w = trigger.w / 4;
  trigger.h = trigger.h / 4;
  trigger.x = hut.x + hut.w / 2 - trigger.w / 2;
  trigger.y = hut.y + hut.h;

  if (trigger.name == "player") {
    background = bg;
    sizemultiplier = 1;
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].target = getNewTarget(enemies[i].area);
    }
  } else if (trigger.area == player.area) {
    trigger.target = getNewTarget(trigger.area);
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

function angleTo(start, end) {
  const startC = getCenter(start);

  let dx = end.x - startC.x;
  let dy = end.y - startC.y;

  let length = Math.sqrt(dx ** 2 + dy ** 2);

  dx /= length;
  dy /= length;

  const angle = Math.atan2(dy, dx);

  return { angle: angle, dx: dx, dy: dy };
}

function getCenter(obj) {
  return { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 };
}

function getAnimX(rowNum, frameSpeed, frameSize, delay) {
  const animX = Math.floor(((rowNum / (frameSpeed * rowNum)) * frameCount) % rowNum) * frameSize;

  if (delay) {
    return frameCount % (frameSpeed * rowNum + delay) > frameSpeed * rowNum ? 0 : animX;
  } else return animX;
}

function removeFromArray(element, array) {
  const index = array.indexOf(element);

  if (index != -1) array.splice(array.indexOf(element), 1);
}

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function adadaLife() {
  ctx.drawImage(imgcoin, 300, 0, 100, 100);
  if (player.hp >= 3) {
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
  } else if (player.hp <= 0) {
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

    areas[player.area].draw.push(deadPlayer);
    removeFromArray(player, areas[player.area].col);

    player.hp--;
  }
}

function setup() {
  player.colbox = new Box(player, 0.17, 0.15, 0.6, 0.7);
  player.hurtbox = new Box(player, 0.17, 0.15, 0.6, 0.7, player.hurtCallback);
  cage.colbox = new Box(cage, 0, 0, 1, 1);
  hut.colbox = new Box(hut, 0.1, 0.1, 0.8, 0.8);

  startColbox = new Box({ x: 0, y: 0, w: c.width, h: c.height }, 0, 0, 1, 1, null, true);
  hutColbox = new Box({ x: 100, y: 100, w: 600, h: 600 }, 0, 0, 1, 1, null, true);

  const hutboxPos = hut.colbox.getPos();
  hutEntry = new Box({ x: hutboxPos.x + 50, y: hutboxPos.y + hutboxPos.h, w: hutboxPos.w - 100, h: 1 }, 0, 0, 1, 1, enterHut);
  hutExit = new Box({ x: 570, y: c.height - 25, w: 200, h: 1 }, 0, 0, 1, 1, exitHut);

  areas = {
    start: { draw: [], col: [player, ...enemies], obst: [hut, cage, startColbox, hutEntry], hit: [], hurt: [player] },
    hut: { draw: [], col: [], obst: [hutExit, hutColbox], hit: [], hurt: [] },
  };

  new Enemy(cage.x + cage.w / 2, cage.y + 400);

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

  ctx.drawImage(background, 0, 0, 1431, 880, 0, 0, c.width, c.height);

  adadaLife();

  for (const area in areas) {
    for (const col of areas[area].col) {
      col.move();
    }
  }

  checkCollision();

  const playerArea = areas[player.area];

  for (let i = 0; i < playerArea.col.length; i++) {
    const box = playerArea.col[i];
    if (!box.owner) box.draw();
  }

  for (let i = 0; i < playerArea.obst.length; i++) {
    const box = playerArea.obst[i];
    if (!box.owner) box.draw();
  }

  for (let i = 0; i < playerArea.draw.length; i++) {
    playerArea.draw[i].draw();
  }

  // for (const area in areas) {
  // const thisArea = areas[area];
  const thisArea = playerArea;

  for (let i = 0; i < thisArea.col.length; i++) {
    const colbox = thisArea.col[i].colbox || thisArea.col[i];

    ctx.strokeStyle = "yellow";
    colbox.draw();
  }

  for (let i = 0; i < thisArea.obst.length; i++) {
    const colbox = thisArea.obst[i].colbox || thisArea.obst[i];

    ctx.strokeStyle = "blue";
    colbox.draw();
  }

  for (let i = 0; i < thisArea.hit.length; i++) {
    const hitbox = thisArea.hit[i].hitbox || thisArea.hit[i];

    ctx.strokeStyle = "red";
    hitbox.draw();
  }

  for (let i = 0; i < thisArea.hurt.length; i++) {
    const hurtbox = thisArea.hurt[i].hurtbox || thisArea.hurt[i];

    ctx.strokeStyle = "green";
    hurtbox.draw();
  }
  // }

  ctx.strokeStyle = "black";

  ctx.font = "48px serif";
  ctx.fillStyle = "white";
  ctx.fillText(money, 300, 100);

  frameCount++;
}

setup();
