addEventListener( "keydown", doKeyDown, true);
addEventListener( "keyup", doKeyup, true);

function doKeyDown(e) {
//d
if ( e.keyCode == 68) {
    vxr = 4;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlcage, x, y, 50, 30);
}
//a
if ( e.keyCode == 65 ) {
    vxl = - 4;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlcage, x, y, 50, 30);
}
// w
if ( e.keyCode == 87 ) {
    vyu = - 2;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlcage, x, y, 50, 30);
}
// s
if ( e.keyCode == 83 ) {
    vyd = + 2;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlcage, x, y, 50, 30);
}
}


function doKeyup(e) { 
//d
if ( e.keyCode == 68 ) {
    vxr = 0;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlcage, x, y, 50, 30);
}
//a
if ( e.keyCode == 65 ) {
    vxl = 0;
    x += vxl
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlcage, x, y, 50, 30);
}
// w
if ( e.keyCode == 87 ) {
    vyu = 0;
    ctx.fillStyle = "white"
    ctx.drawImage(htmlcage, x, y, 50, 30);
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
}
// s
if ( e.keyCode == 83 ) {
    vyd = 0;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlcage, x, y, 50, 30);
}
}
setInterval(update, 0.00001);
function update(){
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlcage, x, y, 50, 30);
    x += vxl
    x += vxr
    y += vyu
    y += vyd
}
