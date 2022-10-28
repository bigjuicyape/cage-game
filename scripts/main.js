const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
let up = document.getElementById("up");
let down = document.getElementById("down");
let left = document.getElementById("left");
let right = document.getElementById("right");
let htmlcage = document.getElementById("cage");
let cnvheight = 600;
let cnvwidth = 600;
let x = 140
let y = 65
let vy = 0;
let vx = 0;

ctx.drawImage(down, x, y, 50, 30);

window.addEventListener( "keypress", doKeyDown, false );

c.addEventListener( "keydown", doKeyDown, true);

ctx.drawImage(down, x, y, 50, 30);

function reset() {
    x = 125
    y = 65
    ctx.fillStyle = "#0e6615"
ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(down, x, y, 50, 30);
}



// 119 = w 
// 97 = a 
// 100 = d
// 115 = s