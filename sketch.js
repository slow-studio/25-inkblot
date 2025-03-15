//ink-blotting, with math; march, 2024.
//contributors: arjun, shobhan & vivek.

let paper = []; // a virtual array where each element corresponds to one-pixel on the screen.
let all_neighbours = {}; //an object that stores the neighbours for each index.

let min_seed = 1000000; // minimum seed that has to be dropped.
let max_seed = 1000000000; //maximum seed that can be dropped.

/**
 * sets up the surface, changes the pixel density of the display to zero, initialises the paper array and drops ink at positions. default p5 function.
 * @setup
 */
function setup() {
  createCanvas(200, 200);
  pixelDensity(1); //always treat one-pixel as one-pixel in higher density displays.
  loadPixels();

  //feed an initial value of 0 to the virtual array, so that each element corresponds to one-pixel on the screen and it draws a white screen.
  for (let i = 0; i < width * height; i++) {
    paper.push(0);
  }

  for (let i = 0; i < paper.length; i++) {
    all_neighbours[i] = get_neighbours(i);
  }

  drop_ink(width / 2, height / 2, int(random(min_seed, max_seed)));
}

/**
 * drops ink on a position.
 * @helper
 * @param {int} x — x coordinate of the ink.
 * @param {int} y — y coordinate of the ink.
 * @param {int} seed — amount of ink dropped.
 */
function drop_ink(x, y, seed) {
  //drops ink on the paper and displays it on the screen.

  //get the index of the fed-in position.
  let centerIndex = pos(x, y);

  //change value of elements in paper-array.
  paper[centerIndex] = seed;

  //update visually:
  change_rgba(centerIndex, paper[centerIndex]);
}

let fr = [];

/**
 * draws on the screen, every frame (typically 60 frames / second). default p5 function.
 * loads pixels, performs the computation and updates the pixels.
 * @draw
 */
function draw() {
  for (let i = 0; i < paper.length; i++) {
    // blot ink from each pixel in paper to its neighbours:
    blot(i);
    change_rgba(i, paper[i]);
  }
  updatePixels();

  // fr.push(frameRate())
  // let frl = fr.length
  // if ((fr[frl-1] + fr[frl-2] + fr[frl-3])/3 < 30)
  //   debugger;

  console.log(`${frameCount} and ${frameRate()}`);
}

/**
 * blotting function.
 * @param {int} index — the index of the paper array to perform the blotting on.
 */
const capacity = 255; //there is a fixed capacity of 255 for each cell.
const rate = 40000; //rate at which ink is spread.
function blot(index) {
  //we check how much ink we have.
  let ink = paper[index];

  let offload_desired = ink - capacity; //this is how much the cell wants to give.

  //we find all neighbours first.
  let neighbours = all_neighbours[index];

  if (ink > capacity) {
    //∴ there's a desire to offload. so, we offload the ink.

    //then, we find the difference between what the cell has and its neighbours.
    let raw_differences = [];

    for (let i = 0; i < neighbours.length; i++) {
      if (paper[index] > paper[neighbours[i]]) {
        //it's a positive difference, so store it as is.
        raw_differences.push(paper[index] - paper[neighbours[i]]);
      } else {
        //it's a negative difference, so store zero.
        raw_differences.push(0);
      }
    }

    //now, see how much the total demand is, by adding all the differences.
    let total_demand = 0;

    for (let i = 0; i < raw_differences.length; i++) {
      total_demand += raw_differences[i];
    }

    //however, even if the demand is a lot, the surface can only give so much. so, the amount of ink to go has to be limited.
    let ink_to_give = Math.min(total_demand, rate, offload_desired); //in one instance, don't give more than 200.

    //now, we go to each neighbour and we give it the relevant ink.

    for (let i = 0; i < neighbours.length; i++) {
      if ([i] == 1 || [i] == 4 || [i] == 6 || [i] == 3) {
        //this is an edge cell.

        //so, give it 97% of what it can actually get.
        let to_give = 0;
        to_give = ink_to_give * (raw_differences[i] / total_demand) * 0.97;

        paper[index] -= to_give;
        paper[neighbours[i]] += to_give;
      } else {
        //this is a corner cell.

        //so, give it 54% of what it can actually get.
        let to_give = 0;
        to_give = ink_to_give * (raw_differences[i] / total_demand) * 0.54;

        paper[index] -= to_give;
        paper[neighbours[i]] += to_give;
      }
    }
  }

  for (let i = 0; i < neighbours.length; i++) {
    if (
      paper[index] > paper[neighbours[i]] + paper[index] / 16 &&
      paper[index] / paper[neighbours[i]] > 1.1
    ) {
      paper[index] -= 1;
      paper[neighbours[i]] += 1;
    }
  }
}

/**
 * finds neighbour-pixels for an index.
 * @helper
 * @param {index} index
 * @returns an array of neighbour-indices.
 */
function get_neighbours(index) {
  //returns an array of neighbour-indices.
  let neighbours = [];

  //we calculate naighbours based on the x, y position and not the index (because the index is one-dimensional.
  //so, we convert the index to x, y coordinates again:
  let indexCoordinate = inversePos(index);
  let x = indexCoordinate[0];
  let y = indexCoordinate[1];

  //list all 8 neighbour-possibilities for a position:
  let potentialNeighbours = [
    [x - 1, y - 1], // top-left.
    [x, y - 1], // top.
    [x + 1, y - 1], // top-right.
    [x + 1, y], // right.
    [x + 1, y + 1], // bottom-right.
    [x, y + 1], // bottom.
    [x - 1, y + 1], // bottom-left.
    [x - 1, y], // left.
  ];

  //console.log(`neighbour positions of ${index} are ${potentialNeighbours}`); //debug-comment to check potential neighbour output.

  //filter out-of-bounds positions:
  for (let i = 0; i < potentialNeighbours.length; i++) {
    //a neighbour is out-of-bounds if it is beyond the canvas dimensions.

    let nx = potentialNeighbours[i][0];
    let ny = potentialNeighbours[i][1];

    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      neighbours.push(pos(nx, ny));
    }
  }

  //console.log(`neighbours for ${index} are indices: ${neighbours}`); //debug-comment to check neighbours.

  return neighbours;
}

/**
 * finds the index-number in the paper array for a position on the screen.
 * @helper
 * @param {int} x — x-coordinate on the screen.
 * @param {*} y — y-coordinate on the screen.
 * @returns the index number in the paper array.
 */
function pos(x, y) {
  //returns a valid index-number for a given position.
  let element = floor(x) + floor(y) * width;
  // console.log(`pos(${x}, ${y}) found element ${element}.`)

  if (element <= paper.length) {
    return element;
  } else {
    return null;
  }
}

/**
 * finds the x & y coordinate for an index-number in the paper array.
 * @helper
 * @param {int} index — index-number from the paper array.
 * @returns the x & y coordinate on the screen.
 */
function inversePos(index) {
  //returns x & y coordinates for an index-position.
  let x = floor(index % width);
  let y = floor((index - x) / width);

  // console.log(`inverse-pos for index ${index} is ${x}, ${y}.`)

  return [x, y];
}

/**
 * changes rgba values in the p5.pixels array.
 * @helper
 * @param {int} index — index-number from the paper array.
 * @param {float} c — rgb value.
 */
function change_rgba(index, c = 255) {
  //changes RGBA values for an index position, using the p5.pixels array.
  c = constrain(c, 0, 255);
  index *= 4;
  pixels[index + 0] = pixels[index + 1] = pixels[index + 2] = 255 - c;
  pixels[index + 3] = 255;
}
