//inkblot-base, with only math; february 2025.
/**
 * ref: https://www.youtube.com/watch?v=nMUMZ5YRxHI&t=463s
 */

let seed = 10000000000; // the amount of ink to drop on the paper
let paper; // a virtual array where each element corresponds to one-pixel on the screen

function setup() {
  createCanvas(100, 100);
  pixelDensity(1); // always treat one-pixel as one-pixel in higher density displays
  background(0);

  // create paper array, the size of the canvas
  paper = [...'0'.repeat(width * height).split('').map(a => int(a))]

  // console.log(`set up ${paper.length} pixels on paper.`); //debug-comment to check how many items get created in paper.
  dropInk(random(width), random(height)); // start by dropping at the center
}

function draw() {
  background(100);

  loadPixels(width/2, height/2)
  for(let i = 0; i < paper.length; ++i) {
    // blot ink from each pixel in paper to its neighbours:
    shobhans_blot(i)
    // arjuns_blot(i)
  }
  for (let i = 0; i < paper.length; i++) {
    //display the blot:
    changeRGBA(i, paper[i]);
  }
  updatePixels();
}

/**
 * given a position, this function will drop ink on the paper and display it on the screen.
 */
function dropInk(pos_x, pos_y) {
  // drop ink (seed) on the paper at the position
  paper[pos(pos_x, pos_y)] = seed;

  // console.log(`paper-pixel at (${pos_x}, ${pos_y}) has ${seed} ink units dropped on it.`); //debug-comment to check how many units of ink have been dropped on which position.

  //update visually:
  loadPixels();
  let indexofseed = pos(pos_x, pos_y);
  changeRGBA(indexofseed, paper[indexofseed]);
  updatePixels();
}

//drawing functions:
function arjuns_blot(index) {
  const deltaChecker = 0; //required difference between cells to offload ink.
  const rate = 5; //number of ink-particles to release in one go.

  //first, get its neighbours:
  let neighbours = getNeighbours(index);

  for (let i = 0; i < neighbours.length; i++) {
    if (paper[index] > paper[neighbours[i]]) {
      //first, if the cell has more than neighbour, then think about offloading.

      if (paper[index] - paper[neighbours[i]] > deltaChecker) {
        //now, look at the delta between what the cell has and the neighbour. if it is above a threshold, then prepare to offload.

        //offload:
        paper[index] -= rate; //the cell loses.
        paper[neighbours[i]] += rate; //the neighbour gains.
      }
    } else {
      return;
    }
  }
}

/**
 * given an index, this function will distribute ink from the pixel at that index to its neighbours
 * 
 * @param {int} index - index of the pixel in the paper array
 * @returns {void} - updates the `paper` array
 */
function shobhans_blot(index) {
  const step = 10;

  //first get neighbours:
  let neighbours = getNeighbours2(index);

  for(let i = 0; i < neighbours.length; i++) {
    if(paper[index] > paper[neighbours[i]] + step + 1) {
      paper[index] -= step;
      paper[neighbours[i]] += step;
    }
  }
}

/**
 * given an index, this function will return an array of indices of the neighbours of the pixel at that index
 * 
 * @param {*} index - index of the pixel in the paper array
 * @param {int} r - radius of the neighbours
 * @returns {array} - array of indices of the neighbours of the `index` pixel
 */
function getNeighbours(index, r = 5) {
  const neighbours = [];
  const [x, y] = inversePos(index)

  // matrix of neighbours
  const potentialNeighbours = [
    [x - r, y - r],     [x, y - r],     [x + r, y - r],
    [x - r, y],         /* [x, y] */    [x + r, y],
    [x - r, y + r],     [x, y + r],     [x + r, y + r]
  ];

  // for each potential neighbour, check if it is within the bounds of the canvas
  for(const [nx, ny] of potentialNeighbours) {
    if(nx >= 0 && nx < width && ny >= 0 && ny < height) {
      neighbours.push(pos(nx, ny));
    }
  }

  return neighbours;
}

/**
 * given an index, this function will return an array of indices of the neighbours of the pixel at that index
 * the difference here between this and getNeighbours is that this function uses a nested loop to get the neighbours and
 * iterates on every pixel in the radius of `r` from the pixel at `index`, where as the other function uses a matrix and
 * thus, jumps to the neighbours directly. thus, creating a slightly different effect.
 * 
 * @param {int} index
 * @returns {array} an array of indices of `neighbours` of the pixel at that index
 */
function getNeighbours2(index, r = 5) {
  const neighbours = [];
  const [x, y] = inversePos(index);

  // for each neighbour, check if it is within the bounds of the canvas (from negative to positive i.e. left to right)
  for(let i = -r; i <= r; i++) {        // horizontally
    for(let j = -r; j <= r; j++) {      // vertically
      if(i === 0 && j === 0) continue   // skip the center point [x, y]
      const nx = x + i
      const ny = y + j
      if(nx >= 0 && nx < width && ny >= 0 && ny < height) {
        neighbours.push(pos(nx, ny))
      }
    }
  }

  return neighbours;
}

/**
 * given x, y coordinates,
 * 
 * @param {int} x - x position of the pixel
 * @param {int} y - y position of the pixel
 * @returns {int} - index of the pixel in the paper array
 */
function pos(x, y) {
  let elem = floor(x) + floor(y) * width;
  return (elem <= paper.length) ? elem : null;
}

function inversePos(index) {
  //returns x & y coordinates for an index-position.
  let x = floor(index % width);
  let y = floor((index - x) / width);

  // console.log(`inverse-pos for index ${index} is ${x}, ${y}.`)

  return [x, y];
}


/**
 * given an index, this function will change the RGBA values of the pixel at that index
 * 
 * @param {int} index - index of the pixel in the paper array
 * @param {*} a - alpha value for the pixel
 * @returns {void} - updates the `pixels` array
 */
function changeRGBA(index, a = 255) {
  // changes RGBA values for an index position, using the p5.pixels array.
  index *= 4;
  pixels[index + 0] = pixels[index + 1] = pixels[index + 2] = a > 255 ? 0 : 255 - a;
  pixels[index + 3] = 255;
}
