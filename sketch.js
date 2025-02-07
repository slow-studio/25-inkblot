//inkblot_1d_v2; february 2025. 

/*
approach: 

- there is a 'surface' that has many 'cells'. in code, the screen is the surface and the cells are defined in 'class Cell'.

- each cell has:
    - position {x,y} on the surface
    - size {w,h} (we assume a 'cell' is rectangular)
    - capacity (how much of something can it hold)
    - ability to 'speak' 

- an ink molecule has:
    - position {x,y}
    - size {r}

- 
*/

//global declarations: 
let cells = []; 
const cellWidth = 10; //this is also the same width for the ink particles. 
let cellHeight = 0; 
const capacity = 2; //this is the capacity of what each cell can store. 

let inkMolecules = []; 

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
for (let x = 0+cellWidth/2; x<=width-cellWidth/2; x+=cellWidth){
cells.push(new Cell (x, 0+cellHeight/2, cellWidth, cellHeight)); 
}
}

function createInk(){
// create ink molecules

for (let y = cells[0].y-(cellHeight/2)+cellWidth/2; y<=cellHeight-cellWidth/2; y+=cellWidth){
inkMolecules.push(new InkMolecule(cells[0].x, y)); 
}

}

function draw() {
cellFunctions(); 
inkFunctions(); 

noLoop();
}

function cellFunctions(){
for (cell of cells){
cell.display(); 
cell.checkContents(); 
}
}

function inkFunctions(){
for (molecule of inkMolecules){
molecule.display(); 
}
}

//cell object. 
class Cell{
constructor(x, y, w, h){
this.x = x; 
this.y = y; 
this.w = w; 
this.h = h; 

this.capacity = capacity; 
}

display(){
stroke (0);
strokeWeight (1); 
noFill(); 

rect (this.x, this.y, this.w, this.h);
}

checkContents(){
//this checks how many ink molecules are inside each cell and stores them in an array. i use simple bounding box detection for this. 

this.inkInside = []; 

for (let i = 0; i<inkMolecules.length; i++){
let molecule = inkMolecules [i]; 

if (
molecule.x >= this.x - this.w / 2 &&
molecule.x < this.x + this.w / 2 &&
molecule.y >= this.y - this.h / 2 &&
molecule.y < this.y + this.h / 2
) {
this.inkInside.push(i);
}
}
}

}

//ink particle object. 
class InkMolecule{
constructor(x, y, d = cellWidth){
this.x = x; 
this.y = y; 
this.d = d; 
}

display(){
noStroke(); 

fill (0); 
square (this.x, this.y, this.d); 
}

}

/*
checkContents(){
//this checks how many ink particles are inside each cell and stores which of them are inside, in an array.
this.inkInside = []; 

for (let i = 0; i<inkMolecules.length; i++){
if (inkMolecules[i].x<this.x+this.w && inkMolecules[i].x>this.x){
this.inkInside.push(i); 
}
}

if (this.inkInside.length>this.capacity){
this.inkInside.splice(0, this.capacity);

console.log(this.inkInside);

for (let i = 0; i<this.inkInside.length; i++){
let particleIndex = this.inkInside[i]; 
inkMolecules[particleIndex].move(); 
}
}
}
*/