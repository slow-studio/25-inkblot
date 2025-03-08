//ink-blotting, with math; march, 2025.

let paper = []; // a virtual array where each element corresponds to one-pixel on the screen.

let textToPoints = [];
let font;
let font2;

function preload() {
  font = loadFont("IBMPlexSerif-Regular.ttf");
  font2 = loadFont("IBMPlexSans-Light.ttf");
}

function setup() {
  createCanvas(1000, 1000);
  pixelDensity(1); //always treat one-pixel as one-pixel in higher density displays.

  //create type:
  push();
  fill(0);
  rectMode(CENTER);
  textToPoints = convertLetterToPoints(
    `"this is the worst we've seen. \n there are no military targets here."`,
    width / 2,
    height / 2 - 15,
    width,
    height,
    5,
    54,
    font,
    CENTER,
    CENTER
  );
  pop();

  background(255);

  //feed an initial value to the virtual array, so that each element corresponds to one-pixel on the screen.
  for (let i = 0; i < width * height; i++) {
    paper.push(0);
  }
}

//i'm going to drop ink in a circle and see if that meets my need of realism.

function dropInk(x, y, seed) {
  //drops ink on the paper and displays it on the screen.

  //get an index, and also get neighbouring indices.
  let centerIndex = pos(x, y);
  let neighbours = getNeighbours(centerIndex);

  //change value of elements in paper-array.
  paper[centerIndex] = seed;

  for (i = 0; i < neighbours.length; ++i) {
    paper[neighbours[i]] = seed;
  }

  //update visually:
  loadPixels();
  changeRGBA(centerIndex, paper[centerIndex]);
  for (i = 0; i < neighbours.length; ++i) {
    changeRGBA(neighbours[i], paper[neighbours[i]]);
  }
  updatePixels();
}

function draw() {
  //background(100);

  if (frameCount % 180 == 0) {
    let n = int(random(0, textToPoints.length));
    let seed = int(random(10000, 100000000000));
    dropInk(textToPoints[n].x, textToPoints[n].y, seed);
  }

  loadPixels();
  for (let i = 0; i < paper.length; ++i) {
    // blot ink from each pixel in paper to its neighbours:
    arjuns_blot(i);
  }
  for (let i = 0; i < paper.length; i++) {
    //display the blot:
    changeRGBA(i, paper[i]);
  }
  updatePixels();

  push();
  fill(0);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  textSize(54);
  textFont(font);
  text(
    `"this is the worst we've seen. \n there are no military targets here."`,
    width / 2,
    height / 2 - 15,
    width,
    height
  );

  pop();

  push();
  textAlign(RIGHT);
  fill(50);
  textFont(font2);
  text("- Marie Colvin, killed in 2012.", width - 50, height - 50);
  pop();
}

//drawing functions:
function arjuns_blot(index) {
  //first you check if it has ink. if not, leave.

  if (paper[index] > 0) {
    //if the paper has ink, it will absorb some ink.
    const capacity = 10;
    let inkToSpread = paper[index] - capacity;

    //then it finds its neighbours.

    let neighbours = getNeighbours(index);

    //const maxTransfer = 100;
    // let maxTransfer = map(noise(frameCount),);
    let maxTransfer = random(20, 100);

    //then, it runs through all neighbours and checks what the difference between them is.
    for (i = 0; i < neighbours.length; i++) {
      //is there more ink?
      if (inkToSpread > paper[neighbours[i]] + maxTransfer) {
        //calculate how much to send:

        //now pick the edges.

        if (neighbours[i] % 2 == 1) {
          //odd (or edges)
          let toGive = Math.min(
            inkToSpread - paper[neighbours[i]],
            maxTransfer
          );
          paper[index] -= toGive;
          paper[neighbours[i]] += toGive;
        } else {
          //even (or corners)
          let toGive = Math.min(
            inkToSpread - paper[neighbours[i]],
            maxTransfer / 3
          );
          paper[index] -= toGive;
          paper[neighbours[i]] += toGive;
        }
      }
    }
  }
}

function shobhans_blot(index) {
  const step = 10;

  //first get neighbours:
  let neighbours = getNeighbours(index);

  for (let i = 0; i < neighbours.length; i++) {
    if (paper[index] > paper[neighbours[i]] + step + 1) {
      paper[index] -= step;
      paper[neighbours[i]] += step;
    }
  }
}

//helper-functions:
function getNeighbours(index) {
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

function inversePos(index) {
  //returns x & y coordinates for an index-position.
  let x = floor(index % width);
  let y = floor((index - x) / width);

  // console.log(`inverse-pos for index ${index} is ${x}, ${y}.`)

  return [x, y];
}

function changeRGBA(index, a = 255) {
  //changes RGBA values for an index position, using the p5.pixels array.
  index *= 4;
  pixels[index + 0] =
    pixels[index + 1] =
    pixels[index + 2] =
      a > 255 ? 0 : 255 - a;
  pixels[index + 3] = 255;
}
