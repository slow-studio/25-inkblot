//inkblot, but only with math; february 2025.

/*
//logic: 

- go through the screen. 
- see if what you contain is higher than capacity. 
- if higher, choose to offload. 
- 

*/

let seed = -10000;
let capacity = 255;
let maxTransferRate = 8; 


function setup() {
createCanvas(1000, 562); //in 16:9 aspect ratio.

pixelDensity(1); //always treat one-pixel as one-pixel in higher density displays.
}

function draw() {
background(255);

for (let x = 0; x<width;x++){
dropInk(x, height/2); 
}

//noLoop();
}

function dropInk(x, y, seed){
//when ink is dropped, colour is changed.
let col = constrain(seed, 0, 255); 

changeColour(pos(x,y),col, col, col ); 

offload(x, y); 
}



//helper functions:

function pos(x, y) {
//accept coordinates. then, return an index position in the pixels array.

//since the pixels array stores rgba values, i multiply the position by 4 to get the right index number.
return (floor(x) + floor(y) * width) * 4;
}

function findNeighbours(x, y) {
let neighbors = [];

let positions = [
pos(x - 1, y), // left. 
pos(x + 1, y), // right.
pos(x, y - 1), // top.
pos(x, y + 1), // bottom.
pos(x - 1, y - 1), // top-left.
pos(x + 1, y - 1), // top-right.
pos(x - 1, y + 1), // bottom-left.
pos(x + 1, y + 1), // bottom-right.
];

// filter out out-of-bounds positions:
for (let i = 0; i < positions.length; i++) {
let nx = x + [-1, 1, 0, 0, -1, 1, -1, 1][i]; // x-offsets.
let ny = y + [0, 0, -1, 1, -1, -1, 1, 1][i]; // y-offsets.

if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
neighbors.push(positions[i]);
}
}

return neighbors;
}

function changeColour(indices, r, g, b, a = 255) {
loadPixels(); //load all pixels on the screen.

if (!Array.isArray(indices)) {
indices = [indices]; // convert single index to array.
}

for (let index of indices) {
pixels[index + 0] = r;
pixels[index + 1] = g;
pixels[index + 2] = b;
pixels[index + 3] = a;
}

updatePixels(); //update all pixels on the screen.
}

