//inkblot_1d_mathematical; february 2025. 

//shobhan and vivek suggested to make a matrix and manipulate that, instead of drawing shapes; since p5's alpha was producing unintended effects. 

/*
approach: 

- there is a 'surface', made up of many 'cells', on which 'ink molecules' are dropped. in this program, the screen is the surface, cells are defined in class Cell and ink molecules are defined in class InkMolecule. 

- each cell has
    - position: {x, y} on surface
    - size: {w, h}
    - how much ink can it hold: {capacity}
    - grayscale-value: {c} 
    - ability to find adjacent neighbours
    - ability to change colours based on number of ink molecules. 
    - ability to offload ink molecules if they are greater than capacity. 

an ink molecule has: 
    - position :{x,y}
    - ability to move to a new position, at a rate or speed. 
*/

//global declarations: 
let cells = []; 
const cellWidth = 5; //this is also the same width for the ink particles. 
let cellHeight = 562; 
const capacity = 255; //this is the capacity of what each cell can store. 

let inkMolecules = []; 
let numOfInkMolecules = 10000; 

function setup() {
createCanvas(1000, 562); //in 16:9 aspect ratio.
cellHeight = height; //make cellHeight the same as canvas height. 
rectMode (CENTER);  

background(255); //the background only needs to be drawn once. 

createSurface();
createInk(); 
}

function createSurface(){
//create cells
let iteration = 0; 
for (let x = 0+cellWidth/2; x<=width-cellWidth/2; x+=cellWidth){
cells.push(new Cell (x, 0+cellHeight/2, cellWidth, cellHeight, iteration)); 
iteration++; 
}

//make each cell find their neighbours.
for (let cell of cells){
cell.findNeighbours(); 
}
}

function createInk(){
// create ink molecules

//constructor(x, y, d = cellWidth)

for (let i = 0; i<numOfInkMolecules; i++){
inkMolecules.push (new InkMolecule(cells[cells.length/2].x, cells[cells.length/2].y)); 
}

}

function draw() {
background(255); //the background only needs to be drawn once.
cellFunctions(); 
//inkFunctions(); 

filter (INVERT);
}

function cellFunctions(){
for (let cell of cells){
cell.display(); 
cell.checkContents(); 
cell.offloadInk(); 
}
}

function inkFunctions(){
for (let molecule of inkMolecules){
molecule.display(); 
}
}

//cell object. 
class Cell{
constructor(x, y, w, h, index){
this.x = x; 
this.y = y; 
this.w = w; 
this.h = h; 

this.capacity = capacity; 
this.inkInside = []; 
this.excessInk = []; 

this.index = index; 
this.leftNeighbour = null;
this.rightNeighbour = null;

this.c = 255; 
}

//cells find their neighbours on the surface. 
findNeighbours(){
if (this.index>0){
this.leftNeighbour = cells[this.index - 1]; //left cell
}
if (this.index < cells.length - 1) {
this.rightNeighbour = cells[this.index + 1]; // right cell
}

}

display(){
stroke (0);
strokeWeight (0); 

console.log(this.c); 

//this.c = map(this.inkInside.length, 0, inkMolecules.length, 255, 0);
// this.c = min(this.inkInside.length, this.capacity); // Ensure it doesn't exceed 255
// fill(255 - this.c); // Inverts grayscale logic

this.c = this.inkInside.length; 
fill (this.c); 


rect (this.x, this.y, this.w, this.h);
}

checkContents(){
//this checks how many ink molecules are inside each cell and stores them in an array. i use simple bounding box detection for this. 

this.inkInside = []; 

for (let molecule of inkMolecules){
if (
molecule.x >= this.x - this.w / 2 &&
molecule.x < this.x + this.w / 2 &&
molecule.y >= this.y - this.h / 2 &&
molecule.y < this.y + this.h / 2
) {
this.inkInside.push(molecule);
}
}

//check whether the cell has too much ink. 
if (this.inkInside.length> this.capacity){
this.excessInk = this.inkInside.slice(this.capacity); //make a new array for all the extra ink. 
}else{
this.excessInk = []; //reset the excessInk to zero if there's nothing left. 
}

}

offloadInk(){
if (this.excessInk.length>1){
for (let excessInkMolecule of this.excessInk){
let prob = random(0,1); 

if (prob<0.5){
excessInkMolecule.move(this.rightNeighbour.x); 
}else{
excessInkMolecule.move(this.leftNeighbour.x); 
}
}
}

}
}

//ink particle object. 
class InkMolecule{
constructor(x, y, d = cellWidth, h = cellHeight){
this.x = x; 
this.y = y; 
this.d = d; 
this.h = h; 
}

display(){
noStroke(); 

fill (0, 1); 
rect (this.x, this.y, this.d, this.h); 
}

move(destX){
this.x = lerp(this.x, destX, 0.1); 

//stop lerp for tiny movements. 
if (abs(this.x-this.destinationX)<0.1){
this.x = destX; 
}

}

}