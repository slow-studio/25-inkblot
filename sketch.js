//inkblot, but only with math; february 2025. 

/*
//logic: 

*/

/*p5.pixels reference
- one dimensional array from 0,0 going horizontally (and then wrapping below). 
- stores rgba values where for (0,0), pixels[0] = r, pixels[1] = g ...

*/

function setup() {
createCanvas(1000, 562); //in 16:9 aspect ratio. 

pixelDensity(1); 
loadPixels(); 
}

function draw() {
background(255);
}

function convertPixelsToTwoDimensionalArray(){
for (var y = 0; y<height; y++){
for (var x = 0; x<width; x++){
var index = (x+y*width); 
}
}
}
