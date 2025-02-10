//inkblot_1d_v2; february 2025. 

/*
approach: 

- there is a 'surface' (paper) that has many 'cells'. in code, the screen is the surface and the cells are defined in 'class Cell'.
  - each cell has:
  - position {x,y} on the surface
  - size {w,h} (we assume a 'cell' is rectangular)
  - capacity (how much of something can it hold) - eg: if the paper is thick, it could hold more, else it allows to spread the ink faster
  - ability to find its adjacent neighbours (left/right)
  - ability to send an ink particle to a neighbouring cell (this should technically be the surface's property, but anyhow). 


an ink molecule has:
  - position {x,y}
  - size {h}, which is the same as the cell height
  - the ability to move to a new destination position

-----

Ink Molecule
The ink molequle is a unit of the ink liquid that has certain properties. Multiple ink molequles combine to form ink liquid
- spill_quantity: how much ink to be spilt (on a surface)
- move: the ability for it to move from one point to another (on a surface)
- coordinates: the position of a molecule on an x, y coordinate system
- viscocity, this will determine how think the liquid is. Here, it will help define how fast or slow it will spread
- dimensions: the shape of the molequle and with dimensions (height, width or radius etc.)
- colour: the colour of the ink, including transparency

Ink Liquid
This is multiple ink molequles put together to form liquid
- total_quantity: how much ink do we have

Surface / Material
The surface on which the liquid falls on. This can be paper or cloth. The surface will have certain properties like:
- dimension: the dimensions of the surface, how big is the surface (width & height)
- capacity/absorbtion: how much liquid each unit of surface can hold or absorb


The Event / The Drop / The Spill
The unit of time at which the ink meets the surface. There are certain events that are triggered when this happens
- spreading: depending on how much a unit of surface can hold liquid, determine flow rate.
// - spread_speed: how fast or slow can a liquid spread across its surface
// - spread_direction: in which direction(s) can a liquid spread on its surface

*/

class InkMolecule {
  constructor({ x, y, w = width, h = height, viscosity = 0.3 }) {
    this.viscosity = viscosity
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.colour = [0, 0, 139]
  }

  // TODO: this.destinationX is not defined
  /**
   * given a destination coordinate, move molecule to that coordinate
   * @param {array} dest - coordinates of a point
   * @returns {array}
   */
  move(dest) {
    this.x = (abs(this.x - this.destinationX) < 0.1) ? dest : lerp(this.x, dest, 0.1)
  }
  
  /**
   * display the molecule
   */
  display() {    
    noStroke()
    fill(...this.colour, 4)
    rect(this.x, this.y, this.width, this.height)
  }
}

/**
 * A cell is a unit of a surface. A surface is made up of multiple cells across
 * two dimensions i.e. like a grid that is made of up of `rect`
 * 
 */
class Cell {

  /**
   * Each cell component as a larger part of the surface will contain
   * certain properties
   * @param {int} x - x position of the cell
   * @param {int} y - y position of the cell
   * @param {int} w - widh of the cell
   * @param {int} h - height of the cell
   */
  constructor({x, y, w, h, index, capacity = 1}) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.index = index
    this.capacity = capacity    // total capacity to hold quantity of molecules
    this.contains = []          // contains how many molecules in it (array of `molecule` objects)

    // this.inkInside = []
    // this.excessInk = []
    this.leftNeighbour = null
    this.rightNeighbour = null
  }

  /**
   * displays the surface on canvas
   */
  display() {
    stroke(0)
    strokeWeight (1) 
    noFill() 
    rect(this.x, this.y, this.w, this.h);
  }

  /**
   * given a quantity, check if the quantity exceeds the cells capacity and return
   * true or false
   * 
   * @param {int} q - quantity
   * 
   * @returns {bool} - true, if it exceeds, false otherwise
   */
  exceedsCapacity(q) {
    return (q > this.capacity)
  }
}


/**
 * Given a dimension of the surface cell, create a mesh/grid surface of these dimensions & pushes
 * into a `cells` array
 * 
 * @param {int} cellWidth - this is the width of each cell of the surface. Defaults to `10`
 * @param {int} cellHeight - this is the height of each cell of the surface. Defaults to the `height` of the canvas
 * @returns {arr} cells - an array of the mesh/grid of the surface
 */
