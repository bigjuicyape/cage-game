setInterval(funcup, 0.00001);
function funcup(){
y += vyu
if(vyu <= -0.1  && y >= 0) {
ctx.fillStyle = "#0e6615"
ctx.fillRect(0, 0, cnvwidth, cnvheight);
ctx.drawImage(up, x, y, 50, 30);
}
}

setInterval(funcdown, 0.00001);
function funcdown(){
y += vyd
if(vyd >= 0.1 && y <= 125) {
ctx.fillStyle = "#0e6615"
ctx.fillRect(0, 0, cnvwidth, cnvheight);
ctx.drawImage(down, x, y, 50, 30);
}
}

setInterval(funcleft, 0.00001);
function funcleft(){
x += vxl
if(vxl <= -0.1  && x >= 0) {
ctx.fillStyle = "#0e6615"
ctx.fillRect(0, 0, cnvwidth, cnvheight);
ctx.drawImage(left, x, y, 50, 30);
}
}

setInterval(funcright, 0.00001);
function funcright(){
x += vxr
if(vxr >= 0.1 && x <= 250) {
ctx.fillStyle = "#0e6615"
ctx.fillRect(0, 0, cnvwidth, cnvheight);
ctx.drawImage(right, x, y, 50, 30);
}
}

