const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
let htmlimg = document.getElementById("goblin");
let htmlcage = document.getElementById("cage");
let cnvheight = 600;
let cnvwidth = 600;
let x = 125;
let y = 60;
let vy = 0;
let vx = 0;

ctx.drawImage(htmlimg, x, y, 50, 25);

window.addEventListener( "keypress", doKeyDown, false );
c.addEventListener( "keydown", doKeyDown, true);

function reset() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    x = 125
    y - 60
    ctx.drawImage(htmlcage, x, y, 50, 25);
}



// 119 = w 
// 97 = a 
// 100 = d
// 115 = s