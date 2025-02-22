//inkblot, but only with math; february 2025.

function setup() {
createCanvas(1000, 562); //in 16:9 aspect ratio.

pixelDensity(1); //always treat one-pixel as one-pixel in higher density displays.

}

function draw() {
background(255); //i choose to draw the background at every frame, because the pixels should update every frame (and not stack on top of each other). 

noLoop();
}

//helper functions:
function pos(x, y) {
//return an index position in the pixels array, based on given coordinates. 

//since the pixels array stores rgba values, i multiply the position by 4 to get the right index number.
return (floor(x) + floor(y) * width) * 4;
}

function findNeighbours(index) {
//return an array of valid first-neighbour indices, based on given index number.  

let neighbors = [];

// convert index back to x and y positions. 
let x = (index / 4) % width;
let y = floor((index / 4) / width);

let positions = [
pos(x - 1, y), // left
pos(x + 1, y), // right
pos(x, y - 1), // top
pos(x, y + 1), // bottom
pos(x - 1, y - 1), // top-left
pos(x + 1, y - 1), // top-right
pos(x - 1, y + 1), // bottom-left
pos(x + 1, y + 1), // bottom-right
];

// Filter out out-of-bounds positions
for (let i = 0; i < positions.length; i++) {
let nx = x + [-1, 1, 0, 0, -1, 1, -1, 1][i]; // x-offsets
let ny = y + [0, 0, -1, 1, -1, -1, 1, 1][i]; // y-offsets

if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
neighbors.push(positions[i]);
}
}

return neighbors;
}

function changeColour(indices, r, g, b, a = 255) {
//update all pixels called, with rgba values. 

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