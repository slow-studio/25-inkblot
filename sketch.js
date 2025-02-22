//inkblot, but only with math; february 2025.

let seed = 1000000;
let posforseed_x, posforseed_y;
let paper = []; // a virtual array where each element corresponds to one pixel on the screen.

function setup() {
  createCanvas(10, 5);
  pixelDensity(1); //always treat one-pixel as one-pixel in higher density displays.

  background(255);

  for (let i = 0; i < width * height; ++i) {
    paper.push(0);
  }
  console.log(`set up ${paper.length} pixels on paper.`);

  posforseed_x = width / 2;
  posforseed_y = height / 2;
  paper[pos(posforseed_x, posforseed_y)] = seed;
  console.log(
    `paper-pixel at (${posforseed_x}, ${posforseed_y}) has ${seed} ink units dropped on it.`
  );

  loadPixels();

  let indexofseed = pos(posforseed_x, posforseed_y);
  console.log(`paper at ${indexofseed} holds value = ${paper[indexofseed]}`);
  changeRGBA(indexofseed, paper[indexofseed]);

  updatePixels();

  console.log(getNeighbours(0));
}

function draw() {
  // noLoop();
  // background(255);
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

function getNeighbours(index) {
  let neighbours = [];

  let indexCoordinate = inversePos(index);
  let x = indexCoordinate[0],
    y = indexCoordinate[1];

  let positions = [
    pos(x - 1, y - 1), // top-left
    pos(x, y - 1), // top
    pos(x + 1, y - 1), // top-right
    pos(x + 1, y), // right
    pos(x + 1, y + 1), // bottom-right
    pos(x, y + 1), // bottom
    pos(x - 1, y + 1), // bottom-left
    pos(x - 1, y), // left
  ];


  // Filter out out-of-bounds positions
  for (let i = 0; i < positions.length; i++) {
    let nx = x + [-1, 1, 0, 0, -1, 1, -1, 1][i]; // x-offsets
    let ny = y + [0, 0, -1, 1, -1, -1, 1, 1][i]; // y-offsets

    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      neighbours.push(positions[i]);
    }
  }
console.log(positions);

  return neighbours;
}

function dropInk(x, y, quantity) {
  changeRGBA(pos(x, y), quantity > 255 ? 255 : quantity);
}

function pos(x, y) {
  let element = floor(x) + floor(y) * width;
  // console.log(`pos(${x}, ${y}) found element ${element}.`)
  return element;
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
