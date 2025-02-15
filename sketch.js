//global declarations:
const seed = 1000000 // units dropped on one pixel at the start
const cappp = 128 // units (capacity) per pixel
const maxtr = 8 // max units that can be transferred into any pixel at once
const delta = 64 // units get transferred only when 𝚫 between pixels is > this

let startingink = 0

let cell = []

function setup() {
    createCanvas(200, 200);
    background(255);

    for (y = 0; y < height; ++y) {
        for (x = 0; x < width; ++x) {
            cell.push(new Cell(x, y, startingink))
        }
    }

    // drop seed ink
    cell[atpos(width / 2, height / 2)].ink = seed

}

function draw() {
    background(255);

    for (y = 0; y < height; ++y) {
        for (x = 0; x < width; ++x) {
            cell[atpos(x, y)].math()
            cell[atpos(x, y)].display()
        }
    }
    console.log(frameRate())
} 

/* HELPERS */

class Cell {
    constructor(x, y, ink) {
        this.x = x
        this.y = y
        this.ink = ink
    }

    math() {
        this.ink = this.ink < 255 ? this.ink++ : 0
    }

    display() {
        noStroke()
        fill(random(255)) // TODO: make sure this value stays between 0 and 255
        // rect(this.x, this.y, 1, 1)
    }
}

function atpos(x, y) {
    return floor(x) + floor(y) * width
}