function createSurface(cellWidth = 10, cellHeight = height) {
  let cells = []
  for(let i = 0, x = cellWidth / 2; x <= width - cellWidth / 2; x += cellWidth, i++) {
    cells.push(new Cell({
      x: x,
      y: cellHeight / 2,
      w: cellWidth,
      h: cellHeight,
      index: i
    }))
  }
  return cells
}

/**
 * Given a surface, creates molecules of ink on the surface
 * 
 * @param {arr} cells - the mesh/grid of all the cells created
 * @param {int} n - number of molecules to create. Defaults to 100
 * 
 * @returns {arr} molecules - an array of molecules
 */
function pour(cells, n = 100) {
  let molecules = []
  for(let i = 0; i < n; i++) {
    molecules.push(new InkMolecule({
      x: cells[cells.length / 2].x,
      y: cells[cells.length / 2].y
    }))
  }
  return molecules
}

//cell object. 
// class Cell {
//   constructor(x, y, w, h, index){
//     this.x = x; 
//     this.y = y; 
//     this.w = w; 
//     this.h = h; 
    
//     this.capacity = capacity; 
//     this.inkInside = []; 
//     this.excessInk = []; 
    
//     this.index = index; 
//     this.leftNeighbour = null;
//     this.rightNeighbour = null; 
//   }
  
//   //cells find their neighbours on the surface. 
//   findNeighbours(){
//     if (this.index>0){
//       this.leftNeighbour = cells[this.index - 1]; //left cell
//     }
//     if (this.index < cells.length - 1) {
//       this.rightNeighbour = cells[this.index + 1]; // right cell
//     }
    
//   }
  
//   display(){
//     stroke (0);
//     strokeWeight (1); 
//     noFill(); 
    
//     rect (this.x, this.y, this.w, this.h);
//   }
  

//   // checking whether an inkmolecule is inside this cell or not
//   checkContents(){
//     //this checks how many ink molecules are inside each cell and stores them in an array. i use simple bounding box detection for this. 
    
//     this.inkInside = []; 
    
//     for (let molecule of inkMolecules){
//       if (
//         molecule.x >= this.x - this.w / 2 &&
//         molecule.x < this.x + this.w / 2 &&
//         molecule.y >= this.y - this.h / 2 &&
//         molecule.y < this.y + this.h / 2
//       ) {
//         this.inkInside.push(molecule);
//       }
//     }
    
//     //check whether the cell has too much ink. 
//     if (this.inkInside.length> this.capacity){
//       this.excessInk = this.inkInside.slice(this.capacity); //make a new array for all the extra ink. 
//     }else{
//       this.excessInk = []; //reset the excessInk to zero if there's nothing left. 
//     }
    
//   }
  
//   offloadInk(){
//     if (this.excessInk.length>1){
//       for (let excessInkMolecule of this.excessInk){
//         let prob = random(0,1); 
        
//         if (prob<0.5){
//           excessInkMolecule.move(this.rightNeighbour.x); 
//         }else{
//           excessInkMolecule.move(this.leftNeighbour.x); 
//         }
//       }
//     }
    
//   }
// }


// ----------

let surface, molecules;

function setup() {
  // default settings
  createCanvas(1000, 562)     // in 16:9 aspect ratio
  rectMode(CENTER)
  background(255)             // the background only needs to be drawn once

  surface = createSurface(10, height)
  molecules = pour(surface)   // pour the molecules on the surface

  // ideally, it should be molecules.pour(surface)
}

function draw() {
  // for each cell of the surface, check if its capacity exceeds the quantity of ink, spilt on it, if it does, move the excess ink to the the neighbouring cells
  

  for(let cell of surface) {
    // cell.display()
    cell.checkContents(molecules)

    // here I should be able to decide whether to offload the ink or not from a call
    // cell.offloadInk() 
  }

  // display all molecules
  molecules.map((m) => m.display())
}