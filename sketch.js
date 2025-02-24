//inkblot-base, with only math; february 2025.

let seed = 1000000;
let paper = []; // a virtual array where each element corresponds to one-pixel on the screen.

function setup() {
createCanvas(3, 3);
pixelDensity(1); //always treat one-pixel as one-pixel in higher density displays.

background(255);

//feed an initial value to the virtual array, so that each element corresponds to one-pixel on the screen.  
for (let i = 0; i < width * height; i++) {
paper.push(0);
}

//console.log(`set up ${paper.length} pixels on paper.`); //debug-comment to check how many items get created in paper. 

dropInk(); 

}

function dropInk(){
//drops ink on the paper and displays it on the screen. 

//define position for seed: 
let posforseed_x = width / 2;
let posforseed_y = height / 2;

//change value of the element in the paper array:
paper[pos(posforseed_x, posforseed_y)] = seed;

//console.log(`paper-pixel at (${posforseed_x}, ${posforseed_y}) has ${seed} ink units dropped on it.`); //debug-comment to check how many units of ink have been dropped on which position. 

//update visually: 
loadPixels();
let indexofseed = pos(posforseed_x, posforseed_y);
changeRGBA(indexofseed, paper[indexofseed]);
updatePixels();
}

function draw() {
// background(255);

noLoop(); 

//for each pixel in paper, blot ink from it to its neighbours: 
for (let i = 0; i<paper.length; i++){
blot (i); 
}

// // for each pixel in paper[]
// for (let i = 0; i < paper.length; ++i) {
//   // blot ink from it to its neighbours
//   blot(i);
// }
// for (let i = 0; i < paper.length; i++) {
//   changeRGBA(i, paper[i]);
// }
// updatePixels();
// console.log(frameRate());
}

function blot(index){

//first, get the pixel's neighbours: 
//let neighbours = getNeighbours(4); 

}

/*
function blot(index) {
const step = 15;

//first get neighbours:
let neighbours = getNeighbours(index);

for (let i = 0; i < neighbours.length; i++) {
if (paper[index] > paper[neighbours[i]] + step + 1) {
paper[index] -= step;
paper[neighbours[i]] += step;
}
}

//console.log(neighbours);
}
*/

function getNeighbours(index) {
let neighbours = [];

//we calculate naighbours based on the x, y position and not the index (because the index is one-dimensional. 
//so, we convert the index to x, y coordinates again:
let indexCoordinate = inversePos(index);
let x = indexCoordinate[0]; 
let y = indexCoordinate[1]; 

//list all 8 neighbour-possibilities for a position: 
let potentialNeighbours = [
[x - 1, y - 1], // top-left. 
[x, y - 1],     // top. 
[x + 1, y - 1], // top-right. 
[x + 1, y],     // right. 
[x + 1, y + 1], // bottom-right. 
[x, y + 1],     // bottom. 
[x - 1, y + 1], // bottom-left. 
[x - 1, y]      // left. 
];

//console.log(`neighbour positions of ${index} are ${potentialNeighbours}`); //debug comment to check potential neighbour output. 

//filter out-of-bounds positions: 
for (let i = 0; i < potentialNeighbours.length; i++) { 
//a neighbour is out-of-bounds if it is beyond the canvas dimensions. 

let nx = potentialNeighbours[i][0];
let ny = potentialNeighbours[i][1];

if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
neighbours.push(pos(nx, ny));
}
}

//console.log(`neighbours for ${index} are indices: ${neighbours}`); //debug comment to check neighbours. 

return neighbours;
}

/*
function dropInk(x, y, quantity) {
changeRGBA(pos(x, y), quantity > 255 ? 255 : quantity);
}
*/

function pos(x, y) {
let element = floor(x) + floor(y) * width;
// console.log(`pos(${x}, ${y}) found element ${element}.`)

if (element<=paper.length){
return element;
}else{
return null
}
}

function inversePos(index) {
let x = floor(index % width);
let y = floor((index - x) / width);

// console.log(`inverse-pos for index ${index} is ${x}, ${y}.`)

return [x, y];
}

function changeRGBA(index, a = 255) {
index *= 4;
pixels[index + 0] =
pixels[index + 1] =
pixels[index + 2] =
a > 255 ? 0 : 255 - a;
pixels[index + 3] = 255;
}
