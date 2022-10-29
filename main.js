const c = document.getElementById('myCanvas');
const ctx = c.getContext('2d');
let up = document.getElementById('up');
let down = document.getElementById('down');
let left = document.getElementById('left');
let right = document.getElementById('right');
let bg = document.getElementById('bg');
let htmlcage = document.getElementById('cage');
let vx = 0;
let vy = 0;
let wDown = false;
let aDown = false;
let sDown = false;
let dDown = false;
let image = down;

c.width = 600;
c.height = 600;

let x = c.width / 2 - 150 / 2;
let y = c.height / 2 - 100 / 2;

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function keydown(event) {
   if (event.key == 'a') {
      aDown = true;
   }
   if (event.key == 'd') {
      dDown = true;
   }
   if (event.key == 'w') {
      wDown = true;
   }
   if (event.key == 's') {
      sDown = true;
   }
}

function keyup(event) {
   if (event.key == 'a') {
      aDown = false;
   }
   if (event.key == 'd') {
      dDown = false;
   }
   if (event.key == 'w') {
      wDown = false;
   }
   if (event.key == 's') {
      sDown = false;
   }
}

ctx.drawImage(down, x, y, 50, 30);

function reset() {
   x = c.width / 2 - 150 / 2;
   y = c.height / 2 - 100 / 2;
   ctx.drawImage(down, x, y, 50, 30);
}

requestAnimationFrame(loop);

function loop() {
   ctx.drawImage(bg, 0, 0, c.width, c.height);

   if (aDown) {
      vx = -4;
      image = left;
   } else if (dDown) {
      vx = 4;
      image = right;
   } else {
      vx = 0;
   }

   if (wDown) {
      vy = -4;
      image = up;
   } else if (sDown) {
      vy = 4;
      image = down;
   } else {
      vy = 0;
   }

   if ((aDown || dDown) && (wDown || sDown)) {
      vx += -Math.sign(vx) * Math.sqrt(2);
      vy += -Math.sign(vy) * Math.sqrt(2);
   }

   x += vx;
   y += vy;

   if (x < -20) {
      x = -20;
   } else if (x > c.width - 130) {
      x = c.width - 130;
   }

   if (y < 0) {
      y = 0;
   } else if (y > c.height - 90) {
      y = c.width - 90;
   }

   ctx.drawImage(image, x, y, 150, 100);

   requestAnimationFrame(loop);
}

// 119 = w
// 97 = a
// 100 = d
// 115 = s