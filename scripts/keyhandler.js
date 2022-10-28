addEventListener( "keydown", doKeyDown, true);
addEventListener( "keyup", doKeyup, true);

function doKeyDown(e) {
//d
if ( e.keyCode == 68 && x <= 250) {
    vxr = 1;
}
//a
if ( e.keyCode == 65 && x >= 0) {
    vxl = - 1;
}
// w
if ( e.keyCode == 87 && y >= 0) {
    vyu = - 0.5;
}
// s
if ( e.keyCode == 83  && y <= 125) {
    vyd = + 0.5;
}
}


function doKeyup(e) { 
//d
if ( e.keyCode == 68 ) {
    vxr = 0;
}
//a
if ( e.keyCode == 65 ) {
    vxl = 0;
}
// w
if ( e.keyCode == 87 ) {
    vyu = 0;
}
// s
if ( e.keyCode == 83 ) {
    vyd = 0;
}
}

