//global declarations: 

let cells = []; 
let cellWidth = 50; 

function setup(){
createCanvas(1000,562); 
createSurface(); 
}

function createSurface(){
for (let x = 0; x<width; x+=cellWidth){
cells.push(new Cell(x, 0, cellWidth)); 
}
}

function draw(){
background (255); 

for (let cell of cells){
cell.display(); 
}

}

class Cell{
constructor(x, y, w, h = height){
this.x = x; 
this.y = y; 
this.w = w; 
this.h = h; 
}

display(){
strokeWeight(1); 
stroke (0); 
rect (this.x, this.y, this.w, this.h); 
}

offload(){

}

}