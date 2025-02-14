// inkblot_2d_mathematical; February 2025.
// Converted from 1D to 2D with faster offloading.

let cells = [];
const cellSize = 2; // Square cells
const capacity = 255;
let numRows, numCols;

let inkMolecules = [];
let numOfInkMolecules = 1000;

function setup() {
    createCanvas(500, 500, WEBGL); // Square canvas for simplicity
    numCols = width / cellSize;
    numRows = height / cellSize;
    rectMode(CENTER);
    background(255);
    createSurface();
    createInk();
}

function createSurface() {
    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {
            cells.push(new Cell(x, y));
        }
    }
    for (let cell of cells) {
        cell.findNeighbours();
    }
}

function createInk() {
    for (let i = 0; i < numOfInkMolecules; i++) {
        inkMolecules.push(new InkMolecule(width/2, height/2));
    }

}

function draw() {

    translate (-width/2, -height/2); 
    cellFunctions();
    filter(INVERT);
}

function cellFunctions() {
    for (let cell of cells) {
        cell.display();
        cell.checkContents();
        cell.offloadInk();
    }
}

class Cell {
    constructor(gridX, gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * cellSize + cellSize / 2;
        this.y = gridY * cellSize + cellSize / 2;
        this.capacity = capacity;
        this.inkInside = [];
        this.excessInk = [];
        this.neighbours = [];
        this.c = 255;
    }

    findNeighbours() {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                let nx = this.gridX + dx;
                let ny = this.gridY + dy;
                if (nx >= 0 && nx < numCols && ny >= 0 && ny < numRows) {
                    this.neighbours.push(cells[ny * numCols + nx]);
                }
            }
        }
    }

    display() {
        fill(this.inkInside.length);
        noStroke();
        rect(this.x, this.y, cellSize, cellSize);
    }

    checkContents() {
        this.inkInside = inkMolecules.filter(molecule =>
            molecule.x >= this.x - cellSize / 2 &&
            molecule.x < this.x + cellSize / 2 &&
            molecule.y >= this.y - cellSize / 2 &&
            molecule.y < this.y + cellSize / 2
        );

        this.excessInk = this.inkInside.length > this.capacity ?
            this.inkInside.slice(this.capacity) : [];
    }

    offloadInk() {
        if (this.excessInk.length > 0) {
            for (let ink of this.excessInk) {
                let target = random(this.neighbours);
                ink.move(target.x, target.y, 0.5); // Increased movement speed
            }
        }
    }
}

class InkMolecule {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(destX, destY, speed = 0.1) {
        this.x = lerp(this.x, destX, speed);
        this.y = lerp(this.y, destY, speed);
    }
}

function mouseClicked(){
    for (let i = 0; i < numOfInkMolecules; i++) {
        inkMolecules.push(new InkMolecule(mouseX, mouseY));
    }
}
