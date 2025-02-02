//inkBlot_1d; february, 2025. 

//shobhan explained his logic for the ink blot and asked me to create a one-dimensional simulation. 

/*
approach: 

- there is going to be a 'surface' that is comprised of many 'cells'. 
- since it's a one-dimensional surface, the cells will be arranged from left to right.

- each cell has: 
    - position (x,y)
    - size (w,h)
    - capacity (how much of something can it store)
    - the ability to tell each ink particle inside it to move. 

- then, there's also an 'ink particle'. an ink particle has:
    - position (x,y)
    - size (r)
    - move function (which is called by the cell). parameters there: 
        - destination position (destX, destY)
        - speed 
        - condition to stop moving / marker to tell the cell that it has moved. 

cells and ink particles talk to each other. the cell tells the particle to move, the particle tells the cell that it has moved. 
*/

let cells = []; 
const cellWidth = 10; //this is also the same width for the ink particles. 
const capacity = 2; //this is the capacity of what each cell can store. 

let inkParticles = []; 

function setup() {
createCanvas(1000, 562); //in 16:9 aspect ratio.
background(255); //the background only needs to be drawn once.  

//create cell & ink
for (let x = 0; x<=width; x+=cellWidth){
cells.push(new Cell (x, 0, cellWidth, height)); 
}
for (let y = 0+cellWidth/2; y<=height-cellWidth/2; y+=cellWidth){
inkParticles.push(new InkParticle(cells[0].x+cellWidth/2, y, cellWidth)); 
}

}

function draw() {

for (cell of cells){
cell.display(); 
setTimeout(cell.checkContents(), 50000); 
}

for (inkParticle of inkParticles){
inkParticle.display(); 
}

//noLoop(); 
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
//this checks how many ink particles are inside each cell and stores which of them are inside, in an array.
this.inkInside = []; 

for (let i = 0; i<inkParticles.length; i++){
if (inkParticles[i].x<this.x+this.w && inkParticles[i].x>this.x){
this.inkInside.push(i); 
}
}

if (this.inkInside.length>this.capacity){
this.inkInside.splice(0, this.capacity);

console.log(this.inkInside);

for (let i = 0; i<this.inkInside.length; i++){
let particleIndex = this.inkInside[i]; 
inkParticles[particleIndex].move(); 
}
}else{
console.log("don't move"); 
}

}

}

//ink particle object. 
class InkParticle{
constructor(x, y, r){
this.x = x; 
this.y = y; 
this.r = r; 
}

display(){
strokeWeight (this.r); 
stroke (0); 
point (this.x, this.y); 
}

move(){

this.x = lerp(this.x, this.x+cellWidth*2, 0.005);
}
}