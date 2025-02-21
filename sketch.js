//inkblot, but only with math; february 2025. 

/*
//logic: 

*/

function setup() {
createCanvas(1000, 562); //in 16:9 aspect ratio. 

pixelDensity(1); //always treat one-pixel as one-pixel in higher density displays. 
}

function draw() {
background(255);

for (let x = 0; x<width; x++){
changeColour (pos(x, height/2), 0, 0, 0); 
}
}

function changeColour(index, r, g, b, a=255){
loadPixels(); //load all pixels on the screen. 
pixels[index+0] = r;
pixels[index+1] = g;
pixels[index+2] = b; 
pixels[index+3] = a; 
updatePixels(); 
}

function pos(x, y){
//accept coordinates. then, return an index position in the pixels array. 

//since the pixels array stores rgba values, i multiply the position by 4. 
return (floor (x) + floor (y) * width)*4; 
}
