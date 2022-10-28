addEventListener( "keydown", doKeyDown, true);

function doKeyDown(e) {
//d
if ( e.keyCode == 68 ) {
    vx = 10;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlimg, x, y, 50, 25);
}
//a
if ( e.keyCode == 65 ) {
    vx = - 10;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlimg, x, y, 50, 25);
}
// w
if ( e.keyCode == 87 ) {
    vy = - 10;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlimg, x, y, 50, 25);
}
// s
if ( e.keyCode == 83 ) {
    vy = + 10;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnvwidth, cnvheight);
    ctx.drawImage(htmlimg, x, y, 50, 25);
}
}